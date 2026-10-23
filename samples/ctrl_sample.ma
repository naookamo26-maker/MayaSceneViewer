//Maya ASCII 2024 scene
//Name: ctrl_sample.ma
//Codeset: UTF-8
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
fileInfo "application" "maya";
createNode displayLayer -n "ctrl_layer_L";
	rename -uid "00000000-0000-0000-0005-003434549350";
	setAttr ".c" 13;
	setAttr ".do" 1;
createNode transform -n "ctrl_circle";
	rename -uid "00000000-0000-0000-0005-003035260692";
createNode nurbsCurve -n "ctrl_circleShape" -p "ctrl_circle";
	rename -uid "00000000-0000-0000-0005-000196874478";
	setAttr ".ove" yes;
	setAttr ".ovc" 17;
	setAttr ".cc" -type "nurbsCurve" 
		3 8 2 no 3
		13 -2 -1 0 1 2 3 4 5 6 7 8 9 10
		11
		2.12132034 0 -2.12132034
		1.8369702e-16 0 -3
		-2.12132034 0 -2.12132034
		-3 0 -3.6739404e-16
		-2.12132034 0 2.12132034
		-5.5109106e-16 0 3
		2.12132034 0 2.12132034
		3 0 7.34788079e-16
		2.12132034 0 -2.12132034
		1.8369702e-16 0 -3
		-2.12132034 0 -2.12132034
		;
createNode joint -n "arm_a";
	rename -uid "00000000-0000-0000-0005-003839855057";
createNode joint -n "arm_b" -p "arm_a";
	rename -uid "00000000-0000-0000-0005-002111232107";
	setAttr ".t" -type "double3" 4 0 0 ;
createNode transform -n "ctrl_square";
	rename -uid "00000000-0000-0000-0005-002914937540";
	setAttr ".t" -type "double3" 8 0 0 ;
	setAttr ".ove" yes;
	setAttr ".ovrgbf" yes;
	setAttr ".ovrgb" -type "float3" 0.2 0.9 0.5 ;
createNode nurbsCurve -n "ctrl_squareShape" -p "ctrl_square";
	rename -uid "00000000-0000-0000-0005-002157352990";
	setAttr ".cc" -type "nurbsCurve" 
		1 4 1 no 3
		5 0 1 2 3 4
		5
		-1 0 -1
		1 0 -1
		1 0 1
		-1 0 1
		-1 0 -1
		;
createNode transform -n "ctrl_layer";
	rename -uid "00000000-0000-0000-0005-000156735877";
	setAttr ".t" -type "double3" 14 0 0 ;
createNode nurbsCurve -n "ctrl_layerShape" -p "ctrl_layer";
	rename -uid "00000000-0000-0000-0005-000495895148";
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		0 3 0
		;
createNode transform -n "ctrl_tmpl";
	rename -uid "00000000-0000-0000-0005-003658898337";
	setAttr ".t" -type "double3" 18 0 0 ;
createNode nurbsCurve -n "ctrl_tmplShape" -p "ctrl_tmpl";
	rename -uid "00000000-0000-0000-0005-000784735246";
	setAttr ".ove" yes;
	setAttr ".ovdt" 1;
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		0 3 0
		;
createNode transform -n "ctrl_hidden";
	rename -uid "00000000-0000-0000-0005-003892374480";
	setAttr ".t" -type "double3" 20 0 0 ;
createNode nurbsCurve -n "ctrl_hiddenShape" -p "ctrl_hidden";
	rename -uid "00000000-0000-0000-0005-000048042072";
	setAttr ".v" no;
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		0 3 0
		;
createNode transform -n "ctrl_tweak";
	rename -uid "00000000-0000-0000-0005-000965638741";
	setAttr ".t" -type "double3" 0 0 8 ;
