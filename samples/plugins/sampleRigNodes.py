# -*- coding: utf-8 -*-
"""変換ツール（python -m ma_viewer convert-plugin）の検証用の、Python API 2.0 のノードプラグイン。

Maya のプラグインとしてそのまま読み込める書き方にしてある（ビューアはこのファイルを実行せず、構文を解析して変換する）。
  * weightedSumNode : 配列の入力（input[]・weight[]）の重み付きの和。物理番号でたどり、論理番号で weight を引く
  * targetAverage   : 配列の compound（target[].targetMatrix・targetWeight）の位置の重み付きの平均（double3 の出力）
  * angleScale      : 角度の入出力（MAngle）
  * aimMatrix       : 行列・ベクトルの計算（MVector の外積・MTransformationMatrix で組み立て）と行列の出力
  * stretchArray    : 出力の配列（MArrayDataBuilder）
  * statefulNode    : 前回の値を self に覚える（変換できない例）
"""
import math

import maya.api.OpenMaya as om

EPSILON = 1e-6


def maya_useNewAPI():
    pass


class WeightedSumNode(om.MPxNode):
    kTypeName = "weightedSumNode"
    kTypeId = om.MTypeId(0x0012F000)
    aInput = None
    aWeight = None
    aOutput = None

    @staticmethod
    def creator():
        return WeightedSumNode()

    @staticmethod
    def initialize():
        nAttr = om.MFnNumericAttribute()
        WeightedSumNode.aInput = nAttr.create("input", "in", om.MFnNumericData.kDouble, 0.0)
        nAttr.array = True
        nAttr.keyable = True
        WeightedSumNode.aWeight = nAttr.create("weight", "w", om.MFnNumericData.kDouble, 1.0)
        nAttr.array = True
        WeightedSumNode.aOutput = nAttr.create("output", "o", om.MFnNumericData.kDouble, 0.0)
        nAttr.writable = False
        nAttr.storable = False
        for a in (WeightedSumNode.aInput, WeightedSumNode.aWeight, WeightedSumNode.aOutput):
            WeightedSumNode.addAttribute(a)
        WeightedSumNode.attributeAffects(WeightedSumNode.aInput, WeightedSumNode.aOutput)
        WeightedSumNode.attributeAffects(WeightedSumNode.aWeight, WeightedSumNode.aOutput)

    def compute(self, plug, data):
        if plug != WeightedSumNode.aOutput:
            return None
        inputs = data.inputArrayValue(WeightedSumNode.aInput)
        weights = data.inputArrayValue(WeightedSumNode.aWeight)
        total = 0.0
        for i in range(len(inputs)):
            inputs.jumpToPhysicalElement(i)
            index = inputs.elementLogicalIndex()
            value = inputs.inputValue().asDouble()
            weights.jumpToLogicalElement(index)
            total += value * weights.inputValue().asDouble()
        out = data.outputValue(WeightedSumNode.aOutput)
        out.setDouble(total)
        out.setClean()


class TargetAverage(om.MPxNode):
    kTypeName = "targetAverage"
    kTypeId = om.MTypeId(0x0012F001)

    @staticmethod
    def creator():
        return TargetAverage()

    @staticmethod
    def initialize():
        mAttr = om.MFnMatrixAttribute()
        nAttr = om.MFnNumericAttribute()
        cAttr = om.MFnCompoundAttribute()
        TargetAverage.aTargetMatrix = mAttr.create("targetMatrix", "tm", om.MFnMatrixAttribute.kDouble)
        TargetAverage.aTargetWeight = nAttr.create("targetWeight", "tw", om.MFnNumericData.kDouble, 1.0)
        TargetAverage.aTarget = cAttr.create("target", "tg")
        cAttr.addChild(TargetAverage.aTargetMatrix)
        cAttr.addChild(TargetAverage.aTargetWeight)
        cAttr.array = True
        TargetAverage.aOutTranslate = nAttr.createPoint("outTranslate", "ot")
        nAttr.writable = False
        TargetAverage.addAttribute(TargetAverage.aTarget)
        TargetAverage.addAttribute(TargetAverage.aOutTranslate)
        TargetAverage.attributeAffects(TargetAverage.aTarget, TargetAverage.aOutTranslate)

    def compute(self, plug, data):
        if plug == TargetAverage.aOutTranslate or plug.parent() == TargetAverage.aOutTranslate:
            targets = data.inputArrayValue(TargetAverage.aTarget)
            pos = om.MVector()
            wsum = 0.0
            for i in range(len(targets)):
                targets.jumpToPhysicalElement(i)
                h = targets.inputValue()
                w = h.child(TargetAverage.aTargetWeight).asDouble()
                m = h.child(TargetAverage.aTargetMatrix).asMatrix()
                pos += om.MTransformationMatrix(m).translation(om.MSpace.kWorld) * w
                wsum += w
            if wsum > EPSILON:
                pos = pos / wsum
            data.outputValue(TargetAverage.aOutTranslate).set3Double(pos.x, pos.y, pos.z)
            data.setClean(plug)


