//Maya ASCII 2024 scene
//Name: batch_sample.ma
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
createNode lambert -n "matA";
	setAttr ".c" -type "float3" 0.8 0.3 0.2 ;
createNode shadingEngine -n "matASG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode lambert -n "matB";
	setAttr ".c" -type "float3" 0.2 0.6 0.3 ;
createNode shadingEngine -n "matBSG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode lambert -n "matC";
	setAttr ".c" -type "float3" 0.2 0.3 0.8 ;
createNode shadingEngine -n "matCSG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode transform -n "box0";
	setAttr ".t" -type "double3" 0 0 0 ;
createNode mesh -n "box0Shape" -p "box0";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box1";
	setAttr ".t" -type "double3" 1.2 0 0 ;
createNode mesh -n "box1Shape" -p "box1";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box2";
	setAttr ".t" -type "double3" 2.4 0 0 ;
createNode mesh -n "box2Shape" -p "box2";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box3";
	setAttr ".t" -type "double3" 3.6 0 0 ;
createNode mesh -n "box3Shape" -p "box3";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box4";
	setAttr ".t" -type "double3" 4.8 0 0 ;
createNode mesh -n "box4Shape" -p "box4";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box5";
	setAttr ".t" -type "double3" 6 0 0 ;
createNode mesh -n "box5Shape" -p "box5";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box6";
	setAttr ".t" -type "double3" 7.2 0 0 ;
createNode mesh -n "box6Shape" -p "box6";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box7";
	setAttr ".t" -type "double3" 8.4 0 0 ;
createNode mesh -n "box7Shape" -p "box7";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box8";
	setAttr ".t" -type "double3" 9.6 0 0 ;
createNode mesh -n "box8Shape" -p "box8";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box9";
	setAttr ".t" -type "double3" 10.8 0 0 ;
createNode mesh -n "box9Shape" -p "box9";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box10";
	setAttr ".t" -type "double3" 0 1.2 0 ;
createNode mesh -n "box10Shape" -p "box10";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box11";
	setAttr ".t" -type "double3" 1.2 1.2 0 ;
createNode mesh -n "box11Shape" -p "box11";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box12";
	setAttr ".t" -type "double3" 2.4 1.2 0 ;
createNode mesh -n "box12Shape" -p "box12";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box13";
	setAttr ".t" -type "double3" 3.6 1.2 0 ;
createNode mesh -n "box13Shape" -p "box13";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box14";
	setAttr ".t" -type "double3" 4.8 1.2 0 ;
createNode mesh -n "box14Shape" -p "box14";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box15";
	setAttr ".t" -type "double3" 6 1.2 0 ;
createNode mesh -n "box15Shape" -p "box15";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box16";
	setAttr ".t" -type "double3" 7.2 1.2 0 ;
createNode mesh -n "box16Shape" -p "box16";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box17";
	setAttr ".t" -type "double3" 8.4 1.2 0 ;
createNode mesh -n "box17Shape" -p "box17";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box18";
	setAttr ".t" -type "double3" 9.6 1.2 0 ;
createNode mesh -n "box18Shape" -p "box18";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box19";
	setAttr ".t" -type "double3" 10.8 1.2 0 ;
createNode mesh -n "box19Shape" -p "box19";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box20";
	setAttr ".t" -type "double3" 0 2.4 0 ;
createNode mesh -n "box20Shape" -p "box20";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box21";
	setAttr ".t" -type "double3" 1.2 2.4 0 ;
createNode mesh -n "box21Shape" -p "box21";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box22";
	setAttr ".t" -type "double3" 2.4 2.4 0 ;
createNode mesh -n "box22Shape" -p "box22";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box23";
	setAttr ".t" -type "double3" 3.6 2.4 0 ;
createNode mesh -n "box23Shape" -p "box23";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box24";
	setAttr ".t" -type "double3" 4.8 2.4 0 ;