createNode nurbsCurve -n "ctrl_tweakShape" -p "ctrl_tweak";
	rename -uid "00000000-0000-0000-0005-000229600175";
	setAttr ".cc" -type "nurbsCurve" 
		3 1 0 no 3
		6 0 0 0 1 1 1
		4
		0 0 0
		1 0 0
		2 0 0
		3 0 0
		;
	setAttr -s 4 ".cp[0:3]" -type "double3" 0 0 0 0 2 0 0 0 0 0 0 0 ;
createNode transform -n "ctrl_multi";
	rename -uid "00000000-0000-0000-0005-000673053594";
	setAttr ".t" -type "double3" 0 0 -8 ;
createNode nurbsCurve -n "ctrl_multiShape1" -p "ctrl_multi";
	rename -uid "00000000-0000-0000-0005-000462507243";
	setAttr ".ove" yes;
	setAttr ".ovc" 6;
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		2 0 0
		;
createNode nurbsCurve -n "ctrl_multiShape2" -p "ctrl_multi";
	rename -uid "00000000-0000-0000-0005-002191007057";
	setAttr ".ove" yes;
	setAttr ".ovc" 14;
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		0 0 2
		;
createNode transform -n "ctrl_ioonly";
	rename -uid "00000000-0000-0000-0005-000614199692";
	setAttr ".t" -type "double3" 0 0 -12 ;
createNode nurbsCurve -n "ctrl_ioonlyShape" -p "ctrl_ioonly";
	rename -uid "00000000-0000-0000-0005-001452493370";
	setAttr ".io" yes;
	setAttr ".cc" -type "nurbsCurve" 
		1 1 0 no 3
		2 0 1
		2
		0 0 0
		2 0 0
		;
createNode joint -n "spC_0";
	rename -uid "00000000-0000-0000-0005-002051641136";
	setAttr ".t" -type "double3" 0 0 30 ;
createNode joint -n "spC_1" -p "spC_0";
	rename -uid "00000000-0000-0000-0005-000223264678";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".r" -type "double3" 56.6666667 0 0 ;
createNode joint -n "spC_2" -p "spC_1";
	rename -uid "00000000-0000-0000-0005-002487741980";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".r" -type "double3" 56.6666667 0 0 ;
createNode joint -n "spC_3" -p "spC_2";
	rename -uid "00000000-0000-0000-0005-003812679306";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".r" -type "double3" 56.6666667 0 0 ;
createNode joint -n "spC_4" -p "spC_3";
	rename -uid "00000000-0000-0000-0005-002099530537";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode ikEffector -n "spC_eff" -p "spC_3";
	rename -uid "00000000-0000-0000-0005-000513352931";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".v" no;
createNode ikHandle -n "spC_ik";
	rename -uid "00000000-0000-0000-0005-001169737827";
	setAttr ".roc" yes;
	setAttr ".dtce" yes;
	setAttr ".dwut" 6;
	setAttr ".dwua" 3;
	setAttr ".dfa" 0;
	setAttr ".dwuv" -type "double3" 0 0 1 ;
	setAttr ".dwve" -type "double3" 0 -0.173648178 -0.984807753 ;
createNode transform -n "spC_curve";
	rename -uid "00000000-0000-0000-0005-002599880002";
createNode nurbsCurve -n "spC_curveShape" -p "spC_curve";
	rename -uid "00000000-0000-0000-0005-000842607618";
	setAttr ".cc" -type "nurbsCurve" 
		3 1 0 no 3
		6 0 0 0 1 1 1
		4
		0 0 30
		2.66666667 0 30
		5.33333333 0 30
		8 0 30
		;
createNode joint -n "spD_0";
	rename -uid "00000000-0000-0000-0005-002131138997";
	setAttr ".t" -type "double3" 0 0 34 ;
	setAttr ".jo" -type "double3" 180 0 0 ;
createNode joint -n "spD_1" -p "spD_0";
	rename -uid "00000000-0000-0000-0005-000134326563";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spD_2" -p "spD_1";
	rename -uid "00000000-0000-0000-0005-002433284249";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spD_3" -p "spD_2";
	rename -uid "00000000-0000-0000-0005-003859793935";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spD_4" -p "spD_3";
	rename -uid "00000000-0000-0000-0005-002020302252";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode ikEffector -n "spD_eff" -p "spD_3";
	rename -uid "00000000-0000-0000-0005-002897869043";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".v" no;