class AngleScale(om.MPxNode):
    kTypeName = "angleScale"
    kTypeId = om.MTypeId(0x0012F002)

    @staticmethod
    def creator():
        return AngleScale()

    @staticmethod
    def initialize():
        uAttr = om.MFnUnitAttribute()
        nAttr = om.MFnNumericAttribute()
        AngleScale.aInAngle = uAttr.create("inAngle", "ia", om.MFnUnitAttribute.kAngle, 0.0)
        AngleScale.aFactor = nAttr.create("factor", "f", om.MFnNumericData.kDouble, 2.0)
        AngleScale.aOffset = uAttr.create("offsetAngle", "oa", om.MFnUnitAttribute.kAngle, 0.0)
        AngleScale.aOutAngle = uAttr.create("outAngle", "out", om.MFnUnitAttribute.kAngle, 0.0)
        uAttr.writable = False
        for a in (AngleScale.aInAngle, AngleScale.aFactor, AngleScale.aOffset, AngleScale.aOutAngle):
            AngleScale.addAttribute(a)
        for a in (AngleScale.aInAngle, AngleScale.aFactor, AngleScale.aOffset):
            AngleScale.attributeAffects(a, AngleScale.aOutAngle)

    def compute(self, plug, data):
        if plug != AngleScale.aOutAngle:
            return
        rad = data.inputValue(AngleScale.aInAngle).asAngle().asRadians()
        factor = data.inputValue(AngleScale.aFactor).asDouble()
        offset = data.inputValue(AngleScale.aOffset).asAngle().asDegrees()
        result = rad * factor + math.radians(offset)
        data.outputValue(AngleScale.aOutAngle).setMAngle(om.MAngle(result))
        data.setClean(plug)


class AimMatrix(om.MPxNode):
    kTypeName = "aimMatrix2"
    kTypeId = om.MTypeId(0x0012F003)

    @staticmethod
    def creator():
        return AimMatrix()

    @staticmethod
    def initialize():
        mAttr = om.MFnMatrixAttribute()
        nAttr = om.MFnNumericAttribute()
        AimMatrix.aBase = mAttr.create("baseMatrix", "bm")
        AimMatrix.aTarget = mAttr.create("targetMatrix", "tgm")
        AimMatrix.aUp = nAttr.create("upVector", "up", om.MFnNumericData.k3Double)
        nAttr.default = (0.0, 1.0, 0.0)
        AimMatrix.aOut = mAttr.create("outMatrix", "om")
        mAttr.writable = False
        for a in (AimMatrix.aBase, AimMatrix.aTarget, AimMatrix.aUp, AimMatrix.aOut):
            AimMatrix.addAttribute(a)
        for a in (AimMatrix.aBase, AimMatrix.aTarget, AimMatrix.aUp):
            AimMatrix.attributeAffects(a, AimMatrix.aOut)

    def compute(self, plug, data):
        if plug != AimMatrix.aOut:
            return
        base = data.inputValue(AimMatrix.aBase).asMatrix()
        target = data.inputValue(AimMatrix.aTarget).asMatrix()
        up = om.MVector(data.inputValue(AimMatrix.aUp).asDouble3())
        origin = om.MPoint(0.0, 0.0, 0.0) * base
        goal = om.MPoint(0.0, 0.0, 0.0) * target
        x = om.MVector(goal - origin).normal()
        z = (x ^ up).normal()
        y = z ^ x
        m = om.MMatrix([x.x, x.y, x.z, 0.0, y.x, y.y, y.z, 0.0, z.x, z.y, z.z, 0.0,
                        origin.x, origin.y, origin.z, 1.0])
        data.outputValue(AimMatrix.aOut).setMMatrix(m)
        data.setClean(plug)