createNode mesh -n "box24Shape" -p "box24";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box25";
	setAttr ".t" -type "double3" 6 2.4 0 ;
createNode mesh -n "box25Shape" -p "box25";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box26";
	setAttr ".t" -type "double3" 7.2 2.4 0 ;
createNode mesh -n "box26Shape" -p "box26";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box27";
	setAttr ".t" -type "double3" 8.4 2.4 0 ;
createNode mesh -n "box27Shape" -p "box27";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box28";
	setAttr ".t" -type "double3" 9.6 2.4 0 ;
createNode mesh -n "box28Shape" -p "box28";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box29";
	setAttr ".t" -type "double3" 10.8 2.4 0 ;
createNode mesh -n "box29Shape" -p "box29";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box30";
	setAttr ".t" -type "double3" 0 3.6 0 ;
createNode mesh -n "box30Shape" -p "box30";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box31";
	setAttr ".t" -type "double3" 1.2 3.6 0 ;
createNode mesh -n "box31Shape" -p "box31";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box32";
	setAttr ".t" -type "double3" 2.4 3.6 0 ;
createNode mesh -n "box32Shape" -p "box32";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box33";
	setAttr ".t" -type "double3" 3.6 3.6 0 ;
createNode mesh -n "box33Shape" -p "box33";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box34";
	setAttr ".t" -type "double3" 4.8 3.6 0 ;
createNode mesh -n "box34Shape" -p "box34";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box35";
	setAttr ".t" -type "double3" 6 3.6 0 ;
createNode mesh -n "box35Shape" -p "box35";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box36";
	setAttr ".t" -type "double3" 7.2 3.6 0 ;
createNode mesh -n "box36Shape" -p "box36";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box37";
	setAttr ".t" -type "double3" 8.4 3.6 0 ;
createNode mesh -n "box37Shape" -p "box37";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box38";
	setAttr ".t" -type "double3" 9.6 3.6 0 ;
createNode mesh -n "box38Shape" -p "box38";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box39";
	setAttr ".t" -type "double3" 10.8 3.6 0 ;
createNode mesh -n "box39Shape" -p "box39";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box40";
	setAttr ".t" -type "double3" 0 4.8 0 ;
createNode mesh -n "box40Shape" -p "box40";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box41";
	setAttr ".t" -type "double3" 1.2 4.8 0 ;
createNode mesh -n "box41Shape" -p "box41";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box42";
	setAttr ".t" -type "double3" 2.4 4.8 0 ;
createNode mesh -n "box42Shape" -p "box42";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box43";
	setAttr ".t" -type "double3" 3.6 4.8 0 ;
createNode mesh -n "box43Shape" -p "box43";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box44";
	setAttr ".t" -type "double3" 4.8 4.8 0 ;
createNode mesh -n "box44Shape" -p "box44";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box45";
	setAttr ".t" -type "double3" 6 4.8 0 ;
createNode mesh -n "box45Shape" -p "box45";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box46";
	setAttr ".t" -type "double3" 7.2 4.8 0 ;
createNode mesh -n "box46Shape" -p "box46";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box47";
	setAttr ".t" -type "double3" 8.4 4.8 0 ;
createNode mesh -n "box47Shape" -p "box47";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box48";
	setAttr ".t" -type "double3" 9.6 4.8 0 ;
createNode mesh -n "box48Shape" -p "box48";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box49";
	setAttr ".t" -type "double3" 10.8 4.8 0 ;
createNode mesh -n "box49Shape" -p "box49";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box50";
	setAttr ".t" -type "double3" 0 6 0 ;
createNode mesh -n "box50Shape" -p "box50";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box51";
	setAttr ".t" -type "double3" 1.2 6 0 ;
createNode mesh -n "box51Shape" -p "box51";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box52";
	setAttr ".t" -type "double3" 2.4 6 0 ;
createNode mesh -n "box52Shape" -p "box52";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box53";
	setAttr ".t" -type "double3" 3.6 6 0 ;
