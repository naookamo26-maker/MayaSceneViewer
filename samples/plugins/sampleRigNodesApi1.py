# -*- coding: utf-8 -*-
"""変換ツール（python -m ma_viewer convert-plugin）の検証用の、Python API 1.0（OpenMayaMPx）のノードプラグイン。

  * legacySum   : 配列の入力を MArrayDataHandle の elementCount と next でたどる合計（× gain）
  * vectorLength: double3 の入力（子の属性 inVectorX〜Z）の長さと、正規化したベクトル
  * matrixOffset: 型つきの行列の属性（MFnTypedAttribute・MFnData.kMatrix）。MFnMatrixData で読み書きし、
                  入力の行列の移動に offset を足す（mode = 1 なら引く。mode は MPlug の asShort で読む）。
                  入力のデータがなければ（isNull）何もしない
"""
import sys

import maya.OpenMaya as OpenMaya
import maya.OpenMayaMPx as OpenMayaMPx

kSumName = "legacySum"
kSumId = OpenMaya.MTypeId(0x0012F010)
kLengthName = "vectorLength"
kLengthId = OpenMaya.MTypeId(0x0012F011)
kOffsetName = "matrixOffset"
kOffsetId = OpenMaya.MTypeId(0x0012F012)


class LegacySum(OpenMayaMPx.MPxNode):
    aValues = OpenMaya.MObject()
    aGain = OpenMaya.MObject()
    aResult = OpenMaya.MObject()

    def __init__(self):
        OpenMayaMPx.MPxNode.__init__(self)

    def compute(self, plug, dataBlock):
        if plug == LegacySum.aResult:
            gain = dataBlock.inputValue(LegacySum.aGain).asFloat()
            arrayHandle = dataBlock.inputArrayValue(LegacySum.aValues)
            total = 0.0
            for i in range(arrayHandle.elementCount()):
                total = total + arrayHandle.inputValue().asFloat()
                arrayHandle.next()
            outHandle = dataBlock.outputValue(LegacySum.aResult)
            outHandle.setFloat(total * gain)
            dataBlock.setClean(plug)
        else:
            return OpenMaya.kUnknownParameter


def sumCreator():
    return OpenMayaMPx.asMPxPtr(LegacySum())


def sumInitializer():
    nAttr = OpenMaya.MFnNumericAttribute()
    LegacySum.aValues = nAttr.create("values", "vals", OpenMaya.MFnNumericData.kFloat, 0.0)
    nAttr.setArray(True)
    nAttr.setKeyable(True)
    LegacySum.aGain = nAttr.create("gain", "gn", OpenMaya.MFnNumericData.kFloat, 1.0)
    nAttr.setKeyable(True)
    LegacySum.aResult = nAttr.create("result", "res", OpenMaya.MFnNumericData.kFloat, 0.0)
    nAttr.setWritable(False)
    nAttr.setStorable(False)
    LegacySum.addAttribute(LegacySum.aValues)
    LegacySum.addAttribute(LegacySum.aGain)
    LegacySum.addAttribute(LegacySum.aResult)
    LegacySum.attributeAffects(LegacySum.aValues, LegacySum.aResult)
    LegacySum.attributeAffects(LegacySum.aGain, LegacySum.aResult)


class VectorLength(OpenMayaMPx.MPxNode):
    aInVectorX = OpenMaya.MObject()
    aInVectorY = OpenMaya.MObject()
    aInVectorZ = OpenMaya.MObject()
    aInVector = OpenMaya.MObject()
    aLength = OpenMaya.MObject()
    aNormal = OpenMaya.MObject()

    def __init__(self):
        OpenMayaMPx.MPxNode.__init__(self)

    def compute(self, plug, dataBlock):
        if plug != VectorLength.aLength and plug != VectorLength.aNormal and plug.parent() != VectorLength.aNormal:
            return OpenMaya.kUnknownParameter
        v = dataBlock.inputValue(VectorLength.aInVector).asDouble3()
        vec = OpenMaya.MVector(v[0], v[1], v[2])
        length = vec.length()
        dataBlock.outputValue(VectorLength.aLength).setDouble(length)
        if length > 0.0:
            vec.normalize()
        dataBlock.outputValue(VectorLength.aNormal).setMVector(vec)
        dataBlock.setClean(plug)


def lengthCreator():
    return OpenMayaMPx.asMPxPtr(VectorLength())


