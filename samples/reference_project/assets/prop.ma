//Maya ASCII 2024 scene
//Name: prop.ma
requires maya "2024";
currentUnit -l centimeter -a degree -t film;
fileInfo "application" "maya";
createNode transform -n "crate";
createNode mesh -n "crateShape" -p "crate";
	setAttr -k off ".v";
	setAttr -s 4 ".vt[0:3]"  -1 0 1 1 0 1 -1 0 -1 1 0 -1;
	setAttr -s 4 ".ed[0:3]"  0 1 0 0 2 0 1 3 0 2 3 0;
	setAttr -s 1 -ch 4 ".fc[0]" -type "polyFaces" 
		f 4 0 2 -4 -2;
createNode transform -s -n "persp";
	setAttr ".t" -type "double3" 99 99 99 ;
createNode camera -s -n "perspShape" -p "persp";
	setAttr ".fl" 50;
select -ne :time1;
	setAttr ".o" 50;
// End of prop.ma