createNode mesh -n "box53Shape" -p "box53";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box54";
	setAttr ".t" -type "double3" 4.8 6 0 ;
createNode mesh -n "box54Shape" -p "box54";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box55";
	setAttr ".t" -type "double3" 6 6 0 ;
createNode mesh -n "box55Shape" -p "box55";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box56";
	setAttr ".t" -type "double3" 7.2 6 0 ;
createNode mesh -n "box56Shape" -p "box56";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box57";
	setAttr ".t" -type "double3" 8.4 6 0 ;
createNode mesh -n "box57Shape" -p "box57";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box58";
	setAttr ".t" -type "double3" 9.6 6 0 ;
createNode mesh -n "box58Shape" -p "box58";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "box59";
	setAttr ".t" -type "double3" 10.8 6 0 ;
createNode mesh -n "box59Shape" -p "box59";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "nouv0";
	setAttr ".t" -type "double3" 0 -1.5 0 ;
createNode mesh -n "nouv0Shape" -p "nouv0";
	setAttr -k off ".v";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		f 4 -3 4 5 6
		f 4 -6 7 8 9
		f 4 -9 10 -1 11
		f 4 -11 -8 -5 -2
		f 4 -12 -4 -7 -10;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "nouv1";
	setAttr ".t" -type "double3" 1.2 -1.5 0 ;
createNode mesh -n "nouv1Shape" -p "nouv1";
	setAttr -k off ".v";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		f 4 -3 4 5 6
		f 4 -6 7 8 9
		f 4 -9 10 -1 11
		f 4 -11 -8 -5 -2
		f 4 -12 -4 -7 -10;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "nouv2";
	setAttr ".t" -type "double3" 2.4 -1.5 0 ;
createNode mesh -n "nouv2Shape" -p "nouv2";
	setAttr -k off ".v";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		f 4 -3 4 5 6
		f 4 -6 7 8 9
		f 4 -9 10 -1 11
		f 4 -11 -8 -5 -2
		f 4 -12 -4 -7 -10;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "nouv3";
	setAttr ".t" -type "double3" 3.6 -1.5 0 ;
createNode mesh -n "nouv3Shape" -p "nouv3";
	setAttr -k off ".v";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		f 4 -3 4 5 6
		f 4 -6 7 8 9
		f 4 -9 10 -1 11
		f 4 -11 -8 -5 -2
		f 4 -12 -4 -7 -10;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "multi";
	setAttr ".t" -type "double3" 6 -1.5 0 ;
createNode mesh -n "multiShape" -p "multi";
	setAttr -k off ".v";
	setAttr -s 2 ".iog[0].og";
	setAttr ".iog[0].og[0].gcl" -type "componentList" 1 "f[0:2]";
	setAttr ".iog[0].og[1].gcl" -type "componentList" 1 "f[3:5]";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "mover";
createNode animCurveTL -n "mover_tx";
	setAttr -s 2 ".ktv[0:1]"  1 0 24 6;
createNode transform -n "ride0" -p "mover";
	setAttr ".t" -type "double3" 0 0 3 ;
createNode mesh -n "ride0Shape" -p "ride0";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "ride1" -p "mover";
	setAttr ".t" -type "double3" 1.2 0 3 ;
createNode mesh -n "ride1Shape" -p "ride1";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "ride2" -p "mover";
	setAttr ".t" -type "double3" 2.4 0 3 ;
createNode mesh -n "ride2Shape" -p "ride2";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "ride3" -p "mover";
	setAttr ".t" -type "double3" 3.6 0 3 ;
createNode mesh -n "ride3Shape" -p "ride3";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "ride4" -p "mover";
	setAttr ".t" -type "double3" 4.8 0 3 ;
createNode mesh -n "ride4Shape" -p "ride4";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "ride5" -p "mover";
	setAttr ".t" -type "double3" 6 0 3 ;
