//Maya ASCII 2024 scene
//Name: textured_sample.ma
//Codeset: UTF-8
requires maya "2024";
requires -nodeType "aiStandardSurface" "mtoa" "5.3.0";
currentUnit -l centimeter -a degree -t film;
fileInfo "application" "maya";
createNode transform -n "quad_geo";
	setAttr ".t" -type "double3" -3 1.2 0 ;
createNode mesh -n "quad_geoShape" -p "quad_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode lambert -n "quad_mat";
	setAttr ".c" -type "float3" 0.2 0.3 0.4 ;
createNode shadingEngine -n "quad_matSG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode file -n "quad_file";
	setAttr ".ftn" -type "string" "sourceimages/props/quad_D.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "quad_file_place";
createNode transform -n "leaf_geo";
	setAttr ".t" -type "double3" 0 1.2 0 ;
createNode mesh -n "leaf_geoShape" -p "leaf_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0.25 0.25 0.75 0.25 0.75 0.75 0.25 0.75;
	setAttr ".uvst[1].uvsn" -type "string" "leafUV";
	setAttr -s 4 ".uvst[1].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3
		mu 1 4 0 1 2 3;
createNode aiStandardSurface -n "leaf_mat";
	setAttr ".baseColor" -type "float3" 0.8 0.8 0.8 ;
createNode shadingEngine -n "leaf_matSG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode file -n "leaf_file";
	setAttr ".ftn" -type "string" "Z:/assets/plants/leaf_A.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "leaf_file_place";
createNode uvChooser -n "leaf_uvChooser";
createNode transform -n "box_geo";
	setAttr ".t" -type "double3" 3 0 0 ;
createNode mesh -n "box_geoShape" -p "box_geo";
	setAttr -k off ".v";
	setAttr -s 2 ".iog[0].og";
	setAttr ".iog[0].og[0].gcl" -type "componentList" 1 "f[0:2]";
	setAttr ".iog[0].og[1].gcl" -type "componentList" 1 "f[3:5]";
	setAttr ".vir" yes;
createNode mesh -n "box_geoShapeOrig" -p "box_geo";
	setAttr ".io" yes;
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 24 ".uvst[0].uvsp[0:23]" -type "float2" 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt[0:7]"  -0.6 0 0.6 0.6 0 0.6 -0.6 1.2 0.6 0.6 1.2 0.6 -0.6 1.2 -0.6 0.6 1.2 -0.6 -0.6 0 -0.6 0.6 0 -0.6;
	setAttr -s 12 ".ed[0:11]"  0 1 0 1 3 0 3 2 0 2 0 0 3 5 0 5 4 0 4 2 0 5 7 0 7 6 0 6 4 0 7 1 0 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3
		f 4 -3 4 5 6
		mu 0 4 4 5 6 7
		f 4 -6 7 8 9
		mu 0 4 8 9 10 11
		f 4 -9 10 -1 11
		mu 0 4 12 13 14 15
		f 4 -11 -8 -5 -2
		mu 0 4 16 17 18 19
		f 4 -12 -4 -7 -10
		mu 0 4 20 21 22 23;
createNode lambert -n "box_matA";
	setAttr ".c" -type "float3" 0.5 0.5 0.5 ;
createNode shadingEngine -n "box_matASG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode file -n "box_file";
	setAttr ".ftn" -type "string" "C:/old_pc/work/chr/tex/box_D.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "box_file_place";
createNode lambert -n "box_matB";
	setAttr ".c" -type "float3" 0.25 0.55 0.65 ;
createNode shadingEngine -n "box_matBSG";
	setAttr ".ihi" 0;
	setAttr ".ro" yes;
createNode file -n "missing_file";
	setAttr ".ftn" -type "string" "C:/nowhere/missing_D.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "missing_file_place";
createNode joint -n "box_root";
	setAttr ".t" -type "double3" 3 0 0 ;
createNode joint -n "box_top" -p "box_root";
	setAttr ".t" -type "double3" 0 1.2 0 ;
	setAttr ".r" -type "double3" 0 0 25 ;
createNode skinCluster -n "box_skin";
	setAttr -s 8 ".wl";
	setAttr ".wl[0:7].w"
		1 0 1
		1 0 1
		1 1 1
		1 1 1
		1 1 1
		1 1 1
		1 0 1
		1 0 1;
	setAttr -s 2 ".pm";
	setAttr ".pm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 -3 0 0 1;
	setAttr ".pm[1]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 -3 -1.2 0 1;
	setAttr ".gm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 3 0 0 1;