class StretchArray(om.MPxNode):
    kTypeName = "stretchArray"
    kTypeId = om.MTypeId(0x0012F004)

    @staticmethod
    def creator():
        return StretchArray()

    @staticmethod
    def initialize():
        nAttr = om.MFnNumericAttribute()
        StretchArray.aInput = nAttr.create("inValue", "iv", om.MFnNumericData.kDouble, 0.0)
        nAttr.array = True
        StretchArray.aScale = nAttr.create("stretch", "st", om.MFnNumericData.kDouble, 1.0)
        StretchArray.aOutput = nAttr.create("outValue", "ov", om.MFnNumericData.kDouble, 0.0)
        nAttr.array = True
        nAttr.usesArrayDataBuilder = True
        nAttr.writable = False
        for a in (StretchArray.aInput, StretchArray.aScale, StretchArray.aOutput):
            StretchArray.addAttribute(a)
        StretchArray.attributeAffects(StretchArray.aInput, StretchArray.aOutput)
        StretchArray.attributeAffects(StretchArray.aScale, StretchArray.aOutput)

    def compute(self, plug, data):
        if plug != StretchArray.aOutput and plug.array() != StretchArray.aOutput:
            return
        scale = data.inputValue(StretchArray.aScale).asDouble()
        inputs = data.inputArrayValue(StretchArray.aInput)
        outputs = data.outputArrayValue(StretchArray.aOutput)
        builder = outputs.builder()
        for i in range(len(inputs)):
            inputs.jumpToPhysicalElement(i)
            idx = inputs.elementLogicalIndex()
            h = builder.addElement(idx)
            h.setDouble(inputs.inputValue().asDouble() * scale if idx % 2 == 0 else -inputs.inputValue().asDouble())
        outputs.set(builder)
        outputs.setAllClean()


class StatefulNode(om.MPxNode):
    kTypeName = "statefulNode"
    kTypeId = om.MTypeId(0x0012F005)

    def __init__(self):
        om.MPxNode.__init__(self)
        self.previous = 0.0

    @staticmethod
    def creator():
        return StatefulNode()

    @staticmethod
    def initialize():
        nAttr = om.MFnNumericAttribute()
        StatefulNode.aInput = nAttr.create("input", "in", om.MFnNumericData.kDouble, 0.0)
        StatefulNode.aOutput = nAttr.create("output", "o", om.MFnNumericData.kDouble, 0.0)
        StatefulNode.addAttribute(StatefulNode.aInput)
        StatefulNode.addAttribute(StatefulNode.aOutput)
        StatefulNode.attributeAffects(StatefulNode.aInput, StatefulNode.aOutput)

    def compute(self, plug, data):
        value = data.inputValue(StatefulNode.aInput).asDouble()
        smoothed = self.previous + (value - self.previous) * 0.5
        self.previous = smoothed
        data.outputValue(StatefulNode.aOutput).setDouble(smoothed)
        data.setClean(plug)


NODES = (WeightedSumNode, TargetAverage, AngleScale, AimMatrix, StretchArray, StatefulNode)


def initializePlugin(obj):
    plugin = om.MFnPlugin(obj, "MayaSceneViewer", "1.2")
    for cls in NODES:
        plugin.registerNode(cls.kTypeName, cls.kTypeId, cls.creator, cls.initialize)


def uninitializePlugin(obj):
    plugin = om.MFnPlugin(obj)
    for cls in NODES:
        plugin.deregisterNode(cls.kTypeId)