createNode mesh -n "ride5Shape" -p "ride5";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "hiddenBox";
	setAttr ".t" -type "double3" 0 0 -3 ;
	setAttr ".v" no;
createNode mesh -n "hiddenBoxShape" -p "hiddenBox";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode transform -n "blinkBox";
	setAttr ".t" -type "double3" 1.2 0 -3 ;
createNode mesh -n "blinkBoxShape" -p "blinkBox";
	setAttr -k off ".v";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 0.142857143 0 0.285714286 0 0.428571429 0 0.571428571 0 0.714285714 0 0.857142857 0 0 0.02;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt";
	setAttr ".vt[0:7]"  -0.4 -0.4 0.4
		 0.4 -0.4 0.4
		 -0.4 0.4 0.4
		 0.4 0.4 0.4
		 -0.4 0.4 -0.4
		 0.4 0.4 -0.4
		 -0.4 -0.4 -0.4
		 0.4 -0.4 -0.4;
	setAttr -s 12 ".ed";
	setAttr ".ed[0:11]"  0 1 0
		 1 3 0
		 3 2 0
		 2 0 0
		 3 5 0
		 5 4 0
		 4 2 0
		 5 7 0
		 7 6 0
		 6 4 0
		 7 1 0
		 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 3 2
		f 4 -3 4 5 6
		mu 0 4 2 3 5 4
		f 4 -6 7 8 9
		mu 0 4 4 5 7 6
		f 4 -9 10 -1 11
		mu 0 4 6 7 1 0
		f 4 -11 -8 -5 -2
		mu 0 4 1 7 5 3
		f 4 -12 -4 -7 -10
		mu 0 4 6 0 2 4;
	setAttr ".cd" -type "dataPolyComponent" Index_Data Edge 0 ;
createNode animCurveTU -n "blinkBox_v";
	setAttr -s 2 ".ktv[0:1]"  1 1 12 0;
	setAttr -s 2 ".kot[0:1]"  5 5;
createNode script -n "sceneConfigurationScriptNode";
	setAttr ".b" -type "string" "playbackOptions -min 1 -max 24 -ast 1 -aet 24 ";
	setAttr ".st" 6;