createNode ikHandle -n "spD_ik";
	rename -uid "00000000-0000-0000-0005-003631214810";
	setAttr ".roc" yes;
	setAttr ".dtce" yes;
	setAttr ".dwut" 0;
	setAttr ".dwua" 2;
	setAttr ".dfa" 0;
createNode transform -n "spD_curve";
	rename -uid "00000000-0000-0000-0005-001599093708";
createNode nurbsCurve -n "spD_curveShape" -p "spD_curve";
	rename -uid "00000000-0000-0000-0005-001185006989";
	setAttr ".cc" -type "nurbsCurve" 
		3 1 0 no 3
		6 0 0 0 1 1 1
		4
		0 0 34
		2.66666667 0 34
		5.33333333 0 34
		8 0 34
		;
createNode joint -n "spE_0";
	rename -uid "00000000-0000-0000-0005-002126836610";
	setAttr ".t" -type "double3" 0 0 38 ;
	setAttr ".jo" -type "double3" 180 0 0 ;
createNode joint -n "spE_1" -p "spE_0";
	rename -uid "00000000-0000-0000-0005-000163824404";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spE_2" -p "spE_1";
	rename -uid "00000000-0000-0000-0005-002429194926";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spE_3" -p "spE_2";
	rename -uid "00000000-0000-0000-0005-003889013304";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode joint -n "spE_4" -p "spE_3";
	rename -uid "00000000-0000-0000-0005-002041132955";
	setAttr ".t" -type "double3" 2 0 0 ;
createNode ikEffector -n "spE_eff" -p "spE_3";
	rename -uid "00000000-0000-0000-0005-002446971203";
	setAttr ".t" -type "double3" 2 0 0 ;
	setAttr ".v" no;
createNode ikHandle -n "spE_ik";
	rename -uid "00000000-0000-0000-0005-001624479679";
	setAttr ".roc" yes;
	setAttr ".dtce" yes;
	setAttr ".dwut" 0;
	setAttr ".dwua" 0;
	setAttr ".dfa" 0;
createNode transform -n "spE_curve";
	rename -uid "00000000-0000-0000-0005-004180095096";
createNode nurbsCurve -n "spE_curveShape" -p "spE_curve";
	rename -uid "00000000-0000-0000-0005-003708062178";
	setAttr ".cc" -type "nurbsCurve" 
		3 1 0 no 3
		6 0 0 0 1 1 1
		4
		0 0 38
		2.66666667 0 38
		5.33333333 0 38
		8 0 38
		;
setAttr "spE_0.r" -type "double3" 180 0 0 ;
createNode joint -n "e_jnt1";
	rename -uid "00000000-0000-0000-0005-001608985301";
	setAttr ".t" -type "double3" 0 0.596007992 -20 ;
createNode expression -n "expr_wave";
	rename -uid "00000000-0000-0000-0005-001690897422";
	setAttr -k on ".nds";
	setAttr -s 1 ".out";
	setAttr ".ixp" -type "string" ".O[0] = sin(frame * 0.2) * 3;";
createNode joint -n "e_jnt2";
	rename -uid "00000000-0000-0000-0005-003337517935";
	setAttr ".t" -type "double3" 3 0 -20 ;
	setAttr ".r" -type "double3" 0 0 1 ;
createNode expression -n "expr_logic";
	rename -uid "00000000-0000-0000-0005-002816175247";
	setAttr -k on ".nds";
	setAttr -s 1 ".in";
	setAttr -s 3 ".out";
	setAttr ".ixp" -type "string" "// コメント\nfloat $h = .I[0];\nif ($h > 2.5)\n	.O[0] = $h * 2;\nelse\n	.O[0] = 0;\n.O[1] = clamp(0, 45, frame);\n.O[2] = 7 / 2;";
