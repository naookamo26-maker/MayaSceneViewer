(()=>{var Il="160",_n={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Ti={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},lf=0,vc=1,cf=2;var hu=1,hf=2,Un=3,ni=0,Ke=1,Ve=2;var Qn=0,os=1,_c=2,Mc=3,bc=4,uf=5,yi=100,df=101,ff=102,wc=103,Sc=104,pf=200,mf=201,gf=202,xf=203,Xa=204,$a=205,yf=206,vf=207,_f=208,Mf=209,bf=210,wf=211,Sf=212,Ef=213,Af=214,Tf=0,Cf=1,Rf=2,eo=3,Pf=4,Lf=5,If=6,Nf=7,uu=0,Df=1,Uf=2,ti=0,Of=1,Ff=2,kf=3,zf=4,Bf=5,Vf=6,Ec="attached",Ro="detached",du=300,cs=301,hs=302,Ya=303,Za=304,Po=306,us=1e3,on=1001,ja=1002,Ie=1003,Ac=1004;var fa=1005;var Ne=1006,Hf=1007;var Sn=1008;var ei=1009,Gf=1010,Wf=1011,Nl=1012,fu=1013,Jn=1014,On=1015,Gs=1016,pu=1017,mu=1018,_i=1020,qf=1021,Ze=1023,Xf=1024,$f=1025,Mi=1026,ds=1027,Yf=1028,gu=1029,Zf=1030,xu=1031,yu=1033,pa=33776,ma=33777,ga=33778,xa=33779,Tc=35840,Cc=35841,Rc=35842,Pc=35843,vu=36196,Lc=37492,Ic=37496,Nc=37808,Dc=37809,Uc=37810,Oc=37811,Fc=37812,kc=37813,zc=37814,Bc=37815,Vc=37816,Hc=37817,Gc=37818,Wc=37819,qc=37820,Xc=37821,ya=36492,$c=36494,Yc=36495,jf=36283,Zc=36284,jc=36285,Kc=36286;var no=2300,io=2301,va=2302,Jc=2400,Qc=2401,th=2402;var _u=3e3,bi=3001,Kf=3200,Jf=3201,Mu=0,Qf=1,je="",ve="srgb",kn="srgb-linear",Dl="display-p3",Lo="display-p3-linear",so="linear",ce="srgb",ro="rec709",oo="p3";var ki=7680;var eh=519,tp=512,ep=513,np=514,bu=515,ip=516,sp=517,rp=518,op=519,nh=35044,sr=35048;var ih="300 es",Ka=1035,Fn=2e3,ao=2001,En=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sh=1234567,zs=Math.PI/180,Ws=180/Math.PI;function Ci(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[s&255]+Fe[s>>8&255]+Fe[s>>16&255]+Fe[s>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function ze(s,t,e){return Math.max(t,Math.min(e,s))}function Ul(s,t){return(s%t+t)%t}function ap(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function lp(s,t,e){return s!==t?(e-s)/(t-s):0}function Bs(s,t,e){return(1-e)*s+e*t}function cp(s,t,e,n){return Bs(s,t,1-Math.exp(-e*n))}function hp(s,t=1){return t-Math.abs(Ul(s,t*2)-t)}function up(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function dp(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function fp(s,t){return s+Math.floor(Math.random()*(t-s+1))}function pp(s,t){return s+Math.random()*(t-s)}function mp(s){return s*(.5-Math.random())}function gp(s){s!==void 0&&(sh=s);let t=sh+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function xp(s){return s*zs}function yp(s){return s*Ws}function Ja(s){return(s&s-1)===0&&s!==0}function vp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function lo(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function _p(s,t,e,n,i){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),m=o((n-t)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*m,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*m,a*c);break;case"ZYZ":s.set(l*m,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function es(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Xe(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var wu={DEG2RAD:zs,RAD2DEG:Ws,generateUUID:Ci,clamp:ze,euclideanModulo:Ul,mapLinear:ap,inverseLerp:lp,lerp:Bs,damp:cp,pingpong:hp,smoothstep:up,smootherstep:dp,randInt:fp,randFloat:pp,randFloatSpread:mp,seededRandom:gp,degToRad:xp,radToDeg:yp,isPowerOfTwo:Ja,ceilPowerOfTwo:vp,floorPowerOfTwo:lo,setQuaternionFromProperEuler:_p,normalize:Xe,denormalize:es},Nt=class s{constructor(t=0,e=0){s.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Vt=class s{constructor(t,e,n,i,r,o,a,l,c){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],m=n[8],x=i[0],g=i[3],p=i[6],v=i[1],y=i[4],b=i[7],w=i[2],M=i[5],S=i[8];return r[0]=o*x+a*v+l*w,r[3]=o*g+a*y+l*M,r[6]=o*p+a*b+l*S,r[1]=c*x+h*v+u*w,r[4]=c*g+h*y+u*M,r[7]=c*p+h*b+u*S,r[2]=d*x+f*v+m*w,r[5]=d*g+f*y+m*M,r[8]=d*p+f*b+m*S,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,m=e*u+n*d+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=u*x,t[1]=(i*c-h*n)*x,t[2]=(a*n-i*o)*x,t[3]=d*x,t[4]=(h*e-i*l)*x,t[5]=(i*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(_a.makeScale(t,e)),this}rotate(t){return this.premultiply(_a.makeRotation(-t)),this}translate(t,e){return this.premultiply(_a.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},_a=new Vt;function Su(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function co(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Mp(){let s=co("canvas");return s.style.display="block",s}var rh={};function Vs(s){s in rh||(rh[s]=!0,console.warn(s))}var oh=new Vt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ah=new Vt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Er={[kn]:{transfer:so,primaries:ro,toReference:s=>s,fromReference:s=>s},[ve]:{transfer:ce,primaries:ro,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Lo]:{transfer:so,primaries:oo,toReference:s=>s.applyMatrix3(ah),fromReference:s=>s.applyMatrix3(oh)},[Dl]:{transfer:ce,primaries:oo,toReference:s=>s.convertSRGBToLinear().applyMatrix3(ah),fromReference:s=>s.applyMatrix3(oh).convertLinearToSRGB()}},bp=new Set([kn,Lo]),se={enabled:!0,_workingColorSpace:kn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!bp.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;let n=Er[t].toReference,i=Er[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Er[s].primaries},getTransfer:function(s){return s===je?so:Er[s].transfer}};function as(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ma(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var zi,ho=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{zi===void 0&&(zi=co("canvas")),zi.width=t.width,zi.height=t.height;let n=zi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=zi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=co("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=as(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(as(e[n]/255)*255):e[n]=as(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},wp=0,uo=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wp++}),this.uuid=Ci(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(ba(i[o].image)):r.push(ba(i[o]))}else r=ba(i);n.url=r}return e||(t.images[this.uuid]=n),n}};function ba(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?ho.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Sp=0,Je=class s extends En{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=on,i=on,r=Ne,o=Sn,a=Ze,l=ei,c=s.DEFAULT_ANISOTROPY,h=je){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=Ci(),this.name="",this.source=new uo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Nt(0,0),this.repeat=new Nt(1,1),this.center=new Nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===bi?ve:je),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==du)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case us:t.x=t.x-Math.floor(t.x);break;case on:t.x=t.x<0?0:1;break;case ja:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case us:t.y=t.y-Math.floor(t.y);break;case on:t.y=t.y<0?0:1;break;case ja:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ve?bi:_u}set encoding(t){Vs("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===bi?ve:je}};Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=du;Je.DEFAULT_ANISOTROPY=1;var de=class s{constructor(t=0,e=0,n=0,i=1){s.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let y=(c+1)/2,b=(f+1)/2,w=(p+1)/2,M=(h+d)/4,S=(u+x)/4,C=(m+g)/4;return y>b&&y>w?y<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(y),i=M/n,r=S/n):b>w?b<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(b),n=M/i,r=C/i):w<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(w),n=S/r,i=C/r),this.set(n,i,r,e),this}let v=Math.sqrt((g-m)*(g-m)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(v)<.001&&(v=1),this.x=(g-m)/v,this.y=(u-x)/v,this.z=(d-h)/v,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Qa=class extends En{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e);let i={width:t,height:e,depth:1};n.encoding!==void 0&&(Vs("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===bi?ve:je),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Je(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new uo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},xn=class extends Qa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},fo=class extends Je{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var tl=class extends Je{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=on,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var _t=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],m=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=m,t[e+3]=x;return}if(u!==x||l!==d||c!==f||h!==m){let g=1-a,p=l*d+c*f+h*m+u*x,v=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let w=Math.sqrt(y),M=Math.atan2(w,p*v);g=Math.sin(g*M)/w,a=Math.sin(a*M)/w}let b=a*v;if(l=l*g+d*b,c=c*g+f*b,h=h*g+m*b,u=u*g+x*b,g===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*u+l*f-c*d,t[e+1]=l*m+h*d+c*u-a*f,t[e+2]=c*m+h*f+a*d-l*u,t[e+3]=h*m-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),m=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"YXZ":this._x=d*h*u+c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"ZXY":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u-d*f*m;break;case"ZYX":this._x=d*h*u-c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u+d*f*m;break;case"YZX":this._x=d*h*u+c*f*m,this._y=c*f*u+d*h*m,this._z=c*h*m-d*f*u,this._w=c*h*u-d*f*m;break;case"XZY":this._x=d*h*u-c*f*m,this._y=c*f*u-d*h*m,this._z=c*h*m+d*f*u,this._w=c*h*u+d*f*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ze(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),i=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(i),n*Math.sin(r),n*Math.cos(r),e*Math.sin(i))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class s{constructor(t=0,e=0,n=0){s.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(lh.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(lh.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return wa.copy(this).projectOnVector(t),this.sub(wa)}reflect(t){return this.sub(wa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(ze(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},wa=new A,lh=new _t,Ye=class{constructor(t=new A(1/0,1/0,1/0),e=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ar.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ar.copy(n.boundingBox)),Ar.applyMatrix4(t.matrixWorld),this.union(Ar)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ns),Tr.subVectors(this.max,Ns),Bi.subVectors(t.a,Ns),Vi.subVectors(t.b,Ns),Hi.subVectors(t.c,Ns),$n.subVectors(Vi,Bi),Yn.subVectors(Hi,Vi),fi.subVectors(Bi,Hi);let e=[0,-$n.z,$n.y,0,-Yn.z,Yn.y,0,-fi.z,fi.y,$n.z,0,-$n.x,Yn.z,0,-Yn.x,fi.z,0,-fi.x,-$n.y,$n.x,0,-Yn.y,Yn.x,0,-fi.y,fi.x,0];return!Sa(e,Bi,Vi,Hi,Tr)||(e=[1,0,0,0,1,0,0,0,1],!Sa(e,Bi,Vi,Hi,Tr))?!1:(Cr.crossVectors($n,Yn),e=[Cr.x,Cr.y,Cr.z],Sa(e,Bi,Vi,Hi,Tr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Rn=[new A,new A,new A,new A,new A,new A,new A,new A],dn=new A,Ar=new Ye,Bi=new A,Vi=new A,Hi=new A,$n=new A,Yn=new A,fi=new A,Ns=new A,Tr=new A,Cr=new A,pi=new A;function Sa(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){pi.fromArray(s,r);let a=i.x*Math.abs(pi.x)+i.y*Math.abs(pi.y)+i.z*Math.abs(pi.z),l=t.dot(pi),c=e.dot(pi),h=n.dot(pi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Ep=new Ye,Ds=new A,Ea=new A,yn=class{constructor(t=new A,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Ep.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ds.subVectors(t,this.center);let e=Ds.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Ds,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ea.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ds.copy(t.center).add(Ea)),this.expandByPoint(Ds.copy(t.center).sub(Ea))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Pn=new A,Aa=new A,Rr=new A,Zn=new A,Ta=new A,Pr=new A,Ca=new A,zn=class{constructor(t=new A,e=new A(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Pn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Pn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Pn.copy(this.origin).addScaledVector(this.direction,e),Pn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Aa.copy(t).add(e).multiplyScalar(.5),Rr.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(Aa);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Rr),a=Zn.dot(this.direction),l=-Zn.dot(Rr),c=Zn.lengthSq(),h=Math.abs(1-o*o),u,d,f,m;if(h>0)if(u=o*l-a,d=o*a-l,m=r*h,u>=0)if(d>=-m)if(d<=m){let x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-m?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=m?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Aa).addScaledVector(Rr,d),f}intersectSphere(t,e){Pn.subVectors(t.center,this.origin);let n=Pn.dot(this.direction),i=Pn.dot(Pn)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,Pn)!==null}intersectTriangle(t,e,n,i,r){Ta.subVectors(e,t),Pr.subVectors(n,t),Ca.crossVectors(Ta,Pr);let o=this.direction.dot(Ca),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Zn.subVectors(this.origin,t);let l=a*this.direction.dot(Pr.crossVectors(Zn,Pr));if(l<0)return null;let c=a*this.direction.dot(Ta.cross(Zn));if(c<0||l+c>o)return null;let h=-a*Zn.dot(Ca);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},st=class s{constructor(t,e,n,i,r,o,a,l,c,h,u,d,f,m,x,g){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,u,d,f,m,x,g)}set(t,e,n,i,r,o,a,l,c,h,u,d,f,m,x,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/Gi.setFromMatrixColumn(t,0).length(),r=1/Gi.setFromMatrixColumn(t,1).length(),o=1/Gi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,m=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+m*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d+x*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,m=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,m=a*h,x=a*u;e[0]=l*h,e[4]=m*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=m*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+m,e[10]=d-x*u}else if(t.order==="XZY"){let d=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=f*u-m,e[2]=m*u-f,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ap,t,Tp)}lookAt(t,e,n){let i=this.elements;return sn.subVectors(t,e),sn.lengthSq()===0&&(sn.z=1),sn.normalize(),jn.crossVectors(n,sn),jn.lengthSq()===0&&(Math.abs(n.z)===1?sn.x+=1e-4:sn.z+=1e-4,sn.normalize(),jn.crossVectors(n,sn)),jn.normalize(),Lr.crossVectors(sn,jn),i[0]=jn.x,i[4]=Lr.x,i[8]=sn.x,i[1]=jn.y,i[5]=Lr.y,i[9]=sn.y,i[2]=jn.z,i[6]=Lr.z,i[10]=sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],m=n[2],x=n[6],g=n[10],p=n[14],v=n[3],y=n[7],b=n[11],w=n[15],M=i[0],S=i[4],C=i[8],_=i[12],E=i[1],N=i[5],k=i[9],Q=i[13],L=i[2],U=i[6],D=i[10],H=i[14],G=i[3],B=i[7],j=i[11],$=i[15];return r[0]=o*M+a*E+l*L+c*G,r[4]=o*S+a*N+l*U+c*B,r[8]=o*C+a*k+l*D+c*j,r[12]=o*_+a*Q+l*H+c*$,r[1]=h*M+u*E+d*L+f*G,r[5]=h*S+u*N+d*U+f*B,r[9]=h*C+u*k+d*D+f*j,r[13]=h*_+u*Q+d*H+f*$,r[2]=m*M+x*E+g*L+p*G,r[6]=m*S+x*N+g*U+p*B,r[10]=m*C+x*k+g*D+p*j,r[14]=m*_+x*Q+g*H+p*$,r[3]=v*M+y*E+b*L+w*G,r[7]=v*S+y*N+b*U+w*B,r[11]=v*C+y*k+b*D+w*j,r[15]=v*_+y*Q+b*H+w*$,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],m=t[3],x=t[7],g=t[11],p=t[15];return m*(+r*l*u-i*c*u-r*a*d+n*c*d+i*a*f-n*l*f)+x*(+e*l*f-e*c*d+r*o*d-i*o*f+i*c*h-r*l*h)+g*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-i*a*h-e*l*u+e*a*d+i*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],m=t[12],x=t[13],g=t[14],p=t[15],v=u*g*c-x*d*c+x*l*f-a*g*f-u*l*p+a*d*p,y=m*d*c-h*g*c-m*l*f+o*g*f+h*l*p-o*d*p,b=h*x*c-m*u*c+m*a*f-o*x*f-h*a*p+o*u*p,w=m*u*l-h*x*l-m*a*d+o*x*d+h*a*g-o*u*g,M=e*v+n*y+i*b+r*w;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/M;return t[0]=v*S,t[1]=(x*d*r-u*g*r-x*i*f+n*g*f+u*i*p-n*d*p)*S,t[2]=(a*g*r-x*l*r+x*i*c-n*g*c-a*i*p+n*l*p)*S,t[3]=(u*l*r-a*d*r-u*i*c+n*d*c+a*i*f-n*l*f)*S,t[4]=y*S,t[5]=(h*g*r-m*d*r+m*i*f-e*g*f-h*i*p+e*d*p)*S,t[6]=(m*l*r-o*g*r-m*i*c+e*g*c+o*i*p-e*l*p)*S,t[7]=(o*d*r-h*l*r+h*i*c-e*d*c-o*i*f+e*l*f)*S,t[8]=b*S,t[9]=(m*u*r-h*x*r-m*n*f+e*x*f+h*n*p-e*u*p)*S,t[10]=(o*x*r-m*a*r+m*n*c-e*x*c-o*n*p+e*a*p)*S,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*S,t[12]=w*S,t[13]=(h*x*i-m*u*i+m*n*d-e*x*d-h*n*g+e*u*g)*S,t[14]=(m*a*i-o*x*i-m*n*l+e*x*l+o*n*g-e*a*g)*S,t[15]=(o*u*i-h*a*i+h*n*l-e*u*l-o*n*d+e*a*d)*S,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,m=r*u,x=o*h,g=o*u,p=a*u,v=l*c,y=l*h,b=l*u,w=n.x,M=n.y,S=n.z;return i[0]=(1-(x+p))*w,i[1]=(f+b)*w,i[2]=(m-y)*w,i[3]=0,i[4]=(f-b)*M,i[5]=(1-(d+p))*M,i[6]=(g+v)*M,i[7]=0,i[8]=(m+y)*S,i[9]=(g-v)*S,i[10]=(1-(d+x))*S,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,r=Gi.set(i[0],i[1],i[2]).length(),o=Gi.set(i[4],i[5],i[6]).length(),a=Gi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],fn.copy(this);let c=1/r,h=1/o,u=1/a;return fn.elements[0]*=c,fn.elements[1]*=c,fn.elements[2]*=c,fn.elements[4]*=h,fn.elements[5]*=h,fn.elements[6]*=h,fn.elements[8]*=u,fn.elements[9]*=u,fn.elements[10]*=u,e.setFromRotationMatrix(fn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=Fn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i),f,m;if(a===Fn)f=-(o+r)/(o-r),m=-2*o*r/(o-r);else if(a===ao)f=-o/(o-r),m=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Fn){let l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(o-r),d=(e+t)*c,f=(n+i)*h,m,x;if(a===Fn)m=(o+r)*u,x=-2*u;else if(a===ao)m=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Gi=new A,fn=new st,Ap=new A(0,0,0),Tp=new A(1,1,1),jn=new A,Lr=new A,sn=new A,ch=new st,hh=new _t,be=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(ze(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ch.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ch,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hh.setFromEuler(this),this.setFromQuaternion(hh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};be.DEFAULT_ORDER="XYZ";var qs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Cp=0,uh=new A,Wi=new _t,Ln=new st,Ir=new A,Us=new A,Rp=new A,Pp=new _t,dh=new A(1,0,0),fh=new A(0,1,0),ph=new A(0,0,1),Lp={type:"added"},Ip={type:"removed"},he=class s extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cp++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new A,e=new be,n=new _t,i=new A(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new st},normalMatrix:{value:new Vt}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Wi.setFromAxisAngle(t,e),this.quaternion.multiply(Wi),this}rotateOnWorldAxis(t,e){return Wi.setFromAxisAngle(t,e),this.quaternion.premultiply(Wi),this}rotateX(t){return this.rotateOnAxis(dh,t)}rotateY(t){return this.rotateOnAxis(fh,t)}rotateZ(t){return this.rotateOnAxis(ph,t)}translateOnAxis(t,e){return uh.copy(t).applyQuaternion(this.quaternion),this.position.add(uh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(dh,t)}translateY(t){return this.translateOnAxis(fh,t)}translateZ(t){return this.translateOnAxis(ph,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ir.copy(t):Ir.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Us.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(Us,Ir,this.up):Ln.lookAt(Ir,Us,this.up),this.quaternion.setFromRotationMatrix(Ln),i&&(Ln.extractRotation(i.matrixWorld),Wi.setFromRotationMatrix(Ln),this.quaternion.premultiply(Wi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Lp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ip)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ln),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,t,Rp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Us,Pp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let i=this.children;for(let r=0,o=i.length;r<o;r++){let a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};he.DEFAULT_UP=new A(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var pn=new A,In=new A,Ra=new A,Nn=new A,qi=new A,Xi=new A,mh=new A,Pa=new A,La=new A,Ia=new A,Nr=!1,ns=class s{constructor(t=new A,e=new A,n=new A){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),pn.subVectors(t,e),i.cross(pn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){pn.subVectors(i,e),In.subVectors(n,e),Ra.subVectors(t,e);let o=pn.dot(pn),a=pn.dot(In),l=pn.dot(Ra),c=In.dot(In),h=In.dot(Ra),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,m=(o*h-a*l)*d;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getUV(t,e,n,i,r,o,a,l){return Nr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Nr=!0),this.getInterpolation(t,e,n,i,r,o,a,l)}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Nn.x),l.addScaledVector(o,Nn.y),l.addScaledVector(a,Nn.z),l)}static isFrontFacing(t,e,n,i){return pn.subVectors(n,e),In.subVectors(t,e),pn.cross(In).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return pn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),pn.cross(In).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,i,r){return Nr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Nr=!0),s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;qi.subVectors(i,n),Xi.subVectors(r,n),Pa.subVectors(t,n);let l=qi.dot(Pa),c=Xi.dot(Pa);if(l<=0&&c<=0)return e.copy(n);La.subVectors(t,i);let h=qi.dot(La),u=Xi.dot(La);if(h>=0&&u<=h)return e.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(qi,o);Ia.subVectors(t,r);let f=qi.dot(Ia),m=Xi.dot(Ia);if(m>=0&&f<=m)return e.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(Xi,a);let g=h*m-f*u;if(g<=0&&u-h>=0&&f-m>=0)return mh.subVectors(r,i),a=(u-h)/(u-h+(f-m)),e.copy(i).addScaledVector(mh,a);let p=1/(g+x+d);return o=x*p,a=d*p,e.copy(n).addScaledVector(qi,o).addScaledVector(Xi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Eu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},Dr={h:0,s:0,l:0};function Na(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}var wt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ve){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=se.workingColorSpace){if(t=Ul(t,1),e=ze(e,0,1),n=ze(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Na(o,r,t+1/3),this.g=Na(o,r,t),this.b=Na(o,r,t-1/3)}return se.toWorkingColorSpace(this,i),this}setStyle(t,e=ve){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ve){let n=Eu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=as(t.r),this.g=as(t.g),this.b=as(t.b),this}copyLinearToSRGB(t){return this.r=Ma(t.r),this.g=Ma(t.g),this.b=Ma(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ve){return se.fromWorkingColorSpace(ke.copy(this),t),Math.round(ze(ke.r*255,0,255))*65536+Math.round(ze(ke.g*255,0,255))*256+Math.round(ze(ke.b*255,0,255))}getHexString(t=ve){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(ke.copy(this),e);let n=ke.r,i=ke.g,r=ke.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(ke.copy(this),e),t.r=ke.r,t.g=ke.g,t.b=ke.b,t}getStyle(t=ve){se.fromWorkingColorSpace(ke.copy(this),t);let e=ke.r,n=ke.g,i=ke.b;return t!==ve?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Kn),this.setHSL(Kn.h+t,Kn.s+e,Kn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Kn),t.getHSL(Dr);let n=Bs(Kn.h,Dr.h,e),i=Bs(Kn.s,Dr.s,e),r=Bs(Kn.l,Dr.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ke=new wt;wt.NAMES=Eu;var Np=0,Bn=class extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=os,this.side=ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xa,this.blendDst=$a,this.blendEquation=yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new wt(0,0,0),this.blendAlpha=0,this.depthFunc=eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=eh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ki,this.stencilZFail=ki,this.stencilZPass=ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==os&&(n.blending=this.blending),this.side!==ni&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xa&&(n.blendSrc=this.blendSrc),this.blendDst!==$a&&(n.blendDst=this.blendDst),this.blendEquation!==yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==eo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==eh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ki&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ki&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ki&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},De=class extends Bn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=uu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ee=new A,Ur=new Nt,Me=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=nh,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ur.fromBufferAttribute(this,e),Ur.applyMatrix3(t),this.setXY(e,Ur.x,Ur.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix3(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyMatrix4(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.applyNormalMatrix(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ee.fromBufferAttribute(this,e),Ee.transformDirection(t),this.setXYZ(e,Ee.x,Ee.y,Ee.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=es(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Xe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=es(e,this.array)),e}setX(t,e){return this.normalized&&(e=Xe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=es(e,this.array)),e}setY(t,e){return this.normalized&&(e=Xe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=es(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Xe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=es(e,this.array)),e}setW(t,e){return this.normalized&&(e=Xe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Xe(e,this.array),n=Xe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Xe(e,this.array),n=Xe(n,this.array),i=Xe(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Xe(e,this.array),n=Xe(n,this.array),i=Xe(i,this.array),r=Xe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nh&&(t.usage=this.usage),t}};var wi=class extends Me{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var po=class extends Me{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var zt=class extends Me{constructor(t,e,n){super(new Float32Array(t),e,n)}};var Dp=0,un=new st,Da=new he,$i=new A,rn=new Ye,Os=new Ye,Le=new A,ne=class s extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dp++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Su(t)?po:wi)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return un.makeRotationFromQuaternion(t),this.applyMatrix4(un),this}rotateX(t){return un.makeRotationX(t),this.applyMatrix4(un),this}rotateY(t){return un.makeRotationY(t),this.applyMatrix4(un),this}rotateZ(t){return un.makeRotationZ(t),this.applyMatrix4(un),this}translate(t,e,n){return un.makeTranslation(t,e,n),this.applyMatrix4(un),this}scale(t,e,n){return un.makeScale(t,e,n),this.applyMatrix4(un),this}lookAt(t){return Da.lookAt(t),Da.updateMatrix(),this.applyMatrix4(Da.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($i).negate(),this.translate($i.x,$i.y,$i.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new zt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ye);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];rn.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,rn.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,rn.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(rn.min),this.boundingBox.expandByPoint(rn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new A,1/0);return}if(t){let n=this.boundingSphere.center;if(rn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Os.setFromBufferAttribute(a),this.morphTargetsRelative?(Le.addVectors(rn.min,Os.min),rn.expandByPoint(Le),Le.addVectors(rn.max,Os.max),rn.expandByPoint(Le)):(rn.expandByPoint(Os.min),rn.expandByPoint(Os.max))}rn.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)Le.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Le));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Le.fromBufferAttribute(a,c),l&&($i.fromBufferAttribute(t,c),Le.add($i)),i=Math.max(i,n.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,i=e.position.array,r=e.normal.array,o=e.uv.array,a=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Me(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<a;E++)c[E]=new A,h[E]=new A;let u=new A,d=new A,f=new A,m=new Nt,x=new Nt,g=new Nt,p=new A,v=new A;function y(E,N,k){u.fromArray(i,E*3),d.fromArray(i,N*3),f.fromArray(i,k*3),m.fromArray(o,E*2),x.fromArray(o,N*2),g.fromArray(o,k*2),d.sub(u),f.sub(u),x.sub(m),g.sub(m);let Q=1/(x.x*g.y-g.x*x.y);isFinite(Q)&&(p.copy(d).multiplyScalar(g.y).addScaledVector(f,-x.y).multiplyScalar(Q),v.copy(f).multiplyScalar(x.x).addScaledVector(d,-g.x).multiplyScalar(Q),c[E].add(p),c[N].add(p),c[k].add(p),h[E].add(v),h[N].add(v),h[k].add(v))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let E=0,N=b.length;E<N;++E){let k=b[E],Q=k.start,L=k.count;for(let U=Q,D=Q+L;U<D;U+=3)y(n[U+0],n[U+1],n[U+2])}let w=new A,M=new A,S=new A,C=new A;function _(E){S.fromArray(r,E*3),C.copy(S);let N=c[E];w.copy(N),w.sub(S.multiplyScalar(S.dot(N))).normalize(),M.crossVectors(C,N);let Q=M.dot(h[E])<0?-1:1;l[E*4]=w.x,l[E*4+1]=w.y,l[E*4+2]=w.z,l[E*4+3]=Q}for(let E=0,N=b.length;E<N;++E){let k=b[E],Q=k.start,L=k.count;for(let U=Q,D=Q+L;U<D;U+=3)_(n[U+0]),_(n[U+1]),_(n[U+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Me(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new A,r=new A,o=new A,a=new A,l=new A,c=new A,h=new A,u=new A;if(t)for(let d=0,f=t.count;d<f;d+=3){let m=t.getX(d+0),x=t.getX(d+1),g=t.getX(d+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,g),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,m=0;for(let x=0,g=l.length;x<g;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let p=0;p<h;p++)d[m++]=c[f++]}return new Me(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gh=new st,mi=new zn,Or=new yn,xh=new A,Yi=new A,Zi=new A,ji=new A,Ua=new A,Fr=new A,kr=new Nt,zr=new Nt,Br=new Nt,yh=new A,vh=new A,_h=new A,Vr=new A,Hr=new A,mt=class extends he{constructor(t=new ne,e=new De){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){Fr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Ua.fromBufferAttribute(u,t),o?Fr.addScaledVector(Ua,h):Fr.addScaledVector(Ua.sub(e),h))}e.add(Fr)}return e}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Or.copy(n.boundingSphere),Or.applyMatrix4(r),mi.copy(t.ray).recast(t.near),!(Or.containsPoint(mi.origin)===!1&&(mi.intersectSphere(Or,xh)===null||mi.origin.distanceToSquared(xh)>(t.far-t.near)**2))&&(gh.copy(r).invert(),mi.copy(t.ray).applyMatrix4(gh),!(n.boundingBox!==null&&mi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(a.count,Math.min(g.start+g.count,f.start+f.count));for(let b=v,w=y;b<w;b+=3){let M=a.getX(b),S=a.getX(b+1),C=a.getX(b+2);i=Gr(this,p,t,n,c,h,u,M,S,C),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=a.getX(g),y=a.getX(g+1),b=a.getX(g+2);i=Gr(this,o,t,n,c,h,u,v,y,b),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,x=d.length;m<x;m++){let g=d[m],p=o[g.materialIndex],v=Math.max(g.start,f.start),y=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let b=v,w=y;b<w;b+=3){let M=b,S=b+1,C=b+2;i=Gr(this,p,t,n,c,h,u,M,S,C),i&&(i.faceIndex=Math.floor(b/3),i.face.materialIndex=g.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let g=m,p=x;g<p;g+=3){let v=g,y=g+1,b=g+2;i=Gr(this,o,t,n,c,h,u,v,y,b),i&&(i.faceIndex=Math.floor(g/3),e.push(i))}}}};function Up(s,t,e,n,i,r,o,a){let l;if(t.side===Ke?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===ni,a),l===null)return null;Hr.copy(a),Hr.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(Hr);return c<e.near||c>e.far?null:{distance:c,point:Hr.clone(),object:s}}function Gr(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,Yi),s.getVertexPosition(l,Zi),s.getVertexPosition(c,ji);let h=Up(s,t,e,n,Yi,Zi,ji,Vr);if(h){i&&(kr.fromBufferAttribute(i,a),zr.fromBufferAttribute(i,l),Br.fromBufferAttribute(i,c),h.uv=ns.getInterpolation(Vr,Yi,Zi,ji,kr,zr,Br,new Nt)),r&&(kr.fromBufferAttribute(r,a),zr.fromBufferAttribute(r,l),Br.fromBufferAttribute(r,c),h.uv1=ns.getInterpolation(Vr,Yi,Zi,ji,kr,zr,Br,new Nt),h.uv2=h.uv1),o&&(yh.fromBufferAttribute(o,a),vh.fromBufferAttribute(o,l),_h.fromBufferAttribute(o,c),h.normal=ns.getInterpolation(Vr,Yi,Zi,ji,yh,vh,_h,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new A,materialIndex:0};ns.getNormal(Yi,Zi,ji,u.normal),h.face=u}return h}var we=class s extends ne{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,i,o,2),m("x","z","y",1,-1,t,n,-e,i,o,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new zt(c,3)),this.setAttribute("normal",new zt(h,3)),this.setAttribute("uv",new zt(u,2));function m(x,g,p,v,y,b,w,M,S,C,_){let E=b/S,N=w/C,k=b/2,Q=w/2,L=M/2,U=S+1,D=C+1,H=0,G=0,B=new A;for(let j=0;j<D;j++){let $=j*N-Q;for(let et=0;et<U;et++){let F=et*E-k;B[x]=F*v,B[g]=$*y,B[p]=L,c.push(B.x,B.y,B.z),B[x]=0,B[g]=0,B[p]=M>0?1:-1,h.push(B.x,B.y,B.z),u.push(et/S),u.push(1-j/C),H+=1}}for(let j=0;j<C;j++)for(let $=0;$<S;$++){let et=d+$+U*j,F=d+$+U*(j+1),W=d+($+1)+U*(j+1),J=d+($+1)+U*j;l.push(et,F,J),l.push(F,W,J),G+=6}a.addGroup(f,G,_),f+=G,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function fs(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function $e(s){let t={};for(let e=0;e<s.length;e++){let n=fs(s[e]);for(let i in n)t[i]=n[i]}return t}function Op(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Au(s){return s.getRenderTarget()===null?s.outputColorSpace:se.workingColorSpace}var Fp={clone:fs,merge:$e},kp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zp=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Vn=class extends Bn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kp,this.fragmentShader=zp,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=fs(t.uniforms),this.uniformsGroups=Op(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},mo=class extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=Fn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Be=class extends mo{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Ws*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(zs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ws*2*Math.atan(Math.tan(zs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(zs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Ki=-90,Ji=1,el=class extends he{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Be(Ki,Ji,t,e);i.layers=this.layers,this.add(i);let r=new Be(Ki,Ji,t,e);r.layers=this.layers,this.add(r);let o=new Be(Ki,Ji,t,e);o.layers=this.layers,this.add(o);let a=new Be(Ki,Ji,t,e);a.layers=this.layers,this.add(a);let l=new Be(Ki,Ji,t,e);l.layers=this.layers,this.add(l);let c=new Be(Ki,Ji,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ao)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},go=class extends Je{constructor(t,e,n,i,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:cs,super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},nl=class extends xn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];e.encoding!==void 0&&(Vs("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===bi?ve:je),this.texture=new go(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ne}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new we(5,5,5),r=new Vn({name:"CubemapFromEquirect",uniforms:fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ke,blending:Qn});r.uniforms.tEquirect.value=e;let o=new mt(i,r),a=e.minFilter;return e.minFilter===Sn&&(e.minFilter=Ne),new el(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},Oa=new A,Bp=new A,Vp=new Vt,mn=class{constructor(t=new A(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Oa.subVectors(n,e).cross(Bp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Oa),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Vp.getNormalMatrix(t),i=this.coplanarPoint(Oa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},gi=new yn,Wr=new A,Xs=class{constructor(t=new mn,e=new mn,n=new mn,i=new mn,r=new mn,o=new mn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn){let n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],m=i[9],x=i[10],g=i[11],p=i[12],v=i[13],y=i[14],b=i[15];if(n[0].setComponents(l-r,d-c,g-f,b-p).normalize(),n[1].setComponents(l+r,d+c,g+f,b+p).normalize(),n[2].setComponents(l+o,d+h,g+m,b+v).normalize(),n[3].setComponents(l-o,d-h,g-m,b-v).normalize(),n[4].setComponents(l-a,d-u,g-x,b-y).normalize(),e===Fn)n[5].setComponents(l+a,d+u,g+x,b+y).normalize();else if(e===ao)n[5].setComponents(a,u,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){return gi.center.set(0,0,0),gi.radius=.7071067811865476,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(Wr.x=i.normal.x>0?t.max.x:t.min.x,Wr.y=i.normal.y>0?t.max.y:t.min.y,Wr.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Tu(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Hp(s,t){let e=t.isWebGL2,n=new WeakMap;function i(c,h){let u=c.array,d=c.usage,f=u.byteLength,m=s.createBuffer();s.bindBuffer(h,m),s.bufferData(h,u,d),c.onUploadCallback();let x;if(u instanceof Float32Array)x=s.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)x=s.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=s.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=s.SHORT;else if(u instanceof Uint32Array)x=s.UNSIGNED_INT;else if(u instanceof Int32Array)x=s.INT;else if(u instanceof Int8Array)x=s.BYTE;else if(u instanceof Uint8Array)x=s.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:m,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,h,u){let d=h.array,f=h._updateRange,m=h.updateRanges;if(s.bindBuffer(u,c),f.count===-1&&m.length===0&&s.bufferSubData(u,0,d),m.length!==0){for(let x=0,g=m.length;x<g;x++){let p=m[x];e?s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):s.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):s.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(s.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}var $s=class s extends ne{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=t/a,d=e/l,f=[],m=[],x=[],g=[];for(let p=0;p<h;p++){let v=p*d-o;for(let y=0;y<c;y++){let b=y*u-r;m.push(b,-v,0),x.push(0,0,1),g.push(y/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let v=0;v<a;v++){let y=v+c*p,b=v+c*(p+1),w=v+1+c*(p+1),M=v+1+c*p;f.push(y,b,M),f.push(b,w,M)}this.setIndex(f),this.setAttribute("position",new zt(m,3)),this.setAttribute("normal",new zt(x,3)),this.setAttribute("uv",new zt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},Gp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wp=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,qp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$p=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Yp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Zp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,jp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kp=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Qp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,tm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,em=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,nm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,im=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,sm=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,rm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,om=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,am=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,lm=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hm=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,um=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,dm=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,fm=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pm=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gm=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ym=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vm="gl_FragColor = linearToOutputTexel( gl_FragColor );",_m=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Mm=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,bm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,wm=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Sm=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Em=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Am=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Tm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Cm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pm=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Lm=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Im=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Nm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dm=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Um=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Om=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Fm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,km=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,zm=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Vm=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Hm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Gm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Wm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,$m=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ym=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Zm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,jm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Qm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,eg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ng=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ig=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,sg=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,rg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,og=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ag=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,lg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ug=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,dg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,gg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,yg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_g=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Mg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,bg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,wg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Sg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Eg=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ag=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Tg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Pg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Lg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Ig=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ng=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ug=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Og=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Fg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,kg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Vg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Hg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$g=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Zg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,jg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,e0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,n0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,i0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,s0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,r0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,o0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,a0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,c0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,h0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,u0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,f0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,p0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,m0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,g0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,x0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,y0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,M0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:Gp,alphahash_pars_fragment:Wp,alphamap_fragment:qp,alphamap_pars_fragment:Xp,alphatest_fragment:$p,alphatest_pars_fragment:Yp,aomap_fragment:Zp,aomap_pars_fragment:jp,batching_pars_vertex:Kp,batching_vertex:Jp,begin_vertex:Qp,beginnormal_vertex:tm,bsdfs:em,iridescence_fragment:nm,bumpmap_pars_fragment:im,clipping_planes_fragment:sm,clipping_planes_pars_fragment:rm,clipping_planes_pars_vertex:om,clipping_planes_vertex:am,color_fragment:lm,color_pars_fragment:cm,color_pars_vertex:hm,color_vertex:um,common:dm,cube_uv_reflection_fragment:fm,defaultnormal_vertex:pm,displacementmap_pars_vertex:mm,displacementmap_vertex:gm,emissivemap_fragment:xm,emissivemap_pars_fragment:ym,colorspace_fragment:vm,colorspace_pars_fragment:_m,envmap_fragment:Mm,envmap_common_pars_fragment:bm,envmap_pars_fragment:wm,envmap_pars_vertex:Sm,envmap_physical_pars_fragment:Om,envmap_vertex:Em,fog_vertex:Am,fog_pars_vertex:Tm,fog_fragment:Cm,fog_pars_fragment:Rm,gradientmap_pars_fragment:Pm,lightmap_fragment:Lm,lightmap_pars_fragment:Im,lights_lambert_fragment:Nm,lights_lambert_pars_fragment:Dm,lights_pars_begin:Um,lights_toon_fragment:Fm,lights_toon_pars_fragment:km,lights_phong_fragment:zm,lights_phong_pars_fragment:Bm,lights_physical_fragment:Vm,lights_physical_pars_fragment:Hm,lights_fragment_begin:Gm,lights_fragment_maps:Wm,lights_fragment_end:qm,logdepthbuf_fragment:Xm,logdepthbuf_pars_fragment:$m,logdepthbuf_pars_vertex:Ym,logdepthbuf_vertex:Zm,map_fragment:jm,map_pars_fragment:Km,map_particle_fragment:Jm,map_particle_pars_fragment:Qm,metalnessmap_fragment:tg,metalnessmap_pars_fragment:eg,morphcolor_vertex:ng,morphnormal_vertex:ig,morphtarget_pars_vertex:sg,morphtarget_vertex:rg,normal_fragment_begin:og,normal_fragment_maps:ag,normal_pars_fragment:lg,normal_pars_vertex:cg,normal_vertex:hg,normalmap_pars_fragment:ug,clearcoat_normal_fragment_begin:dg,clearcoat_normal_fragment_maps:fg,clearcoat_pars_fragment:pg,iridescence_pars_fragment:mg,opaque_fragment:gg,packing:xg,premultiplied_alpha_fragment:yg,project_vertex:vg,dithering_fragment:_g,dithering_pars_fragment:Mg,roughnessmap_fragment:bg,roughnessmap_pars_fragment:wg,shadowmap_pars_fragment:Sg,shadowmap_pars_vertex:Eg,shadowmap_vertex:Ag,shadowmask_pars_fragment:Tg,skinbase_vertex:Cg,skinning_pars_vertex:Rg,skinning_vertex:Pg,skinnormal_vertex:Lg,specularmap_fragment:Ig,specularmap_pars_fragment:Ng,tonemapping_fragment:Dg,tonemapping_pars_fragment:Ug,transmission_fragment:Og,transmission_pars_fragment:Fg,uv_pars_fragment:kg,uv_pars_vertex:zg,uv_vertex:Bg,worldpos_vertex:Vg,background_vert:Hg,background_frag:Gg,backgroundCube_vert:Wg,backgroundCube_frag:qg,cube_vert:Xg,cube_frag:$g,depth_vert:Yg,depth_frag:Zg,distanceRGBA_vert:jg,distanceRGBA_frag:Kg,equirect_vert:Jg,equirect_frag:Qg,linedashed_vert:t0,linedashed_frag:e0,meshbasic_vert:n0,meshbasic_frag:i0,meshlambert_vert:s0,meshlambert_frag:r0,meshmatcap_vert:o0,meshmatcap_frag:a0,meshnormal_vert:l0,meshnormal_frag:c0,meshphong_vert:h0,meshphong_frag:u0,meshphysical_vert:d0,meshphysical_frag:f0,meshtoon_vert:p0,meshtoon_frag:m0,points_vert:g0,points_frag:x0,shadow_vert:y0,shadow_frag:v0,sprite_vert:_0,sprite_frag:M0},pt={common:{diffuse:{value:new wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new Nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new wt(16777215)},opacity:{value:1},center:{value:new Nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},wn={basic:{uniforms:$e([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:$e([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new wt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:$e([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new wt(0)},specular:{value:new wt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:$e([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:$e([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new wt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:$e([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:$e([pt.points,pt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:$e([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:$e([pt.common,pt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:$e([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:$e([pt.sprite,pt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:$e([pt.common,pt.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:$e([pt.lights,pt.fog,{color:{value:new wt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};wn.physical={uniforms:$e([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new Nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new Nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new wt(0)},specularColor:{value:new wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new Nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};var qr={r:0,b:0,g:0};function b0(s,t,e,n,i,r,o){let a=new wt(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function m(g,p){let v=!1,y=p.isScene===!0?p.background:null;y&&y.isTexture&&(y=(p.backgroundBlurriness>0?e:t).get(y)),y===null?x(a,l):y&&y.isColor&&(x(y,1),v=!0);let b=s.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil),y&&(y.isCubeTexture||y.mapping===Po)?(h===void 0&&(h=new mt(new we(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:fs(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,M,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=se.getTransfer(y.colorSpace)!==ce,(u!==y||d!==y.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new mt(new $s(2,2),new Vn({name:"BackgroundMaterial",uniforms:fs(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:ni,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=se.getTransfer(y.colorSpace)!==ce,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=s.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function x(g,p){g.getRGB(qr,Au(s)),n.buffers.color.setClear(qr.r,qr.g,qr.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(g,p=1){a.set(g),l=p,x(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,x(a,l)},render:m}}function w0(s,t,e,n){let i=s.getParameter(s.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=g(null),c=l,h=!1;function u(L,U,D,H,G){let B=!1;if(o){let j=x(H,D,U);c!==j&&(c=j,f(c.object)),B=p(L,H,D,G),B&&v(L,H,D,G)}else{let j=U.wireframe===!0;(c.geometry!==H.id||c.program!==D.id||c.wireframe!==j)&&(c.geometry=H.id,c.program=D.id,c.wireframe=j,B=!0)}G!==null&&e.update(G,s.ELEMENT_ARRAY_BUFFER),(B||h)&&(h=!1,C(L,U,D,H),G!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function d(){return n.isWebGL2?s.createVertexArray():r.createVertexArrayOES()}function f(L){return n.isWebGL2?s.bindVertexArray(L):r.bindVertexArrayOES(L)}function m(L){return n.isWebGL2?s.deleteVertexArray(L):r.deleteVertexArrayOES(L)}function x(L,U,D){let H=D.wireframe===!0,G=a[L.id];G===void 0&&(G={},a[L.id]=G);let B=G[U.id];B===void 0&&(B={},G[U.id]=B);let j=B[H];return j===void 0&&(j=g(d()),B[H]=j),j}function g(L){let U=[],D=[],H=[];for(let G=0;G<i;G++)U[G]=0,D[G]=0,H[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:D,attributeDivisors:H,object:L,attributes:{},index:null}}function p(L,U,D,H){let G=c.attributes,B=U.attributes,j=0,$=D.getAttributes();for(let et in $)if($[et].location>=0){let W=G[et],J=B[et];if(J===void 0&&(et==="instanceMatrix"&&L.instanceMatrix&&(J=L.instanceMatrix),et==="instanceColor"&&L.instanceColor&&(J=L.instanceColor)),W===void 0||W.attribute!==J||J&&W.data!==J.data)return!0;j++}return c.attributesNum!==j||c.index!==H}function v(L,U,D,H){let G={},B=U.attributes,j=0,$=D.getAttributes();for(let et in $)if($[et].location>=0){let W=B[et];W===void 0&&(et==="instanceMatrix"&&L.instanceMatrix&&(W=L.instanceMatrix),et==="instanceColor"&&L.instanceColor&&(W=L.instanceColor));let J={};J.attribute=W,W&&W.data&&(J.data=W.data),G[et]=J,j++}c.attributes=G,c.attributesNum=j,c.index=H}function y(){let L=c.newAttributes;for(let U=0,D=L.length;U<D;U++)L[U]=0}function b(L){w(L,0)}function w(L,U){let D=c.newAttributes,H=c.enabledAttributes,G=c.attributeDivisors;D[L]=1,H[L]===0&&(s.enableVertexAttribArray(L),H[L]=1),G[L]!==U&&((n.isWebGL2?s:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,U),G[L]=U)}function M(){let L=c.newAttributes,U=c.enabledAttributes;for(let D=0,H=U.length;D<H;D++)U[D]!==L[D]&&(s.disableVertexAttribArray(D),U[D]=0)}function S(L,U,D,H,G,B,j){j===!0?s.vertexAttribIPointer(L,U,D,G,B):s.vertexAttribPointer(L,U,D,H,G,B)}function C(L,U,D,H){if(n.isWebGL2===!1&&(L.isInstancedMesh||H.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;y();let G=H.attributes,B=D.getAttributes(),j=U.defaultAttributeValues;for(let $ in B){let et=B[$];if(et.location>=0){let F=G[$];if(F===void 0&&($==="instanceMatrix"&&L.instanceMatrix&&(F=L.instanceMatrix),$==="instanceColor"&&L.instanceColor&&(F=L.instanceColor)),F!==void 0){let W=F.normalized,J=F.itemSize,z=e.get(F);if(z===void 0)continue;let tt=z.buffer,xt=z.type,St=z.bytesPerElement,Mt=n.isWebGL2===!0&&(xt===s.INT||xt===s.UNSIGNED_INT||F.gpuType===fu);if(F.isInterleavedBufferAttribute){let Wt=F.data,X=Wt.stride,xe=F.offset;if(Wt.isInstancedInterleavedBuffer){for(let Ct=0;Ct<et.locationSize;Ct++)w(et.location+Ct,Wt.meshPerAttribute);L.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=Wt.meshPerAttribute*Wt.count)}else for(let Ct=0;Ct<et.locationSize;Ct++)b(et.location+Ct);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let Ct=0;Ct<et.locationSize;Ct++)S(et.location+Ct,J/et.locationSize,xt,W,X*St,(xe+J/et.locationSize*Ct)*St,Mt)}else{if(F.isInstancedBufferAttribute){for(let Wt=0;Wt<et.locationSize;Wt++)w(et.location+Wt,F.meshPerAttribute);L.isInstancedMesh!==!0&&H._maxInstanceCount===void 0&&(H._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let Wt=0;Wt<et.locationSize;Wt++)b(et.location+Wt);s.bindBuffer(s.ARRAY_BUFFER,tt);for(let Wt=0;Wt<et.locationSize;Wt++)S(et.location+Wt,J/et.locationSize,xt,W,J*St,J/et.locationSize*Wt*St,Mt)}}else if(j!==void 0){let W=j[$];if(W!==void 0)switch(W.length){case 2:s.vertexAttrib2fv(et.location,W);break;case 3:s.vertexAttrib3fv(et.location,W);break;case 4:s.vertexAttrib4fv(et.location,W);break;default:s.vertexAttrib1fv(et.location,W)}}}}M()}function _(){k();for(let L in a){let U=a[L];for(let D in U){let H=U[D];for(let G in H)m(H[G].object),delete H[G];delete U[D]}delete a[L]}}function E(L){if(a[L.id]===void 0)return;let U=a[L.id];for(let D in U){let H=U[D];for(let G in H)m(H[G].object),delete H[G];delete U[D]}delete a[L.id]}function N(L){for(let U in a){let D=a[U];if(D[L.id]===void 0)continue;let H=D[L.id];for(let G in H)m(H[G].object),delete H[G];delete D[L.id]}}function k(){Q(),h=!0,c!==l&&(c=l,f(c.object))}function Q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:k,resetDefaultState:Q,dispose:_,releaseStatesOfGeometry:E,releaseStatesOfProgram:N,initAttributes:y,enableAttribute:b,disableUnusedAttributes:M}}function S0(s,t,e,n){let i=n.isWebGL2,r;function o(h){r=h}function a(h,u){s.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let f,m;if(i)f=s,m="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),m="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[m](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<d;m++)this.render(h[m],u[m]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let m=0;for(let x=0;x<d;x++)m+=u[x];e.update(m,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function E0(s,t,e){let n;function i(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");n=s.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(S){if(S==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&s.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),d=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),g=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),p=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,b=o||t.has("OES_texture_float"),w=y&&b,M=o?s.getParameter(s.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:m,maxAttributes:x,maxVertexUniforms:g,maxVaryings:p,maxFragmentUniforms:v,vertexTextures:y,floatFragmentTextures:b,floatVertexTextures:w,maxSamples:M}}function A0(s){let t=this,e=null,n=0,i=!1,r=!1,o=new mn,a=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let m=u.clippingPlanes,x=u.clipIntersection,g=u.clipShadows,p=s.get(u);if(!i||m===null||m.length===0||r&&!g)r?h(null):c();else{let v=r?0:n,y=v*4,b=p.clippingState||null;l.value=b,b=h(m,d,y,f);for(let w=0;w!==y;++w)b[w]=e[w];p.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,m){let x=u!==null?u.length:0,g=null;if(x!==0){if(g=l.value,m!==!0||g===null){let p=f+x*4,v=d.matrixWorldInverse;a.getNormalMatrix(v),(g===null||g.length<p)&&(g=new Float32Array(p));for(let y=0,b=f;y!==x;++y,b+=4)o.copy(u[y]).applyMatrix4(v,a),o.normal.toArray(g,b),g[b+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}function T0(s){let t=new WeakMap;function e(o,a){return a===Ya?o.mapping=cs:a===Za&&(o.mapping=hs),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ya||a===Za)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new nl(l.height/2);return c.fromEquirectangularTexture(s,o),t.set(o,c),o.addEventListener("dispose",i),e(c.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ps=class extends mo{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},is=4,Mh=[.125,.215,.35,.446,.526,.582],vi=20,Fa=new ps,bh=new wt,ka=null,za=0,Ba=0,xi=(1+Math.sqrt(5))/2,Qi=1/xi,wh=[new A(1,1,1),new A(-1,1,1),new A(1,1,-1),new A(-1,1,-1),new A(0,xi,Qi),new A(0,xi,-Qi),new A(Qi,0,xi),new A(-Qi,0,xi),new A(xi,Qi,0),new A(-xi,Qi,0)],xo=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){ka=this._renderer.getRenderTarget(),za=this._renderer.getActiveCubeFace(),Ba=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ah(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Eh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ka,za,Ba),t.scissorTest=!1,Xr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===cs||t.mapping===hs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ka=this._renderer.getRenderTarget(),za=this._renderer.getActiveCubeFace(),Ba=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Gs,format:Ze,colorSpace:kn,depthBuffer:!1},i=Sh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Sh(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=C0(r)),this._blurMaterial=R0(r,t,e)}return i}_compileMaterial(t){let e=new mt(this._lodPlanes[0],t);this._renderer.compile(e,Fa)}_sceneToCubeUV(t,e,n,i){let a=new Be(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(bh),h.toneMapping=ti,h.autoClear=!1;let f=new De({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),m=new mt(new we,f),x=!1,g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,x=!0):(f.color.copy(bh),x=!0);for(let p=0;p<6;p++){let v=p%3;v===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):v===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let y=this._cubeSize;Xr(i,v*y,p>2?y:0,y,y),h.setRenderTarget(i),x&&h.render(m,a),h.render(t,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=g}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===cs||t.mapping===hs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ah()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Eh());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Xr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Fa)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){let r=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),o=wh[(i-1)%wh.length];this._blur(t,i-1,i,r,o)}e.autoClear=n}_blur(t,e,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new mt(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*vi-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):vi;g>vi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${vi}`);let p=[],v=0;for(let S=0;S<vi;++S){let C=S/x,_=Math.exp(-C*C/2);p.push(_),S===0?v+=_:S<g&&(v+=2*_)}for(let S=0;S<p.length;S++)p[S]=p[S]/v;d.envMap.value=t.texture,d.samples.value=g,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:y}=this;d.dTheta.value=m,d.mipInt.value=y-n;let b=this._sizeLods[i],w=3*b*(i>y-is?i-y+is:0),M=4*(this._cubeSize-b);Xr(e,w,M,3*b,2*b),l.setRenderTarget(e),l.render(u,Fa)}};function C0(s){let t=[],e=[],n=[],i=s,r=s-is+1+Mh.length;for(let o=0;o<r;o++){let a=Math.pow(2,i);e.push(a);let l=1/a;o>s-is?l=Mh[o-s+is-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,m=6,x=3,g=2,p=1,v=new Float32Array(x*m*f),y=new Float32Array(g*m*f),b=new Float32Array(p*m*f);for(let M=0;M<f;M++){let S=M%3*2/3-1,C=M>2?0:-1,_=[S,C,0,S+2/3,C,0,S+2/3,C+1,0,S,C,0,S+2/3,C+1,0,S,C+1,0];v.set(_,x*m*M),y.set(d,g*m*M);let E=[M,M,M,M,M,M];b.set(E,p*m*M)}let w=new ne;w.setAttribute("position",new Me(v,x)),w.setAttribute("uv",new Me(y,g)),w.setAttribute("faceIndex",new Me(b,p)),t.push(w),i>is&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Sh(s,t,e){let n=new xn(s,t,e);return n.texture.mapping=Po,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xr(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function R0(s,t,e){let n=new Float32Array(vi),i=new A(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:vi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Eh(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Ah(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qn,depthTest:!1,depthWrite:!1})}function Ol(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function P0(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ya||l===Za,h=l===cs||l===hs;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new xo(s)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{let u=a.image;if(c&&u&&u.height>0||h&&u&&i(u)){e===null&&(e=new xo(s));let d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function i(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function L0(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let i=e(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function I0(s,t,e,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let m in d.attributes)t.remove(d.attributes[m]);for(let m in d.morphAttributes){let x=d.morphAttributes[m];for(let g=0,p=x.length;g<p;g++)t.remove(x[g])}d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let m in d)t.update(d[m],s.ARRAY_BUFFER);let f=u.morphAttributes;for(let m in f){let x=f[m];for(let g=0,p=x.length;g<p;g++)t.update(x[g],s.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,m=u.attributes.position,x=0;if(f!==null){let v=f.array;x=f.version;for(let y=0,b=v.length;y<b;y+=3){let w=v[y+0],M=v[y+1],S=v[y+2];d.push(w,M,M,S,S,w)}}else if(m!==void 0){let v=m.array;x=m.version;for(let y=0,b=v.length/3-1;y<b;y+=3){let w=y+0,M=y+1,S=y+2;d.push(w,M,M,S,S,w)}}else return;let g=new(Su(d)?po:wi)(d,1);g.version=x;let p=r.get(u);p&&t.remove(p),r.set(u,g)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function N0(s,t,e,n){let i=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,m){s.drawElements(r,m,a,f*l),e.update(m,r,1)}function u(f,m,x){if(x===0)return;let g,p;if(i)g=s,p="drawElementsInstanced";else if(g=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",g===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}g[p](r,m,a,f*l,x),e.update(m,r,x)}function d(f,m,x){if(x===0)return;let g=t.get("WEBGL_multi_draw");if(g===null)for(let p=0;p<x;p++)this.render(f[p]/l,m[p]);else{g.multiDrawElementsWEBGL(r,m,0,a,f,0,x);let p=0;for(let v=0;v<x;v++)p+=m[v];e.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function D0(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function U0(s,t){return s[0]-t[0]}function O0(s,t){return Math.abs(t[1])-Math.abs(s[1])}function F0(s,t,e){let n={},i=new Float32Array(8),r=new WeakMap,o=new de,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,m=f!==void 0?f.length:0,x=r.get(h);if(x===void 0||x.count!==m){let L=function(){k.dispose(),r.delete(h),h.removeEventListener("dispose",L)};x!==void 0&&x.texture.dispose();let v=h.morphAttributes.position!==void 0,y=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],M=h.morphAttributes.normal||[],S=h.morphAttributes.color||[],C=0;v===!0&&(C=1),y===!0&&(C=2),b===!0&&(C=3);let _=h.attributes.position.count*C,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);let N=new Float32Array(_*E*4*m),k=new fo(N,_,E,m);k.type=On,k.needsUpdate=!0;let Q=C*4;for(let U=0;U<m;U++){let D=w[U],H=M[U],G=S[U],B=_*E*4*U;for(let j=0;j<D.count;j++){let $=j*Q;v===!0&&(o.fromBufferAttribute(D,j),N[B+$+0]=o.x,N[B+$+1]=o.y,N[B+$+2]=o.z,N[B+$+3]=0),y===!0&&(o.fromBufferAttribute(H,j),N[B+$+4]=o.x,N[B+$+5]=o.y,N[B+$+6]=o.z,N[B+$+7]=0),b===!0&&(o.fromBufferAttribute(G,j),N[B+$+8]=o.x,N[B+$+9]=o.y,N[B+$+10]=o.z,N[B+$+11]=G.itemSize===4?o.w:1)}}x={count:m,texture:k,size:new Nt(_,E)},r.set(h,x),h.addEventListener("dispose",L)}let g=0;for(let v=0;v<d.length;v++)g+=d[v];let p=h.morphTargetsRelative?1:1-g;u.getUniforms().setValue(s,"morphTargetBaseInfluence",p),u.getUniforms().setValue(s,"morphTargetInfluences",d),u.getUniforms().setValue(s,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}else{let f=d===void 0?0:d.length,m=n[h.id];if(m===void 0||m.length!==f){m=[];for(let y=0;y<f;y++)m[y]=[y,0];n[h.id]=m}for(let y=0;y<f;y++){let b=m[y];b[0]=y,b[1]=d[y]}m.sort(O0);for(let y=0;y<8;y++)y<f&&m[y][1]?(a[y][0]=m[y][0],a[y][1]=m[y][1]):(a[y][0]=Number.MAX_SAFE_INTEGER,a[y][1]=0);a.sort(U0);let x=h.morphAttributes.position,g=h.morphAttributes.normal,p=0;for(let y=0;y<8;y++){let b=a[y],w=b[0],M=b[1];w!==Number.MAX_SAFE_INTEGER&&M?(x&&h.getAttribute("morphTarget"+y)!==x[w]&&h.setAttribute("morphTarget"+y,x[w]),g&&h.getAttribute("morphNormal"+y)!==g[w]&&h.setAttribute("morphNormal"+y,g[w]),i[y]=M,p+=M):(x&&h.hasAttribute("morphTarget"+y)===!0&&h.deleteAttribute("morphTarget"+y),g&&h.hasAttribute("morphNormal"+y)===!0&&h.deleteAttribute("morphNormal"+y),i[y]=0)}let v=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(s,"morphTargetBaseInfluence",v),u.getUniforms().setValue(s,"morphTargetInfluences",i)}}return{update:l}}function k0(s,t,e,n){let i=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function o(){i=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var yo=class extends Je{constructor(t,e,n,i,r,o,a,l,c,h){if(h=h!==void 0?h:Mi,h!==Mi&&h!==ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Mi&&(n=Jn),n===void 0&&h===ds&&(n=_i),super(null,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ie,this.minFilter=l!==void 0?l:Ie,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},Cu=new Je,Ru=new yo(1,1);Ru.compareFunction=bu;var Pu=new fo,Lu=new tl,Iu=new go,Th=[],Ch=[],Rh=new Float32Array(16),Ph=new Float32Array(9),Lh=new Float32Array(4);function _s(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=Th[i];if(r===void 0&&(r=new Float32Array(i),Th[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function Ae(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Te(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Io(s,t){let e=Ch[t];e===void 0&&(e=new Int32Array(t),Ch[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function z0(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function B0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2fv(this.addr,t),Te(e,t)}}function V0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;s.uniform3fv(this.addr,t),Te(e,t)}}function H0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4fv(this.addr,t),Te(e,t)}}function G0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Lh.set(n),s.uniformMatrix2fv(this.addr,!1,Lh),Te(e,n)}}function W0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Ph.set(n),s.uniformMatrix3fv(this.addr,!1,Ph),Te(e,n)}}function q0(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ae(e,n))return;Rh.set(n),s.uniformMatrix4fv(this.addr,!1,Rh),Te(e,n)}}function X0(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function $0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2iv(this.addr,t),Te(e,t)}}function Y0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3iv(this.addr,t),Te(e,t)}}function Z0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4iv(this.addr,t),Te(e,t)}}function j0(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function K0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;s.uniform2uiv(this.addr,t),Te(e,t)}}function J0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;s.uniform3uiv(this.addr,t),Te(e,t)}}function Q0(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;s.uniform4uiv(this.addr,t),Te(e,t)}}function tx(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r=this.type===s.SAMPLER_2D_SHADOW?Ru:Cu;e.setTexture2D(t||r,i)}function ex(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Lu,i)}function nx(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Iu,i)}function ix(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Pu,i)}function sx(s){switch(s){case 5126:return z0;case 35664:return B0;case 35665:return V0;case 35666:return H0;case 35674:return G0;case 35675:return W0;case 35676:return q0;case 5124:case 35670:return X0;case 35667:case 35671:return $0;case 35668:case 35672:return Y0;case 35669:case 35673:return Z0;case 5125:return j0;case 36294:return K0;case 36295:return J0;case 36296:return Q0;case 35678:case 36198:case 36298:case 36306:case 35682:return tx;case 35679:case 36299:case 36307:return ex;case 35680:case 36300:case 36308:case 36293:return nx;case 36289:case 36303:case 36311:case 36292:return ix}}function rx(s,t){s.uniform1fv(this.addr,t)}function ox(s,t){let e=_s(t,this.size,2);s.uniform2fv(this.addr,e)}function ax(s,t){let e=_s(t,this.size,3);s.uniform3fv(this.addr,e)}function lx(s,t){let e=_s(t,this.size,4);s.uniform4fv(this.addr,e)}function cx(s,t){let e=_s(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function hx(s,t){let e=_s(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function ux(s,t){let e=_s(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function dx(s,t){s.uniform1iv(this.addr,t)}function fx(s,t){s.uniform2iv(this.addr,t)}function px(s,t){s.uniform3iv(this.addr,t)}function mx(s,t){s.uniform4iv(this.addr,t)}function gx(s,t){s.uniform1uiv(this.addr,t)}function xx(s,t){s.uniform2uiv(this.addr,t)}function yx(s,t){s.uniform3uiv(this.addr,t)}function vx(s,t){s.uniform4uiv(this.addr,t)}function _x(s,t,e){let n=this.cache,i=t.length,r=Io(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||Cu,r[o])}function Mx(s,t,e){let n=this.cache,i=t.length,r=Io(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Lu,r[o])}function bx(s,t,e){let n=this.cache,i=t.length,r=Io(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Iu,r[o])}function wx(s,t,e){let n=this.cache,i=t.length,r=Io(e,i);Ae(n,r)||(s.uniform1iv(this.addr,r),Te(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Pu,r[o])}function Sx(s){switch(s){case 5126:return rx;case 35664:return ox;case 35665:return ax;case 35666:return lx;case 35674:return cx;case 35675:return hx;case 35676:return ux;case 5124:case 35670:return dx;case 35667:case 35671:return fx;case 35668:case 35672:return px;case 35669:case 35673:return mx;case 5125:return gx;case 36294:return xx;case 36295:return yx;case 36296:return vx;case 35678:case 36198:case 36298:case 36306:case 35682:return _x;case 35679:case 36299:case 36307:return Mx;case 35680:case 36300:case 36308:case 36293:return bx;case 36289:case 36303:case 36311:case 36292:return wx}}var il=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=sx(e.type)}},sl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Sx(e.type)}},rl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},Va=/(\w+)(\])?(\[|\.)?/g;function Ih(s,t){s.seq.push(t),s.map[t.id]=t}function Ex(s,t,e){let n=s.name,i=n.length;for(Va.lastIndex=0;;){let r=Va.exec(n),o=Va.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Ih(e,c===void 0?new il(a,s,t):new sl(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new rl(a),Ih(e,u)),e=u}}}var ls=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);Ex(r,o,this)}}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function Nh(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}var Ax=37297,Tx=0;function Cx(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Rx(s){let t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(s),n;switch(t===e?n="":t===oo&&e===ro?n="LinearDisplayP3ToLinearSRGB":t===ro&&e===oo&&(n="LinearSRGBToLinearDisplayP3"),s){case kn:case Lo:return[n,"LinearTransferOETF"];case ve:case Dl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function Dh(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";let r=/ERROR: 0:(\d+)/.exec(i);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Cx(s.getShaderSource(t),o)}else return i}function Px(s,t){let e=Rx(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Lx(s,t){let e;switch(t){case Of:e="Linear";break;case Ff:e="Reinhard";break;case kf:e="OptimizedCineon";break;case zf:e="ACESFilmic";break;case Vf:e="AgX";break;case Bf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Ix(s){return[s.extensionDerivatives||s.envMapCubeUVHeight||s.bumpMap||s.normalMapTangentSpace||s.clearcoatNormalMap||s.flatShading||s.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(s.extensionFragDepth||s.logarithmicDepthBuffer)&&s.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",s.extensionDrawBuffers&&s.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(s.extensionShaderTextureLOD||s.envMap||s.transmission)&&s.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ss).join(`
`)}function Nx(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ss).join(`
`)}function Dx(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Ux(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function ss(s){return s!==""}function Uh(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Oh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Ox=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(s){return s.replace(Ox,kx)}var Fx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function kx(s,t){let e=qt[t];if(e===void 0){let n=Fx.get(t);if(n!==void 0)e=qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ol(e)}var zx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fh(s){return s.replace(zx,Bx)}function Bx(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function kh(s){let t="precision "+s.precision+` float;
precision `+s.precision+" int;";return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Vx(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===hu?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===hf?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Un&&(t="SHADOWMAP_TYPE_VSM"),t}function Hx(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case cs:case hs:t="ENVMAP_TYPE_CUBE";break;case Po:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Gx(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case hs:t="ENVMAP_MODE_REFRACTION";break}return t}function Wx(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case uu:t="ENVMAP_BLENDING_MULTIPLY";break;case Df:t="ENVMAP_BLENDING_MIX";break;case Uf:t="ENVMAP_BLENDING_ADD";break}return t}function qx(s){let t=s.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Xx(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Vx(e),c=Hx(e),h=Gx(e),u=Wx(e),d=qx(e),f=e.isWebGL2?"":Ix(e),m=Nx(e),x=Dx(r),g=i.createProgram(),p,v,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(ss).join(`
`),p.length>0&&(p+=`
`),v=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(ss).join(`
`),v.length>0&&(v+=`
`)):(p=[kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ss).join(`
`),v=[f,kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ti?"#define TONE_MAPPING":"",e.toneMapping!==ti?qt.tonemapping_pars_fragment:"",e.toneMapping!==ti?Lx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,Px("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ss).join(`
`)),o=ol(o),o=Uh(o,e),o=Oh(o,e),a=ol(a),a=Uh(a,e),a=Oh(a,e),o=Fh(o),a=Fh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,v=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===ih?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ih?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);let b=y+p+o,w=y+v+a,M=Nh(i,i.VERTEX_SHADER,b),S=Nh(i,i.FRAGMENT_SHADER,w);i.attachShader(g,M),i.attachShader(g,S),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function C(k){if(s.debug.checkShaderErrors){let Q=i.getProgramInfoLog(g).trim(),L=i.getShaderInfoLog(M).trim(),U=i.getShaderInfoLog(S).trim(),D=!0,H=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(D=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,M,S);else{let G=Dh(i,M,"vertex"),B=Dh(i,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Program Info Log: `+Q+`
`+G+`
`+B)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(L===""||U==="")&&(H=!1);H&&(k.diagnostics={runnable:D,programLog:Q,vertexShader:{log:L,prefix:p},fragmentShader:{log:U,prefix:v}})}i.deleteShader(M),i.deleteShader(S),_=new ls(i,g),E=Ux(i,g)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let N=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=i.getProgramParameter(g,Ax)),N},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Tx++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=M,this.fragmentShader=S,this}var $x=0,al=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new ll(t),e.set(t,n)),n}},ll=class{constructor(t){this.id=$x++,this.code=t,this.usedTimes=0}};function Yx(s,t,e,n,i,r,o){let a=new qs,l=new al,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,d=i.vertexTextures,f=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function g(_,E,N,k,Q){let L=k.fog,U=Q.geometry,D=_.isMeshStandardMaterial?k.environment:null,H=(_.isMeshStandardMaterial?e:t).get(_.envMap||D),G=H&&H.mapping===Po?H.image.height:null,B=m[_.type];_.precision!==null&&(f=i.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let j=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,$=j!==void 0?j.length:0,et=0;U.morphAttributes.position!==void 0&&(et=1),U.morphAttributes.normal!==void 0&&(et=2),U.morphAttributes.color!==void 0&&(et=3);let F,W,J,z;if(B){let We=wn[B];F=We.vertexShader,W=We.fragmentShader}else F=_.vertexShader,W=_.fragmentShader,l.update(_),J=l.getVertexShaderID(_),z=l.getFragmentShaderID(_);let tt=s.getRenderTarget(),xt=Q.isInstancedMesh===!0,St=Q.isBatchedMesh===!0,Mt=!!_.map,Wt=!!_.matcap,X=!!H,xe=!!_.aoMap,Ct=!!_.lightMap,At=!!_.bumpMap,yt=!!_.normalMap,ie=!!_.displacementMap,It=!!_.emissiveMap,P=!!_.metalnessMap,T=!!_.roughnessMap,q=_.anisotropy>0,lt=_.clearcoat>0,rt=_.iridescence>0,at=_.sheen>0,Et=_.transmission>0,gt=q&&!!_.anisotropyMap,bt=lt&&!!_.clearcoatMap,Ut=lt&&!!_.clearcoatNormalMap,Ht=lt&&!!_.clearcoatRoughnessMap,it=rt&&!!_.iridescenceMap,jt=rt&&!!_.iridescenceThicknessMap,I=at&&!!_.sheenColorMap,nt=at&&!!_.sheenRoughnessMap,ft=!!_.specularMap,ct=!!_.specularColorMap,Tt=!!_.specularIntensityMap,Yt=Et&&!!_.transmissionMap,Kt=Et&&!!_.thicknessMap,Xt=!!_.gradientMap,dt=!!_.alphaMap,O=_.alphaTest>0,ht=!!_.alphaHash,ut=!!_.extensions,Dt=!!U.attributes.uv1,Rt=!!U.attributes.uv2,te=!!U.attributes.uv3,ee=ti;return _.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(ee=s.toneMapping),{isWebGL2:h,shaderID:B,shaderType:_.type,shaderName:_.name,vertexShader:F,fragmentShader:W,defines:_.defines,customVertexShaderID:J,customFragmentShaderID:z,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:St,instancing:xt,instancingColor:xt&&Q.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:tt===null?s.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:kn,map:Mt,matcap:Wt,envMap:X,envMapMode:X&&H.mapping,envMapCubeUVHeight:G,aoMap:xe,lightMap:Ct,bumpMap:At,normalMap:yt,displacementMap:d&&ie,emissiveMap:It,normalMapObjectSpace:yt&&_.normalMapType===Qf,normalMapTangentSpace:yt&&_.normalMapType===Mu,metalnessMap:P,roughnessMap:T,anisotropy:q,anisotropyMap:gt,clearcoat:lt,clearcoatMap:bt,clearcoatNormalMap:Ut,clearcoatRoughnessMap:Ht,iridescence:rt,iridescenceMap:it,iridescenceThicknessMap:jt,sheen:at,sheenColorMap:I,sheenRoughnessMap:nt,specularMap:ft,specularColorMap:ct,specularIntensityMap:Tt,transmission:Et,transmissionMap:Yt,thicknessMap:Kt,gradientMap:Xt,opaque:_.transparent===!1&&_.blending===os,alphaMap:dt,alphaTest:O,alphaHash:ht,combine:_.combine,mapUv:Mt&&x(_.map.channel),aoMapUv:xe&&x(_.aoMap.channel),lightMapUv:Ct&&x(_.lightMap.channel),bumpMapUv:At&&x(_.bumpMap.channel),normalMapUv:yt&&x(_.normalMap.channel),displacementMapUv:ie&&x(_.displacementMap.channel),emissiveMapUv:It&&x(_.emissiveMap.channel),metalnessMapUv:P&&x(_.metalnessMap.channel),roughnessMapUv:T&&x(_.roughnessMap.channel),anisotropyMapUv:gt&&x(_.anisotropyMap.channel),clearcoatMapUv:bt&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:Ut&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ht&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:I&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:nt&&x(_.sheenRoughnessMap.channel),specularMapUv:ft&&x(_.specularMap.channel),specularColorMapUv:ct&&x(_.specularColorMap.channel),specularIntensityMapUv:Tt&&x(_.specularIntensityMap.channel),transmissionMapUv:Yt&&x(_.transmissionMap.channel),thicknessMapUv:Kt&&x(_.thicknessMap.channel),alphaMapUv:dt&&x(_.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(yt||q),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:Dt,vertexUv2s:Rt,vertexUv3s:te,pointsUvs:Q.isPoints===!0&&!!U.attributes.uv&&(Mt||dt),fog:!!L,useFog:_.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Q.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:et,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&N.length>0,shadowMapType:s.shadowMap.type,toneMapping:ee,useLegacyLights:s._useLegacyLights,decodeVideoTexture:Mt&&_.map.isVideoTexture===!0&&se.getTransfer(_.map.colorSpace)===ce,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===Ve,flipSided:_.side===Ke,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:ut&&_.extensions.derivatives===!0,extensionFragDepth:ut&&_.extensions.fragDepth===!0,extensionDrawBuffers:ut&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let N in _.defines)E.push(N),E.push(_.defines[N]);return _.isRawShaderMaterial===!1&&(v(E,_),y(E,_),E.push(s.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function v(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function y(_,E){a.disableAll(),E.isWebGL2&&a.enable(0),E.supportsVertexTextures&&a.enable(1),E.instancing&&a.enable(2),E.instancingColor&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.skinning&&a.enable(4),E.morphTargets&&a.enable(5),E.morphNormals&&a.enable(6),E.morphColors&&a.enable(7),E.premultipliedAlpha&&a.enable(8),E.shadowMapEnabled&&a.enable(9),E.useLegacyLights&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),_.push(a.mask)}function b(_){let E=m[_.type],N;if(E){let k=wn[E];N=Fp.clone(k.uniforms)}else N=_.uniforms;return N}function w(_,E){let N;for(let k=0,Q=c.length;k<Q;k++){let L=c[k];if(L.cacheKey===E){N=L,++N.usedTimes;break}}return N===void 0&&(N=new Xx(s,E,_,r),c.push(N)),N}function M(_){if(--_.usedTimes===0){let E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),_.destroy()}}function S(_){l.remove(_)}function C(){l.dispose()}return{getParameters:g,getProgramCacheKey:p,getUniforms:b,acquireProgram:w,releaseProgram:M,releaseShaderCache:S,programs:c,dispose:C}}function Zx(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function jx(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function zh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Bh(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,f,m,x,g){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:m,renderOrder:u.renderOrder,z:x,group:g},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=m,p.renderOrder=u.renderOrder,p.z=x,p.group=g),t++,p}function a(u,d,f,m,x,g){let p=o(u,d,f,m,x,g);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,m,x,g){let p=o(u,d,f,m,x,g);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||jx),n.length>1&&n.sort(d||zh),i.length>1&&i.sort(d||zh)}function h(){for(let u=t,d=s.length;u<d;u++){let f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:l,finish:h,sort:c}}function Kx(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new Bh,s.set(n,[o])):i>=r.length?(o=new Bh,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Jx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new A,color:new wt};break;case"SpotLight":e={position:new A,direction:new A,color:new wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new A,color:new wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new A,skyColor:new wt,groundColor:new wt};break;case"RectAreaLight":e={color:new wt,position:new A,halfWidth:new A,halfHeight:new A};break}return s[t.id]=e,e}}}function Qx(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}var ty=0;function ey(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function ny(s,t){let e=new Jx,n=Qx(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new A);let r=new A,o=new st,a=new st;function l(h,u){let d=0,f=0,m=0;for(let k=0;k<9;k++)i.probe[k].set(0,0,0);let x=0,g=0,p=0,v=0,y=0,b=0,w=0,M=0,S=0,C=0,_=0;h.sort(ey);let E=u===!0?Math.PI:1;for(let k=0,Q=h.length;k<Q;k++){let L=h[k],U=L.color,D=L.intensity,H=L.distance,G=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=U.r*D*E,f+=U.g*D*E,m+=U.b*D*E;else if(L.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(L.sh.coefficients[B],D);_++}else if(L.isDirectionalLight){let B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity*E),L.castShadow){let j=L.shadow,$=n.get(L);$.shadowBias=j.bias,$.shadowNormalBias=j.normalBias,$.shadowRadius=j.radius,$.shadowMapSize=j.mapSize,i.directionalShadow[x]=$,i.directionalShadowMap[x]=G,i.directionalShadowMatrix[x]=L.shadow.matrix,b++}i.directional[x]=B,x++}else if(L.isSpotLight){let B=e.get(L);B.position.setFromMatrixPosition(L.matrixWorld),B.color.copy(U).multiplyScalar(D*E),B.distance=H,B.coneCos=Math.cos(L.angle),B.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),B.decay=L.decay,i.spot[p]=B;let j=L.shadow;if(L.map&&(i.spotLightMap[S]=L.map,S++,j.updateMatrices(L),L.castShadow&&C++),i.spotLightMatrix[p]=j.matrix,L.castShadow){let $=n.get(L);$.shadowBias=j.bias,$.shadowNormalBias=j.normalBias,$.shadowRadius=j.radius,$.shadowMapSize=j.mapSize,i.spotShadow[p]=$,i.spotShadowMap[p]=G,M++}p++}else if(L.isRectAreaLight){let B=e.get(L);B.color.copy(U).multiplyScalar(D),B.halfWidth.set(L.width*.5,0,0),B.halfHeight.set(0,L.height*.5,0),i.rectArea[v]=B,v++}else if(L.isPointLight){let B=e.get(L);if(B.color.copy(L.color).multiplyScalar(L.intensity*E),B.distance=L.distance,B.decay=L.decay,L.castShadow){let j=L.shadow,$=n.get(L);$.shadowBias=j.bias,$.shadowNormalBias=j.normalBias,$.shadowRadius=j.radius,$.shadowMapSize=j.mapSize,$.shadowCameraNear=j.camera.near,$.shadowCameraFar=j.camera.far,i.pointShadow[g]=$,i.pointShadowMap[g]=G,i.pointShadowMatrix[g]=L.shadow.matrix,w++}i.point[g]=B,g++}else if(L.isHemisphereLight){let B=e.get(L);B.skyColor.copy(L.color).multiplyScalar(D*E),B.groundColor.copy(L.groundColor).multiplyScalar(D*E),i.hemi[y]=B,y++}}v>0&&(t.isWebGL2?s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2):s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_FLOAT_1,i.rectAreaLTC2=pt.LTC_FLOAT_2):s.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=pt.LTC_HALF_1,i.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=m;let N=i.hash;(N.directionalLength!==x||N.pointLength!==g||N.spotLength!==p||N.rectAreaLength!==v||N.hemiLength!==y||N.numDirectionalShadows!==b||N.numPointShadows!==w||N.numSpotShadows!==M||N.numSpotMaps!==S||N.numLightProbes!==_)&&(i.directional.length=x,i.spot.length=p,i.rectArea.length=v,i.point.length=g,i.hemi.length=y,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=w,i.pointShadowMap.length=w,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=w,i.spotLightMatrix.length=M+S-C,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=_,N.directionalLength=x,N.pointLength=g,N.spotLength=p,N.rectAreaLength=v,N.hemiLength=y,N.numDirectionalShadows=b,N.numPointShadows=w,N.numSpotShadows=M,N.numSpotMaps=S,N.numLightProbes=_,i.version=ty++)}function c(h,u){let d=0,f=0,m=0,x=0,g=0,p=u.matrixWorldInverse;for(let v=0,y=h.length;v<y;v++){let b=h[v];if(b.isDirectionalLight){let w=i.directional[d];w.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),d++}else if(b.isSpotLight){let w=i.spot[m];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),m++}else if(b.isRectAreaLight){let w=i.rectArea[x];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(p),a.identity(),o.copy(b.matrixWorld),o.premultiply(p),a.extractRotation(o),w.halfWidth.set(b.width*.5,0,0),w.halfHeight.set(0,b.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(b.isPointLight){let w=i.point[f];w.position.setFromMatrixPosition(b.matrixWorld),w.position.applyMatrix4(p),f++}else if(b.isHemisphereLight){let w=i.hemi[g];w.direction.setFromMatrixPosition(b.matrixWorld),w.direction.transformDirection(p),g++}}}return{setup:l,setupView:c,state:i}}function Vh(s,t){let e=new ny(s,t),n=[],i=[];function r(){n.length=0,i.length=0}function o(u){n.push(u)}function a(u){i.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:i,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function iy(s,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new Vh(s,t),e.set(r,[l])):o>=a.length?(l=new Vh(s,t),a.push(l)):l=a[o],l}function i(){e=new WeakMap}return{get:n,dispose:i}}var cl=class extends Bn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Kf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},hl=class extends Bn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},sy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ry=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function oy(s,t,e){let n=new Xs,i=new Nt,r=new Nt,o=new de,a=new cl({depthPacking:Jf}),l=new hl,c={},h=e.maxTextureSize,u={[ni]:Ke,[Ke]:ni,[Ve]:Ve},d=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Nt},radius:{value:4}},vertexShader:sy,fragmentShader:ry}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let m=new ne;m.setAttribute("position",new Me(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new mt(m,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hu;let p=this.type;this.render=function(M,S,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||M.length===0)return;let _=s.getRenderTarget(),E=s.getActiveCubeFace(),N=s.getActiveMipmapLevel(),k=s.state;k.setBlending(Qn),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let Q=p!==Un&&this.type===Un,L=p===Un&&this.type!==Un;for(let U=0,D=M.length;U<D;U++){let H=M[U],G=H.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);let B=G.getFrameExtents();if(i.multiply(B),r.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/B.x),i.x=r.x*B.x,G.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/B.y),i.y=r.y*B.y,G.mapSize.y=r.y)),G.map===null||Q===!0||L===!0){let $=this.type!==Un?{minFilter:Ie,magFilter:Ie}:{};G.map!==null&&G.map.dispose(),G.map=new xn(i.x,i.y,$),G.map.texture.name=H.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();let j=G.getViewportCount();for(let $=0;$<j;$++){let et=G.getViewport($);o.set(r.x*et.x,r.y*et.y,r.x*et.z,r.y*et.w),k.viewport(o),G.updateMatrices(H,$),n=G.getFrustum(),b(S,C,G.camera,H,this.type)}G.isPointLightShadow!==!0&&this.type===Un&&v(G,C),G.needsUpdate=!1}p=this.type,g.needsUpdate=!1,s.setRenderTarget(_,E,N)};function v(M,S){let C=t.update(x);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new xn(i.x,i.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(S,null,C,d,x,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(S,null,C,f,x,null)}function y(M,S,C,_){let E=null,N=C.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(N!==void 0)E=N;else if(E=C.isPointLight===!0?l:a,s.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let k=E.uuid,Q=S.uuid,L=c[k];L===void 0&&(L={},c[k]=L);let U=L[Q];U===void 0&&(U=E.clone(),L[Q]=U,S.addEventListener("dispose",w)),E=U}if(E.visible=S.visible,E.wireframe=S.wireframe,_===Un?E.side=S.shadowSide!==null?S.shadowSide:S.side:E.side=S.shadowSide!==null?S.shadowSide:u[S.side],E.alphaMap=S.alphaMap,E.alphaTest=S.alphaTest,E.map=S.map,E.clipShadows=S.clipShadows,E.clippingPlanes=S.clippingPlanes,E.clipIntersection=S.clipIntersection,E.displacementMap=S.displacementMap,E.displacementScale=S.displacementScale,E.displacementBias=S.displacementBias,E.wireframeLinewidth=S.wireframeLinewidth,E.linewidth=S.linewidth,C.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let k=s.properties.get(E);k.light=C}return E}function b(M,S,C,_,E){if(M.visible===!1)return;if(M.layers.test(S.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&E===Un)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,M.matrixWorld);let Q=t.update(M),L=M.material;if(Array.isArray(L)){let U=Q.groups;for(let D=0,H=U.length;D<H;D++){let G=U[D],B=L[G.materialIndex];if(B&&B.visible){let j=y(M,B,_,E);M.onBeforeShadow(s,M,S,C,Q,j,G),s.renderBufferDirect(C,null,Q,j,M,G),M.onAfterShadow(s,M,S,C,Q,j,G)}}}else if(L.visible){let U=y(M,L,_,E);M.onBeforeShadow(s,M,S,C,Q,U,null),s.renderBufferDirect(C,null,Q,U,M,null),M.onAfterShadow(s,M,S,C,Q,U,null)}}let k=M.children;for(let Q=0,L=k.length;Q<L;Q++)b(k[Q],S,C,_,E)}function w(M){M.target.removeEventListener("dispose",w);for(let C in c){let _=c[C],E=M.target.uuid;E in _&&(_[E].dispose(),delete _[E])}}}function ay(s,t,e){let n=e.isWebGL2;function i(){let O=!1,ht=new de,ut=null,Dt=new de(0,0,0,0);return{setMask:function(Rt){ut!==Rt&&!O&&(s.colorMask(Rt,Rt,Rt,Rt),ut=Rt)},setLocked:function(Rt){O=Rt},setClear:function(Rt,te,ee,Re,We){We===!0&&(Rt*=Re,te*=Re,ee*=Re),ht.set(Rt,te,ee,Re),Dt.equals(ht)===!1&&(s.clearColor(Rt,te,ee,Re),Dt.copy(ht))},reset:function(){O=!1,ut=null,Dt.set(-1,0,0,0)}}}function r(){let O=!1,ht=null,ut=null,Dt=null;return{setTest:function(Rt){Rt?St(s.DEPTH_TEST):Mt(s.DEPTH_TEST)},setMask:function(Rt){ht!==Rt&&!O&&(s.depthMask(Rt),ht=Rt)},setFunc:function(Rt){if(ut!==Rt){switch(Rt){case Tf:s.depthFunc(s.NEVER);break;case Cf:s.depthFunc(s.ALWAYS);break;case Rf:s.depthFunc(s.LESS);break;case eo:s.depthFunc(s.LEQUAL);break;case Pf:s.depthFunc(s.EQUAL);break;case Lf:s.depthFunc(s.GEQUAL);break;case If:s.depthFunc(s.GREATER);break;case Nf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ut=Rt}},setLocked:function(Rt){O=Rt},setClear:function(Rt){Dt!==Rt&&(s.clearDepth(Rt),Dt=Rt)},reset:function(){O=!1,ht=null,ut=null,Dt=null}}}function o(){let O=!1,ht=null,ut=null,Dt=null,Rt=null,te=null,ee=null,Re=null,We=null;return{setTest:function(ae){O||(ae?St(s.STENCIL_TEST):Mt(s.STENCIL_TEST))},setMask:function(ae){ht!==ae&&!O&&(s.stencilMask(ae),ht=ae)},setFunc:function(ae,qe,bn){(ut!==ae||Dt!==qe||Rt!==bn)&&(s.stencilFunc(ae,qe,bn),ut=ae,Dt=qe,Rt=bn)},setOp:function(ae,qe,bn){(te!==ae||ee!==qe||Re!==bn)&&(s.stencilOp(ae,qe,bn),te=ae,ee=qe,Re=bn)},setLocked:function(ae){O=ae},setClear:function(ae){We!==ae&&(s.clearStencil(ae),We=ae)},reset:function(){O=!1,ht=null,ut=null,Dt=null,Rt=null,te=null,ee=null,Re=null,We=null}}}let a=new i,l=new r,c=new o,h=new WeakMap,u=new WeakMap,d={},f={},m=new WeakMap,x=[],g=null,p=!1,v=null,y=null,b=null,w=null,M=null,S=null,C=null,_=new wt(0,0,0),E=0,N=!1,k=null,Q=null,L=null,U=null,D=null,H=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,B=0,j=s.getParameter(s.VERSION);j.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec(j)[1]),G=B>=1):j.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),G=B>=2);let $=null,et={},F=s.getParameter(s.SCISSOR_BOX),W=s.getParameter(s.VIEWPORT),J=new de().fromArray(F),z=new de().fromArray(W);function tt(O,ht,ut,Dt){let Rt=new Uint8Array(4),te=s.createTexture();s.bindTexture(O,te),s.texParameteri(O,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(O,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ee=0;ee<ut;ee++)n&&(O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY)?s.texImage3D(ht,0,s.RGBA,1,1,Dt,0,s.RGBA,s.UNSIGNED_BYTE,Rt):s.texImage2D(ht+ee,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Rt);return te}let xt={};xt[s.TEXTURE_2D]=tt(s.TEXTURE_2D,s.TEXTURE_2D,1),xt[s.TEXTURE_CUBE_MAP]=tt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(xt[s.TEXTURE_2D_ARRAY]=tt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),xt[s.TEXTURE_3D]=tt(s.TEXTURE_3D,s.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),St(s.DEPTH_TEST),l.setFunc(eo),It(!1),P(vc),St(s.CULL_FACE),yt(Qn);function St(O){d[O]!==!0&&(s.enable(O),d[O]=!0)}function Mt(O){d[O]!==!1&&(s.disable(O),d[O]=!1)}function Wt(O,ht){return f[O]!==ht?(s.bindFramebuffer(O,ht),f[O]=ht,n&&(O===s.DRAW_FRAMEBUFFER&&(f[s.FRAMEBUFFER]=ht),O===s.FRAMEBUFFER&&(f[s.DRAW_FRAMEBUFFER]=ht)),!0):!1}function X(O,ht){let ut=x,Dt=!1;if(O)if(ut=m.get(ht),ut===void 0&&(ut=[],m.set(ht,ut)),O.isWebGLMultipleRenderTargets){let Rt=O.texture;if(ut.length!==Rt.length||ut[0]!==s.COLOR_ATTACHMENT0){for(let te=0,ee=Rt.length;te<ee;te++)ut[te]=s.COLOR_ATTACHMENT0+te;ut.length=Rt.length,Dt=!0}}else ut[0]!==s.COLOR_ATTACHMENT0&&(ut[0]=s.COLOR_ATTACHMENT0,Dt=!0);else ut[0]!==s.BACK&&(ut[0]=s.BACK,Dt=!0);Dt&&(e.isWebGL2?s.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function xe(O){return g!==O?(s.useProgram(O),g=O,!0):!1}let Ct={[yi]:s.FUNC_ADD,[df]:s.FUNC_SUBTRACT,[ff]:s.FUNC_REVERSE_SUBTRACT};if(n)Ct[wc]=s.MIN,Ct[Sc]=s.MAX;else{let O=t.get("EXT_blend_minmax");O!==null&&(Ct[wc]=O.MIN_EXT,Ct[Sc]=O.MAX_EXT)}let At={[pf]:s.ZERO,[mf]:s.ONE,[gf]:s.SRC_COLOR,[Xa]:s.SRC_ALPHA,[bf]:s.SRC_ALPHA_SATURATE,[_f]:s.DST_COLOR,[yf]:s.DST_ALPHA,[xf]:s.ONE_MINUS_SRC_COLOR,[$a]:s.ONE_MINUS_SRC_ALPHA,[Mf]:s.ONE_MINUS_DST_COLOR,[vf]:s.ONE_MINUS_DST_ALPHA,[wf]:s.CONSTANT_COLOR,[Sf]:s.ONE_MINUS_CONSTANT_COLOR,[Ef]:s.CONSTANT_ALPHA,[Af]:s.ONE_MINUS_CONSTANT_ALPHA};function yt(O,ht,ut,Dt,Rt,te,ee,Re,We,ae){if(O===Qn){p===!0&&(Mt(s.BLEND),p=!1);return}if(p===!1&&(St(s.BLEND),p=!0),O!==uf){if(O!==v||ae!==N){if((y!==yi||M!==yi)&&(s.blendEquation(s.FUNC_ADD),y=yi,M=yi),ae)switch(O){case os:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _c:s.blendFunc(s.ONE,s.ONE);break;case Mc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case bc:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case os:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case _c:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Mc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case bc:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}b=null,w=null,S=null,C=null,_.set(0,0,0),E=0,v=O,N=ae}return}Rt=Rt||ht,te=te||ut,ee=ee||Dt,(ht!==y||Rt!==M)&&(s.blendEquationSeparate(Ct[ht],Ct[Rt]),y=ht,M=Rt),(ut!==b||Dt!==w||te!==S||ee!==C)&&(s.blendFuncSeparate(At[ut],At[Dt],At[te],At[ee]),b=ut,w=Dt,S=te,C=ee),(Re.equals(_)===!1||We!==E)&&(s.blendColor(Re.r,Re.g,Re.b,We),_.copy(Re),E=We),v=O,N=!1}function ie(O,ht){O.side===Ve?Mt(s.CULL_FACE):St(s.CULL_FACE);let ut=O.side===Ke;ht&&(ut=!ut),It(ut),O.blending===os&&O.transparent===!1?yt(Qn):yt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),a.setMask(O.colorWrite);let Dt=O.stencilWrite;c.setTest(Dt),Dt&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),q(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?St(s.SAMPLE_ALPHA_TO_COVERAGE):Mt(s.SAMPLE_ALPHA_TO_COVERAGE)}function It(O){k!==O&&(O?s.frontFace(s.CW):s.frontFace(s.CCW),k=O)}function P(O){O!==lf?(St(s.CULL_FACE),O!==Q&&(O===vc?s.cullFace(s.BACK):O===cf?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Mt(s.CULL_FACE),Q=O}function T(O){O!==L&&(G&&s.lineWidth(O),L=O)}function q(O,ht,ut){O?(St(s.POLYGON_OFFSET_FILL),(U!==ht||D!==ut)&&(s.polygonOffset(ht,ut),U=ht,D=ut)):Mt(s.POLYGON_OFFSET_FILL)}function lt(O){O?St(s.SCISSOR_TEST):Mt(s.SCISSOR_TEST)}function rt(O){O===void 0&&(O=s.TEXTURE0+H-1),$!==O&&(s.activeTexture(O),$=O)}function at(O,ht,ut){ut===void 0&&($===null?ut=s.TEXTURE0+H-1:ut=$);let Dt=et[ut];Dt===void 0&&(Dt={type:void 0,texture:void 0},et[ut]=Dt),(Dt.type!==O||Dt.texture!==ht)&&($!==ut&&(s.activeTexture(ut),$=ut),s.bindTexture(O,ht||xt[O]),Dt.type=O,Dt.texture=ht)}function Et(){let O=et[$];O!==void 0&&O.type!==void 0&&(s.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function gt(){try{s.compressedTexImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function bt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ut(){try{s.texSubImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ht(){try{s.texSubImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function it(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function jt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function I(){try{s.texStorage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function nt(){try{s.texStorage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ft(){try{s.texImage2D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ct(){try{s.texImage3D.apply(s,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Tt(O){J.equals(O)===!1&&(s.scissor(O.x,O.y,O.z,O.w),J.copy(O))}function Yt(O){z.equals(O)===!1&&(s.viewport(O.x,O.y,O.z,O.w),z.copy(O))}function Kt(O,ht){let ut=u.get(ht);ut===void 0&&(ut=new WeakMap,u.set(ht,ut));let Dt=ut.get(O);Dt===void 0&&(Dt=s.getUniformBlockIndex(ht,O.name),ut.set(O,Dt))}function Xt(O,ht){let Dt=u.get(ht).get(O);h.get(ht)!==Dt&&(s.uniformBlockBinding(ht,Dt,O.__bindingPointIndex),h.set(ht,Dt))}function dt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),n===!0&&(s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null)),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),d={},$=null,et={},f={},m=new WeakMap,x=[],g=null,p=!1,v=null,y=null,b=null,w=null,M=null,S=null,C=null,_=new wt(0,0,0),E=0,N=!1,k=null,Q=null,L=null,U=null,D=null,J.set(0,0,s.canvas.width,s.canvas.height),z.set(0,0,s.canvas.width,s.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:St,disable:Mt,bindFramebuffer:Wt,drawBuffers:X,useProgram:xe,setBlending:yt,setMaterial:ie,setFlipSided:It,setCullFace:P,setLineWidth:T,setPolygonOffset:q,setScissorTest:lt,activeTexture:rt,bindTexture:at,unbindTexture:Et,compressedTexImage2D:gt,compressedTexImage3D:bt,texImage2D:ft,texImage3D:ct,updateUBOMapping:Kt,uniformBlockBinding:Xt,texStorage2D:I,texStorage3D:nt,texSubImage2D:Ut,texSubImage3D:Ht,compressedTexSubImage2D:it,compressedTexSubImage3D:jt,scissor:Tt,viewport:Yt,reset:dt}}function ly(s,t,e,n,i,r,o){let a=i.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,T){return f?new OffscreenCanvas(P,T):co("canvas")}function x(P,T,q,lt){let rt=1;if((P.width>lt||P.height>lt)&&(rt=lt/Math.max(P.width,P.height)),rt<1||T===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){let at=T?lo:Math.floor,Et=at(rt*P.width),gt=at(rt*P.height);u===void 0&&(u=m(Et,gt));let bt=q?m(Et,gt):u;return bt.width=Et,bt.height=gt,bt.getContext("2d").drawImage(P,0,0,Et,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+Et+"x"+gt+")."),bt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function g(P){return Ja(P.width)&&Ja(P.height)}function p(P){return a?!1:P.wrapS!==on||P.wrapT!==on||P.minFilter!==Ie&&P.minFilter!==Ne}function v(P,T){return P.generateMipmaps&&T&&P.minFilter!==Ie&&P.minFilter!==Ne}function y(P){s.generateMipmap(P)}function b(P,T,q,lt,rt=!1){if(a===!1)return T;if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let at=T;if(T===s.RED&&(q===s.FLOAT&&(at=s.R32F),q===s.HALF_FLOAT&&(at=s.R16F),q===s.UNSIGNED_BYTE&&(at=s.R8)),T===s.RED_INTEGER&&(q===s.UNSIGNED_BYTE&&(at=s.R8UI),q===s.UNSIGNED_SHORT&&(at=s.R16UI),q===s.UNSIGNED_INT&&(at=s.R32UI),q===s.BYTE&&(at=s.R8I),q===s.SHORT&&(at=s.R16I),q===s.INT&&(at=s.R32I)),T===s.RG&&(q===s.FLOAT&&(at=s.RG32F),q===s.HALF_FLOAT&&(at=s.RG16F),q===s.UNSIGNED_BYTE&&(at=s.RG8)),T===s.RGBA){let Et=rt?so:se.getTransfer(lt);q===s.FLOAT&&(at=s.RGBA32F),q===s.HALF_FLOAT&&(at=s.RGBA16F),q===s.UNSIGNED_BYTE&&(at=Et===ce?s.SRGB8_ALPHA8:s.RGBA8),q===s.UNSIGNED_SHORT_4_4_4_4&&(at=s.RGBA4),q===s.UNSIGNED_SHORT_5_5_5_1&&(at=s.RGB5_A1)}return(at===s.R16F||at===s.R32F||at===s.RG16F||at===s.RG32F||at===s.RGBA16F||at===s.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function w(P,T,q){return v(P,q)===!0||P.isFramebufferTexture&&P.minFilter!==Ie&&P.minFilter!==Ne?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function M(P){return P===Ie||P===Ac||P===fa?s.NEAREST:s.LINEAR}function S(P){let T=P.target;T.removeEventListener("dispose",S),_(T),T.isVideoTexture&&h.delete(T)}function C(P){let T=P.target;T.removeEventListener("dispose",C),N(T)}function _(P){let T=n.get(P);if(T.__webglInit===void 0)return;let q=P.source,lt=d.get(q);if(lt){let rt=lt[T.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&E(P),Object.keys(lt).length===0&&d.delete(q)}n.remove(P)}function E(P){let T=n.get(P);s.deleteTexture(T.__webglTexture);let q=P.source,lt=d.get(q);delete lt[T.__cacheKey],o.memory.textures--}function N(P){let T=P.texture,q=n.get(P),lt=n.get(T);if(lt.__webglTexture!==void 0&&(s.deleteTexture(lt.__webglTexture),o.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(q.__webglFramebuffer[rt]))for(let at=0;at<q.__webglFramebuffer[rt].length;at++)s.deleteFramebuffer(q.__webglFramebuffer[rt][at]);else s.deleteFramebuffer(q.__webglFramebuffer[rt]);q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer[rt])}else{if(Array.isArray(q.__webglFramebuffer))for(let rt=0;rt<q.__webglFramebuffer.length;rt++)s.deleteFramebuffer(q.__webglFramebuffer[rt]);else s.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&s.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&s.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let rt=0;rt<q.__webglColorRenderbuffer.length;rt++)q.__webglColorRenderbuffer[rt]&&s.deleteRenderbuffer(q.__webglColorRenderbuffer[rt]);q.__webglDepthRenderbuffer&&s.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let rt=0,at=T.length;rt<at;rt++){let Et=n.get(T[rt]);Et.__webglTexture&&(s.deleteTexture(Et.__webglTexture),o.memory.textures--),n.remove(T[rt])}n.remove(T),n.remove(P)}let k=0;function Q(){k=0}function L(){let P=k;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),k+=1,P}function U(P){let T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function D(P,T){let q=n.get(P);if(P.isVideoTexture&&ie(P),P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){let lt=P.image;if(lt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(lt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(q,P,T);return}}e.bindTexture(s.TEXTURE_2D,q.__webglTexture,s.TEXTURE0+T)}function H(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){J(q,P,T);return}e.bindTexture(s.TEXTURE_2D_ARRAY,q.__webglTexture,s.TEXTURE0+T)}function G(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){J(q,P,T);return}e.bindTexture(s.TEXTURE_3D,q.__webglTexture,s.TEXTURE0+T)}function B(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){z(q,P,T);return}e.bindTexture(s.TEXTURE_CUBE_MAP,q.__webglTexture,s.TEXTURE0+T)}let j={[us]:s.REPEAT,[on]:s.CLAMP_TO_EDGE,[ja]:s.MIRRORED_REPEAT},$={[Ie]:s.NEAREST,[Ac]:s.NEAREST_MIPMAP_NEAREST,[fa]:s.NEAREST_MIPMAP_LINEAR,[Ne]:s.LINEAR,[Hf]:s.LINEAR_MIPMAP_NEAREST,[Sn]:s.LINEAR_MIPMAP_LINEAR},et={[tp]:s.NEVER,[op]:s.ALWAYS,[ep]:s.LESS,[bu]:s.LEQUAL,[np]:s.EQUAL,[rp]:s.GEQUAL,[ip]:s.GREATER,[sp]:s.NOTEQUAL};function F(P,T,q){if(q?(s.texParameteri(P,s.TEXTURE_WRAP_S,j[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,j[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,j[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,$[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,$[T.minFilter])):(s.texParameteri(P,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(P,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,s.CLAMP_TO_EDGE),(T.wrapS!==on||T.wrapT!==on)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),s.texParameteri(P,s.TEXTURE_MAG_FILTER,M(T.magFilter)),s.texParameteri(P,s.TEXTURE_MIN_FILTER,M(T.minFilter)),T.minFilter!==Ie&&T.minFilter!==Ne&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,et[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let lt=t.get("EXT_texture_filter_anisotropic");if(T.magFilter===Ie||T.minFilter!==fa&&T.minFilter!==Sn||T.type===On&&t.has("OES_texture_float_linear")===!1||a===!1&&T.type===Gs&&t.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||n.get(T).__currentAnisotropy)&&(s.texParameterf(P,lt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy)}}function W(P,T){let q=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",S));let lt=T.source,rt=d.get(lt);rt===void 0&&(rt={},d.set(lt,rt));let at=U(T);if(at!==P.__cacheKey){rt[at]===void 0&&(rt[at]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,q=!0),rt[at].usedTimes++;let Et=rt[P.__cacheKey];Et!==void 0&&(rt[P.__cacheKey].usedTimes--,Et.usedTimes===0&&E(T)),P.__cacheKey=at,P.__webglTexture=rt[at].texture}return q}function J(P,T,q){let lt=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(lt=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(lt=s.TEXTURE_3D);let rt=W(P,T),at=T.source;e.bindTexture(lt,P.__webglTexture,s.TEXTURE0+q);let Et=n.get(at);if(at.version!==Et.__version||rt===!0){e.activeTexture(s.TEXTURE0+q);let gt=se.getPrimaries(se.workingColorSpace),bt=T.colorSpace===je?null:se.getPrimaries(T.colorSpace),Ut=T.colorSpace===je||gt===bt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);let Ht=p(T)&&g(T.image)===!1,it=x(T.image,Ht,!1,i.maxTextureSize);it=It(T,it);let jt=g(it)||a,I=r.convert(T.format,T.colorSpace),nt=r.convert(T.type),ft=b(T.internalFormat,I,nt,T.colorSpace,T.isVideoTexture);F(lt,T,jt);let ct,Tt=T.mipmaps,Yt=a&&T.isVideoTexture!==!0&&ft!==vu,Kt=Et.__version===void 0||rt===!0,Xt=w(T,it,jt);if(T.isDepthTexture)ft=s.DEPTH_COMPONENT,a?T.type===On?ft=s.DEPTH_COMPONENT32F:T.type===Jn?ft=s.DEPTH_COMPONENT24:T.type===_i?ft=s.DEPTH24_STENCIL8:ft=s.DEPTH_COMPONENT16:T.type===On&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===Mi&&ft===s.DEPTH_COMPONENT&&T.type!==Nl&&T.type!==Jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=Jn,nt=r.convert(T.type)),T.format===ds&&ft===s.DEPTH_COMPONENT&&(ft=s.DEPTH_STENCIL,T.type!==_i&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=_i,nt=r.convert(T.type))),Kt&&(Yt?e.texStorage2D(s.TEXTURE_2D,1,ft,it.width,it.height):e.texImage2D(s.TEXTURE_2D,0,ft,it.width,it.height,0,I,nt,null));else if(T.isDataTexture)if(Tt.length>0&&jt){Yt&&Kt&&e.texStorage2D(s.TEXTURE_2D,Xt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],Yt?e.texSubImage2D(s.TEXTURE_2D,dt,0,0,ct.width,ct.height,I,nt,ct.data):e.texImage2D(s.TEXTURE_2D,dt,ft,ct.width,ct.height,0,I,nt,ct.data);T.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(s.TEXTURE_2D,Xt,ft,it.width,it.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,it.width,it.height,I,nt,it.data)):e.texImage2D(s.TEXTURE_2D,0,ft,it.width,it.height,0,I,nt,it.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Yt&&Kt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,ft,Tt[0].width,Tt[0].height,it.depth);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],T.format!==Ze?I!==null?Yt?e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,dt,0,0,0,ct.width,ct.height,it.depth,I,ct.data,0,0):e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,dt,ft,ct.width,ct.height,it.depth,0,ct.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage3D(s.TEXTURE_2D_ARRAY,dt,0,0,0,ct.width,ct.height,it.depth,I,nt,ct.data):e.texImage3D(s.TEXTURE_2D_ARRAY,dt,ft,ct.width,ct.height,it.depth,0,I,nt,ct.data)}else{Yt&&Kt&&e.texStorage2D(s.TEXTURE_2D,Xt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],T.format!==Ze?I!==null?Yt?e.compressedTexSubImage2D(s.TEXTURE_2D,dt,0,0,ct.width,ct.height,I,ct.data):e.compressedTexImage2D(s.TEXTURE_2D,dt,ft,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage2D(s.TEXTURE_2D,dt,0,0,ct.width,ct.height,I,nt,ct.data):e.texImage2D(s.TEXTURE_2D,dt,ft,ct.width,ct.height,0,I,nt,ct.data)}else if(T.isDataArrayTexture)Yt?(Kt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Xt,ft,it.width,it.height,it.depth),e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,I,nt,it.data)):e.texImage3D(s.TEXTURE_2D_ARRAY,0,ft,it.width,it.height,it.depth,0,I,nt,it.data);else if(T.isData3DTexture)Yt?(Kt&&e.texStorage3D(s.TEXTURE_3D,Xt,ft,it.width,it.height,it.depth),e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,I,nt,it.data)):e.texImage3D(s.TEXTURE_3D,0,ft,it.width,it.height,it.depth,0,I,nt,it.data);else if(T.isFramebufferTexture){if(Kt)if(Yt)e.texStorage2D(s.TEXTURE_2D,Xt,ft,it.width,it.height);else{let dt=it.width,O=it.height;for(let ht=0;ht<Xt;ht++)e.texImage2D(s.TEXTURE_2D,ht,ft,dt,O,0,I,nt,null),dt>>=1,O>>=1}}else if(Tt.length>0&&jt){Yt&&Kt&&e.texStorage2D(s.TEXTURE_2D,Xt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],Yt?e.texSubImage2D(s.TEXTURE_2D,dt,0,0,I,nt,ct):e.texImage2D(s.TEXTURE_2D,dt,ft,I,nt,ct);T.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(s.TEXTURE_2D,Xt,ft,it.width,it.height),e.texSubImage2D(s.TEXTURE_2D,0,0,0,I,nt,it)):e.texImage2D(s.TEXTURE_2D,0,ft,I,nt,it);v(T,jt)&&y(lt),Et.__version=at.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function z(P,T,q){if(T.image.length!==6)return;let lt=W(P,T),rt=T.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+q);let at=n.get(rt);if(rt.version!==at.__version||lt===!0){e.activeTexture(s.TEXTURE0+q);let Et=se.getPrimaries(se.workingColorSpace),gt=T.colorSpace===je?null:se.getPrimaries(T.colorSpace),bt=T.colorSpace===je||Et===gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);let Ut=T.isCompressedTexture||T.image[0].isCompressedTexture,Ht=T.image[0]&&T.image[0].isDataTexture,it=[];for(let dt=0;dt<6;dt++)!Ut&&!Ht?it[dt]=x(T.image[dt],!1,!0,i.maxCubemapSize):it[dt]=Ht?T.image[dt].image:T.image[dt],it[dt]=It(T,it[dt]);let jt=it[0],I=g(jt)||a,nt=r.convert(T.format,T.colorSpace),ft=r.convert(T.type),ct=b(T.internalFormat,nt,ft,T.colorSpace),Tt=a&&T.isVideoTexture!==!0,Yt=at.__version===void 0||lt===!0,Kt=w(T,jt,I);F(s.TEXTURE_CUBE_MAP,T,I);let Xt;if(Ut){Tt&&Yt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Kt,ct,jt.width,jt.height);for(let dt=0;dt<6;dt++){Xt=it[dt].mipmaps;for(let O=0;O<Xt.length;O++){let ht=Xt[O];T.format!==Ze?nt!==null?Tt?e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,0,0,ht.width,ht.height,nt,ht.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,ct,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Tt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,0,0,ht.width,ht.height,nt,ft,ht.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,ct,ht.width,ht.height,0,nt,ft,ht.data)}}}else{Xt=T.mipmaps,Tt&&Yt&&(Xt.length>0&&Kt++,e.texStorage2D(s.TEXTURE_CUBE_MAP,Kt,ct,it[0].width,it[0].height));for(let dt=0;dt<6;dt++)if(Ht){Tt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,it[dt].width,it[dt].height,nt,ft,it[dt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,ct,it[dt].width,it[dt].height,0,nt,ft,it[dt].data);for(let O=0;O<Xt.length;O++){let ut=Xt[O].image[dt].image;Tt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,0,0,ut.width,ut.height,nt,ft,ut.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,ct,ut.width,ut.height,0,nt,ft,ut.data)}}else{Tt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,nt,ft,it[dt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,ct,nt,ft,it[dt]);for(let O=0;O<Xt.length;O++){let ht=Xt[O];Tt?e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,0,0,nt,ft,ht.image[dt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,ct,nt,ft,ht.image[dt])}}}v(T,I)&&y(s.TEXTURE_CUBE_MAP),at.__version=rt.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function tt(P,T,q,lt,rt,at){let Et=r.convert(q.format,q.colorSpace),gt=r.convert(q.type),bt=b(q.internalFormat,Et,gt,q.colorSpace);if(!n.get(T).__hasExternalTextures){let Ht=Math.max(1,T.width>>at),it=Math.max(1,T.height>>at);rt===s.TEXTURE_3D||rt===s.TEXTURE_2D_ARRAY?e.texImage3D(rt,at,bt,Ht,it,T.depth,0,Et,gt,null):e.texImage2D(rt,at,bt,Ht,it,0,Et,gt,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),yt(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,lt,rt,n.get(q).__webglTexture,0,At(T)):(rt===s.TEXTURE_2D||rt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,lt,rt,n.get(q).__webglTexture,at),e.bindFramebuffer(s.FRAMEBUFFER,null)}function xt(P,T,q){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer&&!T.stencilBuffer){let lt=a===!0?s.DEPTH_COMPONENT24:s.DEPTH_COMPONENT16;if(q||yt(T)){let rt=T.depthTexture;rt&&rt.isDepthTexture&&(rt.type===On?lt=s.DEPTH_COMPONENT32F:rt.type===Jn&&(lt=s.DEPTH_COMPONENT24));let at=At(T);yt(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at,lt,T.width,T.height):s.renderbufferStorageMultisample(s.RENDERBUFFER,at,lt,T.width,T.height)}else s.renderbufferStorage(s.RENDERBUFFER,lt,T.width,T.height);s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,P)}else if(T.depthBuffer&&T.stencilBuffer){let lt=At(T);q&&yt(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,lt,s.DEPTH24_STENCIL8,T.width,T.height):yt(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,lt,s.DEPTH24_STENCIL8,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_STENCIL,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.RENDERBUFFER,P)}else{let lt=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let rt=0;rt<lt.length;rt++){let at=lt[rt],Et=r.convert(at.format,at.colorSpace),gt=r.convert(at.type),bt=b(at.internalFormat,Et,gt,at.colorSpace),Ut=At(T);q&&yt(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ut,bt,T.width,T.height):yt(T)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ut,bt,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,bt,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function St(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),D(T.depthTexture,0);let lt=n.get(T.depthTexture).__webglTexture,rt=At(T);if(T.depthTexture.format===Mi)yt(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,lt,0,rt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,lt,0);else if(T.depthTexture.format===ds)yt(T)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,lt,0,rt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function Mt(P){let T=n.get(P),q=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");St(T.__webglFramebuffer,P)}else if(q){T.__webglDepthbuffer=[];for(let lt=0;lt<6;lt++)e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[lt]),T.__webglDepthbuffer[lt]=s.createRenderbuffer(),xt(T.__webglDepthbuffer[lt],P,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=s.createRenderbuffer(),xt(T.__webglDepthbuffer,P,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Wt(P,T,q){let lt=n.get(P);T!==void 0&&tt(lt.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),q!==void 0&&Mt(P)}function X(P){let T=P.texture,q=n.get(P),lt=n.get(T);P.addEventListener("dispose",C),P.isWebGLMultipleRenderTargets!==!0&&(lt.__webglTexture===void 0&&(lt.__webglTexture=s.createTexture()),lt.__version=T.version,o.memory.textures++);let rt=P.isWebGLCubeRenderTarget===!0,at=P.isWebGLMultipleRenderTargets===!0,Et=g(P)||a;if(rt){q.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(a&&T.mipmaps&&T.mipmaps.length>0){q.__webglFramebuffer[gt]=[];for(let bt=0;bt<T.mipmaps.length;bt++)q.__webglFramebuffer[gt][bt]=s.createFramebuffer()}else q.__webglFramebuffer[gt]=s.createFramebuffer()}else{if(a&&T.mipmaps&&T.mipmaps.length>0){q.__webglFramebuffer=[];for(let gt=0;gt<T.mipmaps.length;gt++)q.__webglFramebuffer[gt]=s.createFramebuffer()}else q.__webglFramebuffer=s.createFramebuffer();if(at)if(i.drawBuffers){let gt=P.texture;for(let bt=0,Ut=gt.length;bt<Ut;bt++){let Ht=n.get(gt[bt]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=s.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&P.samples>0&&yt(P)===!1){let gt=at?T:[T];q.__webglMultisampledFramebuffer=s.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let bt=0;bt<gt.length;bt++){let Ut=gt[bt];q.__webglColorRenderbuffer[bt]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,q.__webglColorRenderbuffer[bt]);let Ht=r.convert(Ut.format,Ut.colorSpace),it=r.convert(Ut.type),jt=b(Ut.internalFormat,Ht,it,Ut.colorSpace,P.isXRRenderTarget===!0),I=At(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,I,jt,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+bt,s.RENDERBUFFER,q.__webglColorRenderbuffer[bt])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(q.__webglDepthRenderbuffer=s.createRenderbuffer(),xt(q.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(rt){e.bindTexture(s.TEXTURE_CUBE_MAP,lt.__webglTexture),F(s.TEXTURE_CUBE_MAP,T,Et);for(let gt=0;gt<6;gt++)if(a&&T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)tt(q.__webglFramebuffer[gt][bt],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,bt);else tt(q.__webglFramebuffer[gt],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);v(T,Et)&&y(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(at){let gt=P.texture;for(let bt=0,Ut=gt.length;bt<Ut;bt++){let Ht=gt[bt],it=n.get(Ht);e.bindTexture(s.TEXTURE_2D,it.__webglTexture),F(s.TEXTURE_2D,Ht,Et),tt(q.__webglFramebuffer,P,Ht,s.COLOR_ATTACHMENT0+bt,s.TEXTURE_2D,0),v(Ht,Et)&&y(s.TEXTURE_2D)}e.unbindTexture()}else{let gt=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(a?gt=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(gt,lt.__webglTexture),F(gt,T,Et),a&&T.mipmaps&&T.mipmaps.length>0)for(let bt=0;bt<T.mipmaps.length;bt++)tt(q.__webglFramebuffer[bt],P,T,s.COLOR_ATTACHMENT0,gt,bt);else tt(q.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,gt,0);v(T,Et)&&y(gt),e.unbindTexture()}P.depthBuffer&&Mt(P)}function xe(P){let T=g(P)||a,q=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let lt=0,rt=q.length;lt<rt;lt++){let at=q[lt];if(v(at,T)){let Et=P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,gt=n.get(at).__webglTexture;e.bindTexture(Et,gt),y(Et),e.unbindTexture()}}}function Ct(P){if(a&&P.samples>0&&yt(P)===!1){let T=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],q=P.width,lt=P.height,rt=s.COLOR_BUFFER_BIT,at=[],Et=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,gt=n.get(P),bt=P.isWebGLMultipleRenderTargets===!0;if(bt)for(let Ut=0;Ut<T.length;Ut++)e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ut,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ut,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let Ut=0;Ut<T.length;Ut++){at.push(s.COLOR_ATTACHMENT0+Ut),P.depthBuffer&&at.push(Et);let Ht=gt.__ignoreDepthValues!==void 0?gt.__ignoreDepthValues:!1;if(Ht===!1&&(P.depthBuffer&&(rt|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&(rt|=s.STENCIL_BUFFER_BIT)),bt&&s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Ut]),Ht===!0&&(s.invalidateFramebuffer(s.READ_FRAMEBUFFER,[Et]),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[Et])),bt){let it=n.get(T[Ut]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,it,0)}s.blitFramebuffer(0,0,q,lt,0,0,q,lt,rt,s.NEAREST),c&&s.invalidateFramebuffer(s.READ_FRAMEBUFFER,at)}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),bt)for(let Ut=0;Ut<T.length;Ut++){e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ut,s.RENDERBUFFER,gt.__webglColorRenderbuffer[Ut]);let Ht=n.get(T[Ut]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ut,s.TEXTURE_2D,Ht,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}}function At(P){return Math.min(i.maxSamples,P.samples)}function yt(P){let T=n.get(P);return a&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ie(P){let T=o.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function It(P,T){let q=P.colorSpace,lt=P.format,rt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===Ka||q!==kn&&q!==je&&(se.getTransfer(q)===ce?a===!1?t.has("EXT_sRGB")===!0&&lt===Ze?(P.format=Ka,P.minFilter=Ne,P.generateMipmaps=!1):T=ho.sRGBToLinear(T):(lt!==Ze||rt!==ei)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),T}this.allocateTextureUnit=L,this.resetTextureUnits=Q,this.setTexture2D=D,this.setTexture2DArray=H,this.setTexture3D=G,this.setTextureCube=B,this.rebindTextures=Wt,this.setupRenderTarget=X,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=Ct,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=yt}function cy(s,t,e){let n=e.isWebGL2;function i(r,o=je){let a,l=se.getTransfer(o);if(r===ei)return s.UNSIGNED_BYTE;if(r===pu)return s.UNSIGNED_SHORT_4_4_4_4;if(r===mu)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Gf)return s.BYTE;if(r===Wf)return s.SHORT;if(r===Nl)return s.UNSIGNED_SHORT;if(r===fu)return s.INT;if(r===Jn)return s.UNSIGNED_INT;if(r===On)return s.FLOAT;if(r===Gs)return n?s.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===qf)return s.ALPHA;if(r===Ze)return s.RGBA;if(r===Xf)return s.LUMINANCE;if(r===$f)return s.LUMINANCE_ALPHA;if(r===Mi)return s.DEPTH_COMPONENT;if(r===ds)return s.DEPTH_STENCIL;if(r===Ka)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Yf)return s.RED;if(r===gu)return s.RED_INTEGER;if(r===Zf)return s.RG;if(r===xu)return s.RG_INTEGER;if(r===yu)return s.RGBA_INTEGER;if(r===pa||r===ma||r===ga||r===xa)if(l===ce)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===pa)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ga)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===xa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===pa)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ma)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ga)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===xa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Tc||r===Cc||r===Rc||r===Pc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===Tc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Cc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Rc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Pc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===vu)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Lc||r===Ic)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===Lc)return l===ce?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Ic)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Nc||r===Dc||r===Uc||r===Oc||r===Fc||r===kc||r===zc||r===Bc||r===Vc||r===Hc||r===Gc||r===Wc||r===qc||r===Xc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Nc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Dc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Uc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Oc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Fc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===kc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===zc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Bc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Vc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Hc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Gc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Wc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===qc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Xc)return l===ce?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ya||r===$c||r===Yc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ya)return l===ce?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===$c)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Yc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===jf||r===Zc||r===jc||r===Kc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ya)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Zc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===jc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Kc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===_i?n?s.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):s[r]!==void 0?s[r]:null}return{convert:i}}var ul=class extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},gn=class extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}},hy={type:"move"},Hs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new gn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new gn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new gn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let g=e.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,m=.005;c.inputState.pinching&&d>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(hy)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new gn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},dl=class extends En{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,m=null,x=e.getContextAttributes(),g=null,p=null,v=[],y=[],b=new Nt,w=null,M=new Be;M.layers.enable(1),M.viewport=new de;let S=new Be;S.layers.enable(2),S.viewport=new de;let C=[M,S],_=new ul;_.layers.enable(1),_.layers.enable(2);let E=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(F){let W=v[F];return W===void 0&&(W=new Hs,v[F]=W),W.getTargetRaySpace()},this.getControllerGrip=function(F){let W=v[F];return W===void 0&&(W=new Hs,v[F]=W),W.getGripSpace()},this.getHand=function(F){let W=v[F];return W===void 0&&(W=new Hs,v[F]=W),W.getHandSpace()};function k(F){let W=y.indexOf(F.inputSource);if(W===-1)return;let J=v[W];J!==void 0&&(J.update(F.inputSource,F.frame,c||o),J.dispatchEvent({type:F.type,data:F.inputSource}))}function Q(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",Q),i.removeEventListener("inputsourceschange",L);for(let F=0;F<v.length;F++){let W=y[F];W!==null&&(y[F]=null,v[F].disconnect(W))}E=null,N=null,t.setRenderTarget(g),f=null,d=null,u=null,i=null,p=null,et.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(F){r=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(F){a=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(F){c=F},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(F){if(i=F,i!==null){if(g=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",Q),i.addEventListener("inputsourceschange",L),x.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(b),i.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let W={antialias:i.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,W),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new xn(f.framebufferWidth,f.framebufferHeight,{format:Ze,type:ei,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let W=null,J=null,z=null;x.depth&&(z=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,W=x.stencil?ds:Mi,J=x.stencil?_i:Jn);let tt={colorFormat:e.RGBA8,depthFormat:z,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(tt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new xn(d.textureWidth,d.textureHeight,{format:Ze,type:ei,depthTexture:new yo(d.textureWidth,d.textureHeight,J,void 0,void 0,void 0,void 0,void 0,void 0,W),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});let xt=t.properties.get(p);xt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),et.setContext(i),et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function L(F){for(let W=0;W<F.removed.length;W++){let J=F.removed[W],z=y.indexOf(J);z>=0&&(y[z]=null,v[z].disconnect(J))}for(let W=0;W<F.added.length;W++){let J=F.added[W],z=y.indexOf(J);if(z===-1){for(let xt=0;xt<v.length;xt++)if(xt>=y.length){y.push(J),z=xt;break}else if(y[xt]===null){y[xt]=J,z=xt;break}if(z===-1)break}let tt=v[z];tt&&tt.connect(J)}}let U=new A,D=new A;function H(F,W,J){U.setFromMatrixPosition(W.matrixWorld),D.setFromMatrixPosition(J.matrixWorld);let z=U.distanceTo(D),tt=W.projectionMatrix.elements,xt=J.projectionMatrix.elements,St=tt[14]/(tt[10]-1),Mt=tt[14]/(tt[10]+1),Wt=(tt[9]+1)/tt[5],X=(tt[9]-1)/tt[5],xe=(tt[8]-1)/tt[0],Ct=(xt[8]+1)/xt[0],At=St*xe,yt=St*Ct,ie=z/(-xe+Ct),It=ie*-xe;W.matrixWorld.decompose(F.position,F.quaternion,F.scale),F.translateX(It),F.translateZ(ie),F.matrixWorld.compose(F.position,F.quaternion,F.scale),F.matrixWorldInverse.copy(F.matrixWorld).invert();let P=St+ie,T=Mt+ie,q=At-It,lt=yt+(z-It),rt=Wt*Mt/T*P,at=X*Mt/T*P;F.projectionMatrix.makePerspective(q,lt,rt,at,P,T),F.projectionMatrixInverse.copy(F.projectionMatrix).invert()}function G(F,W){W===null?F.matrixWorld.copy(F.matrix):F.matrixWorld.multiplyMatrices(W.matrixWorld,F.matrix),F.matrixWorldInverse.copy(F.matrixWorld).invert()}this.updateCamera=function(F){if(i===null)return;_.near=S.near=M.near=F.near,_.far=S.far=M.far=F.far,(E!==_.near||N!==_.far)&&(i.updateRenderState({depthNear:_.near,depthFar:_.far}),E=_.near,N=_.far);let W=F.parent,J=_.cameras;G(_,W);for(let z=0;z<J.length;z++)G(J[z],W);J.length===2?H(_,M,S):_.projectionMatrix.copy(M.projectionMatrix),B(F,_,W)};function B(F,W,J){J===null?F.matrix.copy(W.matrixWorld):(F.matrix.copy(J.matrixWorld),F.matrix.invert(),F.matrix.multiply(W.matrixWorld)),F.matrix.decompose(F.position,F.quaternion,F.scale),F.updateMatrixWorld(!0),F.projectionMatrix.copy(W.projectionMatrix),F.projectionMatrixInverse.copy(W.projectionMatrixInverse),F.isPerspectiveCamera&&(F.fov=Ws*2*Math.atan(1/F.projectionMatrix.elements[5]),F.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(F){l=F,d!==null&&(d.fixedFoveation=F),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=F)};let j=null;function $(F,W){if(h=W.getViewerPose(c||o),m=W,h!==null){let J=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let z=!1;J.length!==_.cameras.length&&(_.cameras.length=0,z=!0);for(let tt=0;tt<J.length;tt++){let xt=J[tt],St=null;if(f!==null)St=f.getViewport(xt);else{let Wt=u.getViewSubImage(d,xt);St=Wt.viewport,tt===0&&(t.setRenderTargetTextures(p,Wt.colorTexture,d.ignoreDepthValues?void 0:Wt.depthStencilTexture),t.setRenderTarget(p))}let Mt=C[tt];Mt===void 0&&(Mt=new Be,Mt.layers.enable(tt),Mt.viewport=new de,C[tt]=Mt),Mt.matrix.fromArray(xt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(xt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(St.x,St.y,St.width,St.height),tt===0&&(_.matrix.copy(Mt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),z===!0&&_.cameras.push(Mt)}}for(let J=0;J<v.length;J++){let z=y[J],tt=v[J];z!==null&&tt!==void 0&&tt.update(z,W,c||o)}j&&j(F,W),W.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:W}),m=null}let et=new Tu;et.setAnimationLoop($),this.setAnimationLoop=function(F){j=F},this.dispose=function(){}}};function uy(s,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Au(s)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function i(g,p,v,y,b){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(g,p):p.isMeshToonMaterial?(r(g,p),u(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p)):p.isMeshStandardMaterial?(r(g,p),d(g,p),p.isMeshPhysicalMaterial&&f(g,p,b)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,v,y):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Ke&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Ke&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let v=t.get(p).envMap;if(v&&(g.envMap.value=v,g.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap){g.lightMap.value=p.lightMap;let y=s._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=p.lightMapIntensity*y,e(p.lightMap,g.lightMapTransform)}p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,v,y){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*v,g.scale.value=y*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function u(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function d(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),t.get(p).envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function f(g,p,v){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ke&&g.clearcoatNormalScale.value.negate())),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=v.texture,g.transmissionSamplerSize.value.set(v.width,v.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){let v=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(v.matrixWorld),g.nearDistance.value=v.shadow.camera.near,g.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function dy(s,t,e,n){let i={},r={},o=[],a=e.isWebGL2?s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(v,y){let b=y.program;n.uniformBlockBinding(v,b)}function c(v,y){let b=i[v.id];b===void 0&&(m(v),b=h(v),i[v.id]=b,v.addEventListener("dispose",g));let w=y.program;n.updateUBOMapping(v,w);let M=t.render.frame;r[v.id]!==M&&(d(v),r[v.id]=M)}function h(v){let y=u();v.__bindingPointIndex=y;let b=s.createBuffer(),w=v.__size,M=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,w,M),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,y,b),b}function u(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let y=i[v.id],b=v.uniforms,w=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,y);for(let M=0,S=b.length;M<S;M++){let C=Array.isArray(b[M])?b[M]:[b[M]];for(let _=0,E=C.length;_<E;_++){let N=C[_];if(f(N,M,_,w)===!0){let k=N.__offset,Q=Array.isArray(N.value)?N.value:[N.value],L=0;for(let U=0;U<Q.length;U++){let D=Q[U],H=x(D);typeof D=="number"||typeof D=="boolean"?(N.__data[0]=D,s.bufferSubData(s.UNIFORM_BUFFER,k+L,N.__data)):D.isMatrix3?(N.__data[0]=D.elements[0],N.__data[1]=D.elements[1],N.__data[2]=D.elements[2],N.__data[3]=0,N.__data[4]=D.elements[3],N.__data[5]=D.elements[4],N.__data[6]=D.elements[5],N.__data[7]=0,N.__data[8]=D.elements[6],N.__data[9]=D.elements[7],N.__data[10]=D.elements[8],N.__data[11]=0):(D.toArray(N.__data,L),L+=H.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,k,N.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(v,y,b,w){let M=v.value,S=y+"_"+b;if(w[S]===void 0)return typeof M=="number"||typeof M=="boolean"?w[S]=M:w[S]=M.clone(),!0;{let C=w[S];if(typeof M=="number"||typeof M=="boolean"){if(C!==M)return w[S]=M,!0}else if(C.equals(M)===!1)return C.copy(M),!0}return!1}function m(v){let y=v.uniforms,b=0,w=16;for(let S=0,C=y.length;S<C;S++){let _=Array.isArray(y[S])?y[S]:[y[S]];for(let E=0,N=_.length;E<N;E++){let k=_[E],Q=Array.isArray(k.value)?k.value:[k.value];for(let L=0,U=Q.length;L<U;L++){let D=Q[L],H=x(D),G=b%w;G!==0&&w-G<H.boundary&&(b+=w-G),k.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=b,b+=H.storage}}}let M=b%w;return M>0&&(b+=w-M),v.__size=b,v.__cache={},this}function x(v){let y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=48,y.storage=48):v.isMatrix4?(y.boundary=64,y.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),y}function g(v){let y=v.target;y.removeEventListener("dispose",g);let b=o.indexOf(y.__bindingPointIndex);o.splice(b,1),s.deleteBuffer(i[y.id]),delete i[y.id],delete r[y.id]}function p(){for(let v in i)s.deleteBuffer(i[v]);o=[],i={},r={}}return{bind:l,update:c,dispose:p}}var Ys=class{constructor(t={}){let{canvas:e=Mp(),context:n=null,depth:i=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;let f=new Uint32Array(4),m=new Int32Array(4),x=null,g=null,p=[],v=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ve,this._useLegacyLights=!1,this.toneMapping=ti,this.toneMappingExposure=1;let y=this,b=!1,w=0,M=0,S=null,C=-1,_=null,E=new de,N=new de,k=null,Q=new wt(0),L=0,U=e.width,D=e.height,H=1,G=null,B=null,j=new de(0,0,U,D),$=new de(0,0,U,D),et=!1,F=new Xs,W=!1,J=!1,z=null,tt=new st,xt=new Nt,St=new A,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Wt(){return S===null?H:1}let X=n;function xe(R,V){for(let Z=0;Z<R.length;Z++){let K=R[Z],Y=e.getContext(K,V);if(Y!==null)return Y}return null}try{let R={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Il}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",O,!1),e.addEventListener("webglcontextcreationerror",ht,!1),X===null){let V=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&V.shift(),X=xe(V,R),X===null)throw xe(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let Ct,At,yt,ie,It,P,T,q,lt,rt,at,Et,gt,bt,Ut,Ht,it,jt,I,nt,ft,ct,Tt,Yt;function Kt(){Ct=new L0(X),At=new E0(X,Ct,t),Ct.init(At),ct=new cy(X,Ct,At),yt=new ay(X,Ct,At),ie=new D0(X),It=new Zx,P=new ly(X,Ct,yt,It,At,ct,ie),T=new T0(y),q=new P0(y),lt=new Hp(X,At),Tt=new w0(X,Ct,lt,At),rt=new I0(X,lt,ie,Tt),at=new k0(X,rt,lt,ie),I=new F0(X,At,P),Ht=new A0(It),Et=new Yx(y,T,q,Ct,At,Tt,Ht),gt=new uy(y,It),bt=new Kx,Ut=new iy(Ct,At),jt=new b0(y,T,q,yt,at,d,l),it=new oy(y,at,At),Yt=new dy(X,ie,At,yt),nt=new S0(X,Ct,ie,At),ft=new N0(X,Ct,ie,At),ie.programs=Et.programs,y.capabilities=At,y.extensions=Ct,y.properties=It,y.renderLists=bt,y.shadowMap=it,y.state=yt,y.info=ie}Kt();let Xt=new dl(y,X);this.xr=Xt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let R=Ct.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=Ct.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(R){R!==void 0&&(H=R,this.setSize(U,D,!1))},this.getSize=function(R){return R.set(U,D)},this.setSize=function(R,V,Z=!0){if(Xt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=R,D=V,e.width=Math.floor(R*H),e.height=Math.floor(V*H),Z===!0&&(e.style.width=R+"px",e.style.height=V+"px"),this.setViewport(0,0,R,V)},this.getDrawingBufferSize=function(R){return R.set(U*H,D*H).floor()},this.setDrawingBufferSize=function(R,V,Z){U=R,D=V,H=Z,e.width=Math.floor(R*Z),e.height=Math.floor(V*Z),this.setViewport(0,0,R,V)},this.getCurrentViewport=function(R){return R.copy(E)},this.getViewport=function(R){return R.copy(j)},this.setViewport=function(R,V,Z,K){R.isVector4?j.set(R.x,R.y,R.z,R.w):j.set(R,V,Z,K),yt.viewport(E.copy(j).multiplyScalar(H).floor())},this.getScissor=function(R){return R.copy($)},this.setScissor=function(R,V,Z,K){R.isVector4?$.set(R.x,R.y,R.z,R.w):$.set(R,V,Z,K),yt.scissor(N.copy($).multiplyScalar(H).floor())},this.getScissorTest=function(){return et},this.setScissorTest=function(R){yt.setScissorTest(et=R)},this.setOpaqueSort=function(R){G=R},this.setTransparentSort=function(R){B=R},this.getClearColor=function(R){return R.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(R=!0,V=!0,Z=!0){let K=0;if(R){let Y=!1;if(S!==null){let vt=S.texture.format;Y=vt===yu||vt===xu||vt===gu}if(Y){let vt=S.texture.type,Pt=vt===ei||vt===Jn||vt===Nl||vt===_i||vt===pu||vt===mu,Ot=jt.getClearColor(),kt=jt.getClearAlpha(),$t=Ot.r,Bt=Ot.g,Gt=Ot.b;Pt?(f[0]=$t,f[1]=Bt,f[2]=Gt,f[3]=kt,X.clearBufferuiv(X.COLOR,0,f)):(m[0]=$t,m[1]=Bt,m[2]=Gt,m[3]=kt,X.clearBufferiv(X.COLOR,0,m))}else K|=X.COLOR_BUFFER_BIT}V&&(K|=X.DEPTH_BUFFER_BIT),Z&&(K|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",O,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),bt.dispose(),Ut.dispose(),It.dispose(),T.dispose(),q.dispose(),at.dispose(),Tt.dispose(),Yt.dispose(),Et.dispose(),Xt.dispose(),Xt.removeEventListener("sessionstart",We),Xt.removeEventListener("sessionend",ae),z&&(z.dispose(),z=null),qe.stop()};function dt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function O(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;let R=ie.autoReset,V=it.enabled,Z=it.autoUpdate,K=it.needsUpdate,Y=it.type;Kt(),ie.autoReset=R,it.enabled=V,it.autoUpdate=Z,it.needsUpdate=K,it.type=Y}function ht(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ut(R){let V=R.target;V.removeEventListener("dispose",ut),Dt(V)}function Dt(R){Rt(R),It.remove(R)}function Rt(R){let V=It.get(R).programs;V!==void 0&&(V.forEach(function(Z){Et.releaseProgram(Z)}),R.isShaderMaterial&&Et.releaseShaderCache(R))}this.renderBufferDirect=function(R,V,Z,K,Y,vt){V===null&&(V=Mt);let Pt=Y.isMesh&&Y.matrixWorld.determinant()<0,Ot=sf(R,V,Z,K,Y);yt.setMaterial(K,Pt);let kt=Z.index,$t=1;if(K.wireframe===!0){if(kt=rt.getWireframeAttribute(Z),kt===void 0)return;$t=2}let Bt=Z.drawRange,Gt=Z.attributes.position,_e=Bt.start*$t,nn=(Bt.start+Bt.count)*$t;vt!==null&&(_e=Math.max(_e,vt.start*$t),nn=Math.min(nn,(vt.start+vt.count)*$t)),kt!==null?(_e=Math.max(_e,0),nn=Math.min(nn,kt.count)):Gt!=null&&(_e=Math.max(_e,0),nn=Math.min(nn,Gt.count));let Pe=nn-_e;if(Pe<0||Pe===1/0)return;Tt.setup(Y,K,Ot,Z,kt);let Cn,pe=nt;if(kt!==null&&(Cn=lt.get(kt),pe=ft,pe.setIndex(Cn)),Y.isMesh)K.wireframe===!0?(yt.setLineWidth(K.wireframeLinewidth*Wt()),pe.setMode(X.LINES)):pe.setMode(X.TRIANGLES);else if(Y.isLine){let Zt=K.linewidth;Zt===void 0&&(Zt=1),yt.setLineWidth(Zt*Wt()),Y.isLineSegments?pe.setMode(X.LINES):Y.isLineLoop?pe.setMode(X.LINE_LOOP):pe.setMode(X.LINE_STRIP)}else Y.isPoints?pe.setMode(X.POINTS):Y.isSprite&&pe.setMode(X.TRIANGLES);if(Y.isBatchedMesh)pe.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)pe.renderInstances(_e,Pe,Y.count);else if(Z.isInstancedBufferGeometry){let Zt=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,ca=Math.min(Z.instanceCount,Zt);pe.renderInstances(_e,Pe,ca)}else pe.render(_e,Pe)};function te(R,V,Z){R.transparent===!0&&R.side===Ve&&R.forceSinglePass===!1?(R.side=Ke,R.needsUpdate=!0,Sr(R,V,Z),R.side=ni,R.needsUpdate=!0,Sr(R,V,Z),R.side=Ve):Sr(R,V,Z)}this.compile=function(R,V,Z=null){Z===null&&(Z=R),g=Ut.get(Z),g.init(),v.push(g),Z.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(g.pushLight(Y),Y.castShadow&&g.pushShadow(Y))}),R!==Z&&R.traverseVisible(function(Y){Y.isLight&&Y.layers.test(V.layers)&&(g.pushLight(Y),Y.castShadow&&g.pushShadow(Y))}),g.setupLights(y._useLegacyLights);let K=new Set;return R.traverse(function(Y){let vt=Y.material;if(vt)if(Array.isArray(vt))for(let Pt=0;Pt<vt.length;Pt++){let Ot=vt[Pt];te(Ot,Z,Y),K.add(Ot)}else te(vt,Z,Y),K.add(vt)}),v.pop(),g=null,K},this.compileAsync=function(R,V,Z=null){let K=this.compile(R,V,Z);return new Promise(Y=>{function vt(){if(K.forEach(function(Pt){It.get(Pt).currentProgram.isReady()&&K.delete(Pt)}),K.size===0){Y(R);return}setTimeout(vt,10)}Ct.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let ee=null;function Re(R){ee&&ee(R)}function We(){qe.stop()}function ae(){qe.start()}let qe=new Tu;qe.setAnimationLoop(Re),typeof self<"u"&&qe.setContext(self),this.setAnimationLoop=function(R){ee=R,Xt.setAnimationLoop(R),R===null?qe.stop():qe.start()},Xt.addEventListener("sessionstart",We),Xt.addEventListener("sessionend",ae),this.render=function(R,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),Xt.enabled===!0&&Xt.isPresenting===!0&&(Xt.cameraAutoUpdate===!0&&Xt.updateCamera(V),V=Xt.getCamera()),R.isScene===!0&&R.onBeforeRender(y,R,V,S),g=Ut.get(R,v.length),g.init(),v.push(g),tt.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),F.setFromProjectionMatrix(tt),J=this.localClippingEnabled,W=Ht.init(this.clippingPlanes,J),x=bt.get(R,p.length),x.init(),p.push(x),bn(R,V,0,y.sortObjects),x.finish(),y.sortObjects===!0&&x.sort(G,B),this.info.render.frame++,W===!0&&Ht.beginShadows();let Z=g.state.shadowsArray;if(it.render(Z,R,V),W===!0&&Ht.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(x,R),g.setupLights(y._useLegacyLights),V.isArrayCamera){let K=V.cameras;for(let Y=0,vt=K.length;Y<vt;Y++){let Pt=K[Y];fc(x,R,Pt,Pt.viewport)}}else fc(x,R,V);S!==null&&(P.updateMultisampleRenderTarget(S),P.updateRenderTargetMipmap(S)),R.isScene===!0&&R.onAfterRender(y,R,V),Tt.resetDefaultState(),C=-1,_=null,v.pop(),v.length>0?g=v[v.length-1]:g=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function bn(R,V,Z,K){if(R.visible===!1)return;if(R.layers.test(V.layers)){if(R.isGroup)Z=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(V);else if(R.isLight)g.pushLight(R),R.castShadow&&g.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||F.intersectsSprite(R)){K&&St.setFromMatrixPosition(R.matrixWorld).applyMatrix4(tt);let Pt=at.update(R),Ot=R.material;Ot.visible&&x.push(R,Pt,Ot,Z,St.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||F.intersectsObject(R))){let Pt=at.update(R),Ot=R.material;if(K&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),St.copy(R.boundingSphere.center)):(Pt.boundingSphere===null&&Pt.computeBoundingSphere(),St.copy(Pt.boundingSphere.center)),St.applyMatrix4(R.matrixWorld).applyMatrix4(tt)),Array.isArray(Ot)){let kt=Pt.groups;for(let $t=0,Bt=kt.length;$t<Bt;$t++){let Gt=kt[$t],_e=Ot[Gt.materialIndex];_e&&_e.visible&&x.push(R,Pt,_e,Z,St.z,Gt)}}else Ot.visible&&x.push(R,Pt,Ot,Z,St.z,null)}}let vt=R.children;for(let Pt=0,Ot=vt.length;Pt<Ot;Pt++)bn(vt[Pt],V,Z,K)}function fc(R,V,Z,K){let Y=R.opaque,vt=R.transmissive,Pt=R.transparent;g.setupLightsView(Z),W===!0&&Ht.setGlobalState(y.clippingPlanes,Z),vt.length>0&&nf(Y,vt,V,Z),K&&yt.viewport(E.copy(K)),Y.length>0&&wr(Y,V,Z),vt.length>0&&wr(vt,V,Z),Pt.length>0&&wr(Pt,V,Z),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function nf(R,V,Z,K){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;let vt=At.isWebGL2;z===null&&(z=new xn(1,1,{generateMipmaps:!0,type:Ct.has("EXT_color_buffer_half_float")?Gs:ei,minFilter:Sn,samples:vt?4:0})),y.getDrawingBufferSize(xt),vt?z.setSize(xt.x,xt.y):z.setSize(lo(xt.x),lo(xt.y));let Pt=y.getRenderTarget();y.setRenderTarget(z),y.getClearColor(Q),L=y.getClearAlpha(),L<1&&y.setClearColor(16777215,.5),y.clear();let Ot=y.toneMapping;y.toneMapping=ti,wr(R,Z,K),P.updateMultisampleRenderTarget(z),P.updateRenderTargetMipmap(z);let kt=!1;for(let $t=0,Bt=V.length;$t<Bt;$t++){let Gt=V[$t],_e=Gt.object,nn=Gt.geometry,Pe=Gt.material,Cn=Gt.group;if(Pe.side===Ve&&_e.layers.test(K.layers)){let pe=Pe.side;Pe.side=Ke,Pe.needsUpdate=!0,pc(_e,Z,K,nn,Pe,Cn),Pe.side=pe,Pe.needsUpdate=!0,kt=!0}}kt===!0&&(P.updateMultisampleRenderTarget(z),P.updateRenderTargetMipmap(z)),y.setRenderTarget(Pt),y.setClearColor(Q,L),y.toneMapping=Ot}function wr(R,V,Z){let K=V.isScene===!0?V.overrideMaterial:null;for(let Y=0,vt=R.length;Y<vt;Y++){let Pt=R[Y],Ot=Pt.object,kt=Pt.geometry,$t=K===null?Pt.material:K,Bt=Pt.group;Ot.layers.test(Z.layers)&&pc(Ot,V,Z,kt,$t,Bt)}}function pc(R,V,Z,K,Y,vt){R.onBeforeRender(y,V,Z,K,Y,vt),R.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Y.onBeforeRender(y,V,Z,K,R,vt),Y.transparent===!0&&Y.side===Ve&&Y.forceSinglePass===!1?(Y.side=Ke,Y.needsUpdate=!0,y.renderBufferDirect(Z,V,K,Y,R,vt),Y.side=ni,Y.needsUpdate=!0,y.renderBufferDirect(Z,V,K,Y,R,vt),Y.side=Ve):y.renderBufferDirect(Z,V,K,Y,R,vt),R.onAfterRender(y,V,Z,K,Y,vt)}function Sr(R,V,Z){V.isScene!==!0&&(V=Mt);let K=It.get(R),Y=g.state.lights,vt=g.state.shadowsArray,Pt=Y.state.version,Ot=Et.getParameters(R,Y.state,vt,V,Z),kt=Et.getProgramCacheKey(Ot),$t=K.programs;K.environment=R.isMeshStandardMaterial?V.environment:null,K.fog=V.fog,K.envMap=(R.isMeshStandardMaterial?q:T).get(R.envMap||K.environment),$t===void 0&&(R.addEventListener("dispose",ut),$t=new Map,K.programs=$t);let Bt=$t.get(kt);if(Bt!==void 0){if(K.currentProgram===Bt&&K.lightsStateVersion===Pt)return gc(R,Ot),Bt}else Ot.uniforms=Et.getUniforms(R),R.onBuild(Z,Ot,y),R.onBeforeCompile(Ot,y),Bt=Et.acquireProgram(Ot,kt),$t.set(kt,Bt),K.uniforms=Ot.uniforms;let Gt=K.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Gt.clippingPlanes=Ht.uniform),gc(R,Ot),K.needsLights=of(R),K.lightsStateVersion=Pt,K.needsLights&&(Gt.ambientLightColor.value=Y.state.ambient,Gt.lightProbe.value=Y.state.probe,Gt.directionalLights.value=Y.state.directional,Gt.directionalLightShadows.value=Y.state.directionalShadow,Gt.spotLights.value=Y.state.spot,Gt.spotLightShadows.value=Y.state.spotShadow,Gt.rectAreaLights.value=Y.state.rectArea,Gt.ltc_1.value=Y.state.rectAreaLTC1,Gt.ltc_2.value=Y.state.rectAreaLTC2,Gt.pointLights.value=Y.state.point,Gt.pointLightShadows.value=Y.state.pointShadow,Gt.hemisphereLights.value=Y.state.hemi,Gt.directionalShadowMap.value=Y.state.directionalShadowMap,Gt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Gt.spotShadowMap.value=Y.state.spotShadowMap,Gt.spotLightMatrix.value=Y.state.spotLightMatrix,Gt.spotLightMap.value=Y.state.spotLightMap,Gt.pointShadowMap.value=Y.state.pointShadowMap,Gt.pointShadowMatrix.value=Y.state.pointShadowMatrix),K.currentProgram=Bt,K.uniformsList=null,Bt}function mc(R){if(R.uniformsList===null){let V=R.currentProgram.getUniforms();R.uniformsList=ls.seqWithValue(V.seq,R.uniforms)}return R.uniformsList}function gc(R,V){let Z=It.get(R);Z.outputColorSpace=V.outputColorSpace,Z.batching=V.batching,Z.instancing=V.instancing,Z.instancingColor=V.instancingColor,Z.skinning=V.skinning,Z.morphTargets=V.morphTargets,Z.morphNormals=V.morphNormals,Z.morphColors=V.morphColors,Z.morphTargetsCount=V.morphTargetsCount,Z.numClippingPlanes=V.numClippingPlanes,Z.numIntersection=V.numClipIntersection,Z.vertexAlphas=V.vertexAlphas,Z.vertexTangents=V.vertexTangents,Z.toneMapping=V.toneMapping}function sf(R,V,Z,K,Y){V.isScene!==!0&&(V=Mt),P.resetTextureUnits();let vt=V.fog,Pt=K.isMeshStandardMaterial?V.environment:null,Ot=S===null?y.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:kn,kt=(K.isMeshStandardMaterial?q:T).get(K.envMap||Pt),$t=K.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Bt=!!Z.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Gt=!!Z.morphAttributes.position,_e=!!Z.morphAttributes.normal,nn=!!Z.morphAttributes.color,Pe=ti;K.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Pe=y.toneMapping);let Cn=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,pe=Cn!==void 0?Cn.length:0,Zt=It.get(K),ca=g.state.lights;if(W===!0&&(J===!0||R!==_)){let hn=R===_&&K.id===C;Ht.setState(K,R,hn)}let ye=!1;K.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==ca.state.version||Zt.outputColorSpace!==Ot||Y.isBatchedMesh&&Zt.batching===!1||!Y.isBatchedMesh&&Zt.batching===!0||Y.isInstancedMesh&&Zt.instancing===!1||!Y.isInstancedMesh&&Zt.instancing===!0||Y.isSkinnedMesh&&Zt.skinning===!1||!Y.isSkinnedMesh&&Zt.skinning===!0||Y.isInstancedMesh&&Zt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&Zt.instancingColor===!1&&Y.instanceColor!==null||Zt.envMap!==kt||K.fog===!0&&Zt.fog!==vt||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==Ht.numPlanes||Zt.numIntersection!==Ht.numIntersection)||Zt.vertexAlphas!==$t||Zt.vertexTangents!==Bt||Zt.morphTargets!==Gt||Zt.morphNormals!==_e||Zt.morphColors!==nn||Zt.toneMapping!==Pe||At.isWebGL2===!0&&Zt.morphTargetsCount!==pe)&&(ye=!0):(ye=!0,Zt.__version=K.version);let ui=Zt.currentProgram;ye===!0&&(ui=Sr(K,V,Y));let xc=!1,Is=!1,ha=!1,Oe=ui.getUniforms(),di=Zt.uniforms;if(yt.useProgram(ui.program)&&(xc=!0,Is=!0,ha=!0),K.id!==C&&(C=K.id,Is=!0),xc||_!==R){Oe.setValue(X,"projectionMatrix",R.projectionMatrix),Oe.setValue(X,"viewMatrix",R.matrixWorldInverse);let hn=Oe.map.cameraPosition;hn!==void 0&&hn.setValue(X,St.setFromMatrixPosition(R.matrixWorld)),At.logarithmicDepthBuffer&&Oe.setValue(X,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Oe.setValue(X,"isOrthographic",R.isOrthographicCamera===!0),_!==R&&(_=R,Is=!0,ha=!0)}if(Y.isSkinnedMesh){Oe.setOptional(X,Y,"bindMatrix"),Oe.setOptional(X,Y,"bindMatrixInverse");let hn=Y.skeleton;hn&&(At.floatVertexTextures?(hn.boneTexture===null&&hn.computeBoneTexture(),Oe.setValue(X,"boneTexture",hn.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Y.isBatchedMesh&&(Oe.setOptional(X,Y,"batchingTexture"),Oe.setValue(X,"batchingTexture",Y._matricesTexture,P));let ua=Z.morphAttributes;if((ua.position!==void 0||ua.normal!==void 0||ua.color!==void 0&&At.isWebGL2===!0)&&I.update(Y,Z,ui),(Is||Zt.receiveShadow!==Y.receiveShadow)&&(Zt.receiveShadow=Y.receiveShadow,Oe.setValue(X,"receiveShadow",Y.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(di.envMap.value=kt,di.flipEnvMap.value=kt.isCubeTexture&&kt.isRenderTargetTexture===!1?-1:1),Is&&(Oe.setValue(X,"toneMappingExposure",y.toneMappingExposure),Zt.needsLights&&rf(di,ha),vt&&K.fog===!0&&gt.refreshFogUniforms(di,vt),gt.refreshMaterialUniforms(di,K,H,D,z),ls.upload(X,mc(Zt),di,P)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(ls.upload(X,mc(Zt),di,P),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Oe.setValue(X,"center",Y.center),Oe.setValue(X,"modelViewMatrix",Y.modelViewMatrix),Oe.setValue(X,"normalMatrix",Y.normalMatrix),Oe.setValue(X,"modelMatrix",Y.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let hn=K.uniformsGroups;for(let da=0,af=hn.length;da<af;da++)if(At.isWebGL2){let yc=hn[da];Yt.update(yc,ui),Yt.bind(yc,ui)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ui}function rf(R,V){R.ambientLightColor.needsUpdate=V,R.lightProbe.needsUpdate=V,R.directionalLights.needsUpdate=V,R.directionalLightShadows.needsUpdate=V,R.pointLights.needsUpdate=V,R.pointLightShadows.needsUpdate=V,R.spotLights.needsUpdate=V,R.spotLightShadows.needsUpdate=V,R.rectAreaLights.needsUpdate=V,R.hemisphereLights.needsUpdate=V}function of(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(R,V,Z){It.get(R.texture).__webglTexture=V,It.get(R.depthTexture).__webglTexture=Z;let K=It.get(R);K.__hasExternalTextures=!0,K.__hasExternalTextures&&(K.__autoAllocateDepthBuffer=Z===void 0,K.__autoAllocateDepthBuffer||Ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,V){let Z=It.get(R);Z.__webglFramebuffer=V,Z.__useDefaultFramebuffer=V===void 0},this.setRenderTarget=function(R,V=0,Z=0){S=R,w=V,M=Z;let K=!0,Y=null,vt=!1,Pt=!1;if(R){let kt=It.get(R);kt.__useDefaultFramebuffer!==void 0?(yt.bindFramebuffer(X.FRAMEBUFFER,null),K=!1):kt.__webglFramebuffer===void 0?P.setupRenderTarget(R):kt.__hasExternalTextures&&P.rebindTextures(R,It.get(R.texture).__webglTexture,It.get(R.depthTexture).__webglTexture);let $t=R.texture;($t.isData3DTexture||$t.isDataArrayTexture||$t.isCompressedArrayTexture)&&(Pt=!0);let Bt=It.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Bt[V])?Y=Bt[V][Z]:Y=Bt[V],vt=!0):At.isWebGL2&&R.samples>0&&P.useMultisampledRTT(R)===!1?Y=It.get(R).__webglMultisampledFramebuffer:Array.isArray(Bt)?Y=Bt[Z]:Y=Bt,E.copy(R.viewport),N.copy(R.scissor),k=R.scissorTest}else E.copy(j).multiplyScalar(H).floor(),N.copy($).multiplyScalar(H).floor(),k=et;if(yt.bindFramebuffer(X.FRAMEBUFFER,Y)&&At.drawBuffers&&K&&yt.drawBuffers(R,Y),yt.viewport(E),yt.scissor(N),yt.setScissorTest(k),vt){let kt=It.get(R.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+V,kt.__webglTexture,Z)}else if(Pt){let kt=It.get(R.texture),$t=V||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,kt.__webglTexture,Z||0,$t)}C=-1},this.readRenderTargetPixels=function(R,V,Z,K,Y,vt,Pt){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ot=It.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Pt!==void 0&&(Ot=Ot[Pt]),Ot){yt.bindFramebuffer(X.FRAMEBUFFER,Ot);try{let kt=R.texture,$t=kt.format,Bt=kt.type;if($t!==Ze&&ct.convert($t)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Gt=Bt===Gs&&(Ct.has("EXT_color_buffer_half_float")||At.isWebGL2&&Ct.has("EXT_color_buffer_float"));if(Bt!==ei&&ct.convert(Bt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Bt===On&&(At.isWebGL2||Ct.has("OES_texture_float")||Ct.has("WEBGL_color_buffer_float")))&&!Gt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=R.width-K&&Z>=0&&Z<=R.height-Y&&X.readPixels(V,Z,K,Y,ct.convert($t),ct.convert(Bt),vt)}finally{let kt=S!==null?It.get(S).__webglFramebuffer:null;yt.bindFramebuffer(X.FRAMEBUFFER,kt)}}},this.copyFramebufferToTexture=function(R,V,Z=0){let K=Math.pow(2,-Z),Y=Math.floor(V.image.width*K),vt=Math.floor(V.image.height*K);P.setTexture2D(V,0),X.copyTexSubImage2D(X.TEXTURE_2D,Z,0,0,R.x,R.y,Y,vt),yt.unbindTexture()},this.copyTextureToTexture=function(R,V,Z,K=0){let Y=V.image.width,vt=V.image.height,Pt=ct.convert(Z.format),Ot=ct.convert(Z.type);P.setTexture2D(Z,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,Z.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,Z.unpackAlignment),V.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,K,R.x,R.y,Y,vt,Pt,Ot,V.image.data):V.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,K,R.x,R.y,V.mipmaps[0].width,V.mipmaps[0].height,Pt,V.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,K,R.x,R.y,Pt,Ot,V.image),K===0&&Z.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),yt.unbindTexture()},this.copyTextureToTexture3D=function(R,V,Z,K,Y=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let vt=R.max.x-R.min.x+1,Pt=R.max.y-R.min.y+1,Ot=R.max.z-R.min.z+1,kt=ct.convert(K.format),$t=ct.convert(K.type),Bt;if(K.isData3DTexture)P.setTexture3D(K,0),Bt=X.TEXTURE_3D;else if(K.isDataArrayTexture||K.isCompressedArrayTexture)P.setTexture2DArray(K,0),Bt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,K.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,K.unpackAlignment);let Gt=X.getParameter(X.UNPACK_ROW_LENGTH),_e=X.getParameter(X.UNPACK_IMAGE_HEIGHT),nn=X.getParameter(X.UNPACK_SKIP_PIXELS),Pe=X.getParameter(X.UNPACK_SKIP_ROWS),Cn=X.getParameter(X.UNPACK_SKIP_IMAGES),pe=Z.isCompressedTexture?Z.mipmaps[Y]:Z.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,pe.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,pe.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,R.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,R.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,R.min.z),Z.isDataTexture||Z.isData3DTexture?X.texSubImage3D(Bt,Y,V.x,V.y,V.z,vt,Pt,Ot,kt,$t,pe.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(Bt,Y,V.x,V.y,V.z,vt,Pt,Ot,kt,pe.data)):X.texSubImage3D(Bt,Y,V.x,V.y,V.z,vt,Pt,Ot,kt,$t,pe),X.pixelStorei(X.UNPACK_ROW_LENGTH,Gt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,_e),X.pixelStorei(X.UNPACK_SKIP_PIXELS,nn),X.pixelStorei(X.UNPACK_SKIP_ROWS,Pe),X.pixelStorei(X.UNPACK_SKIP_IMAGES,Cn),Y===0&&K.generateMipmaps&&X.generateMipmap(Bt),yt.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?P.setTextureCube(R,0):R.isData3DTexture?P.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?P.setTexture2DArray(R,0):P.setTexture2D(R,0),yt.unbindTexture()},this.resetState=function(){w=0,M=0,S=null,yt.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Dl?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===Lo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ve?bi:_u}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===bi?ve:kn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},fl=class extends Ys{};fl.prototype.isWebGL1Renderer=!0;var vo=class extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Hh=new A,Gh=new de,Wh=new de,fy=new A,qh=new st,$r=new A,Ha=new yn,Xh=new st,Ga=new zn,Zs=class extends mt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ec,this.bindMatrix=new st,this.bindMatrixInverse=new st,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ye),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,$r),this.boundingBox.expandByPoint($r)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new yn),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,$r),this.boundingSphere.expandByPoint($r)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ha.copy(this.boundingSphere),Ha.applyMatrix4(i),t.ray.intersectsSphere(Ha)!==!1&&(Xh.copy(i).invert(),Ga.copy(t.ray).applyMatrix4(Xh),!(this.boundingBox!==null&&Ga.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Ga)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new de,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ec?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ro?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;Gh.fromBufferAttribute(i.attributes.skinIndex,t),Wh.fromBufferAttribute(i.attributes.skinWeight,t),Hh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=Wh.getComponent(r);if(o!==0){let a=Gh.getComponent(r);qh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(fy.copy(Hh).applyMatrix4(qh),o)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}},js=class extends he{constructor(){super(),this.isBone=!0,this.type="Bone"}},ms=class extends Je{constructor(t=null,e=1,n=1,i,r,o,a,l,c=Ie,h=Ie,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},$h=new st,py=new st,_o=class s{constructor(t=[],e=[]){this.uuid=Ci(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new st)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new st;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:py;$h.multiplyMatrices(a,e[r]),$h.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new ms(e,t,t,Ze,On);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new js),this.bones.push(o),this.boneInverses.push(new st().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,r=e.length;i<r;i++){let o=e[i];t.bones.push(o.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}},Mo=class extends Me{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ts=new st,Yh=new st,Yr=[],Zh=new Ye,my=new st,Fs=new mt,ks=new yn,gs=class extends mt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Mo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,my)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ye),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ts),Zh.copy(t.boundingBox).applyMatrix4(ts),this.boundingBox.union(Zh)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new yn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ts),ks.copy(t.boundingSphere).applyMatrix4(ts),this.boundingSphere.union(ks)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Fs.geometry=this.geometry,Fs.material=this.material,Fs.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ks.copy(this.boundingSphere),ks.applyMatrix4(n),t.ray.intersectsSphere(ks)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,ts),Yh.multiplyMatrices(n,ts),Fs.matrixWorld=Yh,Fs.raycast(t,Yr);for(let o=0,a=Yr.length;o<a;o++){let l=Yr[o];l.instanceId=r,l.object=this,e.push(l)}Yr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Mo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Qe=class extends Bn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},jh=new A,Kh=new A,Jh=new st,Wa=new zn,Zr=new yn,tn=class extends he{constructor(t=new ne,e=new Qe){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)jh.fromBufferAttribute(e,i-1),Kh.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=jh.distanceTo(Kh);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zr.copy(n.boundingSphere),Zr.applyMatrix4(i),Zr.radius+=r,t.ray.intersectsSphere(Zr)===!1)return;Jh.copy(i).invert(),Wa.copy(t.ray).applyMatrix4(Jh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new A,h=new A,u=new A,d=new A,f=this.isLineSegments?2:1,m=n.index,g=n.attributes.position;if(m!==null){let p=Math.max(0,o.start),v=Math.min(m.count,o.start+o.count);for(let y=p,b=v-1;y<b;y+=f){let w=m.getX(y),M=m.getX(y+1);if(c.fromBufferAttribute(g,w),h.fromBufferAttribute(g,M),Wa.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let C=t.ray.origin.distanceTo(d);C<t.near||C>t.far||e.push({distance:C,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{let p=Math.max(0,o.start),v=Math.min(g.count,o.start+o.count);for(let y=p,b=v-1;y<b;y+=f){if(c.fromBufferAttribute(g,y),h.fromBufferAttribute(g,y+1),Wa.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let M=t.ray.origin.distanceTo(d);M<t.near||M>t.far||e.push({distance:M,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}},Qh=new A,tu=new A,ii=class extends tn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Qh.fromBufferAttribute(e,i),tu.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Qh.distanceTo(tu);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Ks=class extends Bn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},eu=new st,pl=new zn,jr=new yn,Kr=new A,bo=class extends he{constructor(t=new ne,e=new Ks){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),jr.copy(n.boundingSphere),jr.applyMatrix4(i),jr.radius+=r,t.ray.intersectsSphere(jr)===!1)return;eu.copy(i).invert(),pl.copy(t.ray).applyMatrix4(eu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let m=d,x=f;m<x;m++){let g=c.getX(m);Kr.fromBufferAttribute(u,g),nu(Kr,g,l,i,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let m=d,x=f;m<x;m++)Kr.fromBufferAttribute(u,m),nu(Kr,m,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function nu(s,t,e,n,i,r,o){let a=pl.distanceSqToPoint(s);if(a<e){let l=new A;pl.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}var Ue=class s extends ne{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],m=0,x=[],g=n/2,p=0;v(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(f,2));function v(){let b=new A,w=new A,M=0,S=(e-t)/n;for(let C=0;C<=r;C++){let _=[],E=C/r,N=E*(e-t)+t;for(let k=0;k<=i;k++){let Q=k/i,L=Q*l+a,U=Math.sin(L),D=Math.cos(L);w.x=N*U,w.y=-E*n+g,w.z=N*D,u.push(w.x,w.y,w.z),b.set(U,S,D).normalize(),d.push(b.x,b.y,b.z),f.push(Q,1-E),_.push(m++)}x.push(_)}for(let C=0;C<i;C++)for(let _=0;_<r;_++){let E=x[_][C],N=x[_+1][C],k=x[_+1][C+1],Q=x[_][C+1];h.push(E,N,Q),h.push(N,k,Q),M+=6}c.addGroup(p,M,0),p+=M}function y(b){let w=m,M=new Nt,S=new A,C=0,_=b===!0?t:e,E=b===!0?1:-1;for(let k=1;k<=i;k++)u.push(0,g*E,0),d.push(0,E,0),f.push(.5,.5),m++;let N=m;for(let k=0;k<=i;k++){let L=k/i*l+a,U=Math.cos(L),D=Math.sin(L);S.x=_*D,S.y=g*E,S.z=_*U,u.push(S.x,S.y,S.z),d.push(0,E,0),M.x=U*.5+.5,M.y=D*.5*E+.5,f.push(M.x,M.y),m++}for(let k=0;k<i;k++){let Q=w+k,L=N+k;b===!0?h.push(L,L+1,Q):h.push(L+1,L,Q),C+=3}c.addGroup(p,C,b===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var ml=class s extends ne{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new zt(r,3)),this.setAttribute("normal",new zt(r.slice(),3)),this.setAttribute("uv",new zt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let y=new A,b=new A,w=new A;for(let M=0;M<e.length;M+=3)f(e[M+0],y),f(e[M+1],b),f(e[M+2],w),l(y,b,w,v)}function l(v,y,b,w){let M=w+1,S=[];for(let C=0;C<=M;C++){S[C]=[];let _=v.clone().lerp(b,C/M),E=y.clone().lerp(b,C/M),N=M-C;for(let k=0;k<=N;k++)k===0&&C===M?S[C][k]=_:S[C][k]=_.clone().lerp(E,k/N)}for(let C=0;C<M;C++)for(let _=0;_<2*(M-C)-1;_++){let E=Math.floor(_/2);_%2===0?(d(S[C][E+1]),d(S[C+1][E]),d(S[C][E])):(d(S[C][E+1]),d(S[C+1][E+1]),d(S[C+1][E]))}}function c(v){let y=new A;for(let b=0;b<r.length;b+=3)y.x=r[b+0],y.y=r[b+1],y.z=r[b+2],y.normalize().multiplyScalar(v),r[b+0]=y.x,r[b+1]=y.y,r[b+2]=y.z}function h(){let v=new A;for(let y=0;y<r.length;y+=3){v.x=r[y+0],v.y=r[y+1],v.z=r[y+2];let b=g(v)/2/Math.PI+.5,w=p(v)/Math.PI+.5;o.push(b,1-w)}m(),u()}function u(){for(let v=0;v<o.length;v+=6){let y=o[v+0],b=o[v+2],w=o[v+4],M=Math.max(y,b,w),S=Math.min(y,b,w);M>.9&&S<.1&&(y<.2&&(o[v+0]+=1),b<.2&&(o[v+2]+=1),w<.2&&(o[v+4]+=1))}}function d(v){r.push(v.x,v.y,v.z)}function f(v,y){let b=v*3;y.x=t[b+0],y.y=t[b+1],y.z=t[b+2]}function m(){let v=new A,y=new A,b=new A,w=new A,M=new Nt,S=new Nt,C=new Nt;for(let _=0,E=0;_<r.length;_+=9,E+=6){v.set(r[_+0],r[_+1],r[_+2]),y.set(r[_+3],r[_+4],r[_+5]),b.set(r[_+6],r[_+7],r[_+8]),M.set(o[E+0],o[E+1]),S.set(o[E+2],o[E+3]),C.set(o[E+4],o[E+5]),w.copy(v).add(y).add(b).divideScalar(3);let N=g(w);x(M,E+0,v,N),x(S,E+2,y,N),x(C,E+4,b,N)}}function x(v,y,b,w){w<0&&v.x===1&&(o[y]=v.x-1),b.x===0&&b.z===0&&(o[y]=w/2/Math.PI+.5)}function g(v){return Math.atan2(v.z,-v.x)}function p(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.details)}};var gy={triangulate:function(s,t,e=2){let n=t&&t.length,i=n?t[0]*e:s.length,r=Nu(s,0,i,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=My(s,t,r,e)),s.length>80*e){a=c=s[0],l=h=s[1];for(let m=e;m<i;m+=e)u=s[m],d=s[m+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Js(r,o,e,a,l,f,0),o}};function Nu(s,t,e,n,i){let r,o;if(i===Iy(s,t,e,n)>0)for(r=t;r<e;r+=n)o=iu(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=iu(r,s[r],s[r+1],o);return o&&No(o,o.next)&&(tr(o),o=o.next),o}function Si(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(No(e,e.next)||me(e.prev,e,e.next)===0)){if(tr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Js(s,t,e,n,i,r,o){if(!s)return;!o&&r&&Ay(s,n,i,r);let a=s,l,c;for(;s.prev!==s.next;){if(l=s.prev,c=s.next,r?yy(s,n,i,r):xy(s)){t.push(l.i/e|0),t.push(s.i/e|0),t.push(c.i/e|0),tr(s),s=c.next,a=c.next;continue}if(s=c,s===a){o?o===1?(s=vy(Si(s),t,e),Js(s,t,e,n,i,r,2)):o===2&&_y(s,t,e,n,i,r):Js(Si(s),t,e,n,i,r,1);break}}}function xy(s){let t=s.prev,e=s,n=s.next;if(me(t,e,n)>=0)return!1;let i=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=i>r?i>o?i:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=d&&m.y>=u&&m.y<=f&&rs(i,a,r,l,o,c,m.x,m.y)&&me(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function yy(s,t,e,n){let i=s.prev,r=s,o=s.next;if(me(i,r,o)>=0)return!1;let a=i.x,l=r.x,c=o.x,h=i.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,m=h<u?h<d?h:d:u<d?u:d,x=a>l?a>c?a:c:l>c?l:c,g=h>u?h>d?h:d:u>d?u:d,p=gl(f,m,t,e,n),v=gl(x,g,t,e,n),y=s.prevZ,b=s.nextZ;for(;y&&y.z>=p&&b&&b.z<=v;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&rs(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=f&&b.x<=x&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&rs(a,h,l,u,c,d,b.x,b.y)&&me(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=x&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&rs(a,h,l,u,c,d,y.x,y.y)&&me(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=f&&b.x<=x&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&rs(a,h,l,u,c,d,b.x,b.y)&&me(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function vy(s,t,e){let n=s;do{let i=n.prev,r=n.next.next;!No(i,r)&&Du(i,n,n.next,r)&&Qs(i,r)&&Qs(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),tr(n),tr(n.next),n=s=r),n=n.next}while(n!==s);return Si(n)}function _y(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Ry(o,a)){let l=Uu(o,a);o=Si(o,o.next),l=Si(l,l.next),Js(o,t,e,n,i,r,0),Js(l,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function My(s,t,e,n){let i=[],r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:s.length,c=Nu(s,a,l,n,!1),c===c.next&&(c.steiner=!0),i.push(Cy(c));for(i.sort(by),r=0;r<i.length;r++)e=wy(i[r],e);return e}function by(s,t){return s.x-t.x}function wy(s,t){let e=Sy(s,t);if(!e)return t;let n=Uu(e,s);return Si(n,n.next),Si(e,e.next)}function Sy(s,t){let e=t,n=-1/0,i,r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===r))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,l=i.x,c=i.y,h=1/0,u;e=i;do r>=e.x&&e.x>=l&&r!==e.x&&rs(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Qs(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&Ey(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function Ey(s,t){return me(s.prev,s,t.prev)<0&&me(t.next,s,s.next)<0}function Ay(s,t,e,n){let i=s;do i.z===0&&(i.z=gl(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Ty(i)}function Ty(s){let t,e,n,i,r,o,a,l,c=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,c*=2}while(o>1);return s}function gl(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function Cy(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function rs(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function Ry(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!Py(s,t)&&(Qs(s,t)&&Qs(t,s)&&Ly(s,t)&&(me(s.prev,s,t.prev)||me(s,t.prev,t))||No(s,t)&&me(s.prev,s,s.next)>0&&me(t.prev,t,t.next)>0)}function me(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function No(s,t){return s.x===t.x&&s.y===t.y}function Du(s,t,e,n){let i=Qr(me(s,t,e)),r=Qr(me(s,t,n)),o=Qr(me(e,n,s)),a=Qr(me(e,n,t));return!!(i!==r&&o!==a||i===0&&Jr(s,e,t)||r===0&&Jr(s,n,t)||o===0&&Jr(e,s,n)||a===0&&Jr(e,t,n))}function Jr(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Qr(s){return s>0?1:s<0?-1:0}function Py(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Du(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Qs(s,t){return me(s.prev,s,s.next)<0?me(s,t,s.next)>=0&&me(s,s.prev,t)>=0:me(s,t,s.prev)<0||me(s,s.next,t)<0}function Ly(s,t){let e=s,n=!1,i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function Uu(s,t){let e=new xl(s.i,s.x,s.y),n=new xl(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function iu(s,t,e,n){let i=new xl(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function tr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function xl(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Iy(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}var wo=class s{static area(t){let e=t.length,n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return s.area(t)<0}static triangulateShape(t,e){let n=[],i=[],r=[];su(t),ru(n,t);let o=t.length;e.forEach(su);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,ru(n,e[l]);let a=gy.triangulate(n,i);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function su(s){let t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function ru(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}var Hn=class s extends ml{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}};var xs=class s extends ne{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new A,d=new A,f=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){let v=[],y=p/n,b=0;p===0&&o===0?b=.5/e:p===n&&l===Math.PI&&(b=-.5/e);for(let w=0;w<=e;w++){let M=w/e;u.x=-t*Math.cos(i+M*r)*Math.sin(o+y*a),u.y=t*Math.cos(o+y*a),u.z=t*Math.sin(i+M*r)*Math.sin(o+y*a),m.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),g.push(M+b,1-y),v.push(c++)}h.push(v)}for(let p=0;p<n;p++)for(let v=0;v<e;v++){let y=h[p][v+1],b=h[p][v],w=h[p+1][v],M=h[p+1][v+1];(p!==0||o>0)&&f.push(y,b,M),(p!==n-1||l<Math.PI)&&f.push(b,w,M)}this.setIndex(f),this.setAttribute("position",new zt(m,3)),this.setAttribute("normal",new zt(x,3)),this.setAttribute("uv",new zt(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var si=class s extends ne{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],l=[],c=[],h=new A,u=new A,d=new A;for(let f=0;f<=n;f++)for(let m=0;m<=i;m++){let x=m/i*r,g=f/n*Math.PI*2;u.x=(t+e*Math.cos(g))*Math.cos(x),u.y=(t+e*Math.cos(g))*Math.sin(x),u.z=e*Math.sin(g),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(m/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let m=1;m<=i;m++){let x=(i+1)*f+m-1,g=(i+1)*(f-1)+m-1,p=(i+1)*(f-1)+m,v=(i+1)*f+m;o.push(x,g,v),o.push(g,p,v)}this.setIndex(o),this.setAttribute("position",new zt(a,3)),this.setAttribute("normal",new zt(l,3)),this.setAttribute("uv",new zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var So=class extends Bn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Mu,this.normalScale=new Nt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function to(s,t,e){return!s||!e&&s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function Ny(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}var ys=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},yl=class extends ys{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Jc,endingEnd:Jc}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Qc:r=t,a=2*e-n;break;case th:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Qc:o=t,l=2*n-e;break;case th:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),x=m*m,g=x*m,p=-d*g+2*d*x-d*m,v=(1+d)*g+(-1.5-2*d)*x+(-.5+d)*m+1,y=(-1-f)*g+(1.5+f)*x+.5*m,b=f*g-f*x;for(let w=0;w!==a;++w)r[w]=p*o[h+w]+v*o[c+w]+y*o[l+w]+b*o[u+w];return r}},vl=class extends ys{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},_l=class extends ys{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},vn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=to(e,this.TimeBufferType),this.values=to(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:to(t.times,Array),values:to(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new _l(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new vl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new yl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case no:e=this.InterpolantFactoryMethodDiscrete;break;case io:e=this.InterpolantFactoryMethodLinear;break;case va:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return no;case this.InterpolantFactoryMethodLinear:return io;case this.InterpolantFactoryMethodSmooth:return va}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Ny(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===va,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let m=0;m!==n;++m){let x=e[u+m];if(x!==e[d+m]||x!==e[f+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};vn.prototype.TimeBufferType=Float32Array;vn.prototype.ValueBufferType=Float32Array;vn.prototype.DefaultInterpolation=io;var Ei=class extends vn{};Ei.prototype.ValueTypeName="bool";Ei.prototype.ValueBufferType=Array;Ei.prototype.DefaultInterpolation=no;Ei.prototype.InterpolantFactoryMethodLinear=void 0;Ei.prototype.InterpolantFactoryMethodSmooth=void 0;var Ml=class extends vn{};Ml.prototype.ValueTypeName="color";var bl=class extends vn{};bl.prototype.ValueTypeName="number";var wl=class extends ys{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)_t.slerpFlat(r,0,o,c-a,o,c,l);return r}},er=class extends vn{InterpolantFactoryMethodLinear(t){return new wl(this.times,this.values,this.getValueSize(),t)}};er.prototype.ValueTypeName="quaternion";er.prototype.DefaultInterpolation=io;er.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends vn{};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=no;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Sl=class extends vn{};Sl.prototype.ValueTypeName="vector";var ou={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},El=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],m=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null}}},Dy=new El,nr=class{constructor(t){this.manager=t!==void 0?t:Dy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};nr.DEFAULT_MATERIAL_NAME="__DEFAULT";var Dn={},Al=class extends Error{constructor(t,e){super(t),this.response=e}},Tl=class extends nr{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=ou.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(Dn[t]!==void 0){Dn[t].push({onLoad:e,onProgress:n,onError:i});return}Dn[t]=[],Dn[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Dn[t],u=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=d?parseInt(d):0,m=f!==0,x=0,g=new ReadableStream({start(p){v();function v(){u.read().then(({done:y,value:b})=>{if(y)p.close();else{x+=b.byteLength;let w=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let M=0,S=h.length;M<S;M++){let C=h[M];C.onProgress&&C.onProgress(w)}p.enqueue(b),v()}})}}});return new Response(g)}else throw new Al(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{ou.add(t,c);let h=Dn[t];delete Dn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=Dn[t];if(h===void 0)throw this.manager.itemError(t),c;delete Dn[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Eo=class extends nr{constructor(t){super(t)}load(t,e,n,i){let r=this,o=new ms,a=new Tl(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(l){let c;try{c=r.parse(l)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:on,o.wrapT=c.wrapT!==void 0?c.wrapT:on,o.magFilter=c.magFilter!==void 0?c.magFilter:Ne,o.minFilter=c.minFilter!==void 0?c.minFilter:Ne,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0?o.colorSpace=c.colorSpace:c.encoding!==void 0&&(o.encoding=c.encoding),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Sn),c.mipmapCount===1&&(o.minFilter=Ne),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,e&&e(o,c)},n,i),o}};var Ao=class extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new wt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},To=class extends Ao{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new wt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},qa=new st,au=new A,lu=new A,Cl=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Nt(512,512),this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xs,this._frameExtents=new Nt(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;au.setFromMatrixPosition(t.matrixWorld),e.position.copy(au),lu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lu),e.updateMatrixWorld(),qa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(qa),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(qa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Rl=class extends Cl{constructor(){super(new ps(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Co=class extends Ao{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new Rl}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Fl="\\[\\]\\.:\\/",Uy=new RegExp("["+Fl+"]","g"),kl="[^"+Fl+"]",Oy="[^"+Fl.replace("\\.","")+"]",Fy=/((?:WC+[\/:])*)/.source.replace("WC",kl),ky=/(WCOD+)?/.source.replace("WCOD",Oy),zy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",kl),By=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",kl),Vy=new RegExp("^"+Fy+ky+zy+By+"$"),Hy=["material","materials","bones","map"],Pl=class{constructor(t,e,n){let i=n||ue.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ue=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Uy,"")}static parseTrackName(t){let e=Vy.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);Hy.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ue.Composite=Pl;ue.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ue.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ue.prototype.GetterByBindingType=[ue.prototype._getValue_direct,ue.prototype._getValue_array,ue.prototype._getValue_arrayElement,ue.prototype._getValue_toArray];ue.prototype.SetterByBindingTypeAndVersioning=[[ue.prototype._setValue_direct,ue.prototype._setValue_direct_setNeedsUpdate,ue.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_array,ue.prototype._setValue_array_setNeedsUpdate,ue.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_arrayElement,ue.prototype._setValue_arrayElement_setNeedsUpdate,ue.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ue.prototype._setValue_fromArray,ue.prototype._setValue_fromArray_setNeedsUpdate,ue.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var c_=new Float32Array(1);var vs=class{constructor(t,e,n=0,i=1/0){this.ray=new zn(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new qs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Ll(t,this,n,e),n.sort(cu),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Ll(t[i],this,n,e);return n.sort(cu),n}};function cu(s,t){return s.distance-t.distance}function Ll(s,t,e,n){if(s.layers.test(t.layers)&&s.raycast(t,e),n===!0){let i=s.children;for(let r=0,o=i.length;r<o;r++)Ll(i[r],t,e,!0)}}var ir=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ze(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Il}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Il);var Ou={type:"change"},zl={type:"start"},Fu={type:"end"},Do=new zn,ku=new mn,Gy=Math.cos(70*wu.DEG2RAD),Uo=class extends En{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:_n.ROTATE,MIDDLE:_n.DOLLY,RIGHT:_n.PAN},this.touches={ONE:Ti.ROTATE,TWO:Ti.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(I){I.addEventListener("keydown",at),this._domElementKeyEvents=I},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",at),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ou),n.update(),r=i.NONE},this.update=function(){let I=new A,nt=new _t().setFromUnitVectors(t.up,new A(0,1,0)),ft=nt.clone().invert(),ct=new A,Tt=new _t,Yt=new A,Kt=2*Math.PI;return function(dt=null){let O=n.object.position;I.copy(O).sub(n.target),I.applyQuaternion(nt),a.setFromVector3(I),n.autoRotate&&r===i.NONE&&N(_(dt)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let ht=n.minAzimuthAngle,ut=n.maxAzimuthAngle;isFinite(ht)&&isFinite(ut)&&(ht<-Math.PI?ht+=Kt:ht>Math.PI&&(ht-=Kt),ut<-Math.PI?ut+=Kt:ut>Math.PI&&(ut-=Kt),ht<=ut?a.theta=Math.max(ht,Math.min(ut,a.theta)):a.theta=a.theta>(ht+ut)/2?Math.max(ht,a.theta):Math.min(ut,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&M||n.object.isOrthographicCamera?a.radius=B(a.radius):a.radius=B(a.radius*c),I.setFromSpherical(a),I.applyQuaternion(ft),O.copy(n.target).add(I),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let Dt=!1;if(n.zoomToCursor&&M){let Rt=null;if(n.object.isPerspectiveCamera){let te=I.length();Rt=B(te*c);let ee=te-Rt;n.object.position.addScaledVector(b,ee),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let te=new A(w.x,w.y,0);te.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Dt=!0;let ee=new A(w.x,w.y,0);ee.unproject(n.object),n.object.position.sub(ee).add(te),n.object.updateMatrixWorld(),Rt=I.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Rt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Rt).add(n.object.position):(Do.origin.copy(n.object.position),Do.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Do.direction))<Gy?t.lookAt(n.target):(ku.setFromNormalAndCoplanarPoint(n.object.up,n.target),Do.intersectPlane(ku,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Dt=!0);return c=1,M=!1,Dt||ct.distanceToSquared(n.object.position)>o||8*(1-Tt.dot(n.object.quaternion))>o||Yt.distanceToSquared(n.target)>0?(n.dispatchEvent(Ou),ct.copy(n.object.position),Tt.copy(n.object.quaternion),Yt.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",bt),n.domElement.removeEventListener("pointerdown",It),n.domElement.removeEventListener("pointercancel",T),n.domElement.removeEventListener("wheel",rt),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",T),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",at),n._domElementKeyEvents=null)};let n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=i.NONE,o=1e-6,a=new ir,l=new ir,c=1,h=new A,u=new Nt,d=new Nt,f=new Nt,m=new Nt,x=new Nt,g=new Nt,p=new Nt,v=new Nt,y=new Nt,b=new A,w=new Nt,M=!1,S=[],C={};function _(I){return I!==null?2*Math.PI/60*n.autoRotateSpeed*I:2*Math.PI/60/60*n.autoRotateSpeed}function E(I){let nt=Math.abs(I)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*nt)}function N(I){l.theta-=I}function k(I){l.phi-=I}let Q=function(){let I=new A;return function(ft,ct){I.setFromMatrixColumn(ct,0),I.multiplyScalar(-ft),h.add(I)}}(),L=function(){let I=new A;return function(ft,ct){n.screenSpacePanning===!0?I.setFromMatrixColumn(ct,1):(I.setFromMatrixColumn(ct,0),I.crossVectors(n.object.up,I)),I.multiplyScalar(ft),h.add(I)}}(),U=function(){let I=new A;return function(ft,ct){let Tt=n.domElement;if(n.object.isPerspectiveCamera){let Yt=n.object.position;I.copy(Yt).sub(n.target);let Kt=I.length();Kt*=Math.tan(n.object.fov/2*Math.PI/180),Q(2*ft*Kt/Tt.clientHeight,n.object.matrix),L(2*ct*Kt/Tt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Q(ft*(n.object.right-n.object.left)/n.object.zoom/Tt.clientWidth,n.object.matrix),L(ct*(n.object.top-n.object.bottom)/n.object.zoom/Tt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function D(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function H(I){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=I:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function G(I,nt){if(!n.zoomToCursor)return;M=!0;let ft=n.domElement.getBoundingClientRect(),ct=I-ft.left,Tt=nt-ft.top,Yt=ft.width,Kt=ft.height;w.x=ct/Yt*2-1,w.y=-(Tt/Kt)*2+1,b.set(w.x,w.y,1).unproject(n.object).sub(n.object.position).normalize()}function B(I){return Math.max(n.minDistance,Math.min(n.maxDistance,I))}function j(I){u.set(I.clientX,I.clientY)}function $(I){G(I.clientX,I.clientX),p.set(I.clientX,I.clientY)}function et(I){m.set(I.clientX,I.clientY)}function F(I){d.set(I.clientX,I.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);let nt=n.domElement;N(2*Math.PI*f.x/nt.clientHeight),k(2*Math.PI*f.y/nt.clientHeight),u.copy(d),n.update()}function W(I){v.set(I.clientX,I.clientY),y.subVectors(v,p),y.y>0?D(E(y.y)):y.y<0&&H(E(y.y)),p.copy(v),n.update()}function J(I){x.set(I.clientX,I.clientY),g.subVectors(x,m).multiplyScalar(n.panSpeed),U(g.x,g.y),m.copy(x),n.update()}function z(I){G(I.clientX,I.clientY),I.deltaY<0?H(E(I.deltaY)):I.deltaY>0&&D(E(I.deltaY)),n.update()}function tt(I){let nt=!1;switch(I.code){case n.keys.UP:I.ctrlKey||I.metaKey||I.shiftKey?k(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,n.keyPanSpeed),nt=!0;break;case n.keys.BOTTOM:I.ctrlKey||I.metaKey||I.shiftKey?k(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,-n.keyPanSpeed),nt=!0;break;case n.keys.LEFT:I.ctrlKey||I.metaKey||I.shiftKey?N(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(n.keyPanSpeed,0),nt=!0;break;case n.keys.RIGHT:I.ctrlKey||I.metaKey||I.shiftKey?N(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(-n.keyPanSpeed,0),nt=!0;break}nt&&(I.preventDefault(),n.update())}function xt(I){if(S.length===1)u.set(I.pageX,I.pageY);else{let nt=jt(I),ft=.5*(I.pageX+nt.x),ct=.5*(I.pageY+nt.y);u.set(ft,ct)}}function St(I){if(S.length===1)m.set(I.pageX,I.pageY);else{let nt=jt(I),ft=.5*(I.pageX+nt.x),ct=.5*(I.pageY+nt.y);m.set(ft,ct)}}function Mt(I){let nt=jt(I),ft=I.pageX-nt.x,ct=I.pageY-nt.y,Tt=Math.sqrt(ft*ft+ct*ct);p.set(0,Tt)}function Wt(I){n.enableZoom&&Mt(I),n.enablePan&&St(I)}function X(I){n.enableZoom&&Mt(I),n.enableRotate&&xt(I)}function xe(I){if(S.length==1)d.set(I.pageX,I.pageY);else{let ft=jt(I),ct=.5*(I.pageX+ft.x),Tt=.5*(I.pageY+ft.y);d.set(ct,Tt)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);let nt=n.domElement;N(2*Math.PI*f.x/nt.clientHeight),k(2*Math.PI*f.y/nt.clientHeight),u.copy(d)}function Ct(I){if(S.length===1)x.set(I.pageX,I.pageY);else{let nt=jt(I),ft=.5*(I.pageX+nt.x),ct=.5*(I.pageY+nt.y);x.set(ft,ct)}g.subVectors(x,m).multiplyScalar(n.panSpeed),U(g.x,g.y),m.copy(x)}function At(I){let nt=jt(I),ft=I.pageX-nt.x,ct=I.pageY-nt.y,Tt=Math.sqrt(ft*ft+ct*ct);v.set(0,Tt),y.set(0,Math.pow(v.y/p.y,n.zoomSpeed)),D(y.y),p.copy(v);let Yt=(I.pageX+nt.x)*.5,Kt=(I.pageY+nt.y)*.5;G(Yt,Kt)}function yt(I){n.enableZoom&&At(I),n.enablePan&&Ct(I)}function ie(I){n.enableZoom&&At(I),n.enableRotate&&xe(I)}function It(I){n.enabled!==!1&&(S.length===0&&(n.domElement.setPointerCapture(I.pointerId),n.domElement.addEventListener("pointermove",P),n.domElement.addEventListener("pointerup",T)),Ut(I),I.pointerType==="touch"?Et(I):q(I))}function P(I){n.enabled!==!1&&(I.pointerType==="touch"?gt(I):lt(I))}function T(I){Ht(I),S.length===0&&(n.domElement.releasePointerCapture(I.pointerId),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",T)),n.dispatchEvent(Fu),r=i.NONE}function q(I){let nt;switch(I.button){case 0:nt=n.mouseButtons.LEFT;break;case 1:nt=n.mouseButtons.MIDDLE;break;case 2:nt=n.mouseButtons.RIGHT;break;default:nt=-1}switch(nt){case _n.DOLLY:if(n.enableZoom===!1)return;$(I),r=i.DOLLY;break;case _n.ROTATE:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enablePan===!1)return;et(I),r=i.PAN}else{if(n.enableRotate===!1)return;j(I),r=i.ROTATE}break;case _n.PAN:if(I.ctrlKey||I.metaKey||I.shiftKey){if(n.enableRotate===!1)return;j(I),r=i.ROTATE}else{if(n.enablePan===!1)return;et(I),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(zl)}function lt(I){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;F(I);break;case i.DOLLY:if(n.enableZoom===!1)return;W(I);break;case i.PAN:if(n.enablePan===!1)return;J(I);break}}function rt(I){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(I.preventDefault(),n.dispatchEvent(zl),z(I),n.dispatchEvent(Fu))}function at(I){n.enabled===!1||n.enablePan===!1||tt(I)}function Et(I){switch(it(I),S.length){case 1:switch(n.touches.ONE){case Ti.ROTATE:if(n.enableRotate===!1)return;xt(I),r=i.TOUCH_ROTATE;break;case Ti.PAN:if(n.enablePan===!1)return;St(I),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case Ti.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Wt(I),r=i.TOUCH_DOLLY_PAN;break;case Ti.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;X(I),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(zl)}function gt(I){switch(it(I),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;xe(I),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;Ct(I),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;yt(I),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ie(I),n.update();break;default:r=i.NONE}}function bt(I){n.enabled!==!1&&I.preventDefault()}function Ut(I){S.push(I.pointerId)}function Ht(I){delete C[I.pointerId];for(let nt=0;nt<S.length;nt++)if(S[nt]==I.pointerId){S.splice(nt,1);return}}function it(I){let nt=C[I.pointerId];nt===void 0&&(nt=new Nt,C[I.pointerId]=nt),nt.set(I.pageX,I.pageY)}function jt(I){let nt=I.pointerId===S[0]?S[1]:S[0];return C[nt]}n.domElement.addEventListener("contextmenu",bt),n.domElement.addEventListener("pointerdown",It),n.domElement.addEventListener("pointercancel",T),n.domElement.addEventListener("wheel",rt,{passive:!1}),this.update()}};var Ri=new vs,He=new A,ri=new A,fe=new _t,zu={X:new A(1,0,0),Y:new A(0,1,0),Z:new A(0,0,1)},Bl={type:"change"},Bu={type:"mouseDown"},Vu={type:"mouseUp",mode:null},Hu={type:"objectChange"},Bo=class extends he{constructor(t,e){super(),e===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),e=document),this.isTransformControls=!0,this.visible=!1,this.domElement=e,this.domElement.style.touchAction="none";let n=new Hl;this._gizmo=n,this.add(n);let i=new Gl;this._plane=i,this.add(i);let r=this;function o(v,y){let b=y;Object.defineProperty(r,v,{get:function(){return b!==void 0?b:y},set:function(w){b!==w&&(b=w,i[v]=w,n[v]=w,r.dispatchEvent({type:v+"-changed",value:w}),r.dispatchEvent(Bl))}}),r[v]=y,i[v]=y,n[v]=y}o("camera",t),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);let a=new A,l=new A,c=new _t,h=new _t,u=new A,d=new _t,f=new A,m=new A,x=new A,g=0,p=new A;o("worldPosition",a),o("worldPositionStart",l),o("worldQuaternion",c),o("worldQuaternionStart",h),o("cameraPosition",u),o("cameraQuaternion",d),o("pointStart",f),o("pointEnd",m),o("rotationAxis",x),o("rotationAngle",g),o("eye",p),this._offset=new A,this._startNorm=new A,this._endNorm=new A,this._cameraScale=new A,this._parentPosition=new A,this._parentQuaternion=new _t,this._parentQuaternionInv=new _t,this._parentScale=new A,this._worldScaleStart=new A,this._worldQuaternionInv=new _t,this._worldScale=new A,this._positionStart=new A,this._quaternionStart=new _t,this._scaleStart=new A,this._getPointer=Wy.bind(this),this._onPointerDown=Xy.bind(this),this._onPointerHover=qy.bind(this),this._onPointerMove=$y.bind(this),this._onPointerUp=Yy.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(t){if(this.object===void 0||this.dragging===!0)return;Ri.setFromCamera(t,this.camera);let e=Vl(this._gizmo.picker[this.mode],Ri);e?this.axis=e.object.name:this.axis=null}pointerDown(t){if(!(this.object===void 0||this.dragging===!0||t.button!==0)&&this.axis!==null){Ri.setFromCamera(t,this.camera);let e=Vl(this._plane,Ri,!0);e&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(e.point).sub(this.worldPositionStart)),this.dragging=!0,Bu.mode=this.mode,this.dispatchEvent(Bu)}}pointerMove(t){let e=this.axis,n=this.mode,i=this.object,r=this.space;if(n==="scale"?r="local":(e==="E"||e==="XYZE"||e==="XYZ")&&(r="world"),i===void 0||e===null||this.dragging===!1||t.button!==-1)return;Ri.setFromCamera(t,this.camera);let o=Vl(this._plane,Ri,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&e!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),e.indexOf("X")===-1&&(this._offset.x=0),e.indexOf("Y")===-1&&(this._offset.y=0),e.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&e!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),i.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(i.position.applyQuaternion(fe.copy(this._quaternionStart).invert()),e.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.position.applyQuaternion(this._quaternionStart)),r==="world"&&(i.parent&&i.position.add(He.setFromMatrixPosition(i.parent.matrixWorld)),e.search("X")!==-1&&(i.position.x=Math.round(i.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(i.position.y=Math.round(i.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(i.position.z=Math.round(i.position.z/this.translationSnap)*this.translationSnap),i.parent&&i.position.sub(He.setFromMatrixPosition(i.parent.matrixWorld))));else if(n==="scale"){if(e.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),ri.set(a,a,a)}else He.copy(this.pointStart),ri.copy(this.pointEnd),He.applyQuaternion(this._worldQuaternionInv),ri.applyQuaternion(this._worldQuaternionInv),ri.divide(He),e.search("X")===-1&&(ri.x=1),e.search("Y")===-1&&(ri.y=1),e.search("Z")===-1&&(ri.z=1);i.scale.copy(this._scaleStart).multiply(ri),this.scaleSnap&&(e.search("X")!==-1&&(i.scale.x=Math.round(i.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Y")!==-1&&(i.scale.y=Math.round(i.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Z")!==-1&&(i.scale.z=Math.round(i.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);let a=20/this.worldPosition.distanceTo(He.setFromMatrixPosition(this.camera.matrixWorld)),l=!1;e==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(He.copy(this.rotationAxis).cross(this.eye))*a):(e==="X"||e==="Y"||e==="Z")&&(this.rotationAxis.copy(zu[e]),He.copy(zu[e]),r==="local"&&He.applyQuaternion(this.worldQuaternion),He.cross(this.eye),He.length()===0?l=!0:this.rotationAngle=this._offset.dot(He.normalize())*a),(e==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&e!=="E"&&e!=="XYZE"?(i.quaternion.copy(this._quaternionStart),i.quaternion.multiply(fe.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),i.quaternion.copy(fe.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),i.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Bl),this.dispatchEvent(Hu)}}pointerUp(t){t.button===0&&(this.dragging&&this.axis!==null&&(Vu.mode=this.mode,this.dispatchEvent(Vu)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(t){t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}attach(t){return this.object=t,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Bl),this.dispatchEvent(Hu),this.pointStart.copy(this.pointEnd))}getRaycaster(){return Ri}getMode(){return this.mode}setMode(t){this.mode=t}setTranslationSnap(t){this.translationSnap=t}setRotationSnap(t){this.rotationSnap=t}setScaleSnap(t){this.scaleSnap=t}setSize(t){this.size=t}setSpace(t){this.space=t}};function Wy(s){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:s.button};{let t=this.domElement.getBoundingClientRect();return{x:(s.clientX-t.left)/t.width*2-1,y:-(s.clientY-t.top)/t.height*2+1,button:s.button}}}function qy(s){if(this.enabled)switch(s.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(s));break}}function Xy(s){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(s)),this.pointerDown(this._getPointer(s)))}function $y(s){this.enabled&&this.pointerMove(this._getPointer(s))}function Yy(s){this.enabled&&(this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(s)))}function Vl(s,t,e){let n=t.intersectObject(s,!0);for(let i=0;i<n.length;i++)if(n[i].object.visible||e)return n[i];return!1}var Oo=new be,oe=new A(0,1,0),Gu=new A(0,0,0),Wu=new st,Fo=new _t,zo=new _t,An=new A,qu=new st,ar=new A(1,0,0),Pi=new A(0,1,0),lr=new A(0,0,1),ko=new A,rr=new A,or=new A,Hl=class extends he{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";let t=new De({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),e=new Qe({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=t.clone();n.opacity=.15;let i=e.clone();i.opacity=.5;let r=t.clone();r.color.setHex(16711680);let o=t.clone();o.color.setHex(65280);let a=t.clone();a.color.setHex(255);let l=t.clone();l.color.setHex(16711680),l.opacity=.5;let c=t.clone();c.color.setHex(65280),c.opacity=.5;let h=t.clone();h.color.setHex(255),h.opacity=.5;let u=t.clone();u.opacity=.25;let d=t.clone();d.color.setHex(16776960),d.opacity=.25,t.clone().color.setHex(16776960);let m=t.clone();m.color.setHex(7895160);let x=new Ue(0,.04,.1,12);x.translate(0,.05,0);let g=new we(.08,.08,.08);g.translate(0,.04,0);let p=new ne;p.setAttribute("position",new zt([0,0,0,1,0,0],3));let v=new Ue(.0075,.0075,.5,3);v.translate(0,.25,0);function y(U,D){let H=new si(U,.0075,3,64,D*Math.PI*2);return H.rotateY(Math.PI/2),H.rotateX(Math.PI/2),H}function b(){let U=new ne;return U.setAttribute("position",new zt([0,0,0,1,1,1],3)),U}let w={X:[[new mt(x,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(x,r),[-.5,0,0],[0,0,Math.PI/2]],[new mt(v,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new mt(x,o),[0,.5,0]],[new mt(x,o),[0,-.5,0],[Math.PI,0,0]],[new mt(v,o)]],Z:[[new mt(x,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(x,a),[0,0,-.5],[-Math.PI/2,0,0]],[new mt(v,a),null,[Math.PI/2,0,0]]],XYZ:[[new mt(new Hn(.1,0),u.clone()),[0,0,0]]],XY:[[new mt(new we(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new mt(new we(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new we(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},M={X:[[new mt(new Ue(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Ue(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Ue(.2,0,.6,4),n),[0,.3,0]],[new mt(new Ue(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Ue(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Ue(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new mt(new Hn(.2,0),n)]],XY:[[new mt(new we(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new we(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new we(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new mt(new Hn(.01,2),i),null,null,null,"helper"]],END:[[new mt(new Hn(.01,2),i),null,null,null,"helper"]],DELTA:[[new tn(b(),i),null,null,null,"helper"]],X:[[new tn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new tn(p,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new tn(p,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},C={XYZE:[[new mt(y(.5,1),m),null,[0,Math.PI/2,0]]],X:[[new mt(y(.5,.5),r)]],Y:[[new mt(y(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new mt(y(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new mt(y(.75,1),d),null,[0,Math.PI/2,0]]]},_={AXIS:[[new tn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},E={XYZE:[[new mt(new xs(.25,10,8),n)]],X:[[new mt(new si(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new mt(new si(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new mt(new si(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new mt(new si(.75,.1,2,24),n)]]},N={X:[[new mt(g,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(v,r),[0,0,0],[0,0,-Math.PI/2]],[new mt(g,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new mt(g,o),[0,.5,0]],[new mt(v,o)],[new mt(g,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new mt(g,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(v,a),[0,0,0],[Math.PI/2,0,0]],[new mt(g,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new mt(new we(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new mt(new we(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new we(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new we(.1,.1,.1),u.clone())]]},k={X:[[new mt(new Ue(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Ue(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Ue(.2,0,.6,4),n),[0,.3,0]],[new mt(new Ue(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Ue(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Ue(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new mt(new we(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new we(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new we(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new we(.2,.2,.2),n),[0,0,0]]]},Q={X:[[new tn(p,i.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new tn(p,i.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new tn(p,i.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function L(U){let D=new he;for(let H in U)for(let G=U[H].length;G--;){let B=U[H][G][0].clone(),j=U[H][G][1],$=U[H][G][2],et=U[H][G][3],F=U[H][G][4];B.name=H,B.tag=F,j&&B.position.set(j[0],j[1],j[2]),$&&B.rotation.set($[0],$[1],$[2]),et&&B.scale.set(et[0],et[1],et[2]),B.updateMatrix();let W=B.geometry.clone();W.applyMatrix4(B.matrix),B.geometry=W,B.renderOrder=1/0,B.position.set(0,0,0),B.rotation.set(0,0,0),B.scale.set(1,1,1),D.add(B)}return D}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=L(w)),this.add(this.gizmo.rotate=L(C)),this.add(this.gizmo.scale=L(N)),this.add(this.picker.translate=L(M)),this.add(this.picker.rotate=L(E)),this.add(this.picker.scale=L(k)),this.add(this.helper.translate=L(S)),this.add(this.helper.rotate=L(_)),this.add(this.helper.scale=L(Q)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(t){let n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:zo;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let i=[];i=i.concat(this.picker[this.mode].children),i=i.concat(this.gizmo[this.mode].children),i=i.concat(this.helper[this.mode].children);for(let r=0;r<i.length;r++){let o=i[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(fe.setFromEuler(Oo.set(0,0,0)),o.quaternion.copy(n).multiply(fe),Math.abs(oe.copy(ar).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(fe.setFromEuler(Oo.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(fe),Math.abs(oe.copy(Pi).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(fe.setFromEuler(Oo.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(fe),Math.abs(oe.copy(lr).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(fe.setFromEuler(Oo.set(0,Math.PI/2,0)),oe.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(Wu.lookAt(Gu,oe,Pi)),o.quaternion.multiply(fe),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),He.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),He.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(He),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(oe.copy(ar).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(oe.copy(Pi).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(oe.copy(lr).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(oe.copy(lr).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(oe.copy(ar).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(oe.copy(Pi).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Fo.copy(n),oe.copy(this.eye).applyQuaternion(fe.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(Wu.lookAt(this.eye,Gu,Pi)),o.name==="X"&&(fe.setFromAxisAngle(ar,Math.atan2(-oe.y,oe.z)),fe.multiplyQuaternions(Fo,fe),o.quaternion.copy(fe)),o.name==="Y"&&(fe.setFromAxisAngle(Pi,Math.atan2(oe.x,oe.z)),fe.multiplyQuaternions(Fo,fe),o.quaternion.copy(fe)),o.name==="Z"&&(fe.setFromAxisAngle(lr,Math.atan2(oe.y,oe.x)),fe.multiplyQuaternions(Fo,fe),o.quaternion.copy(fe))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(t)}},Gl=class extends mt{constructor(){super(new $s(1e5,1e5,2,2),new De({visible:!1,wireframe:!0,side:Ve,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(t){let e=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(e="local"),ko.copy(ar).applyQuaternion(e==="local"?this.worldQuaternion:zo),rr.copy(Pi).applyQuaternion(e==="local"?this.worldQuaternion:zo),or.copy(lr).applyQuaternion(e==="local"?this.worldQuaternion:zo),oe.copy(rr),this.mode){case"translate":case"scale":switch(this.axis){case"X":oe.copy(this.eye).cross(ko),An.copy(ko).cross(oe);break;case"Y":oe.copy(this.eye).cross(rr),An.copy(rr).cross(oe);break;case"Z":oe.copy(this.eye).cross(or),An.copy(or).cross(oe);break;case"XY":An.copy(or);break;case"YZ":An.copy(ko);break;case"XZ":oe.copy(or),An.copy(rr);break;case"XYZ":case"E":An.set(0,0,0);break}break;case"rotate":default:An.set(0,0,0)}An.length()===0?this.quaternion.copy(this.cameraQuaternion):(qu.lookAt(He.set(0,0,0),An,oe),this.quaternion.setFromRotationMatrix(qu)),super.updateMatrixWorld(t)}};var bs=Math.PI/180,Wl=.001,Ms=new be,Zy=new _t,jy=new A,Ky=new A,ql=new st,cr=new st,Jy=new st;function ws(){return{t:[0,0,0],r:[0,0,0],s:[1,1,1]}}function Qy(s){return Number.isFinite(s)?Math.abs(s)<Wl?s<0?-Wl:Wl:s:1}function Xl(s){let t=(e,n)=>Array.isArray(e)&&e.length===3?e.map(i=>Number.isFinite(+i)?+i:n):[n,n,n];return{t:t(s&&s.t,0),r:t(s&&s.r,0),s:t(s&&s.s,1).map(Qy)}}function tv(s,t=1e-9){return s.t.every(e=>Math.abs(e)<=t)&&s.r.every(e=>Math.abs(e)<=t)&&s.s.every(e=>Math.abs(e-1)<=t)}function $l(s,t=new _t){return Ms.set(s.r[0]*bs,s.r[1]*bs,s.r[2]*bs,"ZYX"),t.setFromEuler(Ms)}function Yl(s,t=new st){return t.compose(jy.fromArray(s.t),$l(s,Zy),Ky.fromArray(s.s))}function Xu(s,t,e){return Ms.setFromQuaternion(t,"ZYX"),Xl({t:s.toArray(),r:[Ms.x/bs,Ms.y/bs,Ms.z/bs],s:e.toArray()})}var Vo=class{constructor(t,e){this.built=t,this.data=e,this.poses=new Map}has(t){return this.poses.has(t)}get(t){let e=this.poses.get(t);return e?Xl(e):ws()}get size(){return this.poses.size}restLocal(t,e=new st){let i=this.built.nodeObjects[t].userData.baseMatrix;e.copy(i);let r=this.data.nodes[t],o=r.parent;if(r.type!=="joint"||r.segmentScaleCompensate===!1||r.inheritsTransform===!1||o<0||this.data.nodes[o].type!=="joint")return e;let a=this.poses.get(o);if(!a)return e;let l=a.s;if(l[0]===1&&l[1]===1&&l[2]===1)return e;let c=i.elements,h=c[12],u=c[13],d=c[14];return cr.copy(i),cr.elements[12]=0,cr.elements[13]=0,cr.elements[14]=0,ql.makeScale(1/l[0],1/l[1],1/l[2]),e.multiplyMatrices(ql,cr),e.elements[12]=h,e.elements[13]=u,e.elements[14]=d,e}apply(t){let e=this.built.nodeObjects[t];this.restLocal(t,e.matrix);let n=this.poses.get(t);n&&e.matrix.multiply(Yl(n,Jy))}set(t,e){let n=Xl(e);tv(n)?this.poses.delete(t):this.poses.set(t,n),this.apply(t);for(let i of this.built.childrenOf[t])this.apply(i)}reset(t){this.set(t,ws())}reapplyAll(){for(let t=0;t<this.built.nodeObjects.length;t++)this.apply(t)}resetAll(){this.poses.clear(),this.built.nodeObjects.forEach(t=>t.matrix.copy(t.userData.baseMatrix))}frameMatrix(t,e=new st){let n=this.built.nodeObjects[t];return e.multiplyMatrices(n.parent.matrixWorld,this.restLocal(t,ql.clone()))}};function Yu(s,t,e){let n=0;for(let u=0;u<t.length;u++)n+=Math.max(0,t[u]-2);let i=new Uint32Array(n*3),r=new Uint32Array(n),o=0,a=0,l=(u,d)=>s[u*3+d],c=(u,d,f,m)=>{i[o*3]=u,i[o*3+1]=d,i[o*3+2]=f,r[o++]=m};for(let u=0;u<t.length;u++){let d=t[u];if(d===3)c(a,a+1,a+2,u);else if(d===4){let f=e[a],m=e[a+1],x=e[a+2],g=e[a+3];$u(l,f,x)<=$u(l,m,g)?(c(a,a+1,a+2,u),c(a,a+2,a+3,u)):(c(a,a+1,a+3,u),c(a+1,a+2,a+3,u))}else if(d>4){let f=Array.from(e.slice(a,a+d)),m=nv(s,f);for(let x=0;x<m.length;x+=3)c(a+m[x],a+m[x+1],a+m[x+2],u)}a+=d}let h=new Uint32Array(o*3);for(let u=0;u<o*3;u++)h[u]=e[i[u]];return{index:h,corners:i,triCount:o,triToFace:r}}function $u(s,t,e){let n=s(t,0)-s(e,0),i=s(t,1)-s(e,1),r=s(t,2)-s(e,2);return n*n+i*i+r*r}function ev(s,t){let e=0,n=0,i=0;for(let r=0;r<t.length;r++){let o=t[r]*3,a=t[(r+1)%t.length]*3,l=s[o],c=s[o+1],h=s[o+2],u=s[a],d=s[a+1],f=s[a+2];e+=(c-d)*(h+f),n+=(h-f)*(l+u),i+=(l-u)*(c+d)}return[e,n,i]}function nv(s,t){let e=t.length,n=ev(s,t),i=Math.abs(n[0]),r=Math.abs(n[1]),o=Math.abs(n[2]),a=0,l=1;i>=r&&i>=o?(a=1,l=2):r>=o&&(a=2,l=0);let c=t.map(d=>new Nt(s[d*3+a],s[d*3+l])),h=null;try{h=wo.triangulateShape(c,[])}catch{h=null}let u=[];if(h&&h.length===e-2){for(let[d,f,m]of h){let x=f,g=m,p=iv(s,t[d],t[x],t[g]);if(p[0]*n[0]+p[1]*n[1]+p[2]*n[2]<0){let v=x;x=g,g=v}u.push(d,x,g)}return u}for(let d=1;d<e-1;d++)u.push(0,d,d+1);return u}function iv(s,t,e,n){let i=s[t*3],r=s[t*3+1],o=s[t*3+2],a=s[e*3]-i,l=s[e*3+1]-r,c=s[e*3+2]-o,h=s[n*3]-i,u=s[n*3+1]-r,d=s[n*3+2]-o;return[l*d-c*u,c*h-a*d,a*u-l*h]}function Zu(s,t,e){let n=t.length,i=new Int32Array(n),r=0;for(let u=0;u<s.length;u++){let d=s[u];for(let f=0;f<d;f++)i[r+f]=t[r+(f+1)%d];r+=d}let o=new Uint32Array(e+1);for(let u=0;u<n;u++)o[t[u]+1]++;for(let u=0;u<e;u++)o[u+1]+=o[u];let a=o.slice(0,e),l=new Uint32Array(n);for(let u=0;u<n;u++)l[a[t[u]]++]=u;let c=new Uint32Array(n*3),h=0;for(let u=0;u<n;u++){let d=t[u],f=i[u],m=!0;for(let x=o[d];x<o[d+1]&&m;x++){let g=l[x];if(g>=u)break;i[g]===f&&(m=!1)}for(let x=o[f];x<o[f+1]&&m;x++){let g=l[x];if(g>=u)break;i[g]===d&&(m=!1)}m&&(c[h++]=d,c[h++]=f,c[h++]=f)}return{index:c.slice(0,h),edgeCount:h/3}}var hr=8,sv=.001;function ju(s,t,e={}){let n=e.normalize!==!1,i=s.counts,r=new Uint32Array(t+1);for(let w=0;w<t;w++)r[w+1]=r[w]+(i[w]||0);let o=Uint16Array.from(s.indices),a=Float32Array.from(s.weights),l=new Float32Array(a.length),c=s.influences.length,h=new Uint16Array(t*4),u=new Float32Array(t*4),d=new Uint16Array(t*4),f=new Float32Array(t*4),m=new Uint32Array(c),x=[],g=0,p=0,v=0,y=0,b=[];for(let w=0;w<t;w++){let M=r[w],S=r[w+1],C=S-M;C>y&&(y=C);let _=0;for(let U=M;U<S;U++)_+=a[U];if(_<=0){x.push(w);continue}for(let U=M;U<S;U++)a[U]>0&&m[o[U]]++;Math.abs(_-1)>sv&&v++,C>4&&g++,C>hr&&p++;let E=n?1/_:1;for(let U=M;U<S;U++)l[U]=a[U]*E;b.length=0;for(let U=M;U<S;U++)b.push(U);C>hr&&b.sort((U,D)=>l[D]-l[U]);let N=Math.min(C,hr),k=0;for(let U=0;U<N;U++)k+=l[b[U]];let Q=n?1:_,L=C>hr&&k>0?Q/k:1;for(let U=0;U<N;U++){let D=o[b[U]],H=l[b[U]]*L;U<4?(h[w*4+U]=D,u[w*4+U]=H):(d[w*4+U-4]=D,f[w*4+U-4]=H)}}return{offsets:r,slots:o,values:a,eff:l,normalize:n,skinIndex:h,skinWeight:u,skinIndex1:d,skinWeight1:f,zeroVertices:x,override:new Map,stats:{influenceCount:c,over4:g,overMax:p,unnormalized:v,zero:x.length,maxCount:y,affected:m}}}function Ku(s,t,e){let n=e.filter(r=>r.w>0).sort((r,o)=>o.w-r.w).slice(0,hr),i=n.reduce((r,o)=>r+o.w,0)||1;s.override.set(t,n.map(r=>({slot:r.slot,w:r.w/i})));for(let r=0;r<4;r++)s.skinIndex[t*4+r]=0,s.skinWeight[t*4+r]=0,s.skinIndex1[t*4+r]=0,s.skinWeight1[t*4+r]=0;n.forEach((r,o)=>{o<4?(s.skinIndex[t*4+o]=r.slot,s.skinWeight[t*4+o]=r.w/i):(s.skinIndex1[t*4+o-4]=r.slot,s.skinWeight1[t*4+o-4]=r.w/i),s.stats.affected[r.slot]++})}function Ju(s,t){let e=[];for(let n=s.offsets[t];n<s.offsets[t+1];n++)e.push(s.slots[n]);return e}function Qu(s,t){let e=[],n=s.override.get(t);if(n){let i=new Map;for(let r=s.offsets[t];r<s.offsets[t+1];r++)i.set(s.slots[r],s.values[r]);for(let r of n)e.push({slot:r.slot,weight:i.get(r.slot)||0,effective:r.w,assigned:!0});for(let[r,o]of i)n.some(a=>a.slot===r)||e.push({slot:r,weight:o,effective:0,assigned:!0})}else for(let i=s.offsets[t];i<s.offsets[t+1];i++)e.push({slot:s.slots[i],weight:s.values[i],effective:s.eff[i]});return e.sort((i,r)=>r.effective-i.effective),e}function Zl(s,t,e){let n=s.override.get(t);if(n){let i=n.find(r=>r.slot===e);return i?i.w:0}for(let i=s.offsets[t];i<s.offsets[t+1];i++)if(s.slots[i]===e)return s.eff[i];return 0}var Ho=new wt;function rv(s,t){if(!(s>1e-6))return t.setRGB(.11,.12,.16);let e=Math.min(1,Math.max(0,s));return t.setHSL((1-e)*.6667,.95,.5)}function ov(s,t){let e=s*.6180339887%1;return t.setHSL(e,.7,.55)}function td(s,t,e,n){for(let i=0;i<n;i++)rv(e>=0?Zl(t,i,e):0,Ho),s[i*3]=Ho.r,s[i*3+1]=Ho.g,s[i*3+2]=Ho.b}function ed(s,t,e,n){let i=e.map(r=>ov(r,new wt));for(let r=0;r<n;r++){let o=0,a=0,l=0,c=0,h=(d,f)=>{let m=i[d];o+=m.r*f,a+=m.g*f,l+=m.b*f,c+=f},u=t.override.get(r);if(u)for(let d of u)h(d.slot,d.w);else for(let d=t.offsets[r];d<t.offsets[r+1];d++)h(t.slots[d],t.eff[d]);c<=0?(o=.11,a=.12,l=.16):(o/=c,a/=c,l/=c),s[r*3]=o,s[r*3+1]=a,s[r*3+2]=l}}function nd(s,t,e,n){for(let i=0;i<s.length;i+=3)s[i]=t,s[i+1]=e,s[i+2]=n}function av(s,t,e){let n=new Float32Array(t.length*3),i=0;for(let r=0;r<t.length;r++){let o=t[r],a=0,l=0,c=0;for(let h=0;h<o;h++){let u=e[i+h]*3,d=e[i+(h+1)%o]*3;a+=(s[u+1]-s[d+1])*(s[u+2]+s[d+2]),l+=(s[u+2]-s[d+2])*(s[u]+s[d]),c+=(s[u]-s[d])*(s[u+1]+s[d+1])}n[r*3]=a,n[r*3+1]=l,n[r*3+2]=c,i+=o}return n}function id(s,t,e,n,i){let r=e.length,o=t.length,a=av(s,t,e),l=new Uint32Array(r),c=new Int32Array(r),h=new Int32Array(r),u=0;for(let M=0;M<o;M++){let S=t[M];for(let C=0;C<S;C++){let _=u+C;l[_]=M,c[_]=e[u+(C+S-1)%S],h[_]=e[u+(C+1)%S]}u+=S}let d=new Uint32Array(i+1);for(let M=0;M<r;M++)d[e[M]+1]++;for(let M=0;M<i;M++)d[M+1]+=d[M];let f=d.slice(0,i),m=new Uint32Array(r);for(let M=0;M<r;M++)m[f[e[M]]++]=M;let x=new Set;for(let M=0;M+1<(n?n.length:0);M+=2){let S=n[M],C=n[M+1];x.add(S<C?S*i+C:C*i+S)}let g=(M,S)=>!x.size||!x.has(M<S?M*i+S:S*i+M),p=new Int32Array(r);for(let M=0;M<r;M++)p[M]=M;let v=M=>{for(;p[M]!==M;)p[M]=p[p[M]],M=p[M];return M};for(let M=0;M<i;M++){let S=d[M],C=d[M+1];for(let _=S;_<C;_++){let E=m[_];for(let N=_+1;N<C;N++){let k=m[N],Q=-1;if(c[E]===c[k]||c[E]===h[k]?Q=c[E]:(h[E]===c[k]||h[E]===h[k])&&(Q=h[E]),Q<0||Q===M||!g(M,Q))continue;let L=v(E),U=v(k);L!==U&&(p[U]=L)}}}let y=new Float64Array(r*3);for(let M=0;M<r;M++){let S=v(M)*3,C=l[M]*3;y[S]+=a[C],y[S+1]+=a[C+1],y[S+2]+=a[C+2]}let b=new Int32Array(r),w=new Float32Array(r*3);for(let M=0;M<r;M++){let S=v(M);b[M]=S;let C=y[S*3],_=y[S*3+1],E=y[S*3+2],N=Math.sqrt(C*C+_*_+E*E)||1;w[M*3]=C/N,w[M*3+1]=_/N,w[M*3+2]=E/N}return{group:b,normals:w}}var lv="maya-viewer-skin8",cv=`
#include <skinning_pars_vertex>
#ifdef USE_SKINNING
	attribute vec4 skinIndex1;
	attribute vec4 skinWeight1;
#endif
`,hv=`
#include <skinbase_vertex>
#ifdef USE_SKINNING
	mat4 boneMat1X = getBoneMatrix( skinIndex1.x );
	mat4 boneMat1Y = getBoneMatrix( skinIndex1.y );
	mat4 boneMat1Z = getBoneMatrix( skinIndex1.z );
	mat4 boneMat1W = getBoneMatrix( skinIndex1.w );
#endif
`,uv=`
#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix += skinWeight1.x * boneMat1X;
	skinMatrix += skinWeight1.y * boneMat1Y;
	skinMatrix += skinWeight1.z * boneMat1Z;
	skinMatrix += skinWeight1.w * boneMat1W;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif
`,dv=`
#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned += boneMat1X * skinVertex * skinWeight1.x;
	skinned += boneMat1Y * skinVertex * skinWeight1.y;
	skinned += boneMat1Z * skinVertex * skinWeight1.z;
	skinned += boneMat1W * skinVertex * skinWeight1.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif
`;function fv(s){let t=(n,i,r)=>{if(!n.includes(i))throw new Error("\u30B7\u30A7\u30FC\u30C0\u30FC\u306B "+i+" \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\uFF08three.js \u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF09");return n.replace(i,r)},e=s;return e=t(e,"#include <skinning_pars_vertex>",cv),e=t(e,"#include <skinbase_vertex>",hv),e.includes("#include <skinnormal_vertex>")&&(e=e.replace("#include <skinnormal_vertex>",uv)),e=t(e,"#include <skinning_vertex>",dv),e}function Ss(s){return s.onBeforeCompile=t=>{t.vertexShader=fv(t.vertexShader)},s.customProgramCacheKey=()=>lv,s.needsUpdate=!0,s}var sd=new A,pv=new A,rd=new de,od=new de,ad=new st,mv=[["skinIndex","skinWeight"],["skinIndex1","skinWeight1"]];function gv(s,t,e){let n=s.skeleton,i=s.geometry.attributes;sd.copy(e).applyMatrix4(s.bindMatrix),e.set(0,0,0);for(let[r,o]of mv){let a=i[r],l=i[o];if(!(!a||!l)){rd.fromBufferAttribute(a,t),od.fromBufferAttribute(l,t);for(let c=0;c<4;c++){let h=od.getComponent(c);if(h!==0){let u=rd.getComponent(c);ad.multiplyMatrices(n.bones[u].matrixWorld,n.boneInverses[u]),e.addScaledVector(pv.copy(sd).applyMatrix4(ad),h)}}}}return e.applyMatrix4(s.bindMatrixInverse)}function jl(s){return s.applyBoneTransform=function(e,n){return gv(this,e,n)},s}var xv="maya-scene-lite";function Ql(s){if(!s||s.schema!==xv)throw new Error("\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u30C7\u30FC\u30BF\u5F62\u5F0F\u3067\u3059\uFF08schema \u304C maya-scene-lite \u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF09");if(!Array.isArray(s.nodes)||!Array.isArray(s.meshes))throw new Error("nodes / meshes \u304C\u3042\u308A\u307E\u305B\u3093")}function ld(s,t={}){Ql(s);let e=new gn;e.name="__mayaRoot",e.matrixAutoUpdate=!1;let n=s.nodes.map((f,m)=>{let x=f.type==="joint"?new js:new gn;return x.name=f.name,x.matrixAutoUpdate=!1,x.matrix.fromArray(f.matrix),x.userData={nodeIndex:m,path:f.path,type:f.type,baseMatrix:x.matrix.clone(),fileMatrix:x.matrix.clone(),savedMatrix:x.matrix.clone(),bindMatrix:f.bindMatrix?new st().fromArray(f.bindMatrix):null},x}),i=s.nodes.map(()=>[]);s.nodes.forEach((f,m)=>{let x=f.parent;x>=0&&i[x].push(m),(x>=0&&f.inheritsTransform!==!1?n[x]:e).add(n[m])}),e.updateMatrixWorld(!0);let r=[];s.nodes.forEach((f,m)=>{f.type==="joint"&&r.push(m)});let o=(s.materials||[]).map((f,m)=>Kl(f,m,0,s.textures)),a=Kl(null,-1,0,s.textures),l=[a,...o],c=new Map,h=(f,m)=>{if(!(f>=0&&f<o.length))return a;let x=o[f];if(!m||!x.userData.udim)return x;let g=f+":"+m;if(!c.has(g)){let p=Kl(s.materials[f],f,m,s.textures);c.set(g,p),l.push(p)}return c.get(g)},u=new Map,d=s.meshes.map((f,m)=>{let x=wv(f,m,n,o,h,t);return x.skin&&f.skin.influences.forEach((g,p)=>{u.has(g)||u.set(g,[]),u.get(g).push({mesh:m,slot:p})}),x});return e.updateMatrixWorld(!0),{root:e,nodeObjects:n,meshes:d,jointIndices:r,childrenOf:i,influenceUsage:u,materials:o,defaultMaterial:a,allMaterials:l}}var dr=13223616;function yv(s,t="always"){return t==="always"?!0:t==="none"?!1:s.normalize===2}function vv(s,t,e){let n=s.zeroVertices;if(!n.length)return 0;let i=t.skin,r=new st().fromArray(i.geomMatrix),o=new st,a=i.bindPreMatrices.map(u=>new A().setFromMatrixPosition(o.fromArray(u).invert())),l=new A,c=new Set(n),h=null;if(i.weightDistribution===1){h=new Map;let u=(f,m)=>{h.has(f)||h.set(f,new Set),h.get(f).add(m)},d=0;for(let f of t.counts){for(let m=0;m<f;m++){let x=t.indices[d+m],g=t.indices[d+(m+1)%f];c.has(x)&&u(x,g),c.has(g)&&u(g,x)}d+=f}}for(let u of n){let d=Ju(s,u),f=null;if(h&&h.has(u)){let m=new Map;for(let x of h.get(u))if(!c.has(x))for(let g=0;g<a.length;g++){let p=Zl(s,x,g);p>0&&(!d.length||d.includes(g))&&m.set(g,(m.get(g)||0)+p)}m.size&&(f=[...m].map(([x,g])=>({slot:x,w:g})))}if(!f){l.fromArray(e,u*3).applyMatrix4(r);let m=x=>Math.max(l.distanceTo(a[x]),1e-6);if(d.length)f=d.map(x=>({slot:x,w:1/m(x)}));else{let x=0;for(let g=1;g<a.length;g++)m(g)<m(x)&&(x=g);f=[{slot:x,w:1}]}}Ku(s,u,f)}return n.length}function tc(s,t,e=!0){return t!=="bind"||!e?s.fileMatrix:s.bindMatrix||s.savedMatrix||s.fileMatrix}function ec(s,t){let e=Gn(s);for(let n of s.nodeObjects){let i=n.userData;i.baseMatrix.copy(tc(i,t,e)),n.matrix.copy(i.baseMatrix)}s.root.updateMatrixWorld(!0)}function Gn(s){return s.hasBind===void 0&&(s.hasBind=s.nodeObjects.some(t=>t.userData.bindMatrix)),s.hasBind}function _v(s,t){return t?`${s}:${t}`:String(s)}function Kl(s,t,e,n){let i={side:Ve,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1},r=new So({color:dr,roughness:.78,metalness:0,...i}),o=new De({color:dr,...i});Ss(r),Ss(o),r.name=s?s.name+(e?` <${e}>`:""):"(\u65E2\u5B9A)",o.name=r.name;let a=new wt(dr);s&&Array.isArray(s.color)&&a.setRGB(s.color[0],s.color[1],s.color[2]);let l={},c=!1,h=s&&s.maps||(s&&s.texture>=0?{baseColor:{texture:s.texture,channel:"rgb"}}:{});for(let[u,d]of Object.entries(h)){let f=(n||[])[d.texture];f&&(f.udim&&(c=!0),l[u]={texture:d.texture,channel:d.channel||"rgb",key:_v(d.texture,f.udim?e:0)})}return r.userData={index:t,tile:e,udim:c,isMaya:!!s,baseColor:a,maps:l,textureIndex:l.baseColor?l.baseColor.texture:-1,useAlpha:!!(s&&s.useAlpha),roughness:s&&typeof s.roughness=="number"?s.roughness:null,metalness:s&&typeof s.metalness=="number"?s.metalness:null,textures:{},hasAlpha:!1,unlit:o,sig:""},r}function Mv(s,t,e=null){let n=s.indices.length,i=s.uv;if((!i||!i.values||!i.values.length)&&!e){let x=new Uint32Array(t);for(let g=0;g<t;g++)x[g]=g;return{renderCount:t,origOf:x,firstRender:Int32Array.from(x),cornerRender:Uint32Array.from(s.indices),uvs:null}}let r=i&&i.values?i.values.length/2:0,o=e?n:t,a=new Int32Array(o).fill(-2),l=new Int32Array(o),c=new Map,h=new Uint32Array(n+t),u=r?new Float32Array((n+t)*2):null,d=0,f=new Uint32Array(n);for(let x=0;x<n;x++){let g=s.indices[x],p=r?i.indices[x]:-1,v=e?e[x]:g,y;if(a[v]===-2)a[v]=p,y=l[v]=d++;else if(a[v]===p)y=l[v];else{let b=v*(r+1)+(p+1);if(y=c.get(b),y===void 0)y=d++,c.set(b,y);else{f[x]=y;continue}}y===d-1&&(h[y]=g,u&&(u[y*2]=p>=0?i.values[p*2]:0,u[y*2+1]=p>=0?i.values[p*2+1]:0)),f[x]=y}let m=new Int32Array(t).fill(-1);for(let x=0;x<d;x++)m[h[x]]<0&&(m[h[x]]=x);for(let x=0;x<t;x++)m[x]<0&&(m[x]=d,h[d++]=x);return{renderCount:d,origOf:h.slice(0,d),firstRender:m,cornerRender:f,uvs:u?u.slice(0,d*2):null}}function ur(s,t,e,n=s.constructor){let i=new n(e.length*t);for(let r=0;r<e.length;r++){let o=e[r]*t,a=r*t;for(let l=0;l<t;l++)i[a+l]=s[o+l]}return i}function bv(s){let t=new Uint16Array(s.counts.length).fill(1001),e=s.uv;if(!e)return t;let n=0;for(let i=0;i<s.counts.length;i++){let r=0,o=0,a=0;for(let l=0;l<s.counts[i];l++){let c=e.indices[n+l];c>=0&&(r+=e.values[c*2],o+=e.values[c*2+1],a++)}if(a){let l=Math.min(9,Math.max(0,Math.floor(r/a))),c=Math.max(0,Math.floor(o/a));t[i]=1001+l+10*c}n+=s.counts[i]}return t}function wv(s,t,e,n,i,r){let o=Float32Array.from(s.positions),a=o.length/3,l=Yu(o,s.counts,s.indices),c=Zu(s.counts,s.indices,a),h=id(o,s.counts,s.indices,s.hardEdges,a),u=Mv(s,a,h.group),{origOf:d,firstRender:f,cornerRender:m}=u,x=new Float32Array(u.renderCount*3);for(let z=0;z<m.length;z++)x.set(h.normals.subarray(z*3,z*3+3),m[z]*3);let g=s.faceMaterials||null,p=Number.isInteger(s.material)?s.material:-1,y=(g||[p]).some(z=>n[z]&&n[z].userData.udim)?bv(s):null,b=new Map,w=[],M=z=>{let tt=i(g?g[z]:p,y?y[z]:0);return b.has(tt)||(b.set(tt,w.length),w.push(tt)),b.get(tt)},S=new Uint16Array(l.triCount);for(let z=0;z<l.triCount;z++)S[z]=M(l.triToFace[z]);w.length||w.push(i(p,0));let C=new Uint32Array(w.length);for(let z=0;z<l.triCount;z++)C[S[z]]++;let _=new Uint32Array(w.length);for(let z=1;z<w.length;z++)_[z]=_[z-1]+C[z-1];let E=_.slice(),N=new Uint32Array(l.triCount*3);for(let z=0;z<l.triCount;z++){let tt=E[S[z]]++*3;N[tt]=m[l.corners[z*3]],N[tt+1]=m[l.corners[z*3+1]],N[tt+2]=m[l.corners[z*3+2]]}let k=new Me(ur(o,3,d),3),Q=new zt(new Float32Array(u.renderCount*3).fill(1),3),L=new ne;if(L.setAttribute("position",k),L.setAttribute("normal",new Me(x,3)),L.setAttribute("color",Q),u.uvs&&L.setAttribute("uv",new Me(u.uvs,2)),L.setIndex(new Me(N,1)),w.length>1)for(let z=0;z<w.length;z++)L.addGroup(_[z]*3,C[z]*3,z);let U=w.length>1?w:w[0],D=new Uint32Array(c.index.length);for(let z=0;z<c.index.length;z++)D[z]=f[c.index[z]];let H=new ne;H.setAttribute("position",k),H.setAttribute("color",Q),H.setIndex(new Me(D,1));let G=r.wireMaterial||new De({color:1908772,wireframe:!0,transparent:!0,opacity:.55,depthWrite:!1});Ss(G);let B=e[s.transform],j=null,$=null,et=null,F=null,W=new mt(L,U),J=new mt(H,G);if(s.skin){et=ju(s.skin,a,{normalize:yv(s.skin,r.normalizeMode)}),et.normalize&&vv(et,s,o);let z={skinIndex:new wi(ur(et.skinIndex,4,d),4),skinWeight:new zt(ur(et.skinWeight,4,d),4),skinIndex1:new wi(ur(et.skinIndex1,4,d),4),skinWeight1:new zt(ur(et.skinWeight1,4,d),4)};for(let[Mt,Wt]of Object.entries(z))L.setAttribute(Mt,Wt),H.setAttribute(Mt,Wt);let tt=s.skin.influences.map(Mt=>e[Mt]),xt=s.skin.bindPreMatrices.map(Mt=>new st().fromArray(Mt));F=new _o(tt,xt);let St=new st().fromArray(s.skin.geomMatrix);j=jl(new Zs(L,U)),j.bindMode=Ro,j.bind(F,St),$=jl(new Zs(H,G)),$.bindMode=Ro,$.bind(F,St)}for(let z of[W,J,j,$])z&&(z.matrixAutoUpdate=!1,z.frustumCulled=!1,z.userData.meshIndex=t,B.add(z));return J.renderOrder=1,$&&($.renderOrder=1),{index:t,name:s.name,path:s.path,transform:s.transform,data:s,vertexCount:a,renderVertexCount:u.renderCount,origOf:d,firstRender:f,triCount:l.triCount,edgeCount:c.edgeCount,geometry:L,wireGeometry:H,wireMaterial:G,materials:w,staticMesh:W,staticWire:J,skinned:j,skinnedWire:$,skeleton:F,skin:et,visible:s.visible!==!1}}var Jl=new A;function fr(s,t,e,n){return n.fromBufferAttribute(s.geometry.attributes.position,t),e&&s.skinned?(s.skinned.applyBoneTransform(t,n),n.applyMatrix4(s.skinned.matrixWorld)):n.applyMatrix4(s.staticMesh.matrixWorld)}function Es(s,t,e,n){return fr(s,s.firstRender[t],e,n)}function cd(s,t){return s.origOf[t]}function hd(s,t){let e=s.geometry.attributes.color,n=e.array,i=s.origOf;for(let r=0;r<i.length;r++){let o=i[r]*3;n[r*3]=t[o],n[r*3+1]=t[o+1],n[r*3+2]=t[o+2]}e.needsUpdate=!0}function pr(s,t,e=!1){let n=new Ye;for(let i of s.meshes){if(!e&&!i.visible)continue;let r=Math.max(1,Math.floor(i.vertexCount/2e4));for(let o=0;o<i.vertexCount;o+=r)n.expandByPoint(Es(i,o,t,Jl))}for(let i of s.jointIndices)n.expandByPoint(Jl.setFromMatrixPosition(s.nodeObjects[i].matrixWorld));for(let i of s.curveItems||[]){if(!i||!e&&!i.line.visible)continue;let r=i.line.geometry.getAttribute("position"),o=Math.max(1,Math.floor(r.count/16));for(let a=0;a<r.count;a+=o)n.expandByPoint(Jl.fromBufferAttribute(r,a).applyMatrix4(i.line.matrixWorld))}return n.isEmpty()&&n.set(new A(-50,-50,-50),new A(50,50,50)),n}function ud(s){if(!s)return;let t=new Set,e=n=>{n&&!t.has(n)&&(t.add(n),n.dispose())};for(let n of s.allMaterials||[])n.userData.unlit&&e(n.userData.unlit),e(n);for(let n of s.meshes)e(n.geometry),e(n.wireGeometry),e(n.wireMaterial),n.skeleton&&n.skeleton.dispose();s.root.removeFromParent()}var Go=class extends Eo{constructor(t){super(t)}parse(t){function e(D){switch(D.image_type){case d:case x:if(D.colormap_length>256||D.colormap_size!==24||D.colormap_type!==1)throw new Error("THREE.TGALoader: Invalid type colormap data for indexed type.");break;case f:case m:case g:case p:if(D.colormap_type)throw new Error("THREE.TGALoader: Invalid type colormap data for colormap type.");break;case u:throw new Error("THREE.TGALoader: No data.");default:throw new Error("THREE.TGALoader: Invalid type "+D.image_type)}if(D.width<=0||D.height<=0)throw new Error("THREE.TGALoader: Invalid image size.");if(D.pixel_size!==8&&D.pixel_size!==16&&D.pixel_size!==24&&D.pixel_size!==32)throw new Error("THREE.TGALoader: Invalid pixel size "+D.pixel_size)}function n(D,H,G,B,j){let $,et,F=G.pixel_size>>3,W=G.width*G.height*F;if(H&&(et=j.subarray(B,B+=G.colormap_length*(G.colormap_size>>3))),D){$=new Uint8Array(W);let J,z,tt,xt=0,St=new Uint8Array(F);for(;xt<W;)if(J=j[B++],z=(J&127)+1,J&128){for(tt=0;tt<F;++tt)St[tt]=j[B++];for(tt=0;tt<z;++tt)$.set(St,xt+tt*F);xt+=F*z}else{for(z*=F,tt=0;tt<z;++tt)$[xt+tt]=j[B++];xt+=z}}else $=j.subarray(B,B+=H?G.width*G.height:W);return{pixel_data:$,palettes:et}}function i(D,H,G,B,j,$,et,F,W){let J=W,z,tt=0,xt,St,Mt=E.width;for(St=H;St!==B;St+=G)for(xt=j;xt!==et;xt+=$,tt++)z=F[tt],D[(xt+Mt*St)*4+3]=255,D[(xt+Mt*St)*4+2]=J[z*3+0],D[(xt+Mt*St)*4+1]=J[z*3+1],D[(xt+Mt*St)*4+0]=J[z*3+2];return D}function r(D,H,G,B,j,$,et,F){let W,J=0,z,tt,xt=E.width;for(tt=H;tt!==B;tt+=G)for(z=j;z!==et;z+=$,J+=2)W=F[J+0]+(F[J+1]<<8),D[(z+xt*tt)*4+0]=(W&31744)>>7,D[(z+xt*tt)*4+1]=(W&992)>>2,D[(z+xt*tt)*4+2]=(W&31)<<3,D[(z+xt*tt)*4+3]=W&32768?0:255;return D}function o(D,H,G,B,j,$,et,F){let W=0,J,z,tt=E.width;for(z=H;z!==B;z+=G)for(J=j;J!==et;J+=$,W+=3)D[(J+tt*z)*4+3]=255,D[(J+tt*z)*4+2]=F[W+0],D[(J+tt*z)*4+1]=F[W+1],D[(J+tt*z)*4+0]=F[W+2];return D}function a(D,H,G,B,j,$,et,F){let W=0,J,z,tt=E.width;for(z=H;z!==B;z+=G)for(J=j;J!==et;J+=$,W+=4)D[(J+tt*z)*4+2]=F[W+0],D[(J+tt*z)*4+1]=F[W+1],D[(J+tt*z)*4+0]=F[W+2],D[(J+tt*z)*4+3]=F[W+3];return D}function l(D,H,G,B,j,$,et,F){let W,J=0,z,tt,xt=E.width;for(tt=H;tt!==B;tt+=G)for(z=j;z!==et;z+=$,J++)W=F[J],D[(z+xt*tt)*4+0]=W,D[(z+xt*tt)*4+1]=W,D[(z+xt*tt)*4+2]=W,D[(z+xt*tt)*4+3]=255;return D}function c(D,H,G,B,j,$,et,F){let W=0,J,z,tt=E.width;for(z=H;z!==B;z+=G)for(J=j;J!==et;J+=$,W+=2)D[(J+tt*z)*4+0]=F[W+0],D[(J+tt*z)*4+1]=F[W+0],D[(J+tt*z)*4+2]=F[W+0],D[(J+tt*z)*4+3]=F[W+1];return D}function h(D,H,G,B,j){let $,et,F,W,J,z;switch((E.flags&v)>>y){default:case M:$=0,F=1,J=H,et=0,W=1,z=G;break;case b:$=0,F=1,J=H,et=G-1,W=-1,z=-1;break;case S:$=H-1,F=-1,J=-1,et=0,W=1,z=G;break;case w:$=H-1,F=-1,J=-1,et=G-1,W=-1,z=-1;break}if(Q)switch(E.pixel_size){case 8:l(D,et,W,z,$,F,J,B);break;case 16:c(D,et,W,z,$,F,J,B);break;default:throw new Error("THREE.TGALoader: Format not supported.")}else switch(E.pixel_size){case 8:i(D,et,W,z,$,F,J,B,j);break;case 16:r(D,et,W,z,$,F,J,B);break;case 24:o(D,et,W,z,$,F,J,B);break;case 32:a(D,et,W,z,$,F,J,B);break;default:throw new Error("THREE.TGALoader: Format not supported.")}return D}let u=0,d=1,f=2,m=3,x=9,g=10,p=11,v=48,y=4,b=0,w=1,M=2,S=3;if(t.length<19)throw new Error("THREE.TGALoader: Not enough data to contain header.");let C=0,_=new Uint8Array(t),E={id_length:_[C++],colormap_type:_[C++],image_type:_[C++],colormap_index:_[C++]|_[C++]<<8,colormap_length:_[C++]|_[C++]<<8,colormap_size:_[C++],origin:[_[C++]|_[C++]<<8,_[C++]|_[C++]<<8],width:_[C++]|_[C++]<<8,height:_[C++]|_[C++]<<8,pixel_size:_[C++],flags:_[C++]};if(e(E),E.id_length+C>t.length)throw new Error("THREE.TGALoader: No data.");C+=E.id_length;let N=!1,k=!1,Q=!1;switch(E.image_type){case x:N=!0,k=!0;break;case d:k=!0;break;case g:N=!0;break;case f:break;case p:N=!0,Q=!0;break;case m:Q=!0;break}let L=new Uint8Array(E.width*E.height*4),U=n(N,k,E,C,_);return h(L,E.width,E.height,U.pixel_data,U.palettes),{data:L,width:E.width,height:E.height,flipY:!0,generateMipmaps:!0,minFilter:Sn}}};var dd=2048;function Sv(s){return new Promise((t,e)=>{let n=new XMLHttpRequest;n.open("GET",s,!0),n.responseType="arraybuffer",n.onload=()=>{(n.status===200||n.status===0)&&n.response&&n.response.byteLength?t(n.response):e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08status "+n.status+"\uFF09"))},n.onerror=()=>e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08\u30A2\u30AF\u30BB\u30B9\u304C\u8A31\u53EF\u3055\u308C\u3066\u3044\u306A\u3044\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF09")),n.send()})}function gd(s){let t=atob(s),e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e.buffer}function xd(s,t){let e=document.createElement("canvas");return e.width=s,e.height=t,e}function fd(s){for(let t=3;t<s.length;t+=4)if(s[t]<250)return!0;return!1}function Ev(s,t,e,n,i){let r=new Uint8Array(n*i*4),o=t/n,a=e/i;for(let l=0;l<i;l++){let c=Math.floor(l*a),h=Math.max(c+1,Math.floor((l+1)*a));for(let u=0;u<n;u++){let d=Math.floor(u*o),f=Math.max(d+1,Math.floor((u+1)*o)),m=0,x=0,g=0,p=0;for(let b=c;b<h;b++){let w=(b*t+d)*4;for(let M=d;M<f;M++,w+=4)m+=s[w],x+=s[w+1],g+=s[w+2],p+=s[w+3]}let v=(h-c)*(f-d),y=(l*n+u)*4;r[y]=m/v,r[y+1]=x/v,r[y+2]=g/v,r[y+3]=p/v}}return r}function pd(s,t){let e=Math.max(s,t);if(e<=dd)return[s,t];let n=dd/e;return[Math.max(1,Math.round(s*n)),Math.max(1,Math.round(t*n))]}async function Av(s,t){if(t==="tga"){let f=new Go().parse(s);if(!f||!f.data||!f.width)throw new Error("TGA \u3092\u89E3\u6790\u3067\u304D\u307E\u305B\u3093");let m=new Uint8Array(f.data.buffer,f.data.byteOffset,f.width*f.height*4),[x,g]=pd(f.width,f.height);return x!==f.width&&(m=Ev(m,f.width,f.height,x,g)),{kind:"data",image:{data:m,width:x,height:g},width:x,height:g,sourceWidth:f.width,sourceHeight:f.height,hasAlpha:fd(m)}}let e=new Blob([s]),n=await createImageBitmap(e),i=n.width,r=n.height;n.close&&n.close();let[o,a]=pd(i,r),l={premultiplyAlpha:"none",colorSpaceConversion:"none",imageOrientation:"flipY"};o!==i&&Object.assign(l,{resizeWidth:o,resizeHeight:a,resizeQuality:"high"});let c=await createImageBitmap(e,l),h=xd(c.width,c.height),u=h.getContext("2d",{willReadFrequently:!0});u.drawImage(c,0,0);let d=fd(u.getImageData(0,0,h.width,h.height).data);return{kind:"bitmap",image:c,width:c.width,height:c.height,sourceWidth:i,sourceHeight:r,hasAlpha:d}}function Tv(s){if(s.kind==="data")return s.image.data;if(!s.pixels){let e=xd(s.width,s.height).getContext("2d",{willReadFrequently:!0});e.translate(0,s.height),e.scale(1,-1),e.drawImage(s.image,0,0),s.pixels=e.getImageData(0,0,s.width,s.height).data}return s.pixels}function Cv(s,t){let e={r:0,g:1,b:2,a:3}[t]??0,n=new Uint8Array(s.length);for(let i=0;i<s.length;i+=4){let r=s[i+e];n[i]=r,n[i+1]=r,n[i+2]=r,n[i+3]=255}return n}function md(s,t,e){let n=new ms(s,t,e,Ze);return n.flipY=!0,n.magFilter=Ne,n.minFilter=Sn,n.generateMipmaps=!0,n}function yd(s,t){let[e,n]=t.split(":"),i;if(n&&n!=="rgb")i=md(Cv(Tv(s),n),s.width,s.height);else if(s.kind==="data"){let{data:r,width:o,height:a}=s.image;i=md(r,o,a)}else i=new Je(s.image),i.flipY=!1;return i.premultiplyAlpha=!1,i.colorSpace=e==="color"||e==="view"?ve:je,i.wrapS=us,i.wrapT=us,i.anisotropy=4,i.needsUpdate=!0,i}async function vd(s,t,e,n,i={}){let r=null,o="file",a=null;if(s&&!i.forceBridge)try{r=await Sv(s)}catch(l){a=l}if(!r&&n&&t&&(r=await n(t),o="python"),!r)throw a||new Error("\u8AAD\u307F\u8FBC\u3080\u65B9\u6CD5\u304C\u3042\u308A\u307E\u305B\u3093");return{decoded:await Av(r,e),via:o}}function _d(s,t,e){let n=!t||t==="rgb"?s==="baseColor"||s==="emissive"||s==="normal"?"rgb":"r":t;return e?n==="rgb"?"view:rgb":"view:"+n:s==="baseColor"||s==="emissive"?n==="rgb"?"color":"scalar:"+n:s==="normal"?"normal":"scalar:"+n}function Rv(s){if(!s.textures)return[];if(s.mapView&&s.mapView!=="combined")return[s.mapView];let t=["baseColor"];for(let e of["normal","roughness","metalness","ao","emissive","opacity"])s.maps&&s.maps[e]&&t.push(e);return t}var Wo=class{constructor(){this.state=new Map,this.token=0,this.data=null}reset(t){for(let e of this.state.values())for(let n of e.textures.values())n.dispose();this.state.clear(),this.token++,this.data=t}source(t){let[e,n]=String(t).split(":"),i=+e,r=n?+n:0,o=(this.data&&this.data.textures||[])[i];if(!o)return null;if(o.udim){let a=(o.tiles||[]).find(l=>l.tile===r);return{ti:i,tile:r,info:o,url:a?a.url:null,resolved:a?a.resolved:null,format:o.format}}return{ti:i,tile:r,info:o,url:o.url,resolved:o.resolved,format:o.format}}neededKeys(t,e){let n=Rv(e),i=new Set;for(let r of t)for(let o of n){let a=r.userData.maps[o];a&&i.add(a.key)}return i}ensure(t,e,n,i,r){let o=this.token,a=[];for(let c of t){if(this.state.has(c))continue;let h=this.source(c);if(!h||!h.resolved||!h.format){this.state.set(c,{status:"missing",...h,textures:new Map});continue}let u={status:"loading",...h,textures:new Map};this.state.set(c,u),a.push([c,u])}let l=0;for(let[c,h]of a)vd(h.url,h.resolved,h.format,e,n).then(u=>{o===this.token&&(h.status="ok",h.decoded=u.decoded,h.via=u.via)}).catch(u=>{o===this.token&&(h.status="error",h.message=String(u&&u.message||u),r&&r(c,h))}).finally(()=>{o===this.token&&(l++,i&&i(l,a.length))});return a.length}texture(t,e){let n=this.state.get(t);if(!n||n.status!=="ok")return null;let i=n.textures.get(e);return i||(i=yd(n.decoded,e),n.textures.set(e,i)),i}hasAlpha(t){let e=this.state.get(t);return!!(e&&e.status==="ok"&&e.decoded.hasAlpha)}textureStatus(t){let e=(this.data&&this.data.textures||[])[t];if(!e)return{status:"missing"};let n=e.udim?(e.tiles||[]).map(r=>`${t}:${r.tile}`):[String(t)];if(!n.length)return{status:"missing",info:e};let i=n.map(r=>this.state.get(r));if(i.some(r=>r&&r.status==="loading"))return{status:"loading",info:e};if(i.some(r=>r&&r.status==="error"))return{status:"error",info:e,message:i.find(r=>r&&r.status==="error").message};if(i.some(r=>r&&r.status==="missing"))return{status:"missing",info:e};if(i.every(r=>r&&r.status==="ok")){let r=i[0].decoded;return{status:"ok",info:e,via:i[0].via,tiles:n.length,width:r.width,height:r.height,sourceWidth:r.sourceWidth,sourceHeight:r.sourceHeight,hasAlpha:i.some(o=>o.decoded.hasAlpha)}}return{status:"pending",info:e}}};var Md=new wt(6211813),nc=new wt(15903035),Pv=new wt(12903275),Lv=new wt(12166898),Iv=new wt(7041916),ic=[new wt(15034203),new wt(8376683),new wt(6000624)],Li=new st,Wn=new A,mr=new _t,gr=new A,qo=new A,sc=new A,qn=new A,Nv=new A(0,1,0),Dv=new _t;function Uv(){let e=[0,0,0,1,.1,0,0,.1,1,-1,.1,0,0,.1,-1,0,1,0],n=[0,2,1,0,3,2,0,4,3,0,1,4,5,1,2,5,2,3,5,3,4,5,4,1],i=new ne;return i.setAttribute("position",new zt(e,3)),i.setIndex(n),i}var Xo=class{constructor(){this.group=new gn,this.group.name="__jointOverlay",this.size=1,this.xray=!0,this.axesMode="selected",this.selected=-1,this.hiddenNodes=null,this.joints=[],this.links=[],this.slotOf=new Map,this.sphereGeo=new xs(1,14,10),this.boneGeo=Uv(),this.sphereMat=new De({color:16777215,transparent:!0,opacity:.92}),this.boneMat=new De({color:16777215,wireframe:!0,transparent:!0,opacity:.9}),this.axesMat=new Qe({vertexColors:!0,transparent:!0,opacity:1}),this.spheres=null,this.bones=null,this.axes=null,this.controls=[],this.controlGeo=new Hn(1,0),this.controlMat=new De({color:16777215,wireframe:!0,transparent:!0,opacity:.95}),this.controlMesh=null,this.statusOf=null}clear(){for(let t of[this.spheres,this.bones,this.axes])t&&(this.group.remove(t),t.isLineSegments?t.geometry.dispose():t.dispose?.());this.spheres=this.bones=this.axes=null,this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controlMesh=null,this.controls=[],this.statusOf=null,this.joints=[],this.links=[],this.slotOf=new Map,this.selected=-1}build(t,e,n){this.clear(),this.built=t,this.joints=t.jointIndices.slice(),this.joints.forEach((h,u)=>this.slotOf.set(h,u));for(let h of this.joints){let u=e[h].parent;for(;u>=0&&e[u].type!=="joint";)u=e[u].parent;u>=0&&this.links.push([u,h])}let i=this.links.map(([h,u])=>qo.setFromMatrixPosition(t.nodeObjects[h].matrixWorld).distanceTo(sc.setFromMatrixPosition(t.nodeObjects[u].matrixWorld))).filter(h=>h>1e-9).sort((h,u)=>h-u),r=i.length?i[i.length>>1]:0;this.baseSize=r>0?Math.min(n*.015,r*.12):n*.012;let o=Math.max(1,this.joints.length);this.spheres=new gs(this.sphereGeo,this.sphereMat,o),this.spheres.count=this.joints.length,this.spheres.instanceMatrix.setUsage(sr),this.spheres.frustumCulled=!1;let a=Math.max(1,this.links.length);this.bones=new gs(this.boneGeo,this.boneMat,a),this.bones.count=this.links.length,this.bones.instanceMatrix.setUsage(sr),this.bones.frustumCulled=!1;let l=new ne;l.setAttribute("position",new zt(new Float32Array(o*18),3).setUsage(sr));let c=new Float32Array(o*18);for(let h=0;h<o;h++)for(let u=0;u<3;u++)for(let d=0;d<2;d++){let f=(h*6+u*2+d)*3;c[f]=ic[u].r,c[f+1]=ic[u].g,c[f+2]=ic[u].b}l.setAttribute("color",new zt(c,3)),this.axes=new ii(l,this.axesMat),this.axes.frustumCulled=!1,this.group.add(this.bones,this.spheres,this.axes),this.applyXray(),this.update()}applyXray(){for(let t of[this.sphereMat,this.boneMat,this.axesMat,this.controlMat])t.depthTest=!this.xray,t.depthWrite=!this.xray,t.needsUpdate=!0;for(let t of[this.spheres,this.bones,this.axes,this.controlMesh])t&&(t.renderOrder=this.xray?10:0)}setControllers(t){this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controls=t.slice(),this.controlMesh=null,this.controls.length&&(this.controlMesh=new gs(this.controlGeo,this.controlMat,this.controls.length),this.controlMesh.instanceMatrix.setUsage(sr),this.controlMesh.frustumCulled=!1,this.group.add(this.controlMesh)),this.applyXray(),this.update()}setXray(t){this.xray=t,this.applyXray()}setSize(t){this.size=t,this.update()}setAxesMode(t){this.axesMode=t,this.update()}setSelected(t){this.selected=t,this.update()}setVisible(t){this.group.visible=t}setStatus(t){this.statusOf=t,this.update()}setHiddenNodes(t){this.hiddenNodes=t,this.update()}radius(){return this.baseSize*this.size}update(){if(!this.spheres)return;let t=this.built.nodeObjects,e=this.radius(),n=new Set;this.links.forEach(([f,m],x)=>{f===this.selected&&n.add(x)});let i=this.hiddenNodes,r=f=>!!(i&&i[f]),o=(f,m)=>{let x=this.statusOf?this.statusOf(f):null;return x==="estimated"?Lv:x==="unknown"?Iv:m};this.joints.forEach((f,m)=>{t[f].matrixWorld.decompose(Wn,mr,gr);let x=r(f)?0:e;Li.compose(Wn,Dv,gr.set(x,x,x)),this.spheres.setMatrixAt(m,Li),this.spheres.setColorAt(m,f===this.selected?nc:o(f,Md))}),this.spheres.instanceMatrix.needsUpdate=!0,this.spheres.instanceColor&&(this.spheres.instanceColor.needsUpdate=!0),this.spheres.boundingSphere=null,this.links.forEach(([f,m],x)=>{qo.setFromMatrixPosition(t[f].matrixWorld),sc.setFromMatrixPosition(t[m].matrixWorld),qn.subVectors(sc,qo);let g=qn.length();if(g<1e-9||r(m))Li.makeScale(0,0,0);else{mr.setFromUnitVectors(Nv,qn.multiplyScalar(1/g));let p=Math.min(e*.75,g*.12);Li.compose(qo,mr,gr.set(p,g,p))}this.bones.setMatrixAt(x,Li),this.bones.setColorAt(x,n.has(x)?nc:o(m,Md))}),this.bones.instanceMatrix.needsUpdate=!0,this.bones.instanceColor&&(this.bones.instanceColor.needsUpdate=!0),this.bones.boundingSphere=null;let a=this.axes.geometry.attributes.position,l=a.array,c=0,h=e*4,d=this.axesMode==="all"?this.joints:this.axesMode==="selected"&&this.selected>=0?[this.selected]:[];for(let f of d){if(r(f))continue;let m=t[f].matrixWorld.elements;Wn.set(m[12],m[13],m[14]);for(let x=0;x<3;x++){qn.set(m[x*4],m[x*4+1],m[x*4+2]);let g=qn.length()||1;qn.multiplyScalar(h/g).add(Wn);let p=(c*6+x*2)*3;l[p]=Wn.x,l[p+1]=Wn.y,l[p+2]=Wn.z,l[p+3]=qn.x,l[p+4]=qn.y,l[p+5]=qn.z}if(c++,c*6>l.length/3)break}this.axes.geometry.setDrawRange(0,c*6),a.needsUpdate=!0,this.axes.visible=c>0,this.spheres.visible=this.joints.length>0,this.bones.visible=this.links.length>0,this.controlMesh&&(this.controls.forEach((f,m)=>{t[f].matrixWorld.decompose(Wn,mr,gr);let x=r(f)?0:e*2.2;Li.compose(Wn,mr,gr.set(x,x,x)),this.controlMesh.setMatrixAt(m,Li),this.controlMesh.setColorAt(m,f===this.selected?nc:o(f,Pv))}),this.controlMesh.instanceMatrix.needsUpdate=!0,this.controlMesh.instanceColor&&(this.controlMesh.instanceColor.needsUpdate=!0),this.controlMesh.boundingSphere=null)}pick(t){if(!this.spheres||!this.group.visible)return-1;if(this.joints.length){let e=t.intersectObject(this.spheres,!1);if(e.length&&e[0].instanceId!==void 0)return this.joints[e[0].instanceId]}if(this.controlMesh){let e=t.intersectObject(this.controlMesh,!1);if(e.length&&e[0].instanceId!==void 0)return this.controls[e[0].instanceId]}return-1}};var ot=s=>document.getElementById(s),$o={joint:'<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',transform:'<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',mesh:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',skin:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>'},Ov='<svg class="on" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.8" fill="currentColor"/></svg><svg class="off" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M2 12 12 2" stroke="currentColor" stroke-width="1.4"/></svg>',re=s=>String(s).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),Ii=(s,t=3)=>Number.isFinite(s)?(Math.abs(s)<.5*10**-t?0:s).toFixed(t):String(s),Xn=(s,t=3)=>s.map(e=>Ii(e,t)).join(", "),an=s=>s.toLocaleString("ja-JP"),Yo=class{constructor(t){this.app=t,this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null,this.filter="",this.msgTimer=0,this.bindToolbar(),this.bindTabs(),this.bindTree(),this.bindPose(),this.bindPanels(),this.bindResizer()}bindResizer(){let t=ot("left-resizer"),e=ot("app"),n=260,i=160,r=()=>Math.max(i,Math.min(640,Math.floor(window.innerWidth*.5))),o=()=>ot("left").getBoundingClientRect().width,a=h=>{let u=Math.round(Math.max(i,Math.min(r(),h)));return e.style.setProperty("--left-user",u+"px"),t.setAttribute("aria-valuenow",String(u)),u};t.setAttribute("aria-valuemin",String(i)),t.setAttribute("aria-valuemax",String(r()));let l=null;t.addEventListener("pointerdown",h=>{if(h.button===0){h.preventDefault(),l={x:h.clientX,w:o()};try{t.setPointerCapture(h.pointerId)}catch{}t.classList.add("dragging"),document.body.classList.add("resizing")}}),t.addEventListener("pointermove",h=>{l&&a(l.w+(h.clientX-l.x))});let c=()=>{l&&(l=null,t.classList.remove("dragging"),document.body.classList.remove("resizing"))};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c),t.addEventListener("dblclick",()=>{e.style.removeProperty("--left-user"),t.setAttribute("aria-valuenow",String(n))}),t.addEventListener("keydown",h=>{let u=h.shiftKey?64:16;if(h.key==="ArrowLeft")a(o()-u);else if(h.key==="ArrowRight")a(o()+u);else if(h.key==="Home")a(i);else if(h.key==="End")a(r());else return;h.preventDefault(),h.stopPropagation()}),this.setLeftWidth=a}bindPanels(){for(let t of["left","right"])ot(t+"-collapse").addEventListener("click",()=>this.setPanelCollapsed(t,!0)),ot(t+"-expand").addEventListener("click",()=>this.setPanelCollapsed(t,!1))}setPanelCollapsed(t,e){document.body.classList.toggle(t+"-collapsed",e),ot(t+"-collapse").setAttribute("aria-expanded",String(!e)),ot(t+"-expand").setAttribute("aria-expanded",String(!e)),ot(t+(e?"-expand":"-collapse")).focus()}isPanelCollapsed(t){return document.body.classList.contains(t+"-collapsed")}setHost(t){document.body.dataset.host=t}bindToolbar(){let t=(n,i)=>this.app.setSetting(n,i);document.querySelectorAll(".choices[data-setting]").forEach(n=>{n.addEventListener("click",i=>{let r=i.target.closest("button[data-value]");if(!r)return;let o=n.dataset.setting;o==="camera"?this.app.setCamera(+r.dataset.value):t(o,r.dataset.value),n.closest("[data-close-on-pick]")&&this.closeMenus&&this.closeMenus()})}),ot("opt-bind").addEventListener("click",()=>this.app.togglePoseSource()),ot("opt-camera-icons").addEventListener("change",n=>t("cameraIcons",n.target.checked)),ot("opt-hud").addEventListener("change",n=>t("hud",n.target.checked)),ot("opt-camera-gate").addEventListener("change",n=>t("cameraGate",n.target.checked)),ot("opt-normal-flip").addEventListener("change",n=>t("normalFlipY",n.target.checked)),document.querySelectorAll("#map-toggles [data-map]").forEach(n=>{n.addEventListener("change",()=>this.app.setMapToggle(n.dataset.map,n.checked))}),ot("opt-jsize").addEventListener("input",n=>t("jointSize",parseFloat(n.target.value)));let e={"opt-wire":"wire","opt-skin":"skin","opt-joints":"joints","opt-curves":"curves","opt-xray":"xray","opt-tex":"textures","opt-grid":"grid"};for(let[n,i]of Object.entries(e))ot(n).addEventListener("click",r=>{let o=r.currentTarget.getAttribute("aria-pressed")!=="true";r.currentTarget.setAttribute("aria-pressed",String(o)),t(i,o)});document.querySelectorAll("#opt-tool [data-tool]").forEach(n=>{n.addEventListener("click",()=>t("tool",n.dataset.tool))}),document.querySelectorAll("#opt-pick [data-pick]").forEach(n=>{n.addEventListener("click",()=>t("pickMode",n.dataset.pick))}),ot("opt-pick-all").addEventListener("click",n=>t("pickAll",n.currentTarget.getAttribute("aria-pressed")!=="true")),ot("opt-space").addEventListener("click",n=>t("space",n.currentTarget.getAttribute("aria-pressed")==="true"?"local":"world")),this.bindMenus(),ot("btn-undo").addEventListener("click",()=>this.app.undo()),ot("btn-warnings").addEventListener("click",()=>this.app.showWarnings()),ot("warn-dialog-close").addEventListener("click",()=>ot("warn-dialog").close()),ot("btn-redo").addEventListener("click",()=>this.app.redo()),ot("btn-frame-all").addEventListener("click",()=>this.app.frameAll()),ot("btn-frame-sel").addEventListener("click",()=>this.app.frameSelection()),ot("file-input").addEventListener("change",n=>{let i=n.target.files&&n.target.files[0];i&&this.app.loadFile(i),n.target.value=""}),document.querySelector('label[for="file-input"]').addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),ot("file-input").click())})}syncSettings(t){document.querySelectorAll(".choices[data-setting]").forEach(i=>{i.dataset.setting!=="camera"&&this.checkChoice(i,t[i.dataset.setting])}),ot("opt-jsize").value=t.jointSize,ot("opt-wire").setAttribute("aria-pressed",String(t.wire)),ot("opt-skin").setAttribute("aria-pressed",String(t.skin)),ot("opt-joints").setAttribute("aria-pressed",String(t.joints)),ot("opt-curves").setAttribute("aria-pressed",String(t.curves!==!1)),ot("opt-xray").setAttribute("aria-pressed",String(t.xray)),ot("opt-grid").setAttribute("aria-pressed",String(!!t.grid)),ot("opt-tex").setAttribute("aria-pressed",String(t.textures)),ot("opt-bind").setAttribute("aria-pressed",String(t.poseSource==="bind")),ot("opt-camera-icons").checked=t.cameraIcons!==!1,ot("opt-hud").checked=t.hud!==!1,ot("opt-camera-gate").checked=t.cameraGate!==!1,ot("opt-normal-flip").checked=!!t.normalFlipY,ot("map-toggles").disabled=t.mapView!=="combined",document.querySelectorAll("#map-toggles [data-map]").forEach(i=>{i.checked=!!t.maps[i.dataset.map]}),ot("opt-space").setAttribute("aria-pressed",String(t.space==="world")),document.querySelectorAll("#opt-pick [data-pick]").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.pick===t.pickMode))),ot("opt-pick-all").setAttribute("aria-pressed",String(!!t.pickAll));let e={baseColor:"\u30D9\u30FC\u30B9\u30AB\u30E9\u30FC",normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},n=[t.lighting==="flat"?"\u30D5\u30E9\u30C3\u30C8\u30E9\u30A4\u30C8":"",t.shading==="none"?"\u30EF\u30A4\u30E4\u30FC\u306E\u307F":t.shading==="flat"?"\u30D5\u30E9\u30C3\u30C8":""].filter(Boolean).join("\u30FB");ot("menu-view-state").textContent=n,ot("menu-maps-state").textContent=t.mapView!=="combined"&&e[t.mapView]||"",ot("menu-weights-state").textContent={selected:"\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7",all:"\u8272\u5206\u3051"}[t.weightMode]||"",document.querySelectorAll("#opt-tool [data-tool]").forEach(i=>{i.setAttribute("aria-pressed",String(i.dataset.tool===t.tool))})}setToolbarHints(t){for(let e of["opt-wire","opt-tex","opt-skin","opt-joints","opt-curves","opt-xray","opt-bind","opt-grid"]){let n=ot(e);n.dataset.baseTitle===void 0&&(n.dataset.baseTitle=n.title);let i=t[e];n.classList.toggle("inert",!!i),n.title=i?`${n.dataset.baseTitle}
\u203B \u3044\u307E\u306F\u52B9\u679C\u304C\u3042\u308A\u307E\u305B\u3093: ${i}`:n.dataset.baseTitle}}checkChoice(t,e){t.querySelectorAll("button[data-value]").forEach(n=>n.setAttribute("aria-checked",String(n.dataset.value===String(e))))}setCameras(t){let e=ot("opt-camera");e.textContent="";let n=(i,r,o)=>{let a=document.createElement("button");if(Object.assign(a,{type:"button",textContent:r}),a.setAttribute("role","radio"),a.dataset.value=String(i),o){let l=document.createElement("span");l.className="c-sub",l.textContent=o,a.appendChild(l)}e.appendChild(a)};if(n(-1,"\u81EA\u7531\u8996\u70B9\uFF08\u30D1\u30FC\u30B9\uFF09"),t.forEach((i,r)=>n(r,i.name,i.orthographic?"\u5E73\u884C\u6295\u5F71":`${Ii(i.focalLength,0)}mm`)),!t.length){let i=document.createElement("p");i.className="muted small",i.textContent="\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F\u30AB\u30E1\u30E9\u304C\u3042\u308A\u307E\u305B\u3093",e.appendChild(i)}ot("camera-note").hidden=!t.length,this.setViewCamera(-1,"")}setViewCamera(t,e,n=!1){this.checkChoice(ot("opt-camera"),t),ot("menu-camera-state").textContent=t>=0?e+(n?"\uFF08\u8996\u70B9\u3092\u79FB\u52D5\u4E2D\uFF09":""):"",ot("viewport").classList.toggle("viewing-camera",t>=0),ot("vp-hint").textContent=t>=0?`\u30AB\u30E1\u30E9 ${e} \u304B\u3089\u8868\u793A\u4E2D${n?"\uFF08\u8996\u70B9\u3092\u52D5\u304B\u3057\u3066\u3044\u307E\u3059\u3002\u30D5\u30EC\u30FC\u30E0\u3092\u52D5\u304B\u3059\u304B\u518D\u751F\u3059\u308B\u3068\u623B\u308A\u307E\u3059\uFF09":"\uFF08\u505C\u6B62\u4E2D\u306F\u30C9\u30E9\u30C3\u30B0\u3067\u8996\u70B9\u3092\u52D5\u304B\u305B\u307E\u3059\uFF09"}\u3000Shift+C: \u81EA\u7531\u8996\u70B9\u306B\u623B\u3059`:"\u5DE6\u30C9\u30E9\u30C3\u30B0: \u56DE\u8EE2\u3000\u4E2D\u30C9\u30E9\u30C3\u30B0: \u79FB\u52D5\u3000\u53F3\u30C9\u30E9\u30C3\u30B0\u30FB\u30DB\u30A4\u30FC\u30EB: \u30BA\u30FC\u30E0\u3000\u30AF\u30EA\u30C3\u30AF: \u9078\u629E"}setGate(t,e,n,i){let r=ot("cam-gate");if(!e){r.hidden=!0;return}r.hidden=!1,r.classList.toggle("no-mask",!t);let[o,a,l,c]=r.children,h=u=>`${Math.round(u)}px`;Object.assign(o.style,{left:0,right:0,top:0,height:h(e.y)}),Object.assign(a.style,{left:0,right:0,bottom:0,height:h(i-e.y-e.h)}),Object.assign(l.style,{left:0,top:h(e.y),width:h(e.x),height:h(e.h)}),Object.assign(c.style,{right:0,top:h(e.y),width:h(n-e.x-e.w),height:h(e.h)}),Object.assign(r.querySelector(".g-frame").style,{left:h(e.x),top:h(e.y),width:h(e.w),height:h(e.h)})}bindMenus(){let t=[...document.querySelectorAll(".menu-btn")],e=n=>{for(let i of t)i!==n&&(i.setAttribute("aria-expanded","false"),ot(i.getAttribute("aria-controls")).hidden=!0)};for(let n of t)n.addEventListener("click",()=>{let i=n.getAttribute("aria-expanded")!=="true";e(n),n.setAttribute("aria-expanded",String(i)),ot(n.getAttribute("aria-controls")).hidden=!i});document.addEventListener("pointerdown",n=>{n.target.closest(".menu")||e(null)}),document.addEventListener("keydown",n=>{if(n.key!=="Escape")return;let i=t.find(r=>r.getAttribute("aria-expanded")==="true");i&&(e(null),i.focus(),n.stopPropagation(),n.preventDefault())}),this.closeMenus=()=>e(null)}bindTabs(){let t=[["tab-tree","pane-tree"],["tab-meshes","pane-meshes"]];for(let[e,n]of t)ot(e).addEventListener("click",()=>{for(let[i,r]of t)ot(i).setAttribute("aria-selected",String(i===e)),ot(r).hidden=i!==e})}bindTree(){ot("tree").addEventListener("click",e=>{let n=e.target.closest(".row");if(!n)return;let i=this.rows[+n.dataset.row];if(e.target.closest(".eye")){i.mesh>=0?this.app.setMeshVisible(i.mesh,!this.app.isMeshShown(i.mesh)):this.app.toggleNodeVisible(i.node);return}if(e.target.closest(".twisty")){let r=this.collapsed.has(i.key);e.shiftKey?this.setSubtreeOpen(+n.dataset.row,r):r?this.collapsed.delete(i.key):this.collapsed.add(i.key),this.applyTreeVisibility();return}i.mesh>=0?this.app.selectMesh(i.mesh):this.app.select(i.node,{notify:!0})}),ot("tree-expand-all").addEventListener("click",()=>this.setAllOpen(!0)),ot("tree-collapse-all").addEventListener("click",()=>this.setAllOpen(!1)),ot("tree-filter").addEventListener("input",e=>{this.filter=e.target.value.trim().toLowerCase(),this.applyTreeVisibility()})}populate(t,e){let n=ot("tree");n.textContent="",this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null;let i=new Map;t.meshes.forEach((c,h)=>{i.has(c.transform)||i.set(c.transform,[]),i.get(c.transform).push(h)});let r=document.createDocumentFragment(),o=t.nodes.length>400,a=c=>{let h=document.createElement("div");return h.className="row"+(c.dim?" dim":""),h.setAttribute("role","treeitem"),h.dataset.row=String(this.rows.length),h.style.setProperty("--depth",c.depth),h.innerHTML=`<button class="twisty${c.hasChildren?"":" leaf"}" tabindex="-1" aria-label="\u958B\u9589" title="\u30AF\u30EA\u30C3\u30AF: \u958B\u9589\u3000Shift+\u30AF\u30EA\u30C3\u30AF: \u4E0B\u306E\u968E\u5C64\u3082\u307E\u3068\u3081\u3066\u958B\u9589">\u25BE</button><span class="icon">${c.icon}</span><span class="name" title="${re(c.title)}">${re(c.label)}</span><button class="eye" tabindex="-1" aria-pressed="true" aria-label="\u8868\u793A" title="\u8868\u793A\u30FB\u975E\u8868\u793A\uFF08H: \u5207\u308A\u66FF\u3048 / Ctrl+H: \u96A0\u3059 / Shift+H: \u8868\u793A\uFF09">${Ov}</button>`,c.eye=h.lastChild,c.el=h,c.twisty=h.firstChild,this.rows.push(c),r.appendChild(h),c},l=(c,h)=>{let u=t.nodes[c],d=e.childrenOf[c],f=i.get(c)||[],m=a({key:"n"+c,node:c,mesh:-1,depth:h,label:u.name,title:u.path,icon:u.type==="joint"?$o.joint:$o.transform,hasChildren:d.length+f.length>0,dim:u.visible===!1});this.rowOfNode.set(c,m),o&&h>=2&&m.hasChildren&&this.collapsed.add(m.key);for(let x of f){let g=t.meshes[x];a({key:"m"+x,node:c,mesh:x,depth:h+1,label:g.name,title:g.path,icon:g.skin?$o.skin:$o.mesh,hasChildren:!1,dim:g.visible===!1})}for(let x of d)l(x,h+1)};t.nodes.forEach((c,h)=>{c.parent<0&&l(h,0)}),n.appendChild(r),this.applyTreeVisibility(),this.populateMeshes(t,e)}updateVisibilityMarks(t){let e=t.built.meshes;for(let n of this.rows){let i,r;n.mesh>=0?(i=t.isMeshShown(n.mesh),r=!e[n.mesh].visible,this.setMeshChecked(n.mesh,i)):(i=!t.isNodeHidden(n.node),r=!!t.hiddenEff[n.node]),n.eye.setAttribute("aria-pressed",String(i)),n.eye.setAttribute("aria-label",i?"\u8868\u793A\u4E2D":"\u975E\u8868\u793A"),n.el.classList.toggle("dim",r)}}setSubtreeOpen(t,e){let n=this.rows[t];for(let i=t;i<this.rows.length;i++){let r=this.rows[i];if(i>t&&r.depth<=n.depth)break;r.hasChildren&&(e?this.collapsed.delete(r.key):this.collapsed.add(r.key))}}setAllOpen(t){if(this.collapsed.clear(),!t)for(let e of this.rows)e.hasChildren&&this.collapsed.add(e.key);this.applyTreeVisibility(),t&&this.selectedRow&&!this.selectedRow.el.hidden&&this.selectedRow.el.scrollIntoView({block:"nearest"})}applyTreeVisibility(){let t=this.filter,e=1/0;for(let n of this.rows){if(t){n.el.hidden=!n.label.toLowerCase().includes(t);continue}if(n.depth>e){n.el.hidden=!0;continue}e=1/0,n.el.hidden=!1;let i=this.collapsed.has(n.key);n.twisty.textContent=i?"\u25B8":"\u25BE",n.hasChildren&&n.el.setAttribute("aria-expanded",String(!i)),i&&(e=n.depth)}}highlightNode(t,e){this.selectedRow&&this.selectedRow.el.classList.remove("selected"),this.selectedRow=null;let n=this.rowOfNode.get(t);if(!n)return;let i=e[t].parent,r=!1;for(;i>=0;)this.collapsed.delete("n"+i)&&(r=!0),i=e[i].parent;r&&this.applyTreeVisibility(),n.el.classList.add("selected"),n.el.setAttribute("aria-selected","true"),this.selectedRow=n,n.el.hidden||n.el.scrollIntoView({block:"nearest"})}populateMeshes(t,e,n){let i=ot("mesh-list");i.textContent="";let r=t.materials||[],o=a=>{if(a<0)return'<span class="tex">\u30C6\u30AF\u30B9\u30C1\u30E3\u306A\u3057</span>';let l=(t.textures||[])[a]||{},c=n&&n[a]||{status:l.resolved&&l.format?"loading":"missing"},h=re(String(l.path||"").split(/[\\/]/).pop()||l.node||"?"),u=re(l.resolved||l.path||"");if(c.status==="ok"){let f=(c.tiles>1?`UDIM ${c.tiles} \u30BF\u30A4\u30EB\u30FB`:"")+(c.sourceWidth!==c.width?`${c.sourceWidth}\u2192${c.width}px`:`${c.width}px`);return`<span class="tex-ok" aria-label="\u8AAD\u307F\u8FBC\u307F\u6E08\u307F">\u2713</span><span class="tex" title="${u}">${h}\uFF08${f}${c.hasAlpha?"\u30FB\u30A2\u30EB\u30D5\u30A1\u3042\u308A":""}\uFF09</span>`}if(c.status==="loading")return`<span class="tex-wait">\u2026</span><span class="tex" title="${u}">${h}\uFF08\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF09</span>`;if(c.status==="pending")return`<span class="tex-wait">\u2013</span><span class="tex" title="${u}">${h}\uFF08\u672A\u8AAD\u307F\u8FBC\u307F\uFF09</span>`;let d=c.status==="error"?"\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093":l.resolved?"\u5F62\u5F0F\u306B\u672A\u5BFE\u5FDC":"\u898B\u3064\u304B\u308A\u307E\u305B\u3093";return`<span class="tex-bad" aria-label="${d}">\u2715</span><span class="tex" title="${u}">${h}\uFF08${d}\uFF09</span>`};e.meshes.forEach((a,l)=>{let c=t.meshes[l],h=document.createElement("div");h.className="mesh-item";let u="mesh-vis-"+l,d=`\u9802\u70B9 ${an(a.vertexCount)} \u30FB \u9762 ${an(c.counts.length)} \u30FB \u4E09\u89D2\u5F62 ${an(a.triCount)}`;if(a.skin&&(d+=`<br>\u30B9\u30AD\u30F3 ${re(c.skin.cluster)}\uFF08\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9 ${a.skin.stats.influenceCount}\u30FB\u6700\u5927 ${a.skin.stats.maxCount}/\u9802\u70B9\uFF09`),c.visible===!1&&(d+="<br>Maya \u3067\u306F\u975E\u8868\u793A"),c.uv){let p=0,v=0;for(let y of c.counts){for(let b=0;b<y;b++)if(c.uv.indices[v+b]<0){p++;break}v+=y}d+=`<br>UV ${re(c.uv.set)}`+(p?`\uFF08<span class="tex-bad">UV \u306E\u306A\u3044\u9762 ${an(p)}</span>\uFF09`:"")}else d+="<br>UV \u306A\u3057";let f=c.faceMaterials||c.counts.map(()=>c.material??-1),m=new Map;for(let p of f)m.set(p,(m.get(p)||0)+1);let x=m.size>1,g='<ul class="mats">';for(let[p,v]of m){let y=r[p],b=x?`<span class="faces">${an(v)} \u9762</span>`:"";g+=y?`<li><span title="${re(y.type)}">${re(y.name)}</span>${b}${o(y.texture)}</li>`:`<li><span>\u65E2\u5B9A\u306E\u30DE\u30C6\u30EA\u30A2\u30EB</span>${b}</li>`;let w=y&&y.maps?Object.entries(y.maps).filter(([M])=>M!=="baseColor"):[];if(w.length){let M={normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},S={ok:'<span class="tex-ok">\u2713</span>',loading:'<span class="tex-wait">\u2026</span>',pending:'<span class="tex-wait">\u2013</span>',missing:'<span class="tex-bad">\u2715</span>',error:'<span class="tex-bad">\u2715</span>'},C=w.map(([_,E])=>{let N=n&&n[E.texture]||{status:"pending"},k=E.channel&&E.channel!=="rgb"?`\uFF08${E.channel.toUpperCase()}\uFF09`:"";return`${M[_]||_}${k} ${S[N.status]||""}`});g+=`<li class="sub-maps">${C.join("\u3000")}</li>`}}g+="</ul>",h.innerHTML=`<input type="checkbox" id="${u}" ${a.visible?"checked":""} aria-label="${re(c.name)} \u3092\u8868\u793A"><label class="name" for="${u}">${re(c.name)}</label><div class="meta">${d}</div>${g}`,h.querySelector("input").addEventListener("change",p=>this.app.setMeshVisible(l,p.target.checked)),h.querySelector(".name").addEventListener("click",p=>{p.preventDefault(),this.app.selectMesh(l)}),i.appendChild(h)})}setMeshChecked(t,e){let n=ot("mesh-vis-"+t);n&&(n.checked=e)}showNodeInfo(t){let e=ot("select-head"),n=ot("select-info");if(!t){e.innerHTML='<p class="muted">\u30B8\u30E7\u30A4\u30F3\u30C8\u3084\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3053\u3053\u306B\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>',n.innerHTML="";return}let i=t.node,r=i.attrs||{},o={joint:"\u30B8\u30E7\u30A4\u30F3\u30C8",transform:"\u30C8\u30E9\u30F3\u30B9\u30D5\u30A9\u30FC\u30E0"}[i.type]||i.type;e.innerHTML=`<p class="info-title">${re(i.name)}<span class="info-type">${re(o)}</span>${t.posed?'<span class="posed-badge">\u30DD\u30FC\u30BA\u5909\u66F4\u4E2D</span>':""}</p><p class="info-path">${re(i.path)}</p>`;let a={pm:"skinCluster \u306E .pm",dagPose:"dagPose",bps:"\u30B8\u30E7\u30A4\u30F3\u30C8\u306E .bps"},l='<table class="kv">';l+=`<tr><th>\u8868\u793A</th><td>${t.hiddenByRig?"\u975E\u8868\u793A\uFF08\u30EA\u30B0\u30FB\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3067\u6C7A\u307E\u308B\u5024\uFF09":t.hiddenSelf?"\u975E\u8868\u793A":t.hiddenByParent?"\u89AA\u304C\u975E\u8868\u793A\u306E\u305F\u3081\u96A0\u308C\u3066\u3044\u307E\u3059":"\u8868\u793A\u4E2D"}</td></tr>`,t.unselectable&&(l+=`<tr><th>Maya \u3067\u306E\u9078\u629E</th><td>\u30D3\u30E5\u30FC\u30DD\u30FC\u30C8\u3067\u306F\u9078\u629E\u3067\u304D\u306A\u3044\uFF08${re(t.unselectable)}\uFF09</td></tr>`),l+=`<tr><th>\u59FF\u52E2\u306E\u57FA\u6E96</th><td>${t.usingBind?"\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA":"\u30D5\u30A1\u30A4\u30EB\u306E\u5024"}</td></tr>`,l+=`<tr><th>\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u60C5\u5831</th><td>${t.bindSource?re(a[t.bindSource]||t.bindSource):"\u306A\u3057"}</td></tr>`,l+="</table>";let c=t.animChannels||[],h=t.rigDrivers||[];(c.length||h.length)&&(l+='<table class="kv">',c.length&&(l+=`<tr><th>\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3</th><td>${re(c.join("\u30FB"))}</td></tr>`),h.length&&(l+=`<tr><th>\u30EA\u30B0</th><td>${h.slice(0,6).map(re).join("<br>")}${h.length>6?"<br>\u307B\u304B":""}</td></tr>`),l+="</table>");let u=/（(animCurveT[LAU]|pointConstraint|orientConstraint|parentConstraint|scaleConstraint|poleVectorConstraint|unitConversion|pairBlend|blendColors|multiplyDivide|plusMinusAverage|reverse|condition)）$/,d=(t.drivenBy||[]).filter(f=>!(t.animLoaded&&u.test(f)));if(d.length&&(l+='<p class="note small">\u6B21\u306E\u5024\u306F\u63A5\u7D9A\u3067\u6C7A\u307E\u308B\u305F\u3081\u3001\u30D5\u30A1\u30A4\u30EB\u306B\u6B8B\u3063\u3066\u3044\u307E\u305B\u3093'+(t.bindSource?"\uFF08\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u3067\u3082\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u59FF\u52E2\u3067\u8868\u793A\uFF09":"\uFF08\u65E2\u5B9A\u5024\u3067\u8868\u793A\uFF09")+"\uFF1A<br>"+d.slice(0,6).map(re).join("<br>")+(d.length>6?"<br>\u307B\u304B":"")+"</p>"),l+='<p class="sub">\u30D5\u30A1\u30A4\u30EB\u4E0A\u306E\u5024</p><table class="kv">',r.t&&(l+=`<tr><th>\u79FB\u52D5</th><td>${Xn(r.t)}</td></tr>`),r.r&&(l+=`<tr><th>\u56DE\u8EE2</th><td>${Xn(r.r,2)}</td></tr>`),r.jo&&(l+=`<tr><th>\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u5411\u304D</th><td>${Xn(r.jo,2)}</td></tr>`),r.s&&(l+=`<tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Xn(r.s)}</td></tr>`),r.ro&&(l+=`<tr><th>\u56DE\u8EE2\u9806</th><td>${re(r.ro)}</td></tr>`),l+="</table>",t.animValues){let f=t.animValues;l+=`<p class="sub">\u30D5\u30EC\u30FC\u30E0 ${re(Ii(t.frame,Number.isInteger(t.frame)?0:2))} \u306E\u5024</p><table class="kv"><tr><th>\u79FB\u52D5</th><td>${Xn(f.t)}</td></tr><tr><th>\u56DE\u8EE2</th><td>${Xn(f.r,2)}</td></tr><tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Xn(f.s)}</td></tr></table>`}if(l+=`<table class="kv" style="margin-top:6px"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Xn(t.worldPos)}</td></tr></table>`,t.usage&&t.usage.length){l+='<p class="sub">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3068\u3057\u3066</p><table class="kv">';for(let f of t.usage)l+=`<tr><th>${re(f.meshName)}</th><td>${an(f.count)} / ${an(f.total)} \u9802\u70B9</td></tr>`;l+="</table>"}else i.type==="joint"&&(l+='<p class="muted small">\u3069\u306E\u30E1\u30C3\u30B7\u30E5\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u306B\u3082\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002</p>');if(t.meshes&&t.meshes.length)for(let f of t.meshes){if(l+=`<p class="sub">\u30E1\u30C3\u30B7\u30E5 ${re(f.name)}</p><table class="kv">`,l+=`<tr><th>\u9802\u70B9 / \u9762</th><td>${an(f.vertices)} / ${an(f.faces)}</td></tr>`,f.skin){let m=f.skin;l+=`<tr><th>skinCluster</th><td>${re(f.cluster)}</td></tr>`,l+=`<tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9</th><td>${m.influenceCount}\uFF08\u6700\u5927 ${m.maxCount}/\u9802\u70B9\uFF09</td></tr>`,l+=`<tr><th>5\u301C8 \u3064\u306E\u9802\u70B9</th><td>${an(m.over4-m.overMax)}</td></tr>`,l+=`<tr><th>9 \u3064\u4EE5\u4E0A\u306E\u9802\u70B9</th><td>${an(m.overMax)}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9</th><td>${an(m.unnormalized)}</td></tr>`;let x={0:"\u306A\u3057",1:"\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6",2:"\u30DD\u30B9\u30C8"}[f.normalizeSetting]||"?";l+=`<tr><th>Maya \u306E\u6B63\u898F\u5316\u306E\u8A2D\u5B9A</th><td>${x}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 0 \u306E\u9802\u70B9</th><td>${an(m.zero)}\uFF08\u5272\u308A\u5F53\u3066\u6E08\u307F\uFF09</td></tr>`}l+="</table>",f.skin&&f.skin.overMax&&(l+='<p class="note small">9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u306F\u3001\u4E0A\u4F4D 8 \u3064\u3067\u5909\u5F62\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF08\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7\u3068\u6570\u5024\u306F\u5168\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\uFF09\u3002</p>')}n.innerHTML=l}showVertexInfo(t,e=this.app.settings.pickMode){let n=ot("vertex-body");if(!t){n.innerHTML=e==="vertex"?'<p class="muted">\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3044\u3061\u3070\u3093\u8FD1\u3044\u9802\u70B9\u306E\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>':'<p class="muted">\u9802\u70B9\u306E\u30A6\u30A7\u30A4\u30C8\u3092\u898B\u308B\u306B\u306F\u3001\u30C4\u30FC\u30EB\u30D0\u30FC\u3067\u300C\u9802\u70B9\u3092\u9078\u629E\u300D\u306B\u5207\u308A\u66FF\u3048\u3066\uFF08F8\uFF09\u3001\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059\u3002</p>';return}let i=`<p class="info-title">${re(t.meshName)}.vtx[${t.vertex}]</p>`;if(i+=`<table class="kv"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Xn(t.worldPos)}</td></tr></table>`,!t.skinned){i+='<p class="muted">\u3053\u306E\u30E1\u30C3\u30B7\u30E5\u306B\u306F\u30B9\u30AD\u30F3\u304C\u3042\u308A\u307E\u305B\u3093\u3002</p>',n.innerHTML=i;return}if(!t.weights.length){i+='<p class="note err">\u3053\u306E\u9802\u70B9\u306B\u306F\u30A6\u30A7\u30A4\u30C8\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u30B8\u30E7\u30A4\u30F3\u30C8\u3082\u3042\u308A\u307E\u305B\u3093\uFF09\u3002</p>',n.innerHTML=i;return}i+='<ul class="wlist">',t.weights.forEach((r,o)=>{let a=o>=8,c=t.assigned||t.normalized&&Math.abs(t.sum-1)>.001?`${Ii(r.weight,4)} \u2192 ${Ii(r.effective,4)}`:Ii(r.weight,4);i+=`<li class="${a?"dropped":""}"><span class="jn" data-node="${r.nodeIndex}" title="${re(r.path)}">${re(r.name)}</span><span class="wv">${c}</span><span class="bar"><i style="width:${Math.min(100,r.effective*100).toFixed(1)}%"></i></span></li>`}),i+="</ul>",i+=`<table class="kv" style="margin-top:6px"><tr><th>\u5408\u8A08</th><td>${Ii(t.sum,4)}</td></tr><tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u6570</th><td>${t.weights.length}</td></tr></table>`,t.weights.length>8&&(i+='<p class="note small">9 \u3064\u76EE\u4EE5\u964D\uFF08\u8584\u3044\u8868\u793A\uFF09\u306F\u5909\u5F62\u8868\u793A\u306B\u4F7F\u308F\u308C\u3066\u3044\u307E\u305B\u3093\u3002</p>'),t.assigned?i+=`<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u305F\u3081\u3001\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${t.distribution}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3067\u5909\u5F62\u3057\u3066\u3044\u307E\u3059\u3002</p>`:Math.abs(t.sum-1)>.001&&(i+='<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u5909\u5F62\u306B\u306F\u5408\u8A08\u3067\u5272\u3063\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002</p>'),n.innerHTML=i,n.querySelectorAll(".jn").forEach(r=>{r.addEventListener("click",()=>this.app.select(+r.dataset.node,{notify:!0}))})}bindPose(){let t=["x","y","z"],e=(r,o)=>{let a=parseFloat(ot(r).value);return Number.isFinite(a)?a:o},n=()=>({t:t.map(r=>e("pose-t"+r,0)),r:t.map(r=>e("pose-r"+r,0)),s:t.map(r=>e("pose-s"+r,1))}),i=()=>{this.app.beginPoseEdit([this.app.selected],"\u6570\u5024\u5165\u529B"),this.app.setPoseForSelected(n())};for(let r of["t","r","s"])for(let o of t){let a=ot("pose-"+r+o);a.addEventListener("input",i),a.addEventListener("change",()=>this.app.endPoseEdit()),a.addEventListener("blur",()=>this.app.endPoseEdit()),a.addEventListener("keydown",l=>{l.key==="Enter"&&a.blur()})}ot("pose-reset").addEventListener("click",()=>this.app.resetPose(this.app.selected)),ot("pose-reset-all").addEventListener("click",()=>this.app.resetAllPoses())}showPoseFor(t,e){let n=t>=0;if(ot("pose-ctrls").hidden=!n,!n)return;let i=e||{t:[0,0,0],r:[0,0,0],s:[1,1,1]},r=document.activeElement,o=(a,l)=>{let c=ot(a);c!==r&&(c.value=String(+l.toFixed(4)))};["x","y","z"].forEach((a,l)=>{o("pose-t"+a,i.t[l]),o("pose-r"+a,i.r[l]),o("pose-s"+a,i.s[l])})}addWarnings(t){this.warnings=(this.warnings||[]).concat(t),this.setWarnings(this.warnings)}setWarnings(t){this.warnings=t.slice();let e=ot("btn-warnings");e.hidden=!t.length,ot("warn-count").textContent=String(t.length),e.title=`\u8B66\u544A ${t.length} \u4EF6\u3092\u8868\u793A`,e.setAttribute("aria-label",e.title),ot("warn-body").innerHTML=t.length?"<ul>"+t.map(n=>`<li>${re(n)}</li>`).join("")+"</ul>":'<p class="muted">\u8B66\u544A\u306F\u3042\u308A\u307E\u305B\u3093\u3002</p>',this.app.onWarningsChanged(this.warnings)}openWarningDialog(){let t=ot("warn-dialog");t.open||t.showModal()}setHistoryState(t){let e=ot("btn-undo"),n=ot("btn-redo");e.disabled=!t.canUndo,n.disabled=!t.canRedo,e.title=(t.canUndo?`\u5143\u306B\u623B\u3059: ${t.undoLabel}`:"\u5143\u306B\u623B\u3059")+"\uFF08Ctrl+Z / Z\uFF09",n.title=(t.canRedo?`\u3084\u308A\u76F4\u3059: ${t.redoLabel}`:"\u3084\u308A\u76F4\u3059")+"\uFF08Ctrl+Y / Shift+Z\uFF09"}setLegend(t,e){let n=ot("legend");if(t==="off"){n.hidden=!0;return}n.hidden=!1,t==="selected"?n.innerHTML=e?`<div class="lg-title">\u30A6\u30A7\u30A4\u30C8: ${re(e)}</div><div class="lg-bar"></div><div class="lg-scale"><span>0</span><span>0.5</span><span>1</span></div>`:'<div class="lg-title">\u30B8\u30E7\u30A4\u30F3\u30C8\u3092\u9078\u3076\u3068\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059</div>':n.innerHTML='<div class="lg-title">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3054\u3068\u306B\u8272\u5206\u3051</div><div class="muted small">\u5883\u754C\u306E\u6DF7\u8272\u304C\u30A6\u30A7\u30A4\u30C8\u306E\u6DF7\u3056\u308A\u5177\u5408\u3067\u3059\u3002</div>'}setTitle(t){ot("vp-title").textContent=t||""}setHud(t,e){let n=ot("vp-hud");n.hidden=t===null,t!==null&&(n.textContent=t,n.className=e||"")}setFile(t){ot("status-file").textContent=t}setStats(t){ot("status-stats").textContent=t}setMessage(t,e=4e3){ot("status-msg").textContent=t||"",clearTimeout(this.msgTimer),t&&e&&(this.msgTimer=setTimeout(()=>{ot("status-msg").textContent=""},e))}setEmpty(t){ot("empty").hidden=!t}showLoading(t,e){ot("loading").hidden=!1,ot("loading-text").textContent=t||"\u8AAD\u307F\u8FBC\u307F\u4E2D";let n=typeof e=="number"&&e>=0;ot("loading-bar").parentElement.classList.toggle("indeterminate",!n),ot("loading-bar").style.width=n?`${Math.round(Math.min(1,e)*100)}%`:""}hideLoading(){ot("loading").hidden=!0}showError(t){let e=ot("error");e.hidden=!1,e.textContent=t}hideError(){ot("error").hidden=!0}};function Zo(){return typeof window<"u"&&typeof window.qt<"u"&&!!window.qt.webChannelTransport}function bd(s){return!Zo()||typeof window.QWebChannel>"u"?!1:(new window.QWebChannel(window.qt.webChannelTransport,t=>{let e=t.objects.bridge;e&&s(e)}),!0)}var jo=class{constructor(t,e=200){this.apply=t,this.limit=e,this.undoStack=[],this.redoStack=[],this.onChange=null}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}get undoLabel(){return this.canUndo?this.undoStack[this.undoStack.length-1].label:""}get redoLabel(){return this.canRedo?this.redoStack[this.redoStack.length-1].label:""}push(t){this.undoStack.push(t),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack.length=0,this.changed()}undo(){let t=this.undoStack.pop();return t?(this.apply(t.before),this.redoStack.push(t),this.changed(),t):null}redo(){let t=this.redoStack.pop();return t?(this.apply(t.after),this.undoStack.push(t),this.changed(),t):null}clear(){this.undoStack.length=0,this.redoStack.length=0,this.changed()}changed(){this.onChange&&this.onChange(this)}};function wd(s,t){return JSON.stringify(s)===JSON.stringify(t)}var Sd=30,Ed=31;function Ad(s,t=0,e={}){let n=e.size||384,i=e.eightOnGpu!==!1,{renderer:r,camera:o,scene:a}=s,l=s.built.meshes[t];if(!l||!l.skinned)throw new Error("\u30B9\u30AD\u30F3\u4ED8\u304D\u30E1\u30C3\u30B7\u30E5\u3067\u306F\u3042\u308A\u307E\u305B\u3093");s.built.root.updateMatrixWorld(!0);let c=l.geometry.attributes.position.count,h=new Float32Array(c*3),u=new A;for(let S=0;S<c;S++)fr(l,S,!0,u),h[S*3]=u.x,h[S*3+1]=u.y,h[S*3+2]=u.z;let d=new ne;d.setAttribute("position",new Me(h,3)),d.setIndex(l.geometry.index);let f=new De({color:16711680,side:Ve}),m=new mt(d,f);m.frustumCulled=!1,m.layers.set(Ed),a.add(m),m.updateMatrixWorld(!0);let x=new De({color:16711680,side:Ve});i&&Ss(x);let g={material:l.skinned.material,layers:l.skinned.layers.mask,visible:l.skinned.visible,cam:o.layers.mask,aspect:o.aspect,target:r.getRenderTarget()};l.skinned.material=x,l.skinned.layers.set(Sd),l.skinned.visible=!0,o.aspect=1,o.updateProjectionMatrix();let p=new xn(n,n),v=S=>{o.layers.set(S),r.setRenderTarget(p),r.clear(),r.render(a,o);let C=new Uint8Array(n*n*4);return r.readRenderTargetPixels(p,0,0,n,n,C),C},y,b;try{y=v(Sd),b=v(Ed)}finally{r.setRenderTarget(g.target),o.layers.mask=g.cam,o.aspect=g.aspect,o.updateProjectionMatrix(),l.skinned.material=g.material,l.skinned.layers.mask=g.layers,l.skinned.visible=g.visible,a.remove(m),d.dispose(),f.dispose(),x.dispose(),p.dispose(),s.requestRender()}let w=0,M=0;for(let S=3;S<y.length;S+=4){let C=y[S]>127,_=b[S]>127;(C||_)&&w++,C!==_&&M++}return{covered:w,mismatch:M,ratio:w?M/w:0}}var Ge={FIXED:1,LINEAR:2,FLAT:3,STEP:5,SLOW:6,FAST:7,SPLINE:9,CLAMPED:10,PLATEAU:16,STEP_NEXT:17,AUTO:18},As={CONSTANT:0,LINEAR:1,CYCLE:3,CYCLE_RELATIVE:4,OSCILLATE:5},rc=Math.PI/180,Ts=1e-9,Pd=1,Ld=2;function Ko(s,t=Float32Array){if(s==null)return new t(0);if(Array.isArray(s))return t.from(s);let e=atob(s.data||""),n=new Uint8Array(e.length);for(let r=0;r<e.length;r++)n[r]=e.charCodeAt(r);if(s.dtype==="uint8")return t===Uint8Array?n:t.from(n);let i=new Float32Array(n.buffer,0,Math.floor(n.length/4));return t===Float32Array?i:t.from(i)}function Td(s,t){return s===0&&(s=t||Ge.AUTO),s>=19&&s<=21?Ge.AUTO:s}function Fv(s,t,e,n,i){let r=s.count,o=s.offset,a=Float64Array.from(t.subarray(o,o+r)),l=Float64Array.from(e.subarray(o,o+r)),c=new Float64Array(r),h=new Float64Array(r),u=new Float64Array(r),d=new Float64Array(r),f=new Uint8Array(r),m=!!s.weighted,x=(p,v)=>(l[v]-l[p])/Math.max(a[v]-a[p],Ts),g=(p,v,y)=>{let b=v>0,w=v<r-1,M=b?x(v-1,v):0,S=w?x(v,v+1):0;switch(p){case Ge.LINEAR:return y==="in"?b?M:S:w?S:M;case Ge.FLAT:case Ge.STEP:case Ge.STEP_NEXT:return 0;case Ge.CLAMPED:return!b||!w?b?M:S:Math.abs(l[v]-l[v-1])<Ts||Math.abs(l[v+1]-l[v])<Ts?0:x(v-1,v+1);case Ge.AUTO:case Ge.PLATEAU:{if(!b||!w||M*S<=0)return 0;let C=x(v-1,v+1),_=3*Math.min(Math.abs(M),Math.abs(S));return Math.sign(C)*Math.min(Math.abs(C),_)}default:return b&&w?x(v-1,v+1):b?M:S}};for(let p=0;p<r;p++){let v=o+p,y=Td(n.length?n[2*v]:0,s.tangent),b=Td(n.length?n[2*v+1]:0,s.tangent);b===Ge.STEP?f[p]=Pd:b===Ge.STEP_NEXT&&(f[p]=Ld);let w=i.get(v);for(let M of["in","out"]){let S=M==="in"?y:b,C=g(S,p,M),_=0,E=w?M==="in"?w[0]:w[2]:NaN,N=w?M==="in"?w[1]:w[3]:NaN;Number.isFinite(E)&&Number.isFinite(N)&&(S===Ge.FIXED||m)&&(!(S===Ge.LINEAR||S===Ge.FLAT||S===Ge.STEP||S===Ge.STEP_NEXT)&&Math.abs(E)>Ts&&(C=N/E),m&&(_=Math.abs(E))),M==="in"?(c[p]=C,u[p]=_):(h[p]=C,d[p]=_)}}return{name:s.name,type:s.type,trax:!!s.trax,n:r,t:a,v:l,inSlope:c,outSlope:h,inW:u,outW:d,step:f,weighted:m,pre:s.pre||0,post:s.post||0,last:0}}function kv(s,t,e){let n=s.t[t],i=s.t[t+1],r=s.v[t],o=s.v[t+1];if(s.step[t]===Pd)return r;if(s.step[t]===Ld)return e>n?o:r;let a=i-n;if(a<=Ts)return o;if(!s.weighted||s.outW[t]===0&&s.inW[t+1]===0){let v=(e-n)/a,y=v*v,b=y*v,w=s.outSlope[t]*a,M=s.inSlope[t+1]*a;return(2*b-3*y+1)*r+(b-2*y+v)*w+(-2*b+3*y)*o+(b-y)*M}let l=s.outW[t]||a,c=s.inW[t+1]||a,h=Math.min(n+l/3,i),u=Math.max(i-c/3,n),d=r+s.outSlope[t]*(h-n),f=o-s.inSlope[t+1]*(i-u),m=(v,y,b,w,M)=>{let S=1-M;return S*S*S*v+3*S*S*M*y+3*S*M*M*b+M*M*M*w},x=0,g=1,p=(e-n)/a;for(let v=0;v<40;v++){let y=m(n,h,u,i,p);if(Math.abs(y-e)<1e-7)break;y<e?x=p:g=p,p=(x+g)/2}return m(r,d,f,o,p)}function Cd(s,t){let e=s.t,n=s.n;if(t>=e[n-1])return s.v[n-1];let i=s.last;if(!(i<n-1&&e[i]<=t&&t<e[i+1])){let r=0,o=n-1;for(;o-r>1;){let a=r+o>>1;e[a]<=t?r=a:o=a}i=r,s.last=i}return kv(s,i,t)}function Di(s,t){let e=s.n;if(e===0)return 0;if(e===1)return s.v[0];let n=s.t[0],i=s.t[e-1];if(t>=n&&t<=i)return Cd(s,t);let r=t<n,o=r?s.pre:s.post;if(o===As.LINEAR)return r?s.v[0]+s.inSlope[0]*(t-n):s.v[e-1]+s.outSlope[e-1]*(t-i);let a=i-n;if(a<=Ts||!(o===As.CYCLE||o===As.CYCLE_RELATIVE||o===As.OSCILLATE))return r?s.v[0]:s.v[e-1];let l=Math.floor((t-n)/a),c=t-l*a;o===As.OSCILLATE&&l%2!==0&&(c=n+i-c);let h=Cd(s,c);return o===As.CYCLE_RELATIVE?h+l*(s.v[e-1]-s.v[0]):h}var zv=["xyz","yzx","zxy","xzy","yxz","zyx"],Bv=zv.map(s=>s.split("").reverse().join("").toUpperCase()),Vv=new be,Ni=new st;function Tn(s,t,e=new st){e.identity();let n=a=>e.premultiply(a),i=(a,l=1)=>a?Ni.makeTranslation(a[0]*l,a[1]*l,a[2]*l):null,r=(a,l)=>Ni.makeRotationFromEuler(Vv.set(a[0]*rc,a[1]*rc,a[2]*rc,Bv[l]||"ZYX")),o=s.s;return s.joint?(n(Ni.makeScale(o[0],o[1],o[2])),s.ra&&n(r(s.ra,0)),n(r(s.r,s.ro||0)),s.jo&&n(r(s.jo,0)),t&&n(Ni.makeScale(t[0]?1/t[0]:1,t[1]?1/t[1]:1,t[2]?1/t[2]:1)),n(i(s.t)),Rd(s,e)):(s.sp&&n(i(s.sp,-1)),n(Ni.makeScale(o[0],o[1],o[2])),s.sh&&n(Ni.set(1,s.sh[0],s.sh[1],0,0,1,s.sh[2],0,0,0,1,0,0,0,0,1)),s.sp&&n(i(s.sp)),s.spt&&n(i(s.spt)),s.rp&&n(i(s.rp,-1)),s.ra&&n(r(s.ra,0)),n(r(s.r,s.ro||0)),s.rp&&n(i(s.rp)),s.rpt&&n(i(s.rpt)),n(i(s.t)),Rd(s,e))}function Rd(s,t){return s.opm?t.premultiply(s.opm.isMatrix4?s.opm:Ni.fromArray(s.opm)):t}var Hv={x:0,y:1,z:2},Jo=class{constructor(t){this.raw=t,this.fps=+t.fps||24,this.start=+t.start,this.end=+t.end,this.end>=this.start||(this.start=0,this.end=0),this.current=Number.isFinite(+t.current)?+t.current:this.start;let e=Ko(t.times),n=Ko(t.values),i=Ko(t.tangentTypes,Uint8Array),r=Ko(t.fixedTangents),o=new Map;for(let l=0;l+4<r.length;l+=5)o.set(r[l],[r[l+1],r[l+2],r[l+3],r[l+4]]);this.curves=(t.curves||[]).map(l=>Fv(l,e,n,i,o)),this.timeCurves=this.curves.filter(l=>(!l.type||l.type[0]==="T")&&!l.trax),this.warnings=(t.warnings||[]).slice();let a=new Map;for(let l of t.nodes||[])a.set(l.node,{node:l.node,rest:l,isNode:l.isNode??-1,isScale:l.isScale||null,channels:[],cur:{...l,t:l.t.slice(),r:l.r.slice(),s:l.s.slice()}});for(let l of t.channels||[]){let c=a.get(l.node),h=this.curves[l.curve];!c||!h||c.channels.push({base:l.attr[0],axis:Hv[l.attr[1]],curve:h,attr:l.attr})}this.entries=[...a.values()],this.byNode=a,this.matrices=new Map(this.entries.map(l=>[l.node,new st]))}get nodes(){return this.entries.map(t=>t.node)}channelsOf(t){let e=this.byNode.get(t);return e?e.channels.map(n=>n.attr):[]}keyTimes(t=-1){let e=new Set,n=t>=0?(this.byNode.get(t)||{channels:[]}).channels.map(i=>i.curve):this.timeCurves;for(let i of n)for(let r=0;r<i.n;r++)e.add(i.t[r]);return[...e].sort((i,r)=>i-r)}evaluate(t){for(let e of this.entries){let n=e.cur;for(let i of e.channels)n[i.base][i.axis]=Di(i.curve,t)}for(let e of this.entries){let n=null;if(e.cur.joint&&(e.isScale||e.isNode>=0)){let i=e.isNode>=0?this.byNode.get(e.isNode):null;n=i?i.cur.s:e.isScale}Tn(e.cur,n,this.matrices.get(e.node))}return this.matrices}wrap(t){let e=this.end-this.start+1;return e<=1?this.start:this.start+((t-this.start)%e+e)%e}};var Qo=Math.PI/180,xr=180/Math.PI,Id=1e5,Gv=(s,t,e)=>{if(s===t)return e<s?0:1;let n=Math.min(1,Math.max(0,(e-s)/(t-s)));return n*n*(3-2*n)},Wv={sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],atan2:[2,Math.atan2],sind:[1,s=>Math.sin(s*Qo)],cosd:[1,s=>Math.cos(s*Qo)],tand:[1,s=>Math.tan(s*Qo)],asind:[1,s=>Math.asin(s)*xr],acosd:[1,s=>Math.acos(s)*xr],atand:[1,s=>Math.atan(s)*xr],atan2d:[2,(s,t)=>Math.atan2(s,t)*xr],abs:[1,Math.abs],sqrt:[1,Math.sqrt],pow:[2,Math.pow],exp:[1,Math.exp],log:[1,Math.log],log10:[1,Math.log10],floor:[1,Math.floor],ceil:[1,Math.ceil],trunc:[1,Math.trunc],sign:[1,Math.sign],min:[2,Math.min],max:[2,Math.max],clamp:[3,(s,t,e)=>Math.min(Math.max(e,s),t)],smoothstep:[3,Gv],linstep:[3,(s,t,e)=>s===t?e<s?0:1:Math.min(1,Math.max(0,(e-s)/(t-s)))],deg_to_rad:[1,s=>s*Qo],rad_to_deg:[1,s=>s*xr],fmod:[2,(s,t)=>s%t],hypot:[2,Math.hypot],equivalent:[2,(s,t)=>Math.abs(s-t)<=1e-5?1:0],equivalentTol:[3,(s,t,e)=>Math.abs(s-t)<=e?1:0]},Nd={true:1,false:0,on:1,off:0,yes:1,no:0},ta=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|(\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?)|\.([IO])\[(\d+)\]|(\$\w+)|([A-Za-z_]\w*)|(\+\+|--|[-+*/%]=|==|!=|<=|>=|&&|\|\||[-+*/%=<>!?:;,(){}])/y,ln=class extends Error{};function qv(s){let t=[];ta.lastIndex=0;let e=0;for(;e<s.length;){ta.lastIndex=e;let n=ta.exec(s);if(!n)throw new ln(`\u8AAD\u3081\u306A\u3044\u6587\u5B57\u300C${s[e]}\u300D`);e=ta.lastIndex,n[1]!==void 0?t.push({t:"num",v:parseFloat(n[1]),int:!/[.eE]/.test(n[1])}):n[2]!==void 0?t.push({t:n[2],v:+n[3]}):n[4]!==void 0?t.push({t:"var",v:n[4]}):n[5]!==void 0?t.push({t:"name",v:n[5]}):n[6]!==void 0&&t.push({t:"op",v:n[6]})}return t.push({t:"end",v:""}),t}function Dd(s){let t=qv(s),e=0,n=new Map,i=new Set,r=()=>t[e],o=y=>t[e].t==="op"&&t[e].v===y,a=y=>{if(!o(y))throw new ln(`\u300C${y}\u300D\u304C\u5FC5\u8981\u3067\u3059\uFF08\u300C${t[e].v}\u300D\uFF09`);e++},l=(y,b,w)=>{let M=y.int&&b.int,S=y.f,C=b.f;switch(w){case"+":return{f:_=>S(_)+C(_),int:M};case"-":return{f:_=>S(_)-C(_),int:M};case"*":return{f:_=>S(_)*C(_),int:M};case"/":return M?{f:_=>{let E=C(_);return E===0?0:Math.trunc(S(_)/E)},int:M}:{f:_=>S(_)/C(_),int:M};case"%":return{f:_=>S(_)%C(_),int:M};case"==":return{f:_=>S(_)===C(_)?1:0,int:!0};case"!=":return{f:_=>S(_)!==C(_)?1:0,int:!0};case"<":return{f:_=>S(_)<C(_)?1:0,int:!0};case"<=":return{f:_=>S(_)<=C(_)?1:0,int:!0};case">":return{f:_=>S(_)>C(_)?1:0,int:!0};case">=":return{f:_=>S(_)>=C(_)?1:0,int:!0};case"&&":return{f:_=>S(_)&&C(_)?1:0,int:!0};case"||":return{f:_=>S(_)||C(_)?1:0,int:!0};default:throw new ln(`\u672A\u5BFE\u5FDC\u306E\u6F14\u7B97\u5B50 ${w}`)}},c=[["||"],["&&"],["==","!="],["<","<=",">",">="],["+","-"],["*","/","%"]],h=y=>{if(y.t==="var"){let b=y.v;return{get:w=>w.vars.get(b)||0,set:(w,M)=>w.vars.set(b,n.get(b)==="int"?Math.trunc(M):M),declare:w=>{n.has(b)||n.set(b,w?"int":"float")},int:()=>n.get(b)==="int"}}if(y.t==="O"){let b=y.v;return i.add(b),{get:w=>w.out.get(b)||0,set:(w,M)=>w.out.set(b,M),declare:()=>{},int:()=>!1}}throw new ln(`\u300C${y.v}\u300D\u306B\u306F\u4EE3\u5165\u3067\u304D\u307E\u305B\u3093`)};function u(){let y=r();if((y.t==="var"||y.t==="O")&&t[e+1].t==="op"&&/^[-+*/%]?=$/.test(t[e+1].v)){e++;let b=t[e++].v,w=h(y),M=u();if(w.declare(M.int),b==="=")return{f:C=>{let _=M.f(C);return w.set(C,_),w.get(C)},int:w.int()};let S=l({f:w.get,int:w.int()},M,b[0]);return{f:C=>(w.set(C,S.f(C)),w.get(C)),int:w.int()}}return d()}function d(){let y=f(0);if(!o("?"))return y;e++;let b=u();a(":");let w=u();return{f:M=>y.f(M)?b.f(M):w.f(M),int:b.int&&w.int}}function f(y){if(y>=c.length)return m();let b=f(y+1);for(;r().t==="op"&&c[y].includes(r().v);){let w=t[e++].v;b=l(b,f(y+1),w)}return b}function m(){if(o("-")){e++;let y=m();return{f:b=>-y.f(b),int:y.int}}if(o("+"))return e++,m();if(o("!")){e++;let y=m();return{f:b=>y.f(b)?0:1,int:!0}}if(o("++")||o("--")){let y=t[e++].v==="++"?1:-1,b=h(t[e++]);return{f:w=>(b.set(w,b.get(w)+y),b.get(w)),int:b.int()}}return x()}function x(){let y=r();if((y.t==="var"||y.t==="O")&&t[e+1].t==="op"&&(t[e+1].v==="++"||t[e+1].v==="--")){e+=2;let b=t[e-1].v==="++"?1:-1,w=h(y);return{f:M=>{let S=w.get(M);return w.set(M,S+b),S},int:w.int()}}return g()}function g(){let y=t[e++];switch(y.t){case"num":{let b=y.v;return{f:()=>b,int:y.int}}case"I":{let b=y.v;return{f:w=>w.input(b),int:!1}}case"O":{let b=y.v;return{f:w=>w.out.get(b)||0,int:!1}}case"var":{let b=y.v;return{f:w=>w.vars.get(b)||0,int:n.get(b)==="int"}}case"name":{if(y.v==="frame")return{f:C=>C.frame,int:!1};if(y.v==="time")return{f:C=>C.time,int:!1};if(y.v in Nd){let C=Nd[y.v];return{f:()=>C,int:!0}}let b=Wv[y.v];if(!b)throw new ln(`\u672A\u5BFE\u5FDC\u306E\u540D\u524D ${y.v}`);a("(");let w=[];if(!o(")"))for(w.push(u());o(",");)e++,w.push(u());if(a(")"),w.length!==b[0])throw new ln(`${y.v} \u306E\u5F15\u6570\u306F ${b[0]} \u500B\u3067\u3059`);let M=b[1],S=w.map(C=>C.f);if(S.length===1){let[C]=S;return{f:_=>M(C(_)),int:!1}}return{f:C=>M(...S.map(_=>_(C))),int:!1}}case"op":if(y.v==="("){if(r().t==="name"&&(r().v==="int"||r().v==="float")&&t[e+1].v===")"){let w=t[e].v==="int";e+=2;let M=m();return w?{f:S=>Math.trunc(M.f(S)),int:!0}:{f:M.f,int:!1}}let b=u();return a(")"),b}break;default:break}throw new ln(`\u300C${y.v||"\u5F0F\u306E\u7D42\u308F\u308A"}\u300D\u306F\u8AAD\u3081\u307E\u305B\u3093`)}function p(){let y=r();if(o(";"))return e++,()=>{};if(o("{")){e++;let w=[];for(;!o("}");){if(r().t==="end")throw new ln("\u300C}\u300D\u304C\u8DB3\u308A\u307E\u305B\u3093");w.push(p())}return e++,M=>{for(let S of w)S(M)}}if(y.t==="name"&&(y.v==="float"||y.v==="int")){e++;let w=y.v==="int",M=[];for(;;){let S=t[e++];if(S.t!=="var")throw new ln("\u5909\u6570\u540D\uFF08$\u2026\uFF09\u304C\u5FC5\u8981\u3067\u3059");n.set(S.v,w?"int":"float");let C=h(S);if(o("=")){e++;let _=u();M.push(E=>C.set(E,_.f(E)))}else M.push(_=>C.set(_,0));if(!o(","))break;e++}return a(";"),S=>{for(let C of M)C(S)}}if(y.t==="name"&&y.v==="if"){e++,a("(");let w=u();a(")");let M=p(),S=null;return r().t==="name"&&r().v==="else"&&(e++,S=p()),C=>{w.f(C)?M(C):S&&S(C)}}if(y.t==="name"&&y.v==="while"){e++,a("(");let w=u();a(")");let M=p();return S=>{let C=0;for(;w.f(S);){if(++C>Id)throw new ln("\u7E70\u308A\u8FD4\u3057\u304C\u591A\u3059\u304E\u307E\u3059");M(S)}}}if(y.t==="name"&&y.v==="for"){e++,a("(");let w=o(";")?null:u();a(";");let M=o(";")?null:u();a(";");let S=o(")")?null:u();a(")");let C=p();return _=>{let E=0;for(w&&w.f(_);!M||M.f(_);S&&S.f(_)){if(++E>Id)throw new ln("\u7E70\u308A\u8FD4\u3057\u304C\u591A\u3059\u304E\u307E\u3059");C(_)}}}let b=u();return r().t!=="end"&&a(";"),w=>{b.f(w)}}let v=[];for(;r().t!=="end";)v.push(p());return{outputs:[...i].sort((y,b)=>y-b),run(y){let b={vars:new Map,out:new Map,input:y.input,frame:y.frame,time:y.time};for(let w of v)w(b);return b}}}function Xv(s,t){let e=s.sourceStart,n=s.sourceEnd;if(!(Number.isFinite(e)&&Number.isFinite(n))){let h=1/0,u=-1/0;for(let d of Object.values(s.channels||{})){let f=t[d];!f||!f.n||(h=Math.min(h,f.t[0]),u=Math.max(u,f.t[f.n-1]))}Number.isFinite(e)||(e=Number.isFinite(h)?h:0),Number.isFinite(n)||(n=Number.isFinite(u)?u:e)}let i=Math.abs(s.scale)>1e-9?Math.abs(s.scale):1,r=Math.max(n-e,0),o=r*i,a=s.start||0,l=a-Math.max(s.preCycle||0,0)*o,c=a+(1+Math.max(s.postCycle||0,0))*o;return{ss:e,se:n,len:r,scale:i,start:a,begin:l,playEnd:c,end:c+Math.max(s.hold||0,0)}}function $v(s,t){if(s.len<=0)return s.ss;if(t>=s.playEnd)return s.se;if(t<=s.begin)return s.ss;let n=((t-s.start)/s.scale%s.len+s.len)%s.len;return s.ss+n}function Ud(s,t,e,n=(i,r)=>r){let i=(s.clips||[]).filter(h=>(h.enable??1)>=.5).map(h=>({clip:h,r:Xv(h,e)}));if(!i.length)return{};let r=i.filter(({r:h})=>t>=h.begin&&t<=h.end),o,a;if(r.length)r.sort((h,u)=>h.r.start-u.r.start||(h.clip.track||0)-(u.clip.track||0)||h.clip.order-u.clip.order),o=r[r.length-1],a=$v(o.r,t);else{let h=i.filter(({r:u})=>u.end<t).sort((u,d)=>u.r.end-d.r.end);h.length?(o=h[h.length-1],a=o.r.se):(o=i.slice().sort((u,d)=>u.r.begin-d.r.begin)[0],a=o.r.ss)}let l=o.clip.weight??1,c={};for(let[h,u]of Object.entries(o.clip.channels||{})){let d=e[u];d&&(c[h]=n(d,Di(d,a))*l)}return c}function ea(s){if(!Array.isArray(s)||s.length<6)return null;let t=0,e=Math.round(s[t++]);t++;let n=Math.round(s[t++]),i=Math.round(s[t++])===1,r=Math.round(s[t++]),o=Math.round(s[t++]),a=s.slice(t,t+o);t+=o;let l=Math.round(s[t++]),c=r+(i?1:0),h=[],u=[];for(let f=0;f<l;f++){let m=t+f*c;h.push(new A(s[m],s[m+1],r>=3?s[m+2]:0)),u.push(i?s[m+r]:1)}if(e<1||h.length<e+1||a.length<1)return null;let d=[a[0],...a,a[a.length-1]];return Od(e,n,d,h,i?u:null)}function Od(s,t,e,n,i=null){return{isCurve:!0,degree:s,form:t,knots:e,cvs:n,weights:i}}function oi(s,t){return Od(s.degree,s.form,s.knots,t,s.weights)}function Cs(s){let t=s.cvs.length;return[s.knots[s.degree],s.knots[t]]}function yr(s,t,e=new A){let{degree:n,knots:i,cvs:r,weights:o}=s,a=r.length,[l,c]=Cs(s);t=Math.min(Math.max(t,l),c);let h=n;for(;h<a-1&&i[h+1]<=t;)h++;let u=[];for(let f=0;f<=n;f++){let m=r[h-n+f],x=o?o[h-n+f]:1;u.push([m.x*x,m.y*x,m.z*x,x])}for(let f=1;f<=n;f++)for(let m=n;m>=f;m--){let x=h-n+m,g=i[x+n-f+1]-i[x],p=g>1e-12?(t-i[x])/g:0;for(let v=0;v<4;v++)u[m][v]=(1-p)*u[m-1][v]+p*u[m][v]}let d=u[n];return e.set(d[0]/d[3],d[1]/d[3],d[2]/d[3])}function Rs(s,t=32){let[e,n]=Cs(s),i=Math.max(1,s.cvs.length-s.degree),r=Math.max(16,i*t),o=[],a=[0];for(let l=0;l<=r;l++)o.push(yr(s,e+(n-e)*(l/r))),l>0&&a.push(a[l-1]+o[l].distanceTo(o[l-1]));return{pts:o,len:a,total:a[a.length-1]}}function Fd(s){return Rs(s).total}function kd(s,t,e=new A){let{pts:n,len:i}=s;if(t<=0)return e.copy(n[0]);if(t>=s.total)return e.copy(n[n.length-1]);let r=0,o=i.length-1;for(;o-r>1;){let l=r+o>>1;i[l]<=t?r=l:o=l}let a=(t-i[r])/Math.max(i[o]-i[r],1e-12);return e.lerpVectors(n[r],n[o],a)}function zd(s,t,e,n=0){let{pts:i}=s;for(let r=Math.max(0,n);r<i.length-1;r++){let o=i[r],a=i[r+1];if(a.distanceTo(t)<e)continue;let l=new A().subVectors(a,o),c=new A().subVectors(o,t),h=l.dot(l),u=2*c.dot(l),d=c.dot(c)-e*e,f=Math.max(0,u*u-4*h*d),m=h>1e-12?(-u+Math.sqrt(f))/(2*h):0;return{point:o.clone().addScaledVector(l,Math.min(1,Math.max(0,m))),seg:r}}return null}var cn=Math.PI/180,ge=180/Math.PI,Ft=1e-9,Yv=["xyz","yzx","zxy","xzy","yxz","zyx"],li=Yv.map(s=>s.split("").reverse().join("").toUpperCase()),Qt=["x","y","z"],na=["r","g","b"],lc=["x","y"],_r=["x","y","z","w"],Ui=new st,Fi={multiplyDivide:{i1:[0,0,0],i2:[1,1,1],op:1},plusMinusAverage:{op:1},reverse:{i:[0,0,0]},condition:{ft:0,st:0,op:0,ct:[0,0,0],cf:[1,1,1]},blendColors:{c1:[1,0,0],c2:[0,0,1],b:.5},pairBlend:{w:1,it1:[0,0,0],it2:[0,0,0],ir1:[0,0,0],ir2:[0,0,0],ri:0},unitConversion:{i:0,cf:1},ikHandle:{pv:[0,0,1],twi:0,ikb:1},scaleConstraint:{o:[1,1,1]},aimConstraint:{a:[1,0,0],u:[0,1,0],wu:[0,1,0],wut:3,o:[0,0,0]},lookAt:{a:[0,0,-1],u:[0,1,0],wu:[0,1,0],wut:3,o:[0,0,0],tws:0,twist:0},decomposeMatrix:{ro:0},composeMatrix:{it:[0,0,0],ir:[0,0,0],is:[1,1,1],ish:[0,0,0],iro:0,uer:1},quatToEuler:{iq:[0,0,0,1],iro:0},eulerToQuat:{irt:[0,0,0],iro:0},quatProd:{iq1:[0,0,0,1],iq2:[0,0,0,1]},quatInvert:{iq:[0,0,0,1]},quatNormalize:{iq:[0,0,0,1]},quatSlerp:{iq1:[0,0,0,1],iq2:[0,0,0,1],it:0},displayLayer:{v:1,dt:0,e:1},addDoubleLinear:{i1:0,i2:0},multDoubleLinear:{i1:1,i2:1},clamp:{ip:[0,0,0],mn:[0,0,0],mx:[0,0,0]},setRange:{v:[0,0,0],n:[0,0,0],m:[0,0,0],on:[0,0,0],om:[0,0,0]},remapValue:{i:0,imn:0,imx:1,omn:0,omx:1},distanceBetween:{p1:[0,0,0],p2:[0,0,0]},vectorProduct:{i1:[0,0,0],i2:[0,0,0],op:1,no:0},blendTwoAttr:{ab:0},blendWeighted:{},choice:{s:0},animBlendNodeAdditiveDL:{ia:0,ib:0,wa:1,wb:1},animBlendNodeAdditiveDA:{ia:0,ib:0,wa:1,wb:1},animBlendNodeAdditiveRotation:{ia:[0,0,0],ib:[0,0,0],wa:1,wb:1},animLayer:{w:1,m:0},cluster:{en:1},pointOnCurveInfo:{pr:0,top:0}};Fi.ikHandle={...Fi.ikHandle,roc:0,off:0,rol:0,dtce:0,dwut:0,dwua:0,dfa:0,dwuv:[0,1,0],dwve:[0,1,0]};var oc={unitConversion:/^o$/,multiplyDivide:/^o[xyz]?$/,plusMinusAverage:/^o(1|2[xy]?|3[xyz]?)$/,reverse:/^o[xyz]?$/,condition:/^oc[rgb]?$/,blendColors:/^op[rgb]?$/,pairBlend:/^o[tr][xyz]?$/,pointConstraint:/^ct[xyz]?$/,poleVectorConstraint:/^ct[xyz]?$/,orientConstraint:/^cr[xyz]?$/,parentConstraint:/^c[tr][xyz]?$/,scaleConstraint:/^cs[xyz]?$/,aimConstraint:/^cr[xyz]?$/,lookAt:/^cr[xyz]?$/,distanceDimShape:/^(dist|distance)$/,quatToEuler:/^ort[xyz]?$/,eulerToQuat:/^oq[xyzw]?$/,quatProd:/^oq[xyzw]?$/,quatInvert:/^oq[xyzw]?$/,quatNormalize:/^oq[xyzw]?$/,quatSlerp:/^oq[xyzw]?$/,curveInfo:/^(al|arcLength)$/,nurbsCurve:/^(ws|worldSpace|l|local)(\[\d+\])?$/,skinCluster:/^og(\[\d+\])?$/,tweak:/^og(\[\d+\])?$/,groupParts:/^og$/,wire:/^og(\[\d+\])?$/,locator:/^(wp|worldPosition)(\[\d+\])?$/,expression:/^(out|output)\[\d+\]$/,addDoubleLinear:/^o$/,multDoubleLinear:/^o$/,clamp:/^op[rgb]?$/,setRange:/^o[xyz]?$/,remapValue:/^(ov|outValue)$/,distanceBetween:/^d$/,vectorProduct:/^o[xyz]?$/,blendTwoAttr:/^o$/,blendWeighted:/^o$/,choice:/^o$/,animBlendNodeAdditiveDL:/^o$/,animBlendNodeAdditiveDA:/^o$/,animBlendNodeAdditiveRotation:/^o[xyz]?$/,animLayer:/^fo$/,cluster:/^og(\[\d+\])?$/,pointOnCurveInfo:/^(p|n|t|nn|nt|cc)[xyz]?$|^cr$/,animCurveUA:/^(o|output)$/,animCurveUL:/^(o|output)$/,animCurveUU:/^(o|output)$/,character:/^(lv|av|uv|tv)\[\d+\]$/,multMatrix:/^o$/,decomposeMatrix:/^o(t|r|s|sh)[xyz]?$|^oq[xyzw]?$/,composeMatrix:/^omat$/,inverseMatrix:/^omat$/},Bd=/^([trs][xyz]?|opm)$/,Zv=[["parent","\u89AA\u306E\u7A7A\u9593\u306E\u8EF8\u304B\u3089\uFF08\u4ECA\u306E\u89E3\u304D\u65B9\uFF09"],["world","\u30EF\u30FC\u30EB\u30C9\u306E\u8EF8\u304B\u3089"],["rest","\u30EC\u30B9\u30C8\u56DE\u8EE2\uFF08.restRotate\uFF09\u304B\u3089"]];function Vd(s,t){switch(s){case"pairBlend":return/^ir[12][xyz]?$/.test(t);case"orientConstraint":case"aimConstraint":return/^o[xyz]?$/.test(t);case"lookAt":return/^(o[xyz]?|tws|twist)$/.test(t);case"composeMatrix":return/^ir[xyz]?$/.test(t);case"eulerToQuat":return/^irt[xyz]?$/.test(t);case"parentConstraint":return/^tg\[\d+\]\.tor[xyz]?$/.test(t);case"ikHandle":return t==="twi";case"animBlendNodeAdditiveDA":return/^i[ab]$/.test(t);case"animBlendNodeAdditiveRotation":return/^i[ab][xyz]?$/.test(t);default:return!1}}function Ps(s,t){return s==="blendColors"&&(t==="c1"||t==="c2"||t==="op")||s==="condition"&&(t==="ct"||t==="cf"||t==="oc")||s==="clamp"&&/^(ip|mn|mx|op)$/.test(t)?na:s==="plusMinusAverage"&&/^(o2|i2\[\d+\])$/.test(t)?lc:/^(iq|iq1|iq2|oq)$/.test(t)?_r:Qt}var Mr=new A,Hd=new A,Oi=new A,ac=new _t,qd=new be,Gd=new st;function Ce(s,t=new _t){return s.decompose(Mr,t,Oi),t}function Se(s,t=new A){return t.setFromMatrixPosition(s)}function ai(s,t=0,e=new _t){return e.setFromEuler(qd.set(s[0]*cn,s[1]*cn,s[2]*cn,li[t]||"ZYX"))}function vr(s,t=new _t){return t.setFromEuler(qd.set(s[0],s[1],s[2],"ZYX"))}function Wd(s){let t=new _t(0,0,0,0),e=s[0].q;for(let{q:n,w:i}of s){let r=n.dot(e)<0?-i:i;t.x+=n.x*r,t.y+=n.y*r,t.z+=n.z*r,t.w+=n.w*r}return t.normalize()}var Xd=[];for(let s of["points","axis"])for(let t of[1,-1,0])for(let e of["handle","world","start"])for(let n of["full","rot","reflect"])for(let i of[1,-1])Xd.push({plane:s,twistSign:t,pvSpace:e,pvConvert:n,side:i});var jv={ikRPsolver:Xd,ikSplineSolver:[{splineInterp:"angle"},{splineInterp:"lerp"}]};function Kv(s){if(s.splineInterp)return s.splineInterp==="lerp"?"\u3072\u306D\u308A: up \u30D9\u30AF\u30C8\u30EB\u3092\u76F4\u7DDA\u3067\u88DC\u9593":"\u3072\u306D\u308A: \u89D2\u5EA6\u3067\u914D\u308B\uFF08\u4ECA\u306E\u89E3\u304D\u65B9\uFF09";let t={1:"\u3072\u306D\u308A \u4ECA\u306E\u5411\u304D","-1":"\u3072\u306D\u308A \u9006\u5411\u304D",0:"\u3072\u306D\u308A \u4F7F\u308F\u306A\u3044"}[s.twistSign],e={handle:"\u6975\u30D9\u30AF\u30C8\u30EB \u30CF\u30F3\u30C9\u30EB\u306E\u89AA\u306E\u7A7A\u9593",world:"\u6975\u30D9\u30AF\u30C8\u30EB \u30EF\u30FC\u30EB\u30C9\u7A7A\u9593",start:"\u6975\u30D9\u30AF\u30C8\u30EB \u958B\u59CB\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u89AA\u306E\u7A7A\u9593"}[s.pvSpace],n=s.plane==="axis"?"\u9762 \u958B\u59CB\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u8EF8\uFF08\u8098\u306E\u56DE\u8EE2\u8EF8\uFF09\u3092\u57FA\u6E96\u9762\u306B\u305D\u308D\u3048\u308B":"\u9762 3 \u70B9\uFF08\u4ECA\u306E\u89E3\u304D\u65B9\uFF09",i={full:"\u7A7A\u9593\u306E\u5909\u63DB \u30B9\u30B1\u30FC\u30EB\u8FBC\u307F\uFF08\u4ECA\u306E\u89E3\u304D\u65B9\uFF09",rot:"\u7A7A\u9593\u306E\u5909\u63DB IK \u306F\u56DE\u8EE2\u3060\u3051\uFF08\u53CD\u8EE2\u3092\u9664\u304F\uFF09",reflect:"\u7A7A\u9593\u306E\u5909\u63DB IK \u306F\u56DE\u8EE2\u3060\u3051\uFF08\u53CD\u8EE2\u3092\u6B8B\u3059\uFF09"}[s.pvConvert||"full"];return`${n}\u30FB${t}\u30FB${e}\u30FB${i}\u30FB\u8098 ${s.side===1?"\u6975\u30D9\u30AF\u30C8\u30EB\u306E\u5074":"\u53CD\u5BFE\u5074"}`}var $d={v:1,lodv:1,ove:0,ovv:1};function Yd(s){let t=e=>typeof s[e]=="number"?s[e]:$d[e];return t("v")>=.5&&t("lodv")>=.5&&!(t("ove")>=.5&&t("ovv")<.5)}var ia=class{constructor(t,e,n){this.clip=t,this.sceneNodes=e,this.staticLocal=n,this.graph=(t.raw.graph||[]).slice(),this.byId=new Map(this.graph.map(a=>[a.id,a])),this.dagGraph=new Map;for(let a of this.graph)a.dag>=0&&this.dagGraph.set(a.dag,a);this.ikJoint=new Map;for(let a of this.graph)if(a.ik)for(let l of a.ik.chain.slice(0,-1))this.ikJoint.set(l,a.id);this.drivers=new Set,this.directDrivers=new Set;let i=a=>{this.directDrivers.add(a);for(let l=a;l>=0&&!this.drivers.has(l);l=e[l].parent)this.drivers.add(l)};for(let a of this.graph){a.ik&&(i(a.dag),e[a.dag].parent>=0&&this.directDrivers.add(e[a.dag].parent));for(let l of Object.values(a.inputs||{})){let c=l.node!==void 0?this.byId.get(l.node):null;c&&c.dag>=0&&i(c.dag)}}this.moving=new Set;let r=new Set;for(let a of t.entries){let l=this.dagGraph.get(a.node),c=l&&l.inputs?Object.keys(l.inputs).filter(h=>Bd.test(h)):[];(a.channels.length||this.ikJoint.has(a.node)||c.length)&&this.moving.add(a.node),(a.channels.some(h=>h.base==="s")||c.some(h=>h[0]==="s"))&&r.add(a.node)}for(let a of t.entries)(a.rest.isNode??-1)>=0&&r.has(a.rest.isNode)&&this.moving.add(a.node);this.fallback=new Map((t.raw.fallback||[]).map(a=>[a.node,a]));for(let a of this.fallback.keys())this.moving.add(a);let o=new Set(t.raw.tainted||[]);this.tainted=new Set,e.forEach((a,l)=>{let c=a.inheritsTransform!==!1?a.parent:-1;(o.has(l)||c>=0&&this.tainted.has(c)&&!this.fallback.has(l))&&this.tainted.add(l)}),this.bindCache=new Map,this.matrices=new Map,this.splineRoots=new Set(this.graph.filter(a=>a.ik&&a.ik.solver==="ikSplineSolver"&&((a.attrs||{}).roc??0)>=.5).map(a=>a.ik.chain[0])),this.usesTime=this.graph.some(a=>a.type==="expression"&&/\b(frame|time)\b/.test(a.expr||"")),this.hasTrax=this.graph.some(a=>a.trax),this.props=t.raw.props||[],this.problems=new Set,this.ikVariant=null,this.aimMode=null,this.frame=0,this.poseOf=()=>null,this.reset()}get hasGraph(){return this.graph.length>0}reset(){this.cache={chan:new Map,local:new Map,world:new Map,plug:new Map,out:new Map,ik:new Map},this.busy=new Set}evaluate(t,e=()=>null,n=this.matrices){this.frame=t,this.poseOf=e,this.reset();for(let i of this.moving){let r=n.get(i)||new st;r.copy(this.localFile(i)),n.set(i,r)}return n}guard(t,e,n){if(this.busy.has(t))return this.problems.add(`\u5FAA\u74B0: ${t}`),n();this.busy.add(t);try{return e()}finally{this.busy.delete(t)}}rest(t){let e=this.clip.byNode.get(t);return e?e.rest:null}parentWorld(t){let e=this.sceneNodes[t];return e.parent>=0&&e.inheritsTransform!==!1?this.world(e.parent):Ui}chan(t,e="full"){let n=`${e}:${t}`,i=this.cache.chan.get(n);if(i)return i;let r=this.rest(t),o=r?{...r,t:r.t.slice(),r:r.r.slice(),s:r.s.slice()}:null;if(!o)return null;let a=this.guard(`chan ${n}`,()=>{let l=this.clip.byNode.get(t),c=new Set;for(let u of l.channels)e==="t"&&u.base!=="t"||(o[u.base][u.axis]=Di(u.curve,this.frame),c.add(u.attr));let h=this.dagGraph.get(t);if(h&&h.inputs)for(let[u,d]of Object.entries(h.inputs)){if(u==="opm"&&e!=="t"){let g=this.source(d);g&&g.isMatrix4?o.opm=g.toArray():Array.isArray(g)&&g.length===16&&(o.opm=g.slice());continue}let f=u[0];if(!/^[trs][xyz]?$/.test(u)||e==="t"&&f!=="t"||c.has(u))continue;let m=this.source(d);if(m===void 0)continue;let x=f==="r"?ge:1;if(u.length===1){if(Array.isArray(m))for(let g=0;g<3;g++)c.has(f+Qt[g])||(o[f][g]=m[g]*x)}else typeof m=="number"&&(o[f][Qt.indexOf(u[1])]=m*x)}if(this.ikJoint.has(t)&&(e==="full"||e==="t"&&this.splineRoots.has(t))){let u=this.solveIK(this.ikJoint.get(t)),d=u&&u.get(t);Array.isArray(d)?e==="full"&&(o.r=d):d&&(d.t&&(o.t=d.t),d.r&&e==="full"&&(o.r=d.r))}return o},()=>o);return this.cache.chan.set(n,a),a}localFile(t){let e=this.cache.local.get(t);if(e)return e;let n=this.fallback.get(t);if(n){let l=n.anchor>=0?this.world(n.anchor).clone().multiply(this.bindWorld(n.anchor).clone().invert()).multiply(this.bindWorld(t)):this.bindWorld(t).clone(),c=this.parentWorld(t).clone().invert().multiply(l);return this.cache.local.set(t,c),c}let i=this.rest(t);if(!i||!this.moving.has(t))return this.staticLocal(t);let r=this.chan(t,"full"),o=null;i.joint&&(i.isScale||(i.isNode??-1)>=0)&&(o=i.isNode>=0&&this.rest(i.isNode)?this.chan(i.isNode,"full").s:i.isScale);let a=Tn(r,o,new st);return this.cache.local.set(t,a),a}world(t){let e=this.cache.world.get(t);if(e)return e;let n=this.guard(`world ${t}`,()=>{let i=this.localFile(t).clone(),r=this.poseOf(t);return r&&i.multiply(r),new st().multiplyMatrices(this.parentWorld(t),i)},()=>{let i=this.staticLocal(t);return new st().multiplyMatrices(this.parentWorld(t),i)});return this.cache.world.set(t,n),n}bindWorld(t){let e=this.bindCache.get(t);if(e)return e;let n=this.sceneNodes[t],i=new st().fromArray(n.bindMatrix||n.matrix),r=n.inheritsTransform!==!1?n.parent:-1,o=r>=0?this.bindWorld(r).clone().multiply(i):i;return this.bindCache.set(t,o),o}statusOf(t){return this.fallback.has(t)?"estimated":this.tainted.has(t)?"unknown":null}pivotPosition(t,e=new A){let n=(this.chan(t,"t")||{t:[0,0,0]}).t;return e.set(n[0],n[1],n[2]).applyMatrix4(this.parentWorld(t))}dagPlug(t,e){let n=this.rest(t),i=this.dagGraph.get(t),r=e.replace(/\[\d+\]$/,""),o=(a,l)=>l>=0?a[l]:a;if(/^[trs][xyz]?$/.test(r)){let a=r.length===2?Qt.indexOf(r[1]):-1,l=n?this.chan(t,r[0]==="t"?"t":"full"):null;return l?r[0]==="t"?o(l.t,a):r[0]==="r"?o(l.r.map(c=>c*cn),a):o(l.s,a):a>=0?r[0]==="s"?1:0:r[0]==="s"?[1,1,1]:[0,0,0]}switch(r){case"pm":case"parentMatrix":return this.parentWorld(t);case"pim":case"parentInverseMatrix":return this.parentWorld(t).clone().invert();case"wm":case"worldMatrix":return this.world(t);case"wim":case"worldInverseMatrix":return this.world(t).clone().invert();case"m":case"matrix":return this.localFile(t);case"rp":case"rpt":case"sp":case"spt":return n&&n[r]?n[r]:[0,0,0];case"jo":case"ra":return n&&n[r]?n[r].map(a=>a*cn):[0,0,0];case"ro":return n&&n.ro||0;case"v":case"lodv":case"ove":case"ovv":{let a=i?this.plug(i.id,r):void 0;return typeof a=="number"?a:$d[r]}case"opm":case"offsetParentMatrix":{let a=n?this.chan(t,"full"):null;return a&&a.opm?new st().fromArray(a.opm):new st}default:break}if(i){let a=this.plug(i.id,e);if(a!==void 0)return a}return 0}evaluateProps(){let t=[];for(let e of this.props){let n={};for(let[i,r]of Object.entries(e.inputs||{})){let o=this.guard(`prop ${e.kind}${e.index}.${i}`,()=>this.source(r),()=>{}),a=Array.isArray(o)?o[0]:o;typeof a=="number"&&Number.isFinite(a)&&(n[i]=a)}t.push({kind:e.kind,index:e.index,values:n,static:e.static||null})}return t}source(t){if(t.curve!==void 0){let n=this.clip.curves[t.curve];if(!n)return;let i=Di(n,this.frame);return n.type==="TA"?i*cn:i}let e=this.byId.get(t.node);if(e)return e.dag>=0?this.dagPlug(e.dag,t.attr):this.plug(t.node,t.attr)}plug(t,e){let n=`${t}.${e}`;if(this.cache.plug.has(n))return this.cache.plug.get(n);let i=this.guard(`plug ${n}`,()=>this.plugUncached(t,e),()=>{});return this.cache.plug.set(n,i),i}plugUncached(t,e){let n=this.byId.get(t),i=n.inputs||{};if(i[e])return this.source(i[e]);let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&i[r[1]]&&Ps(n.type,r[1]).includes(r[2])){let a=this.source(i[r[1]]);return Array.isArray(a)?a[Ps(n.type,r[1]).indexOf(r[2])]:void 0}if(oc[n.type]&&oc[n.type].test(e)){let a=this.outputs(t);return a?e in a?a[e]:a[e.replace(/\[\d+\]$/,"")]:void 0}let o=Ps(n.type,e);if(o.some(a=>i[e+a])){let a=this.staticValue(n,e);return o.map((l,c)=>{let h=this.plug(t,e+l);return h!==void 0?h:Array.isArray(a)?a[c]:0})}return this.staticValue(n,e)}staticValue(t,e){let n=t.attrs||{},i=Vd(t.type,e)?cn:1,r=l=>Array.isArray(l)?l.map(c=>c*i):l*i;if(e in n)return r(n[e]);let o=/^(.*?)([xyzrgb])$/.exec(e);if(o&&Array.isArray(n[o[1]])){let l=Ps(t.type,o[1]).indexOf(o[2]);if(l>=0)return n[o[1]][l]*(Vd(t.type,o[1])?cn:1)}let a=Ps(t.type,e);if(a.some(l=>e+l in n)){let l=this.defaultValue(t.type,e);return a.map((c,h)=>(e+c in n?n[e+c]:Array.isArray(l)?l[h]:0)*i)}return this.defaultValue(t.type,e,i)}defaultValue(t,e,n=1){if(/^w\d+$/.test(e)||/\.tw$/.test(e))return 1;let i=Fi[t]&&Fi[t][e];if(i!==void 0)return Array.isArray(i)?i.map(o=>o*n):i*n;let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&Fi[t]&&Array.isArray(Fi[t][r[1]]))return Fi[t][r[1]][Ps(t,r[1]).indexOf(r[2])]*n}mat(t,e){let n=this.plug(t,e);return n&&n.isMatrix4?n:Array.isArray(n)&&n.length===16?new st().fromArray(n):new st}indices(t,e){let n=[...Object.keys(t.inputs||{}),...Object.keys(t.attrs||{})];return[...new Set(n.map(i=>e.exec(i)).filter(Boolean).map(i=>+i[1]))].sort((i,r)=>i-r)}attrName(t,e){return e.find(n=>t.inputs&&t.inputs[n]||t.attrs&&n in t.attrs)||e[0]}num(t,e,n=0){let i=this.plug(t,e);return typeof i=="number"&&Number.isFinite(i)?i:n}vec(t,e,n=[0,0,0]){let i=this.plug(t,e);return Array.isArray(i)?n.map((r,o)=>Number.isFinite(i[o])?i[o]:r):n.slice()}outputs(t){if(this.cache.out.has(t))return this.cache.out.get(t);let e=this.guard(`out ${t}`,()=>this.outputsUncached(t),()=>null);return this.cache.out.set(t,e),e}outputsUncached(t){let e=this.byId.get(t),n=null;switch(e.type){case"unitConversion":n={o:this.num(t,"i")*this.num(t,"cf",1)};break;case"multiplyDivide":n=this.multiplyDivide(t);break;case"plusMinusAverage":n=this.plusMinusAverage(t);break;case"reverse":n=Jt("o",this.vec(t,"i").map(i=>1-i),Qt);break;case"condition":n=this.condition(t);break;case"blendColors":n=this.blendColors(t);break;case"pairBlend":n=this.pairBlend(t);break;case"pointConstraint":case"orientConstraint":case"parentConstraint":case"scaleConstraint":case"poleVectorConstraint":case"aimConstraint":case"lookAt":n=this.constraint(e);break;case"distanceDimShape":{let i=o=>new A(...this.vec(t,this.attrName(e,o))),r=i(["sp","startPoint"]).distanceTo(i(["ep","endPoint"]));n={dist:r,distance:r};break}case"multMatrix":{let i=new st;for(let r of this.indices(e,/^i\[(\d+)\]$/))i.premultiply(this.mat(t,`i[${r}]`));n={o:i};break}case"decomposeMatrix":{let i=new A,r=new _t,o=new A;this.mat(t,"imat").decompose(i,r,o);let a=new be().setFromQuaternion(r,li[Math.round(this.num(t,"ro",0))]||"ZYX");n={...Jt("ot",i.toArray(),Qt),...Jt("or",[a.x,a.y,a.z],Qt),...Jt("os",o.toArray(),Qt),...Jt("osh",[0,0,0],Qt),...Jt("oq",[r.x,r.y,r.z,r.w],["x","y","z","w"])};break}case"composeMatrix":{let i=this.vec(t,"it"),r=this.vec(t,"ir"),o=this.vec(t,"is",[1,1,1]),a;if(this.num(t,"uer",1)>=.5)a=new _t().setFromEuler(new be(r[0],r[1],r[2],li[Math.round(this.num(t,"iro",0))]||"ZYX"));else{let l=this.vec(t,"iq",[0,0,0,1]);a=new _t(l[0],l[1],l[2],l[3]??1).normalize()}n={omat:new st().compose(new A(...i),a,new A(...o))};break}case"inverseMatrix":n={omat:this.mat(t,"imat").clone().invert()};break;case"quatToEuler":{let i=new be().setFromQuaternion(this.quat(t,"iq").normalize(),this.order(t,"iro"));n=Jt("ort",[i.x,i.y,i.z],Qt);break}case"eulerToQuat":{let i=this.vec(t,"irt"),r=new _t().setFromEuler(new be(i[0],i[1],i[2],this.order(t,"iro")));n=Jt("oq",[r.x,r.y,r.z,r.w],_r);break}case"quatProd":{let i=this.quat(t,"iq2").multiply(this.quat(t,"iq1"));n=Jt("oq",[i.x,i.y,i.z,i.w],_r);break}case"quatInvert":case"quatNormalize":{let i=this.quat(t,"iq").normalize();e.type==="quatInvert"&&i.invert(),n=Jt("oq",[i.x,i.y,i.z,i.w],_r);break}case"quatSlerp":{let i=this.quat(t,"iq1").normalize().slerp(this.quat(t,"iq2").normalize(),this.num(t,"it",0));n=Jt("oq",[i.x,i.y,i.z,i.w],_r);break}case"curveInfo":{let i=this.plug(t,"ic"),r=i&&i.isCurve?Fd(i):0;n={al:r,arcLength:r};break}case"nurbsCurve":n=this.curveOutputs(e);break;case"locator":{let i=Se(e.parent>=0?this.world(e.parent):Ui).toArray();n={wp:i,worldPosition:i};break}case"skinCluster":n=this.skinCurve(e);break;case"wire":n=this.wireCurves(e);break;case"cluster":n=this.clusterCurves(e);break;case"addDoubleLinear":n={o:this.num(t,"i1",0)+this.num(t,"i2",0)};break;case"multDoubleLinear":n={o:this.num(t,"i1",1)*this.num(t,"i2",1)};break;case"clamp":{let i=this.vec(t,"ip"),r=this.vec(t,"mn"),o=this.vec(t,"mx");n=Jt("op",i.map((a,l)=>Math.min(Math.max(a,r[l]),o[l])),na);break}case"setRange":{let i=this.vec(t,"v"),r=this.vec(t,"n"),o=this.vec(t,"m"),a=this.vec(t,"on"),l=this.vec(t,"om");n=Jt("o",i.map((c,h)=>Math.abs(l[h]-a[h])<1e-12?r[h]:r[h]+(c-a[h])/(l[h]-a[h])*(o[h]-r[h])),Qt);break}case"remapValue":n=this.remapValue(e);break;case"pointOnCurveInfo":n=this.pointOnCurve(e);break;case"distanceBetween":{let i=new A(...this.vec(t,"p1")).applyMatrix4(this.mat(t,"im1")),r=new A(...this.vec(t,"p2")).applyMatrix4(this.mat(t,"im2"));n={d:i.distanceTo(r)};break}case"vectorProduct":{let i=new A(...this.vec(t,"i1")),r=new A(...this.vec(t,"i2")),o=Math.round(this.num(t,"op",1)),a;if(o===1){let l=i.dot(r);a=new A(l,l,l)}else o===2?a=i.clone().cross(r):o===3?a=i.clone().applyMatrix3(new Vt().setFromMatrix4(this.mat(t,"m"))):o===4?a=i.clone().applyMatrix4(this.mat(t,"m")):a=i.clone();this.num(t,"no",0)>=.5&&o!==1&&a.normalize(),n=Jt("o",a.toArray(),Qt);break}case"blendTwoAttr":{let i=this.num(t,"ab",0);n={o:this.num(t,"i[0]",0)*(1-i)+this.num(t,"i[1]",0)*i};break}case"blendWeighted":{let i=0;for(let r of this.indices(e,/^i\[(\d+)\]$/))i+=this.num(t,`i[${r}]`,0)*this.num(t,`w[${r}]`,1);n={o:i};break}case"choice":n={o:this.plug(t,`i[${Math.round(this.num(t,"s",0))}]`)};break;case"character":{n={};for(let[i,r]of Object.entries(e.attrs||{}))oc.character.test(i)&&(n[i]=r);e.trax&&Object.assign(n,Ud(e.trax,this.frame,this.clip.curves,(i,r)=>i.type==="TA"?r*cn:r));break}case"animBlendNodeAdditiveDL":case"animBlendNodeAdditiveDA":n={o:this.num(t,"ia",0)*this.num(t,"wa",1)+this.num(t,"ib",0)*this.num(t,"wb",1)};break;case"animBlendNodeAdditiveRotation":{let i=this.vec(t,"ia"),r=this.vec(t,"ib"),o=this.num(t,"wa",1),a=this.num(t,"wb",1);n=Jt("o",i.map((l,c)=>l*o+r[c]*a),Qt);break}case"animCurveUA":case"animCurveUL":case"animCurveUU":{let i=this.clip.curves[e.curve];if(!i)break;let r=Di(i,this.num(t,"i",0));n={o:e.type==="animCurveUA"?r*cn:r},n.output=n.o;break}case"animLayer":n={fo:this.num(t,"m",0)>=.5?0:this.num(t,"w",1)};break;case"expression":n=this.expression(e);break;case"tweak":{let i=this.plug(t,"ip[0].ig");n=i&&i.isCurve?{og:i}:null;break}case"groupParts":{let i=this.plug(t,"ig");n=i&&i.isCurve?{og:i}:null;break}default:break}return n}wireCurves(t){let e=t.id,n=this.indices(t,/^dw\[(\d+)\]$/).map(a=>{let l=this.plug(e,`dw[${a}]`),c=this.plug(e,`bw[${a}]`);if(!l||!l.isCurve||!c||!c.isCurve||l.cvs.length!==c.cvs.length)return null;let h=Rs(c,32).pts,u=Rs(l,32).pts;return{pb:h,pw:u,dds:this.num(e,`dds[${a}]`,1),sc:this.num(e,`sc[${a}]`,1)}}).filter(Boolean),i=this.num(e,"en",1),r=this.num(e,"rot",1),o={};for(let a of this.indices(t,/^ip\[(\d+)\]\.ig$/)){let l=this.plug(e,`ip[${a}].ig`);if(!l||!l.isCurve)continue;let c=(t.geom||{})[a],h=c>=0?this.world(c):Ui,u=h.clone().invert(),d=t.attrs||{},f=l.cvs.map((m,x)=>{let g=d[`wl[${a}].w[${x}]`],p=(typeof g=="number"?g:1)*i;if(!n.length||Math.abs(p)<Ft)return m.clone();let v=m.clone().applyMatrix4(h),y=new A;for(let{pb:b,pw:w,dds:M,sc:S}of n){let C=1/0,_=0,E=0;for(let j=0;j<b.length-1;j++){let $=Mr.subVectors(b[j+1],b[j]),et=$.lengthSq(),F=et>Ft?Math.min(1,Math.max(0,Hd.subVectors(v,b[j]).dot($)/et)):0,W=Hd.copy(b[j]).addScaledVector($,F).distanceToSquared(v);W<C&&(C=W,_=j,E=F)}let N=Math.sqrt(C);if(M<=Ft||N>=M)continue;let k=N/M,Q=(1-k*k)*(1-k*k),L=new A().lerpVectors(b[_],b[_+1],E),U=new A().lerpVectors(w[_],w[_+1],E),D=new A().subVectors(b[_+1],b[_]).normalize(),H=new A().subVectors(w[_+1],w[_]).normalize(),G=new _t().slerp(new _t().setFromUnitVectors(D,H),Math.min(1,Math.max(0,r*Q))),B=new A().subVectors(v,L).multiplyScalar(1+(S-1)*Q).applyQuaternion(G);y.add(U.add(B).sub(v).multiplyScalar(Q))}return v.addScaledVector(y,p).applyMatrix4(u)});o[`og[${a}]`]=oi(l,f),o.og||(o.og=o[`og[${a}]`])}return o}clusterCurves(t){let e=t.id,n=this.mat(e,"ma").clone().multiply(this.mat(e,"pm")),i=this.num(e,"en",1),r=t.attrs||{},o={};for(let a of this.indices(t,/^ip\[(\d+)\]\.ig$/)){let l=this.plug(e,`ip[${a}].ig`);if(!l||!l.isCurve)continue;let c=(t.geom||{})[a],h=Array.isArray(r[`gm[${a}]`])?new st().fromArray(r[`gm[${a}]`]):c>=0?this.world(c):Ui,u=h.clone().invert().multiply(n).multiply(h),d=l.cvs.map((f,m)=>{let x=r[`wl[${a}].w[${m}]`],g=(typeof x=="number"?x:1)*i;return Math.abs(g)<Ft?f.clone():f.clone().lerp(f.clone().applyMatrix4(u),g)});o[`og[${a}]`]=oi(l,d),o.og||(o.og=o[`og[${a}]`])}return o}pointOnCurve(t){let e=t.id,n=this.plug(e,"ic");if(!n||!n.isCurve)return null;let[i,r]=Cs(n),o=this.num(e,"pr",0);if(this.num(e,"top",0)>=.5){let b=Rs(n,64),w=Math.min(Math.max(o,0),1)*b.total,M=0;for(;M<b.len.length-2&&b.len[M+1]<w;)M++;let S=b.len[M+1]-b.len[M],C=S>Ft?(w-b.len[M])/S:0;o=i+(r-i)*(M+C)/(b.pts.length-1)}o=Math.min(Math.max(o,i),r);let a=(r-i)*1e-4,l=b=>yr(n,Math.min(Math.max(b,i),r)),c=l(o),h=Math.max(o-a,i),u=Math.min(o+a,r),d=l(u).sub(l(h)).divideScalar(u-h),f=l(u).add(l(h)).sub(c.clone().multiplyScalar(2)).divideScalar(((u-h)/2)**2),m=d.clone().normalize(),x=f.clone().addScaledVector(m,-f.dot(m)),g=d.lengthSq(),p=g>Ft?x.length()/g:0,v=p>Ft?1/p:0,y=p>Ft?c.clone().addScaledVector(x.clone().normalize(),v):c.clone();return{...Jt("p",c.toArray(),Qt),...Jt("t",d.toArray(),Qt),...Jt("nt",m.toArray(),Qt),...Jt("n",x.toArray(),Qt),...Jt("nn",x.clone().normalize().toArray(),Qt),...Jt("cc",y.toArray(),Qt),cr:v}}remapValue(t){let e=t.id,n=this.num(e,"imn",0),i=this.num(e,"imx",1),r=Math.abs(i-n)<1e-12?0:(this.num(e,"i",0)-n)/(i-n),o=t.attrs||{},a=this.indices(t,/^vl\[(\d+)\]/).map(d=>{let f=o[`vl[${d}]`],m=(x,g,p)=>(t.inputs||{})[`vl[${d}].${x}`]?this.num(e,`vl[${d}].${x}`,p):typeof o[`vl[${d}].${x}`]=="number"?o[`vl[${d}].${x}`]:Array.isArray(f)&&Number.isFinite(f[g])?f[g]:p;return{p:m("vp",0,0),v:m("fv",1,0),interp:Math.round(m("vi",2,1))}}).sort((d,f)=>d.p-f.p),l;if(!a.length)l=Math.min(1,Math.max(0,r));else if(r<=a[0].p)l=a[0].v;else if(r>=a[a.length-1].p)l=a[a.length-1].v;else{let d=0;for(;d<a.length-2&&a[d+1].p<=r;)d++;let f=a[d],m=a[d+1],x=(r-f.p)/Math.max(m.p-f.p,1e-12),g=f.interp===0?0:f.interp===1?x:x*x*(3-2*x);l=f.v+(m.v-f.v)*g}let c=this.num(e,"omn",0),h=this.num(e,"omx",1),u=c+l*(h-c);return{ov:u,outValue:u}}expression(t){if(t.program===void 0)try{t.program=Dd(t.expr||"")}catch(i){t.program=null,t.problem=i.message}if(!t.program)return this.problems.add(`expression ${t.name} \u3092\u89E3\u91C8\u3067\u304D\u307E\u305B\u3093: ${t.problem}`),null;let e;try{e=t.program.run({input:i=>this.num(t.id,`in[${i}]`,0),frame:this.frame,time:this.frame/(this.clip.fps||24)})}catch(i){return this.problems.add(`expression ${t.name}: ${i.message}`),null}let n={};for(let[i,r]of e.out)Number.isFinite(r)&&(n[`out[${i}]`]=r);return n}quat(t,e){let n=this.vec(t,e,[0,0,0,1]);return new _t(n[0],n[1],n[2],n[3])}order(t,e){return li[Math.round(this.num(t,e,0))]||"ZYX"}curveOutputs(t){let e=null,n=t.inputs||{};if(n.cr){let l=this.source(n.cr);l&&l.isCurve&&(e=l)}if(e||(e=ea((t.attrs||{}).cc)),!e)return null;let i=e.cvs.map(l=>l.clone());for(let[l,c]of Object.entries(t.attrs||{})){let h=/^cp\[(\d+)\]$/.exec(l);h&&i[+h[1]]&&Array.isArray(c)&&i[+h[1]].add(new A(c[0],c[1],c[2]))}for(let[l,c]of Object.entries(n)){let h=/^cp\[(\d+)\](?:\.([xyz])v)?$/.exec(l);if(!h||!i[+h[1]])continue;let u=this.source(c);h[2]&&typeof u=="number"?i[+h[1]].setComponent(Qt.indexOf(h[2]),u):Array.isArray(u)&&i[+h[1]].set(u[0],u[1],u[2])}let r=oi(e,i),o=t.parent>=0?this.world(t.parent):Ui,a=oi(e,i.map(l=>l.clone().applyMatrix4(o)));return{l:r,local:r,ws:a,worldSpace:a}}skinCurve(t){let e=this.plug(t.id,"ip[0].ig");if(!e||!e.isCurve||!t.skin)return null;if(!t.weightsOf){t.weightsOf=new Map;for(let[c,h,u]of t.skin.weights)t.weightsOf.has(c)||t.weightsOf.set(c,[]),t.weightsOf.get(c).push([h,u])}let n=t.skin.gm?new st().fromArray(t.skin.gm):new st,i=n.clone().invert(),r=new Map,o=c=>{if(!r.has(c)){let u=(t.inputs||{})[`pm[${c}]`]?this.mat(t.id,`pm[${c}]`):new st().fromArray(t.skin.pm[String(c)]||new st().elements);r.set(c,this.mat(t.id,`ma[${c}]`).clone().multiply(u).multiply(n))}return r.get(c)},a=e.cvs.map((c,h)=>{let u=t.weightsOf.get(h);if(!u)return c.clone();let d=new A,f=0;for(let[m,x]of u)x!==0&&(d.addScaledVector(c.clone().applyMatrix4(o(m)),x),f+=x);return f>Ft?d.divideScalar(f).applyMatrix4(i):c.clone()});return{og:oi(e,a)}}multiplyDivide(t){let e=this.vec(t,"i1"),n=this.vec(t,"i2",[1,1,1]),i=Math.round(this.num(t,"op",1)),r=e.map((o,a)=>i===1?o*n[a]:i===2?Math.abs(n[a])<Ft?o:o/n[a]:i===3?o**n[a]:o);return Jt("o",r,Qt)}plusMinusAverage(t){let e=this.byId.get(t),n=Math.round(this.num(t,"op",1)),i=new Set([...Object.keys(e.inputs||{}),...Object.keys(e.attrs||{})]),r=f=>[...new Set([...i].map(m=>f.exec(m)).filter(Boolean).map(m=>+m[1]))].sort((m,x)=>m-x),o=f=>{if(!f.length)return 0;if(n===2)return f.slice(1).reduce((x,g)=>x-g,f[0]);let m=f.reduce((x,g)=>x+g,0);return n===3?m/f.length:n===0?f[0]:m},a=(f,m,x)=>{let g=`i${f}[${m}]`,p=this.plug(t,g);return x.map((v,y)=>{let b=this.plug(t,`${g}.i${f}${v}`);return typeof b=="number"?b:Array.isArray(p)?p[y]:0})},l=r(/^i1\[(\d+)\]$/).map(f=>this.num(t,`i1[${f}]`)),c=r(/^i2\[(\d+)\]/).map(f=>a(2,f,lc)),h=r(/^i3\[(\d+)\]/).map(f=>a(3,f,Qt)),u=[0,1].map(f=>o(c.map(m=>m[f]))),d=[0,1,2].map(f=>o(h.map(m=>m[f])));return{o1:o(l),...Jt("o2",u,lc),...Jt("o3",d,Qt)}}condition(t){let e=this.num(t,"ft"),n=this.num(t,"st"),i=Math.round(this.num(t,"op")),r=[e===n,e!==n,e>n,e>=n,e<n,e<=n][i]??!1;return Jt("oc",r?this.vec(t,"ct",[0,0,0]):this.vec(t,"cf",[1,1,1]),na)}blendColors(t){let e=this.vec(t,"c1",[1,0,0]),n=this.vec(t,"c2",[0,0,1]),i=this.num(t,"b",.5);return Jt("op",e.map((r,o)=>r*i+n[o]*(1-i)),na)}pairBlend(t){let e=this.num(t,"w",1),n=this.byId.get(t),i=n.inputs||{},r=n.attrs||{},o=(x,g,p)=>{let v=this.vec(t,`${x}${g}`);return Qt.map((y,b)=>{let w=`${x}${y}${g}`;return i[w]?this.num(t,w,0):typeof r[w]=="number"?r[w]*(p?cn:1):v[b]})},a=o("it",1,!1),l=o("it",2,!1),c=o("ir",1,!0),h=o("ir",2,!0),u=x=>Math.round(this.num(t,x,0)),d=(x,g,p)=>p===1?x:p===2?g:x*(1-e)+g*e,f=Qt.map((x,g)=>d(a[g],l[g],u(`t${x}m`))),m;if(Math.round(this.num(t,"ri",0))===1){let x=vr(c).slerp(vr(h,new _t),e),g=new be().setFromQuaternion(x,"ZYX");m=[g.x,g.y,g.z]}else m=Qt.map((x,g)=>d(c[g],h[g],u(`r${x}m`)));return{...Jt("ot",f,Qt),...Jt("or",m,Qt)}}constraint(t){let e=t.id,n=t.type==="orientConstraint"||t.type==="parentConstraint"||t.type==="scaleConstraint",i=[];for(let f of t.targets||[]){let m=this.byId.get(f.node);if(!m||m.dag<0&&n)continue;let x=this.num(e,`tg[${f.index}].tw`,1);x>0&&i.push({ni:m.dag,index:f.index,w:x})}let r=i.reduce((f,m)=>f+m.w,0);if(r<=Ft)return null;let o=t.driven,a=o>=0?this.parentWorld(o):Ui,l=a.clone().invert(),c=f=>{if(f.ni<0)return this.targetPosition(e,f.index);let m=this.rest(f.ni),x=m&&m.rp?m.rp:[0,0,0];return new A(x[0],x[1],x[2]).applyMatrix4(this.world(f.ni))},h=f=>{let m=new A;for(let x of i)m.addScaledVector(f(x),x.w/r);return m},u=f=>{let m=f.clone().applyMatrix4(l),x=t.type==="pointConstraint"?this.vec(e,"o"):[0,0,0],g=this.vec(e,"crp"),p=this.vec(e,"crt");return[m.x+x[0]-g[0]-p[0],m.y+x[1]-g[1]-p[1],m.z+x[2]-g[2]-p[2]]},d=f=>{let m=Ce(a).invert().multiply(f);return this.localEuler(o,m).map(x=>x*cn)};switch(t.type){case"pointConstraint":return Jt("ct",u(h(f=>c(f))),Qt);case"poleVectorConstraint":{let f=h(g=>this.pvcTargetPosition(t,g)),m=this.pvcStartPosition(t),x=f.sub(m);return Jt("ct",x.applyMatrix3(new Vt().setFromMatrix4(l)).toArray(),Qt)}case"orientConstraint":{let f=this.vec(e,"o"),m=Wd(i.map(x=>({q:Ce(this.world(x.ni)),w:x.w})));return Jt("cr",d(m.multiply(vr(f))),Qt)}case"parentConstraint":{let f=i.map(g=>{let p=this.vec(e,`tg[${g.index}].tot`),v=this.vec(e,`tg[${g.index}].tor`);return{m:this.world(g.ni).clone().multiply(Gd.makeTranslation(p[0],p[1],p[2])).multiply(Gd.makeRotationFromQuaternion(vr(v,ac))),w:g.w}}),m=new A;for(let{m:g,w:p}of f)m.addScaledVector(Se(g,Mr.clone()),p/r);let x=Wd(f.map(({m:g,w:p})=>({q:Ce(g),w:p})));return{...Jt("ct",u(m),Qt),...Jt("cr",d(x),Qt)}}case"aimConstraint":case"lookAt":{let f=this.rest(o)||{},m=o>=0?this.chan(o,"t").t:[0,0,0],x=(E,N)=>N?[E[0]+N[0],E[1]+N[1],E[2]+N[2]]:E,g=new A(...x(x(m,f.rp),f.rpt)).applyMatrix4(a),p=h(E=>c(E)).sub(g);if(p.lengthSq()<Ft)return null;p.normalize();let v=new A(...this.vec(e,"a",[1,0,0])).normalize(),y=new A(...this.vec(e,"u",[0,1,0])),b=Math.round(this.num(e,"wut",3)),w=new A(...this.vec(e,"wu",[0,1,0])),M=null;b===0?M=(this.clip.raw.upAxis||"y")==="z"?new A(0,0,1):new A(0,1,0):b===1?M=Se(this.mat(e,"wum")).sub(g):b===2?M=w.clone().applyMatrix4(new st().extractRotation(this.mat(e,"wum"))):b===3&&(M=w);let S,C=y.clone().addScaledVector(v,-y.dot(v)),_=M?M.clone().addScaledVector(p,-M.dot(p)):null;if(!M||C.lengthSq()<Ft||_.lengthSq()<Ft){let E=this.aimMode||"parent";if(E==="world")S=new _t().setFromUnitVectors(v,p);else{let N=Ce(a),k=p.clone().applyQuaternion(N.clone().invert()),Q=E==="rest"?this.vec(e,"rsrr",[0,0,0]):[0,0,0],L=Ce(Tn({...f,t:[0,0,0],s:[1,1,1],r:Q,opm:void 0},null,new st)),U=new _t().setFromUnitVectors(v.clone().applyQuaternion(L),k);S=N.multiply(U.multiply(L))}}else{let E=(N,k)=>new st().makeBasis(N,k,N.clone().cross(k));C.normalize(),_.normalize(),S=new _t().setFromRotationMatrix(E(p,_).multiply(E(v,C).transpose()))}if(t.type==="lookAt"&&(b===0||b===3)){let E=this.num(e,this.attrName(t,["tws","twist"]),0);Math.abs(E)>1e-12&&(S=new _t().setFromAxisAngle(p,E).multiply(S))}return Jt("cr",d(S.multiply(vr(this.vec(e,"o")))),Qt)}case"scaleConstraint":{let f=h(x=>(this.world(x.ni).decompose(Mr,ac,Oi),Oi.clone()));a.decompose(Mr,ac,Oi);let m=this.vec(e,"o",[1,1,1]);return Jt("cs",[f.x/(Oi.x||1)*m[0],f.y/(Oi.y||1)*m[1],f.z/(Oi.z||1)*m[2]],Qt)}default:return null}}targetPosition(t,e){let n=`tg[${e}]`,[i,r,o]=["tt","trp","trt"].map(a=>this.vec(t,`${n}.${a}`));return new A(i[0]+r[0]+o[0],i[1]+r[1]+o[1],i[2]+r[2]+o[2]).applyMatrix4(this.mat(t,`${n}.tpm`))}localEuler(t,e){let n=this.rest(t)||{joint:!1,ro:0},i=e.clone();n.joint&&n.jo&&(i=ai(n.jo,0).invert().multiply(i)),n.ra&&i.multiply(ai(n.ra,0).invert());let r=new be().setFromQuaternion(i,li[n.ro||0]||"ZYX");return[r.x*ge,r.y*ge,r.z*ge]}solveIK(t){if(this.cache.ik.has(t))return this.cache.ik.get(t);let e=this.guard(`ik ${t}`,()=>this.solveIKUncached(t),()=>null);return this.cache.ik.set(t,e),e}solveIKUncached(t){let e=this.byId.get(t);if(e.ik.solver==="ikSplineSolver")return this.solveSpline(t);if(e.ik.chain.length===2)return this.solveOneBone(t);if(e.ik.chain.length>3)return this.solveChain(t);let[n,i,r]=e.ik.chain,o=e.ik.solver==="ikSCsolver";if(!this.rest(n)||!this.rest(i))return null;let a=this.parentWorld(n),l=this.chan(n,"fk"),c=this.chan(i,"fk"),h=Tn(l,this.isScaleOf(n),new st),u=Tn(c,this.isScaleOf(i),new st),d=(this.chan(r,"t")||{t:[0,0,0]}).t,f=new st().multiplyMatrices(a,h),m=new st().multiplyMatrices(f,u),x=Se(f),g=Se(m),p=new A(d[0],d[1],d[2]).applyMatrix4(m),v=g.distanceTo(x),y=p.distanceTo(g);if(v<Ft||y<Ft)return null;let b=new A().subVectors(g,x).cross(new A().subVectors(p,g)),w=this.dagGraph.get(i)&&this.dagGraph.get(i).attrs&&this.dagGraph.get(i).attrs.pa;b.lengthSq()<Ft*v*y&&Array.isArray(w)&&(u=Tn({...c,r:w},this.isScaleOf(i),new st),m=new st().multiplyMatrices(f,u),p=new A(d[0],d[1],d[2]).applyMatrix4(m),b=new A().subVectors(g,x).cross(new A().subVectors(p,g)));let M=e.dag,S=Se(this.world(M)),C=new A().subVectors(S,x),_=C.length();if(_<Ft)return null;C.divideScalar(_);let E=o?[0,0,0]:this.vec(t,"pv",[0,0,1]),N=this.pvWorld(E,M,n),k=N.clone().addScaledVector(C,-N.dot(C));k.lengthSq()<Ft&&(k=new A().subVectors(g,x).addScaledVector(C,-new A().subVectors(g,x).dot(C))),k.lengthSq()<Ft&&(k=new A(0,1,0).cross(C).lengthSq()>Ft?new A(0,1,0).cross(C):new A(1,0,0).cross(C)),k.normalize(),!o&&this.ikVariant&&this.ikVariant.side===-1&&k.negate();let Q=o?0:this.num(t,"twi",0)*this.twistSign();Math.abs(Q)>Ft&&k.applyQuaternion(new _t().setFromAxisAngle(C,Q));let L=Math.min(Math.max(_,Math.abs(v-y)),v+y),U=Math.min(1,Math.max(-1,(v*v+L*L-y*y)/(2*v*L))),D=Math.sqrt(Math.max(0,1-U*U)),H=x.clone().addScaledVector(C,v*U).addScaledVector(k,v*D),G=x.clone().addScaledVector(C,L),B=new A().subVectors(g,x).normalize(),j=new A().subVectors(H,x).normalize(),$=new A().subVectors(H,x).cross(new A().subVectors(G,H));$.lengthSq()<Ft&&($=k.clone().cross(C)),$.normalize(),b.lengthSq()<Ft?b=$.clone():b.normalize();let et=(At,yt)=>new st().makeBasis(At,yt,At.clone().cross(yt)),F=new _t().setFromRotationMatrix(et(j,$).multiply(et(B,b).transpose())),W=Ce(f),J=F.clone().multiply(W),z=new A().subVectors(p,g).normalize().applyQuaternion(F),tt=new A().subVectors(G,H).normalize(),xt=Math.atan2($.dot(z.clone().cross(tt)),z.dot(tt)),Mt=new _t().setFromAxisAngle($,xt).multiply(F).multiply(Ce(m));if(!o&&this.ikVariant&&this.ikVariant.plane==="axis"){let At=[0,1,2].map(T=>new A().setFromMatrixColumn(f,T).normalize()),yt=0;At.forEach((T,q)=>{Math.abs(T.dot(b))>Math.abs(At[yt].dot(b))&&(yt=q)});let ie=Math.sign(At[yt].dot(b))||1,It=At[yt].clone().applyQuaternion(F),P=$.clone().multiplyScalar(ie);if(It.addScaledVector(C,-It.dot(C)),P.addScaledVector(C,-P.dot(C)),It.lengthSq()>Ft&&P.lengthSq()>Ft){let T=Math.atan2(C.dot(It.clone().cross(P)),It.dot(P)),q=new _t().setFromAxisAngle(C,T);J=q.clone().multiply(J),Mt=q.clone().multiply(Mt)}}let Wt=Ce(a),X=this.localEuler(n,Wt.clone().invert().multiply(J)),xe=this.localEuler(i,J.clone().invert().multiply(Mt)),Ct=this.num(t,"ikb",1);if(Ct<1-Ft){let At=(yt,ie,It)=>{let P=li[(this.rest(It)||{}).ro||0],T=ai(yt,(this.rest(It)||{}).ro||0).slerp(ai(ie,(this.rest(It)||{}).ro||0),Math.max(0,Ct)),q=new be().setFromQuaternion(T,P);return[q.x*ge,q.y*ge,q.z*ge]};X=At(l.r,X,n),xe=At(c.r,xe,i)}return new Map([[n,X],[i,xe]])}solveOneBone(t){let e=this.byId.get(t),[n,i]=e.ik.chain;if(!this.rest(n))return null;let r=this.parentWorld(n),o=this.chan(n,"fk"),a=new st().multiplyMatrices(r,Tn(o,this.isScaleOf(n),new st)),l=(this.chan(i,"t")||{t:[0,0,0]}).t,c=Se(a),h=new A(l[0],l[1],l[2]).applyMatrix4(a),u=Se(this.world(e.dag)),d=h.sub(c),f=u.sub(c);if(d.lengthSq()<Ft||f.lengthSq()<Ft)return null;let m=new _t().setFromUnitVectors(d.normalize(),f.normalize()),x=this.localEuler(n,Ce(r).invert().multiply(m.multiply(Ce(a)))),g=this.num(t,"ikb",1);if(g<1-Ft){let p=(this.rest(n)||{}).ro||0,v=new be().setFromQuaternion(ai(o.r,p).slerp(ai(x,p),Math.max(0,g)),li[p]);x=[v.x*ge,v.y*ge,v.z*ge]}return new Map([[n,x]])}fkChain(t){let e=this.parentWorld(t[0]),n=[],i=e;return t.forEach((r,o)=>{let a=o===t.length-1?this.chan(r,"t"):this.chan(r,"fk");i=new st().multiplyMatrices(i,Tn(a,this.isScaleOf(r),new st)),n.push(i)}),{P:e,W:n,pos:n.map(r=>Se(r))}}ikLocals(t,e,n,i){let r=this.num(t,"ikb",1),o=new Map,a=Ce(n);return i.forEach((l,c)=>{let h=e[c],u=this.localEuler(h,a.clone().invert().multiply(l));if(r<1-Ft){let d=(this.rest(h)||{}).ro||0,f=new be().setFromQuaternion(ai(this.chan(h,"fk").r,d).slerp(ai(u,d),Math.max(0,r)),li[d]);u=[f.x*ge,f.y*ge,f.z*ge]}o.set(h,u),a=l}),o}rotateAlong(t,e,n,i=null){let{W:r,pos:o}=t,a=[],l=n.clone();for(let c=0;c<e.length-1;c++){let h=Ce(r[c]),u=l.clone().multiply(h),d=new A().subVectors(o[c+1],o[c]).normalize().applyQuaternion(l),f=new A().subVectors(e[c+1],e[c]).normalize(),m=new _t().setFromUnitVectors(d,f).multiply(u),x=i?i(c):0;Math.abs(x)>Ft&&(m=new _t().setFromAxisAngle(f,x).multiply(m)),a.push(m),l=m.clone().multiply(h.clone().invert())}return a}solveChain(t){let e=this.byId.get(t),n=e.ik.chain;if(n.some(w=>!this.rest(w)))return null;let i=this.fkChain(n),{pos:r}=i,o=r.length,a=[];for(let w=0;w<o-1;w++)a.push(r[w+1].distanceTo(r[w]));if(a.some(w=>w<Ft))return null;let l=a.reduce((w,M)=>w+M,0),c=r[0],h=Se(this.world(e.dag)),u=new A().subVectors(h,c),d=u.length();if(d<Ft)return null;u.divideScalar(d);let f=new A().subVectors(r[o-1],c).normalize(),m=new A;for(let w=1;w<o-1;w++){let M=new A().subVectors(r[w],c);m.add(M.addScaledVector(f,-M.dot(f)))}let x=null;if(e.ik.solver==="ikRPsolver"){let w=this.vec(t,"pv",[0,0,1]),M=this.pvWorld(w,e.dag,n[0]);x=M.addScaledVector(u,-M.dot(u)),this.ikVariant&&this.ikVariant.side===-1&&x.negate()}if((!x||x.lengthSq()<Ft)&&(x=m.clone().addScaledVector(u,-m.dot(u))),x.lengthSq()<Ft&&(x=new A(0,1,0).cross(u).lengthSq()>Ft?new A(0,1,0).cross(u):new A(1,0,0).cross(u)),x.normalize(),e.ik.solver==="ikRPsolver"){let w=this.num(t,"twi",0)*this.twistSign();Math.abs(w)>Ft&&x.applyQuaternion(new _t().setFromAxisAngle(u,w))}let g=m.lengthSq()>Ft?m.clone().normalize().cross(f):null,p=x.clone().cross(u).normalize();(!g||g.lengthSq()<Ft)&&(g=p.clone()),g.normalize();let v=(w,M)=>new st().makeBasis(w,M,w.clone().cross(M)),y=new _t().setFromRotationMatrix(v(u,p).multiply(v(f,g).transpose())),b=r.map(w=>w.clone().sub(c).applyQuaternion(y).add(c));if(d>=l){let w=0;for(let M=1;M<o;M++)w+=a[M-1],b[M]=c.clone().addScaledVector(u,w)}else for(let w=0;w<64;w++){b[o-1].copy(h);for(let M=o-2;M>=0;M--)b[M]=b[M+1].clone().add(b[M].clone().sub(b[M+1]).normalize().multiplyScalar(a[M]));b[0].copy(c);for(let M=1;M<o;M++)b[M]=b[M-1].clone().add(b[M].clone().sub(b[M-1]).normalize().multiplyScalar(a[M-1]));if(b[o-1].distanceTo(h)<l*1e-7)break}return this.ikLocals(t,n,i.P,this.rotateAlong(i,b,y))}solveSpline(t){let n=this.byId.get(t).ik.chain;if(n.some(v=>!this.rest(v)))return null;let i=this.plug(t,"ic");if(!i||!i.isCurve)return null;let r=this.fkChain(n),{pos:o}=r,a=o.length,l=[];for(let v=0;v<a-1;v++)l.push(o[v+1].distanceTo(o[v]));let c=Rs(i),h=this.num(t,"roc",0)>=.5,u,d=0;if(h){let v=Math.min(Math.max(this.num(t,"off",0),0),1)*c.total;for(u=kd(c,v);d<c.len.length-2&&c.len[d+1]<v;)d++}else{u=o[0].clone();let v=1/0;c.pts.forEach((y,b)=>{let w=y.distanceToSquared(u);w<v&&(v=w,d=Math.max(0,b-1))})}let f=[u],m=new A().subVectors(c.pts[c.pts.length-1],c.pts[c.pts.length-2]).normalize();for(let v=0;v<a-1;v++){let y=zd(c,f[v],l[v],d);y?(f.push(y.point),d=y.seg):f.push(f[v].clone().addScaledVector(m,l[v]))}let x=a-1,g;if(this.num(t,"dtce",0)>=.5&&Math.round(this.num(t,"dwut",0))!==7)g=this.splineAdvancedTwist(t,r,f,x);else{let v=this.num(t,"twi",0),y=this.num(t,"rol",0);g=this.rotateAlong(r,f,new _t,b=>(b===0?y:0)+(x>1?b===0?0:v/(x-1):v))}let p=this.ikLocals(t,n,r.P,g);if(h){let v=u.clone().applyMatrix4(r.P.clone().invert());p.set(n[0],{r:p.get(n[0]),t:v.toArray()})}return p}splineAdvancedTwist(t,e,n,i){let r=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],o=[[0,1,0],[0,-1,0],[0,1,0],[0,0,1],[0,0,-1],[0,0,1],[1,0,0],[-1,0,0],[1,0,0]],a=Math.round(this.num(t,"dwua",0)),l=a===2||a===5||a===8,c=new A(...r[Math.round(this.num(t,"dfa",0))]||r[0]),h=new A(...o[a]||o[0]),u=Math.round(this.num(t,"dwut",0)),d=(_,E)=>{let N=new A(...this.vec(t,_,[0,1,0]));return E?N.applyMatrix4(new st().extractRotation(this.mat(t,E))):N},f=_=>Se(this.mat(t,_)),m=(this.clip.raw.upAxis||"y")==="z"?new A(0,0,1):new A(0,1,0),x=[];for(let _=0;_<i;_++)x.push(new A().subVectors(n[_+1],n[_]).normalize());let g=(_,E)=>{let N=n[_];switch(u){case 1:return f("dwum").sub(N);case 2:return f(E?"dwum":"dwue").sub(N);case 3:return d("dwuv","dwum");case 4:return E?d("dwuv","dwum"):d("dwve","dwue");case 5:return d("dwuv");case 6:return d(E?"dwuv":"dwve");default:return m.clone()}},p=(_,E)=>(_.addScaledVector(E,-_.dot(E)),_.lengthSq()<Ft?null:_.normalize()),v=new Array(i).fill(null);if((u===2||u===4||u===6)&&i>1&&this.ikVariant&&this.ikVariant.splineInterp==="lerp"){let _=g(0,!0),E=g(i-1,!1);for(let N=0;N<i;N++)v[N]=p(_.clone().lerp(E,N/(i-1)),x[N])}else if((u===2||u===4||u===6)&&i>1){let _=p(g(0,!0),x[0]),E=p(g(i-1,!1),x[i-1]);if(_){let N=[_.clone()];for(let D=1;D<i;D++)N.push(p(N[D-1].clone().applyQuaternion(new _t().setFromUnitVectors(x[D-1],x[D])),x[D])||N[D-1].clone());let k=N[i-1],Q=E?Math.atan2(x[i-1].dot(k.clone().cross(E)),k.dot(E)):0,L=[0];for(let D=1;D<i;D++)L.push(L[D-1]+n[D].distanceTo(n[D-1]));let U=L[i-1]||1;for(let D=0;D<i;D++)v[D]=N[D].clone().applyQuaternion(new _t().setFromAxisAngle(x[D],Q*L[D]/U))}}else for(let _=0;_<i;_++)v[_]=p(g(_,!0),x[_]);let y=(_,E)=>new st().makeBasis(_,E,_.clone().cross(E)),b=c.clone().normalize(),w=h.clone().addScaledVector(b,-h.dot(b)).normalize(),M=w.clone().negate(),S=l?this.rotateAlong(e,n,new _t):null,C=[];for(let _=0;_<i;_++){let E=x[_],N=v[_];if(!N){C.push(new _t().setFromUnitVectors(b,E));continue}let k=l&&w.clone().applyQuaternion(S[_]).dot(N)<0?M:w;C.push(new _t().setFromRotationMatrix(y(E,N).multiply(y(b,k).transpose())))}return C}pvSpace(t,e){let n=this.ikVariant?this.ikVariant.pvSpace:null;return n==="world"?Ui:n==="start"?this.parentWorld(e):this.parentWorld(t)}pvcStartPosition(t){let e=t.inputs||{},n=t.attrs||{},i=r=>Object.keys(e).some(o=>o===r||o.startsWith(r))||Object.keys(n).some(o=>o===r||o.startsWith(r));if(i("crp")||i("ps")||i("crt")){let r=this.vec(t.id,"crp"),o=this.vec(t.id,"crt");return new A(r[0]+o[0],r[1]+o[1],r[2]+o[2]).applyMatrix4(this.mat(t.id,"ps"))}return t.pivot>=0?this.pivotPosition(t.pivot):new A}pvcTargetPosition(t,e){let n=e.index,i=t.inputs||{};if(i[`tg[${n}].tt`]||i[`tg[${n}].tpm`]||i[`tg[${n}].ttx`]){let a=this.vec(t.id,`tg[${n}].tt`),l=this.vec(t.id,`tg[${n}].trp`),c=this.vec(t.id,`tg[${n}].trt`);return new A(a[0]+l[0]+c[0],a[1]+l[1]+c[1],a[2]+l[2]+c[2]).applyMatrix4(this.mat(t.id,`tg[${n}].tpm`))}let r=this.rest(e.ni),o=r&&r.rp?r.rp:[0,0,0];return new A(o[0],o[1],o[2]).applyMatrix4(this.world(e.ni))}pvWorld(t,e,n){let i=new A(t[0],t[1],t[2]),r=this.pvSpace(e,n),o=this.ikVariant?this.ikVariant.pvConvert:null;return o==="rot"?i.applyQuaternion(Ce(r)):o==="reflect"?i.applyMatrix4(new st().extractRotation(r)):i.applyMatrix3(new Vt().setFromMatrix4(r))}twistSign(){let t=this.ikVariant?this.ikVariant.twistSign:void 0;return typeof t=="number"?t:1}fileRestLocal(t){let e=this.rest(t);if(!e)return null;let n=this.dagGraph.get(t),i=n&&n.inputs?Object.keys(n.inputs):[];if(i.some(l=>/^r[xyz]?$/.test(l)))return null;let r=this.clip.byNode.get(t),o=new Set((r?r.channels:[]).map(l=>l.base)),a={...e};return o.has("r")&&(a.r=this.chan(t,"fk").r),(o.has("t")||i.some(l=>/^t[xyz]?$/.test(l)))&&(a.t=this.chan(t,"t").t),(o.has("s")||i.some(l=>/^s[xyz]?$/.test(l)))&&(a.s=this.chan(t).s),i.includes("opm")&&(a.opm=this.chan(t).opm),Tn(a,this.isScaleOf(t),new st)}compareChain(t,e,n){let i=t.ik.chain,r=[],o=this.parentWorld(i[0]),a=null,l=[],c=[];for(let v=0;v<i.length;v++){let y=i[v],b=e(y);if(!b)break;let w=o.clone().multiply(b);if(l.push(Se(w)),c.push(w),v===i.length-1){a=w;break}let M=this.world(y),S=Ce(w),_=Ce(M).clone().multiply(S.clone().invert());_.w<0&&(_.x=-_.x,_.y=-_.y,_.z=-_.z,_.w=-_.w);let E=2*Math.acos(Math.min(1,_.w))*ge,N=e(i[v+1]),k=N?new A().setFromMatrixPosition(N).applyQuaternion(S).normalize():null,Q=0,L=E;if(k&&k.lengthSq()>Ft){let D=k.clone().multiplyScalar(new A(_.x,_.y,_.z).dot(k)),H=new _t(D.x,D.y,D.z,_.w).normalize();Q=2*Math.atan2(new A(H.x,H.y,H.z).dot(k),H.w)*ge,Q>180&&(Q-=360),Q<-180&&(Q+=360);let G=_.clone().multiply(H.clone().invert());L=2*Math.acos(Math.min(1,Math.abs(G.w)))*ge}let U=Se(w).distanceTo(Se(M));r.push({node:y,name:this.sceneNodes[y].name,angle:E,roll:Q,bend:L,position:U,ok:E<=n}),o=w}let h=Se(this.world(t.dag)),u=a?Se(a).distanceTo(h):null,d=null,f=null;if(t.ik.solver==="ikRPsolver"&&l.length===i.length&&i.length>=3){let v=l[0],y=h.clone().sub(v).normalize(),b=new A;for(let E=1;E<l.length-1;E++){let N=l[E].clone().sub(v);b.add(N.addScaledVector(y,-N.dot(y)))}let w=this.vec(t.id,"pv",[0,0,1]),M=this.pvWorld(w,t.dag,i[0]),S=M.clone(),C=M.addScaledVector(y,-M.dot(y));this.ikVariant&&this.ikVariant.side===-1&&C.negate();let _=this.num(t.id,"twi",0)*this.twistSign();Math.abs(_)>Ft&&C.applyQuaternion(new _t().setFromAxisAngle(y,_)),b.lengthSq()>Ft&&C.lengthSq()>Ft&&(b.normalize(),C.normalize(),d=Math.atan2(y.dot(C.clone().cross(b)),C.dot(b))*ge,f=S.applyAxisAngle(y,d*cn))}let m=v=>v.toArray().map(y=>Math.round(y*1e4)/1e4),x=i.map(v=>Se(this.world(v))),g=v=>v.slice(1).map((y,b)=>Math.round(y.distanceTo(v[b])*1e4)/1e4),p={fileJoints:l.map(m),evalJoints:x.map(m),handle:m(h),impliedPv:f?m(f):null,fileLengths:g(l),evalLengths:g(x),pv:t.ik.solver==="ikRPsolver"?m(this.pvWorld(this.vec(t.id,"pv",[0,0,1]),t.dag,i[0])):null,twist:Math.round(this.num(t.id,"twi",0)*ge*1e4)/1e4,ikBlend:this.num(t.id,"ikb",1),roll:Math.round(this.num(t.id,"rol",0)*ge*1e4)/1e4,pvAttr:t.ik.solver==="ikRPsolver"?this.vec(t.id,"pv",[0,0,1]).map(v=>Math.round(v*1e4)/1e4):null,twistInputs:Object.keys(t.inputs||{}).filter(v=>/^(twi|rol|pv[xyz]?)$/.test(v))};{let v=this.sceneNodes[t.dag].parent,y=this.parentWorld(t.dag),b=new A,w=new _t;y.decompose(new A,w,b),p.handleParent={name:v>=0?this.sceneNodes[v].name:"\uFF08\u30EF\u30FC\u30EB\u30C9\uFF09",scale:b.toArray().map(C=>Math.round(C*1e4)/1e4),mirrored:y.determinant()<0};let M=this.sceneNodes[i[0]].parent,S=this.parentWorld(i[0]);S.decompose(new A,w,b),p.startParent={name:M>=0?this.sceneNodes[M].name:"\uFF08\u30EF\u30FC\u30EB\u30C9\uFF09",scale:b.toArray().map(C=>Math.round(C*1e4)/1e4),mirrored:S.determinant()<0}}if(t.ik.solver==="ikRPsolver"&&l.length){let v=h.clone().sub(l[0]).normalize(),y=this.pvWorld(this.vec(t.id,"pv",[0,0,1]),t.dag,i[0]);y.addScaledVector(v,-y.dot(v));let b=this.num(t.id,"twi",0)*this.twistSign();Math.abs(b)>Ft&&y.applyQuaternion(new _t().setFromAxisAngle(v,b));let w=v.clone().cross(y).normalize(),M=l.length>=3?l[1].clone().sub(l[0]).cross(l[2].clone().sub(l[1])).normalize():null,S=(C,_)=>[0,1,2].map(E=>{let N=new A().setFromMatrixColumn(C,E).normalize();return Math.round(Math.acos(Math.max(-1,Math.min(1,N.dot(_))))*ge*100)/100});p.axes=i.slice(0,-1).map((C,_)=>{let E=this.rest(C)||{},N=this.dagGraph.get(C),k=N&&N.attrs&&Array.isArray(N.attrs.pa)?N.attrs.pa:null,Q=L=>Array.isArray(L)?L.map(U=>Math.round(U*1e3)/1e3):null;return{name:this.sceneNodes[C].name,fileToRef:c[_]?S(c[_],w):null,evalToRef:S(this.world(C),w),fileToChain:c[_]&&M?S(c[_],M):null,r:Q(E.r),jo:Q(E.jo),ra:Q(E.ra),pa:Q(k),ro:E.ro??0}})}return{joints:r,reach:u,poleError:d,detail:p,error:r.reduce((v,y)=>Math.max(v,y.angle),0)}}parentDrift(t,e,n,i=!1){let r=i?[t]:[];for(let u=this.sceneNodes[t].parent;u>=0;u=this.sceneNodes[u].inheritsTransform!==!1?this.sceneNodes[u].parent:-1)r.unshift(u);if(!r.length)return null;let o=new st,a=null,l=[];for(let u of r){let d=this.localFile(u),f=this.connectedChannels(u);f.length&&l.push({name:this.sceneNodes[u].name,by:f});let m=this.rest(u)?e(u):this.staticLocal(u);if(m||(m=d),o=o.clone().multiply(m),!a){let x=Ce(d).clone().multiply(Ce(m).clone().invert()),g=2*Math.acos(Math.min(1,Math.abs(x.w)))*ge,p=Se(d).distanceTo(Se(m));if(g>n||p>.001){let v=this.ikJoint.has(u)?this.byId.get(this.ikJoint.get(u)).name:null;a={name:this.sceneNodes[u].name,angle:g,position:p,ik:v}}}}let c=this.world(r[r.length-1]),h=Ce(c).clone().multiply(Ce(o).clone().invert());return{name:this.sceneNodes[r[r.length-1]].name,angle:2*Math.acos(Math.min(1,Math.abs(h.w)))*ge,position:Se(c).distanceTo(Se(o)),firstBad:a,unchecked:l}}connectedChannels(t){let e=this.dagGraph.get(t);if(!e||!e.inputs)return[];let n=new Map;for(let[i,r]of Object.entries(e.inputs)){let o=/^(t|r|s|opm)[xyz]?$/.exec(i);if(!o)continue;let a;if(r.node===void 0)a="\u30AD\u30FC";else{let c=this.byId.get(r.node);a=c?`${c.name}\uFF08${c.type}\uFF09`:"?"}let l={t:"\u79FB\u52D5",r:"\u56DE\u8EE2",s:"\u30B9\u30B1\u30FC\u30EB",opm:"offsetParentMatrix"}[o[1]];a!=="\u30AD\u30FC"&&(n.has(l)||n.set(l,new Set),n.get(l).add(a))}return[...n].map(([i,r])=>({what:i,from:[...r]}))}poleTargets(t,e,n){let i=t.inputs||{},r=i.pv||i.pvx||i.pvy||i.pvz,o=r&&r.node!==void 0?this.byId.get(r.node):null;if(!o)return null;if(o.type!=="poleVectorConstraint")return{via:`${o.name}\uFF08${o.type}\uFF09`,targets:[]};let a=this.pvcStartPosition(o),l=this.vec(o.id,"o",[0,0,0]),c=d=>{let f=(o.inputs||{})[d];if(!f)return null;if(f.node===void 0)return"\u30AB\u30FC\u30D6";let m=this.byId.get(f.node);return m?`${m.name}.${f.attr}`:"?"},h={};for(let d of["crp","crt","ps"]){let f=c(d);h[d]=f||(d==="ps"?"\uFF08\u63A5\u7D9A\u306A\u3057\uFF09":`\uFF08\u63A5\u7D9A\u306A\u3057: ${this.vec(o.id,d).map(m=>Math.round(m*1e4)/1e4).join(", ")}\uFF09`)}let u=(o.targets||[]).map(d=>{let f=this.byId.get(d.node);if(!f||f.dag<0)return null;let m=f.dag,x=this.pvcTargetPosition(o,{index:d.index,ni:m});return{name:this.sceneNodes[m].name,weight:this.num(o.id,`tg[${d.index}].tw`,1),position:x.toArray().map(g=>Math.round(g*1e4)/1e4),drift:this.parentDrift(m,e,n,!0)}}).filter(Boolean);return{via:o.name,start:a?a.toArray().map(d=>Math.round(d*1e4)/1e4):null,startInputs:h,offset:l.some(d=>Math.abs(d)>1e-9)?l:null,targets:u}}chainCycle(t){let e=new Set(t.ik.chain.slice(0,-1)),n=/^(pm|pim|parentMatrix|parentInverseMatrix)(\[\d+\])?$/,i=/^(wm|wim|worldMatrix|worldInverseMatrix|xm|xformMatrix|wp|worldPosition)(\[\d+\])?/,r=/^(r[xyz]?|rotate[XYZ]?|m|matrix)$/,o=c=>{let h=new Set,u=[...c];for(;u.length;){let[d,f]=u.pop(),m=`${d}${f}`;if(f===void 0||f<0||h.has(m))continue;if(h.add(m),d==="w"){for(let g=f;g>=0;g=this.sceneNodes[g].parent){if(e.has(g))return this.sceneNodes[g].name;u.push(["c",g])}continue}let x=d==="c"?this.dagGraph.get(f):this.byId.get(f);if(x)for(let g of Object.values(x.inputs||{})){if(g.node===void 0||g.node===x.id)continue;let p=this.byId.get(g.node);if(!p)continue;if(p.dag<0){u.push(["g",p.id]);continue}let v=String(g.attr||"");if(n.test(v))u.push(["w",this.sceneNodes[p.dag].parent]);else if(i.test(v))u.push(["w",p.dag]);else{if(r.test(v)&&e.has(p.dag))return this.sceneNodes[p.dag].name;u.push(["c",p.dag])}}}return null},a=t.inputs||{},l=c=>c.filter(h=>a[h]&&a[h].node!==void 0).map(h=>{let u=this.byId.get(a[h].node);return u&&u.dag>=0?["c",u.dag]:["g",a[h].node]});return{pole:o(l(["pv","pvx","pvy","pvz"])),handle:o([["w",this.sceneNodes[t.dag].parent],...l(["t","tx","ty","tz"])]),twist:o(l(["twi"]))}}tryAimModes(t,e,n){if(!e||!e.targets||e.targets.length!==1||!e.start||!n||!n.impliedPv||!(e.targets[0].drift&&e.targets[0].drift.unchecked||[]).some(h=>h.by.some(u=>u.from.some(d=>d.endsWith("\uFF08aimConstraint\uFF09")))))return null;let r=new A(...e.start).add(new A(...n.impliedPv)),o=this.byId.get((t.inputs.pv||t.inputs.pvx||t.inputs.pvy||t.inputs.pvz).node),a=o.targets.find(h=>this.byId.get(h.node)&&this.byId.get(h.node).dag>=0),l=this.byId.get(a.node).dag,c=[];for(let[h,u]of Zv){this.aimMode=h,this.reset();let d=this.pvcTargetPosition(o,{index:a.index,ni:l});c.push({mode:h,label:u,distance:Math.round(d.distanceTo(r)*1e4)/1e4})}return this.aimMode=null,this.reset(),c}verifySaved(t,e=.5){let n=[];for(let i of this.graph){if(!i.ik)continue;let r=this.compareChain(i,t,e),o=this.parentDrift(i.ik.chain[0],t,e),a=i.ik.solver==="ikRPsolver"?this.poleTargets(i,t,e):null,l=null;if(r.error>e&&r.joints.length){for(let h of jv[i.ik.solver]||[]){this.ikVariant=h,this.reset();let u=this.compareChain(i,t,e);(!l||u.error<l.error-1e-6)&&(l={variant:h,label:Kv(h),error:u.error})}this.ikVariant=null,this.reset()}let c=i.ik.solver==="ikRPsolver"?this.pvWorld(this.vec(i.id,"pv",[0,0,1]),i.dag,i.ik.chain[0]).toArray():null;a&&(a.aimModes=this.tryAimModes(i,a,r.detail)),n.push({handle:i.name,solver:i.ik.solver,chain:i.ik.chain.map(h=>this.sceneNodes[h].name),pv:c,twist:this.num(i.id,"twi",0)*ge,joints:r.joints,reach:r.reach,poleError:r.poleError,parent:o,detail:r.detail,poleTargets:a,cycle:this.chainCycle(i),error:r.error,best:l,ok:r.joints.every(h=>h.ok)})}return n}isScaleOf(t){let e=this.rest(t);return!e||!e.joint?null:(e.isNode??-1)>=0&&this.rest(e.isNode)?this.chan(e.isNode,"fk").s:e.isScale||null}driversOf(t){let e=this.fallback.get(t);if(e){let r=e.anchor>=0?this.sceneNodes[e.anchor].name:"\u30EF\u30FC\u30EB\u30C9";return[`\u63A8\u5B9A: ${(e.unresolved||[]).join("\u30FB")||"\u89AA\u306E\u4F4D\u7F6E"} \u3092\u6C42\u3081\u3089\u308C\u306A\u3044\u305F\u3081\u3001${r} \u304B\u3089\u306E\u76F8\u5BFE\u3092\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u5F62\u3067\u8868\u793A`]}let n=this.tainted.has(t)?["\u4E0D\u660E: \u672A\u5BFE\u5FDC\u306E\u30CE\u30FC\u30C9\u306E\u5F71\u97FF\u3067\u5024\u3092\u6C42\u3081\u3089\u308C\u307E\u305B\u3093\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u30FB\u65E2\u5B9A\u5024\u306E\u307E\u307E\uFF09"]:[],i=this.dagGraph.get(t);if(i&&i.inputs)for(let[r,o]of Object.entries(i.inputs)){if(!Bd.test(r)||o.curve!==void 0)continue;let a=this.byId.get(o.node);a&&n.push(`${r} \u2190 ${a.name}\uFF08${a.type}\uFF09`)}if(this.ikJoint.has(t)){let r=this.byId.get(this.ikJoint.get(t));n.push(`r \u2190 ${r.name}\uFF08IK\uFF09`)}return n}};function Jt(s,t,e){let n={[s]:t};return e.forEach((i,r)=>{n[s+i]=t[r]}),n}var en=s=>document.getElementById(s);var Ls=s=>Number.isInteger(s)?String(s):s.toFixed(2),sa=class{constructor(t){if(this.app=t,this.clip=null,this.status="",this.keys=[],this.root=en("timeline"),!this.root)return;this.slider=en("tl-slider"),this.canvas=en("tl-keys");let e=(i,r,o)=>{let a=en(i);a&&a.addEventListener(r,o)};e("tl-play","click",()=>t.togglePlay()),e("tl-prev","click",()=>t.stepFrame(-1)),e("tl-next","click",()=>t.stepFrame(1)),e("tl-prev-key","click",()=>t.stepKey(-1)),e("tl-next-key","click",()=>t.stepKey(1)),e("tl-first","click",()=>t.goToEdge(-1)),e("tl-last","click",()=>t.goToEdge(1)),this.slider.addEventListener("input",()=>t.scrubTo(+this.slider.value)),e("tl-frame","change",i=>{let r=+i.target.value;Number.isFinite(r)?t.scrubTo(r):this.setFrame(t.frame)});let n=()=>t.setPlaybackRange(+en("tl-start").value,+en("tl-end").value);e("tl-start","change",n),e("tl-end","change",n);for(let i of["tl-frame","tl-start","tl-end"])e(i,"keydown",r=>{r.key==="Enter"&&r.target.blur()});new ResizeObserver(()=>this.drawKeys()).observe(this.slider)}setStatus(t){this.root&&(this.status=t||"",en("tl-status").textContent=this.status,this.updateVisibility())}setClip(t){if(this.root){this.clip=t,t&&(this.status="",en("tl-status").textContent="",this.setRange(t.start,t.end),en("tl-info").textContent=`${Ls(t.fps)} fps`,en("tl-info").title=`\u6642\u9593\u5358\u4F4D: ${t.raw.timeUnit||"?"}\uFF08\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u7BC4\u56F2 ${Ls(+t.raw.animStart)}\u301C${Ls(+t.raw.animEnd)}\uFF09`,this.setFrame(t.current)),this.root.classList.toggle("loading",!t);for(let e of this.root.querySelectorAll("button, input"))e.disabled=!t;this.updateVisibility()}}updateVisibility(){let t=!!(this.clip||this.status);this.root.hidden=!t,document.getElementById("viewport").classList.toggle("has-timeline",t),t&&this.drawKeys()}setRange(t,e){this.slider.min=String(t),this.slider.max=String(e),en("tl-start").value=Ls(t),en("tl-end").value=Ls(e),this.drawKeys()}setFrame(t){if(!this.root)return;this.slider.value=String(t);let e=en("tl-frame");document.activeElement!==e&&(e.value=Ls(t))}setPlaying(t){let e=en("tl-play");e&&(e.setAttribute("aria-pressed",t?"true":"false"),e.title=t?"\u505C\u6B62\uFF08Alt+V\uFF09":"\u518D\u751F\uFF08Alt+V\uFF09",e.setAttribute("aria-label",t?"\u505C\u6B62":"\u518D\u751F"),e.querySelector(".ic-play").style.display=t?"none":"",e.querySelector(".ic-pause").style.display=t?"":"none")}setKeys(t,e){this.keys=t||[],this.canvas&&(this.canvas.title=e||""),this.drawKeys()}drawKeys(){let t=this.canvas;if(!t||!this.clip||this.root.hidden)return;let e=t.clientWidth,n=t.clientHeight;if(!e||!n)return;let i=window.devicePixelRatio||1;(t.width!==Math.round(e*i)||t.height!==Math.round(n*i))&&(t.width=Math.round(e*i),t.height=Math.round(n*i));let r=t.getContext("2d");r.setTransform(i,0,0,i,0,0),r.clearRect(0,0,e,n);let o=this.clip.start,a=this.clip.end,l=Math.max(a-o,1e-9),c=u=>7+(u-o)/l*(e-2*7),h=[1,2,5,10,20,50,100,200,500,1e3].find(u=>(e-2*7)/(l/u)>=6)||1e3;r.fillStyle="rgba(142, 151, 161, 0.35)";for(let u=Math.ceil(o/h)*h;u<=a;u+=h)r.fillRect(Math.round(c(u)),n-4,1,4);r.fillStyle="#e5675b";for(let u of this.keys)u<o-1e-6||u>a+1e-6||r.fillRect(Math.round(c(u))-1,0,2,n)}};var Jv=new wt(13883872),Qv=new wt(8423053),t_=new wt(15903035),e_=16;function n_(s){let t=ea(s.cc);if(!t)return null;if(!s.tweaks||!s.tweaks.length)return t;let e=t.cvs.map(n=>n.clone());for(let[n,i,r,o]of s.tweaks)e[n]&&e[n].add(new A(i,r,o));return oi(t,e)}function Zd(s,t=[]){if(t.length=0,s.degree===1){for(let r of s.cvs)t.push(r.clone());return t}let[e,n]=Cs(s),i=Math.max(8,(s.cvs.length-s.degree)*e_);for(let r=0;r<=i;r++)t.push(yr(s,e+(n-e)*(r/i)));return t}function jd(s){let t=new Float32Array(s.length*3);return s.forEach((e,n)=>{t[n*3]=e.x,t[n*3+1]=e.y,t[n*3+2]=e.z}),t}var ra=class{constructor(){this.items=[],this.byNode=new Map,this.visible=!0,this.hiddenNodes=null,this.selected=-1}clear(){for(let t of this.items)t.line.removeFromParent(),t.line.geometry.dispose(),t.line.material.dispose();this.items=[],this.byNode=new Map,this.selected=-1}build(t,e){this.clear(),(e||[]).forEach((n,i)=>{let r=n_(n),o=t.nodeObjects[n.transform];if(!r||!o)return;let a=new ne;a.setAttribute("position",new zt(jd(Zd(r)),3));let l=n.display===1?Qv:n.color?new wt().setRGB(n.color[0],n.color[1],n.color[2]):Jv,c=new tn(a,new Qe({color:l}));c.name=n.name,c.userData={curveIndex:i,nodeIndex:n.transform},c.matrixAutoUpdate=!1,o.add(c);let h={entry:n,line:c,base:r,color:l,node:n.transform,selfVisible:n.visibleSelf??n.visible!==!1};this.items[i]=h,this.byNode.has(n.transform)||this.byNode.set(n.transform,[]),this.byNode.get(n.transform).push(i)}),t.curveItems=this.items,this.apply()}setShape(t,e){let n=this.items[t];if(!n)return;let i=e&&e.isCurve?e:n.base;if(n.current===i)return;n.current=i;let r=jd(Zd(i)),o=n.line.geometry.getAttribute("position");o.array.length===r.length?(o.array.set(r),o.needsUpdate=!0):n.line.geometry.setAttribute("position",new zt(r,3)),n.line.geometry.boundingSphere=null}setVisible(t){this.visible=t,this.apply()}setHiddenNodes(t){this.hiddenNodes=t,this.apply()}setSelected(t){this.selected=t,this.apply()}hasCurve(t){return this.byNode.has(t)}isShown(t){return this.visible&&t.selfVisible&&!(this.hiddenNodes&&this.hiddenNodes[t.node])}apply(){for(let t of this.items)t&&(t.line.visible=this.isShown(t),t.line.material.color.copy(t.node===this.selected?t_:t.color))}expandBox(t,e=null){for(let n of this.items){if(!n||!n.line.visible||e&&!e.has(n.node))continue;let i=n.line.geometry.getAttribute("position"),r=Math.max(1,Math.floor(i.count/16));for(let o=0;o<i.count;o+=r)t.expandByPoint(i_.fromBufferAttribute(i,o).applyMatrix4(n.line.matrixWorld))}return t}pick(t,e,n=()=>!0){let i=this.items.filter(a=>a&&a.line.visible&&n(a.entry)).map(a=>a.line);if(!i.length)return{node:-1,distance:1/0};let r=t.params.Line.threshold;t.params.Line.threshold=e;let o=t.intersectObjects(i,!1);return t.params.Line.threshold=r,o.length?{node:o[0].object.userData.nodeIndex,distance:o[0].distance}:{node:-1,distance:1/0}}},i_=new A;var Kd=25.4;function cc(s,t=null){let e=t||{},n=(i,r)=>typeof e[i]=="number"?e[i]:s[r];return{fl:Math.max(n("fl","focalLength"),.001),hfa:Math.max(n("hfa","horizontalFilmAperture"),1e-6),vfa:Math.max(n("vfa","verticalFilmAperture"),1e-6),hfo:n("hfo","horizontalFilmOffset")||0,vfo:n("vfo","verticalFilmOffset")||0,lsr:n("lsr","lensSqueezeRatio")||1,cs:n("cs","cameraScale")||1,ow:Math.max(n("ow","orthographicWidth"),1e-6),near:Math.max(n("ncp","nearClipPlane"),1e-4),far:n("fcp","farClipPlane"),fit:s.filmFit??1,ortho:!!s.orthographic}}function Jd(s,t,e,n,i=1.06){let r=s.hfa*s.lsr,o=s.vfa,a=r/o,l=n>0?n:a,h=s.fit===1||s.fit===0&&l>=a||s.fit===3&&l<a?r:o*l,u=h/l,d=Math.max(t,1)/Math.max(e,1),f,m;d>l?(m=u*i,f=m*d):(f=h*i,m=f/d);let x=s.hfo,g=s.vfo,p=s.ortho?s.ow/r*s.cs:s.near*Kd*s.cs/s.fl,v={w:h/f*t,h:u/m*e};return v.x=(t-v.w)/2,v.y=(e-v.h)/2,{ortho:s.ortho,left:(x-f/2)*p,right:(x+f/2)*p,top:(g+m/2)*p,bottom:(g-m/2)*p,near:s.near,far:Math.max(s.far,s.near*2),gate:v}}var oa=class{constructor(){this.items=[],this.material=new Qe({color:12175058,transparent:!0,opacity:.9,depthTest:!0}),this.selectedMaterial=new Qe({color:15903035,transparent:!0,opacity:1,depthTest:!0})}build(t,e,n){this.clear(),(e||[]).forEach((i,r)=>{let o=t.nodeObjects[i.transform];if(!o){this.items[r]=null;return}let a=new ii(s_(cc(i),n),this.material);a.name="__cameraIcon",a.renderOrder=5,a.userData.cameraIndex=r,o.add(a),this.items[r]={line:a,parent:o,node:i.transform}})}clear(){for(let t of this.items)t&&(t.parent.remove(t.line),t.line.geometry.dispose());this.items=[]}update(t,e,n,i){this.items.forEach((r,o)=>{r&&(r.line.visible=t&&o!==n&&!e(r.node),r.line.material=r.node===i?this.selectedMaterial:this.material)})}};function s_(s,t){let e=s.hfa*s.lsr,n=s.vfa,i=t,r,o;s.ortho?(r=i*.45,o=r*(n/e)):(r=Math.min(i*e*Kd/(2*s.fl),i*2),o=r*(n/e));let a=s.ortho?1:0,l=[[-r*a,-o*a,0],[r*a,-o*a,0],[r*a,o*a,0],[-r*a,o*a,0]],c=[[-r,-o,-i],[r,-o,-i],[r,o,-i],[-r,o,-i]],h=[],u=(m,x)=>h.push(...m,...x);for(let m=0;m<4;m++)u(c[m],c[(m+1)%4]),u(l[m],c[m]),s.ortho&&u(l[m],l[(m+1)%4]);let d=[[-r*.5,o*1.08,-i],[r*.5,o*1.08,-i],[0,o*1.6,-i]];u(d[0],d[1]),u(d[1],d[2]),u(d[2],d[0]);let f=new ne;return f.setAttribute("position",new zt(h,3)),f}function la(s,t){let e=null;for(let n of s||[])n.mute||t<n.sequenceStartFrame||t>=n.sequenceEndFrame+1||(!e||n.track<e.track||n.track===e.track&&n.sequenceStartFrame>e.sequenceStartFrame)&&(e=n);return e}function hc(s,t){let e=Math.abs(s.scale)>1e-9?s.scale:1,n=t-s.sequenceStartFrame-(s.preHold||0);if(n<=0)return s.startFrame;let i=(s.endFrame-s.startFrame)*e;return n>=i?s.endFrame:(n/=e,s.startFrame+n)}var le=s=>document.getElementById(s),Qd=s=>String(s).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),ci=s=>Number.isInteger(s)?String(s):s.toFixed(1),aa=class{constructor(t){this.app=t,this.seq=null,le("seq-play").addEventListener("click",()=>t.toggleSequencePlay()),le("seq-first").addEventListener("click",()=>t.setSequenceFrame(this.seq?this.seq.start:0,{follow:!0})),le("seq-prev-shot").addEventListener("click",()=>t.stepShot(-1)),le("seq-next-shot").addEventListener("click",()=>t.stepShot(1)),le("seq-last").addEventListener("click",()=>t.setSequenceFrame(this.seq?this.seq.end:0,{follow:!0})),le("seq-follow").addEventListener("change",o=>t.setSequenceFollow(o.target.checked)),le("seq-frame").addEventListener("change",o=>{let a=parseFloat(o.target.value);Number.isFinite(a)&&t.setSequenceFrame(a,{follow:!0})}),le("seq-collapse").addEventListener("click",()=>this.setCollapsed(!document.body.classList.contains("sequencer-collapsed")));let e=le("seq-lanes"),n=!1,i=o=>{if(!this.seq)return;let a=e.getBoundingClientRect(),l=Math.min(Math.max((o.clientX-a.left)/Math.max(a.width,1),0),.9999);t.setSequenceFrame(Math.floor(this.seq.start+l*this.span()),{follow:!0})};e.addEventListener("pointerdown",o=>{if(o.button===0){n=!0;try{e.setPointerCapture(o.pointerId)}catch{}t.pauseSequence(),i(o)}}),e.addEventListener("pointermove",o=>{n&&i(o)});let r=()=>{n=!1};e.addEventListener("pointerup",r),e.addEventListener("pointercancel",r)}span(){return Math.max(this.seq.end+1-this.seq.start,1)}pct(t){return(t-this.seq.start)/this.span()*100}setCollapsed(t){document.body.classList.toggle("sequencer-collapsed",t),le("seq-collapse").setAttribute("aria-expanded",String(!t)),le("seq-collapse").textContent=t?"\u25BE":"\u25B4",le("seq-collapse").title=t?"\u30AB\u30E1\u30E9\u30B7\u30FC\u30B1\u30F3\u30B5\u3092\u958B\u304F":"\u30AB\u30E1\u30E9\u30B7\u30FC\u30B1\u30F3\u30B5\u3092\u6700\u5C0F\u5316"}build(t,e){this.seq=t&&t.shots&&t.shots.length?t:null,document.body.classList.toggle("has-sequencer",!!this.seq),le("sequencer").hidden=!this.seq;let n=le("seq-rows");if(n.textContent="",!this.seq)return;let i=[...new Set(this.seq.shots.map(o=>o.track))].sort((o,a)=>o-a),r=o=>o>=0&&e[o]?e[o].name:"\uFF08\u30AB\u30E1\u30E9\u306A\u3057\uFF09";for(let o of i){let a=document.createElement("div");a.className="seq-row",a.innerHTML=`<span class="seq-track-label">\u30C8\u30E9\u30C3\u30AF ${o}</span><div class="seq-lane"></div>`;let l=a.lastChild;this.seq.shots.forEach((c,h)=>{if(c.track!==o)return;let u=document.createElement("div");u.className="seq-shot"+(c.mute?" muted":""),u.dataset.shot=String(h),u.style.left=`${this.pct(c.sequenceStartFrame)}%`,u.style.width=`${Math.max(c.sequenceEndFrame+1-c.sequenceStartFrame,.2)/this.span()*100}%`,u.title=`${c.shotName}\uFF08${c.name}\uFF09${c.mute?"\u30FB\u30DF\u30E5\u30FC\u30C8":""}
\u30AB\u30E1\u30E9: ${r(c.camera)}
\u30B7\u30FC\u30B1\u30F3\u30B9 ${ci(c.sequenceStartFrame)}\u301C${ci(c.sequenceEndFrame)}\u30FB\u30B7\u30FC\u30F3 ${ci(c.startFrame)}\u301C${ci(c.endFrame)}`+(c.scale!==1?`\u30FB\u30B9\u30B1\u30FC\u30EB ${c.scale}`:"")+(c.preHold||c.postHold?`\u30FB\u30DB\u30FC\u30EB\u30C9 ${c.preHold||0} / ${c.postHold||0}`:""),u.innerHTML=`<b>${Qd(c.shotName)}</b><span>${Qd(r(c.camera))}</span><span class="seq-range">${ci(c.startFrame)}\u301C${ci(c.endFrame)}</span>`,l.appendChild(u)}),n.appendChild(a)}this.buildRuler(),le("seq-frame").min=String(this.seq.start),le("seq-frame").max=String(this.seq.end)}buildRuler(){let t=le("seq-ruler");t.textContent="";let e=this.span(),n=[1,2,5,10,20,50,100,200,500,1e3].find(i=>e/i<=12)||1e3;for(let i=Math.ceil(this.seq.start/n)*n;i<=this.seq.end;i+=n){let r=document.createElement("span");r.className="seq-tick",r.style.left=`${this.pct(i)}%`,r.textContent=String(i),t.appendChild(r)}}update(t,e,n,i,r){if(!this.seq)return;le("seq-playhead").style.left=`${this.pct(Math.min(Math.max(t,this.seq.start),this.seq.end+.999))}%`,document.activeElement!==le("seq-frame")&&(le("seq-frame").value=ci(t));let o=e?this.seq.shots.indexOf(e):-1;document.querySelectorAll("#seq-rows .seq-shot").forEach(l=>l.classList.toggle("current",+l.dataset.shot===o));let a=e&&e.camera>=0&&n[e.camera]?n[e.camera].name:"";le("seq-shot").textContent=e?`${e.shotName}\u30FB${a||"\u30AB\u30E1\u30E9\u306A\u3057"}\u30FB\u30B7\u30FC\u30F3\u306E\u30D5\u30EC\u30FC\u30E0 ${ci(+hc(e,t).toFixed(2))}`:"\u30B7\u30E7\u30C3\u30C8\u306A\u3057",le("seq-follow").checked=i,le("seq-play").setAttribute("aria-pressed",String(r)),le("seq-play").title=r?"\u505C\u6B62":"\u30B7\u30FC\u30B1\u30F3\u30B9\u3092\u518D\u751F\uFF08\u30B7\u30E7\u30C3\u30C8\u306E\u30AB\u30E1\u30E9\u3068\u30D5\u30EC\u30FC\u30E0\u306B\u5207\u308A\u66FF\u3048\u3066\u518D\u751F\uFF09",le("seq-play").querySelector(".ic-play").style.display=r?"none":"",le("seq-play").querySelector(".ic-pause").style.display=r?"":"none"}};var r_="1.0.0",uc=Math.PI/180,tf={shading:"smooth",wire:!1,skin:!0,joints:!1,xray:!0,grid:!0,curves:!0,axes:"selected",jointSize:1,weightMode:"off",textures:!0,alpha:"material",alphaStyle:"cutout",poseSource:"bind",lighting:"standard",mapView:"combined",maps:{normal:!0,roughness:!1,metalness:!1,ao:!1,emissive:!1,opacity:!1},normalFlipY:!1,tool:"select",space:"local",gizmoSize:1,cameraIcons:!0,cameraGate:!0,hud:!0,pickMode:"object",pickAll:!1},o_=["select","translate","rotate","scale"],Mn=s=>s.toLocaleString("ja-JP"),br=new A,hi=new A,ef=new _t,dc=class{constructor(){this.settings={...tf},this.data=null,this.built=null,this.selected=-1,this.picked=null,this.pose=null,this.maps=new Wo,this.edit=null,this.history=new jo(t=>this.applyPoseChanges(t)),this.history.onChange=t=>this.historyChanged(t),this.poseDirty=!1,this.gizmoDragging=!1,this.bridge=null,this.transfer=null,this.sceneRadius=50,this.clip=null,this.frame=0,this.playing=!1,this.sceneLoading=!1,this.pendingAnimation=null,this.poseSourceChosen=!1,this.cameras=[],this.viewCamera=-1,this.camEdit=null,this.freeTarget=null,this.cameraProps=new Map,this.sequence=null,this.seqFrame=0,this.seqFollow=!1,this.seqPlaying=!1,this.fpsMeter=null,this.ui=new Yo(this),this.timeline=new sa(this),this.seqPanel=new aa(this),this.ui.setHost(Zo()?"qt":"browser"),this.ui.syncSettings(this.settings);try{this.initRenderer()}catch(t){this.renderer=null,this.ui.setEmpty(!1),this.ui.showError(`WebGL \u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
GPU \u30C9\u30E9\u30A4\u30D0\u3092\u66F4\u65B0\u3059\u308B\u304B\u3001\u74B0\u5883\u5909\u6570 QTWEBENGINE_CHROMIUM_FLAGS \u306B --ignore-gpu-blocklist \u3092\u6307\u5B9A\u3057\u3066\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002

`+String(t&&t.message||t))}this.bindEvents(),bd(t=>{this.bridge=t,t.jsReady&&t.jsReady(),this.historyChanged(this.history),this.onWarningsChanged(this.ui.warnings||[])})}initRenderer(){let t=document.getElementById("canvas");this.canvas=t,this.renderer=new Ys({canvas:t,antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setClearColor(0,0),this.scene=new vo,this.camera=new Be(35,1,.1,1e4),this.camera.position.set(28,21,28),this.scene.add(this.camera),this.scene.add(new To(15002866,3880497,1.7));let e=new Co(16777215,2);e.position.set(.4,.8,1),e.target.position.set(0,0,-1),this.camera.add(e,e.target),this.keyLight=e,this.viewPersp=new Be,this.viewOrtho=new ps,this.scene.add(this.viewPersp,this.viewOrtho),this.cameraIcons=new oa,this.grid=null,this.updateGrid(new Ye(new A(-10,0,-10),new A(10,10,10))),this.controls=new Uo(this.camera,t),this.controls.mouseButtons={LEFT:_n.ROTATE,MIDDLE:_n.PAN,RIGHT:_n.DOLLY},this.controls.screenSpacePanning=!0,this.controls.enableDamping=!1,this.controls.zoomSpeed=1.2,this.controls.addEventListener("change",()=>{this.beginCameraEdit(),this.requestRender()}),this.controls.addEventListener("start",()=>this.prepareCameraEdit()),this.poseFrame=new he,this.poseFrame.name="__poseFrame",this.poseFrame.matrixAutoUpdate=!1,this.poseProxy=new he,this.poseProxy.name="__poseProxy",this.poseFrame.add(this.poseProxy),this.scene.add(this.poseFrame),this.gizmo=new Bo(this.camera,t),this.gizmo.setSpace("local"),this.gizmo.setSize(tf.gizmoSize),this.gizmo.addEventListener("change",()=>this.requestRender()),this.gizmo.addEventListener("dragging-changed",r=>{this.gizmoDragging=r.value,this.controls.enabled=!r.value&&this.canNavigate(),r.value?this.beginPoseEdit([this.selected],{translate:"\u79FB\u52D5",rotate:"\u56DE\u8EE2",scale:"\u30B9\u30B1\u30FC\u30EB"}[this.gizmo.mode]||"\u5909\u66F4"):(this.endPoseEdit(),this.syncGizmo())}),this.gizmo.addEventListener("objectChange",()=>this.onGizmoChange()),this.scene.add(this.gizmo),this.overlay=new Xo,this.curves=new ra,this.scene.add(this.overlay.group);let n=new ne;n.setAttribute("position",new zt([0,0,0],3)),this.marker=new bo(n,new Ks({color:15903035,size:10,sizeAttenuation:!1,depthTest:!1,transparent:!0})),this.marker.renderOrder=20,this.marker.visible=!1,this.marker.frustumCulled=!1,this.scene.add(this.marker),this.raycaster=new vs;let i=document.getElementById("viewport");new ResizeObserver(()=>this.resize()).observe(i),this.resize()}resize(){if(!this.renderer)return;let t=document.getElementById("viewport"),e=Math.max(1,t.clientWidth),n=Math.max(1,t.clientHeight);this.renderer.setSize(e,n,!1),this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.render()}requestRender(){this.renderPending||!this.renderer||(this.renderPending=!0,requestAnimationFrame(()=>{this.renderPending=!1,this.render()}))}render(){this.renderer&&(this.viewCamera>=0&&this.syncViewCamera(),this.renderer.render(this.scene,this.activeCamera()))}activeCamera(){if(this.viewCamera<0)return this.camera;let t=this.cameras[this.viewCamera];return t&&t.orthographic?this.viewOrtho:this.viewPersp}bindEvents(){if(this.canvas){let t=null;this.canvas.addEventListener("pointerdown",e=>{let n=!!(this.gizmo&&this.gizmo.object&&this.gizmo.axis!==null);t={x:e.clientX,y:e.clientY,b:e.button,onGizmo:n}}),this.canvas.addEventListener("pointerup",e=>{t&&!t.onGizmo&&!this.gizmoDragging&&t.b===0&&e.button===0&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<5&&this.pick(e),t=null}),this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}window.addEventListener("keydown",t=>{let e=t.target;if(e&&(e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"))return;let n=t.key.toLowerCase();if((t.ctrlKey||t.metaKey)&&!t.altKey){if(n==="h"&&!t.shiftKey)this.setNodeVisible(this.selected,!1);else if(n==="z"&&!t.shiftKey)this.undo();else if(n==="y"||n==="z"&&t.shiftKey)this.redo();else return;t.preventDefault();return}if(t.altKey&&!t.ctrlKey&&!t.metaKey&&this.hasTimeline){if(t.code==="KeyV")this.togglePlay();else if(t.code==="Comma")this.stepFrame(-1);else if(t.code==="Period")this.stepFrame(1);else return;t.preventDefault();return}if(t.ctrlKey||t.metaKey||t.altKey)return;if(this.hasTimeline&&(n===","||n==="."||n==="home"||n==="end")){n===","?this.stepKey(-1):n==="."?this.stepKey(1):this.goToEdge(n==="home"?-1:1),t.preventDefault();return}if(n==="h"){t.shiftKey?this.setNodeVisible(this.selected,!0):this.toggleNodeVisible(this.selected),t.preventDefault();return}if(n==="z"){t.shiftKey?this.redo():this.undo(),t.preventDefault();return}let i=(r,o)=>{this.setSetting(r,o),this.ui.syncSettings(this.settings)};if(n==="f")this.frameSelection();else if(n==="a")this.frameAll();else if(n==="escape")this.clearSelection();else if(n==="4")i("shading","none");else if(n==="5")i("shading","smooth"),i("textures",!1);else if(n==="6")i("shading","smooth"),i("textures",!0);else if(n==="j")i("joints",!this.settings.joints);else if(n==="b")this.togglePoseSource();else if(n==="f8")i("pickMode",this.settings.pickMode==="vertex"?"object":"vertex");else if(n==="c")this.cameras.length?this.setCamera(t.shiftKey?-1:this.nextCamera()):this.ui.setMessage("\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F\u30AB\u30E1\u30E9\u304C\u3042\u308A\u307E\u305B\u3093");else if(n==="q")i("tool","select");else if(n==="w")i("tool","translate");else if(n==="e")i("tool","rotate");else if(n==="r")i("tool","scale");else if(n==="+"||n==="="||n===";")i("gizmoSize",Math.min(4,this.settings.gizmoSize*1.25));else if(n==="-")i("gizmoSize",Math.max(.25,this.settings.gizmoSize/1.25));else return;t.preventDefault()}),Zo()||(document.addEventListener("dragover",t=>{t.preventDefault(),document.body.classList.add("drag-over")}),document.addEventListener("dragleave",t=>{t.relatedTarget||document.body.classList.remove("drag-over")}),document.addEventListener("drop",t=>{t.preventDefault(),document.body.classList.remove("drag-over");let e=t.dataTransfer.files&&t.dataTransfer.files[0];e&&this.loadFile(e)})),window.addEventListener("error",t=>this.ui.setMessage("\u30A8\u30E9\u30FC: "+t.message,8e3))}log(t,e){this.bridge&&this.bridge.log&&this.bridge.log(t,String(e))}loadFile(t){if(/\.(ma|mb)$/i.test(t.name)){this.ui.showError(`${t.name} \u306F\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u76F4\u63A5\u8AAD\u3081\u307E\u305B\u3093\u3002
python -m ma_viewer export \u3067JSON\u306B\u5909\u63DB\u3059\u308B\u304B\u3001Qt\u7248\u306E\u30D3\u30E5\u30FC\u30A2\uFF08python -m ma_viewer\uFF09\u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002`);return}this.ui.showLoading(`${t.name} \u3092\u8AAD\u307F\u8FBC\u307F\u4E2D`);let e=new FileReader;e.onload=()=>{try{let n=JSON.parse(e.result);n.source&&!n.source.name&&(n.source.name=t.name),setTimeout(()=>this.loadScene(n),0)}catch(n){this.ui.hideLoading(),this.ui.showError(`${t.name} \u3092 JSON \u3068\u3057\u3066\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
${n.message}`)}},e.readAsText(t)}loadScene(t){if(this.sceneLoading=!1,!this.renderer)return!1;let e=performance.now();this.pause();try{Ql(t),this.clearScene();let n=performance.now(),i=ld(t),r=performance.now()-n;this.scene.add(i.root),this.data=t,this.built=i;let o=[],a=performance.now(),l=w=>{let M=performance.now();o.push([w,M-a]),a=M};this.pose=new Vo(i,t),this.edit=null,this.history.clear(),this.poseSourceChosen=!1,ec(i,this.settings.poseSource),this.pose.reapplyAll(),i.root.updateMatrixWorld(!0),this.curves.build(i,t.curves),this.initVisibility(),l("\u59FF\u52E2");let c=pr(i,!0);this.sceneRadius=Math.max(c.getSize(br).length()/2,.001),l("\u7BC4\u56F2"),this.overlay.build(i,t.nodes,this.sceneRadius),this.cameras=t.cameras||[],this.cameraIcons.build(i,this.cameras,Math.max(this.sceneRadius*.3,1)),this.ui.setCameras(this.cameras),this.updateGrid(c),l("\u30B8\u30E7\u30A4\u30F3\u30C8"),this.ui.populate(t,i),this.updateVisibility(),l("\u4E00\u89A7"),this.applyAll(),l("\u8868\u793A\u8A2D\u5B9A");let h=(t.warnings||[]).slice();for(let w of i.meshes){if(!w.skin)continue;let M=w.skin.stats;if(M.overMax&&h.push(`${w.name}: 9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u304C ${Mn(M.overMax)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u8868\u793A\u306F\u4E0A\u4F4D 8 \u3064\uFF09\u3002`),M.unnormalized&&h.push(`${w.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9\u304C ${Mn(M.unnormalized)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u6642\u306B\u5408\u8A08\u3067\u5272\u3063\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF09\u3002`),M.zero){let S=w.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2";h.push(`${w.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u9802\u70B9\u304C ${Mn(M.zero)} \u500B\u3042\u308A\u307E\u3059\u3002${w.data.skin.cluster} \u306E\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${S}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002`)}}this.ui.setWarnings(h);let u=t.source||{},d=u.name||(u.path?String(u.path).split(/[\\/]/).pop():"")||(u.kind==="maya"?"Maya \u30B7\u30FC\u30F3":"");this.sceneName=d,this.updateTitle(),this.ui.setFile(d||"\uFF08\u540D\u524D\u306A\u3057\uFF09");let f=i.meshes.reduce((w,M)=>w+M.triCount,0),m=i.meshes.reduce((w,M)=>w+M.vertexCount,0),x=this.curves.items.filter(Boolean).length;this.ui.setStats(`\u30E1\u30C3\u30B7\u30E5 ${Mn(i.meshes.length)} \u30FB \u9802\u70B9 ${Mn(m)} \u30FB \u4E09\u89D2\u5F62 ${Mn(f)} \u30FB \u30B8\u30E7\u30A4\u30F3\u30C8 ${Mn(i.jointIndices.length)}`+(x?` \u30FB \u30AB\u30FC\u30D6 ${Mn(x)}`:"")+(this.cameras.length?` \u30FB \u30AB\u30E1\u30E9 ${Mn(this.cameras.length)}`:"")),this.ui.setEmpty(!1),this.ui.hideError(),this.ui.hideLoading(),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.frameAll(!0);let g=t.viewCamera??-1;g>=0&&g<this.cameras.length&&this.setCamera(g,{quiet:!0}),this.sequence=t.sequencer&&(t.sequencer.shots||[]).length?t.sequencer:null,this.seqFrame=this.sequence?this.sequence.start:0,this.seqFollow=!1,this.seqPanel.build(this.sequence,this.cameras),this.updateSequencePanel(),this.fpsMeter=null,this.updateHud(),this.maps.reset(t),this.requestMaps(),l("\u30DE\u30C6\u30EA\u30A2\u30EB");let p=performance.now();this.ui.setMessage(`\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08${Math.round(performance.now()-e)} ms\uFF09`+(this.viewCamera>=0?`\u3002Maya \u306E\u30D3\u30E5\u30FC\u3068\u540C\u3058\u304F\u3001\u30AB\u30E1\u30E9 ${this.cameras[this.viewCamera].name} \u304B\u3089\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF08Shift+C \u3067\u81EA\u7531\u8996\u70B9\uFF09`:""),6e3),this.log("info",`scene loaded: ${i.meshes.length} meshes, ${i.jointIndices.length} joints`);let v=this.timing||{},y=n+r;requestAnimationFrame(()=>requestAnimationFrame(()=>{let w=M=>`${Math.round(M)} ms`;o.push(["\u6700\u521D\u306E\u63CF\u753B",performance.now()-p]),this.lastTiming={transfer:v.transfer||0,parse:v.parse||0,build:r,setup:performance.now()-y,setupParts:Object.fromEntries(o)},this.log("info",`\u8AAD\u307F\u8FBC\u307F\u306E\u5185\u8A33\uFF08\u30D3\u30E5\u30FC\u30A2\uFF09: \u53D7\u3051\u6E21\u3057 ${w(this.lastTiming.transfer)}\u30FBJSON \u306E\u89E3\u91C8 ${w(this.lastTiming.parse)}\u30FB\u30B7\u30FC\u30F3\u306E\u7D44\u307F\u7ACB\u3066 ${w(r)}\u30FB\u753B\u9762\u306E\u6E96\u5099\u3068\u6700\u521D\u306E\u63CF\u753B ${w(this.lastTiming.setup)}\uFF08${o.map(([M,S])=>`${M} ${w(S)}`).join("\u30FB")}\uFF09`),this.timing=null}));let b=this.pendingAnimation||t.animation;return this.pendingAnimation=null,b&&this.setAnimation(b),this.updateToolbarHints(),!0}catch(n){return this.ui.hideLoading(),this.ui.showError(`\u30B7\u30FC\u30F3\u3092\u8868\u793A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+(n&&n.message||n)),this.log("error",n&&n.stack||n),!1}}clearScene(){this.pauseSequence(),this.sequence=null,this.seqFollow=!1,this.seqPanel&&this.seqPanel.build(null,[]),this.setCamera(-1,{quiet:!0}),this.cameraIcons.clear(),this.cameras=[],this.cameraProps=new Map,this.textureToken=(this.textureToken||0)+1,this.maps&&this.maps.reset(null),this.built&&ud(this.built),this.built=null,this.data=null,this.overlay.clear(),this.curves.clear(),this.gizmo&&this.gizmo.detach(),this.pose=null,this.edit=null,this.history.clear(),this.selected=-1,this.picked=null,this.marker&&(this.marker.visible=!1),this.pause(),this.clip=null,this.rig=null,this.rigCurves=null,this.timeline.setClip(null)}clearAll(){this.pendingAnimation=null,this.clearScene(),this.timeline.setStatus(""),this.ui.populate({nodes:[],meshes:[]},{childrenOf:[],meshes:[]}),this.ui.setWarnings([]),this.ui.setTitle(""),this.ui.setFile("\u30D5\u30A1\u30A4\u30EB\u672A\u8AAD\u307F\u8FBC\u307F"),this.ui.setStats(""),this.ui.setEmpty(!0),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.ui.setLegend("off"),this.ui.setCameras([]),this.updateHud(),this.updateToolbarHints(),this.requestRender()}updateTitle(){let t=this.sceneName||"";this.built&&Gn(this.built)&&(t+=this.settings.poseSource==="bind"?"\uFF08\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\uFF09":"\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\uFF09"),this.ui.setTitle(t)}updateGrid(t){this.grid&&(this.scene.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose());let e=Math.max(Math.abs(t.min.x),Math.abs(t.max.x),Math.abs(t.min.z),Math.abs(t.max.z),.001),n=l_(e*2.4);this.grid=a_(n,20),this.grid.material.depthWrite=!1,this.grid.renderOrder=-1,this.grid.visible=!!this.settings.grid,this.scene.add(this.grid)}setSetting(t,e){if(!(t==="tool"&&!o_.includes(e))){if(this.settings[t]=e,t==="gizmoSize"&&this.gizmo&&this.gizmo.setSize(e),t==="space"&&this.gizmo&&this.gizmo.setSpace(e),t==="grid"&&this.grid&&(this.grid.visible=!!e),this.ui.syncSettings(this.settings),this.updateToolbarHints(),!this.built){this.requestRender();return}switch(t){case"tool":case"space":this.updateGizmo();break;case"shading":case"wire":this.applyShading(),this.applyWeights();break;case"skin":this.applyShading(),this.poseDirty=!0,this.updateMarker(),this.picked&&this.ui.showVertexInfo(this.vertexInfo());break;case"joints":this.overlay.setVisible(e);break;case"cameraIcons":this.updateCameraIcons();break;case"hud":this.updateHud();break;case"pickMode":e!=="vertex"&&this.picked&&(this.picked=null,this.marker.visible=!1),this.ui.showVertexInfo(this.vertexInfo(),e);break;case"cameraGate":this.updateGate();break;case"curves":this.curves.setVisible(e);break;case"xray":this.overlay.setXray(e);break;case"axes":this.overlay.setAxesMode(e);break;case"jointSize":this.overlay.setSize(e);break;case"weightMode":this.applyWeights();break;case"textures":case"alpha":case"alphaStyle":case"lighting":case"mapView":case"maps":case"normalFlipY":this.requestMaps();break;case"poseSource":ec(this.built,e),this.pose.reapplyAll(),this.afterPoseChange(),this.updateTitle();break;default:break}this.requestRender()}}applyAll(){let t=this.settings;this.overlay.setVisible(t.joints),this.curves.setVisible(t.curves),this.overlay.setXray(t.xray),this.overlay.setAxesMode(t.axes),this.overlay.setSize(t.jointSize),this.applyShading(),this.applyWeights(),this.requestRender()}applyShading(){let t=this.settings,e=new Set;this.selected>=0&&this.data&&(e.add(this.selected),this.data.nodes.forEach((i,r)=>{e.has(i.parent)&&e.add(r)}));let n=t.weightMode!=="off"&&t.shading==="none";for(let i of this.built.meshes){let r=t.skin&&!!i.skinned,o=i.visible&&t.shading!=="none",a=i.visible&&e.has(i.transform)&&!n,l=i.visible&&(t.wire||t.shading==="none"||a);i.staticMesh.visible=o&&!r,i.skinned&&(i.skinned.visible=o&&r),i.staticWire.visible=l&&!r,i.skinnedWire&&(i.skinnedWire.visible=l&&r);let c=t.shading==="none";i.wireMaterial.opacity=a?.9:c?.95:.5,i.wireMaterial.color.set(a?15903035:c?13161178:1908772)}}applyWeights(){let t=this.settings.weightMode,e=t!=="off";for(let n of this.built.meshes){let i=e&&this.settings.shading==="none";if(n.wireMaterial.vertexColors!==i&&(n.wireMaterial.vertexColors=i,n.wireMaterial.needsUpdate=!0),i&&n.wireMaterial.color.set(16777215),!e)continue;let r=new Float32Array(n.vertexCount*3);if(!n.skin)nd(r,.42,.43,.45);else if(t==="selected"){let o=this.selected>=0?n.data.skin.influences.indexOf(this.selected):-1;td(r,n.skin,o,n.vertexCount)}else ed(r,n.skin,n.data.skin.influences,n.vertexCount);hd(n,r)}this.applyMaterials(),this.ui.setLegend(t,this.selected>=0&&this.data?this.data.nodes[this.selected].name:null)}applyMaterials(){if(!this.built)return;let t=this.settings,e=t.weightMode!=="off",n=t.mapView||"combined",i=t.lighting==="flat"||n!=="combined",r=t.shading==="flat",o=this.maps,a=t.textures&&!e,l=(h,u,d)=>{let f=h.maps[u];return a&&f?o.texture(f.key,_d(u,f.channel,d)):null},c=(h,u)=>h.setRGB(u,u,u,ve);for(let h of this.built.allMaterials){let u=h.userData,d=l(u,"baseColor",!1),f=u.maps.baseColor&&u.maps.baseColor.key,x=!!(d&&o.hasAlpha(f))&&t.alpha!=="none"&&(t.alpha==="all"||u.useAlpha),g=t.maps.opacity?l(u,"opacity",!1):null,p=!!(x||g),v=p&&t.alphaStyle==="cutout",y=p&&t.alphaStyle==="blend",b=v?.5:y?.01:0,w=S=>{e||d?S.set(16777215):t.textures&&u.isMaya?S.copy(u.baseColor):S.set(dr)};w(h.color),h.map=d,h.normalMap=t.maps.normal?l(u,"normal",!1):null,h.normalScale.set(1,t.normalFlipY?-1:1),h.roughnessMap=t.maps.roughness?l(u,"roughness",!1):null,h.roughness=h.roughnessMap?1:u.roughness??.78,h.metalnessMap=t.maps.metalness?l(u,"metalness",!1):null,h.metalness=h.metalnessMap?1:u.metalness??0,h.aoMap=t.maps.ao?l(u,"ao",!1):null,h.emissiveMap=t.maps.emissive?l(u,"emissive",!1):null,h.emissive.set(h.emissiveMap?16777215:0),h.alphaMap=g,h.vertexColors=e,h.flatShading=r,h.transparent=y,h.alphaTest=b;let M=u.unlit;M.vertexColors=e,M.alphaMap=null,n==="combined"||e?(w(M.color),M.map=e?null:d,M.transparent=y,M.alphaTest=e?0:b,M.alphaMap=e?null:g):(M.map=l(u,n,!0),M.transparent=!1,M.alphaTest=0,M.map?M.color.set(16777215):n==="baseColor"?w(M.color):n==="normal"?M.color.setRGB(.5,.5,1,ve):n==="roughness"?c(M.color,u.roughness??.78):n==="metalness"?c(M.color,u.metalness??0):n==="emissive"?M.color.set(0):M.color.set(16777215));for(let S of[h,M]){let C=[S.map,S.normalMap,S.roughnessMap,S.metalnessMap,S.aoMap,S.emissiveMap,S.alphaMap].map(_=>_?1:0).join("")+[S.vertexColors,S.flatShading,S.transparent,S.alphaTest>0].join();S.userData.sig!==C&&(S.userData.sig=C,S.needsUpdate=!0)}}for(let h of this.built.meshes){let u=i?h.materials.map(f=>f.userData.unlit):h.materials,d=u.length>1?u:u[0];h.staticMesh.material=d,h.skinned&&(h.skinned.material=d)}this.requestRender()}requestMaps(){if(!this.built)return;let t=this.maps.neededKeys(this.built.allMaterials,this.settings),e=this.bridge&&this.bridge.readFileBase64?r=>new Promise((o,a)=>this.bridge.readFileBase64(r,l=>l?o(gd(l)):a(new Error("Python \u304B\u3089\u53D7\u3051\u53D6\u308C\u307E\u305B\u3093\u3067\u3057\u305F")))):null,n=[],i=this.maps.ensure(t,e,{forceBridge:!!this.forceBridgeTextures},(r,o)=>{this.applyMaterials(),r===o?(this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),n.length&&this.ui.addWarnings(n),this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3 ${o} \u679A\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F`),this.log("info",`textures loaded: ${o}`)):this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF08${r} / ${o}\uFF09`,0)},(r,o)=>n.push(`${o.info.node}: \u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\uFF08${o.resolved}\uFF09: ${o.message}`));i&&this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF080 / ${i}\uFF09`,0),this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),this.applyMaterials()}textureStatusList(){return(this.data&&this.data.textures||[]).map((t,e)=>this.maps.textureStatus(e))}setMapToggle(t,e){this.settings.maps={...this.settings.maps,[t]:e},this.setSetting("maps",this.settings.maps)}initVisibility(){this.hidden=new Set,this.rigHidden=new Set,this.rigShown=new Set,this.data.nodes.forEach((t,e)=>{t.visible===!1&&this.hidden.add(e)});for(let t of this.built.meshes)t.selfVisible=t.data.visibleSelf!==void 0?t.data.visibleSelf!==!1:t.data.visible!==!1,t.rigHidden=!1,t.rigShown=!1;this.computeVisibility()}isNodeHidden(t){return this.hidden.has(t)||this.rigHidden.has(t)&&!this.rigShown.has(t)}isMeshShown(t){let e=this.built.meshes[t];return e.selfVisible&&!(e.rigHidden&&!e.rigShown)}computeVisibility(){let t=this.data.nodes,e=new Array(t.length).fill(!1);t.forEach((n,i)=>{e[i]=this.isNodeHidden(i)||n.parent>=0&&e[n.parent]}),this.hiddenEff=e,this.built.meshes.forEach((n,i)=>{n.visible=this.isMeshShown(i)&&!e[n.transform]})}applyRigVisibility(t){let e=!1;for(let n of t){if(n.kind!=="node"&&n.kind!=="mesh")continue;let i=n.static||{},r=!!i.layerHidden||!Yd({...i,...n.values});if(n.kind==="node")r!==this.rigHidden.has(n.index)&&(e=!0,r?this.rigHidden.add(n.index):this.rigHidden.delete(n.index));else{let o=this.built.meshes[n.index];o&&o.rigHidden!==r&&(e=!0,o.rigHidden=r)}}return e}updateVisibility(){this.built&&(this.computeVisibility(),this.overlay.setHiddenNodes(this.hiddenEff),this.curves.setHiddenNodes(this.hiddenEff),this.ui.updateVisibilityMarks(this),this.updateCameraIcons(),this.picked&&!this.built.meshes[this.picked.mesh].visible&&(this.picked=null,this.marker.visible=!1,this.ui.showVertexInfo(null)),this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),this.poseDirty=!0,this.applyShading(),this.requestRender())}setNodeVisible(t,e){!this.built||t<0||(e?(this.hidden.delete(t),this.rigHidden.has(t)&&this.rigShown.add(t)):(this.hidden.add(t),this.rigShown.delete(t)),this.updateVisibility(),this.ui.setMessage(`${e?"\u8868\u793A":"\u975E\u8868\u793A\u306B"}\u3057\u307E\u3057\u305F: ${this.data.nodes[t].name}`))}toggleNodeVisible(t){t>=0&&this.hidden&&this.setNodeVisible(t,this.isNodeHidden(t))}setMeshVisible(t,e){if(!this.built)return;let n=this.built.meshes[t];n.selfVisible=e,n.rigShown=e&&n.rigHidden,this.ui.setMeshChecked(t,e),this.updateVisibility()}setAnimation(t){if(this.sceneLoading||!this.built)return this.pendingAnimation=t,!0;let e;try{e=new Jo(t);let l=e.nodes.find(c=>!(c>=0&&c<this.data.nodes.length));if(l!==void 0)throw new Error(`\u30CE\u30FC\u30C9\u756A\u53F7 ${l} \u304C\u30B7\u30FC\u30F3\u306B\u3042\u308A\u307E\u305B\u3093`)}catch(l){return this.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+(l&&l.message||l)),this.log("error",l&&l.stack||l),!1}this.pause(),this.clip=e,this.data.animation=t,this.rigHidden.clear(),this.rigShown.clear();for(let l of this.built.meshes)l.rigHidden=!1,l.rigShown=!1;this.cameraProps=new Map,this.updateVisibility(),this.rig=new ia(e,this.data.nodes,l=>this.built.nodeObjects[l].userData.fileMatrix);let n=new Set;for(let l of this.rig.moving){n.add(l);for(let c of this.built.childrenOf[l])n.add(c)}this.animTouched=[...n].sort((l,c)=>l-c);for(let[l,c]of this.rig.evaluate(e.current,()=>null,new Map))this.built.nodeObjects[l].userData.savedMatrix.copy(c);let i=e.warnings.concat([...this.rig.problems].map(l=>`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3: \u30EA\u30B0\u306E\u8A55\u4FA1\u3092\u6253\u3061\u5207\u308A\u307E\u3057\u305F\uFF08${l}\uFF09\u3002`));i.length&&this.ui.setWarnings((this.ui.warnings||[]).concat(i)),this.overlay.setStatus(this.rig.fallback.size||this.rig.tainted.size?l=>this.rig.statusOf(l):null);let r=new Set(this.built.meshes.map(l=>l.transform));this.overlay.setControllers([...this.rig.directDrivers].filter(l=>this.data.nodes[l].type!=="joint"&&!r.has(l)&&!this.curves.hasCurve(l)).sort((l,c)=>l-c)),this.rigCurves=(t.graph||[]).filter(l=>l.type==="nurbsCurve"&&l.shape>=0).map(l=>[l.shape,l.id]),this.hasTimeline||this.timeline.setStatus(""),this.timeline.setClip(this.hasTimeline?e:null),this.updateTimelineKeys();let o=this.hasTimeline&&!this.poseSourceChosen&&this.settings.poseSource==="bind"&&Gn(this.built);o&&this.setSetting("poseSource","file"),this.applyFrame(e.current),this.seqFollow&&this.applySequence(),this.fpsMeter=null,this.updateHud(),this.updateToolbarHints();let a=t.stats||{};return this.ui.setMessage(`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08\u30AB\u30FC\u30D6 ${Mn(a.curves??e.curves.length)} \u672C\u30FB\u52D5\u304F\u30CE\u30FC\u30C9 ${Mn(this.rig.moving.size)} \u500B\u30FB${e.start}\u301C${e.end} \u30D5\u30EC\u30FC\u30E0\uFF09`+(o?"\u3002\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F\uFF08B \u3067\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\uFF09":""),6e3),this.log("info",`animation loaded: ${e.curves.length} curves, ${e.nodes.length} nodes`),!0}rigValues(t){let e=this.rig.rest(t)?this.rig.chan(t):null;return e?{t:e.t.slice(),r:e.r.slice(),s:e.s.slice()}:null}verifyRig(){if(!this.rig||!this.clip)return null;this.rig.evaluate(this.clip.current,()=>null,new Map);let t=this.rig.verifySaved(e=>this.rig.fileRestLocal(e));return this.applyFrame(this.frame),{frame:this.clip.current,handles:t}}get hasTimeline(){return!!(this.clip&&(this.clip.timeCurves.length||this.rig&&(this.rig.usesTime||this.rig.hasTrax)))}applyFrame(t,e=this.playing){if(!this.clip||!this.built)return;this.camEdit&&t!==this.camEdit.frame&&this.endCameraEdit(),this.frame=t;let n=l=>this.pose&&this.pose.has(l)?Yl(this.pose.get(l),new st):null,i=this.rig.evaluate(t,n),r=this.settings.poseSource,o=Gn(this.built);for(let[l,c]of i){let h=this.built.nodeObjects[l].userData;h.fileMatrix.copy(c),h.baseMatrix.copy(tc(h,r,o))}for(let l of this.animTouched)this.pose.apply(l);let a=r==="bind"&&o;for(let[l,c]of this.rigCurves||[])this.curves.setShape(l,a?null:this.rig.plug(c,"local"));if(this.rig.props.length){let l=this.rig.evaluateProps();for(let c of l)c.kind==="camera"&&this.cameraProps.set(c.index,c.values);this.applyRigVisibility(l)&&this.updateVisibility()}this.timeline.setFrame(t),this.rigBusy=!0;try{this.afterPoseChange(e)}finally{this.rigBusy=!1}}togglePoseSource(){this.setPoseSource(this.settings.poseSource==="bind"?"file":"bind")}setPoseSource(t){this.poseSourceChosen=!0,this.setSetting("poseSource",t),this.built&&!Gn(this.built)?this.ui.setMessage("\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u3067\u8868\u793A\u3057\u307E\u3059\uFF09"):this.ui.setMessage(t==="bind"?"\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u3067\u8868\u793A\u3057\u307E\u3059":"\u30D5\u30A1\u30A4\u30EB\u306E\u5024\uFF08\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u30D5\u30EC\u30FC\u30E0\u306E\u59FF\u52E2\uFF09\u3067\u8868\u793A\u3057\u307E\u3059")}ensureAnimatedPose(){this.settings.poseSource==="bind"&&Gn(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}scrubTo(t){this.hasTimeline&&(this.seqFollow&&this.setSequenceFollow(!1),this.pauseSequence(),this.pause(),this.ensureAnimatedPose(),this.applyFrame(t))}stepFrame(t){this.hasTimeline&&this.scrubTo(this.clip.wrap(Math.round(this.frame)+t))}stepKey(t){if(!this.hasTimeline)return;let e=this.keyTimesForSelection(),n=1e-6,i=t>0?e.find(r=>r>this.frame+n):[...e].reverse().find(r=>r<this.frame-n);i!==void 0?this.scrubTo(i):this.ui.setMessage(t>0?"\u3053\u308C\u3088\u308A\u5F8C\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093":"\u3053\u308C\u3088\u308A\u524D\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093")}goToEdge(t){this.hasTimeline&&this.scrubTo(t<0?this.clip.start:this.clip.end)}setPlaybackRange(t,e){if(this.clip){if(!(Number.isFinite(t)&&Number.isFinite(e))){this.timeline.setRange(this.clip.start,this.clip.end);return}e<t&&([t,e]=[e,t]),this.clip.start=t,this.clip.end=e,this.timeline.setRange(t,e),(this.frame<t||this.frame>e)&&this.scrubTo(Math.min(Math.max(this.frame,t),e))}}togglePlay(){this.playing?this.pause():this.play()}play(){if(!this.hasTimeline||this.playing)return;this.pauseSequence(),this.seqFollow&&this.setSequenceFollow(!1),this.ensureAnimatedPose(),this.endPoseEdit();let t=this.frame>=this.clip.start&&this.frame<=this.clip.end?Math.round(this.frame):this.clip.start;this.endCameraEdit(),this.playing=!0,this.updateNavigation(),this.timeline.setPlaying(!0);let e=performance.now();this.startFpsMeter(this.clip.fps);let n=i=>{if(!this.playing||!this.clip)return;let r=this.clip.wrap(t+Math.floor((i-e)/1e3*this.clip.fps));r!==this.frame&&(this.applyFrame(r),this.countShownFrame(i)),this.playHandle=requestAnimationFrame(n)};this.playHandle=requestAnimationFrame(n)}pause(){this.playing&&(this.playing=!1,cancelAnimationFrame(this.playHandle),this.updateNavigation(),this.stopFpsMeter(),this.timeline.setPlaying(!1),this.built&&this.afterPoseChange())}keyTimesForSelection(){if(!this.clip)return[];let t=this.selected>=0?this.clip.keyTimes(this.selected):[];return t.length?t:this.clip.keyTimes()}updateTimelineKeys(){if(!this.clip)return;let t=this.selected>=0&&this.clip.keyTimes(this.selected).length;this.timeline.setKeys(this.keyTimesForSelection(),t?`${this.data.nodes[this.selected].name} \u306E\u30AD\u30FC`:"\u3059\u3079\u3066\u306E\u30AD\u30FC")}select(t,e={}){!this.built||t<0||t>=this.data.nodes.length||(this.selected=t,this.overlay.setSelected(t),this.curves.setSelected(t),this.updateCameraIcons(),this.applyShading(),this.ui.highlightNode(t,this.data.nodes),this.ui.showNodeInfo(this.nodeInfo(t)),this.ui.showPoseFor(t,this.pose.get(t)),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),e.notify&&this.bridge&&this.bridge.nodeSelected&&this.bridge.nodeSelected(this.data.nodes[t].path),this.requestRender())}selectMesh(t){this.built&&this.select(this.built.meshes[t].transform,{notify:!0})}selectByPath(t){if(!this.data)return!1;let e=this.data.nodes,n=e.findIndex(i=>i.path===t);if(n<0&&(n=e.findIndex(i=>i.path.endsWith("|"+t.replace(/^\|/,""))||i.name===t)),n<0){let i=this.data.meshes.findIndex(r=>r.path===t||r.name===t);i>=0&&(n=this.data.meshes[i].transform)}return n<0?!1:(this.select(n,{notify:!1}),!0)}clearSelection(){this.built&&(this.selected=-1,this.picked=null,this.marker.visible=!1,this.overlay.setSelected(-1),this.curves.setSelected(-1),this.updateCameraIcons(),this.applyShading(),this.ui.highlightNode(-1,this.data.nodes),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),this.requestRender())}nodeInfo(t){let e=this.data.nodes[t],n=this.built.nodeObjects[t],i=(this.built.influenceUsage.get(t)||[]).map(o=>{let a=this.built.meshes[o.mesh];return{meshName:a.name,count:a.skin.stats.affected[o.slot],total:a.vertexCount}}),r=this.built.meshes.filter(o=>o.transform===t).map(o=>({name:o.name,vertices:o.vertexCount,faces:o.data.counts.length,cluster:o.data.skin?o.data.skin.cluster:"",skin:o.skin?o.skin.stats:null,normalizeSetting:o.data.skin?o.data.skin.normalize??1:null,normalized:o.skin?o.skin.normalize:!1}));return{node:e,worldPos:br.setFromMatrixPosition(n.matrixWorld).toArray(),usage:i,meshes:r,posed:this.pose.has(t),hiddenSelf:!!(this.hidden&&this.isNodeHidden(t)),hiddenByRig:!!(this.rigHidden&&this.rigHidden.has(t)&&!this.rigShown.has(t)&&!this.hidden.has(t)),hiddenByParent:!!(this.hiddenEff&&this.hiddenEff[t]&&!(this.hidden&&this.isNodeHidden(t))),bindSource:e.bindSource||null,unselectable:e.unselectable||null,usingBind:this.settings.poseSource==="bind"&&!!e.bindMatrix,drivenBy:e.drivenBy||null,animChannels:this.clip?this.clip.channelsOf(t):[],rigDrivers:this.rig?this.rig.driversOf(t):[],animLoaded:!!this.clip,animValues:this.rig?this.rigValues(t):null,frame:this.frame}}pick(t){if(!this.built)return;let e=this.canvas.getBoundingClientRect(),n=new Nt((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1),i=this.activeCamera();this.raycaster.setFromCamera(n,i);let r=!!this.settings.pickAll,o=this.data.nodes,a=p=>r||!o[p].unselectable;if(this.settings.joints){let p=this.overlay.pick(this.raycaster);if(p>=0&&a(p)){this.select(p,{notify:!0});return}}let l=this.pixelSize(e.height),c=this.curves.pick(this.raycaster,l*5,p=>r||!(p.unselectable||o[p.transform].unselectable)),h=this.settings.skin;if(this.poseDirty){for(let p of this.built.meshes)p.skinned&&(p.skinned.boundingSphere=null,p.skinned.boundingBox=null);this.poseDirty=!1}let u=[];for(let p of this.built.meshes)!p.visible||!(r||!p.data.unselectable)||u.push(h&&p.skinned?p.skinned:p.staticMesh);let d=this.raycaster.intersectObjects(u,!1);if(c.node>=0&&(!d.length||c.distance<=d[0].distance)){this.select(c.node,{notify:!0});return}if(!d.length){this.clearSelection();return}let f=d[0],m=this.built.meshes[f.object.userData.meshIndex];if(this.settings.pickMode!=="vertex"){this.picked=null,this.marker.visible=!1,this.select(m.transform,{notify:!0});return}let x=-1,g=1/0;for(let p of[f.face.a,f.face.b,f.face.c]){let v=fr(m,p,h,hi).distanceToSquared(f.point);v<g&&(g=v,x=cd(m,p))}this.pickVertex(m.index,x)}pickVertex(t,e){this.picked={mesh:t,vertex:e},this.updateMarker(),this.ui.showVertexInfo(this.vertexInfo()),this.requestRender()}vertexInfo(){if(!this.picked||!this.built)return null;let t=this.built.meshes[this.picked.mesh],e=this.picked.vertex,n=this.settings.skin&&!!t.skinned,i=Es(t,e,n,hi).toArray(),r={meshName:t.name,vertex:e,worldPos:i,skinned:!!t.skin};if(!t.skin)return r;let o=this.data.nodes,a=Qu(t.skin,e).map(l=>{let c=t.data.skin.influences[l.slot];return{name:o[c].name,path:o[c].path,nodeIndex:c,weight:l.weight,effective:l.effective,assigned:!!l.assigned}});return{...r,weights:a,sum:a.reduce((l,c)=>l+c.weight,0),normalized:t.skin.normalize,assigned:a.some(l=>l.assigned),distribution:t.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2"}}updateMarker(){if(!this.picked||!this.built){this.marker&&(this.marker.visible=!1);return}let t=this.built.meshes[this.picked.mesh];Es(t,this.picked.vertex,this.settings.skin&&!!t.skinned,hi);let e=this.marker.geometry.attributes.position;e.setXYZ(0,hi.x,hi.y,hi.z),e.needsUpdate=!0,this.marker.visible=!0}setPoseForSelected(t){this.selected>=0&&this.setPose(this.selected,t)}setPose(t,e){this.pose&&(this.beforeDriverPose(t),this.pose.set(t,e),this.afterPoseChange())}resetPose(t){t<0||!this.pose||(this.endPoseEdit(),this.beginPoseEdit([t],"\u30CE\u30FC\u30C9\u3092\u623B\u3059"),this.pose.reset(t),this.endPoseEdit(),this.afterPoseChange(),this.ui.showPoseFor(t,ws()))}resetAllPoses(){this.pose&&(this.endPoseEdit(),this.beginPoseEdit([...this.pose.poses.keys()],"\u3059\u3079\u3066\u623B\u3059",!0),this.pose.resetAll(),this.endPoseEdit(),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,ws()))}snapshotPose(t){return this.pose&&this.pose.has(t)?this.pose.get(t):null}beginPoseEdit(t,e,n=!1){if(this.edit||!this.pose||(t=t.filter(r=>r>=0),!t.length))return;let i=!n&&t.length===1&&this.data?`\uFF08${this.data.nodes[t[0]].name}\uFF09`:"";this.edit={label:e+i,nodes:t,before:t.map(r=>[r,this.snapshotPose(r)])}}endPoseEdit(){let t=this.edit;if(!t)return;this.edit=null;let e=t.nodes.map(n=>[n,this.snapshotPose(n)]);wd(t.before,e)||this.history.push({label:t.label,before:t.before,after:e})}undo(){this.endPoseEdit();let t=this.history.undo();return this.ui.setMessage(t?`\u5143\u306B\u623B\u3057\u307E\u3057\u305F: ${t.label}`:"\u5143\u306B\u623B\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}redo(){this.endPoseEdit();let t=this.history.redo();return this.ui.setMessage(t?`\u3084\u308A\u76F4\u3057\u307E\u3057\u305F: ${t.label}`:"\u3084\u308A\u76F4\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}applyPoseChanges(t){if(this.pose){for(let[e,n]of[...t].sort((i,r)=>i[0]-r[0]))this.pose.set(e,n||ws());t.length===1&&t[0][0]!==this.selected&&this.select(t[0][0],{notify:!1}),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,this.pose.get(this.selected))}}onWarningsChanged(t){this.bridge&&this.bridge.warningsChanged&&this.bridge.warningsChanged(JSON.stringify(t))}showWarnings(){this.bridge&&this.bridge.showWarnings?this.bridge.showWarnings():this.ui.openWarningDialog()}historyChanged(t){this.ui.setHistoryState(t),this.bridge&&this.bridge.historyChanged&&this.bridge.historyChanged(t.canUndo,t.canRedo,t.undoLabel,t.redoLabel)}afterPoseChange(t=!1){if(this.rig&&this.rig.hasGraph&&!this.rigBusy){this.applyFrame(this.frame,t);return}this.built.root.updateMatrixWorld(!0),this.overlay.update(),this.poseDirty=!0,this.updateMarker(),!t&&this.picked&&this.ui.showVertexInfo(this.vertexInfo()),!t&&this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),t||this.updateToolbarHints(),this.gizmoDragging||this.syncGizmo(),this.requestRender()}beforeDriverPose(t){this.rig&&this.rig.drivers.has(t)&&this.settings.poseSource==="bind"&&Gn(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30B3\u30F3\u30C8\u30ED\u30FC\u30E9\u30FC\u306E\u52D5\u304D\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}updateGizmo(){if(!this.gizmo)return;let t=this.settings.tool;!this.built||this.selected<0||t==="select"?this.gizmo.detach():(this.syncGizmo(!0),this.gizmo.setMode(t),this.gizmo.setSpace(this.settings.space),this.gizmo.object!==this.poseProxy&&this.gizmo.attach(this.poseProxy)),this.requestRender()}syncGizmo(t=!1){if(!this.gizmo||this.selected<0||!this.pose||!t&&!this.gizmo.object)return;this.built.root.updateMatrixWorld(!0),this.pose.frameMatrix(this.selected,this.poseFrame.matrix);let e=this.pose.get(this.selected);this.poseProxy.position.fromArray(e.t),$l(e,this.poseProxy.quaternion),this.poseProxy.scale.fromArray(e.s),this.poseFrame.updateMatrixWorld(!0)}onGizmoChange(){if(this.selected<0||!this.pose)return;let t=this.poseProxy,e=Xu(t.position,t.quaternion,t.scale);t.scale.fromArray(e.s),this.beforeDriverPose(this.selected),this.pose.set(this.selected,e),this.afterPoseChange(),this.ui.showPoseFor(this.selected,e)}updateToolbarHints(){let t=this.settings,e=this.built,n={};if(!e){for(let o of["opt-wire","opt-tex","opt-skin","opt-joints","opt-curves","opt-xray","opt-bind"])n[o]="\u30B7\u30FC\u30F3\u3092\u8AAD\u307F\u8FBC\u3080\u3068\u4F7F\u3048\u307E\u3059";this.ui.setToolbarHints(n);return}let i=e.meshes.some(o=>o.skinned),r=Gn(e);t.shading==="none"&&(n["opt-wire"]="\u30EF\u30A4\u30E4\u30FC\u306E\u307F\u306E\u8868\u793A\uFF084\uFF09\u3067\u306F\u3001\u5E38\u306B\u30EF\u30A4\u30E4\u30FC\u3092\u8868\u793A\u3057\u307E\u3059\uFF085 \u3067\u30B7\u30A7\u30FC\u30C7\u30A3\u30F3\u30B0\u306B\u623B\u3059\uFF09"),t.weightMode!=="off"?n["opt-tex"]="\u30A6\u30A7\u30A4\u30C8\u306E\u8868\u793A\u4E2D\u306F\u3001\u30C6\u30AF\u30B9\u30C1\u30E3\u3068\u30DE\u30C6\u30EA\u30A2\u30EB\u306E\u8272\u3092\u8868\u793A\u3057\u307E\u305B\u3093":t.shading==="none"?n["opt-tex"]="\u30EF\u30A4\u30E4\u30FC\u306E\u307F\u306E\u8868\u793A\uFF084\uFF09\u3067\u306F\u3001\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8868\u793A\u3057\u307E\u305B\u3093":(this.data.materials||[]).length||(n["opt-tex"]="\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F\u30DE\u30C6\u30EA\u30A2\u30EB\u30FB\u30C6\u30AF\u30B9\u30C1\u30E3\u304C\u3042\u308A\u307E\u305B\u3093"),i?t.poseSource==="bind"&&r&&!(this.pose&&this.pose.size)&&(n["opt-skin"]="\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u3067\u306F\u3001\u30B9\u30AD\u30F3\u5909\u5F62\u306E\u6709\u7121\u3067\u5F62\u306F\u5909\u308F\u308A\u307E\u305B\u3093\uFF08B \u3067\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u306B\u3059\u308B\u304B\u3001\u30DD\u30FC\u30BA\u78BA\u8A8D\u3067\u52D5\u304B\u3059\u3068\u9055\u3044\u304C\u51FA\u307E\u3059\uFF09"):n["opt-skin"]="\u30B9\u30AD\u30F3\uFF08skinCluster\uFF09\u306E\u3042\u308B\u30E1\u30C3\u30B7\u30E5\u304C\u3042\u308A\u307E\u305B\u3093",!e.jointIndices.length&&!(this.overlay.controls||[]).length&&(n["opt-joints"]="\u30B8\u30E7\u30A4\u30F3\u30C8\u304C\u3042\u308A\u307E\u305B\u3093"),t.joints||(n["opt-xray"]="\u30B8\u30E7\u30A4\u30F3\u30C8\u3092\u8868\u793A\u3057\u3066\u3044\u306A\u3044\u305F\u3081\u52B9\u679C\u304C\u3042\u308A\u307E\u305B\u3093\uFF08J \u3067\u30B8\u30E7\u30A4\u30F3\u30C8\u3092\u8868\u793A\uFF09"),this.curves.items.some(Boolean)||(n["opt-curves"]="\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F NURBS \u30AB\u30FC\u30D6\u304C\u3042\u308A\u307E\u305B\u3093"),r||(n["opt-bind"]="\u3053\u306E\u30B7\u30FC\u30F3\u306B\u306F\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u60C5\u5831\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u3067\u8868\u793A\u3057\u307E\u3059\uFF09"),this.ui.setToolbarHints(n)}startFpsMeter(t){this.fpsMeter={target:t,times:[],start:performance.now(),shown:0,shownAt:0,first:0,last:0},this.updateHud(!0)}countShownFrame(t){let e=this.fpsMeter;if(e){for(e.times.push(t),e.shown||(e.first=t),e.last=t,e.shown++;e.times.length&&e.times[0]<t-1e3;)e.times.shift();t-e.shownAt>250&&(e.shownAt=t,this.updateHud())}}stopFpsMeter(){let t=this.fpsMeter;if(!t)return;let e=(t.last-t.first)/1e3;t.average=e>.25?Math.min((t.shown-1)/e,t.target):null,t.stopped=!0,this.updateHud()}currentFps(){let t=this.fpsMeter?this.fpsMeter.times:[];return t.length<2?null:Math.min((t.length-1)*1e3/Math.max(t[t.length-1]-t[0],1),this.fpsMeter.target)}updateHud(t=!1){let e=this.fpsMeter,n=!!(this.settings.hud&&this.built&&(this.hasTimeline||this.sequence)),i="",r="idle";if(n){let o=e&&e.target||this.clip&&this.clip.fps||24,a=l=>l.toFixed(1);if(e&&!e.stopped){let l=t?null:this.currentFps();i=`\u518D\u751F ${l===null?"--.-":a(l)} / ${a(o)} fps`,r=l!==null&&performance.now()-e.start>500&&l<o*.9?"slow":""}else i=e&&e.average?`\u76F4\u524D\u306E\u518D\u751F ${a(e.average)} / ${a(o)} fps`:`${a(o)} fps`}this.ui.setHud(n?i:null,r)}setSequenceFrame(t,e={}){this.sequence&&(this.seqFrame=Math.min(Math.max(t,this.sequence.start),this.sequence.end),e.follow&&!this.seqFollow&&(this.seqFollow=!0),this.seqFollow&&this.applySequence(),this.updateSequencePanel())}setSequenceFollow(t){this.seqFollow=!!t&&!!this.sequence,this.seqFollow?this.applySequence():this.pauseSequence(),this.updateSequencePanel()}applySequence(){let t=la(this.sequence&&this.sequence.shots,this.seqFrame);t&&(t.camera>=0&&t.camera!==this.viewCamera&&this.setCamera(t.camera,{quiet:!0,fromSequence:!0}),this.hasTimeline?(this.playing&&this.pause(),this.ensureAnimatedPose(),this.applyFrame(hc(t,this.seqFrame),this.seqPlaying)):this.requestRender())}updateSequencePanel(){this.sequence&&this.seqPanel.update(this.seqFrame,la(this.sequence.shots,this.seqFrame),this.cameras,this.seqFollow,this.seqPlaying)}stepShot(t){if(!this.sequence)return;let e=[...new Set(this.sequence.shots.filter(i=>!i.mute).map(i=>i.sequenceStartFrame))].sort((i,r)=>i-r),n=t>0?e.find(i=>i>this.seqFrame+1e-6):[...e].reverse().find(i=>i<this.seqFrame-1e-6);n!==void 0&&this.setSequenceFrame(n,{follow:!0})}toggleSequencePlay(){this.seqPlaying?this.pauseSequence():this.playSequence()}playSequence(){if(!this.sequence||this.seqPlaying)return;this.pause(),this.seqFollow=!0,this.endCameraEdit(),this.seqPlaying=!0,this.updateNavigation();let t=this.clip&&this.clip.fps||24,{start:e,end:n}=this.sequence,i=this.seqFrame>=n?e:Math.floor(this.seqFrame),r=performance.now();this.startFpsMeter(t);let o=a=>{if(!this.seqPlaying)return;let l=n-e+1,c=e+(i-e+Math.floor((a-r)/1e3*t))%l;c!==this.seqFrame&&(this.seqFrame=c,this.applySequence(),this.updateSequencePanel(),this.countShownFrame(a)),this.seqHandle=requestAnimationFrame(o)};this.updateSequencePanel(),this.seqHandle=requestAnimationFrame(o)}pauseSequence(){this.seqPlaying&&(this.seqPlaying=!1,cancelAnimationFrame(this.seqHandle),this.updateNavigation(),this.stopFpsMeter(),this.built&&this.afterPoseChange(),this.updateSequencePanel())}nextCamera(){return this.cameras.length&&this.viewCamera+1<this.cameras.length?this.viewCamera+1:-1}setCamera(t,e={}){if(!e.fromSequence&&!e.quiet&&this.seqFollow&&this.setSequenceFollow(!1),t>=0&&t<this.cameras.length||(t=-1),t===this.viewCamera)return;if(!this.renderer){this.viewCamera=-1;return}this.viewCamera<0&&t>=0&&(this.freeTarget=this.controls.target.clone()),t<0&&this.freeTarget&&(this.controls.target.copy(this.freeTarget),this.freeTarget=null),this.viewCamera=t,this.endCameraEdit();let n=this.activeCamera();n.add(this.keyLight,this.keyLight.target),this.controls.object=n,this.updateNavigation(),this.gizmo&&(this.gizmo.camera=n),this.updateCameraIcons(),this.updateGate(),e.quiet||this.ui.setMessage(t>=0?`\u30AB\u30E1\u30E9 ${this.cameras[t].name} \u304B\u3089\u8868\u793A\u3057\u307E\u3059\uFF08Shift+C \u3067\u81EA\u7531\u8996\u70B9\uFF09`:"\u81EA\u7531\u8996\u70B9\u306B\u623B\u3057\u307E\u3057\u305F"),this.requestRender()}syncViewCamera(){let t=this.cameras[this.viewCamera],e=t&&this.built?this.built.nodeObjects[t.transform]:null;if(!e)return;let n=this.activeCamera();this.camEdit&&this.camEdit.ci===this.viewCamera||(e.updateWorldMatrix(!0,!1),e.matrixWorld.decompose(n.position,ef,br),n.quaternion.copy(ef)),n.updateMatrixWorld(!0);let i=document.getElementById("viewport"),r=Math.max(1,i.clientWidth),o=Math.max(1,i.clientHeight),a=this.data&&this.data.render||{},l=Jd(cc(t,this.cameraProps.get(this.viewCamera)),r,o,a.deviceAspectRatio);l.ortho?(Object.assign(n,{left:l.left,right:l.right,top:l.top,bottom:l.bottom,near:l.near,far:l.far}),n.updateProjectionMatrix()):(n.near=l.near,n.far=l.far,n.projectionMatrix.makePerspective(l.left,l.right,l.top,l.bottom,l.near,l.far),n.projectionMatrixInverse.copy(n.projectionMatrix).invert(),n.fov=2*Math.atan((l.top-l.bottom)/2/l.near)/uc),this.gateRect=l.gate,this.ui.setGate(this.settings.cameraGate,l.gate,r,o)}canNavigate(){return this.viewCamera<0||!(this.playing||this.seqPlaying)}updateNavigation(){this.controls&&(this.controls.enabled=this.canNavigate()&&!this.gizmoDragging),this.ui.setViewCamera(this.viewCamera,this.viewCamera>=0?this.cameras[this.viewCamera].name:"",!!this.camEdit)}prepareCameraEdit(){if(this.viewCamera<0||this.camEdit)return;let t=this.activeCamera(),e=new A(0,0,-1).applyQuaternion(t.quaternion),i=(this.built?pr(this.built,this.settings.skin).getCenter(new A):new A).sub(t.position).dot(e);this.controls.target.copy(t.position).addScaledVector(e,i>this.sceneRadius*.05?i:Math.max(this.sceneRadius,1))}beginCameraEdit(){this.viewCamera<0||this.camEdit||(this.camEdit={ci:this.viewCamera,frame:this.frame},this.updateNavigation(),this.ui.setMessage(`\u30AB\u30E1\u30E9 ${this.cameras[this.viewCamera].name} \u306E\u8996\u70B9\u3092\u4E00\u6642\u7684\u306B\u52D5\u304B\u3057\u3066\u3044\u307E\u3059\uFF08\u4FDD\u5B58\u3057\u307E\u305B\u3093\u3002\u30D5\u30EC\u30FC\u30E0\u3092\u52D5\u304B\u3059\u304B\u518D\u751F\u3059\u308B\u3068\u623B\u308A\u307E\u3059\uFF09`,6e3))}endCameraEdit(){this.camEdit&&(this.camEdit=null,this.viewOrtho.zoom=1,this.updateNavigation(),this.requestRender())}updateGate(){this.viewCamera<0?this.ui.setGate(null):this.requestRender()}updateCameraIcons(){!this.cameraIcons||!this.built||this.cameraIcons.update(!!this.settings.cameraIcons,t=>!!(this.hiddenEff&&this.hiddenEff[t]),this.viewCamera,this.selected)}pixelSize(t){let e=this.activeCamera(),n=Math.max(t,1);if(e.isOrthographicCamera)return(e.top-e.bottom)/e.zoom/n;if(this.viewCamera>=0){let i=this.built?pr(this.built,this.settings.skin).getCenter(new A):new A;return 2/e.projectionMatrix.elements[5]*e.position.distanceTo(i)/n}return 2*e.position.distanceTo(this.controls.target)*Math.tan(e.fov*uc/2)/n}frameAll(t=!1){if(!this.built||!this.renderer)return;let e=pr(this.built,this.settings.skin);this.fit(e.getCenter(new A),Math.max(e.getSize(br).length()/2,.001),t)}frameSelection(){if(!this.built)return;if(this.picked){let i=this.built.meshes[this.picked.mesh],r=Es(i,this.picked.vertex,this.settings.skin&&!!i.skinned,new A);this.fit(r,this.sceneRadius*.12);return}if(this.selected<0){this.frameAll();return}let t=new Set([this.selected]);this.data.nodes.forEach((i,r)=>{t.has(i.parent)&&t.add(r)});let e=new Ye;for(let i of this.built.meshes){if(!t.has(i.transform))continue;let r=Math.max(1,Math.floor(i.vertexCount/5e3));for(let o=0;o<i.vertexCount;o+=r)e.expandByPoint(Es(i,o,this.settings.skin,hi))}for(let i of t)e.expandByPoint(hi.setFromMatrixPosition(this.built.nodeObjects[i].matrixWorld));this.curves.expandBox(e,t);let n=Math.max(e.getSize(br).length()/2,this.overlay.radius()*12,this.sceneRadius*.05);this.fit(e.getCenter(new A),n)}fit(t,e,n=!1){this.setCamera(-1,{quiet:!0});let i=this.camera,r=n?new A(1,.75,1):i.position.clone().sub(this.controls.target);r.lengthSq()<1e-12&&r.set(1,.75,1),r.normalize();let o=e/Math.sin(i.fov*uc/2)*1.05;this.controls.target.copy(t),i.position.copy(t).addScaledVector(r,o),i.near=Math.max(o/2e3,1e-4),i.far=o*50+e*10,i.updateProjectionMatrix(),this.controls.update(),this.requestRender()}stats(){return this.built?{loaded:!0,meshes:this.built.meshes.length,vertices:this.built.meshes.reduce((t,e)=>t+e.vertexCount,0),triangles:this.built.meshes.reduce((t,e)=>t+e.triCount,0),joints:this.built.jointIndices.length,curves:this.curves.items.filter(Boolean).length,cameras:this.cameras.map(t=>t.name),viewCamera:this.viewCamera>=0?this.cameras[this.viewCamera].name:null,cameraEdited:!!this.camEdit,navigation:!!(this.controls&&this.controls.enabled),fps:this.fpsMeter?{current:this.currentFps(),average:this.fpsMeter.average??null,target:this.fpsMeter.target,playing:!this.fpsMeter.stopped}:null,sequence:this.sequence?{frame:this.seqFrame,follow:this.seqFollow,playing:this.seqPlaying,shot:(la(this.sequence.shots,this.seqFrame)||{}).shotName||null,shots:this.sequence.shots.length}:null,hiddenMeshes:this.built.meshes.filter(t=>!t.visible).map(t=>t.name),selected:this.selected>=0?this.data.nodes[this.selected].path:null,posedNodes:this.pose?this.pose.size:0,textures:this.textureStatusList().map((t,e)=>({node:this.data.textures[e].node,status:t.status,via:t.via||null,hasAlpha:!!t.hasAlpha,size:t.width?[t.width,t.height]:null,tiles:t.tiles||0})),gizmoAttached:!!(this.gizmo&&this.gizmo.object),timing:this.lastTiming||null,settings:{...this.settings},webgl:!!this.renderer,animation:this.clip?{frame:this.frame,playing:this.playing,start:this.clip.start,end:this.clip.end,fps:this.clip.fps,curves:this.clip.curves.length,nodes:this.rig?this.rig.moving.size:this.clip.nodes.length,graphNodes:this.rig?this.rig.graph.length:0,rigProblems:this.rig?[...this.rig.problems]:[]}:null}:{loaded:!1}}};function a_(s,t){let e=s/2,n=s/t,i=new wt(6120814),r=new wt(13657951),o=new wt(6262744),a=[],l=[],c=(d,f,m)=>{a.push(...d,...f),l.push(m.r,m.g,m.b,m.r,m.g,m.b)};for(let d=0;d<=t;d++){let f=-e+d*n,m=Math.abs(f)<n*1e-6;c([-e,0,f],[e,0,f],m?r:i),c([f,0,-e],[f,0,e],m?o:i)}let h=new ne;h.setAttribute("position",new zt(a,3)),h.setAttribute("color",new zt(l,3));let u=new ii(h,new Qe({vertexColors:!0,transparent:!0,opacity:.7}));return u.name="__grid",u}function l_(s){let t=10**Math.floor(Math.log10(s));for(let e of[1,2,5,10])if(e*t>=s)return e*t;return 10*t}var Lt=new dc;window.mayaViewer={version:r_,loadScene(s){try{let t=performance.now(),e=typeof s=="string"?JSON.parse(s):s;return Lt.timing={...Lt.timing||{},parse:typeof s=="string"?performance.now()-t:0},Lt.loadScene(e)}catch(t){return Lt.sceneLoading=!1,Lt.ui.hideLoading(),Lt.ui.showError(`\u30C7\u30FC\u30BF\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+t.message),!1}},beginTransfer(s){return Lt.transfer=[],Lt.transferStart=performance.now(),Lt.ui.showLoading(s||"\u30C7\u30FC\u30BF\u3092\u53D7\u3051\u53D6\u308A\u4E2D"),!0},appendChunk(s){return Lt.transfer&&Lt.transfer.push(s),!0},endTransfer(){let s=Lt.transfer?Lt.transfer.join(""):"";return Lt.transfer=null,Lt.sceneLoading=!0,Lt.timing={transfer:performance.now()-(Lt.transferStart||performance.now())},Lt.ui.showLoading("\u30B7\u30FC\u30F3\u3092\u7D44\u307F\u7ACB\u3066\u4E2D"),setTimeout(()=>this.loadScene(s),16),s.length},beginAnimationTransfer(){return Lt.transfer=[],!0},endAnimationTransfer(){let s=Lt.transfer?Lt.transfer.join(""):"";Lt.transfer=null;try{return Lt.setAnimation(JSON.parse(s))}catch(t){return Lt.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+t.message),!1}},setAnimation(s){return Lt.setAnimation(typeof s=="string"?JSON.parse(s):s)},setAnimationStatus(s){return Lt.timeline.setStatus(Lt.clip&&!Lt.sceneLoading?"":s),!0},setFrame(s){return Lt.scrubTo(+s),Lt.frame},play(){Lt.play()},pause(){Lt.pause()},showLoading(s,t){Lt.ui.setEmpty(!1),Lt.ui.showLoading(s,t)},hideLoading(){Lt.ui.hideLoading(),Lt.built||Lt.ui.setEmpty(!0)},showError(s){Lt.ui.hideLoading(),Lt.ui.showError(s)},setMessage(s){Lt.ui.setMessage(s)},selectByPath(s){return Lt.selectByPath(s)},clear(){return Lt.clearAll(),!0},getStats(){return Lt.stats()},verifyRig(){return Lt.verifyRig()},getTextureState(){return Lt.stats().textures},frameAll(){Lt.frameAll()},undo(){return Lt.undo()},redo(){return Lt.redo()},getWarnings(){return(Lt.ui.warnings||[]).slice()},showWarnings(){Lt.showWarnings()},getHistory(){let s=Lt.history;return{canUndo:s.canUndo,canRedo:s.canRedo,undo:s.undoStack.map(t=>t.label),redo:s.redoStack.map(t=>t.label)}},debug:{get app(){return Lt},checkSkinning(s=0,t={}){return Ad(Lt,s,t)}}};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