connectAttr "matA.oc" "matASG.ss";
connectAttr "matB.oc" "matBSG.ss";
connectAttr "matC.oc" "matCSG.ss";
connectAttr "box0Shape.iog" "matASG.dsm" -na;
connectAttr "box1Shape.iog" "matBSG.dsm" -na;
connectAttr "box2Shape.iog" "matCSG.dsm" -na;
connectAttr "box3Shape.iog" "matASG.dsm" -na;
connectAttr "box4Shape.iog" "matBSG.dsm" -na;
connectAttr "box5Shape.iog" "matCSG.dsm" -na;
connectAttr "box6Shape.iog" "matASG.dsm" -na;
connectAttr "box7Shape.iog" "matBSG.dsm" -na;
connectAttr "box8Shape.iog" "matCSG.dsm" -na;
connectAttr "box9Shape.iog" "matASG.dsm" -na;
connectAttr "box10Shape.iog" "matBSG.dsm" -na;
connectAttr "box11Shape.iog" "matCSG.dsm" -na;
connectAttr "box12Shape.iog" "matASG.dsm" -na;
connectAttr "box13Shape.iog" "matBSG.dsm" -na;
connectAttr "box14Shape.iog" "matCSG.dsm" -na;
connectAttr "box15Shape.iog" "matASG.dsm" -na;
connectAttr "box16Shape.iog" "matBSG.dsm" -na;
connectAttr "box17Shape.iog" "matCSG.dsm" -na;
connectAttr "box18Shape.iog" "matASG.dsm" -na;
connectAttr "box19Shape.iog" "matBSG.dsm" -na;
connectAttr "box20Shape.iog" "matCSG.dsm" -na;
connectAttr "box21Shape.iog" "matASG.dsm" -na;
connectAttr "box22Shape.iog" "matBSG.dsm" -na;
connectAttr "box23Shape.iog" "matCSG.dsm" -na;
connectAttr "box24Shape.iog" "matASG.dsm" -na;
connectAttr "box25Shape.iog" "matBSG.dsm" -na;
connectAttr "box26Shape.iog" "matCSG.dsm" -na;
connectAttr "box27Shape.iog" "matASG.dsm" -na;
connectAttr "box28Shape.iog" "matBSG.dsm" -na;
connectAttr "box29Shape.iog" "matCSG.dsm" -na;
connectAttr "box30Shape.iog" "matASG.dsm" -na;
connectAttr "box31Shape.iog" "matBSG.dsm" -na;
connectAttr "box32Shape.iog" "matCSG.dsm" -na;
connectAttr "box33Shape.iog" "matASG.dsm" -na;
connectAttr "box34Shape.iog" "matBSG.dsm" -na;
connectAttr "box35Shape.iog" "matCSG.dsm" -na;
connectAttr "box36Shape.iog" "matASG.dsm" -na;
connectAttr "box37Shape.iog" "matBSG.dsm" -na;
connectAttr "box38Shape.iog" "matCSG.dsm" -na;
connectAttr "box39Shape.iog" "matASG.dsm" -na;
connectAttr "box40Shape.iog" "matBSG.dsm" -na;
connectAttr "box41Shape.iog" "matCSG.dsm" -na;
connectAttr "box42Shape.iog" "matASG.dsm" -na;
connectAttr "box43Shape.iog" "matBSG.dsm" -na;
connectAttr "box44Shape.iog" "matCSG.dsm" -na;
connectAttr "box45Shape.iog" "matASG.dsm" -na;
connectAttr "box46Shape.iog" "matBSG.dsm" -na;
connectAttr "box47Shape.iog" "matCSG.dsm" -na;
connectAttr "box48Shape.iog" "matASG.dsm" -na;
connectAttr "box49Shape.iog" "matBSG.dsm" -na;
connectAttr "box50Shape.iog" "matCSG.dsm" -na;
connectAttr "box51Shape.iog" "matASG.dsm" -na;
connectAttr "box52Shape.iog" "matBSG.dsm" -na;
connectAttr "box53Shape.iog" "matCSG.dsm" -na;
connectAttr "box54Shape.iog" "matASG.dsm" -na;
connectAttr "box55Shape.iog" "matBSG.dsm" -na;
connectAttr "box56Shape.iog" "matCSG.dsm" -na;
connectAttr "box57Shape.iog" "matASG.dsm" -na;
connectAttr "box58Shape.iog" "matBSG.dsm" -na;
connectAttr "box59Shape.iog" "matCSG.dsm" -na;
connectAttr "nouv0Shape.iog" "matASG.dsm" -na;
connectAttr "nouv1Shape.iog" "matASG.dsm" -na;
connectAttr "nouv2Shape.iog" "matASG.dsm" -na;
connectAttr "nouv3Shape.iog" "matASG.dsm" -na;
connectAttr "multiShape.iog.og[0]" "matASG.dsm" -na;
connectAttr "multiShape.iog.og[1]" "matBSG.dsm" -na;
connectAttr "mover_tx.o" "mover.tx";
connectAttr "ride0Shape.iog" "matBSG.dsm" -na;
connectAttr "ride1Shape.iog" "matBSG.dsm" -na;
connectAttr "ride2Shape.iog" "matBSG.dsm" -na;
connectAttr "ride3Shape.iog" "matBSG.dsm" -na;
connectAttr "ride4Shape.iog" "matBSG.dsm" -na;
connectAttr "ride5Shape.iog" "matBSG.dsm" -na;
connectAttr "hiddenBoxShape.iog" "matCSG.dsm" -na;
connectAttr "blinkBoxShape.iog" "matCSG.dsm" -na;
connectAttr "blinkBox_v.o" "blinkBox.v";
// End of batch_sample.ma