createNode unitConversion -n "expr_logic_uc";
	rename -uid "00000000-0000-0000-0005-000745700899";
	setAttr ".cf" 0.017453292519943295;
createNode joint -n "e_jnt3";
	rename -uid "00000000-0000-0000-0005-002984856569";
	setAttr ".t" -type "double3" 6 1 -20 ;
createNode expression -n "expr_mel";
	rename -uid "00000000-0000-0000-0005-000628204674";
	setAttr -k on ".nds";
	setAttr -s 1 ".out";
	setAttr ".ixp" -type "string" ".O[0] = `getAttr \"ctrl_circle.ty\"`;";
createNode animCurveTA -n "ctrl_circle_rotateY";
	rename -uid "00000000-0000-0000-0005-001493498195";
	setAttr ".tan" 2;
	setAttr -s 2 ".ktv[0:1]"  1 0 48 90;
createNode animCurveTL -n "ctrl_circle_translateY";
	rename -uid "00000000-0000-0000-0005-003177543985";
	setAttr ".tan" 2;
	setAttr -s 2 ".ktv[0:1]"  1 0 48 5;
createNode script -n "sceneConfigurationScriptNode";
	rename -uid "00000000-0000-0000-0005-000086746734";
	setAttr ".b" -type "string" "playbackOptions -min 1 -max 48 -ast 1 -aet 48 ";
createNode ikSplineSolver -n "ikSplineSolver";
	rename -uid "00000000-0000-0000-0005-002655845880";
select -ne :time1;
	setAttr ".o" 1;
connectAttr "ctrl_layer_L.di" "ctrl_layer.do";
connectAttr "ctrl_circle_rotateY.o" "ctrl_circle.ry";
connectAttr "ctrl_circle_translateY.o" "ctrl_circle.ty";
connectAttr "ctrl_circle.r" "arm_a.r";
connectAttr "expr_wave.out[0]" "e_jnt1.ty";
connectAttr ":time1.o" "expr_wave.tim";
connectAttr "ctrl_circle.ty" "expr_logic.in[0]";
connectAttr "expr_logic.out[0]" "e_jnt2.ty";
connectAttr "expr_logic.out[1]" "expr_logic_uc.i";
connectAttr "expr_logic_uc.o" "e_jnt2.rz";
connectAttr "expr_logic.out[2]" "e_jnt2.tx";
connectAttr "expr_mel.out[0]" "e_jnt3.ty";
connectAttr "spC_0.msg" "spC_ik.hsj";
connectAttr "spC_eff.hp" "spC_ik.hee";
connectAttr "ikSplineSolver.msg" "spC_ik.hsv";
connectAttr "spC_4.tx" "spC_eff.tx";
connectAttr "spC_4.ty" "spC_eff.ty";
connectAttr "spC_4.tz" "spC_eff.tz";
connectAttr "spC_curveShape.ws" "spC_ik.ic";
connectAttr "spD_0.msg" "spD_ik.hsj";
connectAttr "spD_eff.hp" "spD_ik.hee";
connectAttr "ikSplineSolver.msg" "spD_ik.hsv";
connectAttr "spD_4.tx" "spD_eff.tx";
connectAttr "spD_4.ty" "spD_eff.ty";
connectAttr "spD_4.tz" "spD_eff.tz";
connectAttr "spD_curveShape.ws" "spD_ik.ic";
connectAttr "spE_0.msg" "spE_ik.hsj";
connectAttr "spE_eff.hp" "spE_ik.hee";
connectAttr "ikSplineSolver.msg" "spE_ik.hsv";
connectAttr "spE_4.tx" "spE_eff.tx";
connectAttr "spE_4.ty" "spE_eff.ty";
connectAttr "spE_4.tz" "spE_eff.tz";
connectAttr "spE_curveShape.ws" "spE_ik.ic";
// End of ctrl_sample.ma