def lengthInitializer():
    nAttr = OpenMaya.MFnNumericAttribute()
    VectorLength.aInVectorX = nAttr.create("inVectorX", "ivx", OpenMaya.MFnNumericData.kDouble, 0.0)
    VectorLength.aInVectorY = nAttr.create("inVectorY", "ivy", OpenMaya.MFnNumericData.kDouble, 0.0)
    VectorLength.aInVectorZ = nAttr.create("inVectorZ", "ivz", OpenMaya.MFnNumericData.kDouble, 0.0)
    VectorLength.aInVector = nAttr.create("inVector", "iv", VectorLength.aInVectorX, VectorLength.aInVectorY,
                                          VectorLength.aInVectorZ)
    VectorLength.aLength = nAttr.create("length", "len", OpenMaya.MFnNumericData.kDouble, 0.0)
    nAttr.setWritable(False)
    VectorLength.aNormal = nAttr.create("normal", "nrm", OpenMaya.MFnNumericData.k3Double)
    nAttr.setWritable(False)
    VectorLength.addAttribute(VectorLength.aInVector)
    VectorLength.addAttribute(VectorLength.aLength)
    VectorLength.addAttribute(VectorLength.aNormal)
    VectorLength.attributeAffects(VectorLength.aInVector, VectorLength.aLength)
    VectorLength.attributeAffects(VectorLength.aInVector, VectorLength.aNormal)


class MatrixOffset(OpenMayaMPx.MPxNode):
    aInMatrix = OpenMaya.MObject()
    aOffset = OpenMaya.MObject()
    aMode = OpenMaya.MObject()
    aOutMatrix = OpenMaya.MObject()

    def __init__(self):
        OpenMayaMPx.MPxNode.__init__(self)

    def compute(self, plug, dataBlock):
        if plug != MatrixOffset.aOutMatrix:
            return OpenMaya.kUnknownParameter
        inObject = dataBlock.inputValue(MatrixOffset.aInMatrix).data()
        if inObject.isNull():
            return
        inData = OpenMaya.MFnMatrixData(inObject)
        xform = OpenMaya.MTransformationMatrix(inData.matrix())
        offset = dataBlock.inputValue(MatrixOffset.aOffset).asVector()
        mode = OpenMaya.MPlug(self.thisMObject(), MatrixOffset.aMode).asShort()
        if mode == 1:
            offset = -offset
        xform.setTranslation(xform.getTranslation(OpenMaya.MSpace.kTransform) + offset, OpenMaya.MSpace.kTransform)
        outData = OpenMaya.MFnMatrixData()
        outObject = outData.create(xform.asMatrix())
        dataBlock.outputValue(MatrixOffset.aOutMatrix).setMObject(outObject)
        dataBlock.setClean(plug)


def offsetCreator():
    return OpenMayaMPx.asMPxPtr(MatrixOffset())


def offsetInitializer():
    tAttr = OpenMaya.MFnTypedAttribute()
    nAttr = OpenMaya.MFnNumericAttribute()
    eAttr = OpenMaya.MFnEnumAttribute()
    MatrixOffset.aInMatrix = tAttr.create("inMatrix", "im", OpenMaya.MFnData.kMatrix)
    MatrixOffset.aOffset = nAttr.createPoint("offset", "of")
    MatrixOffset.aMode = eAttr.create("mode", "md", 0)
    eAttr.addField("add", 0)
    eAttr.addField("subtract", 1)
    MatrixOffset.aOutMatrix = tAttr.create("outMatrix", "om", OpenMaya.MFnData.kMatrix)
    tAttr.setWritable(False)
    tAttr.setStorable(False)
    MatrixOffset.addAttribute(MatrixOffset.aInMatrix)
    MatrixOffset.addAttribute(MatrixOffset.aOffset)
    MatrixOffset.addAttribute(MatrixOffset.aMode)
    MatrixOffset.addAttribute(MatrixOffset.aOutMatrix)
    MatrixOffset.attributeAffects(MatrixOffset.aInMatrix, MatrixOffset.aOutMatrix)
    MatrixOffset.attributeAffects(MatrixOffset.aOffset, MatrixOffset.aOutMatrix)
    MatrixOffset.attributeAffects(MatrixOffset.aMode, MatrixOffset.aOutMatrix)


def initializePlugin(mobject):
    mplugin = OpenMayaMPx.MFnPlugin(mobject, "MayaSceneViewer", "0.9", "Any")
    try:
        mplugin.registerNode(kSumName, kSumId, sumCreator, sumInitializer)
        mplugin.registerNode(kLengthName, kLengthId, lengthCreator, lengthInitializer)
        mplugin.registerNode(kOffsetName, kOffsetId, offsetCreator, offsetInitializer)
    except Exception:
        sys.stderr.write("Failed to register node\n")
        raise


def uninitializePlugin(mobject):
    mplugin = OpenMayaMPx.MFnPlugin(mobject)
    mplugin.deregisterNode(kSumId)
    mplugin.deregisterNode(kLengthId)
    mplugin.deregisterNode(kOffsetId)