createNode transform -n "plain_geo";
	setAttr ".t" -type "double3" 0 -1.5 0 ;
createNode mesh -n "plain_geoShape" -p "plain_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode transform -n "hist_geo";
	setAttr ".t" -type "double3" 6 0 0 ;
createNode mesh -n "hist_geoShape" -p "hist_geo";
	setAttr -k off ".v";
	setAttr -s 2 ".iog[0].og";
	setAttr ".vir" yes;
createNode mesh -n "hist_geoShapeOrig" -p "hist_geo";
	setAttr ".io" yes;
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 24 ".uvst[0].uvsp[0:23]" -type "float2" 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 8 ".vt[0:7]"  -0.6 0 0.6 0.6 0 0.6 -0.6 1.2 0.6 0.6 1.2 0.6 -0.6 1.2 -0.6 0.6 1.2 -0.6 -0.6 0 -0.6 0.6 0 -0.6;
	setAttr -s 12 ".ed[0:11]"  0 1 0 1 3 0 3 2 0 2 0 0 3 5 0 5 4 0 4 2 0 5 7 0 7 6 0 6 4 0 7 1 0 0 6 0;
	setAttr -s 6 -ch 24 ".fc[0:5]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3
		f 4 -3 4 5 6
		mu 0 4 4 5 6 7
		f 4 -6 7 8 9
		mu 0 4 8 9 10 11
		f 4 -9 10 -1 11
		mu 0 4 12 13 14 15
		f 4 -11 -8 -5 -2
		mu 0 4 16 17 18 19
		f 4 -12 -4 -7 -10
		mu 0 4 20 21 22 23;
createNode joint -n "hist_root";
	setAttr ".t" -type "double3" 6 0 0 ;
	setAttr ".bps" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 6 0 0 1;
createNode skinCluster -n "hist_skin";
	setAttr ".wl[0:7].w"
		1 0 1
		1 0 1
		1 0 1
		1 0 1
		1 0 1
		1 0 1
		1 0 1
		1 0 1;
	setAttr ".pm[0]" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 -6 0 0 1;
	setAttr ".gm" -type "matrix" 1 0 0 0 0 1 0 0 0 0 1 0 6 0 0 1;
createNode groupId -n "hist_groupId0";
	setAttr ".ihi" 0;
createNode groupParts -n "hist_groupParts0";
	setAttr ".ihi" 0;
	setAttr ".ic" -type "componentList" 1 "f[0:2]";
createNode groupId -n "hist_groupId1";
	setAttr ".ihi" 0;
createNode groupParts -n "hist_groupParts1";
	setAttr ".ihi" 0;
	setAttr ".ic" -type "componentList" 1 "f[3:5]";
createNode groupId -n "hist_skinGroupId";
createNode groupParts -n "hist_skinGroupParts";
	setAttr ".ic" -type "componentList" 1 "vtx[*]";
createNode transform -n "uvset_geo";
	setAttr ".t" -type "double3" 3 -1.5 0 ;
createNode mesh -n "uvset_geoShape" -p "uvset_geo";
	setAttr ".uvst[1].uvsn" -type "string" "emptySet";
	setAttr ".uvst[1].uvsp[0:3]" -type "float2" 0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5;
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "emptySet";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode transform -n "pbr_geo";
	setAttr ".t" -type "double3" -3 -1.5 0 ;
createNode mesh -n "pbr_geoShape" -p "pbr_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode aiStandardSurface -n "pbr_mat";
	setAttr ".specularRoughness" 0.4;
	setAttr ".emission" 1;
createNode shadingEngine -n "pbr_matSG";
createNode file -n "pbr_base_file";
	setAttr ".ftn" -type "string" "sourceimages/pbr/pbr_base.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "pbr_base_file_place";
createNode file -n "pbr_orm_file";
	setAttr ".ftn" -type "string" "sourceimages/pbr/pbr_orm.tga";
	setAttr ".cs" -type "string" "Raw";
createNode place2dTexture -n "pbr_orm_file_place";
createNode file -n "pbr_emit_file";
	setAttr ".ftn" -type "string" "sourceimages/pbr/pbr_emissive.tga";
	setAttr ".cs" -type "string" "sRGB";
createNode place2dTexture -n "pbr_emit_file_place";
createNode file -n "pbr_normal_file";
	setAttr ".ftn" -type "string" "sourceimages/pbr/pbr_normal.tga";
	setAttr ".cs" -type "string" "Raw";
