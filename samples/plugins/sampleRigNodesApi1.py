# -*- coding: utf-8 -*-
"""変換ツール（python -m ma_viewer convert-plugin）の検証用の、Python API 1.0（OpenMayaMPx）のノードプラグイン。

  * legacySum   : 配列の入力を MArrayDataHandle の elementCount と next でたどる合計（× gain）
  * vectorLength: double3 の入力（子の属性 inVectorX〜Z）の長さと、正規化したベクトル
"""
import sys

import maya.OpenMaya as OpenMaya
import maya.OpenMayaMPx as OpenMayaMPx

kSumName = "legacySum"
kSumId = OpenMaya.MTypeId(0x0012F010)
kLengthName = "vectorLength"
kLengthId = OpenMaya.MTypeId(0x0012F011)


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


def initializePlugin(mobject):
    mplugin = OpenMayaMPx.MFnPlugin(mobject, "MayaSceneViewer", "0.9", "Any")
    try:
        mplugin.registerNode(kSumName, kSumId, sumCreator, sumInitializer)
        mplugin.registerNode(kLengthName, kLengthId, lengthCreator, lengthInitializer)
    except Exception:
        sys.stderr.write("Failed to register node\n")
        raise


def uninitializePlugin(mobject):
    mplugin = OpenMayaMPx.MFnPlugin(mobject)
    mplugin.deregisterNode(kSumId)
    mplugin.deregisterNode(kLengthId)
