//Maya ASCII 2024 scene
//Name: shot.ma
file -rdi 1 -ns "armA" -rfn "armARN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma";
file -rdi 2 -ns "prop" -rfn "armA:propRN" -op "v=0;" -typ "mayaAscii" "D:/other_pc/demo/assets/prop.ma";
file -rdi 1 -ns "armB" -dr 1 -rfn "armBRN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma{1}";
file -rdi 1 -ns "missing" -rfn "missingRN" -op "v=0;" -typ "mayaAscii" "C:/nowhere/missing.ma";
file -r -ns "armA" -dr 1 -rfn "armARN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma";
file -r -ns "armB" -dr 1 -rfn "armBRN" -op "v=0;" -typ "mayaAscii" "C:/projects/demo/assets/arm_rig.ma{1}";
file -r -ns "missing" -dr 1 -rfn "missingRN" -op "v=0;" -typ "mayaAscii" "C:/nowhere/missing.ma";
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
fileInfo "application" "maya";
createNode transform -n "world_grp";
	setAttr ".t" -type "double3" 0 0 10 ;
createNode reference -n "armARN";
	setAttr ".fn[0]" -type "string" "C:/projects/demo/assets/arm_rig.ma";
	setAttr -s 2 ".phl";
	setAttr ".phl[1]" 0;
	setAttr ".ed" -type "dataReferenceEdits" 
		"armARN"
		"armARN" 0
		"armARN" 3
		0 "|armA:rig_grp" "|world_grp" "-s -r "
		2 "|world_grp|armA:rig_grp|armA:hand_ctrl" "fkik" " 1"
		5 4 "armARN" "|world_grp|armA:rig_grp|armA:hand_ctrl.translateX" "armARN.placeHolderList[1]" ""
		"armA:propRN" 1
		2 "|armA:prop:crate" "translate" " -type \"double3\" 3 0 0";
	setAttr ".ptag" -type "string" "";
lockNode -l 1 ;
createNode reference -n "armBRN";
	setAttr ".ed" -type "dataReferenceEdits" 
		"armBRN";
lockNode -l 1 ;
createNode reference -n "missingRN";
lockNode -l 1 ;
createNode reference -n "sharedReferenceNode";
	setAttr ".ed" -type "dataReferenceEdits" 
		"sharedReferenceNode";
createNode script -n "sceneConfigurationScriptNode";
	setAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";
	setAttr ".st" 6;
createNode animCurveTL -n "hand_ctrl_translateX";
	rename -uid "00000000-0000-0000-0000-002683951777";
	setAttr ".tan" 2;
	setAttr ".wgt" no;
	setAttr -s 2 ".ktv[0:1]"  1 0 24 5;
	setAttr -s 2 ".kit[0:1]"  2 2;
	setAttr -s 2 ".kot[0:1]"  2 2;
connectAttr "hand_ctrl_translateX.o" "armARN.phl[1]";
// End of shot.ma