createNode place2dTexture -n "pbr_normal_file_place";
createNode aiNormalMap -n "pbr_aiNormalMap";
createNode transform -n "sting_geo";
	setAttr ".t" -type "double3" -6 1.2 0 ;
createNode mesh -n "sting_geoShape" -p "sting_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode StingrayPBS -n "sting_mat";
createNode shadingEngine -n "sting_matSG";
createNode transform -n "nrm_geo";
	setAttr ".t" -type "double3" -6 -1.5 0 ;
createNode mesh -n "nrm_geoShape" -p "nrm_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 4 ".uvst[0].uvsp[0:3]" -type "float2" 0 0 1 0 1 1 0 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 4 ".vt[0:3]"  -1 -1 0 1 -1 0 1 1 0 -1 1 0;
	setAttr -s 4 ".ed[0:3]"  0 1 0 1 2 0 2 3 0 3 0 0;
	setAttr -s 1 -ch 4 ".fc[0:0]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3;
createNode lambert -n "nrm_mat";
	setAttr ".c" -type "float3" 0.6 0.6 0.6 ;
createNode shadingEngine -n "nrm_matSG";
createNode bump2d -n "nrm_bump";
	setAttr ".bi" 1;
createNode transform -n "udim_geo";
	setAttr ".t" -type "double3" 0 3.6 0 ;
createNode mesh -n "udim_geoShape" -p "udim_geo";
	setAttr ".uvst[0].uvsn" -type "string" "map1";
	setAttr -s 8 ".uvst[0].uvsp[0:7]" -type "float2" 0 0 1 0 1 1 0 1 1.0001 0 2 0 2 1 1.0001 1;
	setAttr ".cuvs" -type "string" "map1";
	setAttr ".vir" yes;
	setAttr ".vif" yes;
	setAttr -s 6 ".vt[0:5]"  -2 -1 0 0 -1 0 0 1 0 -2 1 0 2 -1 0 2 1 0;
	setAttr -s 7 ".ed[0:6]"  0 1 0 1 2 0 2 3 0 3 0 0 1 4 0 4 5 0 5 2 0;
	setAttr -s 2 -ch 8 ".fc[0:1]" -type "polyFaces" 
		f 4 0 1 2 3
		mu 0 4 0 1 2 3
		f 4 4 5 6 -2
		mu 0 4 4 5 6 7;
createNode lambert -n "udim_mat";
createNode shadingEngine -n "udim_matSG";
createNode file -n "udim_file";
	setAttr ".ftn" -type "string" "sourceimages/udim/tile.1001.tga";
	setAttr ".cs" -type "string" "sRGB";
	setAttr ".uvt" 3;
createNode place2dTexture -n "udim_file_place";
select -ne :initialShadingGroup;
	setAttr -s 2 ".dsm";
connectAttr "quad_mat.oc" "quad_matSG.ss";
connectAttr "quad_file_place.o" "quad_file.uv";
connectAttr "quad_file_place.ofs" "quad_file.fs";
connectAttr "quad_file.oc" "quad_mat.c";
connectAttr ":defaultColorMgtGlobals.cme" "quad_file.cme";
connectAttr "quad_geoShape.iog" "quad_matSG.dsm" -na;
connectAttr "leaf_mat.out" "leaf_matSG.ss";
connectAttr "leaf_file_place.o" "leaf_file.uv";
connectAttr "leaf_file_place.ofs" "leaf_file.fs";
connectAttr "leaf_file.oc" "leaf_mat.baseColor";
connectAttr ":defaultColorMgtGlobals.cme" "leaf_file.cme";
connectAttr "leaf_file.ot" "leaf_mat.opacity";
connectAttr "leaf_geoShape.uvst[1].uvsn" "leaf_uvChooser.uvs[0]";
connectAttr "leaf_uvChooser.ouv" "leaf_file_place.uv";
connectAttr "leaf_geoShape.iog" "leaf_matSG.dsm" -na;
connectAttr "box_matA.oc" "box_matASG.ss";
connectAttr "box_file_place.o" "box_file.uv";
connectAttr "box_file_place.ofs" "box_file.fs";
connectAttr "box_file.oc" "box_matA.c";
connectAttr ":defaultColorMgtGlobals.cme" "box_file.cme";
connectAttr "box_matB.oc" "box_matBSG.ss";
connectAttr "missing_file_place.o" "missing_file.uv";
connectAttr "missing_file_place.ofs" "missing_file.fs";
connectAttr "missing_file.oc" "box_matB.c";
connectAttr ":defaultColorMgtGlobals.cme" "missing_file.cme";
connectAttr "box_geoShape.iog.og[0]" "box_matASG.dsm" -na;
connectAttr "box_geoShape.iog.og[1]" "box_matBSG.dsm" -na;
connectAttr "box_root.wm" "box_skin.ma[0]";
connectAttr "box_top.wm" "box_skin.ma[1]";
connectAttr "box_root.s" "box_top.is";
connectAttr "box_geoShapeOrig.w" "box_skin.ip[0].ig";
connectAttr "box_skin.og[0]" "box_geoShape.i";
connectAttr "plain_geoShape.iog" ":initialShadingGroup.dsm" -na;
connectAttr "hist_geoShapeOrig.w" "hist_groupParts0.ig";
connectAttr "hist_groupId0.id" "hist_groupParts0.gi";
connectAttr "hist_groupParts0.og" "hist_groupParts1.ig";
connectAttr "hist_groupId1.id" "hist_groupParts1.gi";
connectAttr "hist_groupParts1.og" "hist_skinGroupParts.ig";
connectAttr "hist_skinGroupId.id" "hist_skinGroupParts.gi";
connectAttr "hist_skinGroupParts.og" "hist_skin.ip[0].ig";
connectAttr "hist_skinGroupId.id" "hist_skin.ip[0].gi";
connectAttr "hist_skin.og[0]" "hist_geoShape.i";
connectAttr "hist_root.wm" "hist_skin.ma[0]";
connectAttr "hist_groupId0.id" "hist_geoShape.iog.og[0].gid";
connectAttr "hist_groupId1.id" "hist_geoShape.iog.og[1].gid";
connectAttr "box_matASG.mwc" "hist_geoShape.iog.og[0].gco";
connectAttr "quad_matSG.mwc" "hist_geoShape.iog.og[1].gco";
connectAttr "hist_geoShape.iog.og[0]" "box_matASG.dsm" -na;
connectAttr "hist_geoShape.iog.og[1]" "quad_matSG.dsm" -na;
connectAttr "hist_groupId0.msg" "box_matASG.gn" -na;
connectAttr "hist_groupId1.msg" "quad_matSG.gn" -na;
connectAttr "uvset_geoShape.iog" "quad_matSG.dsm" -na;
connectAttr "pbr_base_file_place.o" "pbr_base_file.uv";
connectAttr "pbr_orm_file_place.o" "pbr_orm_file.uv";
connectAttr "pbr_emit_file_place.o" "pbr_emit_file.uv";
connectAttr "pbr_normal_file_place.o" "pbr_normal_file.uv";
connectAttr "pbr_mat.out" "pbr_matSG.ss";
connectAttr "pbr_base_file.oc" "pbr_mat.baseColor";
connectAttr "pbr_orm_file.ocg" "pbr_mat.specularRoughness";
connectAttr "pbr_orm_file.ocb" "pbr_mat.metalness";
connectAttr "pbr_emit_file.oc" "pbr_mat.emissionColor";
connectAttr "pbr_normal_file.oc" "pbr_aiNormalMap.input";
connectAttr "pbr_aiNormalMap.outValue" "pbr_mat.normalCamera";
connectAttr "pbr_geoShape.iog" "pbr_matSG.dsm" -na;
connectAttr "sting_mat.oc" "sting_matSG.ss";
connectAttr "pbr_base_file.oc" "sting_mat.TEX_color_map";
connectAttr "pbr_normal_file.oc" "sting_mat.TEX_normal_map";
connectAttr "pbr_orm_file.oc" "sting_mat.TEX_roughness_map";
connectAttr "pbr_orm_file.oc" "sting_mat.TEX_ao_map";
connectAttr "sting_geoShape.iog" "sting_matSG.dsm" -na;
connectAttr "nrm_mat.oc" "nrm_matSG.ss";
connectAttr "pbr_normal_file.oa" "nrm_bump.bv";
connectAttr "nrm_bump.o" "nrm_mat.n";
connectAttr "nrm_geoShape.iog" "nrm_matSG.dsm" -na;
connectAttr "udim_file_place.o" "udim_file.uv";
connectAttr "udim_mat.oc" "udim_matSG.ss";
connectAttr "udim_file.oc" "udim_mat.c";
connectAttr "udim_geoShape.iog" "udim_matSG.dsm" -na;
// End of textured_sample.ma
