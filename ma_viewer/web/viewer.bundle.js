(()=>{var Tl="160",xn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},wi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Yd=0,uc=1,Zd=2;var nu=1,jd=2,Nn=3,ti=0,je=1,ke=2;var Kn=0,ts=1,dc=2,fc=3,pc=4,Kd=5,pi=100,Jd=101,Qd=102,mc=103,gc=104,tf=200,ef=201,nf=202,sf=203,Va=204,Ha=205,rf=206,of=207,af=208,lf=209,cf=210,hf=211,uf=212,df=213,ff=214,pf=0,mf=1,gf=2,jr=3,xf=4,yf=5,_f=6,vf=7,iu=0,Mf=1,bf=2,Jn=0,wf=1,Sf=2,Ef=3,Af=4,Tf=5,Cf=6,xc="attached",Ao="detached",su=300,is=301,ss=302,Ga=303,Wa=304,To=306,rs=1e3,sn=1001,Xa=1002,Pe=1003,yc=1004;var la=1005;var Le=1006,Rf=1007;var Mn=1008;var Qn=1009,Pf=1010,Lf=1011,Cl=1012,ru=1013,jn=1014,Un=1015,ks=1016,ou=1017,au=1018,gi=1020,If=1021,Ye=1023,Nf=1024,Uf=1025,xi=1026,os=1027,Df=1028,lu=1029,Of=1030,cu=1031,hu=1033,ca=33776,ha=33777,ua=33778,da=33779,_c=35840,vc=35841,Mc=35842,bc=35843,uu=36196,wc=37492,Sc=37496,Ec=37808,Ac=37809,Tc=37810,Cc=37811,Rc=37812,Pc=37813,Lc=37814,Ic=37815,Nc=37816,Uc=37817,Dc=37818,Oc=37819,Fc=37820,kc=37821,fa=36492,zc=36494,Bc=36495,Ff=36283,Vc=36284,Hc=36285,Gc=36286;var Kr=2300,Jr=2301,pa=2302,Wc=2400,Xc=2401,qc=2402;var du=3e3,yi=3001,kf=3200,zf=3201,fu=0,Bf=1,Ze="",xe="srgb",On="srgb-linear",Rl="display-p3",Co="display-p3-linear",Qr="linear",le="srgb",to="rec709",eo="p3";var Ii=7680;var $c=519,Vf=512,Hf=513,Gf=514,pu=515,Wf=516,Xf=517,qf=518,$f=519,Yc=35044,tr=35048;var Zc="300 es",qa=1035,Dn=2e3,no=2001,bn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jc=1234567,Us=Math.PI/180,zs=180/Math.PI;function Si(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Fe(i,t,e){return Math.max(t,Math.min(e,i))}function Pl(i,t){return(i%t+t)%t}function Yf(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Zf(i,t,e){return i!==t?(e-i)/(t-i):0}function Ds(i,t,e){return(1-e)*i+e*t}function jf(i,t,e,n){return Ds(i,t,1-Math.exp(-e*n))}function Kf(i,t=1){return t-Math.abs(Pl(i,t*2)-t)}function Jf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Qf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function tp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function ep(i,t){return i+Math.random()*(t-i)}function np(i){return i*(.5-Math.random())}function ip(i){i!==void 0&&(jc=i);let t=jc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function sp(i){return i*Us}function rp(i){return i*zs}function $a(i){return(i&i-1)===0&&i!==0}function op(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function io(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ap(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*u,l*d,a*c);break;case"YZY":i.set(l*d,a*h,l*u,a*c);break;case"ZXZ":i.set(l*u,l*d,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Zi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var mu={DEG2RAD:Us,RAD2DEG:zs,generateUUID:Si,clamp:Fe,euclideanModulo:Pl,mapLinear:Yf,inverseLerp:Zf,lerp:Ds,damp:jf,pingpong:Kf,smoothstep:Jf,smootherstep:Qf,randInt:tp,randFloat:ep,randFloatSpread:np,seededRandom:ip,degToRad:sp,radToDeg:rp,isPowerOfTwo:$a,ceilPowerOfTwo:op,floorPowerOfTwo:io,setQuaternionFromProperEuler:ap,normalize:We,denormalize:Zi},Lt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Xt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],b=s[1],y=s[4],v=s[7],w=s[2],M=s[5],S=s[8];return r[0]=o*x+a*b+l*w,r[3]=o*m+a*y+l*M,r[6]=o*p+a*v+l*S,r[1]=c*x+h*b+u*w,r[4]=c*m+h*y+u*M,r[7]=c*p+h*v+u*S,r[2]=d*x+f*b+g*w,r[5]=d*m+f*y+g*M,r[8]=d*p+f*v+g*S,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(ma.makeScale(t,e)),this}rotate(t){return this.premultiply(ma.makeRotation(-t)),this}translate(t,e){return this.premultiply(ma.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},ma=new Xt;function gu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function so(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function lp(){let i=so("canvas");return i.style.display="block",i}var Kc={};function Os(i){i in Kc||(Kc[i]=!0,console.warn(i))}var Jc=new Xt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Qc=new Xt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),vr={[On]:{transfer:Qr,primaries:to,toReference:i=>i,fromReference:i=>i},[xe]:{transfer:le,primaries:to,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Co]:{transfer:Qr,primaries:eo,toReference:i=>i.applyMatrix3(Qc),fromReference:i=>i.applyMatrix3(Jc)},[Rl]:{transfer:le,primaries:eo,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Qc),fromReference:i=>i.applyMatrix3(Jc).convertLinearToSRGB()}},cp=new Set([On,Co]),se={enabled:!0,_workingColorSpace:On,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!cp.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=vr[t].toReference,s=vr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return vr[i].primaries},getTransfer:function(i){return i===Ze?Qr:vr[i].transfer}};function es(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ga(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ni,ro=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ni===void 0&&(Ni=so("canvas")),Ni.width=t.width,Ni.height=t.height;let n=Ni.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ni}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=so("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=es(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(es(e[n]/255)*255):e[n]=es(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},hp=0,oo=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:hp++}),this.uuid=Si(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(xa(s[o].image)):r.push(xa(s[o]))}else r=xa(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function xa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ro.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var up=0,Ke=class i extends bn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=sn,s=sn,r=Le,o=Mn,a=Ye,l=Qn,c=i.DEFAULT_ANISOTROPY,h=Ze){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:up++}),this.uuid=Si(),this.name="",this.source=new oo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Lt(0,0),this.repeat=new Lt(1,1),this.center=new Lt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===yi?xe:Ze),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==su)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rs:t.x=t.x-Math.floor(t.x);break;case sn:t.x=t.x<0?0:1;break;case Xa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rs:t.y=t.y-Math.floor(t.y);break;case sn:t.y=t.y<0?0:1;break;case Xa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===xe?yi:du}set encoding(t){Os("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===yi?xe:Ze}};Ke.DEFAULT_IMAGE=null;Ke.DEFAULT_MAPPING=su;Ke.DEFAULT_ANISOTROPY=1;var ue=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let y=(c+1)/2,v=(f+1)/2,w=(p+1)/2,M=(h+d)/4,S=(u+x)/4,C=(g+m)/4;return y>v&&y>w?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=M/n,r=S/n):v>w?v<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(v),n=M/s,r=C/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=S/r,s=C/r),this.set(n,s,r,e),this}let b=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-x)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ya=class extends bn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ue(0,0,t,e),this.scissorTest=!1,this.viewport=new ue(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Os("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===yi?xe:Ze),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Le,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ke(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new oo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},pn=class extends Ya{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},ao=class extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Za=class extends Ke{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=sn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var bt=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==d||c!==f||h!==g){let m=1-a,p=l*d+c*f+h*g+u*x,b=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let w=Math.sqrt(y),M=Math.atan2(w,p*b);m=Math.sin(m*M)/w,a=Math.sin(a*M)/w}let v=a*b;if(l=l*m+d*v,c=c*m+f*v,h=h*m+g*v,u=u*m+x*v,m===1-a){let w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Fe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(th.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(th.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ya.copy(this).projectOnVector(t),this.sub(ya)}reflect(t){return this.sub(ya.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Fe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ya=new A,th=new bt,$e=class{constructor(t=new A(1/0,1/0,1/0),e=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(cn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(cn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=cn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,cn):cn.fromBufferAttribute(r,o),cn.applyMatrix4(t.matrixWorld),this.expandByPoint(cn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Mr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Mr.copy(n.boundingBox)),Mr.applyMatrix4(t.matrixWorld),this.union(Mr)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,cn),cn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Cs),br.subVectors(this.max,Cs),Ui.subVectors(t.a,Cs),Di.subVectors(t.b,Cs),Oi.subVectors(t.c,Cs),Xn.subVectors(Di,Ui),qn.subVectors(Oi,Di),ci.subVectors(Ui,Oi);let e=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-ci.z,ci.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,ci.z,0,-ci.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-ci.y,ci.x,0];return!_a(e,Ui,Di,Oi,br)||(e=[1,0,0,0,1,0,0,0,1],!_a(e,Ui,Di,Oi,br))?!1:(wr.crossVectors(Xn,qn),e=[wr.x,wr.y,wr.z],_a(e,Ui,Di,Oi,br))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,cn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(cn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Tn=[new A,new A,new A,new A,new A,new A,new A,new A],cn=new A,Mr=new $e,Ui=new A,Di=new A,Oi=new A,Xn=new A,qn=new A,ci=new A,Cs=new A,br=new A,wr=new A,hi=new A;function _a(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){hi.fromArray(i,r);let a=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),l=t.dot(hi),c=e.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var dp=new $e,Rs=new A,va=new A,mn=class{constructor(t=new A,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):dp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Rs.subVectors(t,this.center);let e=Rs.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Rs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(va.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Rs.copy(t.center).add(va)),this.expandByPoint(Rs.copy(t.center).sub(va))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Cn=new A,Ma=new A,Sr=new A,$n=new A,ba=new A,Er=new A,wa=new A,Fn=class{constructor(t=new A,e=new A(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ma.copy(t).add(e).multiplyScalar(.5),Sr.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(Ma);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Sr),a=$n.dot(this.direction),l=-$n.dot(Sr),c=$n.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ma).addScaledVector(Sr,d),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);let n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){ba.subVectors(e,t),Er.subVectors(n,t),wa.crossVectors(ba,Er);let o=this.direction.dot(wa),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;$n.subVectors(this.origin,t);let l=a*this.direction.dot(Er.crossVectors($n,Er));if(l<0)return null;let c=a*this.direction.dot(ba.cross($n));if(c<0||l+c>o)return null;let h=-a*$n.dot(wa);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},it=class i{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Fi.setFromMatrixColumn(t,0).length(),r=1/Fi.setFromMatrixColumn(t,1).length(),o=1/Fi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){let d=o*h,f=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,g=c*h,x=c*u;e[0]=d+x*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,g=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*h,f=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-x*u}else if(t.order==="XZY"){let d=o*l,f=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(fp,t,pp)}lookAt(t,e,n){let s=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),Yn.crossVectors(n,en),Yn.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),Yn.crossVectors(n,en)),Yn.normalize(),Ar.crossVectors(en,Yn),s[0]=Yn.x,s[4]=Ar.x,s[8]=en.x,s[1]=Yn.y,s[5]=Ar.y,s[9]=en.y,s[2]=Yn.z,s[6]=Ar.z,s[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],b=n[3],y=n[7],v=n[11],w=n[15],M=s[0],S=s[4],C=s[8],_=s[12],E=s[1],D=s[5],V=s[9],Q=s[13],I=s[2],U=s[6],N=s[10],W=s[14],G=s[3],z=s[7],j=s[11],Z=s[15];return r[0]=o*M+a*E+l*I+c*G,r[4]=o*S+a*D+l*U+c*z,r[8]=o*C+a*V+l*N+c*j,r[12]=o*_+a*Q+l*W+c*Z,r[1]=h*M+u*E+d*I+f*G,r[5]=h*S+u*D+d*U+f*z,r[9]=h*C+u*V+d*N+f*j,r[13]=h*_+u*Q+d*W+f*Z,r[2]=g*M+x*E+m*I+p*G,r[6]=g*S+x*D+m*U+p*z,r[10]=g*C+x*V+m*N+p*j,r[14]=g*_+x*Q+m*W+p*Z,r[3]=b*M+y*E+v*I+w*G,r[7]=b*S+y*D+v*U+w*z,r[11]=b*C+y*V+v*N+w*j,r[15]=b*_+y*Q+v*W+w*Z,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],x=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+x*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],x=t[13],m=t[14],p=t[15],b=u*m*c-x*d*c+x*l*f-a*m*f-u*l*p+a*d*p,y=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,v=h*x*c-g*u*c+g*a*f-o*x*f-h*a*p+o*u*p,w=g*u*l-h*x*l-g*a*d+o*x*d+h*a*m-o*u*m,M=e*b+n*y+s*v+r*w;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/M;return t[0]=b*S,t[1]=(x*d*r-u*m*r-x*s*f+n*m*f+u*s*p-n*d*p)*S,t[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*p+n*l*p)*S,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*S,t[4]=y*S,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*S,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*S,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*S,t[8]=v*S,t[9]=(g*u*r-h*x*r-g*n*f+e*x*f+h*n*p-e*u*p)*S,t[10]=(o*x*r-g*a*r+g*n*c-e*x*c-o*n*p+e*a*p)*S,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*S,t[12]=w*S,t[13]=(h*x*s-g*u*s+g*n*d-e*x*d-h*n*m+e*u*m)*S,t[14]=(g*a*s-o*x*s-g*n*l+e*x*l+o*n*m-e*a*m)*S,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*S,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,x=o*h,m=o*u,p=a*u,b=l*c,y=l*h,v=l*u,w=n.x,M=n.y,S=n.z;return s[0]=(1-(x+p))*w,s[1]=(f+v)*w,s[2]=(g-y)*w,s[3]=0,s[4]=(f-v)*M,s[5]=(1-(d+p))*M,s[6]=(m+b)*M,s[7]=0,s[8]=(g+y)*S,s[9]=(m-b)*S,s[10]=(1-(d+x))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Fi.set(s[0],s[1],s[2]).length(),o=Fi.set(s[4],s[5],s[6]).length(),a=Fi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],hn.copy(this);let c=1/r,h=1/o,u=1/a;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=h,hn.elements[5]*=h,hn.elements[6]*=h,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,e.setFromRotationMatrix(hn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Dn){let l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),f,g;if(a===Dn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===no)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Dn){let l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h,g,x;if(a===Dn)g=(o+r)*u,x=-2*u;else if(a===no)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Fi=new A,hn=new it,fp=new A(0,0,0),pp=new A(1,1,1),Yn=new A,Ar=new A,en=new A,eh=new it,nh=new bt,ve=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Fe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Fe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Fe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Fe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Fe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Fe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return eh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(eh,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return nh.setFromEuler(this),this.setFromQuaternion(nh,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ve.DEFAULT_ORDER="XYZ";var Bs=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},mp=0,ih=new A,ki=new bt,Rn=new it,Tr=new A,Ps=new A,gp=new A,xp=new bt,sh=new A(1,0,0),rh=new A(0,1,0),oh=new A(0,0,1),yp={type:"added"},_p={type:"removed"},ce=class i extends bn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:mp++}),this.uuid=Si(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new A,e=new ve,n=new bt,s=new A(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new Xt}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bs,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.multiply(ki),this}rotateOnWorldAxis(t,e){return ki.setFromAxisAngle(t,e),this.quaternion.premultiply(ki),this}rotateX(t){return this.rotateOnAxis(sh,t)}rotateY(t){return this.rotateOnAxis(rh,t)}rotateZ(t){return this.rotateOnAxis(oh,t)}translateOnAxis(t,e){return ih.copy(t).applyQuaternion(this.quaternion),this.position.add(ih.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(sh,t)}translateY(t){return this.translateOnAxis(rh,t)}translateZ(t){return this.translateOnAxis(oh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Tr.copy(t):Tr.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Ps.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(Ps,Tr,this.up):Rn.lookAt(Tr,Ps,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),ki.setFromRotationMatrix(Rn),this.quaternion.premultiply(ki.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(yp)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(_p)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,t,gp),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ps,xp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};ce.DEFAULT_UP=new A(0,1,0);ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var un=new A,Pn=new A,Sa=new A,Ln=new A,zi=new A,Bi=new A,ah=new A,Ea=new A,Aa=new A,Ta=new A,Cr=!1,ji=class i{constructor(t=new A,e=new A,n=new A){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),un.subVectors(t,e),s.cross(un);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){un.subVectors(s,e),Pn.subVectors(n,e),Sa.subVectors(t,e);let o=un.dot(un),a=un.dot(Pn),l=un.dot(Sa),c=Pn.dot(Pn),h=Pn.dot(Sa),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getUV(t,e,n,s,r,o,a,l){return Cr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Cr=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(o,Ln.y),l.addScaledVector(a,Ln.z),l)}static isFrontFacing(t,e,n,s){return un.subVectors(n,e),Pn.subVectors(t,e),un.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return un.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),un.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Cr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Cr=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;zi.subVectors(s,n),Bi.subVectors(r,n),Ea.subVectors(t,n);let l=zi.dot(Ea),c=Bi.dot(Ea);if(l<=0&&c<=0)return e.copy(n);Aa.subVectors(t,s);let h=zi.dot(Aa),u=Bi.dot(Aa);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(zi,o);Ta.subVectors(t,r);let f=zi.dot(Ta),g=Bi.dot(Ta);if(g>=0&&f<=g)return e.copy(r);let x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Bi,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return ah.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(ah,a);let p=1/(m+x+d);return o=x*p,a=d*p,e.copy(n).addScaledVector(zi,o).addScaledVector(Bi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},xu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},Rr={h:0,s:0,l:0};function Ca(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Et=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=xe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=se.workingColorSpace){if(t=Pl(t,1),e=Fe(e,0,1),n=Fe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ca(o,r,t+1/3),this.g=Ca(o,r,t),this.b=Ca(o,r,t-1/3)}return se.toWorkingColorSpace(this,s),this}setStyle(t,e=xe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=xe){let n=xu[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=es(t.r),this.g=es(t.g),this.b=es(t.b),this}copyLinearToSRGB(t){return this.r=ga(t.r),this.g=ga(t.g),this.b=ga(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=xe){return se.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Fe(Oe.r*255,0,255))*65536+Math.round(Fe(Oe.g*255,0,255))*256+Math.round(Fe(Oe.b*255,0,255))}getHexString(t=xe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(Oe.copy(this),e);let n=Oe.r,s=Oe.g,r=Oe.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=xe){se.fromWorkingColorSpace(Oe.copy(this),t);let e=Oe.r,n=Oe.g,s=Oe.b;return t!==xe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(Rr);let n=Ds(Zn.h,Rr.h,e),s=Ds(Zn.s,Rr.s,e),r=Ds(Zn.l,Rr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Oe=new Et;Et.NAMES=xu;var vp=0,kn=class extends bn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:vp++}),this.uuid=Si(),this.name="",this.type="Material",this.blending=ts,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Va,this.blendDst=Ha,this.blendEquation=pi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Et(0,0,0),this.blendAlpha=0,this.depthFunc=jr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$c,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ii,this.stencilZFail=Ii,this.stencilZPass=Ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ts&&(n.blending=this.blending),this.side!==ti&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Va&&(n.blendSrc=this.blendSrc),this.blendDst!==Ha&&(n.blendDst=this.blendDst),this.blendEquation!==pi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==jr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$c&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ii&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ii&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ii&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Ie=class extends kn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Et(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=iu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var be=new A,Pr=new Lt,_e=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Yc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Pr.fromBufferAttribute(this,e),Pr.applyMatrix3(t),this.setXY(e,Pr.x,Pr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix3(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyMatrix4(t),this.setXYZ(e,be.x,be.y,be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.applyNormalMatrix(t),this.setXYZ(e,be.x,be.y,be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)be.fromBufferAttribute(this,e),be.transformDirection(t),this.setXYZ(e,be.x,be.y,be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Yc&&(t.usage=this.usage),t}};var _i=class extends _e{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var lo=class extends _e{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ht=class extends _e{constructor(t,e,n){super(new Float32Array(t),e,n)}};var Mp=0,ln=new it,Ra=new ce,Vi=new A,nn=new $e,Ls=new $e,Re=new A,ie=class i extends bn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mp++}),this.uuid=Si(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gu(t)?lo:_i)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Xt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,n){return ln.makeTranslation(t,e,n),this.applyMatrix4(ln),this}scale(t,e,n){return ln.makeScale(t,e,n),this.applyMatrix4(ln),this}lookAt(t){return Ra.lookAt(t),Ra.updateMatrix(),this.applyMatrix4(Ra.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Vi).negate(),this.translate(Vi.x,Vi.y,Vi.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ht(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $e);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new A,1/0);return}if(t){let n=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Ls.setFromBufferAttribute(a),this.morphTargetsRelative?(Re.addVectors(nn.min,Ls.min),nn.expandByPoint(Re),Re.addVectors(nn.max,Ls.max),nn.expandByPoint(Re)):(nn.expandByPoint(Ls.min),nn.expandByPoint(Ls.max))}nn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Re.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Re));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Re.fromBufferAttribute(a,c),l&&(Vi.fromBufferAttribute(t,c),Re.add(Vi)),s=Math.max(s,n.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _e(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<a;E++)c[E]=new A,h[E]=new A;let u=new A,d=new A,f=new A,g=new Lt,x=new Lt,m=new Lt,p=new A,b=new A;function y(E,D,V){u.fromArray(s,E*3),d.fromArray(s,D*3),f.fromArray(s,V*3),g.fromArray(o,E*2),x.fromArray(o,D*2),m.fromArray(o,V*2),d.sub(u),f.sub(u),x.sub(g),m.sub(g);let Q=1/(x.x*m.y-m.x*x.y);isFinite(Q)&&(p.copy(d).multiplyScalar(m.y).addScaledVector(f,-x.y).multiplyScalar(Q),b.copy(f).multiplyScalar(x.x).addScaledVector(d,-m.x).multiplyScalar(Q),c[E].add(p),c[D].add(p),c[V].add(p),h[E].add(b),h[D].add(b),h[V].add(b))}let v=this.groups;v.length===0&&(v=[{start:0,count:n.length}]);for(let E=0,D=v.length;E<D;++E){let V=v[E],Q=V.start,I=V.count;for(let U=Q,N=Q+I;U<N;U+=3)y(n[U+0],n[U+1],n[U+2])}let w=new A,M=new A,S=new A,C=new A;function _(E){S.fromArray(r,E*3),C.copy(S);let D=c[E];w.copy(D),w.sub(S.multiplyScalar(S.dot(D))).normalize(),M.crossVectors(C,D);let Q=M.dot(h[E])<0?-1:1;l[E*4]=w.x,l[E*4+1]=w.y,l[E*4+2]=w.z,l[E*4+3]=Q}for(let E=0,D=v.length;E<D;++E){let V=v[E],Q=V.start,I=V.count;for(let U=Q,N=Q+I;U<N;U+=3)_(n[U+0]),_(n[U+1]),_(n[U+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _e(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new A,r=new A,o=new A,a=new A,l=new A,c=new A,h=new A,u=new A;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new _e(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},lh=new it,ui=new Fn,Lr=new mn,ch=new A,Hi=new A,Gi=new A,Wi=new A,Pa=new A,Ir=new A,Nr=new Lt,Ur=new Lt,Dr=new Lt,hh=new A,uh=new A,dh=new A,Or=new A,Fr=new A,mt=class extends ce{constructor(t=new ie,e=new Ie){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Ir.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(Pa.fromBufferAttribute(u,t),o?Ir.addScaledVector(Pa,h):Ir.addScaledVector(Pa.sub(e),h))}e.add(Ir)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Lr.copy(n.boundingSphere),Lr.applyMatrix4(r),ui.copy(t.ray).recast(t.near),!(Lr.containsPoint(ui.origin)===!1&&(ui.intersectSphere(Lr,ch)===null||ui.origin.distanceToSquared(ch)>(t.far-t.near)**2))&&(lh.copy(r).invert(),ui.copy(t.ray).applyMatrix4(lh),!(n.boundingBox!==null&&ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ui)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let v=b,w=y;v<w;v+=3){let M=a.getX(v),S=a.getX(v+1),C=a.getX(v+2);s=kr(this,p,t,n,c,h,u,M,S,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let b=a.getX(m),y=a.getX(m+1),v=a.getX(m+2);s=kr(this,o,t,n,c,h,u,b,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let v=b,w=y;v<w;v+=3){let M=v,S=v+1,C=v+2;s=kr(this,p,t,n,c,h,u,M,S,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){let b=m,y=m+1,v=m+2;s=kr(this,o,t,n,c,h,u,b,y,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}};function bp(i,t,e,n,s,r,o,a){let l;if(t.side===je?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ti,a),l===null)return null;Fr.copy(a),Fr.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Fr);return c<e.near||c>e.far?null:{distance:c,point:Fr.clone(),object:i}}function kr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Hi),i.getVertexPosition(l,Gi),i.getVertexPosition(c,Wi);let h=bp(i,t,e,n,Hi,Gi,Wi,Or);if(h){s&&(Nr.fromBufferAttribute(s,a),Ur.fromBufferAttribute(s,l),Dr.fromBufferAttribute(s,c),h.uv=ji.getInterpolation(Or,Hi,Gi,Wi,Nr,Ur,Dr,new Lt)),r&&(Nr.fromBufferAttribute(r,a),Ur.fromBufferAttribute(r,l),Dr.fromBufferAttribute(r,c),h.uv1=ji.getInterpolation(Or,Hi,Gi,Wi,Nr,Ur,Dr,new Lt),h.uv2=h.uv1),o&&(hh.fromBufferAttribute(o,a),uh.fromBufferAttribute(o,l),dh.fromBufferAttribute(o,c),h.normal=ji.getInterpolation(Or,Hi,Gi,Wi,hh,uh,dh,new A),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new A,materialIndex:0};ji.getNormal(Hi,Gi,Wi,u.normal),h.face=u}return h}var Me=class i extends ie{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Ht(c,3)),this.setAttribute("normal",new Ht(h,3)),this.setAttribute("uv",new Ht(u,2));function g(x,m,p,b,y,v,w,M,S,C,_){let E=v/S,D=w/C,V=v/2,Q=w/2,I=M/2,U=S+1,N=C+1,W=0,G=0,z=new A;for(let j=0;j<N;j++){let Z=j*D-Q;for(let tt=0;tt<U;tt++){let F=tt*E-V;z[x]=F*b,z[m]=Z*y,z[p]=I,c.push(z.x,z.y,z.z),z[x]=0,z[m]=0,z[p]=M>0?1:-1,h.push(z.x,z.y,z.z),u.push(tt/S),u.push(1-j/C),W+=1}}for(let j=0;j<C;j++)for(let Z=0;Z<S;Z++){let tt=d+Z+U*j,F=d+Z+U*(j+1),H=d+(Z+1)+U*(j+1),J=d+(Z+1)+U*j;l.push(tt,F,J),l.push(F,H,J),G+=6}a.addGroup(f,G,_),f+=G,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function as(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Xe(i){let t={};for(let e=0;e<i.length;e++){let n=as(i[e]);for(let s in n)t[s]=n[s]}return t}function wp(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function yu(i){return i.getRenderTarget()===null?i.outputColorSpace:se.workingColorSpace}var Sp={clone:as,merge:Xe},Ep=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ap=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,zn=class extends kn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ep,this.fragmentShader=Ap,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=as(t.uniforms),this.uniformsGroups=wp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},co=class extends ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=Dn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},qe=class extends co{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=zs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Us*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(Us*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Us*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Xi=-90,qi=1,ja=class extends ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new qe(Xi,qi,t,e);s.layers=this.layers,this.add(s);let r=new qe(Xi,qi,t,e);r.layers=this.layers,this.add(r);let o=new qe(Xi,qi,t,e);o.layers=this.layers,this.add(o);let a=new qe(Xi,qi,t,e);a.layers=this.layers,this.add(a);let l=new qe(Xi,qi,t,e);l.layers=this.layers,this.add(l);let c=new qe(Xi,qi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Dn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===no)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},ho=class extends Ke{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:is,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Ka=class extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Os("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===yi?xe:Ze),this.texture=new ho(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Le}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Me(5,5,5),r=new zn({name:"CubemapFromEquirect",uniforms:as(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:je,blending:Kn});r.uniforms.tEquirect.value=e;let o=new mt(s,r),a=e.minFilter;return e.minFilter===Mn&&(e.minFilter=Le),new ja(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},La=new A,Tp=new A,Cp=new Xt,dn=class{constructor(t=new A(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=La.subVectors(n,e).cross(Tp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(La),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Cp.getNormalMatrix(t),s=this.coplanarPoint(La).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},di=new mn,zr=new A,Vs=class{constructor(t=new dn,e=new dn,n=new dn,s=new dn,r=new dn,o=new dn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Dn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],x=s[10],m=s[11],p=s[12],b=s[13],y=s[14],v=s[15];if(n[0].setComponents(l-r,d-c,m-f,v-p).normalize(),n[1].setComponents(l+r,d+c,m+f,v+p).normalize(),n[2].setComponents(l+o,d+h,m+g,v+b).normalize(),n[3].setComponents(l-o,d-h,m-g,v-b).normalize(),n[4].setComponents(l-a,d-u,m-x,v-y).normalize(),e===Dn)n[5].setComponents(l+a,d+u,m+x,v+y).normalize();else if(e===no)n[5].setComponents(a,u,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(t){return di.center.set(0,0,0),di.radius=.7071067811865476,di.applyMatrix4(t.matrixWorld),this.intersectsSphere(di)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(zr.x=s.normal.x>0?t.max.x:t.min.x,zr.y=s.normal.y>0?t.max.y:t.min.y,zr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(zr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function _u(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Rp(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,h){let u=c.array,d=c.usage,f=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),c.onUploadCallback();let x;if(u instanceof Float32Array)x=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)x=i.SHORT;else if(u instanceof Uint32Array)x=i.UNSIGNED_INT;else if(u instanceof Int32Array)x=i.INT;else if(u instanceof Int8Array)x=i.BYTE;else if(u instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:x,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,h,u){let d=h.array,f=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),f.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let x=0,m=g.length;x<m;x++){let p=g[x];e?i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d,p.start,p.count):i.bufferSubData(u,p.start*d.BYTES_PER_ELEMENT,d.subarray(p.start,p.start+p.count))}h.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(u,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),h.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){let d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);if(u===void 0)n.set(c,s(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(u.buffer,c,h),u.version=c.version}}return{get:o,remove:a,update:l}}var Hs=class i extends ie{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){let b=p*d-o;for(let y=0;y<c;y++){let v=y*u-r;g.push(v,-b,0),x.push(0,0,1),m.push(y/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){let y=b+c*p,v=b+c*(p+1),w=b+1+c*(p+1),M=b+1+c*p;f.push(y,v,M),f.push(v,w,M)}this.setIndex(f),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Pp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lp=`#ifdef USE_ALPHAHASH
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
#endif`,Ip=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Np=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Up=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Op=`#ifdef USE_AOMAP
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
#endif`,Fp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,kp=`#ifdef USE_BATCHING
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
#endif`,zp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Bp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gp=`#ifdef USE_IRIDESCENCE
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
#endif`,Wp=`#ifdef USE_BUMPMAP
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
#endif`,Xp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,$p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Jp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Qp=`#define PI 3.141592653589793
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
} // validated`,tm=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,em=`vec3 transformedNormal = objectNormal;
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
#endif`,nm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,im=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,sm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,rm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,om="gl_FragColor = linearToOutputTexel( gl_FragColor );",am=`
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
}`,lm=`#ifdef USE_ENVMAP
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
#endif`,cm=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hm=`#ifdef USE_ENVMAP
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
#endif`,um=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dm=`#ifdef USE_ENVMAP
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
#endif`,fm=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,pm=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,mm=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gm=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xm=`#ifdef USE_GRADIENTMAP
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
}`,ym=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,_m=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vm=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bm=`uniform bool receiveShadow;
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
#endif`,wm=`#ifdef USE_ENVMAP
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
#endif`,Sm=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Em=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Am=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Tm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cm=`PhysicalMaterial material;
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
#endif`,Rm=`struct PhysicalMaterial {
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
}`,Pm=`
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
#endif`,Lm=`#if defined( RE_IndirectDiffuse )
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
#endif`,Im=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Nm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Um=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Om=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Fm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,km=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Bm=`#if defined( USE_POINTS_UV )
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
#endif`,Vm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wm=`#ifdef USE_MORPHNORMALS
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
#endif`,Xm=`#ifdef USE_MORPHTARGETS
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
#endif`,qm=`#ifdef USE_MORPHTARGETS
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
#endif`,$m=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ym=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Zm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Km=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Jm=`#ifdef USE_NORMALMAP
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
#endif`,Qm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,eg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ng=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ig=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,rg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,og=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ag=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,hg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ug=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,fg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pg=`float getShadowMask() {
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
}`,mg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gg=`#ifdef USE_SKINNING
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
#endif`,xg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yg=`#ifdef USE_SKINNING
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
#endif`,_g=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Mg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,wg=`#ifdef USE_TRANSMISSION
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
#endif`,Sg=`#ifdef USE_TRANSMISSION
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
#endif`,Eg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ag=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Rg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Pg=`uniform sampler2D t2D;
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
}`,Lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ig=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dg=`#include <common>
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
}`,Og=`#if DEPTH_PACKING == 3200
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
}`,Fg=`#define DISTANCE
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
}`,kg=`#define DISTANCE
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
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Bg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vg=`uniform float scale;
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
}`,Hg=`uniform vec3 diffuse;
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
}`,Gg=`#include <common>
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
}`,Wg=`uniform vec3 diffuse;
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
}`,Xg=`#define LAMBERT
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
}`,qg=`#define LAMBERT
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
}`,$g=`#define MATCAP
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
}`,Yg=`#define MATCAP
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
}`,Zg=`#define NORMAL
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
}`,jg=`#define NORMAL
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
}`,Kg=`#define PHONG
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
}`,Jg=`#define PHONG
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
}`,Qg=`#define STANDARD
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
}`,t0=`#define STANDARD
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
}`,e0=`#define TOON
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
}`,n0=`#define TOON
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
}`,i0=`uniform float size;
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
}`,s0=`uniform vec3 diffuse;
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
}`,r0=`#include <common>
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
}`,o0=`uniform vec3 color;
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
}`,a0=`uniform float rotation;
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
}`,l0=`uniform vec3 diffuse;
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
}`,Wt={alphahash_fragment:Pp,alphahash_pars_fragment:Lp,alphamap_fragment:Ip,alphamap_pars_fragment:Np,alphatest_fragment:Up,alphatest_pars_fragment:Dp,aomap_fragment:Op,aomap_pars_fragment:Fp,batching_pars_vertex:kp,batching_vertex:zp,begin_vertex:Bp,beginnormal_vertex:Vp,bsdfs:Hp,iridescence_fragment:Gp,bumpmap_pars_fragment:Wp,clipping_planes_fragment:Xp,clipping_planes_pars_fragment:qp,clipping_planes_pars_vertex:$p,clipping_planes_vertex:Yp,color_fragment:Zp,color_pars_fragment:jp,color_pars_vertex:Kp,color_vertex:Jp,common:Qp,cube_uv_reflection_fragment:tm,defaultnormal_vertex:em,displacementmap_pars_vertex:nm,displacementmap_vertex:im,emissivemap_fragment:sm,emissivemap_pars_fragment:rm,colorspace_fragment:om,colorspace_pars_fragment:am,envmap_fragment:lm,envmap_common_pars_fragment:cm,envmap_pars_fragment:hm,envmap_pars_vertex:um,envmap_physical_pars_fragment:wm,envmap_vertex:dm,fog_vertex:fm,fog_pars_vertex:pm,fog_fragment:mm,fog_pars_fragment:gm,gradientmap_pars_fragment:xm,lightmap_fragment:ym,lightmap_pars_fragment:_m,lights_lambert_fragment:vm,lights_lambert_pars_fragment:Mm,lights_pars_begin:bm,lights_toon_fragment:Sm,lights_toon_pars_fragment:Em,lights_phong_fragment:Am,lights_phong_pars_fragment:Tm,lights_physical_fragment:Cm,lights_physical_pars_fragment:Rm,lights_fragment_begin:Pm,lights_fragment_maps:Lm,lights_fragment_end:Im,logdepthbuf_fragment:Nm,logdepthbuf_pars_fragment:Um,logdepthbuf_pars_vertex:Dm,logdepthbuf_vertex:Om,map_fragment:Fm,map_pars_fragment:km,map_particle_fragment:zm,map_particle_pars_fragment:Bm,metalnessmap_fragment:Vm,metalnessmap_pars_fragment:Hm,morphcolor_vertex:Gm,morphnormal_vertex:Wm,morphtarget_pars_vertex:Xm,morphtarget_vertex:qm,normal_fragment_begin:$m,normal_fragment_maps:Ym,normal_pars_fragment:Zm,normal_pars_vertex:jm,normal_vertex:Km,normalmap_pars_fragment:Jm,clearcoat_normal_fragment_begin:Qm,clearcoat_normal_fragment_maps:tg,clearcoat_pars_fragment:eg,iridescence_pars_fragment:ng,opaque_fragment:ig,packing:sg,premultiplied_alpha_fragment:rg,project_vertex:og,dithering_fragment:ag,dithering_pars_fragment:lg,roughnessmap_fragment:cg,roughnessmap_pars_fragment:hg,shadowmap_pars_fragment:ug,shadowmap_pars_vertex:dg,shadowmap_vertex:fg,shadowmask_pars_fragment:pg,skinbase_vertex:mg,skinning_pars_vertex:gg,skinning_vertex:xg,skinnormal_vertex:yg,specularmap_fragment:_g,specularmap_pars_fragment:vg,tonemapping_fragment:Mg,tonemapping_pars_fragment:bg,transmission_fragment:wg,transmission_pars_fragment:Sg,uv_pars_fragment:Eg,uv_pars_vertex:Ag,uv_vertex:Tg,worldpos_vertex:Cg,background_vert:Rg,background_frag:Pg,backgroundCube_vert:Lg,backgroundCube_frag:Ig,cube_vert:Ng,cube_frag:Ug,depth_vert:Dg,depth_frag:Og,distanceRGBA_vert:Fg,distanceRGBA_frag:kg,equirect_vert:zg,equirect_frag:Bg,linedashed_vert:Vg,linedashed_frag:Hg,meshbasic_vert:Gg,meshbasic_frag:Wg,meshlambert_vert:Xg,meshlambert_frag:qg,meshmatcap_vert:$g,meshmatcap_frag:Yg,meshnormal_vert:Zg,meshnormal_frag:jg,meshphong_vert:Kg,meshphong_frag:Jg,meshphysical_vert:Qg,meshphysical_frag:t0,meshtoon_vert:e0,meshtoon_frag:n0,points_vert:i0,points_frag:s0,shadow_vert:r0,shadow_frag:o0,sprite_vert:a0,sprite_frag:l0},pt={common:{diffuse:{value:new Et(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new Lt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Et(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Et(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new Et(16777215)},opacity:{value:1},center:{value:new Lt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},vn={basic:{uniforms:Xe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Wt.meshbasic_vert,fragmentShader:Wt.meshbasic_frag},lambert:{uniforms:Xe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Et(0)}}]),vertexShader:Wt.meshlambert_vert,fragmentShader:Wt.meshlambert_frag},phong:{uniforms:Xe([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Et(0)},specular:{value:new Et(1118481)},shininess:{value:30}}]),vertexShader:Wt.meshphong_vert,fragmentShader:Wt.meshphong_frag},standard:{uniforms:Xe([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Et(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag},toon:{uniforms:Xe([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Et(0)}}]),vertexShader:Wt.meshtoon_vert,fragmentShader:Wt.meshtoon_frag},matcap:{uniforms:Xe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Wt.meshmatcap_vert,fragmentShader:Wt.meshmatcap_frag},points:{uniforms:Xe([pt.points,pt.fog]),vertexShader:Wt.points_vert,fragmentShader:Wt.points_frag},dashed:{uniforms:Xe([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Wt.linedashed_vert,fragmentShader:Wt.linedashed_frag},depth:{uniforms:Xe([pt.common,pt.displacementmap]),vertexShader:Wt.depth_vert,fragmentShader:Wt.depth_frag},normal:{uniforms:Xe([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Wt.meshnormal_vert,fragmentShader:Wt.meshnormal_frag},sprite:{uniforms:Xe([pt.sprite,pt.fog]),vertexShader:Wt.sprite_vert,fragmentShader:Wt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Wt.background_vert,fragmentShader:Wt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Wt.backgroundCube_vert,fragmentShader:Wt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Wt.cube_vert,fragmentShader:Wt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Wt.equirect_vert,fragmentShader:Wt.equirect_frag},distanceRGBA:{uniforms:Xe([pt.common,pt.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Wt.distanceRGBA_vert,fragmentShader:Wt.distanceRGBA_frag},shadow:{uniforms:Xe([pt.lights,pt.fog,{color:{value:new Et(0)},opacity:{value:1}}]),vertexShader:Wt.shadow_vert,fragmentShader:Wt.shadow_frag}};vn.physical={uniforms:Xe([vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new Lt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new Et(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new Lt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new Et(0)},specularColor:{value:new Et(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new Lt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Wt.meshphysical_vert,fragmentShader:Wt.meshphysical_frag};var Br={r:0,b:0,g:0};function c0(i,t,e,n,s,r,o){let a=new Et(0),l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(m,p){let b=!1,y=p.isScene===!0?p.background:null;y&&y.isTexture&&(y=(p.backgroundBlurriness>0?e:t).get(y)),y===null?x(a,l):y&&y.isColor&&(x(y,1),b=!0);let v=i.xr.getEnvironmentBlendMode();v==="additive"?n.buffers.color.setClear(0,0,0,1,o):v==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||b)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),y&&(y.isCubeTexture||y.mapping===To)?(h===void 0&&(h=new mt(new Me(1,1,1),new zn({name:"BackgroundCubeMaterial",uniforms:as(vn.backgroundCube.uniforms),vertexShader:vn.backgroundCube.vertexShader,fragmentShader:vn.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,M,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=p.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,h.material.toneMapped=se.getTransfer(y.colorSpace)!==le,(u!==y||d!==y.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new mt(new Hs(2,2),new zn({name:"BackgroundMaterial",uniforms:as(vn.background.uniforms),vertexShader:vn.background.vertexShader,fragmentShader:vn.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=p.backgroundIntensity,c.material.toneMapped=se.getTransfer(y.colorSpace)!==le,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,f=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function x(m,p){m.getRGB(Br,yu(i)),n.buffers.color.setClear(Br.r,Br.g,Br.b,p,o)}return{getClearColor:function(){return a},setClearColor:function(m,p=1){a.set(m),l=p,x(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,x(a,l)},render:g}}function h0(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=m(null),c=l,h=!1;function u(I,U,N,W,G){let z=!1;if(o){let j=x(W,N,U);c!==j&&(c=j,f(c.object)),z=p(I,W,N,G),z&&b(I,W,N,G)}else{let j=U.wireframe===!0;(c.geometry!==W.id||c.program!==N.id||c.wireframe!==j)&&(c.geometry=W.id,c.program=N.id,c.wireframe=j,z=!0)}G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,C(I,U,N,W),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function x(I,U,N){let W=N.wireframe===!0,G=a[I.id];G===void 0&&(G={},a[I.id]=G);let z=G[U.id];z===void 0&&(z={},G[U.id]=z);let j=z[W];return j===void 0&&(j=m(d()),z[W]=j),j}function m(I){let U=[],N=[],W=[];for(let G=0;G<s;G++)U[G]=0,N[G]=0,W[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:N,attributeDivisors:W,object:I,attributes:{},index:null}}function p(I,U,N,W){let G=c.attributes,z=U.attributes,j=0,Z=N.getAttributes();for(let tt in Z)if(Z[tt].location>=0){let H=G[tt],J=z[tt];if(J===void 0&&(tt==="instanceMatrix"&&I.instanceMatrix&&(J=I.instanceMatrix),tt==="instanceColor"&&I.instanceColor&&(J=I.instanceColor)),H===void 0||H.attribute!==J||J&&H.data!==J.data)return!0;j++}return c.attributesNum!==j||c.index!==W}function b(I,U,N,W){let G={},z=U.attributes,j=0,Z=N.getAttributes();for(let tt in Z)if(Z[tt].location>=0){let H=z[tt];H===void 0&&(tt==="instanceMatrix"&&I.instanceMatrix&&(H=I.instanceMatrix),tt==="instanceColor"&&I.instanceColor&&(H=I.instanceColor));let J={};J.attribute=H,H&&H.data&&(J.data=H.data),G[tt]=J,j++}c.attributes=G,c.attributesNum=j,c.index=W}function y(){let I=c.newAttributes;for(let U=0,N=I.length;U<N;U++)I[U]=0}function v(I){w(I,0)}function w(I,U){let N=c.newAttributes,W=c.enabledAttributes,G=c.attributeDivisors;N[I]=1,W[I]===0&&(i.enableVertexAttribArray(I),W[I]=1),G[I]!==U&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,U),G[I]=U)}function M(){let I=c.newAttributes,U=c.enabledAttributes;for(let N=0,W=U.length;N<W;N++)U[N]!==I[N]&&(i.disableVertexAttribArray(N),U[N]=0)}function S(I,U,N,W,G,z,j){j===!0?i.vertexAttribIPointer(I,U,N,G,z):i.vertexAttribPointer(I,U,N,W,G,z)}function C(I,U,N,W){if(n.isWebGL2===!1&&(I.isInstancedMesh||W.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;y();let G=W.attributes,z=N.getAttributes(),j=U.defaultAttributeValues;for(let Z in z){let tt=z[Z];if(tt.location>=0){let F=G[Z];if(F===void 0&&(Z==="instanceMatrix"&&I.instanceMatrix&&(F=I.instanceMatrix),Z==="instanceColor"&&I.instanceColor&&(F=I.instanceColor)),F!==void 0){let H=F.normalized,J=F.itemSize,k=e.get(F);if(k===void 0)continue;let et=k.buffer,gt=k.type,wt=k.bytesPerElement,Mt=n.isWebGL2===!0&&(gt===i.INT||gt===i.UNSIGNED_INT||F.gpuType===ru);if(F.isInterleavedBufferAttribute){let Gt=F.data,X=Gt.stride,me=F.offset;if(Gt.isInstancedInterleavedBuffer){for(let At=0;At<tt.locationSize;At++)w(tt.location+At,Gt.meshPerAttribute);I.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Gt.meshPerAttribute*Gt.count)}else for(let At=0;At<tt.locationSize;At++)v(tt.location+At);i.bindBuffer(i.ARRAY_BUFFER,et);for(let At=0;At<tt.locationSize;At++)S(tt.location+At,J/tt.locationSize,gt,H,X*wt,(me+J/tt.locationSize*At)*wt,Mt)}else{if(F.isInstancedBufferAttribute){for(let Gt=0;Gt<tt.locationSize;Gt++)w(tt.location+Gt,F.meshPerAttribute);I.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let Gt=0;Gt<tt.locationSize;Gt++)v(tt.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,et);for(let Gt=0;Gt<tt.locationSize;Gt++)S(tt.location+Gt,J/tt.locationSize,gt,H,J*wt,J/tt.locationSize*Gt*wt,Mt)}}else if(j!==void 0){let H=j[Z];if(H!==void 0)switch(H.length){case 2:i.vertexAttrib2fv(tt.location,H);break;case 3:i.vertexAttrib3fv(tt.location,H);break;case 4:i.vertexAttrib4fv(tt.location,H);break;default:i.vertexAttrib1fv(tt.location,H)}}}}M()}function _(){V();for(let I in a){let U=a[I];for(let N in U){let W=U[N];for(let G in W)g(W[G].object),delete W[G];delete U[N]}delete a[I]}}function E(I){if(a[I.id]===void 0)return;let U=a[I.id];for(let N in U){let W=U[N];for(let G in W)g(W[G].object),delete W[G];delete U[N]}delete a[I.id]}function D(I){for(let U in a){let N=a[U];if(N[I.id]===void 0)continue;let W=N[I.id];for(let G in W)g(W[G].object),delete W[G];delete N[I.id]}}function V(){Q(),h=!0,c!==l&&(c=l,f(c.object))}function Q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:V,resetDefaultState:Q,dispose:_,releaseStatesOfGeometry:E,releaseStatesOfProgram:D,initAttributes:y,enableAttribute:v,disableUnusedAttributes:M}}function u0(i,t,e,n){let s=n.isWebGL2,r;function o(h){r=h}function a(h,u){i.drawArrays(r,h,u),e.update(u,r,1)}function l(h,u,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,h,u,d),e.update(u,r,d)}function c(h,u,d){if(d===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{f.multiDrawArraysWEBGL(r,h,0,u,0,d);let g=0;for(let x=0;x<d;x++)g+=u[x];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function d0(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(S){if(S==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),x=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),p=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,v=o||t.has("OES_texture_float"),w=y&&v,M=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:x,maxVertexUniforms:m,maxVaryings:p,maxFragmentUniforms:b,vertexTextures:y,floatFragmentTextures:v,floatVertexTextures:w,maxSamples:M}}function f0(i){let t=this,e=null,n=0,s=!1,r=!1,o=new dn,a=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{let b=r?0:n,y=b*4,v=p.clippingState||null;l.value=v,v=h(g,d,y,f);for(let w=0;w!==y;++w)v[w]=e[w];p.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){let x=u!==null?u.length:0,m=null;if(x!==0){if(m=l.value,g!==!0||m===null){let p=f+x*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,v=f;y!==x;++y,v+=4)o.copy(u[y]).applyMatrix4(b,a),o.normal.toArray(m,v),m[v+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function p0(i){let t=new WeakMap;function e(o,a){return a===Ga?o.mapping=is:a===Wa&&(o.mapping=ss),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Ga||a===Wa)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new Ka(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var uo=class extends co{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ki=4,fh=[.125,.215,.35,.446,.526,.582],mi=20,Ia=new uo,ph=new Et,Na=null,Ua=0,Da=0,fi=(1+Math.sqrt(5))/2,$i=1/fi,mh=[new A(1,1,1),new A(-1,1,1),new A(1,1,-1),new A(-1,1,-1),new A(0,fi,$i),new A(0,fi,-$i),new A($i,0,fi),new A(-$i,0,fi),new A(fi,$i,0),new A(-fi,$i,0)],fo=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Na=this._renderer.getRenderTarget(),Ua=this._renderer.getActiveCubeFace(),Da=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=yh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=xh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Na,Ua,Da),t.scissorTest=!1,Vr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Na=this._renderer.getRenderTarget(),Ua=this._renderer.getActiveCubeFace(),Da=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Le,minFilter:Le,generateMipmaps:!1,type:ks,format:Ye,colorSpace:On,depthBuffer:!1},s=gh(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gh(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=m0(r)),this._blurMaterial=g0(r,t,e)}return s}_compileMaterial(t){let e=new mt(this._lodPlanes[0],t);this._renderer.compile(e,Ia)}_sceneToCubeUV(t,e,n,s){let a=new qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ph),h.toneMapping=Jn,h.autoClear=!1;let f=new Ie({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),g=new mt(new Me,f),x=!1,m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,x=!0):(f.color.copy(ph),x=!0);for(let p=0;p<6;p++){let b=p%3;b===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):b===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));let y=this._cubeSize;Vr(s,b*y,p>2?y:0,y,y),h.setRenderTarget(s),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===is||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=yh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=xh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Vr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Ia)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=mh[(s-1)%mh.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,u=new mt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*mi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):mi;m>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${mi}`);let p=[],b=0;for(let S=0;S<mi;++S){let C=S/x,_=Math.exp(-C*C/2);p.push(_),S===0?b+=_:S<m&&(b+=2*_)}for(let S=0;S<p.length;S++)p[S]=p[S]/b;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-n;let v=this._sizeLods[s],w=3*v*(s>y-Ki?s-y+Ki:0),M=4*(this._cubeSize-v);Vr(e,w,M,3*v,2*v),l.setRenderTarget(e),l.render(u,Ia)}};function m0(i){let t=[],e=[],n=[],s=i,r=i-Ki+1+fh.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ki?l=fh[o-i+Ki-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,m=2,p=1,b=new Float32Array(x*g*f),y=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let M=0;M<f;M++){let S=M%3*2/3-1,C=M>2?0:-1,_=[S,C,0,S+2/3,C,0,S+2/3,C+1,0,S,C,0,S+2/3,C+1,0,S,C+1,0];b.set(_,x*g*M),y.set(d,m*g*M);let E=[M,M,M,M,M,M];v.set(E,p*g*M)}let w=new ie;w.setAttribute("position",new _e(b,x)),w.setAttribute("uv",new _e(y,m)),w.setAttribute("faceIndex",new _e(v,p)),t.push(w),s>Ki&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function gh(i,t,e){let n=new pn(i,t,e);return n.texture.mapping=To,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function g0(i,t,e){let n=new Float32Array(mi),s=new A(0,1,0);return new zn({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function xh(){return new zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ll(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function yh(){return new zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ll(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Ll(){return`

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
	`}function x0(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Ga||l===Wa,h=l===is||l===ss;if(c||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new fo(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{let u=a.image;if(c&&u&&u.height>0||h&&u&&s(u)){e===null&&(e=new fo(i));let d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function y0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function _0(i,t,e,n){let s={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let x=d.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)t.remove(x[m])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){let d=u.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let f=u.morphAttributes;for(let g in f){let x=f[g];for(let m=0,p=x.length;m<p;m++)t.update(x[m],i.ARRAY_BUFFER)}}function c(u){let d=[],f=u.index,g=u.attributes.position,x=0;if(f!==null){let b=f.array;x=f.version;for(let y=0,v=b.length;y<v;y+=3){let w=b[y+0],M=b[y+1],S=b[y+2];d.push(w,M,M,S,S,w)}}else if(g!==void 0){let b=g.array;x=g.version;for(let y=0,v=b.length/3-1;y<v;y+=3){let w=y+0,M=y+1,S=y+2;d.push(w,M,M,S,S,w)}}else return;let m=new(gu(d)?lo:_i)(d,1);m.version=x;let p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function v0(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function h(f,g){i.drawElements(r,g,a,f*l),e.update(g,r,1)}function u(f,g,x){if(x===0)return;let m,p;if(s)m=i,p="drawElementsInstanced";else if(m=t.get("ANGLE_instanced_arrays"),p="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[p](r,g,a,f*l,x),e.update(g,r,x)}function d(f,g,x){if(x===0)return;let m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<x;p++)this.render(f[p]/l,g[p]);else{m.multiDrawElementsWEBGL(r,g,0,a,f,0,x);let p=0;for(let b=0;b<x;b++)p+=g[b];e.update(p,r,1)}}this.setMode=o,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function M0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function b0(i,t){return i[0]-t[0]}function w0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function S0(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new ue,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,h,u){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let f=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=f!==void 0?f.length:0,x=r.get(h);if(x===void 0||x.count!==g){let I=function(){V.dispose(),r.delete(h),h.removeEventListener("dispose",I)};x!==void 0&&x.texture.dispose();let b=h.morphAttributes.position!==void 0,y=h.morphAttributes.normal!==void 0,v=h.morphAttributes.color!==void 0,w=h.morphAttributes.position||[],M=h.morphAttributes.normal||[],S=h.morphAttributes.color||[],C=0;b===!0&&(C=1),y===!0&&(C=2),v===!0&&(C=3);let _=h.attributes.position.count*C,E=1;_>t.maxTextureSize&&(E=Math.ceil(_/t.maxTextureSize),_=t.maxTextureSize);let D=new Float32Array(_*E*4*g),V=new ao(D,_,E,g);V.type=Un,V.needsUpdate=!0;let Q=C*4;for(let U=0;U<g;U++){let N=w[U],W=M[U],G=S[U],z=_*E*4*U;for(let j=0;j<N.count;j++){let Z=j*Q;b===!0&&(o.fromBufferAttribute(N,j),D[z+Z+0]=o.x,D[z+Z+1]=o.y,D[z+Z+2]=o.z,D[z+Z+3]=0),y===!0&&(o.fromBufferAttribute(W,j),D[z+Z+4]=o.x,D[z+Z+5]=o.y,D[z+Z+6]=o.z,D[z+Z+7]=0),v===!0&&(o.fromBufferAttribute(G,j),D[z+Z+8]=o.x,D[z+Z+9]=o.y,D[z+Z+10]=o.z,D[z+Z+11]=G.itemSize===4?o.w:1)}}x={count:g,texture:V,size:new Lt(_,E)},r.set(h,x),h.addEventListener("dispose",I)}let m=0;for(let b=0;b<d.length;b++)m+=d[b];let p=h.morphTargetsRelative?1:1-m;u.getUniforms().setValue(i,"morphTargetBaseInfluence",p),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",x.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",x.size)}else{let f=d===void 0?0:d.length,g=n[h.id];if(g===void 0||g.length!==f){g=[];for(let y=0;y<f;y++)g[y]=[y,0];n[h.id]=g}for(let y=0;y<f;y++){let v=g[y];v[0]=y,v[1]=d[y]}g.sort(w0);for(let y=0;y<8;y++)y<f&&g[y][1]?(a[y][0]=g[y][0],a[y][1]=g[y][1]):(a[y][0]=Number.MAX_SAFE_INTEGER,a[y][1]=0);a.sort(b0);let x=h.morphAttributes.position,m=h.morphAttributes.normal,p=0;for(let y=0;y<8;y++){let v=a[y],w=v[0],M=v[1];w!==Number.MAX_SAFE_INTEGER&&M?(x&&h.getAttribute("morphTarget"+y)!==x[w]&&h.setAttribute("morphTarget"+y,x[w]),m&&h.getAttribute("morphNormal"+y)!==m[w]&&h.setAttribute("morphNormal"+y,m[w]),s[y]=M,p+=M):(x&&h.hasAttribute("morphTarget"+y)===!0&&h.deleteAttribute("morphTarget"+y),m&&h.hasAttribute("morphNormal"+y)===!0&&h.deleteAttribute("morphNormal"+y),s[y]=0)}let b=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",b),u.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function E0(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var po=class extends Ke{constructor(t,e,n,s,r,o,a,l,c,h){if(h=h!==void 0?h:xi,h!==xi&&h!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===xi&&(n=jn),n===void 0&&h===os&&(n=gi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Pe,this.minFilter=l!==void 0?l:Pe,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},vu=new Ke,Mu=new po(1,1);Mu.compareFunction=pu;var bu=new ao,wu=new Za,Su=new ho,_h=[],vh=[],Mh=new Float32Array(16),bh=new Float32Array(9),wh=new Float32Array(4);function fs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=_h[s];if(r===void 0&&(r=new Float32Array(s),_h[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ae(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ro(i,t){let e=vh[t];e===void 0&&(e=new Int32Array(t),vh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function A0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function T0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),Ae(e,t)}}function C0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),Ae(e,t)}}function R0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),Ae(e,t)}}function P0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;wh.set(n),i.uniformMatrix2fv(this.addr,!1,wh),Ae(e,n)}}function L0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;bh.set(n),i.uniformMatrix3fv(this.addr,!1,bh),Ae(e,n)}}function I0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ae(e,t)}else{if(Ee(e,n))return;Mh.set(n),i.uniformMatrix4fv(this.addr,!1,Mh),Ae(e,n)}}function N0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function U0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),Ae(e,t)}}function D0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),Ae(e,t)}}function O0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),Ae(e,t)}}function F0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function k0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),Ae(e,t)}}function z0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),Ae(e,t)}}function B0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),Ae(e,t)}}function V0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?Mu:vu;e.setTexture2D(t||r,s)}function H0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||wu,s)}function G0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Su,s)}function W0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||bu,s)}function X0(i){switch(i){case 5126:return A0;case 35664:return T0;case 35665:return C0;case 35666:return R0;case 35674:return P0;case 35675:return L0;case 35676:return I0;case 5124:case 35670:return N0;case 35667:case 35671:return U0;case 35668:case 35672:return D0;case 35669:case 35673:return O0;case 5125:return F0;case 36294:return k0;case 36295:return z0;case 36296:return B0;case 35678:case 36198:case 36298:case 36306:case 35682:return V0;case 35679:case 36299:case 36307:return H0;case 35680:case 36300:case 36308:case 36293:return G0;case 36289:case 36303:case 36311:case 36292:return W0}}function q0(i,t){i.uniform1fv(this.addr,t)}function $0(i,t){let e=fs(t,this.size,2);i.uniform2fv(this.addr,e)}function Y0(i,t){let e=fs(t,this.size,3);i.uniform3fv(this.addr,e)}function Z0(i,t){let e=fs(t,this.size,4);i.uniform4fv(this.addr,e)}function j0(i,t){let e=fs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function K0(i,t){let e=fs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function J0(i,t){let e=fs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Q0(i,t){i.uniform1iv(this.addr,t)}function tx(i,t){i.uniform2iv(this.addr,t)}function ex(i,t){i.uniform3iv(this.addr,t)}function nx(i,t){i.uniform4iv(this.addr,t)}function ix(i,t){i.uniform1uiv(this.addr,t)}function sx(i,t){i.uniform2uiv(this.addr,t)}function rx(i,t){i.uniform3uiv(this.addr,t)}function ox(i,t){i.uniform4uiv(this.addr,t)}function ax(i,t,e){let n=this.cache,s=t.length,r=Ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||vu,r[o])}function lx(i,t,e){let n=this.cache,s=t.length,r=Ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||wu,r[o])}function cx(i,t,e){let n=this.cache,s=t.length,r=Ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Su,r[o])}function hx(i,t,e){let n=this.cache,s=t.length,r=Ro(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),Ae(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||bu,r[o])}function ux(i){switch(i){case 5126:return q0;case 35664:return $0;case 35665:return Y0;case 35666:return Z0;case 35674:return j0;case 35675:return K0;case 35676:return J0;case 5124:case 35670:return Q0;case 35667:case 35671:return tx;case 35668:case 35672:return ex;case 35669:case 35673:return nx;case 5125:return ix;case 36294:return sx;case 36295:return rx;case 36296:return ox;case 35678:case 36198:case 36298:case 36306:case 35682:return ax;case 35679:case 36299:case 36307:return lx;case 35680:case 36300:case 36308:case 36293:return cx;case 36289:case 36303:case 36311:case 36292:return hx}}var Ja=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=X0(e.type)}},Qa=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ux(e.type)}},tl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Oa=/(\w+)(\])?(\[|\.)?/g;function Sh(i,t){i.seq.push(t),i.map[t.id]=t}function dx(i,t,e){let n=i.name,s=n.length;for(Oa.lastIndex=0;;){let r=Oa.exec(n),o=Oa.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Sh(e,c===void 0?new Ja(a,i,t):new Qa(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new tl(a),Sh(e,u)),e=u}}}var ns=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);dx(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Eh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var fx=37297,px=0;function mx(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function gx(i){let t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(i),n;switch(t===e?n="":t===eo&&e===to?n="LinearDisplayP3ToLinearSRGB":t===to&&e===eo&&(n="LinearSRGBToLinearDisplayP3"),i){case On:case Co:return[n,"LinearTransferOETF"];case xe:case Rl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Ah(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+mx(i.getShaderSource(t),o)}else return s}function xx(i,t){let e=gx(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function yx(i,t){let e;switch(t){case wf:e="Linear";break;case Sf:e="Reinhard";break;case Ef:e="OptimizedCineon";break;case Af:e="ACESFilmic";break;case Cf:e="AgX";break;case Tf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function _x(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Ji).join(`
`)}function vx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Ji).join(`
`)}function Mx(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function bx(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ji(i){return i!==""}function Th(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ch(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var wx=/^[ \t]*#include +<([\w\d./]+)>/gm;function el(i){return i.replace(wx,Ex)}var Sx=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ex(i,t){let e=Wt[t];if(e===void 0){let n=Sx.get(t);if(n!==void 0)e=Wt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return el(e)}var Ax=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Rh(i){return i.replace(Ax,Tx)}function Tx(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ph(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Cx(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===nu?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===jd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Nn&&(t="SHADOWMAP_TYPE_VSM"),t}function Rx(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case is:case ss:t="ENVMAP_TYPE_CUBE";break;case To:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Px(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ss:t="ENVMAP_MODE_REFRACTION";break}return t}function Lx(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case iu:t="ENVMAP_BLENDING_MULTIPLY";break;case Mf:t="ENVMAP_BLENDING_MIX";break;case bf:t="ENVMAP_BLENDING_ADD";break}return t}function Ix(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Nx(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=Cx(e),c=Rx(e),h=Px(e),u=Lx(e),d=Ix(e),f=e.isWebGL2?"":_x(e),g=vx(e),x=Mx(r),m=s.createProgram(),p,b,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ji).join(`
`),p.length>0&&(p+=`
`),b=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(Ji).join(`
`),b.length>0&&(b+=`
`)):(p=[Ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ji).join(`
`),b=[f,Ph(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Jn?"#define TONE_MAPPING":"",e.toneMapping!==Jn?Wt.tonemapping_pars_fragment:"",e.toneMapping!==Jn?yx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Wt.colorspace_pars_fragment,xx("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ji).join(`
`)),o=el(o),o=Th(o,e),o=Ch(o,e),a=el(a),a=Th(a,e),a=Ch(a,e),o=Rh(o),a=Rh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,b=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Zc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+b);let v=y+p+o,w=y+b+a,M=Eh(s,s.VERTEX_SHADER,v),S=Eh(s,s.FRAGMENT_SHADER,w);s.attachShader(m,M),s.attachShader(m,S),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function C(V){if(i.debug.checkShaderErrors){let Q=s.getProgramInfoLog(m).trim(),I=s.getShaderInfoLog(M).trim(),U=s.getShaderInfoLog(S).trim(),N=!0,W=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,M,S);else{let G=Ah(s,M,"vertex"),z=Ah(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Program Info Log: `+Q+`
`+G+`
`+z)}else Q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Q):(I===""||U==="")&&(W=!1);W&&(V.diagnostics={runnable:N,programLog:Q,vertexShader:{log:I,prefix:p},fragmentShader:{log:U,prefix:b}})}s.deleteShader(M),s.deleteShader(S),_=new ns(s,m),E=bx(s,m)}let _;this.getUniforms=function(){return _===void 0&&C(this),_};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=s.getProgramParameter(m,fx)),D},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=px++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=M,this.fragmentShader=S,this}var Ux=0,nl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new il(t),e.set(t,n)),n}},il=class{constructor(t){this.id=Ux++,this.code=t,this.usedTimes=0}};function Dx(i,t,e,n,s,r,o){let a=new Bs,l=new nl,c=[],h=s.isWebGL2,u=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(_){return _===0?"uv":`uv${_}`}function m(_,E,D,V,Q){let I=V.fog,U=Q.geometry,N=_.isMeshStandardMaterial?V.environment:null,W=(_.isMeshStandardMaterial?e:t).get(_.envMap||N),G=W&&W.mapping===To?W.image.height:null,z=g[_.type];_.precision!==null&&(f=s.getMaxPrecision(_.precision),f!==_.precision&&console.warn("THREE.WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));let j=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,Z=j!==void 0?j.length:0,tt=0;U.morphAttributes.position!==void 0&&(tt=1),U.morphAttributes.normal!==void 0&&(tt=2),U.morphAttributes.color!==void 0&&(tt=3);let F,H,J,k;if(z){let He=vn[z];F=He.vertexShader,H=He.fragmentShader}else F=_.vertexShader,H=_.fragmentShader,l.update(_),J=l.getVertexShaderID(_),k=l.getFragmentShaderID(_);let et=i.getRenderTarget(),gt=Q.isInstancedMesh===!0,wt=Q.isBatchedMesh===!0,Mt=!!_.map,Gt=!!_.matcap,X=!!W,me=!!_.aoMap,At=!!_.lightMap,Ut=!!_.bumpMap,_t=!!_.normalMap,ne=!!_.displacementMap,Ft=!!_.emissiveMap,P=!!_.metalnessMap,T=!!_.roughnessMap,q=_.anisotropy>0,rt=_.clearcoat>0,ot=_.iridescence>0,at=_.sheen>0,St=_.transmission>0,xt=q&&!!_.anisotropyMap,vt=rt&&!!_.clearcoatMap,Nt=rt&&!!_.clearcoatNormalMap,Bt=rt&&!!_.clearcoatRoughnessMap,st=ot&&!!_.iridescenceMap,jt=ot&&!!_.iridescenceThicknessMap,L=at&&!!_.sheenColorMap,nt=at&&!!_.sheenRoughnessMap,ft=!!_.specularMap,ct=!!_.specularColorMap,Tt=!!_.specularIntensityMap,Yt=St&&!!_.transmissionMap,Kt=St&&!!_.thicknessMap,qt=!!_.gradientMap,dt=!!_.alphaMap,O=_.alphaTest>0,ht=!!_.alphaHash,ut=!!_.extensions,It=!!U.attributes.uv1,Ct=!!U.attributes.uv2,te=!!U.attributes.uv3,ee=Jn;return _.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(ee=i.toneMapping),{isWebGL2:h,shaderID:z,shaderType:_.type,shaderName:_.name,vertexShader:F,fragmentShader:H,defines:_.defines,customVertexShaderID:J,customFragmentShaderID:k,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:wt,instancing:gt,instancingColor:gt&&Q.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:On,map:Mt,matcap:Gt,envMap:X,envMapMode:X&&W.mapping,envMapCubeUVHeight:G,aoMap:me,lightMap:At,bumpMap:Ut,normalMap:_t,displacementMap:d&&ne,emissiveMap:Ft,normalMapObjectSpace:_t&&_.normalMapType===Bf,normalMapTangentSpace:_t&&_.normalMapType===fu,metalnessMap:P,roughnessMap:T,anisotropy:q,anisotropyMap:xt,clearcoat:rt,clearcoatMap:vt,clearcoatNormalMap:Nt,clearcoatRoughnessMap:Bt,iridescence:ot,iridescenceMap:st,iridescenceThicknessMap:jt,sheen:at,sheenColorMap:L,sheenRoughnessMap:nt,specularMap:ft,specularColorMap:ct,specularIntensityMap:Tt,transmission:St,transmissionMap:Yt,thicknessMap:Kt,gradientMap:qt,opaque:_.transparent===!1&&_.blending===ts,alphaMap:dt,alphaTest:O,alphaHash:ht,combine:_.combine,mapUv:Mt&&x(_.map.channel),aoMapUv:me&&x(_.aoMap.channel),lightMapUv:At&&x(_.lightMap.channel),bumpMapUv:Ut&&x(_.bumpMap.channel),normalMapUv:_t&&x(_.normalMap.channel),displacementMapUv:ne&&x(_.displacementMap.channel),emissiveMapUv:Ft&&x(_.emissiveMap.channel),metalnessMapUv:P&&x(_.metalnessMap.channel),roughnessMapUv:T&&x(_.roughnessMap.channel),anisotropyMapUv:xt&&x(_.anisotropyMap.channel),clearcoatMapUv:vt&&x(_.clearcoatMap.channel),clearcoatNormalMapUv:Nt&&x(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Bt&&x(_.clearcoatRoughnessMap.channel),iridescenceMapUv:st&&x(_.iridescenceMap.channel),iridescenceThicknessMapUv:jt&&x(_.iridescenceThicknessMap.channel),sheenColorMapUv:L&&x(_.sheenColorMap.channel),sheenRoughnessMapUv:nt&&x(_.sheenRoughnessMap.channel),specularMapUv:ft&&x(_.specularMap.channel),specularColorMapUv:ct&&x(_.specularColorMap.channel),specularIntensityMapUv:Tt&&x(_.specularIntensityMap.channel),transmissionMapUv:Yt&&x(_.transmissionMap.channel),thicknessMapUv:Kt&&x(_.thicknessMap.channel),alphaMapUv:dt&&x(_.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(_t||q),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:It,vertexUv2s:Ct,vertexUv3s:te,pointsUvs:Q.isPoints===!0&&!!U.attributes.uv&&(Mt||dt),fog:!!I,useFog:_.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:_.flatShading===!0,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:Q.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:tt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:ee,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Mt&&_.map.isVideoTexture===!0&&se.getTransfer(_.map.colorSpace)===le,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===ke,flipSided:_.side===je,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionDerivatives:ut&&_.extensions.derivatives===!0,extensionFragDepth:ut&&_.extensions.fragDepth===!0,extensionDrawBuffers:ut&&_.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&_.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&_.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()}}function p(_){let E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(let D in _.defines)E.push(D),E.push(_.defines[D]);return _.isRawShaderMaterial===!1&&(b(E,_),y(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function b(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function y(_,E){a.disableAll(),E.isWebGL2&&a.enable(0),E.supportsVertexTextures&&a.enable(1),E.instancing&&a.enable(2),E.instancingColor&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.skinning&&a.enable(4),E.morphTargets&&a.enable(5),E.morphNormals&&a.enable(6),E.morphColors&&a.enable(7),E.premultipliedAlpha&&a.enable(8),E.shadowMapEnabled&&a.enable(9),E.useLegacyLights&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),_.push(a.mask)}function v(_){let E=g[_.type],D;if(E){let V=vn[E];D=Sp.clone(V.uniforms)}else D=_.uniforms;return D}function w(_,E){let D;for(let V=0,Q=c.length;V<Q;V++){let I=c[V];if(I.cacheKey===E){D=I,++D.usedTimes;break}}return D===void 0&&(D=new Nx(i,E,_,r),c.push(D)),D}function M(_){if(--_.usedTimes===0){let E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),_.destroy()}}function S(_){l.remove(_)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:w,releaseProgram:M,releaseShaderCache:S,programs:c,dispose:C}}function Ox(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Fx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Lh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ih(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,x,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),t++,p}function a(u,d,f,g,x,m){let p=o(u,d,f,g,x,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,x,m){let p=o(u,d,f,g,x,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Fx),n.length>1&&n.sort(d||Lh),s.length>1&&s.sort(d||Lh)}function h(){for(let u=t,d=i.length;u<d;u++){let f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function kx(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new Ih,i.set(n,[o])):s>=r.length?(o=new Ih,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function zx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new A,color:new Et};break;case"SpotLight":e={position:new A,direction:new A,color:new Et,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new A,color:new Et,distance:0,decay:0};break;case"HemisphereLight":e={direction:new A,skyColor:new Et,groundColor:new Et};break;case"RectAreaLight":e={color:new Et,position:new A,halfWidth:new A,halfHeight:new A};break}return i[t.id]=e,e}}}function Bx(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Lt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Vx=0;function Hx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Gx(i,t){let e=new zx,n=Bx(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new A);let r=new A,o=new it,a=new it;function l(h,u){let d=0,f=0,g=0;for(let V=0;V<9;V++)s.probe[V].set(0,0,0);let x=0,m=0,p=0,b=0,y=0,v=0,w=0,M=0,S=0,C=0,_=0;h.sort(Hx);let E=u===!0?Math.PI:1;for(let V=0,Q=h.length;V<Q;V++){let I=h[V],U=I.color,N=I.intensity,W=I.distance,G=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=U.r*N*E,f+=U.g*N*E,g+=U.b*N*E;else if(I.isLightProbe){for(let z=0;z<9;z++)s.probe[z].addScaledVector(I.sh.coefficients[z],N);_++}else if(I.isDirectionalLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*E),I.castShadow){let j=I.shadow,Z=n.get(I);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,s.directionalShadow[x]=Z,s.directionalShadowMap[x]=G,s.directionalShadowMatrix[x]=I.shadow.matrix,v++}s.directional[x]=z,x++}else if(I.isSpotLight){let z=e.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(U).multiplyScalar(N*E),z.distance=W,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,s.spot[p]=z;let j=I.shadow;if(I.map&&(s.spotLightMap[S]=I.map,S++,j.updateMatrices(I),I.castShadow&&C++),s.spotLightMatrix[p]=j.matrix,I.castShadow){let Z=n.get(I);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,s.spotShadow[p]=Z,s.spotShadowMap[p]=G,M++}p++}else if(I.isRectAreaLight){let z=e.get(I);z.color.copy(U).multiplyScalar(N),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),s.rectArea[b]=z,b++}else if(I.isPointLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*E),z.distance=I.distance,z.decay=I.decay,I.castShadow){let j=I.shadow,Z=n.get(I);Z.shadowBias=j.bias,Z.shadowNormalBias=j.normalBias,Z.shadowRadius=j.radius,Z.shadowMapSize=j.mapSize,Z.shadowCameraNear=j.camera.near,Z.shadowCameraFar=j.camera.far,s.pointShadow[m]=Z,s.pointShadowMap[m]=G,s.pointShadowMatrix[m]=I.shadow.matrix,w++}s.point[m]=z,m++}else if(I.isHemisphereLight){let z=e.get(I);z.skyColor.copy(I.color).multiplyScalar(N*E),z.groundColor.copy(I.groundColor).multiplyScalar(N*E),s.hemi[y]=z,y++}}b>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;let D=s.hash;(D.directionalLength!==x||D.pointLength!==m||D.spotLength!==p||D.rectAreaLength!==b||D.hemiLength!==y||D.numDirectionalShadows!==v||D.numPointShadows!==w||D.numSpotShadows!==M||D.numSpotMaps!==S||D.numLightProbes!==_)&&(s.directional.length=x,s.spot.length=p,s.rectArea.length=b,s.point.length=m,s.hemi.length=y,s.directionalShadow.length=v,s.directionalShadowMap.length=v,s.pointShadow.length=w,s.pointShadowMap.length=w,s.spotShadow.length=M,s.spotShadowMap.length=M,s.directionalShadowMatrix.length=v,s.pointShadowMatrix.length=w,s.spotLightMatrix.length=M+S-C,s.spotLightMap.length=S,s.numSpotLightShadowsWithMaps=C,s.numLightProbes=_,D.directionalLength=x,D.pointLength=m,D.spotLength=p,D.rectAreaLength=b,D.hemiLength=y,D.numDirectionalShadows=v,D.numPointShadows=w,D.numSpotShadows=M,D.numSpotMaps=S,D.numLightProbes=_,s.version=Vx++)}function c(h,u){let d=0,f=0,g=0,x=0,m=0,p=u.matrixWorldInverse;for(let b=0,y=h.length;b<y;b++){let v=h[b];if(v.isDirectionalLight){let w=s.directional[d];w.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),d++}else if(v.isSpotLight){let w=s.spot[g];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),g++}else if(v.isRectAreaLight){let w=s.rectArea[x];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),a.identity(),o.copy(v.matrixWorld),o.premultiply(p),a.extractRotation(o),w.halfWidth.set(v.width*.5,0,0),w.halfHeight.set(0,v.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(v.isPointLight){let w=s.point[f];w.position.setFromMatrixPosition(v.matrixWorld),w.position.applyMatrix4(p),f++}else if(v.isHemisphereLight){let w=s.hemi[m];w.direction.setFromMatrixPosition(v.matrixWorld),w.direction.transformDirection(p),m++}}}return{setup:l,setupView:c,state:s}}function Nh(i,t){let e=new Gx(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(u){n.push(u)}function a(u){s.push(u)}function l(u){e.setup(n,u)}function c(u){e.setupView(n,u)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Wx(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new Nh(i,t),e.set(r,[l])):o>=a.length?(l=new Nh(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var sl=class extends kn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=kf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},rl=class extends kn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Xx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,qx=`uniform sampler2D shadow_pass;
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
}`;function $x(i,t,e){let n=new Vs,s=new Lt,r=new Lt,o=new ue,a=new sl({depthPacking:zf}),l=new rl,c={},h=e.maxTextureSize,u={[ti]:je,[je]:ti,[ke]:ke},d=new zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Lt},radius:{value:4}},vertexShader:Xx,fragmentShader:qx}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new ie;g.setAttribute("position",new _e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new mt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nu;let p=this.type;this.render=function(M,S,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;let _=i.getRenderTarget(),E=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),V=i.state;V.setBlending(Kn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let Q=p!==Nn&&this.type===Nn,I=p===Nn&&this.type!==Nn;for(let U=0,N=M.length;U<N;U++){let W=M[U],G=W.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);let z=G.getFrameExtents();if(s.multiply(z),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/z.x),s.x=r.x*z.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/z.y),s.y=r.y*z.y,G.mapSize.y=r.y)),G.map===null||Q===!0||I===!0){let Z=this.type!==Nn?{minFilter:Pe,magFilter:Pe}:{};G.map!==null&&G.map.dispose(),G.map=new pn(s.x,s.y,Z),G.map.texture.name=W.name+".shadowMap",G.camera.updateProjectionMatrix()}i.setRenderTarget(G.map),i.clear();let j=G.getViewportCount();for(let Z=0;Z<j;Z++){let tt=G.getViewport(Z);o.set(r.x*tt.x,r.y*tt.y,r.x*tt.z,r.y*tt.w),V.viewport(o),G.updateMatrices(W,Z),n=G.getFrustum(),v(S,C,G.camera,W,this.type)}G.isPointLightShadow!==!0&&this.type===Nn&&b(G,C),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(_,E,D)};function b(M,S){let C=t.update(x);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null&&(M.mapPass=new pn(s.x,s.y)),d.uniforms.shadow_pass.value=M.map.texture,d.uniforms.resolution.value=M.mapSize,d.uniforms.radius.value=M.radius,i.setRenderTarget(M.mapPass),i.clear(),i.renderBufferDirect(S,null,C,d,x,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value=M.mapSize,f.uniforms.radius.value=M.radius,i.setRenderTarget(M.map),i.clear(),i.renderBufferDirect(S,null,C,f,x,null)}function y(M,S,C,_){let E=null,D=C.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(D!==void 0)E=D;else if(E=C.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let V=E.uuid,Q=S.uuid,I=c[V];I===void 0&&(I={},c[V]=I);let U=I[Q];U===void 0&&(U=E.clone(),I[Q]=U,S.addEventListener("dispose",w)),E=U}if(E.visible=S.visible,E.wireframe=S.wireframe,_===Nn?E.side=S.shadowSide!==null?S.shadowSide:S.side:E.side=S.shadowSide!==null?S.shadowSide:u[S.side],E.alphaMap=S.alphaMap,E.alphaTest=S.alphaTest,E.map=S.map,E.clipShadows=S.clipShadows,E.clippingPlanes=S.clippingPlanes,E.clipIntersection=S.clipIntersection,E.displacementMap=S.displacementMap,E.displacementScale=S.displacementScale,E.displacementBias=S.displacementBias,E.wireframeLinewidth=S.wireframeLinewidth,E.linewidth=S.linewidth,C.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let V=i.properties.get(E);V.light=C}return E}function v(M,S,C,_,E){if(M.visible===!1)return;if(M.layers.test(S.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&E===Nn)&&(!M.frustumCulled||n.intersectsObject(M))){M.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,M.matrixWorld);let Q=t.update(M),I=M.material;if(Array.isArray(I)){let U=Q.groups;for(let N=0,W=U.length;N<W;N++){let G=U[N],z=I[G.materialIndex];if(z&&z.visible){let j=y(M,z,_,E);M.onBeforeShadow(i,M,S,C,Q,j,G),i.renderBufferDirect(C,null,Q,j,M,G),M.onAfterShadow(i,M,S,C,Q,j,G)}}}else if(I.visible){let U=y(M,I,_,E);M.onBeforeShadow(i,M,S,C,Q,U,null),i.renderBufferDirect(C,null,Q,U,M,null),M.onAfterShadow(i,M,S,C,Q,U,null)}}let V=M.children;for(let Q=0,I=V.length;Q<I;Q++)v(V[Q],S,C,_,E)}function w(M){M.target.removeEventListener("dispose",w);for(let C in c){let _=c[C],E=M.target.uuid;E in _&&(_[E].dispose(),delete _[E])}}}function Yx(i,t,e){let n=e.isWebGL2;function s(){let O=!1,ht=new ue,ut=null,It=new ue(0,0,0,0);return{setMask:function(Ct){ut!==Ct&&!O&&(i.colorMask(Ct,Ct,Ct,Ct),ut=Ct)},setLocked:function(Ct){O=Ct},setClear:function(Ct,te,ee,Te,He){He===!0&&(Ct*=Te,te*=Te,ee*=Te),ht.set(Ct,te,ee,Te),It.equals(ht)===!1&&(i.clearColor(Ct,te,ee,Te),It.copy(ht))},reset:function(){O=!1,ut=null,It.set(-1,0,0,0)}}}function r(){let O=!1,ht=null,ut=null,It=null;return{setTest:function(Ct){Ct?wt(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(Ct){ht!==Ct&&!O&&(i.depthMask(Ct),ht=Ct)},setFunc:function(Ct){if(ut!==Ct){switch(Ct){case pf:i.depthFunc(i.NEVER);break;case mf:i.depthFunc(i.ALWAYS);break;case gf:i.depthFunc(i.LESS);break;case jr:i.depthFunc(i.LEQUAL);break;case xf:i.depthFunc(i.EQUAL);break;case yf:i.depthFunc(i.GEQUAL);break;case _f:i.depthFunc(i.GREATER);break;case vf:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=Ct}},setLocked:function(Ct){O=Ct},setClear:function(Ct){It!==Ct&&(i.clearDepth(Ct),It=Ct)},reset:function(){O=!1,ht=null,ut=null,It=null}}}function o(){let O=!1,ht=null,ut=null,It=null,Ct=null,te=null,ee=null,Te=null,He=null;return{setTest:function(ae){O||(ae?wt(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(ae){ht!==ae&&!O&&(i.stencilMask(ae),ht=ae)},setFunc:function(ae,Ge,_n){(ut!==ae||It!==Ge||Ct!==_n)&&(i.stencilFunc(ae,Ge,_n),ut=ae,It=Ge,Ct=_n)},setOp:function(ae,Ge,_n){(te!==ae||ee!==Ge||Te!==_n)&&(i.stencilOp(ae,Ge,_n),te=ae,ee=Ge,Te=_n)},setLocked:function(ae){O=ae},setClear:function(ae){He!==ae&&(i.clearStencil(ae),He=ae)},reset:function(){O=!1,ht=null,ut=null,It=null,Ct=null,te=null,ee=null,Te=null,He=null}}}let a=new s,l=new r,c=new o,h=new WeakMap,u=new WeakMap,d={},f={},g=new WeakMap,x=[],m=null,p=!1,b=null,y=null,v=null,w=null,M=null,S=null,C=null,_=new Et(0,0,0),E=0,D=!1,V=null,Q=null,I=null,U=null,N=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),G=!1,z=0,j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(j)[1]),G=z>=1):j.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),G=z>=2);let Z=null,tt={},F=i.getParameter(i.SCISSOR_BOX),H=i.getParameter(i.VIEWPORT),J=new ue().fromArray(F),k=new ue().fromArray(H);function et(O,ht,ut,It){let Ct=new Uint8Array(4),te=i.createTexture();i.bindTexture(O,te),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ee=0;ee<ut;ee++)n&&(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)?i.texImage3D(ht,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(ht+ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return te}let gt={};gt[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),gt[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(gt[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),gt[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),wt(i.DEPTH_TEST),l.setFunc(jr),Ft(!1),P(uc),wt(i.CULL_FACE),_t(Kn);function wt(O){d[O]!==!0&&(i.enable(O),d[O]=!0)}function Mt(O){d[O]!==!1&&(i.disable(O),d[O]=!1)}function Gt(O,ht){return f[O]!==ht?(i.bindFramebuffer(O,ht),f[O]=ht,n&&(O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ht),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ht)),!0):!1}function X(O,ht){let ut=x,It=!1;if(O)if(ut=g.get(ht),ut===void 0&&(ut=[],g.set(ht,ut)),O.isWebGLMultipleRenderTargets){let Ct=O.texture;if(ut.length!==Ct.length||ut[0]!==i.COLOR_ATTACHMENT0){for(let te=0,ee=Ct.length;te<ee;te++)ut[te]=i.COLOR_ATTACHMENT0+te;ut.length=Ct.length,It=!0}}else ut[0]!==i.COLOR_ATTACHMENT0&&(ut[0]=i.COLOR_ATTACHMENT0,It=!0);else ut[0]!==i.BACK&&(ut[0]=i.BACK,It=!0);It&&(e.isWebGL2?i.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function me(O){return m!==O?(i.useProgram(O),m=O,!0):!1}let At={[pi]:i.FUNC_ADD,[Jd]:i.FUNC_SUBTRACT,[Qd]:i.FUNC_REVERSE_SUBTRACT};if(n)At[mc]=i.MIN,At[gc]=i.MAX;else{let O=t.get("EXT_blend_minmax");O!==null&&(At[mc]=O.MIN_EXT,At[gc]=O.MAX_EXT)}let Ut={[tf]:i.ZERO,[ef]:i.ONE,[nf]:i.SRC_COLOR,[Va]:i.SRC_ALPHA,[cf]:i.SRC_ALPHA_SATURATE,[af]:i.DST_COLOR,[rf]:i.DST_ALPHA,[sf]:i.ONE_MINUS_SRC_COLOR,[Ha]:i.ONE_MINUS_SRC_ALPHA,[lf]:i.ONE_MINUS_DST_COLOR,[of]:i.ONE_MINUS_DST_ALPHA,[hf]:i.CONSTANT_COLOR,[uf]:i.ONE_MINUS_CONSTANT_COLOR,[df]:i.CONSTANT_ALPHA,[ff]:i.ONE_MINUS_CONSTANT_ALPHA};function _t(O,ht,ut,It,Ct,te,ee,Te,He,ae){if(O===Kn){p===!0&&(Mt(i.BLEND),p=!1);return}if(p===!1&&(wt(i.BLEND),p=!0),O!==Kd){if(O!==b||ae!==D){if((y!==pi||M!==pi)&&(i.blendEquation(i.FUNC_ADD),y=pi,M=pi),ae)switch(O){case ts:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dc:i.blendFunc(i.ONE,i.ONE);break;case fc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case ts:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dc:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case fc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case pc:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}v=null,w=null,S=null,C=null,_.set(0,0,0),E=0,b=O,D=ae}return}Ct=Ct||ht,te=te||ut,ee=ee||It,(ht!==y||Ct!==M)&&(i.blendEquationSeparate(At[ht],At[Ct]),y=ht,M=Ct),(ut!==v||It!==w||te!==S||ee!==C)&&(i.blendFuncSeparate(Ut[ut],Ut[It],Ut[te],Ut[ee]),v=ut,w=It,S=te,C=ee),(Te.equals(_)===!1||He!==E)&&(i.blendColor(Te.r,Te.g,Te.b,He),_.copy(Te),E=He),b=O,D=!1}function ne(O,ht){O.side===ke?Mt(i.CULL_FACE):wt(i.CULL_FACE);let ut=O.side===je;ht&&(ut=!ut),Ft(ut),O.blending===ts&&O.transparent===!1?_t(Kn):_t(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),l.setFunc(O.depthFunc),l.setTest(O.depthTest),l.setMask(O.depthWrite),a.setMask(O.colorWrite);let It=O.stencilWrite;c.setTest(It),It&&(c.setMask(O.stencilWriteMask),c.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),c.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),q(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?wt(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ft(O){V!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),V=O)}function P(O){O!==Yd?(wt(i.CULL_FACE),O!==Q&&(O===uc?i.cullFace(i.BACK):O===Zd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),Q=O}function T(O){O!==I&&(G&&i.lineWidth(O),I=O)}function q(O,ht,ut){O?(wt(i.POLYGON_OFFSET_FILL),(U!==ht||N!==ut)&&(i.polygonOffset(ht,ut),U=ht,N=ut)):Mt(i.POLYGON_OFFSET_FILL)}function rt(O){O?wt(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function ot(O){O===void 0&&(O=i.TEXTURE0+W-1),Z!==O&&(i.activeTexture(O),Z=O)}function at(O,ht,ut){ut===void 0&&(Z===null?ut=i.TEXTURE0+W-1:ut=Z);let It=tt[ut];It===void 0&&(It={type:void 0,texture:void 0},tt[ut]=It),(It.type!==O||It.texture!==ht)&&(Z!==ut&&(i.activeTexture(ut),Z=ut),i.bindTexture(O,ht||gt[O]),It.type=O,It.texture=ht)}function St(){let O=tt[Z];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function xt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function vt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Nt(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Bt(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function st(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function jt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function L(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function nt(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ft(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ct(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Tt(O){J.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),J.copy(O))}function Yt(O){k.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),k.copy(O))}function Kt(O,ht){let ut=u.get(ht);ut===void 0&&(ut=new WeakMap,u.set(ht,ut));let It=ut.get(O);It===void 0&&(It=i.getUniformBlockIndex(ht,O.name),ut.set(O,It))}function qt(O,ht){let It=u.get(ht).get(O);h.get(ht)!==It&&(i.uniformBlockBinding(ht,It,O.__bindingPointIndex),h.set(ht,It))}function dt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},Z=null,tt={},f={},g=new WeakMap,x=[],m=null,p=!1,b=null,y=null,v=null,w=null,M=null,S=null,C=null,_=new Et(0,0,0),E=0,D=!1,V=null,Q=null,I=null,U=null,N=null,J.set(0,0,i.canvas.width,i.canvas.height),k.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:wt,disable:Mt,bindFramebuffer:Gt,drawBuffers:X,useProgram:me,setBlending:_t,setMaterial:ne,setFlipSided:Ft,setCullFace:P,setLineWidth:T,setPolygonOffset:q,setScissorTest:rt,activeTexture:ot,bindTexture:at,unbindTexture:St,compressedTexImage2D:xt,compressedTexImage3D:vt,texImage2D:ft,texImage3D:ct,updateUBOMapping:Kt,uniformBlockBinding:qt,texStorage2D:L,texStorage3D:nt,texSubImage2D:Nt,texSubImage3D:Bt,compressedTexSubImage2D:st,compressedTexSubImage3D:jt,scissor:Tt,viewport:Yt,reset:dt}}function Zx(i,t,e,n,s,r,o){let a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap,u,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,T){return f?new OffscreenCanvas(P,T):so("canvas")}function x(P,T,q,rt){let ot=1;if((P.width>rt||P.height>rt)&&(ot=rt/Math.max(P.width,P.height)),ot<1||T===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){let at=T?io:Math.floor,St=at(ot*P.width),xt=at(ot*P.height);u===void 0&&(u=g(St,xt));let vt=q?g(St,xt):u;return vt.width=St,vt.height=xt,vt.getContext("2d").drawImage(P,0,0,St,xt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+St+"x"+xt+")."),vt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function m(P){return $a(P.width)&&$a(P.height)}function p(P){return a?!1:P.wrapS!==sn||P.wrapT!==sn||P.minFilter!==Pe&&P.minFilter!==Le}function b(P,T){return P.generateMipmaps&&T&&P.minFilter!==Pe&&P.minFilter!==Le}function y(P){i.generateMipmap(P)}function v(P,T,q,rt,ot=!1){if(a===!1)return T;if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let at=T;if(T===i.RED&&(q===i.FLOAT&&(at=i.R32F),q===i.HALF_FLOAT&&(at=i.R16F),q===i.UNSIGNED_BYTE&&(at=i.R8)),T===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(at=i.R8UI),q===i.UNSIGNED_SHORT&&(at=i.R16UI),q===i.UNSIGNED_INT&&(at=i.R32UI),q===i.BYTE&&(at=i.R8I),q===i.SHORT&&(at=i.R16I),q===i.INT&&(at=i.R32I)),T===i.RG&&(q===i.FLOAT&&(at=i.RG32F),q===i.HALF_FLOAT&&(at=i.RG16F),q===i.UNSIGNED_BYTE&&(at=i.RG8)),T===i.RGBA){let St=ot?Qr:se.getTransfer(rt);q===i.FLOAT&&(at=i.RGBA32F),q===i.HALF_FLOAT&&(at=i.RGBA16F),q===i.UNSIGNED_BYTE&&(at=St===le?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(at=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(at=i.RGB5_A1)}return(at===i.R16F||at===i.R32F||at===i.RG16F||at===i.RG32F||at===i.RGBA16F||at===i.RGBA32F)&&t.get("EXT_color_buffer_float"),at}function w(P,T,q){return b(P,q)===!0||P.isFramebufferTexture&&P.minFilter!==Pe&&P.minFilter!==Le?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function M(P){return P===Pe||P===yc||P===la?i.NEAREST:i.LINEAR}function S(P){let T=P.target;T.removeEventListener("dispose",S),_(T),T.isVideoTexture&&h.delete(T)}function C(P){let T=P.target;T.removeEventListener("dispose",C),D(T)}function _(P){let T=n.get(P);if(T.__webglInit===void 0)return;let q=P.source,rt=d.get(q);if(rt){let ot=rt[T.__cacheKey];ot.usedTimes--,ot.usedTimes===0&&E(P),Object.keys(rt).length===0&&d.delete(q)}n.remove(P)}function E(P){let T=n.get(P);i.deleteTexture(T.__webglTexture);let q=P.source,rt=d.get(q);delete rt[T.__cacheKey],o.memory.textures--}function D(P){let T=P.texture,q=n.get(P),rt=n.get(T);if(rt.__webglTexture!==void 0&&(i.deleteTexture(rt.__webglTexture),o.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let ot=0;ot<6;ot++){if(Array.isArray(q.__webglFramebuffer[ot]))for(let at=0;at<q.__webglFramebuffer[ot].length;at++)i.deleteFramebuffer(q.__webglFramebuffer[ot][at]);else i.deleteFramebuffer(q.__webglFramebuffer[ot]);q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer[ot])}else{if(Array.isArray(q.__webglFramebuffer))for(let ot=0;ot<q.__webglFramebuffer.length;ot++)i.deleteFramebuffer(q.__webglFramebuffer[ot]);else i.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&i.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let ot=0;ot<q.__webglColorRenderbuffer.length;ot++)q.__webglColorRenderbuffer[ot]&&i.deleteRenderbuffer(q.__webglColorRenderbuffer[ot]);q.__webglDepthRenderbuffer&&i.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let ot=0,at=T.length;ot<at;ot++){let St=n.get(T[ot]);St.__webglTexture&&(i.deleteTexture(St.__webglTexture),o.memory.textures--),n.remove(T[ot])}n.remove(T),n.remove(P)}let V=0;function Q(){V=0}function I(){let P=V;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),V+=1,P}function U(P){let T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function N(P,T){let q=n.get(P);if(P.isVideoTexture&&ne(P),P.isRenderTargetTexture===!1&&P.version>0&&q.__version!==P.version){let rt=P.image;if(rt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{J(q,P,T);return}}e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+T)}function W(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){J(q,P,T);return}e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+T)}function G(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){J(q,P,T);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+T)}function z(P,T){let q=n.get(P);if(P.version>0&&q.__version!==P.version){k(q,P,T);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+T)}let j={[rs]:i.REPEAT,[sn]:i.CLAMP_TO_EDGE,[Xa]:i.MIRRORED_REPEAT},Z={[Pe]:i.NEAREST,[yc]:i.NEAREST_MIPMAP_NEAREST,[la]:i.NEAREST_MIPMAP_LINEAR,[Le]:i.LINEAR,[Rf]:i.LINEAR_MIPMAP_NEAREST,[Mn]:i.LINEAR_MIPMAP_LINEAR},tt={[Vf]:i.NEVER,[$f]:i.ALWAYS,[Hf]:i.LESS,[pu]:i.LEQUAL,[Gf]:i.EQUAL,[qf]:i.GEQUAL,[Wf]:i.GREATER,[Xf]:i.NOTEQUAL};function F(P,T,q){if(q?(i.texParameteri(P,i.TEXTURE_WRAP_S,j[T.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,j[T.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,j[T.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,Z[T.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,Z[T.minFilter])):(i.texParameteri(P,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(P,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(T.wrapS!==sn||T.wrapT!==sn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(P,i.TEXTURE_MAG_FILTER,M(T.magFilter)),i.texParameteri(P,i.TEXTURE_MIN_FILTER,M(T.minFilter)),T.minFilter!==Pe&&T.minFilter!==Le&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,tt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let rt=t.get("EXT_texture_filter_anisotropic");if(T.magFilter===Pe||T.minFilter!==la&&T.minFilter!==Mn||T.type===Un&&t.has("OES_texture_float_linear")===!1||a===!1&&T.type===ks&&t.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||n.get(T).__currentAnisotropy)&&(i.texParameterf(P,rt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy)}}function H(P,T){let q=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",S));let rt=T.source,ot=d.get(rt);ot===void 0&&(ot={},d.set(rt,ot));let at=U(T);if(at!==P.__cacheKey){ot[at]===void 0&&(ot[at]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),ot[at].usedTimes++;let St=ot[P.__cacheKey];St!==void 0&&(ot[P.__cacheKey].usedTimes--,St.usedTimes===0&&E(T)),P.__cacheKey=at,P.__webglTexture=ot[at].texture}return q}function J(P,T,q){let rt=i.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(rt=i.TEXTURE_2D_ARRAY),T.isData3DTexture&&(rt=i.TEXTURE_3D);let ot=H(P,T),at=T.source;e.bindTexture(rt,P.__webglTexture,i.TEXTURE0+q);let St=n.get(at);if(at.version!==St.__version||ot===!0){e.activeTexture(i.TEXTURE0+q);let xt=se.getPrimaries(se.workingColorSpace),vt=T.colorSpace===Ze?null:se.getPrimaries(T.colorSpace),Nt=T.colorSpace===Ze||xt===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let Bt=p(T)&&m(T.image)===!1,st=x(T.image,Bt,!1,s.maxTextureSize);st=Ft(T,st);let jt=m(st)||a,L=r.convert(T.format,T.colorSpace),nt=r.convert(T.type),ft=v(T.internalFormat,L,nt,T.colorSpace,T.isVideoTexture);F(rt,T,jt);let ct,Tt=T.mipmaps,Yt=a&&T.isVideoTexture!==!0&&ft!==uu,Kt=St.__version===void 0||ot===!0,qt=w(T,st,jt);if(T.isDepthTexture)ft=i.DEPTH_COMPONENT,a?T.type===Un?ft=i.DEPTH_COMPONENT32F:T.type===jn?ft=i.DEPTH_COMPONENT24:T.type===gi?ft=i.DEPTH24_STENCIL8:ft=i.DEPTH_COMPONENT16:T.type===Un&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===xi&&ft===i.DEPTH_COMPONENT&&T.type!==Cl&&T.type!==jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=jn,nt=r.convert(T.type)),T.format===os&&ft===i.DEPTH_COMPONENT&&(ft=i.DEPTH_STENCIL,T.type!==gi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=gi,nt=r.convert(T.type))),Kt&&(Yt?e.texStorage2D(i.TEXTURE_2D,1,ft,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,ft,st.width,st.height,0,L,nt,null));else if(T.isDataTexture)if(Tt.length>0&&jt){Yt&&Kt&&e.texStorage2D(i.TEXTURE_2D,qt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],Yt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,ct.width,ct.height,L,nt,ct.data):e.texImage2D(i.TEXTURE_2D,dt,ft,ct.width,ct.height,0,L,nt,ct.data);T.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(i.TEXTURE_2D,qt,ft,st.width,st.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,st.width,st.height,L,nt,st.data)):e.texImage2D(i.TEXTURE_2D,0,ft,st.width,st.height,0,L,nt,st.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Yt&&Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,ft,Tt[0].width,Tt[0].height,st.depth);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],T.format!==Ye?L!==null?Yt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,ct.width,ct.height,st.depth,L,ct.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,ft,ct.width,ct.height,st.depth,0,ct.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,ct.width,ct.height,st.depth,L,nt,ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,ft,ct.width,ct.height,st.depth,0,L,nt,ct.data)}else{Yt&&Kt&&e.texStorage2D(i.TEXTURE_2D,qt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],T.format!==Ye?L!==null?Yt?e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,ct.width,ct.height,L,ct.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,ft,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Yt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,ct.width,ct.height,L,nt,ct.data):e.texImage2D(i.TEXTURE_2D,dt,ft,ct.width,ct.height,0,L,nt,ct.data)}else if(T.isDataArrayTexture)Yt?(Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,qt,ft,st.width,st.height,st.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,L,nt,st.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ft,st.width,st.height,st.depth,0,L,nt,st.data);else if(T.isData3DTexture)Yt?(Kt&&e.texStorage3D(i.TEXTURE_3D,qt,ft,st.width,st.height,st.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,L,nt,st.data)):e.texImage3D(i.TEXTURE_3D,0,ft,st.width,st.height,st.depth,0,L,nt,st.data);else if(T.isFramebufferTexture){if(Kt)if(Yt)e.texStorage2D(i.TEXTURE_2D,qt,ft,st.width,st.height);else{let dt=st.width,O=st.height;for(let ht=0;ht<qt;ht++)e.texImage2D(i.TEXTURE_2D,ht,ft,dt,O,0,L,nt,null),dt>>=1,O>>=1}}else if(Tt.length>0&&jt){Yt&&Kt&&e.texStorage2D(i.TEXTURE_2D,qt,ft,Tt[0].width,Tt[0].height);for(let dt=0,O=Tt.length;dt<O;dt++)ct=Tt[dt],Yt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,L,nt,ct):e.texImage2D(i.TEXTURE_2D,dt,ft,L,nt,ct);T.generateMipmaps=!1}else Yt?(Kt&&e.texStorage2D(i.TEXTURE_2D,qt,ft,st.width,st.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,L,nt,st)):e.texImage2D(i.TEXTURE_2D,0,ft,L,nt,st);b(T,jt)&&y(rt),St.__version=at.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function k(P,T,q){if(T.image.length!==6)return;let rt=H(P,T),ot=T.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+q);let at=n.get(ot);if(ot.version!==at.__version||rt===!0){e.activeTexture(i.TEXTURE0+q);let St=se.getPrimaries(se.workingColorSpace),xt=T.colorSpace===Ze?null:se.getPrimaries(T.colorSpace),vt=T.colorSpace===Ze||St===xt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,T.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,T.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let Nt=T.isCompressedTexture||T.image[0].isCompressedTexture,Bt=T.image[0]&&T.image[0].isDataTexture,st=[];for(let dt=0;dt<6;dt++)!Nt&&!Bt?st[dt]=x(T.image[dt],!1,!0,s.maxCubemapSize):st[dt]=Bt?T.image[dt].image:T.image[dt],st[dt]=Ft(T,st[dt]);let jt=st[0],L=m(jt)||a,nt=r.convert(T.format,T.colorSpace),ft=r.convert(T.type),ct=v(T.internalFormat,nt,ft,T.colorSpace),Tt=a&&T.isVideoTexture!==!0,Yt=at.__version===void 0||rt===!0,Kt=w(T,jt,L);F(i.TEXTURE_CUBE_MAP,T,L);let qt;if(Nt){Tt&&Yt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Kt,ct,jt.width,jt.height);for(let dt=0;dt<6;dt++){qt=st[dt].mipmaps;for(let O=0;O<qt.length;O++){let ht=qt[O];T.format!==Ye?nt!==null?Tt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,0,0,ht.width,ht.height,nt,ht.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,ct,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Tt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,0,0,ht.width,ht.height,nt,ft,ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O,ct,ht.width,ht.height,0,nt,ft,ht.data)}}}else{qt=T.mipmaps,Tt&&Yt&&(qt.length>0&&Kt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Kt,ct,st[0].width,st[0].height));for(let dt=0;dt<6;dt++)if(Bt){Tt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,st[dt].width,st[dt].height,nt,ft,st[dt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,ct,st[dt].width,st[dt].height,0,nt,ft,st[dt].data);for(let O=0;O<qt.length;O++){let ut=qt[O].image[dt].image;Tt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,0,0,ut.width,ut.height,nt,ft,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,ct,ut.width,ut.height,0,nt,ft,ut.data)}}else{Tt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,nt,ft,st[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,ct,nt,ft,st[dt]);for(let O=0;O<qt.length;O++){let ht=qt[O];Tt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,0,0,nt,ft,ht.image[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,O+1,ct,nt,ft,ht.image[dt])}}}b(T,L)&&y(i.TEXTURE_CUBE_MAP),at.__version=ot.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function et(P,T,q,rt,ot,at){let St=r.convert(q.format,q.colorSpace),xt=r.convert(q.type),vt=v(q.internalFormat,St,xt,q.colorSpace);if(!n.get(T).__hasExternalTextures){let Bt=Math.max(1,T.width>>at),st=Math.max(1,T.height>>at);ot===i.TEXTURE_3D||ot===i.TEXTURE_2D_ARRAY?e.texImage3D(ot,at,vt,Bt,st,T.depth,0,St,xt,null):e.texImage2D(ot,at,vt,Bt,st,0,St,xt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),_t(T)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,rt,ot,n.get(q).__webglTexture,0,Ut(T)):(ot===i.TEXTURE_2D||ot>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ot<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,rt,ot,n.get(q).__webglTexture,at),e.bindFramebuffer(i.FRAMEBUFFER,null)}function gt(P,T,q){if(i.bindRenderbuffer(i.RENDERBUFFER,P),T.depthBuffer&&!T.stencilBuffer){let rt=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(q||_t(T)){let ot=T.depthTexture;ot&&ot.isDepthTexture&&(ot.type===Un?rt=i.DEPTH_COMPONENT32F:ot.type===jn&&(rt=i.DEPTH_COMPONENT24));let at=Ut(T);_t(T)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,at,rt,T.width,T.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,at,rt,T.width,T.height)}else i.renderbufferStorage(i.RENDERBUFFER,rt,T.width,T.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,P)}else if(T.depthBuffer&&T.stencilBuffer){let rt=Ut(T);q&&_t(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,T.width,T.height):_t(T)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,rt,i.DEPTH24_STENCIL8,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,P)}else{let rt=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let ot=0;ot<rt.length;ot++){let at=rt[ot],St=r.convert(at.format,at.colorSpace),xt=r.convert(at.type),vt=v(at.internalFormat,St,xt,at.colorSpace),Nt=Ut(T);q&&_t(T)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,vt,T.width,T.height):_t(T)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,vt,T.width,T.height):i.renderbufferStorage(i.RENDERBUFFER,vt,T.width,T.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function wt(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),N(T.depthTexture,0);let rt=n.get(T.depthTexture).__webglTexture,ot=Ut(T);if(T.depthTexture.format===xi)_t(T)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(T.depthTexture.format===os)_t(T)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,ot):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function Mt(P){let T=n.get(P),q=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");wt(T.__webglFramebuffer,P)}else if(q){T.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer[rt]),T.__webglDepthbuffer[rt]=i.createRenderbuffer(),gt(T.__webglDepthbuffer[rt],P,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=i.createRenderbuffer(),gt(T.__webglDepthbuffer,P,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(P,T,q){let rt=n.get(P);T!==void 0&&et(rt.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&Mt(P)}function X(P){let T=P.texture,q=n.get(P),rt=n.get(T);P.addEventListener("dispose",C),P.isWebGLMultipleRenderTargets!==!0&&(rt.__webglTexture===void 0&&(rt.__webglTexture=i.createTexture()),rt.__version=T.version,o.memory.textures++);let ot=P.isWebGLCubeRenderTarget===!0,at=P.isWebGLMultipleRenderTargets===!0,St=m(P)||a;if(ot){q.__webglFramebuffer=[];for(let xt=0;xt<6;xt++)if(a&&T.mipmaps&&T.mipmaps.length>0){q.__webglFramebuffer[xt]=[];for(let vt=0;vt<T.mipmaps.length;vt++)q.__webglFramebuffer[xt][vt]=i.createFramebuffer()}else q.__webglFramebuffer[xt]=i.createFramebuffer()}else{if(a&&T.mipmaps&&T.mipmaps.length>0){q.__webglFramebuffer=[];for(let xt=0;xt<T.mipmaps.length;xt++)q.__webglFramebuffer[xt]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(at)if(s.drawBuffers){let xt=P.texture;for(let vt=0,Nt=xt.length;vt<Nt;vt++){let Bt=n.get(xt[vt]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&P.samples>0&&_t(P)===!1){let xt=at?T:[T];q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let vt=0;vt<xt.length;vt++){let Nt=xt[vt];q.__webglColorRenderbuffer[vt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[vt]);let Bt=r.convert(Nt.format,Nt.colorSpace),st=r.convert(Nt.type),jt=v(Nt.internalFormat,Bt,st,Nt.colorSpace,P.isXRRenderTarget===!0),L=Ut(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,L,jt,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,q.__webglColorRenderbuffer[vt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),gt(q.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ot){e.bindTexture(i.TEXTURE_CUBE_MAP,rt.__webglTexture),F(i.TEXTURE_CUBE_MAP,T,St);for(let xt=0;xt<6;xt++)if(a&&T.mipmaps&&T.mipmaps.length>0)for(let vt=0;vt<T.mipmaps.length;vt++)et(q.__webglFramebuffer[xt][vt],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,vt);else et(q.__webglFramebuffer[xt],P,T,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0);b(T,St)&&y(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(at){let xt=P.texture;for(let vt=0,Nt=xt.length;vt<Nt;vt++){let Bt=xt[vt],st=n.get(Bt);e.bindTexture(i.TEXTURE_2D,st.__webglTexture),F(i.TEXTURE_2D,Bt,St),et(q.__webglFramebuffer,P,Bt,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,0),b(Bt,St)&&y(i.TEXTURE_2D)}e.unbindTexture()}else{let xt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(a?xt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(xt,rt.__webglTexture),F(xt,T,St),a&&T.mipmaps&&T.mipmaps.length>0)for(let vt=0;vt<T.mipmaps.length;vt++)et(q.__webglFramebuffer[vt],P,T,i.COLOR_ATTACHMENT0,xt,vt);else et(q.__webglFramebuffer,P,T,i.COLOR_ATTACHMENT0,xt,0);b(T,St)&&y(xt),e.unbindTexture()}P.depthBuffer&&Mt(P)}function me(P){let T=m(P)||a,q=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let rt=0,ot=q.length;rt<ot;rt++){let at=q[rt];if(b(at,T)){let St=P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,xt=n.get(at).__webglTexture;e.bindTexture(St,xt),y(St),e.unbindTexture()}}}function At(P){if(a&&P.samples>0&&_t(P)===!1){let T=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],q=P.width,rt=P.height,ot=i.COLOR_BUFFER_BIT,at=[],St=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xt=n.get(P),vt=P.isWebGLMultipleRenderTargets===!0;if(vt)for(let Nt=0;Nt<T.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,xt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,xt.__webglFramebuffer);for(let Nt=0;Nt<T.length;Nt++){at.push(i.COLOR_ATTACHMENT0+Nt),P.depthBuffer&&at.push(St);let Bt=xt.__ignoreDepthValues!==void 0?xt.__ignoreDepthValues:!1;if(Bt===!1&&(P.depthBuffer&&(ot|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&(ot|=i.STENCIL_BUFFER_BIT)),vt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,xt.__webglColorRenderbuffer[Nt]),Bt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[St]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[St])),vt){let st=n.get(T[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,q,rt,0,0,q,rt,ot,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,at)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),vt)for(let Nt=0;Nt<T.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,xt.__webglColorRenderbuffer[Nt]);let Bt=n.get(T[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,xt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,Bt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,xt.__webglMultisampledFramebuffer)}}function Ut(P){return Math.min(s.maxSamples,P.samples)}function _t(P){let T=n.get(P);return a&&P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function ne(P){let T=o.render.frame;h.get(P)!==T&&(h.set(P,T),P.update())}function Ft(P,T){let q=P.colorSpace,rt=P.format,ot=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===qa||q!==On&&q!==Ze&&(se.getTransfer(q)===le?a===!1?t.has("EXT_sRGB")===!0&&rt===Ye?(P.format=qa,P.minFilter=Le,P.generateMipmaps=!1):T=ro.sRGBToLinear(T):(rt!==Ye||ot!==Qn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),T}this.allocateTextureUnit=I,this.resetTextureUnits=Q,this.setTexture2D=N,this.setTexture2DArray=W,this.setTexture3D=G,this.setTextureCube=z,this.rebindTextures=Gt,this.setupRenderTarget=X,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=et,this.useMultisampledRTT=_t}function jx(i,t,e){let n=e.isWebGL2;function s(r,o=Ze){let a,l=se.getTransfer(o);if(r===Qn)return i.UNSIGNED_BYTE;if(r===ou)return i.UNSIGNED_SHORT_4_4_4_4;if(r===au)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Pf)return i.BYTE;if(r===Lf)return i.SHORT;if(r===Cl)return i.UNSIGNED_SHORT;if(r===ru)return i.INT;if(r===jn)return i.UNSIGNED_INT;if(r===Un)return i.FLOAT;if(r===ks)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===If)return i.ALPHA;if(r===Ye)return i.RGBA;if(r===Nf)return i.LUMINANCE;if(r===Uf)return i.LUMINANCE_ALPHA;if(r===xi)return i.DEPTH_COMPONENT;if(r===os)return i.DEPTH_STENCIL;if(r===qa)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===Df)return i.RED;if(r===lu)return i.RED_INTEGER;if(r===Of)return i.RG;if(r===cu)return i.RG_INTEGER;if(r===hu)return i.RGBA_INTEGER;if(r===ca||r===ha||r===ua||r===da)if(l===le)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===ca)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ha)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ua)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===da)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===ca)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ha)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ua)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===da)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===_c||r===vc||r===Mc||r===bc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===_c)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===vc)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Mc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===bc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===uu)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===wc||r===Sc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===wc)return l===le?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===Sc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ec||r===Ac||r===Tc||r===Cc||r===Rc||r===Pc||r===Lc||r===Ic||r===Nc||r===Uc||r===Dc||r===Oc||r===Fc||r===kc)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===Ec)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Ac)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Tc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Cc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Rc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Pc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Lc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Ic)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Nc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Uc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Dc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Oc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Fc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===kc)return l===le?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===fa||r===zc||r===Bc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===fa)return l===le?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===zc)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Bc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ff||r===Vc||r===Hc||r===Gc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===fa)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Vc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Hc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Gc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===gi?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var ol=class extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},fn=class extends ce{constructor(){super(),this.isGroup=!0,this.type="Group"}},Kx={type:"move"},Fs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let m=e.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Kx)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new fn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},al=class extends bn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,x=e.getContextAttributes(),m=null,p=null,b=[],y=[],v=new Lt,w=null,M=new qe;M.layers.enable(1),M.viewport=new ue;let S=new qe;S.layers.enable(2),S.viewport=new ue;let C=[M,S],_=new ol;_.layers.enable(1),_.layers.enable(2);let E=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(F){let H=b[F];return H===void 0&&(H=new Fs,b[F]=H),H.getTargetRaySpace()},this.getControllerGrip=function(F){let H=b[F];return H===void 0&&(H=new Fs,b[F]=H),H.getGripSpace()},this.getHand=function(F){let H=b[F];return H===void 0&&(H=new Fs,b[F]=H),H.getHandSpace()};function V(F){let H=y.indexOf(F.inputSource);if(H===-1)return;let J=b[H];J!==void 0&&(J.update(F.inputSource,F.frame,c||o),J.dispatchEvent({type:F.type,data:F.inputSource}))}function Q(){s.removeEventListener("select",V),s.removeEventListener("selectstart",V),s.removeEventListener("selectend",V),s.removeEventListener("squeeze",V),s.removeEventListener("squeezestart",V),s.removeEventListener("squeezeend",V),s.removeEventListener("end",Q),s.removeEventListener("inputsourceschange",I);for(let F=0;F<b.length;F++){let H=y[F];H!==null&&(y[F]=null,b[F].disconnect(H))}E=null,D=null,t.setRenderTarget(m),f=null,d=null,u=null,s=null,p=null,tt.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(v.width,v.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(F){r=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(F){a=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(F){c=F},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(F){if(s=F,s!==null){if(m=t.getRenderTarget(),s.addEventListener("select",V),s.addEventListener("selectstart",V),s.addEventListener("selectend",V),s.addEventListener("squeeze",V),s.addEventListener("squeezestart",V),s.addEventListener("squeezeend",V),s.addEventListener("end",Q),s.addEventListener("inputsourceschange",I),x.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(v),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let H={antialias:s.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,H),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),p=new pn(f.framebufferWidth,f.framebufferHeight,{format:Ye,type:Qn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let H=null,J=null,k=null;x.depth&&(k=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,H=x.stencil?os:xi,J=x.stencil?gi:jn);let et={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(et),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),p=new pn(d.textureWidth,d.textureHeight,{format:Ye,type:Qn,depthTexture:new po(d.textureWidth,d.textureHeight,J,void 0,void 0,void 0,void 0,void 0,void 0,H),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});let gt=t.properties.get(p);gt.__ignoreDepthValues=d.ignoreDepthValues}p.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),tt.setContext(s),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(F){for(let H=0;H<F.removed.length;H++){let J=F.removed[H],k=y.indexOf(J);k>=0&&(y[k]=null,b[k].disconnect(J))}for(let H=0;H<F.added.length;H++){let J=F.added[H],k=y.indexOf(J);if(k===-1){for(let gt=0;gt<b.length;gt++)if(gt>=y.length){y.push(J),k=gt;break}else if(y[gt]===null){y[gt]=J,k=gt;break}if(k===-1)break}let et=b[k];et&&et.connect(J)}}let U=new A,N=new A;function W(F,H,J){U.setFromMatrixPosition(H.matrixWorld),N.setFromMatrixPosition(J.matrixWorld);let k=U.distanceTo(N),et=H.projectionMatrix.elements,gt=J.projectionMatrix.elements,wt=et[14]/(et[10]-1),Mt=et[14]/(et[10]+1),Gt=(et[9]+1)/et[5],X=(et[9]-1)/et[5],me=(et[8]-1)/et[0],At=(gt[8]+1)/gt[0],Ut=wt*me,_t=wt*At,ne=k/(-me+At),Ft=ne*-me;H.matrixWorld.decompose(F.position,F.quaternion,F.scale),F.translateX(Ft),F.translateZ(ne),F.matrixWorld.compose(F.position,F.quaternion,F.scale),F.matrixWorldInverse.copy(F.matrixWorld).invert();let P=wt+ne,T=Mt+ne,q=Ut-Ft,rt=_t+(k-Ft),ot=Gt*Mt/T*P,at=X*Mt/T*P;F.projectionMatrix.makePerspective(q,rt,ot,at,P,T),F.projectionMatrixInverse.copy(F.projectionMatrix).invert()}function G(F,H){H===null?F.matrixWorld.copy(F.matrix):F.matrixWorld.multiplyMatrices(H.matrixWorld,F.matrix),F.matrixWorldInverse.copy(F.matrixWorld).invert()}this.updateCamera=function(F){if(s===null)return;_.near=S.near=M.near=F.near,_.far=S.far=M.far=F.far,(E!==_.near||D!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),E=_.near,D=_.far);let H=F.parent,J=_.cameras;G(_,H);for(let k=0;k<J.length;k++)G(J[k],H);J.length===2?W(_,M,S):_.projectionMatrix.copy(M.projectionMatrix),z(F,_,H)};function z(F,H,J){J===null?F.matrix.copy(H.matrixWorld):(F.matrix.copy(J.matrixWorld),F.matrix.invert(),F.matrix.multiply(H.matrixWorld)),F.matrix.decompose(F.position,F.quaternion,F.scale),F.updateMatrixWorld(!0),F.projectionMatrix.copy(H.projectionMatrix),F.projectionMatrixInverse.copy(H.projectionMatrixInverse),F.isPerspectiveCamera&&(F.fov=zs*2*Math.atan(1/F.projectionMatrix.elements[5]),F.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(F){l=F,d!==null&&(d.fixedFoveation=F),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=F)};let j=null;function Z(F,H){if(h=H.getViewerPose(c||o),g=H,h!==null){let J=h.views;f!==null&&(t.setRenderTargetFramebuffer(p,f.framebuffer),t.setRenderTarget(p));let k=!1;J.length!==_.cameras.length&&(_.cameras.length=0,k=!0);for(let et=0;et<J.length;et++){let gt=J[et],wt=null;if(f!==null)wt=f.getViewport(gt);else{let Gt=u.getViewSubImage(d,gt);wt=Gt.viewport,et===0&&(t.setRenderTargetTextures(p,Gt.colorTexture,d.ignoreDepthValues?void 0:Gt.depthStencilTexture),t.setRenderTarget(p))}let Mt=C[et];Mt===void 0&&(Mt=new qe,Mt.layers.enable(et),Mt.viewport=new ue,C[et]=Mt),Mt.matrix.fromArray(gt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(gt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(wt.x,wt.y,wt.width,wt.height),et===0&&(_.matrix.copy(Mt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),k===!0&&_.cameras.push(Mt)}}for(let J=0;J<b.length;J++){let k=y[J],et=b[J];k!==null&&et!==void 0&&et.update(k,H,c||o)}j&&j(F,H),H.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:H}),g=null}let tt=new _u;tt.setAnimationLoop(Z),this.setAnimationLoop=function(F){j=F},this.dispose=function(){}}};function Jx(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,yu(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,b,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,b,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=t.get(p).envMap;if(b&&(m.envMap.value=b,m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap){m.lightMap.value=p.lightMap;let y=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=p.lightMapIntensity*y,e(p.lightMap,m.lightMapTransform)}p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=y*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),t.get(p).envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===je&&m.clearcoatNormalScale.value.negate())),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){let b=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Qx(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(b,y){let v=y.program;n.uniformBlockBinding(b,v)}function c(b,y){let v=s[b.id];v===void 0&&(g(b),v=h(b),s[b.id]=v,b.addEventListener("dispose",m));let w=y.program;n.updateUBOMapping(b,w);let M=t.render.frame;r[b.id]!==M&&(d(b),r[b.id]=M)}function h(b){let y=u();b.__bindingPointIndex=y;let v=i.createBuffer(),w=b.__size,M=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,v),i.bufferData(i.UNIFORM_BUFFER,w,M),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,v),v}function u(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){let y=s[b.id],v=b.uniforms,w=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let M=0,S=v.length;M<S;M++){let C=Array.isArray(v[M])?v[M]:[v[M]];for(let _=0,E=C.length;_<E;_++){let D=C[_];if(f(D,M,_,w)===!0){let V=D.__offset,Q=Array.isArray(D.value)?D.value:[D.value],I=0;for(let U=0;U<Q.length;U++){let N=Q[U],W=x(N);typeof N=="number"||typeof N=="boolean"?(D.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,V+I,D.__data)):N.isMatrix3?(D.__data[0]=N.elements[0],D.__data[1]=N.elements[1],D.__data[2]=N.elements[2],D.__data[3]=0,D.__data[4]=N.elements[3],D.__data[5]=N.elements[4],D.__data[6]=N.elements[5],D.__data[7]=0,D.__data[8]=N.elements[6],D.__data[9]=N.elements[7],D.__data[10]=N.elements[8],D.__data[11]=0):(N.toArray(D.__data,I),I+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(b,y,v,w){let M=b.value,S=y+"_"+v;if(w[S]===void 0)return typeof M=="number"||typeof M=="boolean"?w[S]=M:w[S]=M.clone(),!0;{let C=w[S];if(typeof M=="number"||typeof M=="boolean"){if(C!==M)return w[S]=M,!0}else if(C.equals(M)===!1)return C.copy(M),!0}return!1}function g(b){let y=b.uniforms,v=0,w=16;for(let S=0,C=y.length;S<C;S++){let _=Array.isArray(y[S])?y[S]:[y[S]];for(let E=0,D=_.length;E<D;E++){let V=_[E],Q=Array.isArray(V.value)?V.value:[V.value];for(let I=0,U=Q.length;I<U;I++){let N=Q[I],W=x(N),G=v%w;G!==0&&w-G<W.boundary&&(v+=w-G),V.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=v,v+=W.storage}}}let M=v%w;return M>0&&(v+=w-M),b.__size=v,b.__cache={},this}function x(b){let y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function m(b){let y=b.target;y.removeEventListener("dispose",m);let v=o.indexOf(y.__bindingPointIndex);o.splice(v,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}var Gs=class{constructor(t={}){let{canvas:e=lp(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;let f=new Uint32Array(4),g=new Int32Array(4),x=null,m=null,p=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=xe,this._useLegacyLights=!1,this.toneMapping=Jn,this.toneMappingExposure=1;let y=this,v=!1,w=0,M=0,S=null,C=-1,_=null,E=new ue,D=new ue,V=null,Q=new Et(0),I=0,U=e.width,N=e.height,W=1,G=null,z=null,j=new ue(0,0,U,N),Z=new ue(0,0,U,N),tt=!1,F=new Vs,H=!1,J=!1,k=null,et=new it,gt=new Lt,wt=new A,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Gt(){return S===null?W:1}let X=n;function me(R,B){for(let Y=0;Y<R.length;Y++){let K=R[Y],$=e.getContext(K,B);if($!==null)return $}return null}try{let R={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Tl}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",O,!1),e.addEventListener("webglcontextcreationerror",ht,!1),X===null){let B=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&B.shift(),X=me(B,R),X===null)throw me(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let At,Ut,_t,ne,Ft,P,T,q,rt,ot,at,St,xt,vt,Nt,Bt,st,jt,L,nt,ft,ct,Tt,Yt;function Kt(){At=new y0(X),Ut=new d0(X,At,t),At.init(Ut),ct=new jx(X,At,Ut),_t=new Yx(X,At,Ut),ne=new M0(X),Ft=new Ox,P=new Zx(X,At,_t,Ft,Ut,ct,ne),T=new p0(y),q=new x0(y),rt=new Rp(X,Ut),Tt=new h0(X,At,rt,Ut),ot=new _0(X,rt,ne,Tt),at=new E0(X,ot,rt,ne),L=new S0(X,Ut,P),Bt=new f0(Ft),St=new Dx(y,T,q,At,Ut,Tt,Bt),xt=new Jx(y,Ft),vt=new kx,Nt=new Wx(At,Ut),jt=new c0(y,T,q,_t,at,d,l),st=new $x(y,at,Ut),Yt=new Qx(X,ne,Ut,_t),nt=new u0(X,At,ne,Ut),ft=new v0(X,At,ne,Ut),ne.programs=St.programs,y.capabilities=Ut,y.extensions=At,y.properties=Ft,y.renderLists=vt,y.shadowMap=st,y.state=_t,y.info=ne}Kt();let qt=new al(y,X);this.xr=qt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let R=At.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=At.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(R){R!==void 0&&(W=R,this.setSize(U,N,!1))},this.getSize=function(R){return R.set(U,N)},this.setSize=function(R,B,Y=!0){if(qt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=R,N=B,e.width=Math.floor(R*W),e.height=Math.floor(B*W),Y===!0&&(e.style.width=R+"px",e.style.height=B+"px"),this.setViewport(0,0,R,B)},this.getDrawingBufferSize=function(R){return R.set(U*W,N*W).floor()},this.setDrawingBufferSize=function(R,B,Y){U=R,N=B,W=Y,e.width=Math.floor(R*Y),e.height=Math.floor(B*Y),this.setViewport(0,0,R,B)},this.getCurrentViewport=function(R){return R.copy(E)},this.getViewport=function(R){return R.copy(j)},this.setViewport=function(R,B,Y,K){R.isVector4?j.set(R.x,R.y,R.z,R.w):j.set(R,B,Y,K),_t.viewport(E.copy(j).multiplyScalar(W).floor())},this.getScissor=function(R){return R.copy(Z)},this.setScissor=function(R,B,Y,K){R.isVector4?Z.set(R.x,R.y,R.z,R.w):Z.set(R,B,Y,K),_t.scissor(D.copy(Z).multiplyScalar(W).floor())},this.getScissorTest=function(){return tt},this.setScissorTest=function(R){_t.setScissorTest(tt=R)},this.setOpaqueSort=function(R){G=R},this.setTransparentSort=function(R){z=R},this.getClearColor=function(R){return R.copy(jt.getClearColor())},this.setClearColor=function(){jt.setClearColor.apply(jt,arguments)},this.getClearAlpha=function(){return jt.getClearAlpha()},this.setClearAlpha=function(){jt.setClearAlpha.apply(jt,arguments)},this.clear=function(R=!0,B=!0,Y=!0){let K=0;if(R){let $=!1;if(S!==null){let yt=S.texture.format;$=yt===hu||yt===cu||yt===lu}if($){let yt=S.texture.type,Rt=yt===Qn||yt===jn||yt===Cl||yt===gi||yt===ou||yt===au,Dt=jt.getClearColor(),Ot=jt.getClearAlpha(),$t=Dt.r,zt=Dt.g,Vt=Dt.b;Rt?(f[0]=$t,f[1]=zt,f[2]=Vt,f[3]=Ot,X.clearBufferuiv(X.COLOR,0,f)):(g[0]=$t,g[1]=zt,g[2]=Vt,g[3]=Ot,X.clearBufferiv(X.COLOR,0,g))}else K|=X.COLOR_BUFFER_BIT}B&&(K|=X.DEPTH_BUFFER_BIT),Y&&(K|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(K)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",O,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),vt.dispose(),Nt.dispose(),Ft.dispose(),T.dispose(),q.dispose(),at.dispose(),Tt.dispose(),Yt.dispose(),St.dispose(),qt.dispose(),qt.removeEventListener("sessionstart",He),qt.removeEventListener("sessionend",ae),k&&(k.dispose(),k=null),Ge.stop()};function dt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),v=!0}function O(){console.log("THREE.WebGLRenderer: Context Restored."),v=!1;let R=ne.autoReset,B=st.enabled,Y=st.autoUpdate,K=st.needsUpdate,$=st.type;Kt(),ne.autoReset=R,st.enabled=B,st.autoUpdate=Y,st.needsUpdate=K,st.type=$}function ht(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ut(R){let B=R.target;B.removeEventListener("dispose",ut),It(B)}function It(R){Ct(R),Ft.remove(R)}function Ct(R){let B=Ft.get(R).programs;B!==void 0&&(B.forEach(function(Y){St.releaseProgram(Y)}),R.isShaderMaterial&&St.releaseShaderCache(R))}this.renderBufferDirect=function(R,B,Y,K,$,yt){B===null&&(B=Mt);let Rt=$.isMesh&&$.matrixWorld.determinant()<0,Dt=Wd(R,B,Y,K,$);_t.setMaterial(K,Rt);let Ot=Y.index,$t=1;if(K.wireframe===!0){if(Ot=ot.getWireframeAttribute(Y),Ot===void 0)return;$t=2}let zt=Y.drawRange,Vt=Y.attributes.position,ye=zt.start*$t,tn=(zt.start+zt.count)*$t;yt!==null&&(ye=Math.max(ye,yt.start*$t),tn=Math.min(tn,(yt.start+yt.count)*$t)),Ot!==null?(ye=Math.max(ye,0),tn=Math.min(tn,Ot.count)):Vt!=null&&(ye=Math.max(ye,0),tn=Math.min(tn,Vt.count));let Ce=tn-ye;if(Ce<0||Ce===1/0)return;Tt.setup($,K,Dt,Y,Ot);let An,fe=nt;if(Ot!==null&&(An=rt.get(Ot),fe=ft,fe.setIndex(An)),$.isMesh)K.wireframe===!0?(_t.setLineWidth(K.wireframeLinewidth*Gt()),fe.setMode(X.LINES)):fe.setMode(X.TRIANGLES);else if($.isLine){let Zt=K.linewidth;Zt===void 0&&(Zt=1),_t.setLineWidth(Zt*Gt()),$.isLineSegments?fe.setMode(X.LINES):$.isLineLoop?fe.setMode(X.LINE_LOOP):fe.setMode(X.LINE_STRIP)}else $.isPoints?fe.setMode(X.POINTS):$.isSprite&&fe.setMode(X.TRIANGLES);if($.isBatchedMesh)fe.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else if($.isInstancedMesh)fe.renderInstances(ye,Ce,$.count);else if(Y.isInstancedBufferGeometry){let Zt=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,sa=Math.min(Y.instanceCount,Zt);fe.renderInstances(ye,Ce,sa)}else fe.render(ye,Ce)};function te(R,B,Y){R.transparent===!0&&R.side===ke&&R.forceSinglePass===!1?(R.side=je,R.needsUpdate=!0,_r(R,B,Y),R.side=ti,R.needsUpdate=!0,_r(R,B,Y),R.side=ke):_r(R,B,Y)}this.compile=function(R,B,Y=null){Y===null&&(Y=R),m=Nt.get(Y),m.init(),b.push(m),Y.traverseVisible(function($){$.isLight&&$.layers.test(B.layers)&&(m.pushLight($),$.castShadow&&m.pushShadow($))}),R!==Y&&R.traverseVisible(function($){$.isLight&&$.layers.test(B.layers)&&(m.pushLight($),$.castShadow&&m.pushShadow($))}),m.setupLights(y._useLegacyLights);let K=new Set;return R.traverse(function($){let yt=$.material;if(yt)if(Array.isArray(yt))for(let Rt=0;Rt<yt.length;Rt++){let Dt=yt[Rt];te(Dt,Y,$),K.add(Dt)}else te(yt,Y,$),K.add(yt)}),b.pop(),m=null,K},this.compileAsync=function(R,B,Y=null){let K=this.compile(R,B,Y);return new Promise($=>{function yt(){if(K.forEach(function(Rt){Ft.get(Rt).currentProgram.isReady()&&K.delete(Rt)}),K.size===0){$(R);return}setTimeout(yt,10)}At.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let ee=null;function Te(R){ee&&ee(R)}function He(){Ge.stop()}function ae(){Ge.start()}let Ge=new _u;Ge.setAnimationLoop(Te),typeof self<"u"&&Ge.setContext(self),this.setAnimationLoop=function(R){ee=R,qt.setAnimationLoop(R),R===null?Ge.stop():Ge.start()},qt.addEventListener("sessionstart",He),qt.addEventListener("sessionend",ae),this.render=function(R,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(v===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),qt.enabled===!0&&qt.isPresenting===!0&&(qt.cameraAutoUpdate===!0&&qt.updateCamera(B),B=qt.getCamera()),R.isScene===!0&&R.onBeforeRender(y,R,B,S),m=Nt.get(R,b.length),m.init(),b.push(m),et.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),F.setFromProjectionMatrix(et),J=this.localClippingEnabled,H=Bt.init(this.clippingPlanes,J),x=vt.get(R,p.length),x.init(),p.push(x),_n(R,B,0,y.sortObjects),x.finish(),y.sortObjects===!0&&x.sort(G,z),this.info.render.frame++,H===!0&&Bt.beginShadows();let Y=m.state.shadowsArray;if(st.render(Y,R,B),H===!0&&Bt.endShadows(),this.info.autoReset===!0&&this.info.reset(),jt.render(x,R),m.setupLights(y._useLegacyLights),B.isArrayCamera){let K=B.cameras;for(let $=0,yt=K.length;$<yt;$++){let Rt=K[$];rc(x,R,Rt,Rt.viewport)}}else rc(x,R,B);S!==null&&(P.updateMultisampleRenderTarget(S),P.updateRenderTargetMipmap(S)),R.isScene===!0&&R.onAfterRender(y,R,B),Tt.resetDefaultState(),C=-1,_=null,b.pop(),b.length>0?m=b[b.length-1]:m=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function _n(R,B,Y,K){if(R.visible===!1)return;if(R.layers.test(B.layers)){if(R.isGroup)Y=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(B);else if(R.isLight)m.pushLight(R),R.castShadow&&m.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||F.intersectsSprite(R)){K&&wt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(et);let Rt=at.update(R),Dt=R.material;Dt.visible&&x.push(R,Rt,Dt,Y,wt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||F.intersectsObject(R))){let Rt=at.update(R),Dt=R.material;if(K&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),wt.copy(R.boundingSphere.center)):(Rt.boundingSphere===null&&Rt.computeBoundingSphere(),wt.copy(Rt.boundingSphere.center)),wt.applyMatrix4(R.matrixWorld).applyMatrix4(et)),Array.isArray(Dt)){let Ot=Rt.groups;for(let $t=0,zt=Ot.length;$t<zt;$t++){let Vt=Ot[$t],ye=Dt[Vt.materialIndex];ye&&ye.visible&&x.push(R,Rt,ye,Y,wt.z,Vt)}}else Dt.visible&&x.push(R,Rt,Dt,Y,wt.z,null)}}let yt=R.children;for(let Rt=0,Dt=yt.length;Rt<Dt;Rt++)_n(yt[Rt],B,Y,K)}function rc(R,B,Y,K){let $=R.opaque,yt=R.transmissive,Rt=R.transparent;m.setupLightsView(Y),H===!0&&Bt.setGlobalState(y.clippingPlanes,Y),yt.length>0&&Gd($,yt,B,Y),K&&_t.viewport(E.copy(K)),$.length>0&&yr($,B,Y),yt.length>0&&yr(yt,B,Y),Rt.length>0&&yr(Rt,B,Y),_t.buffers.depth.setTest(!0),_t.buffers.depth.setMask(!0),_t.buffers.color.setMask(!0),_t.setPolygonOffset(!1)}function Gd(R,B,Y,K){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;let yt=Ut.isWebGL2;k===null&&(k=new pn(1,1,{generateMipmaps:!0,type:At.has("EXT_color_buffer_half_float")?ks:Qn,minFilter:Mn,samples:yt?4:0})),y.getDrawingBufferSize(gt),yt?k.setSize(gt.x,gt.y):k.setSize(io(gt.x),io(gt.y));let Rt=y.getRenderTarget();y.setRenderTarget(k),y.getClearColor(Q),I=y.getClearAlpha(),I<1&&y.setClearColor(16777215,.5),y.clear();let Dt=y.toneMapping;y.toneMapping=Jn,yr(R,Y,K),P.updateMultisampleRenderTarget(k),P.updateRenderTargetMipmap(k);let Ot=!1;for(let $t=0,zt=B.length;$t<zt;$t++){let Vt=B[$t],ye=Vt.object,tn=Vt.geometry,Ce=Vt.material,An=Vt.group;if(Ce.side===ke&&ye.layers.test(K.layers)){let fe=Ce.side;Ce.side=je,Ce.needsUpdate=!0,oc(ye,Y,K,tn,Ce,An),Ce.side=fe,Ce.needsUpdate=!0,Ot=!0}}Ot===!0&&(P.updateMultisampleRenderTarget(k),P.updateRenderTargetMipmap(k)),y.setRenderTarget(Rt),y.setClearColor(Q,I),y.toneMapping=Dt}function yr(R,B,Y){let K=B.isScene===!0?B.overrideMaterial:null;for(let $=0,yt=R.length;$<yt;$++){let Rt=R[$],Dt=Rt.object,Ot=Rt.geometry,$t=K===null?Rt.material:K,zt=Rt.group;Dt.layers.test(Y.layers)&&oc(Dt,B,Y,Ot,$t,zt)}}function oc(R,B,Y,K,$,yt){R.onBeforeRender(y,B,Y,K,$,yt),R.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),$.onBeforeRender(y,B,Y,K,R,yt),$.transparent===!0&&$.side===ke&&$.forceSinglePass===!1?($.side=je,$.needsUpdate=!0,y.renderBufferDirect(Y,B,K,$,R,yt),$.side=ti,$.needsUpdate=!0,y.renderBufferDirect(Y,B,K,$,R,yt),$.side=ke):y.renderBufferDirect(Y,B,K,$,R,yt),R.onAfterRender(y,B,Y,K,$,yt)}function _r(R,B,Y){B.isScene!==!0&&(B=Mt);let K=Ft.get(R),$=m.state.lights,yt=m.state.shadowsArray,Rt=$.state.version,Dt=St.getParameters(R,$.state,yt,B,Y),Ot=St.getProgramCacheKey(Dt),$t=K.programs;K.environment=R.isMeshStandardMaterial?B.environment:null,K.fog=B.fog,K.envMap=(R.isMeshStandardMaterial?q:T).get(R.envMap||K.environment),$t===void 0&&(R.addEventListener("dispose",ut),$t=new Map,K.programs=$t);let zt=$t.get(Ot);if(zt!==void 0){if(K.currentProgram===zt&&K.lightsStateVersion===Rt)return lc(R,Dt),zt}else Dt.uniforms=St.getUniforms(R),R.onBuild(Y,Dt,y),R.onBeforeCompile(Dt,y),zt=St.acquireProgram(Dt,Ot),$t.set(Ot,zt),K.uniforms=Dt.uniforms;let Vt=K.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Vt.clippingPlanes=Bt.uniform),lc(R,Dt),K.needsLights=qd(R),K.lightsStateVersion=Rt,K.needsLights&&(Vt.ambientLightColor.value=$.state.ambient,Vt.lightProbe.value=$.state.probe,Vt.directionalLights.value=$.state.directional,Vt.directionalLightShadows.value=$.state.directionalShadow,Vt.spotLights.value=$.state.spot,Vt.spotLightShadows.value=$.state.spotShadow,Vt.rectAreaLights.value=$.state.rectArea,Vt.ltc_1.value=$.state.rectAreaLTC1,Vt.ltc_2.value=$.state.rectAreaLTC2,Vt.pointLights.value=$.state.point,Vt.pointLightShadows.value=$.state.pointShadow,Vt.hemisphereLights.value=$.state.hemi,Vt.directionalShadowMap.value=$.state.directionalShadowMap,Vt.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Vt.spotShadowMap.value=$.state.spotShadowMap,Vt.spotLightMatrix.value=$.state.spotLightMatrix,Vt.spotLightMap.value=$.state.spotLightMap,Vt.pointShadowMap.value=$.state.pointShadowMap,Vt.pointShadowMatrix.value=$.state.pointShadowMatrix),K.currentProgram=zt,K.uniformsList=null,zt}function ac(R){if(R.uniformsList===null){let B=R.currentProgram.getUniforms();R.uniformsList=ns.seqWithValue(B.seq,R.uniforms)}return R.uniformsList}function lc(R,B){let Y=Ft.get(R);Y.outputColorSpace=B.outputColorSpace,Y.batching=B.batching,Y.instancing=B.instancing,Y.instancingColor=B.instancingColor,Y.skinning=B.skinning,Y.morphTargets=B.morphTargets,Y.morphNormals=B.morphNormals,Y.morphColors=B.morphColors,Y.morphTargetsCount=B.morphTargetsCount,Y.numClippingPlanes=B.numClippingPlanes,Y.numIntersection=B.numClipIntersection,Y.vertexAlphas=B.vertexAlphas,Y.vertexTangents=B.vertexTangents,Y.toneMapping=B.toneMapping}function Wd(R,B,Y,K,$){B.isScene!==!0&&(B=Mt),P.resetTextureUnits();let yt=B.fog,Rt=K.isMeshStandardMaterial?B.environment:null,Dt=S===null?y.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:On,Ot=(K.isMeshStandardMaterial?q:T).get(K.envMap||Rt),$t=K.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,zt=!!Y.attributes.tangent&&(!!K.normalMap||K.anisotropy>0),Vt=!!Y.morphAttributes.position,ye=!!Y.morphAttributes.normal,tn=!!Y.morphAttributes.color,Ce=Jn;K.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Ce=y.toneMapping);let An=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,fe=An!==void 0?An.length:0,Zt=Ft.get(K),sa=m.state.lights;if(H===!0&&(J===!0||R!==_)){let an=R===_&&K.id===C;Bt.setState(K,R,an)}let ge=!1;K.version===Zt.__version?(Zt.needsLights&&Zt.lightsStateVersion!==sa.state.version||Zt.outputColorSpace!==Dt||$.isBatchedMesh&&Zt.batching===!1||!$.isBatchedMesh&&Zt.batching===!0||$.isInstancedMesh&&Zt.instancing===!1||!$.isInstancedMesh&&Zt.instancing===!0||$.isSkinnedMesh&&Zt.skinning===!1||!$.isSkinnedMesh&&Zt.skinning===!0||$.isInstancedMesh&&Zt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Zt.instancingColor===!1&&$.instanceColor!==null||Zt.envMap!==Ot||K.fog===!0&&Zt.fog!==yt||Zt.numClippingPlanes!==void 0&&(Zt.numClippingPlanes!==Bt.numPlanes||Zt.numIntersection!==Bt.numIntersection)||Zt.vertexAlphas!==$t||Zt.vertexTangents!==zt||Zt.morphTargets!==Vt||Zt.morphNormals!==ye||Zt.morphColors!==tn||Zt.toneMapping!==Ce||Ut.isWebGL2===!0&&Zt.morphTargetsCount!==fe)&&(ge=!0):(ge=!0,Zt.__version=K.version);let ai=Zt.currentProgram;ge===!0&&(ai=_r(K,B,$));let cc=!1,Ts=!1,ra=!1,Ue=ai.getUniforms(),li=Zt.uniforms;if(_t.useProgram(ai.program)&&(cc=!0,Ts=!0,ra=!0),K.id!==C&&(C=K.id,Ts=!0),cc||_!==R){Ue.setValue(X,"projectionMatrix",R.projectionMatrix),Ue.setValue(X,"viewMatrix",R.matrixWorldInverse);let an=Ue.map.cameraPosition;an!==void 0&&an.setValue(X,wt.setFromMatrixPosition(R.matrixWorld)),Ut.logarithmicDepthBuffer&&Ue.setValue(X,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(K.isMeshPhongMaterial||K.isMeshToonMaterial||K.isMeshLambertMaterial||K.isMeshBasicMaterial||K.isMeshStandardMaterial||K.isShaderMaterial)&&Ue.setValue(X,"isOrthographic",R.isOrthographicCamera===!0),_!==R&&(_=R,Ts=!0,ra=!0)}if($.isSkinnedMesh){Ue.setOptional(X,$,"bindMatrix"),Ue.setOptional(X,$,"bindMatrixInverse");let an=$.skeleton;an&&(Ut.floatVertexTextures?(an.boneTexture===null&&an.computeBoneTexture(),Ue.setValue(X,"boneTexture",an.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}$.isBatchedMesh&&(Ue.setOptional(X,$,"batchingTexture"),Ue.setValue(X,"batchingTexture",$._matricesTexture,P));let oa=Y.morphAttributes;if((oa.position!==void 0||oa.normal!==void 0||oa.color!==void 0&&Ut.isWebGL2===!0)&&L.update($,Y,ai),(Ts||Zt.receiveShadow!==$.receiveShadow)&&(Zt.receiveShadow=$.receiveShadow,Ue.setValue(X,"receiveShadow",$.receiveShadow)),K.isMeshGouraudMaterial&&K.envMap!==null&&(li.envMap.value=Ot,li.flipEnvMap.value=Ot.isCubeTexture&&Ot.isRenderTargetTexture===!1?-1:1),Ts&&(Ue.setValue(X,"toneMappingExposure",y.toneMappingExposure),Zt.needsLights&&Xd(li,ra),yt&&K.fog===!0&&xt.refreshFogUniforms(li,yt),xt.refreshMaterialUniforms(li,K,W,N,k),ns.upload(X,ac(Zt),li,P)),K.isShaderMaterial&&K.uniformsNeedUpdate===!0&&(ns.upload(X,ac(Zt),li,P),K.uniformsNeedUpdate=!1),K.isSpriteMaterial&&Ue.setValue(X,"center",$.center),Ue.setValue(X,"modelViewMatrix",$.modelViewMatrix),Ue.setValue(X,"normalMatrix",$.normalMatrix),Ue.setValue(X,"modelMatrix",$.matrixWorld),K.isShaderMaterial||K.isRawShaderMaterial){let an=K.uniformsGroups;for(let aa=0,$d=an.length;aa<$d;aa++)if(Ut.isWebGL2){let hc=an[aa];Yt.update(hc,ai),Yt.bind(hc,ai)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ai}function Xd(R,B){R.ambientLightColor.needsUpdate=B,R.lightProbe.needsUpdate=B,R.directionalLights.needsUpdate=B,R.directionalLightShadows.needsUpdate=B,R.pointLights.needsUpdate=B,R.pointLightShadows.needsUpdate=B,R.spotLights.needsUpdate=B,R.spotLightShadows.needsUpdate=B,R.rectAreaLights.needsUpdate=B,R.hemisphereLights.needsUpdate=B}function qd(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(R,B,Y){Ft.get(R.texture).__webglTexture=B,Ft.get(R.depthTexture).__webglTexture=Y;let K=Ft.get(R);K.__hasExternalTextures=!0,K.__hasExternalTextures&&(K.__autoAllocateDepthBuffer=Y===void 0,K.__autoAllocateDepthBuffer||At.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),K.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,B){let Y=Ft.get(R);Y.__webglFramebuffer=B,Y.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(R,B=0,Y=0){S=R,w=B,M=Y;let K=!0,$=null,yt=!1,Rt=!1;if(R){let Ot=Ft.get(R);Ot.__useDefaultFramebuffer!==void 0?(_t.bindFramebuffer(X.FRAMEBUFFER,null),K=!1):Ot.__webglFramebuffer===void 0?P.setupRenderTarget(R):Ot.__hasExternalTextures&&P.rebindTextures(R,Ft.get(R.texture).__webglTexture,Ft.get(R.depthTexture).__webglTexture);let $t=R.texture;($t.isData3DTexture||$t.isDataArrayTexture||$t.isCompressedArrayTexture)&&(Rt=!0);let zt=Ft.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(zt[B])?$=zt[B][Y]:$=zt[B],yt=!0):Ut.isWebGL2&&R.samples>0&&P.useMultisampledRTT(R)===!1?$=Ft.get(R).__webglMultisampledFramebuffer:Array.isArray(zt)?$=zt[Y]:$=zt,E.copy(R.viewport),D.copy(R.scissor),V=R.scissorTest}else E.copy(j).multiplyScalar(W).floor(),D.copy(Z).multiplyScalar(W).floor(),V=tt;if(_t.bindFramebuffer(X.FRAMEBUFFER,$)&&Ut.drawBuffers&&K&&_t.drawBuffers(R,$),_t.viewport(E),_t.scissor(D),_t.setScissorTest(V),yt){let Ot=Ft.get(R.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ot.__webglTexture,Y)}else if(Rt){let Ot=Ft.get(R.texture),$t=B||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,Ot.__webglTexture,Y||0,$t)}C=-1},this.readRenderTargetPixels=function(R,B,Y,K,$,yt,Rt){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=Ft.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Rt!==void 0&&(Dt=Dt[Rt]),Dt){_t.bindFramebuffer(X.FRAMEBUFFER,Dt);try{let Ot=R.texture,$t=Ot.format,zt=Ot.type;if($t!==Ye&&ct.convert($t)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Vt=zt===ks&&(At.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&At.has("EXT_color_buffer_float"));if(zt!==Qn&&ct.convert(zt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(zt===Un&&(Ut.isWebGL2||At.has("OES_texture_float")||At.has("WEBGL_color_buffer_float")))&&!Vt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=R.width-K&&Y>=0&&Y<=R.height-$&&X.readPixels(B,Y,K,$,ct.convert($t),ct.convert(zt),yt)}finally{let Ot=S!==null?Ft.get(S).__webglFramebuffer:null;_t.bindFramebuffer(X.FRAMEBUFFER,Ot)}}},this.copyFramebufferToTexture=function(R,B,Y=0){let K=Math.pow(2,-Y),$=Math.floor(B.image.width*K),yt=Math.floor(B.image.height*K);P.setTexture2D(B,0),X.copyTexSubImage2D(X.TEXTURE_2D,Y,0,0,R.x,R.y,$,yt),_t.unbindTexture()},this.copyTextureToTexture=function(R,B,Y,K=0){let $=B.image.width,yt=B.image.height,Rt=ct.convert(Y.format),Dt=ct.convert(Y.type);P.setTexture2D(Y,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,Y.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,Y.unpackAlignment),B.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,K,R.x,R.y,$,yt,Rt,Dt,B.image.data):B.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,K,R.x,R.y,B.mipmaps[0].width,B.mipmaps[0].height,Rt,B.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,K,R.x,R.y,Rt,Dt,B.image),K===0&&Y.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),_t.unbindTexture()},this.copyTextureToTexture3D=function(R,B,Y,K,$=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let yt=R.max.x-R.min.x+1,Rt=R.max.y-R.min.y+1,Dt=R.max.z-R.min.z+1,Ot=ct.convert(K.format),$t=ct.convert(K.type),zt;if(K.isData3DTexture)P.setTexture3D(K,0),zt=X.TEXTURE_3D;else if(K.isDataArrayTexture||K.isCompressedArrayTexture)P.setTexture2DArray(K,0),zt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,K.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,K.unpackAlignment);let Vt=X.getParameter(X.UNPACK_ROW_LENGTH),ye=X.getParameter(X.UNPACK_IMAGE_HEIGHT),tn=X.getParameter(X.UNPACK_SKIP_PIXELS),Ce=X.getParameter(X.UNPACK_SKIP_ROWS),An=X.getParameter(X.UNPACK_SKIP_IMAGES),fe=Y.isCompressedTexture?Y.mipmaps[$]:Y.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,fe.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,fe.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,R.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,R.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,R.min.z),Y.isDataTexture||Y.isData3DTexture?X.texSubImage3D(zt,$,B.x,B.y,B.z,yt,Rt,Dt,Ot,$t,fe.data):Y.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(zt,$,B.x,B.y,B.z,yt,Rt,Dt,Ot,fe.data)):X.texSubImage3D(zt,$,B.x,B.y,B.z,yt,Rt,Dt,Ot,$t,fe),X.pixelStorei(X.UNPACK_ROW_LENGTH,Vt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ye),X.pixelStorei(X.UNPACK_SKIP_PIXELS,tn),X.pixelStorei(X.UNPACK_SKIP_ROWS,Ce),X.pixelStorei(X.UNPACK_SKIP_IMAGES,An),$===0&&K.generateMipmaps&&X.generateMipmap(zt),_t.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?P.setTextureCube(R,0):R.isData3DTexture?P.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?P.setTexture2DArray(R,0):P.setTexture2D(R,0),_t.unbindTexture()},this.resetState=function(){w=0,M=0,S=null,_t.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Rl?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===Co?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===xe?yi:du}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===yi?xe:On}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},ll=class extends Gs{};ll.prototype.isWebGL1Renderer=!0;var mo=class extends ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Uh=new A,Dh=new ue,Oh=new ue,ty=new A,Fh=new it,Hr=new A,Fa=new mn,kh=new it,ka=new Fn,Ws=class extends mt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=xc,this.bindMatrix=new it,this.bindMatrixInverse=new it,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new $e),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Hr),this.boundingBox.expandByPoint(Hr)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Hr),this.boundingSphere.expandByPoint(Hr)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Fa.copy(this.boundingSphere),Fa.applyMatrix4(s),t.ray.intersectsSphere(Fa)!==!1&&(kh.copy(s).invert(),ka.copy(t.ray).applyMatrix4(kh),!(this.boundingBox!==null&&ka.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,ka)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new ue,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===xc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Ao?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,s=this.geometry;Dh.fromBufferAttribute(s.attributes.skinIndex,t),Oh.fromBufferAttribute(s.attributes.skinWeight,t),Uh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=Oh.getComponent(r);if(o!==0){let a=Dh.getComponent(r);Fh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(ty.copy(Uh).applyMatrix4(Fh),o)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}},Xs=class extends ce{constructor(){super(),this.isBone=!0,this.type="Bone"}},ls=class extends Ke{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Pe,h=Pe,u,d){super(null,o,a,l,c,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},zh=new it,ey=new it,go=class i{constructor(t=[],e=[]){this.uuid=Si(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new it)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new it;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:ey;zh.multiplyMatrices(a,e[r]),zh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new ls(e,t,t,Ye,Un);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Xs),this.bones.push(o),this.boneInverses.push(new it().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){let o=e[s];t.bones.push(o.uuid);let a=n[s];t.boneInverses.push(a.toArray())}return t}},xo=class extends _e{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Yi=new it,Bh=new it,Gr=[],Vh=new $e,ny=new it,Is=new mt,Ns=new mn,cs=class extends mt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new xo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,ny)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new $e),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),Vh.copy(t.boundingBox).applyMatrix4(Yi),this.boundingBox.union(Vh)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Yi),Ns.copy(t.boundingSphere).applyMatrix4(Yi),this.boundingSphere.union(Ns)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(Is.geometry=this.geometry,Is.material=this.material,Is.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ns.copy(this.boundingSphere),Ns.applyMatrix4(n),t.ray.intersectsSphere(Ns)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Yi),Bh.multiplyMatrices(n,Yi),Is.matrixWorld=Bh,Is.raycast(t,Gr);for(let o=0,a=Gr.length;o<a;o++){let l=Gr[o];l.instanceId=r,l.object=this,e.push(l)}Gr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new xo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var wn=class extends kn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Et(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Hh=new A,Gh=new A,Wh=new it,za=new Fn,Wr=new mn,Je=class extends ce{constructor(t=new ie,e=new wn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Hh.fromBufferAttribute(e,s-1),Gh.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Hh.distanceTo(Gh);t.setAttribute("lineDistance",new Ht(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(s),Wr.radius+=r,t.ray.intersectsSphere(Wr)===!1)return;Wh.copy(s).invert(),za.copy(t.ray).applyMatrix4(Wh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new A,h=new A,u=new A,d=new A,f=this.isLineSegments?2:1,g=n.index,m=n.attributes.position;if(g!==null){let p=Math.max(0,o.start),b=Math.min(g.count,o.start+o.count);for(let y=p,v=b-1;y<v;y+=f){let w=g.getX(y),M=g.getX(y+1);if(c.fromBufferAttribute(m,w),h.fromBufferAttribute(m,M),za.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let C=t.ray.origin.distanceTo(d);C<t.near||C>t.far||e.push({distance:C,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}else{let p=Math.max(0,o.start),b=Math.min(m.count,o.start+o.count);for(let y=p,v=b-1;y<v;y+=f){if(c.fromBufferAttribute(m,y),h.fromBufferAttribute(m,y+1),za.distanceSqToSegment(c,h,d,u)>l)continue;d.applyMatrix4(this.matrixWorld);let M=t.ray.origin.distanceTo(d);M<t.near||M>t.far||e.push({distance:M,point:u.clone().applyMatrix4(this.matrixWorld),index:y,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}},Xh=new A,qh=new A,qs=class extends Je{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Xh.fromBufferAttribute(e,s),qh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Xh.distanceTo(qh);t.setAttribute("lineDistance",new Ht(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var $s=class extends kn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Et(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},$h=new it,cl=new Fn,Xr=new mn,qr=new A,yo=class extends ce{constructor(t=new ie,e=new $s){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xr.copy(n.boundingSphere),Xr.applyMatrix4(s),Xr.radius+=r,t.ray.intersectsSphere(Xr)===!1)return;$h.copy(s).invert(),cl.copy(t.ray).applyMatrix4($h);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,x=f;g<x;g++){let m=c.getX(g);qr.fromBufferAttribute(u,m),Yh(qr,m,l,s,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,x=f;g<x;g++)qr.fromBufferAttribute(u,g),Yh(qr,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Yh(i,t,e,n,s,r,o){let a=cl.distanceSqToPoint(i);if(a<e){let l=new A;cl.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}var Ne=class i extends ie{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,x=[],m=n/2,p=0;b(),o===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Ht(u,3)),this.setAttribute("normal",new Ht(d,3)),this.setAttribute("uv",new Ht(f,2));function b(){let v=new A,w=new A,M=0,S=(e-t)/n;for(let C=0;C<=r;C++){let _=[],E=C/r,D=E*(e-t)+t;for(let V=0;V<=s;V++){let Q=V/s,I=Q*l+a,U=Math.sin(I),N=Math.cos(I);w.x=D*U,w.y=-E*n+m,w.z=D*N,u.push(w.x,w.y,w.z),v.set(U,S,N).normalize(),d.push(v.x,v.y,v.z),f.push(Q,1-E),_.push(g++)}x.push(_)}for(let C=0;C<s;C++)for(let _=0;_<r;_++){let E=x[_][C],D=x[_+1][C],V=x[_+1][C+1],Q=x[_][C+1];h.push(E,D,Q),h.push(D,V,Q),M+=6}c.addGroup(p,M,0),p+=M}function y(v){let w=g,M=new Lt,S=new A,C=0,_=v===!0?t:e,E=v===!0?1:-1;for(let V=1;V<=s;V++)u.push(0,m*E,0),d.push(0,E,0),f.push(.5,.5),g++;let D=g;for(let V=0;V<=s;V++){let I=V/s*l+a,U=Math.cos(I),N=Math.sin(I);S.x=_*N,S.y=m*E,S.z=_*U,u.push(S.x,S.y,S.z),d.push(0,E,0),M.x=U*.5+.5,M.y=N*.5*E+.5,f.push(M.x,M.y),g++}for(let V=0;V<s;V++){let Q=w+V,I=D+V;v===!0?h.push(I,I+1,Q):h.push(I+1,I,Q),C+=3}c.addGroup(p,C,v===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var hl=class i extends ie{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),h(),this.setAttribute("position",new Ht(r,3)),this.setAttribute("normal",new Ht(r.slice(),3)),this.setAttribute("uv",new Ht(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let y=new A,v=new A,w=new A;for(let M=0;M<e.length;M+=3)f(e[M+0],y),f(e[M+1],v),f(e[M+2],w),l(y,v,w,b)}function l(b,y,v,w){let M=w+1,S=[];for(let C=0;C<=M;C++){S[C]=[];let _=b.clone().lerp(v,C/M),E=y.clone().lerp(v,C/M),D=M-C;for(let V=0;V<=D;V++)V===0&&C===M?S[C][V]=_:S[C][V]=_.clone().lerp(E,V/D)}for(let C=0;C<M;C++)for(let _=0;_<2*(M-C)-1;_++){let E=Math.floor(_/2);_%2===0?(d(S[C][E+1]),d(S[C+1][E]),d(S[C][E])):(d(S[C][E+1]),d(S[C+1][E+1]),d(S[C+1][E]))}}function c(b){let y=new A;for(let v=0;v<r.length;v+=3)y.x=r[v+0],y.y=r[v+1],y.z=r[v+2],y.normalize().multiplyScalar(b),r[v+0]=y.x,r[v+1]=y.y,r[v+2]=y.z}function h(){let b=new A;for(let y=0;y<r.length;y+=3){b.x=r[y+0],b.y=r[y+1],b.z=r[y+2];let v=m(b)/2/Math.PI+.5,w=p(b)/Math.PI+.5;o.push(v,1-w)}g(),u()}function u(){for(let b=0;b<o.length;b+=6){let y=o[b+0],v=o[b+2],w=o[b+4],M=Math.max(y,v,w),S=Math.min(y,v,w);M>.9&&S<.1&&(y<.2&&(o[b+0]+=1),v<.2&&(o[b+2]+=1),w<.2&&(o[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,y){let v=b*3;y.x=t[v+0],y.y=t[v+1],y.z=t[v+2]}function g(){let b=new A,y=new A,v=new A,w=new A,M=new Lt,S=new Lt,C=new Lt;for(let _=0,E=0;_<r.length;_+=9,E+=6){b.set(r[_+0],r[_+1],r[_+2]),y.set(r[_+3],r[_+4],r[_+5]),v.set(r[_+6],r[_+7],r[_+8]),M.set(o[E+0],o[E+1]),S.set(o[E+2],o[E+3]),C.set(o[E+4],o[E+5]),w.copy(b).add(y).add(v).divideScalar(3);let D=m(w);x(M,E+0,b,D),x(S,E+2,y,D),x(C,E+4,v,D)}}function x(b,y,v,w){w<0&&b.x===1&&(o[y]=b.x-1),v.x===0&&v.z===0&&(o[y]=w/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var iy={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=Eu(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,u,d,f;if(n&&(r=ly(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let g=e;g<s;g+=e)u=i[g],d=i[g+1],u<a&&(a=u),d<l&&(l=d),u>c&&(c=u),d>h&&(h=d);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Ys(r,o,e,a,l,f,0),o}};function Eu(i,t,e,n,s){let r,o;if(s===_y(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Zh(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Zh(r,i[r],i[r+1],o);return o&&Po(o,o.next)&&(js(o),o=o.next),o}function vi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Po(e,e.next)||pe(e.prev,e,e.next)===0)){if(js(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ys(i,t,e,n,s,r,o){if(!i)return;!o&&r&&fy(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?ry(i,n,s,r):sy(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),js(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=oy(vi(i),t,e),Ys(i,t,e,n,s,r,2)):o===2&&ay(i,t,e,n,s,r):Ys(vi(i),t,e,n,s,r,1);break}}}function sy(i){let t=i.prev,e=i,n=i.next;if(pe(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,u=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Qi(s,a,r,l,o,c,g.x,g.y)&&pe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ry(i,t,e,n){let s=i.prev,r=i,o=i.next;if(pe(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,h=s.y,u=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,g=h<u?h<d?h:d:u<d?u:d,x=a>l?a>c?a:c:l>c?l:c,m=h>u?h>d?h:d:u>d?u:d,p=ul(f,g,t,e,n),b=ul(x,m,t,e,n),y=i.prevZ,v=i.nextZ;for(;y&&y.z>=p&&v&&v.z<=b;){if(y.x>=f&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Qi(a,h,l,u,c,d,y.x,y.y)&&pe(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Qi(a,h,l,u,c,d,v.x,v.y)&&pe(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=p;){if(y.x>=f&&y.x<=x&&y.y>=g&&y.y<=m&&y!==s&&y!==o&&Qi(a,h,l,u,c,d,y.x,y.y)&&pe(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=b;){if(v.x>=f&&v.x<=x&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Qi(a,h,l,u,c,d,v.x,v.y)&&pe(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function oy(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Po(s,r)&&Au(s,n,n.next,r)&&Zs(s,r)&&Zs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),js(n),js(n.next),n=i=r),n=n.next}while(n!==i);return vi(n)}function ay(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&gy(o,a)){let l=Tu(o,a);o=vi(o,o.next),l=vi(l,l.next),Ys(o,t,e,n,s,r,0),Ys(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function ly(i,t,e,n){let s=[],r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Eu(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(my(c));for(s.sort(cy),r=0;r<s.length;r++)e=hy(s[r],e);return e}function cy(i,t){return i.x-t.x}function hy(i,t){let e=uy(i,t);if(!e)return t;let n=Tu(e,i);return vi(n,n.next),vi(e,e.next)}function uy(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,l=s.x,c=s.y,h=1/0,u;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Qi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),Zs(e,i)&&(u<h||u===h&&(e.x>s.x||e.x===s.x&&dy(s,e)))&&(s=e,h=u)),e=e.next;while(e!==a);return s}function dy(i,t){return pe(i.prev,i,t.prev)<0&&pe(t.next,i,i.next)<0}function fy(i,t,e,n){let s=i;do s.z===0&&(s.z=ul(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,py(s)}function py(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function ul(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function my(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Qi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function gy(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!xy(i,t)&&(Zs(i,t)&&Zs(t,i)&&yy(i,t)&&(pe(i.prev,i,t.prev)||pe(i,t.prev,t))||Po(i,t)&&pe(i.prev,i,i.next)>0&&pe(t.prev,t,t.next)>0)}function pe(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Po(i,t){return i.x===t.x&&i.y===t.y}function Au(i,t,e,n){let s=Yr(pe(i,t,e)),r=Yr(pe(i,t,n)),o=Yr(pe(e,n,i)),a=Yr(pe(e,n,t));return!!(s!==r&&o!==a||s===0&&$r(i,e,t)||r===0&&$r(i,n,t)||o===0&&$r(e,i,n)||a===0&&$r(e,t,n))}function $r(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Yr(i){return i>0?1:i<0?-1:0}function xy(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Au(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Zs(i,t){return pe(i.prev,i,i.next)<0?pe(i,t,i.next)>=0&&pe(i,i.prev,t)>=0:pe(i,t,i.prev)<0||pe(i,i.next,t)<0}function yy(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Tu(i,t){let e=new dl(i.i,i.x,i.y),n=new dl(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Zh(i,t,e,n){let s=new dl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function js(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function dl(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function _y(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var _o=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];jh(t),Kh(n,t);let o=t.length;e.forEach(jh);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Kh(n,e[l]);let a=iy.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function jh(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Kh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Bn=class i extends hl{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var hs=class i extends ie{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new A,d=new A,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){let b=[],y=p/n,v=0;p===0&&o===0?v=.5/e:p===n&&l===Math.PI&&(v=-.5/e);for(let w=0;w<=e;w++){let M=w/e;u.x=-t*Math.cos(s+M*r)*Math.sin(o+y*a),u.y=t*Math.cos(o+y*a),u.z=t*Math.sin(s+M*r)*Math.sin(o+y*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(M+v,1-y),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){let y=h[p][b+1],v=h[p][b],w=h[p+1][b],M=h[p+1][b+1];(p!==0||o>0)&&f.push(y,v,M),(p!==n-1||l<Math.PI)&&f.push(v,w,M)}this.setIndex(f),this.setAttribute("position",new Ht(g,3)),this.setAttribute("normal",new Ht(x,3)),this.setAttribute("uv",new Ht(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var ei=class i extends ie{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],h=new A,u=new A,d=new A;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let x=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(x),u.y=(t+e*Math.cos(m))*Math.sin(x),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let x=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,b=(s+1)*f+g;o.push(x,m,b),o.push(m,p,b)}this.setIndex(o),this.setAttribute("position",new Ht(a,3)),this.setAttribute("normal",new Ht(l,3)),this.setAttribute("uv",new Ht(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var vo=class extends kn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Et(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Et(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fu,this.normalScale=new Lt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Zr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function vy(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var us=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},fl=class extends us{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wc,endingEnd:Wc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Xc:r=t,a=2*e-n;break;case qc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Xc:o=t,l=2*n-e;break;case qc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),x=g*g,m=x*g,p=-d*m+2*d*x-d*g,b=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*g+1,y=(-1-f)*m+(1.5+f)*x+.5*g,v=f*m-f*x;for(let w=0;w!==a;++w)r[w]=p*o[h+w]+b*o[c+w]+y*o[l+w]+v*o[u+w];return r}},pl=class extends us{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},ml=class extends us{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},gn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Zr(e,this.TimeBufferType),this.values=Zr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Zr(t.times,Array),values:Zr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ml(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new pl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new fl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Kr:e=this.InterpolantFactoryMethodDiscrete;break;case Jr:e=this.InterpolantFactoryMethodLinear;break;case pa:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Kr;case this.InterpolantFactoryMethodLinear:return Jr;case this.InterpolantFactoryMethodSmooth:return pa}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&vy(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===pa,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let x=e[u+g];if(x!==e[d+g]||x!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};gn.prototype.TimeBufferType=Float32Array;gn.prototype.ValueBufferType=Float32Array;gn.prototype.DefaultInterpolation=Jr;var Mi=class extends gn{};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=Kr;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var gl=class extends gn{};gl.prototype.ValueTypeName="color";var xl=class extends gn{};xl.prototype.ValueTypeName="number";var yl=class extends us{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)bt.slerpFlat(r,0,o,c-a,o,c,l);return r}},Ks=class extends gn{InterpolantFactoryMethodLinear(t){return new yl(this.times,this.values,this.getValueSize(),t)}};Ks.prototype.ValueTypeName="quaternion";Ks.prototype.DefaultInterpolation=Jr;Ks.prototype.InterpolantFactoryMethodSmooth=void 0;var bi=class extends gn{};bi.prototype.ValueTypeName="string";bi.prototype.ValueBufferType=Array;bi.prototype.DefaultInterpolation=Kr;bi.prototype.InterpolantFactoryMethodLinear=void 0;bi.prototype.InterpolantFactoryMethodSmooth=void 0;var _l=class extends gn{};_l.prototype.ValueTypeName="vector";var Jh={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},vl=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null}}},My=new vl,Js=class{constructor(t){this.manager=t!==void 0?t:My,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};Js.DEFAULT_MATERIAL_NAME="__DEFAULT";var In={},Ml=class extends Error{constructor(t,e){super(t),this.response=e}},bl=class extends Js{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Jh.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(In[t]!==void 0){In[t].push({onLoad:e,onProgress:n,onError:s});return}In[t]=[],In[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=In[t],u=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=d?parseInt(d):0,g=f!==0,x=0,m=new ReadableStream({start(p){b();function b(){u.read().then(({done:y,value:v})=>{if(y)p.close();else{x+=v.byteLength;let w=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:f});for(let M=0,S=h.length;M<S;M++){let C=h[M];C.onProgress&&C.onProgress(w)}p.enqueue(v),b()}})}}});return new Response(m)}else throw new Ml(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a===void 0)return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Jh.add(t,c);let h=In[t];delete In[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=In[t];if(h===void 0)throw this.manager.itemError(t),c;delete In[t];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var Mo=class extends Js{constructor(t){super(t)}load(t,e,n,s){let r=this,o=new ls,a=new bl(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(l){let c;try{c=r.parse(l)}catch(h){if(s!==void 0)s(h);else{console.error(h);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:sn,o.wrapT=c.wrapT!==void 0?c.wrapT:sn,o.magFilter=c.magFilter!==void 0?c.magFilter:Le,o.minFilter=c.minFilter!==void 0?c.minFilter:Le,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0?o.colorSpace=c.colorSpace:c.encoding!==void 0&&(o.encoding=c.encoding),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=Mn),c.mipmapCount===1&&(o.minFilter=Le),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,e&&e(o,c)},n,s),o}};var bo=class extends ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Et(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},wo=class extends bo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Et(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Ba=new it,Qh=new A,tu=new A,wl=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Lt(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vs,this._frameExtents=new Lt(1,1),this._viewportCount=1,this._viewports=[new ue(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Qh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qh),tu.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tu),e.updateMatrixWorld(),Ba.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ba),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ba)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var Sl=class extends wl{constructor(){super(new uo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},So=class extends bo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.shadow=new Sl}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Il="\\[\\]\\.:\\/",by=new RegExp("["+Il+"]","g"),Nl="[^"+Il+"]",wy="[^"+Il.replace("\\.","")+"]",Sy=/((?:WC+[\/:])*)/.source.replace("WC",Nl),Ey=/(WCOD+)?/.source.replace("WCOD",wy),Ay=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Nl),Ty=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Nl),Cy=new RegExp("^"+Sy+Ey+Ay+Ty+"$"),Ry=["material","materials","bones","map"],El=class{constructor(t,e,n){let s=n||he.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},he=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(by,"")}static parseTrackName(t){let e=Cy.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Ry.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};he.Composite=El;he.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};he.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};he.prototype.GetterByBindingType=[he.prototype._getValue_direct,he.prototype._getValue_array,he.prototype._getValue_arrayElement,he.prototype._getValue_toArray];he.prototype.SetterByBindingTypeAndVersioning=[[he.prototype._setValue_direct,he.prototype._setValue_direct_setNeedsUpdate,he.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[he.prototype._setValue_array,he.prototype._setValue_array_setNeedsUpdate,he.prototype._setValue_array_setMatrixWorldNeedsUpdate],[he.prototype._setValue_arrayElement,he.prototype._setValue_arrayElement_setNeedsUpdate,he.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[he.prototype._setValue_fromArray,he.prototype._setValue_fromArray_setNeedsUpdate,he.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var X_=new Float32Array(1);var ds=class{constructor(t,e,n=0,s=1/0){this.ray=new Fn(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Bs,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Al(t,this,n,e),n.sort(eu),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Al(t[s],this,n,e);return n.sort(eu),n}};function eu(i,t){return i.distance-t.distance}function Al(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)Al(s[r],t,e,!0)}}var Qs=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Fe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Eo=class extends qs{constructor(t=10,e=10,n=4473924,s=8947848){n=new Et(n),s=new Et(s);let r=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,f=0,g=-a;d<=e;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let x=d===r?n:s;x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3}let h=new ie;h.setAttribute("position",new Ht(l,3)),h.setAttribute("color",new Ht(c,3));let u=new wn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Tl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Tl);var Cu={type:"change"},Ul={type:"start"},Ru={type:"end"},Lo=new Fn,Pu=new dn,Py=Math.cos(70*mu.DEG2RAD),Io=class extends bn{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:xn.ROTATE,MIDDLE:xn.DOLLY,RIGHT:xn.PAN},this.touches={ONE:wi.ROTATE,TWO:wi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",at),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",at),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Cu),n.update(),r=s.NONE},this.update=function(){let L=new A,nt=new bt().setFromUnitVectors(t.up,new A(0,1,0)),ft=nt.clone().invert(),ct=new A,Tt=new bt,Yt=new A,Kt=2*Math.PI;return function(dt=null){let O=n.object.position;L.copy(O).sub(n.target),L.applyQuaternion(nt),a.setFromVector3(L),n.autoRotate&&r===s.NONE&&D(_(dt)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let ht=n.minAzimuthAngle,ut=n.maxAzimuthAngle;isFinite(ht)&&isFinite(ut)&&(ht<-Math.PI?ht+=Kt:ht>Math.PI&&(ht-=Kt),ut<-Math.PI?ut+=Kt:ut>Math.PI&&(ut-=Kt),ht<=ut?a.theta=Math.max(ht,Math.min(ut,a.theta)):a.theta=a.theta>(ht+ut)/2?Math.max(ht,a.theta):Math.min(ut,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&M||n.object.isOrthographicCamera?a.radius=z(a.radius):a.radius=z(a.radius*c),L.setFromSpherical(a),L.applyQuaternion(ft),O.copy(n.target).add(L),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),h.set(0,0,0));let It=!1;if(n.zoomToCursor&&M){let Ct=null;if(n.object.isPerspectiveCamera){let te=L.length();Ct=z(te*c);let ee=te-Ct;n.object.position.addScaledVector(v,ee),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let te=new A(w.x,w.y,0);te.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),It=!0;let ee=new A(w.x,w.y,0);ee.unproject(n.object),n.object.position.sub(ee).add(te),n.object.updateMatrixWorld(),Ct=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Ct!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Ct).add(n.object.position):(Lo.origin.copy(n.object.position),Lo.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Lo.direction))<Py?t.lookAt(n.target):(Pu.setFromNormalAndCoplanarPoint(n.object.up,n.target),Lo.intersectPlane(Pu,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),It=!0);return c=1,M=!1,It||ct.distanceToSquared(n.object.position)>o||8*(1-Tt.dot(n.object.quaternion))>o||Yt.distanceToSquared(n.target)>0?(n.dispatchEvent(Cu),ct.copy(n.object.position),Tt.copy(n.object.quaternion),Yt.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",vt),n.domElement.removeEventListener("pointerdown",Ft),n.domElement.removeEventListener("pointercancel",T),n.domElement.removeEventListener("wheel",ot),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",T),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",at),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,o=1e-6,a=new Qs,l=new Qs,c=1,h=new A,u=new Lt,d=new Lt,f=new Lt,g=new Lt,x=new Lt,m=new Lt,p=new Lt,b=new Lt,y=new Lt,v=new A,w=new Lt,M=!1,S=[],C={};function _(L){return L!==null?2*Math.PI/60*n.autoRotateSpeed*L:2*Math.PI/60/60*n.autoRotateSpeed}function E(L){let nt=Math.abs(L)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*nt)}function D(L){l.theta-=L}function V(L){l.phi-=L}let Q=function(){let L=new A;return function(ft,ct){L.setFromMatrixColumn(ct,0),L.multiplyScalar(-ft),h.add(L)}}(),I=function(){let L=new A;return function(ft,ct){n.screenSpacePanning===!0?L.setFromMatrixColumn(ct,1):(L.setFromMatrixColumn(ct,0),L.crossVectors(n.object.up,L)),L.multiplyScalar(ft),h.add(L)}}(),U=function(){let L=new A;return function(ft,ct){let Tt=n.domElement;if(n.object.isPerspectiveCamera){let Yt=n.object.position;L.copy(Yt).sub(n.target);let Kt=L.length();Kt*=Math.tan(n.object.fov/2*Math.PI/180),Q(2*ft*Kt/Tt.clientHeight,n.object.matrix),I(2*ct*Kt/Tt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Q(ft*(n.object.right-n.object.left)/n.object.zoom/Tt.clientWidth,n.object.matrix),I(ct*(n.object.top-n.object.bottom)/n.object.zoom/Tt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function N(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function W(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function G(L,nt){if(!n.zoomToCursor)return;M=!0;let ft=n.domElement.getBoundingClientRect(),ct=L-ft.left,Tt=nt-ft.top,Yt=ft.width,Kt=ft.height;w.x=ct/Yt*2-1,w.y=-(Tt/Kt)*2+1,v.set(w.x,w.y,1).unproject(n.object).sub(n.object.position).normalize()}function z(L){return Math.max(n.minDistance,Math.min(n.maxDistance,L))}function j(L){u.set(L.clientX,L.clientY)}function Z(L){G(L.clientX,L.clientX),p.set(L.clientX,L.clientY)}function tt(L){g.set(L.clientX,L.clientY)}function F(L){d.set(L.clientX,L.clientY),f.subVectors(d,u).multiplyScalar(n.rotateSpeed);let nt=n.domElement;D(2*Math.PI*f.x/nt.clientHeight),V(2*Math.PI*f.y/nt.clientHeight),u.copy(d),n.update()}function H(L){b.set(L.clientX,L.clientY),y.subVectors(b,p),y.y>0?N(E(y.y)):y.y<0&&W(E(y.y)),p.copy(b),n.update()}function J(L){x.set(L.clientX,L.clientY),m.subVectors(x,g).multiplyScalar(n.panSpeed),U(m.x,m.y),g.copy(x),n.update()}function k(L){G(L.clientX,L.clientY),L.deltaY<0?W(E(L.deltaY)):L.deltaY>0&&N(E(L.deltaY)),n.update()}function et(L){let nt=!1;switch(L.code){case n.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?V(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,n.keyPanSpeed),nt=!0;break;case n.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?V(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,-n.keyPanSpeed),nt=!0;break;case n.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?D(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(n.keyPanSpeed,0),nt=!0;break;case n.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?D(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(-n.keyPanSpeed,0),nt=!0;break}nt&&(L.preventDefault(),n.update())}function gt(L){if(S.length===1)u.set(L.pageX,L.pageY);else{let nt=jt(L),ft=.5*(L.pageX+nt.x),ct=.5*(L.pageY+nt.y);u.set(ft,ct)}}function wt(L){if(S.length===1)g.set(L.pageX,L.pageY);else{let nt=jt(L),ft=.5*(L.pageX+nt.x),ct=.5*(L.pageY+nt.y);g.set(ft,ct)}}function Mt(L){let nt=jt(L),ft=L.pageX-nt.x,ct=L.pageY-nt.y,Tt=Math.sqrt(ft*ft+ct*ct);p.set(0,Tt)}function Gt(L){n.enableZoom&&Mt(L),n.enablePan&&wt(L)}function X(L){n.enableZoom&&Mt(L),n.enableRotate&&gt(L)}function me(L){if(S.length==1)d.set(L.pageX,L.pageY);else{let ft=jt(L),ct=.5*(L.pageX+ft.x),Tt=.5*(L.pageY+ft.y);d.set(ct,Tt)}f.subVectors(d,u).multiplyScalar(n.rotateSpeed);let nt=n.domElement;D(2*Math.PI*f.x/nt.clientHeight),V(2*Math.PI*f.y/nt.clientHeight),u.copy(d)}function At(L){if(S.length===1)x.set(L.pageX,L.pageY);else{let nt=jt(L),ft=.5*(L.pageX+nt.x),ct=.5*(L.pageY+nt.y);x.set(ft,ct)}m.subVectors(x,g).multiplyScalar(n.panSpeed),U(m.x,m.y),g.copy(x)}function Ut(L){let nt=jt(L),ft=L.pageX-nt.x,ct=L.pageY-nt.y,Tt=Math.sqrt(ft*ft+ct*ct);b.set(0,Tt),y.set(0,Math.pow(b.y/p.y,n.zoomSpeed)),N(y.y),p.copy(b);let Yt=(L.pageX+nt.x)*.5,Kt=(L.pageY+nt.y)*.5;G(Yt,Kt)}function _t(L){n.enableZoom&&Ut(L),n.enablePan&&At(L)}function ne(L){n.enableZoom&&Ut(L),n.enableRotate&&me(L)}function Ft(L){n.enabled!==!1&&(S.length===0&&(n.domElement.setPointerCapture(L.pointerId),n.domElement.addEventListener("pointermove",P),n.domElement.addEventListener("pointerup",T)),Nt(L),L.pointerType==="touch"?St(L):q(L))}function P(L){n.enabled!==!1&&(L.pointerType==="touch"?xt(L):rt(L))}function T(L){Bt(L),S.length===0&&(n.domElement.releasePointerCapture(L.pointerId),n.domElement.removeEventListener("pointermove",P),n.domElement.removeEventListener("pointerup",T)),n.dispatchEvent(Ru),r=s.NONE}function q(L){let nt;switch(L.button){case 0:nt=n.mouseButtons.LEFT;break;case 1:nt=n.mouseButtons.MIDDLE;break;case 2:nt=n.mouseButtons.RIGHT;break;default:nt=-1}switch(nt){case xn.DOLLY:if(n.enableZoom===!1)return;Z(L),r=s.DOLLY;break;case xn.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enablePan===!1)return;tt(L),r=s.PAN}else{if(n.enableRotate===!1)return;j(L),r=s.ROTATE}break;case xn.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enableRotate===!1)return;j(L),r=s.ROTATE}else{if(n.enablePan===!1)return;tt(L),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ul)}function rt(L){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;F(L);break;case s.DOLLY:if(n.enableZoom===!1)return;H(L);break;case s.PAN:if(n.enablePan===!1)return;J(L);break}}function ot(L){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(L.preventDefault(),n.dispatchEvent(Ul),k(L),n.dispatchEvent(Ru))}function at(L){n.enabled===!1||n.enablePan===!1||et(L)}function St(L){switch(st(L),S.length){case 1:switch(n.touches.ONE){case wi.ROTATE:if(n.enableRotate===!1)return;gt(L),r=s.TOUCH_ROTATE;break;case wi.PAN:if(n.enablePan===!1)return;wt(L),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case wi.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Gt(L),r=s.TOUCH_DOLLY_PAN;break;case wi.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;X(L),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ul)}function xt(L){switch(st(L),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;me(L),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;At(L),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;_t(L),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ne(L),n.update();break;default:r=s.NONE}}function vt(L){n.enabled!==!1&&L.preventDefault()}function Nt(L){S.push(L.pointerId)}function Bt(L){delete C[L.pointerId];for(let nt=0;nt<S.length;nt++)if(S[nt]==L.pointerId){S.splice(nt,1);return}}function st(L){let nt=C[L.pointerId];nt===void 0&&(nt=new Lt,C[L.pointerId]=nt),nt.set(L.pageX,L.pageY)}function jt(L){let nt=L.pointerId===S[0]?S[1]:S[0];return C[nt]}n.domElement.addEventListener("contextmenu",vt),n.domElement.addEventListener("pointerdown",Ft),n.domElement.addEventListener("pointercancel",T),n.domElement.addEventListener("wheel",ot,{passive:!1}),this.update()}};var Ei=new ds,ze=new A,ni=new A,de=new bt,Lu={X:new A(1,0,0),Y:new A(0,1,0),Z:new A(0,0,1)},Dl={type:"change"},Iu={type:"mouseDown"},Nu={type:"mouseUp",mode:null},Uu={type:"objectChange"},Fo=class extends ce{constructor(t,e){super(),e===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),e=document),this.isTransformControls=!0,this.visible=!1,this.domElement=e,this.domElement.style.touchAction="none";let n=new Fl;this._gizmo=n,this.add(n);let s=new kl;this._plane=s,this.add(s);let r=this;function o(b,y){let v=y;Object.defineProperty(r,b,{get:function(){return v!==void 0?v:y},set:function(w){v!==w&&(v=w,s[b]=w,n[b]=w,r.dispatchEvent({type:b+"-changed",value:w}),r.dispatchEvent(Dl))}}),r[b]=y,s[b]=y,n[b]=y}o("camera",t),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);let a=new A,l=new A,c=new bt,h=new bt,u=new A,d=new bt,f=new A,g=new A,x=new A,m=0,p=new A;o("worldPosition",a),o("worldPositionStart",l),o("worldQuaternion",c),o("worldQuaternionStart",h),o("cameraPosition",u),o("cameraQuaternion",d),o("pointStart",f),o("pointEnd",g),o("rotationAxis",x),o("rotationAngle",m),o("eye",p),this._offset=new A,this._startNorm=new A,this._endNorm=new A,this._cameraScale=new A,this._parentPosition=new A,this._parentQuaternion=new bt,this._parentQuaternionInv=new bt,this._parentScale=new A,this._worldScaleStart=new A,this._worldQuaternionInv=new bt,this._worldScale=new A,this._positionStart=new A,this._quaternionStart=new bt,this._scaleStart=new A,this._getPointer=Ly.bind(this),this._onPointerDown=Ny.bind(this),this._onPointerHover=Iy.bind(this),this._onPointerMove=Uy.bind(this),this._onPointerUp=Dy.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(t){if(this.object===void 0||this.dragging===!0)return;Ei.setFromCamera(t,this.camera);let e=Ol(this._gizmo.picker[this.mode],Ei);e?this.axis=e.object.name:this.axis=null}pointerDown(t){if(!(this.object===void 0||this.dragging===!0||t.button!==0)&&this.axis!==null){Ei.setFromCamera(t,this.camera);let e=Ol(this._plane,Ei,!0);e&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(e.point).sub(this.worldPositionStart)),this.dragging=!0,Iu.mode=this.mode,this.dispatchEvent(Iu)}}pointerMove(t){let e=this.axis,n=this.mode,s=this.object,r=this.space;if(n==="scale"?r="local":(e==="E"||e==="XYZE"||e==="XYZ")&&(r="world"),s===void 0||e===null||this.dragging===!1||t.button!==-1)return;Ei.setFromCamera(t,this.camera);let o=Ol(this._plane,Ei,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&e!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),e.indexOf("X")===-1&&(this._offset.x=0),e.indexOf("Y")===-1&&(this._offset.y=0),e.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&e!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(de.copy(this._quaternionStart).invert()),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(ze.setFromMatrixPosition(s.parent.matrixWorld)),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(ze.setFromMatrixPosition(s.parent.matrixWorld))));else if(n==="scale"){if(e.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),ni.set(a,a,a)}else ze.copy(this.pointStart),ni.copy(this.pointEnd),ze.applyQuaternion(this._worldQuaternionInv),ni.applyQuaternion(this._worldQuaternionInv),ni.divide(ze),e.search("X")===-1&&(ni.x=1),e.search("Y")===-1&&(ni.y=1),e.search("Z")===-1&&(ni.z=1);s.scale.copy(this._scaleStart).multiply(ni),this.scaleSnap&&(e.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);let a=20/this.worldPosition.distanceTo(ze.setFromMatrixPosition(this.camera.matrixWorld)),l=!1;e==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(ze.copy(this.rotationAxis).cross(this.eye))*a):(e==="X"||e==="Y"||e==="Z")&&(this.rotationAxis.copy(Lu[e]),ze.copy(Lu[e]),r==="local"&&ze.applyQuaternion(this.worldQuaternion),ze.cross(this.eye),ze.length()===0?l=!0:this.rotationAngle=this._offset.dot(ze.normalize())*a),(e==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&e!=="E"&&e!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(de.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(de.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(Dl),this.dispatchEvent(Uu)}}pointerUp(t){t.button===0&&(this.dragging&&this.axis!==null&&(Nu.mode=this.mode,this.dispatchEvent(Nu)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(t){t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}attach(t){return this.object=t,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(Dl),this.dispatchEvent(Uu),this.pointStart.copy(this.pointEnd))}getRaycaster(){return Ei}getMode(){return this.mode}setMode(t){this.mode=t}setTranslationSnap(t){this.translationSnap=t}setRotationSnap(t){this.rotationSnap=t}setScaleSnap(t){this.scaleSnap=t}setSize(t){this.size=t}setSpace(t){this.space=t}};function Ly(i){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:i.button};{let t=this.domElement.getBoundingClientRect();return{x:(i.clientX-t.left)/t.width*2-1,y:-(i.clientY-t.top)/t.height*2+1,button:i.button}}}function Iy(i){if(this.enabled)switch(i.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(i));break}}function Ny(i){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(i)),this.pointerDown(this._getPointer(i)))}function Uy(i){this.enabled&&this.pointerMove(this._getPointer(i))}function Dy(i){this.enabled&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(i)))}function Ol(i,t,e){let n=t.intersectObject(i,!0);for(let s=0;s<n.length;s++)if(n[s].object.visible||e)return n[s];return!1}var No=new ve,re=new A(0,1,0),Du=new A(0,0,0),Ou=new it,Uo=new bt,Oo=new bt,Sn=new A,Fu=new it,ir=new A(1,0,0),Ai=new A(0,1,0),sr=new A(0,0,1),Do=new A,er=new A,nr=new A,Fl=class extends ce{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";let t=new Ie({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),e=new wn({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=t.clone();n.opacity=.15;let s=e.clone();s.opacity=.5;let r=t.clone();r.color.setHex(16711680);let o=t.clone();o.color.setHex(65280);let a=t.clone();a.color.setHex(255);let l=t.clone();l.color.setHex(16711680),l.opacity=.5;let c=t.clone();c.color.setHex(65280),c.opacity=.5;let h=t.clone();h.color.setHex(255),h.opacity=.5;let u=t.clone();u.opacity=.25;let d=t.clone();d.color.setHex(16776960),d.opacity=.25,t.clone().color.setHex(16776960);let g=t.clone();g.color.setHex(7895160);let x=new Ne(0,.04,.1,12);x.translate(0,.05,0);let m=new Me(.08,.08,.08);m.translate(0,.04,0);let p=new ie;p.setAttribute("position",new Ht([0,0,0,1,0,0],3));let b=new Ne(.0075,.0075,.5,3);b.translate(0,.25,0);function y(U,N){let W=new ei(U,.0075,3,64,N*Math.PI*2);return W.rotateY(Math.PI/2),W.rotateX(Math.PI/2),W}function v(){let U=new ie;return U.setAttribute("position",new Ht([0,0,0,1,1,1],3)),U}let w={X:[[new mt(x,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(x,r),[-.5,0,0],[0,0,Math.PI/2]],[new mt(b,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new mt(x,o),[0,.5,0]],[new mt(x,o),[0,-.5,0],[Math.PI,0,0]],[new mt(b,o)]],Z:[[new mt(x,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(x,a),[0,0,-.5],[-Math.PI/2,0,0]],[new mt(b,a),null,[Math.PI/2,0,0]]],XYZ:[[new mt(new Bn(.1,0),u.clone()),[0,0,0]]],XY:[[new mt(new Me(.15,.15,.01),h.clone()),[.15,.15,0]]],YZ:[[new mt(new Me(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new Me(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},M={X:[[new mt(new Ne(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Ne(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Ne(.2,0,.6,4),n),[0,.3,0]],[new mt(new Ne(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Ne(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Ne(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new mt(new Bn(.2,0),n)]],XY:[[new mt(new Me(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new Me(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new Me(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new mt(new Bn(.01,2),s),null,null,null,"helper"]],END:[[new mt(new Bn(.01,2),s),null,null,null,"helper"]],DELTA:[[new Je(v(),s),null,null,null,"helper"]],X:[[new Je(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Je(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Je(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},C={XYZE:[[new mt(y(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new mt(y(.5,.5),r)]],Y:[[new mt(y(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new mt(y(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new mt(y(.75,1),d),null,[0,Math.PI/2,0]]]},_={AXIS:[[new Je(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},E={XYZE:[[new mt(new hs(.25,10,8),n)]],X:[[new mt(new ei(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new mt(new ei(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new mt(new ei(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new mt(new ei(.75,.1,2,24),n)]]},D={X:[[new mt(m,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(b,r),[0,0,0],[0,0,-Math.PI/2]],[new mt(m,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new mt(m,o),[0,.5,0]],[new mt(b,o)],[new mt(m,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new mt(m,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(b,a),[0,0,0],[Math.PI/2,0,0]],[new mt(m,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new mt(new Me(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new mt(new Me(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new Me(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new Me(.1,.1,.1),u.clone())]]},V={X:[[new mt(new Ne(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Ne(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Ne(.2,0,.6,4),n),[0,.3,0]],[new mt(new Ne(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Ne(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Ne(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new mt(new Me(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new Me(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new Me(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new Me(.2,.2,.2),n),[0,0,0]]]},Q={X:[[new Je(p,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Je(p,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Je(p,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function I(U){let N=new ce;for(let W in U)for(let G=U[W].length;G--;){let z=U[W][G][0].clone(),j=U[W][G][1],Z=U[W][G][2],tt=U[W][G][3],F=U[W][G][4];z.name=W,z.tag=F,j&&z.position.set(j[0],j[1],j[2]),Z&&z.rotation.set(Z[0],Z[1],Z[2]),tt&&z.scale.set(tt[0],tt[1],tt[2]),z.updateMatrix();let H=z.geometry.clone();H.applyMatrix4(z.matrix),z.geometry=H,z.renderOrder=1/0,z.position.set(0,0,0),z.rotation.set(0,0,0),z.scale.set(1,1,1),N.add(z)}return N}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=I(w)),this.add(this.gizmo.rotate=I(C)),this.add(this.gizmo.scale=I(D)),this.add(this.picker.translate=I(M)),this.add(this.picker.rotate=I(E)),this.add(this.picker.scale=I(V)),this.add(this.helper.translate=I(S)),this.add(this.helper.rotate=I(_)),this.add(this.helper.scale=I(Q)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(t){let n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Oo;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){let o=s[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(de.setFromEuler(No.set(0,0,0)),o.quaternion.copy(n).multiply(de),Math.abs(re.copy(ir).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(de.setFromEuler(No.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(de),Math.abs(re.copy(Ai).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(de.setFromEuler(No.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(de),Math.abs(re.copy(sr).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(de.setFromEuler(No.set(0,Math.PI/2,0)),re.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(Ou.lookAt(Du,re,Ai)),o.quaternion.multiply(de),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),ze.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),ze.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(ze),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(re.copy(ir).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(re.copy(Ai).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(re.copy(sr).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(re.copy(sr).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(re.copy(ir).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(re.copy(Ai).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(Uo.copy(n),re.copy(this.eye).applyQuaternion(de.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(Ou.lookAt(this.eye,Du,Ai)),o.name==="X"&&(de.setFromAxisAngle(ir,Math.atan2(-re.y,re.z)),de.multiplyQuaternions(Uo,de),o.quaternion.copy(de)),o.name==="Y"&&(de.setFromAxisAngle(Ai,Math.atan2(re.x,re.z)),de.multiplyQuaternions(Uo,de),o.quaternion.copy(de)),o.name==="Z"&&(de.setFromAxisAngle(sr,Math.atan2(re.y,re.x)),de.multiplyQuaternions(Uo,de),o.quaternion.copy(de))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(t)}},kl=class extends mt{constructor(){super(new Hs(1e5,1e5,2,2),new Ie({visible:!1,wireframe:!0,side:ke,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(t){let e=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(e="local"),Do.copy(ir).applyQuaternion(e==="local"?this.worldQuaternion:Oo),er.copy(Ai).applyQuaternion(e==="local"?this.worldQuaternion:Oo),nr.copy(sr).applyQuaternion(e==="local"?this.worldQuaternion:Oo),re.copy(er),this.mode){case"translate":case"scale":switch(this.axis){case"X":re.copy(this.eye).cross(Do),Sn.copy(Do).cross(re);break;case"Y":re.copy(this.eye).cross(er),Sn.copy(er).cross(re);break;case"Z":re.copy(this.eye).cross(nr),Sn.copy(nr).cross(re);break;case"XY":Sn.copy(nr);break;case"YZ":Sn.copy(Do);break;case"XZ":re.copy(nr),Sn.copy(er);break;case"XYZ":case"E":Sn.set(0,0,0);break}break;case"rotate":default:Sn.set(0,0,0)}Sn.length()===0?this.quaternion.copy(this.cameraQuaternion):(Fu.lookAt(ze.set(0,0,0),Sn,re),this.quaternion.setFromRotationMatrix(Fu)),super.updateMatrixWorld(t)}};var ms=Math.PI/180,zl=.001,ps=new ve,Oy=new bt,Fy=new A,ky=new A,Bl=new it,rr=new it,zy=new it;function gs(){return{t:[0,0,0],r:[0,0,0],s:[1,1,1]}}function By(i){return Number.isFinite(i)?Math.abs(i)<zl?i<0?-zl:zl:i:1}function Vl(i){let t=(e,n)=>Array.isArray(e)&&e.length===3?e.map(s=>Number.isFinite(+s)?+s:n):[n,n,n];return{t:t(i&&i.t,0),r:t(i&&i.r,0),s:t(i&&i.s,1).map(By)}}function Vy(i,t=1e-9){return i.t.every(e=>Math.abs(e)<=t)&&i.r.every(e=>Math.abs(e)<=t)&&i.s.every(e=>Math.abs(e-1)<=t)}function Hl(i,t=new bt){return ps.set(i.r[0]*ms,i.r[1]*ms,i.r[2]*ms,"ZYX"),t.setFromEuler(ps)}function Gl(i,t=new it){return t.compose(Fy.fromArray(i.t),Hl(i,Oy),ky.fromArray(i.s))}function ku(i,t,e){return ps.setFromQuaternion(t,"ZYX"),Vl({t:i.toArray(),r:[ps.x/ms,ps.y/ms,ps.z/ms],s:e.toArray()})}var ko=class{constructor(t,e){this.built=t,this.data=e,this.poses=new Map}has(t){return this.poses.has(t)}get(t){let e=this.poses.get(t);return e?Vl(e):gs()}get size(){return this.poses.size}restLocal(t,e=new it){let s=this.built.nodeObjects[t].userData.baseMatrix;e.copy(s);let r=this.data.nodes[t],o=r.parent;if(r.type!=="joint"||r.segmentScaleCompensate===!1||r.inheritsTransform===!1||o<0||this.data.nodes[o].type!=="joint")return e;let a=this.poses.get(o);if(!a)return e;let l=a.s;if(l[0]===1&&l[1]===1&&l[2]===1)return e;let c=s.elements,h=c[12],u=c[13],d=c[14];return rr.copy(s),rr.elements[12]=0,rr.elements[13]=0,rr.elements[14]=0,Bl.makeScale(1/l[0],1/l[1],1/l[2]),e.multiplyMatrices(Bl,rr),e.elements[12]=h,e.elements[13]=u,e.elements[14]=d,e}apply(t){let e=this.built.nodeObjects[t];this.restLocal(t,e.matrix);let n=this.poses.get(t);n&&e.matrix.multiply(Gl(n,zy))}set(t,e){let n=Vl(e);Vy(n)?this.poses.delete(t):this.poses.set(t,n),this.apply(t);for(let s of this.built.childrenOf[t])this.apply(s)}reset(t){this.set(t,gs())}reapplyAll(){for(let t=0;t<this.built.nodeObjects.length;t++)this.apply(t)}resetAll(){this.poses.clear(),this.built.nodeObjects.forEach(t=>t.matrix.copy(t.userData.baseMatrix))}frameMatrix(t,e=new it){let n=this.built.nodeObjects[t];return e.multiplyMatrices(n.parent.matrixWorld,this.restLocal(t,Bl.clone()))}};function Bu(i,t,e){let n=0;for(let u=0;u<t.length;u++)n+=Math.max(0,t[u]-2);let s=new Uint32Array(n*3),r=new Uint32Array(n),o=0,a=0,l=(u,d)=>i[u*3+d],c=(u,d,f,g)=>{s[o*3]=u,s[o*3+1]=d,s[o*3+2]=f,r[o++]=g};for(let u=0;u<t.length;u++){let d=t[u];if(d===3)c(a,a+1,a+2,u);else if(d===4){let f=e[a],g=e[a+1],x=e[a+2],m=e[a+3];zu(l,f,x)<=zu(l,g,m)?(c(a,a+1,a+2,u),c(a,a+2,a+3,u)):(c(a,a+1,a+3,u),c(a+1,a+2,a+3,u))}else if(d>4){let f=Array.from(e.slice(a,a+d)),g=Gy(i,f);for(let x=0;x<g.length;x+=3)c(a+g[x],a+g[x+1],a+g[x+2],u)}a+=d}let h=new Uint32Array(o*3);for(let u=0;u<o*3;u++)h[u]=e[s[u]];return{index:h,corners:s,triCount:o,triToFace:r}}function zu(i,t,e){let n=i(t,0)-i(e,0),s=i(t,1)-i(e,1),r=i(t,2)-i(e,2);return n*n+s*s+r*r}function Hy(i,t){let e=0,n=0,s=0;for(let r=0;r<t.length;r++){let o=t[r]*3,a=t[(r+1)%t.length]*3,l=i[o],c=i[o+1],h=i[o+2],u=i[a],d=i[a+1],f=i[a+2];e+=(c-d)*(h+f),n+=(h-f)*(l+u),s+=(l-u)*(c+d)}return[e,n,s]}function Gy(i,t){let e=t.length,n=Hy(i,t),s=Math.abs(n[0]),r=Math.abs(n[1]),o=Math.abs(n[2]),a=0,l=1;s>=r&&s>=o?(a=1,l=2):r>=o&&(a=2,l=0);let c=t.map(d=>new Lt(i[d*3+a],i[d*3+l])),h=null;try{h=_o.triangulateShape(c,[])}catch{h=null}let u=[];if(h&&h.length===e-2){for(let[d,f,g]of h){let x=f,m=g,p=Wy(i,t[d],t[x],t[m]);if(p[0]*n[0]+p[1]*n[1]+p[2]*n[2]<0){let b=x;x=m,m=b}u.push(d,x,m)}return u}for(let d=1;d<e-1;d++)u.push(0,d,d+1);return u}function Wy(i,t,e,n){let s=i[t*3],r=i[t*3+1],o=i[t*3+2],a=i[e*3]-s,l=i[e*3+1]-r,c=i[e*3+2]-o,h=i[n*3]-s,u=i[n*3+1]-r,d=i[n*3+2]-o;return[l*d-c*u,c*h-a*d,a*u-l*h]}function Vu(i,t,e){let n=t.length,s=new Int32Array(n),r=0;for(let u=0;u<i.length;u++){let d=i[u];for(let f=0;f<d;f++)s[r+f]=t[r+(f+1)%d];r+=d}let o=new Uint32Array(e+1);for(let u=0;u<n;u++)o[t[u]+1]++;for(let u=0;u<e;u++)o[u+1]+=o[u];let a=o.slice(0,e),l=new Uint32Array(n);for(let u=0;u<n;u++)l[a[t[u]]++]=u;let c=new Uint32Array(n*3),h=0;for(let u=0;u<n;u++){let d=t[u],f=s[u],g=!0;for(let x=o[d];x<o[d+1]&&g;x++){let m=l[x];if(m>=u)break;s[m]===f&&(g=!1)}for(let x=o[f];x<o[f+1]&&g;x++){let m=l[x];if(m>=u)break;s[m]===d&&(g=!1)}g&&(c[h++]=d,c[h++]=f,c[h++]=f)}return{index:c.slice(0,h),edgeCount:h/3}}var or=8,Xy=.001;function Hu(i,t,e={}){let n=e.normalize!==!1,s=i.counts,r=new Uint32Array(t+1);for(let w=0;w<t;w++)r[w+1]=r[w]+(s[w]||0);let o=Uint16Array.from(i.indices),a=Float32Array.from(i.weights),l=new Float32Array(a.length),c=i.influences.length,h=new Uint16Array(t*4),u=new Float32Array(t*4),d=new Uint16Array(t*4),f=new Float32Array(t*4),g=new Uint32Array(c),x=[],m=0,p=0,b=0,y=0,v=[];for(let w=0;w<t;w++){let M=r[w],S=r[w+1],C=S-M;C>y&&(y=C);let _=0;for(let U=M;U<S;U++)_+=a[U];if(_<=0){x.push(w);continue}for(let U=M;U<S;U++)a[U]>0&&g[o[U]]++;Math.abs(_-1)>Xy&&b++,C>4&&m++,C>or&&p++;let E=n?1/_:1;for(let U=M;U<S;U++)l[U]=a[U]*E;v.length=0;for(let U=M;U<S;U++)v.push(U);C>or&&v.sort((U,N)=>l[N]-l[U]);let D=Math.min(C,or),V=0;for(let U=0;U<D;U++)V+=l[v[U]];let Q=n?1:_,I=C>or&&V>0?Q/V:1;for(let U=0;U<D;U++){let N=o[v[U]],W=l[v[U]]*I;U<4?(h[w*4+U]=N,u[w*4+U]=W):(d[w*4+U-4]=N,f[w*4+U-4]=W)}}return{offsets:r,slots:o,values:a,eff:l,normalize:n,skinIndex:h,skinWeight:u,skinIndex1:d,skinWeight1:f,zeroVertices:x,override:new Map,stats:{influenceCount:c,over4:m,overMax:p,unnormalized:b,zero:x.length,maxCount:y,affected:g}}}function Gu(i,t,e){let n=e.filter(r=>r.w>0).sort((r,o)=>o.w-r.w).slice(0,or),s=n.reduce((r,o)=>r+o.w,0)||1;i.override.set(t,n.map(r=>({slot:r.slot,w:r.w/s})));for(let r=0;r<4;r++)i.skinIndex[t*4+r]=0,i.skinWeight[t*4+r]=0,i.skinIndex1[t*4+r]=0,i.skinWeight1[t*4+r]=0;n.forEach((r,o)=>{o<4?(i.skinIndex[t*4+o]=r.slot,i.skinWeight[t*4+o]=r.w/s):(i.skinIndex1[t*4+o-4]=r.slot,i.skinWeight1[t*4+o-4]=r.w/s),i.stats.affected[r.slot]++})}function Wu(i,t){let e=[];for(let n=i.offsets[t];n<i.offsets[t+1];n++)e.push(i.slots[n]);return e}function Xu(i,t){let e=[],n=i.override.get(t);if(n){let s=new Map;for(let r=i.offsets[t];r<i.offsets[t+1];r++)s.set(i.slots[r],i.values[r]);for(let r of n)e.push({slot:r.slot,weight:s.get(r.slot)||0,effective:r.w,assigned:!0});for(let[r,o]of s)n.some(a=>a.slot===r)||e.push({slot:r,weight:o,effective:0,assigned:!0})}else for(let s=i.offsets[t];s<i.offsets[t+1];s++)e.push({slot:i.slots[s],weight:i.values[s],effective:i.eff[s]});return e.sort((s,r)=>r.effective-s.effective),e}function Wl(i,t,e){let n=i.override.get(t);if(n){let s=n.find(r=>r.slot===e);return s?s.w:0}for(let s=i.offsets[t];s<i.offsets[t+1];s++)if(i.slots[s]===e)return i.eff[s];return 0}var zo=new Et;function qy(i,t){if(!(i>1e-6))return t.setRGB(.11,.12,.16);let e=Math.min(1,Math.max(0,i));return t.setHSL((1-e)*.6667,.95,.5)}function $y(i,t){let e=i*.6180339887%1;return t.setHSL(e,.7,.55)}function qu(i,t,e,n){for(let s=0;s<n;s++)qy(e>=0?Wl(t,s,e):0,zo),i[s*3]=zo.r,i[s*3+1]=zo.g,i[s*3+2]=zo.b}function $u(i,t,e,n){let s=e.map(r=>$y(r,new Et));for(let r=0;r<n;r++){let o=0,a=0,l=0,c=0,h=(d,f)=>{let g=s[d];o+=g.r*f,a+=g.g*f,l+=g.b*f,c+=f},u=t.override.get(r);if(u)for(let d of u)h(d.slot,d.w);else for(let d=t.offsets[r];d<t.offsets[r+1];d++)h(t.slots[d],t.eff[d]);c<=0?(o=.11,a=.12,l=.16):(o/=c,a/=c,l/=c),i[r*3]=o,i[r*3+1]=a,i[r*3+2]=l}}function Yu(i,t,e,n){for(let s=0;s<i.length;s+=3)i[s]=t,i[s+1]=e,i[s+2]=n}function Yy(i,t,e){let n=new Float32Array(t.length*3),s=0;for(let r=0;r<t.length;r++){let o=t[r],a=0,l=0,c=0;for(let h=0;h<o;h++){let u=e[s+h]*3,d=e[s+(h+1)%o]*3;a+=(i[u+1]-i[d+1])*(i[u+2]+i[d+2]),l+=(i[u+2]-i[d+2])*(i[u]+i[d]),c+=(i[u]-i[d])*(i[u+1]+i[d+1])}n[r*3]=a,n[r*3+1]=l,n[r*3+2]=c,s+=o}return n}function Zu(i,t,e,n,s){let r=e.length,o=t.length,a=Yy(i,t,e),l=new Uint32Array(r),c=new Int32Array(r),h=new Int32Array(r),u=0;for(let M=0;M<o;M++){let S=t[M];for(let C=0;C<S;C++){let _=u+C;l[_]=M,c[_]=e[u+(C+S-1)%S],h[_]=e[u+(C+1)%S]}u+=S}let d=new Uint32Array(s+1);for(let M=0;M<r;M++)d[e[M]+1]++;for(let M=0;M<s;M++)d[M+1]+=d[M];let f=d.slice(0,s),g=new Uint32Array(r);for(let M=0;M<r;M++)g[f[e[M]]++]=M;let x=new Set;for(let M=0;M+1<(n?n.length:0);M+=2){let S=n[M],C=n[M+1];x.add(S<C?S*s+C:C*s+S)}let m=(M,S)=>!x.size||!x.has(M<S?M*s+S:S*s+M),p=new Int32Array(r);for(let M=0;M<r;M++)p[M]=M;let b=M=>{for(;p[M]!==M;)p[M]=p[p[M]],M=p[M];return M};for(let M=0;M<s;M++){let S=d[M],C=d[M+1];for(let _=S;_<C;_++){let E=g[_];for(let D=_+1;D<C;D++){let V=g[D],Q=-1;if(c[E]===c[V]||c[E]===h[V]?Q=c[E]:(h[E]===c[V]||h[E]===h[V])&&(Q=h[E]),Q<0||Q===M||!m(M,Q))continue;let I=b(E),U=b(V);I!==U&&(p[U]=I)}}}let y=new Float64Array(r*3);for(let M=0;M<r;M++){let S=b(M)*3,C=l[M]*3;y[S]+=a[C],y[S+1]+=a[C+1],y[S+2]+=a[C+2]}let v=new Int32Array(r),w=new Float32Array(r*3);for(let M=0;M<r;M++){let S=b(M);v[M]=S;let C=y[S*3],_=y[S*3+1],E=y[S*3+2],D=Math.sqrt(C*C+_*_+E*E)||1;w[M*3]=C/D,w[M*3+1]=_/D,w[M*3+2]=E/D}return{group:v,normals:w}}var Zy="maya-viewer-skin8",jy=`
#include <skinning_pars_vertex>
#ifdef USE_SKINNING
	attribute vec4 skinIndex1;
	attribute vec4 skinWeight1;
#endif
`,Ky=`
#include <skinbase_vertex>
#ifdef USE_SKINNING
	mat4 boneMat1X = getBoneMatrix( skinIndex1.x );
	mat4 boneMat1Y = getBoneMatrix( skinIndex1.y );
	mat4 boneMat1Z = getBoneMatrix( skinIndex1.z );
	mat4 boneMat1W = getBoneMatrix( skinIndex1.w );
#endif
`,Jy=`
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
`,Qy=`
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
`;function t_(i){let t=(n,s,r)=>{if(!n.includes(s))throw new Error("\u30B7\u30A7\u30FC\u30C0\u30FC\u306B "+s+" \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\uFF08three.js \u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF09");return n.replace(s,r)},e=i;return e=t(e,"#include <skinning_pars_vertex>",jy),e=t(e,"#include <skinbase_vertex>",Ky),e.includes("#include <skinnormal_vertex>")&&(e=e.replace("#include <skinnormal_vertex>",Jy)),e=t(e,"#include <skinning_vertex>",Qy),e}function xs(i){return i.onBeforeCompile=t=>{t.vertexShader=t_(t.vertexShader)},i.customProgramCacheKey=()=>Zy,i.needsUpdate=!0,i}var ju=new A,e_=new A,Ku=new ue,Ju=new ue,Qu=new it,n_=[["skinIndex","skinWeight"],["skinIndex1","skinWeight1"]];function i_(i,t,e){let n=i.skeleton,s=i.geometry.attributes;ju.copy(e).applyMatrix4(i.bindMatrix),e.set(0,0,0);for(let[r,o]of n_){let a=s[r],l=s[o];if(!(!a||!l)){Ku.fromBufferAttribute(a,t),Ju.fromBufferAttribute(l,t);for(let c=0;c<4;c++){let h=Ju.getComponent(c);if(h!==0){let u=Ku.getComponent(c);Qu.multiplyMatrices(n.bones[u].matrixWorld,n.boneInverses[u]),e.addScaledVector(e_.copy(ju).applyMatrix4(Qu),h)}}}}return e.applyMatrix4(i.bindMatrixInverse)}function Xl(i){return i.applyBoneTransform=function(e,n){return i_(this,e,n)},i}var s_="maya-scene-lite";function Yl(i){if(!i||i.schema!==s_)throw new Error("\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u30C7\u30FC\u30BF\u5F62\u5F0F\u3067\u3059\uFF08schema \u304C maya-scene-lite \u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF09");if(!Array.isArray(i.nodes)||!Array.isArray(i.meshes))throw new Error("nodes / meshes \u304C\u3042\u308A\u307E\u305B\u3093")}function td(i,t={}){Yl(i);let e=new fn;e.name="__mayaRoot",e.matrixAutoUpdate=!1;let n=i.nodes.map((f,g)=>{let x=f.type==="joint"?new Xs:new fn;return x.name=f.name,x.matrixAutoUpdate=!1,x.matrix.fromArray(f.matrix),x.userData={nodeIndex:g,path:f.path,type:f.type,baseMatrix:x.matrix.clone(),fileMatrix:x.matrix.clone(),savedMatrix:x.matrix.clone(),bindMatrix:f.bindMatrix?new it().fromArray(f.bindMatrix):null},x}),s=i.nodes.map(()=>[]);i.nodes.forEach((f,g)=>{let x=f.parent;x>=0&&s[x].push(g),(x>=0&&f.inheritsTransform!==!1?n[x]:e).add(n[g])}),e.updateMatrixWorld(!0);let r=[];i.nodes.forEach((f,g)=>{f.type==="joint"&&r.push(g)});let o=(i.materials||[]).map((f,g)=>ql(f,g,0,i.textures)),a=ql(null,-1,0,i.textures),l=[a,...o],c=new Map,h=(f,g)=>{if(!(f>=0&&f<o.length))return a;let x=o[f];if(!g||!x.userData.udim)return x;let m=f+":"+g;if(!c.has(m)){let p=ql(i.materials[f],f,g,i.textures);c.set(m,p),l.push(p)}return c.get(m)},u=new Map,d=i.meshes.map((f,g)=>{let x=h_(f,g,n,o,h,t);return x.skin&&f.skin.influences.forEach((m,p)=>{u.has(m)||u.set(m,[]),u.get(m).push({mesh:g,slot:p})}),x});return e.updateMatrixWorld(!0),{root:e,nodeObjects:n,meshes:d,jointIndices:r,childrenOf:s,influenceUsage:u,materials:o,defaultMaterial:a,allMaterials:l}}var lr=13223616;function r_(i,t="always"){return t==="always"?!0:t==="none"?!1:i.normalize===2}function o_(i,t,e){let n=i.zeroVertices;if(!n.length)return 0;let s=t.skin,r=new it().fromArray(s.geomMatrix),o=new it,a=s.bindPreMatrices.map(u=>new A().setFromMatrixPosition(o.fromArray(u).invert())),l=new A,c=new Set(n),h=null;if(s.weightDistribution===1){h=new Map;let u=(f,g)=>{h.has(f)||h.set(f,new Set),h.get(f).add(g)},d=0;for(let f of t.counts){for(let g=0;g<f;g++){let x=t.indices[d+g],m=t.indices[d+(g+1)%f];c.has(x)&&u(x,m),c.has(m)&&u(m,x)}d+=f}}for(let u of n){let d=Wu(i,u),f=null;if(h&&h.has(u)){let g=new Map;for(let x of h.get(u))if(!c.has(x))for(let m=0;m<a.length;m++){let p=Wl(i,x,m);p>0&&(!d.length||d.includes(m))&&g.set(m,(g.get(m)||0)+p)}g.size&&(f=[...g].map(([x,m])=>({slot:x,w:m})))}if(!f){l.fromArray(e,u*3).applyMatrix4(r);let g=x=>Math.max(l.distanceTo(a[x]),1e-6);if(d.length)f=d.map(x=>({slot:x,w:1/g(x)}));else{let x=0;for(let m=1;m<a.length;m++)g(m)<g(x)&&(x=m);f=[{slot:x,w:1}]}}Gu(i,u,f)}return n.length}function Zl(i,t,e=!0){return t!=="bind"||!e?i.fileMatrix:i.bindMatrix||i.savedMatrix||i.fileMatrix}function jl(i,t){let e=ys(i);for(let n of i.nodeObjects){let s=n.userData;s.baseMatrix.copy(Zl(s,t,e)),n.matrix.copy(s.baseMatrix)}i.root.updateMatrixWorld(!0)}function ys(i){return i.hasBind===void 0&&(i.hasBind=i.nodeObjects.some(t=>t.userData.bindMatrix)),i.hasBind}function a_(i,t){return t?`${i}:${t}`:String(i)}function ql(i,t,e,n){let s={side:ke,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1},r=new vo({color:lr,roughness:.78,metalness:0,...s}),o=new Ie({color:lr,...s});xs(r),xs(o),r.name=i?i.name+(e?` <${e}>`:""):"(\u65E2\u5B9A)",o.name=r.name;let a=new Et(lr);i&&Array.isArray(i.color)&&a.setRGB(i.color[0],i.color[1],i.color[2]);let l={},c=!1,h=i&&i.maps||(i&&i.texture>=0?{baseColor:{texture:i.texture,channel:"rgb"}}:{});for(let[u,d]of Object.entries(h)){let f=(n||[])[d.texture];f&&(f.udim&&(c=!0),l[u]={texture:d.texture,channel:d.channel||"rgb",key:a_(d.texture,f.udim?e:0)})}return r.userData={index:t,tile:e,udim:c,isMaya:!!i,baseColor:a,maps:l,textureIndex:l.baseColor?l.baseColor.texture:-1,useAlpha:!!(i&&i.useAlpha),roughness:i&&typeof i.roughness=="number"?i.roughness:null,metalness:i&&typeof i.metalness=="number"?i.metalness:null,textures:{},hasAlpha:!1,unlit:o,sig:""},r}function l_(i,t,e=null){let n=i.indices.length,s=i.uv;if((!s||!s.values||!s.values.length)&&!e){let x=new Uint32Array(t);for(let m=0;m<t;m++)x[m]=m;return{renderCount:t,origOf:x,firstRender:Int32Array.from(x),cornerRender:Uint32Array.from(i.indices),uvs:null}}let r=s&&s.values?s.values.length/2:0,o=e?n:t,a=new Int32Array(o).fill(-2),l=new Int32Array(o),c=new Map,h=new Uint32Array(n+t),u=r?new Float32Array((n+t)*2):null,d=0,f=new Uint32Array(n);for(let x=0;x<n;x++){let m=i.indices[x],p=r?s.indices[x]:-1,b=e?e[x]:m,y;if(a[b]===-2)a[b]=p,y=l[b]=d++;else if(a[b]===p)y=l[b];else{let v=b*(r+1)+(p+1);if(y=c.get(v),y===void 0)y=d++,c.set(v,y);else{f[x]=y;continue}}y===d-1&&(h[y]=m,u&&(u[y*2]=p>=0?s.values[p*2]:0,u[y*2+1]=p>=0?s.values[p*2+1]:0)),f[x]=y}let g=new Int32Array(t).fill(-1);for(let x=0;x<d;x++)g[h[x]]<0&&(g[h[x]]=x);for(let x=0;x<t;x++)g[x]<0&&(g[x]=d,h[d++]=x);return{renderCount:d,origOf:h.slice(0,d),firstRender:g,cornerRender:f,uvs:u?u.slice(0,d*2):null}}function ar(i,t,e,n=i.constructor){let s=new n(e.length*t);for(let r=0;r<e.length;r++){let o=e[r]*t,a=r*t;for(let l=0;l<t;l++)s[a+l]=i[o+l]}return s}function c_(i){let t=new Uint16Array(i.counts.length).fill(1001),e=i.uv;if(!e)return t;let n=0;for(let s=0;s<i.counts.length;s++){let r=0,o=0,a=0;for(let l=0;l<i.counts[s];l++){let c=e.indices[n+l];c>=0&&(r+=e.values[c*2],o+=e.values[c*2+1],a++)}if(a){let l=Math.min(9,Math.max(0,Math.floor(r/a))),c=Math.max(0,Math.floor(o/a));t[s]=1001+l+10*c}n+=i.counts[s]}return t}function h_(i,t,e,n,s,r){let o=Float32Array.from(i.positions),a=o.length/3,l=Bu(o,i.counts,i.indices),c=Vu(i.counts,i.indices,a),h=Zu(o,i.counts,i.indices,i.hardEdges,a),u=l_(i,a,h.group),{origOf:d,firstRender:f,cornerRender:g}=u,x=new Float32Array(u.renderCount*3);for(let k=0;k<g.length;k++)x.set(h.normals.subarray(k*3,k*3+3),g[k]*3);let m=i.faceMaterials||null,p=Number.isInteger(i.material)?i.material:-1,y=(m||[p]).some(k=>n[k]&&n[k].userData.udim)?c_(i):null,v=new Map,w=[],M=k=>{let et=s(m?m[k]:p,y?y[k]:0);return v.has(et)||(v.set(et,w.length),w.push(et)),v.get(et)},S=new Uint16Array(l.triCount);for(let k=0;k<l.triCount;k++)S[k]=M(l.triToFace[k]);w.length||w.push(s(p,0));let C=new Uint32Array(w.length);for(let k=0;k<l.triCount;k++)C[S[k]]++;let _=new Uint32Array(w.length);for(let k=1;k<w.length;k++)_[k]=_[k-1]+C[k-1];let E=_.slice(),D=new Uint32Array(l.triCount*3);for(let k=0;k<l.triCount;k++){let et=E[S[k]]++*3;D[et]=g[l.corners[k*3]],D[et+1]=g[l.corners[k*3+1]],D[et+2]=g[l.corners[k*3+2]]}let V=new _e(ar(o,3,d),3),Q=new Ht(new Float32Array(u.renderCount*3).fill(1),3),I=new ie;if(I.setAttribute("position",V),I.setAttribute("normal",new _e(x,3)),I.setAttribute("color",Q),u.uvs&&I.setAttribute("uv",new _e(u.uvs,2)),I.setIndex(new _e(D,1)),w.length>1)for(let k=0;k<w.length;k++)I.addGroup(_[k]*3,C[k]*3,k);let U=w.length>1?w:w[0],N=new Uint32Array(c.index.length);for(let k=0;k<c.index.length;k++)N[k]=f[c.index[k]];let W=new ie;W.setAttribute("position",V),W.setAttribute("color",Q),W.setIndex(new _e(N,1));let G=r.wireMaterial||new Ie({color:1908772,wireframe:!0,transparent:!0,opacity:.55,depthWrite:!1});xs(G);let z=e[i.transform],j=null,Z=null,tt=null,F=null,H=new mt(I,U),J=new mt(W,G);if(i.skin){tt=Hu(i.skin,a,{normalize:r_(i.skin,r.normalizeMode)}),tt.normalize&&o_(tt,i,o);let k={skinIndex:new _i(ar(tt.skinIndex,4,d),4),skinWeight:new Ht(ar(tt.skinWeight,4,d),4),skinIndex1:new _i(ar(tt.skinIndex1,4,d),4),skinWeight1:new Ht(ar(tt.skinWeight1,4,d),4)};for(let[Mt,Gt]of Object.entries(k))I.setAttribute(Mt,Gt),W.setAttribute(Mt,Gt);let et=i.skin.influences.map(Mt=>e[Mt]),gt=i.skin.bindPreMatrices.map(Mt=>new it().fromArray(Mt));F=new go(et,gt);let wt=new it().fromArray(i.skin.geomMatrix);j=Xl(new Ws(I,U)),j.bindMode=Ao,j.bind(F,wt),Z=Xl(new Ws(W,G)),Z.bindMode=Ao,Z.bind(F,wt)}for(let k of[H,J,j,Z])k&&(k.matrixAutoUpdate=!1,k.frustumCulled=!1,k.userData.meshIndex=t,z.add(k));return J.renderOrder=1,Z&&(Z.renderOrder=1),{index:t,name:i.name,path:i.path,transform:i.transform,data:i,vertexCount:a,renderVertexCount:u.renderCount,origOf:d,firstRender:f,triCount:l.triCount,edgeCount:c.edgeCount,geometry:I,wireGeometry:W,wireMaterial:G,materials:w,staticMesh:H,staticWire:J,skinned:j,skinnedWire:Z,skeleton:F,skin:tt,visible:i.visible!==!1}}var $l=new A;function cr(i,t,e,n){return n.fromBufferAttribute(i.geometry.attributes.position,t),e&&i.skinned?(i.skinned.applyBoneTransform(t,n),n.applyMatrix4(i.skinned.matrixWorld)):n.applyMatrix4(i.staticMesh.matrixWorld)}function _s(i,t,e,n){return cr(i,i.firstRender[t],e,n)}function ed(i,t){return i.origOf[t]}function nd(i,t){let e=i.geometry.attributes.color,n=e.array,s=i.origOf;for(let r=0;r<s.length;r++){let o=s[r]*3;n[r*3]=t[o],n[r*3+1]=t[o+1],n[r*3+2]=t[o+2]}e.needsUpdate=!0}function Kl(i,t,e=!1){let n=new $e;for(let s of i.meshes){if(!e&&!s.visible)continue;let r=Math.max(1,Math.floor(s.vertexCount/2e4));for(let o=0;o<s.vertexCount;o+=r)n.expandByPoint(_s(s,o,t,$l))}for(let s of i.jointIndices)n.expandByPoint($l.setFromMatrixPosition(i.nodeObjects[s].matrixWorld));for(let s of i.curveItems||[]){if(!s||!e&&!s.line.visible)continue;let r=s.line.geometry.getAttribute("position"),o=Math.max(1,Math.floor(r.count/16));for(let a=0;a<r.count;a+=o)n.expandByPoint($l.fromBufferAttribute(r,a).applyMatrix4(s.line.matrixWorld))}return n.isEmpty()&&n.set(new A(-50,-50,-50),new A(50,50,50)),n}function id(i){if(!i)return;let t=new Set,e=n=>{n&&!t.has(n)&&(t.add(n),n.dispose())};for(let n of i.allMaterials||[])n.userData.unlit&&e(n.userData.unlit),e(n);for(let n of i.meshes)e(n.geometry),e(n.wireGeometry),e(n.wireMaterial),n.skeleton&&n.skeleton.dispose();i.root.removeFromParent()}var Bo=class extends Mo{constructor(t){super(t)}parse(t){function e(N){switch(N.image_type){case d:case x:if(N.colormap_length>256||N.colormap_size!==24||N.colormap_type!==1)throw new Error("THREE.TGALoader: Invalid type colormap data for indexed type.");break;case f:case g:case m:case p:if(N.colormap_type)throw new Error("THREE.TGALoader: Invalid type colormap data for colormap type.");break;case u:throw new Error("THREE.TGALoader: No data.");default:throw new Error("THREE.TGALoader: Invalid type "+N.image_type)}if(N.width<=0||N.height<=0)throw new Error("THREE.TGALoader: Invalid image size.");if(N.pixel_size!==8&&N.pixel_size!==16&&N.pixel_size!==24&&N.pixel_size!==32)throw new Error("THREE.TGALoader: Invalid pixel size "+N.pixel_size)}function n(N,W,G,z,j){let Z,tt,F=G.pixel_size>>3,H=G.width*G.height*F;if(W&&(tt=j.subarray(z,z+=G.colormap_length*(G.colormap_size>>3))),N){Z=new Uint8Array(H);let J,k,et,gt=0,wt=new Uint8Array(F);for(;gt<H;)if(J=j[z++],k=(J&127)+1,J&128){for(et=0;et<F;++et)wt[et]=j[z++];for(et=0;et<k;++et)Z.set(wt,gt+et*F);gt+=F*k}else{for(k*=F,et=0;et<k;++et)Z[gt+et]=j[z++];gt+=k}}else Z=j.subarray(z,z+=W?G.width*G.height:H);return{pixel_data:Z,palettes:tt}}function s(N,W,G,z,j,Z,tt,F,H){let J=H,k,et=0,gt,wt,Mt=E.width;for(wt=W;wt!==z;wt+=G)for(gt=j;gt!==tt;gt+=Z,et++)k=F[et],N[(gt+Mt*wt)*4+3]=255,N[(gt+Mt*wt)*4+2]=J[k*3+0],N[(gt+Mt*wt)*4+1]=J[k*3+1],N[(gt+Mt*wt)*4+0]=J[k*3+2];return N}function r(N,W,G,z,j,Z,tt,F){let H,J=0,k,et,gt=E.width;for(et=W;et!==z;et+=G)for(k=j;k!==tt;k+=Z,J+=2)H=F[J+0]+(F[J+1]<<8),N[(k+gt*et)*4+0]=(H&31744)>>7,N[(k+gt*et)*4+1]=(H&992)>>2,N[(k+gt*et)*4+2]=(H&31)<<3,N[(k+gt*et)*4+3]=H&32768?0:255;return N}function o(N,W,G,z,j,Z,tt,F){let H=0,J,k,et=E.width;for(k=W;k!==z;k+=G)for(J=j;J!==tt;J+=Z,H+=3)N[(J+et*k)*4+3]=255,N[(J+et*k)*4+2]=F[H+0],N[(J+et*k)*4+1]=F[H+1],N[(J+et*k)*4+0]=F[H+2];return N}function a(N,W,G,z,j,Z,tt,F){let H=0,J,k,et=E.width;for(k=W;k!==z;k+=G)for(J=j;J!==tt;J+=Z,H+=4)N[(J+et*k)*4+2]=F[H+0],N[(J+et*k)*4+1]=F[H+1],N[(J+et*k)*4+0]=F[H+2],N[(J+et*k)*4+3]=F[H+3];return N}function l(N,W,G,z,j,Z,tt,F){let H,J=0,k,et,gt=E.width;for(et=W;et!==z;et+=G)for(k=j;k!==tt;k+=Z,J++)H=F[J],N[(k+gt*et)*4+0]=H,N[(k+gt*et)*4+1]=H,N[(k+gt*et)*4+2]=H,N[(k+gt*et)*4+3]=255;return N}function c(N,W,G,z,j,Z,tt,F){let H=0,J,k,et=E.width;for(k=W;k!==z;k+=G)for(J=j;J!==tt;J+=Z,H+=2)N[(J+et*k)*4+0]=F[H+0],N[(J+et*k)*4+1]=F[H+0],N[(J+et*k)*4+2]=F[H+0],N[(J+et*k)*4+3]=F[H+1];return N}function h(N,W,G,z,j){let Z,tt,F,H,J,k;switch((E.flags&b)>>y){default:case M:Z=0,F=1,J=W,tt=0,H=1,k=G;break;case v:Z=0,F=1,J=W,tt=G-1,H=-1,k=-1;break;case S:Z=W-1,F=-1,J=-1,tt=0,H=1,k=G;break;case w:Z=W-1,F=-1,J=-1,tt=G-1,H=-1,k=-1;break}if(Q)switch(E.pixel_size){case 8:l(N,tt,H,k,Z,F,J,z);break;case 16:c(N,tt,H,k,Z,F,J,z);break;default:throw new Error("THREE.TGALoader: Format not supported.")}else switch(E.pixel_size){case 8:s(N,tt,H,k,Z,F,J,z,j);break;case 16:r(N,tt,H,k,Z,F,J,z);break;case 24:o(N,tt,H,k,Z,F,J,z);break;case 32:a(N,tt,H,k,Z,F,J,z);break;default:throw new Error("THREE.TGALoader: Format not supported.")}return N}let u=0,d=1,f=2,g=3,x=9,m=10,p=11,b=48,y=4,v=0,w=1,M=2,S=3;if(t.length<19)throw new Error("THREE.TGALoader: Not enough data to contain header.");let C=0,_=new Uint8Array(t),E={id_length:_[C++],colormap_type:_[C++],image_type:_[C++],colormap_index:_[C++]|_[C++]<<8,colormap_length:_[C++]|_[C++]<<8,colormap_size:_[C++],origin:[_[C++]|_[C++]<<8,_[C++]|_[C++]<<8],width:_[C++]|_[C++]<<8,height:_[C++]|_[C++]<<8,pixel_size:_[C++],flags:_[C++]};if(e(E),E.id_length+C>t.length)throw new Error("THREE.TGALoader: No data.");C+=E.id_length;let D=!1,V=!1,Q=!1;switch(E.image_type){case x:D=!0,V=!0;break;case d:V=!0;break;case m:D=!0;break;case f:break;case p:D=!0,Q=!0;break;case g:Q=!0;break}let I=new Uint8Array(E.width*E.height*4),U=n(D,V,E,C,_);return h(I,E.width,E.height,U.pixel_data,U.palettes),{data:I,width:E.width,height:E.height,flipY:!0,generateMipmaps:!0,minFilter:Mn}}};var sd=2048;function u_(i){return new Promise((t,e)=>{let n=new XMLHttpRequest;n.open("GET",i,!0),n.responseType="arraybuffer",n.onload=()=>{(n.status===200||n.status===0)&&n.response&&n.response.byteLength?t(n.response):e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08status "+n.status+"\uFF09"))},n.onerror=()=>e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08\u30A2\u30AF\u30BB\u30B9\u304C\u8A31\u53EF\u3055\u308C\u3066\u3044\u306A\u3044\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF09")),n.send()})}function ld(i){let t=atob(i),e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e.buffer}function cd(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function rd(i){for(let t=3;t<i.length;t+=4)if(i[t]<250)return!0;return!1}function d_(i,t,e,n,s){let r=new Uint8Array(n*s*4),o=t/n,a=e/s;for(let l=0;l<s;l++){let c=Math.floor(l*a),h=Math.max(c+1,Math.floor((l+1)*a));for(let u=0;u<n;u++){let d=Math.floor(u*o),f=Math.max(d+1,Math.floor((u+1)*o)),g=0,x=0,m=0,p=0;for(let v=c;v<h;v++){let w=(v*t+d)*4;for(let M=d;M<f;M++,w+=4)g+=i[w],x+=i[w+1],m+=i[w+2],p+=i[w+3]}let b=(h-c)*(f-d),y=(l*n+u)*4;r[y]=g/b,r[y+1]=x/b,r[y+2]=m/b,r[y+3]=p/b}}return r}function od(i,t){let e=Math.max(i,t);if(e<=sd)return[i,t];let n=sd/e;return[Math.max(1,Math.round(i*n)),Math.max(1,Math.round(t*n))]}async function f_(i,t){if(t==="tga"){let f=new Bo().parse(i);if(!f||!f.data||!f.width)throw new Error("TGA \u3092\u89E3\u6790\u3067\u304D\u307E\u305B\u3093");let g=new Uint8Array(f.data.buffer,f.data.byteOffset,f.width*f.height*4),[x,m]=od(f.width,f.height);return x!==f.width&&(g=d_(g,f.width,f.height,x,m)),{kind:"data",image:{data:g,width:x,height:m},width:x,height:m,sourceWidth:f.width,sourceHeight:f.height,hasAlpha:rd(g)}}let e=new Blob([i]),n=await createImageBitmap(e),s=n.width,r=n.height;n.close&&n.close();let[o,a]=od(s,r),l={premultiplyAlpha:"none",colorSpaceConversion:"none",imageOrientation:"flipY"};o!==s&&Object.assign(l,{resizeWidth:o,resizeHeight:a,resizeQuality:"high"});let c=await createImageBitmap(e,l),h=cd(c.width,c.height),u=h.getContext("2d",{willReadFrequently:!0});u.drawImage(c,0,0);let d=rd(u.getImageData(0,0,h.width,h.height).data);return{kind:"bitmap",image:c,width:c.width,height:c.height,sourceWidth:s,sourceHeight:r,hasAlpha:d}}function p_(i){if(i.kind==="data")return i.image.data;if(!i.pixels){let e=cd(i.width,i.height).getContext("2d",{willReadFrequently:!0});e.translate(0,i.height),e.scale(1,-1),e.drawImage(i.image,0,0),i.pixels=e.getImageData(0,0,i.width,i.height).data}return i.pixels}function m_(i,t){let e={r:0,g:1,b:2,a:3}[t]??0,n=new Uint8Array(i.length);for(let s=0;s<i.length;s+=4){let r=i[s+e];n[s]=r,n[s+1]=r,n[s+2]=r,n[s+3]=255}return n}function ad(i,t,e){let n=new ls(i,t,e,Ye);return n.flipY=!0,n.magFilter=Le,n.minFilter=Mn,n.generateMipmaps=!0,n}function hd(i,t){let[e,n]=t.split(":"),s;if(n&&n!=="rgb")s=ad(m_(p_(i),n),i.width,i.height);else if(i.kind==="data"){let{data:r,width:o,height:a}=i.image;s=ad(r,o,a)}else s=new Ke(i.image),s.flipY=!1;return s.premultiplyAlpha=!1,s.colorSpace=e==="color"||e==="view"?xe:Ze,s.wrapS=rs,s.wrapT=rs,s.anisotropy=4,s.needsUpdate=!0,s}async function ud(i,t,e,n,s={}){let r=null,o="file",a=null;if(i&&!s.forceBridge)try{r=await u_(i)}catch(l){a=l}if(!r&&n&&t&&(r=await n(t),o="python"),!r)throw a||new Error("\u8AAD\u307F\u8FBC\u3080\u65B9\u6CD5\u304C\u3042\u308A\u307E\u305B\u3093");return{decoded:await f_(r,e),via:o}}function dd(i,t,e){let n=!t||t==="rgb"?i==="baseColor"||i==="emissive"||i==="normal"?"rgb":"r":t;return e?n==="rgb"?"view:rgb":"view:"+n:i==="baseColor"||i==="emissive"?n==="rgb"?"color":"scalar:"+n:i==="normal"?"normal":"scalar:"+n}function g_(i){if(!i.textures)return[];if(i.mapView&&i.mapView!=="combined")return[i.mapView];let t=["baseColor"];for(let e of["normal","roughness","metalness","ao","emissive","opacity"])i.maps&&i.maps[e]&&t.push(e);return t}var Vo=class{constructor(){this.state=new Map,this.token=0,this.data=null}reset(t){for(let e of this.state.values())for(let n of e.textures.values())n.dispose();this.state.clear(),this.token++,this.data=t}source(t){let[e,n]=String(t).split(":"),s=+e,r=n?+n:0,o=(this.data&&this.data.textures||[])[s];if(!o)return null;if(o.udim){let a=(o.tiles||[]).find(l=>l.tile===r);return{ti:s,tile:r,info:o,url:a?a.url:null,resolved:a?a.resolved:null,format:o.format}}return{ti:s,tile:r,info:o,url:o.url,resolved:o.resolved,format:o.format}}neededKeys(t,e){let n=g_(e),s=new Set;for(let r of t)for(let o of n){let a=r.userData.maps[o];a&&s.add(a.key)}return s}ensure(t,e,n,s,r){let o=this.token,a=[];for(let c of t){if(this.state.has(c))continue;let h=this.source(c);if(!h||!h.resolved||!h.format){this.state.set(c,{status:"missing",...h,textures:new Map});continue}let u={status:"loading",...h,textures:new Map};this.state.set(c,u),a.push([c,u])}let l=0;for(let[c,h]of a)ud(h.url,h.resolved,h.format,e,n).then(u=>{o===this.token&&(h.status="ok",h.decoded=u.decoded,h.via=u.via)}).catch(u=>{o===this.token&&(h.status="error",h.message=String(u&&u.message||u),r&&r(c,h))}).finally(()=>{o===this.token&&(l++,s&&s(l,a.length))});return a.length}texture(t,e){let n=this.state.get(t);if(!n||n.status!=="ok")return null;let s=n.textures.get(e);return s||(s=hd(n.decoded,e),n.textures.set(e,s)),s}hasAlpha(t){let e=this.state.get(t);return!!(e&&e.status==="ok"&&e.decoded.hasAlpha)}textureStatus(t){let e=(this.data&&this.data.textures||[])[t];if(!e)return{status:"missing"};let n=e.udim?(e.tiles||[]).map(r=>`${t}:${r.tile}`):[String(t)];if(!n.length)return{status:"missing",info:e};let s=n.map(r=>this.state.get(r));if(s.some(r=>r&&r.status==="loading"))return{status:"loading",info:e};if(s.some(r=>r&&r.status==="error"))return{status:"error",info:e,message:s.find(r=>r&&r.status==="error").message};if(s.some(r=>r&&r.status==="missing"))return{status:"missing",info:e};if(s.every(r=>r&&r.status==="ok")){let r=s[0].decoded;return{status:"ok",info:e,via:s[0].via,tiles:n.length,width:r.width,height:r.height,sourceWidth:r.sourceWidth,sourceHeight:r.sourceHeight,hasAlpha:s.some(o=>o.decoded.hasAlpha)}}return{status:"pending",info:e}}};var fd=new Et(6211813),Jl=new Et(15903035),x_=new Et(12903275),y_=new Et(12166898),__=new Et(7041916),Ql=[new Et(15034203),new Et(8376683),new Et(6000624)],Ti=new it,Vn=new A,hr=new bt,ur=new A,Ho=new A,tc=new A,Hn=new A,v_=new A(0,1,0),M_=new bt;function b_(){let e=[0,0,0,1,.1,0,0,.1,1,-1,.1,0,0,.1,-1,0,1,0],n=[0,2,1,0,3,2,0,4,3,0,1,4,5,1,2,5,2,3,5,3,4,5,4,1],s=new ie;return s.setAttribute("position",new Ht(e,3)),s.setIndex(n),s}var Go=class{constructor(){this.group=new fn,this.group.name="__jointOverlay",this.size=1,this.xray=!0,this.axesMode="selected",this.selected=-1,this.hiddenNodes=null,this.joints=[],this.links=[],this.slotOf=new Map,this.sphereGeo=new hs(1,14,10),this.boneGeo=b_(),this.sphereMat=new Ie({color:16777215,transparent:!0,opacity:.92}),this.boneMat=new Ie({color:16777215,wireframe:!0,transparent:!0,opacity:.9}),this.axesMat=new wn({vertexColors:!0,transparent:!0,opacity:1}),this.spheres=null,this.bones=null,this.axes=null,this.controls=[],this.controlGeo=new Bn(1,0),this.controlMat=new Ie({color:16777215,wireframe:!0,transparent:!0,opacity:.95}),this.controlMesh=null,this.statusOf=null}clear(){for(let t of[this.spheres,this.bones,this.axes])t&&(this.group.remove(t),t.isLineSegments?t.geometry.dispose():t.dispose?.());this.spheres=this.bones=this.axes=null,this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controlMesh=null,this.controls=[],this.statusOf=null,this.joints=[],this.links=[],this.slotOf=new Map,this.selected=-1}build(t,e,n){this.clear(),this.built=t,this.joints=t.jointIndices.slice(),this.joints.forEach((h,u)=>this.slotOf.set(h,u));for(let h of this.joints){let u=e[h].parent;for(;u>=0&&e[u].type!=="joint";)u=e[u].parent;u>=0&&this.links.push([u,h])}let s=this.links.map(([h,u])=>Ho.setFromMatrixPosition(t.nodeObjects[h].matrixWorld).distanceTo(tc.setFromMatrixPosition(t.nodeObjects[u].matrixWorld))).filter(h=>h>1e-9).sort((h,u)=>h-u),r=s.length?s[s.length>>1]:0;this.baseSize=r>0?Math.min(n*.015,r*.12):n*.012;let o=Math.max(1,this.joints.length);this.spheres=new cs(this.sphereGeo,this.sphereMat,o),this.spheres.count=this.joints.length,this.spheres.instanceMatrix.setUsage(tr),this.spheres.frustumCulled=!1;let a=Math.max(1,this.links.length);this.bones=new cs(this.boneGeo,this.boneMat,a),this.bones.count=this.links.length,this.bones.instanceMatrix.setUsage(tr),this.bones.frustumCulled=!1;let l=new ie;l.setAttribute("position",new Ht(new Float32Array(o*18),3).setUsage(tr));let c=new Float32Array(o*18);for(let h=0;h<o;h++)for(let u=0;u<3;u++)for(let d=0;d<2;d++){let f=(h*6+u*2+d)*3;c[f]=Ql[u].r,c[f+1]=Ql[u].g,c[f+2]=Ql[u].b}l.setAttribute("color",new Ht(c,3)),this.axes=new qs(l,this.axesMat),this.axes.frustumCulled=!1,this.group.add(this.bones,this.spheres,this.axes),this.applyXray(),this.update()}applyXray(){for(let t of[this.sphereMat,this.boneMat,this.axesMat,this.controlMat])t.depthTest=!this.xray,t.depthWrite=!this.xray,t.needsUpdate=!0;for(let t of[this.spheres,this.bones,this.axes,this.controlMesh])t&&(t.renderOrder=this.xray?10:0)}setControllers(t){this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controls=t.slice(),this.controlMesh=null,this.controls.length&&(this.controlMesh=new cs(this.controlGeo,this.controlMat,this.controls.length),this.controlMesh.instanceMatrix.setUsage(tr),this.controlMesh.frustumCulled=!1,this.group.add(this.controlMesh)),this.applyXray(),this.update()}setXray(t){this.xray=t,this.applyXray()}setSize(t){this.size=t,this.update()}setAxesMode(t){this.axesMode=t,this.update()}setSelected(t){this.selected=t,this.update()}setVisible(t){this.group.visible=t}setStatus(t){this.statusOf=t,this.update()}setHiddenNodes(t){this.hiddenNodes=t,this.update()}radius(){return this.baseSize*this.size}update(){if(!this.spheres)return;let t=this.built.nodeObjects,e=this.radius(),n=new Set;this.links.forEach(([f,g],x)=>{f===this.selected&&n.add(x)});let s=this.hiddenNodes,r=f=>!!(s&&s[f]),o=(f,g)=>{let x=this.statusOf?this.statusOf(f):null;return x==="estimated"?y_:x==="unknown"?__:g};this.joints.forEach((f,g)=>{t[f].matrixWorld.decompose(Vn,hr,ur);let x=r(f)?0:e;Ti.compose(Vn,M_,ur.set(x,x,x)),this.spheres.setMatrixAt(g,Ti),this.spheres.setColorAt(g,f===this.selected?Jl:o(f,fd))}),this.spheres.instanceMatrix.needsUpdate=!0,this.spheres.instanceColor&&(this.spheres.instanceColor.needsUpdate=!0),this.spheres.boundingSphere=null,this.links.forEach(([f,g],x)=>{Ho.setFromMatrixPosition(t[f].matrixWorld),tc.setFromMatrixPosition(t[g].matrixWorld),Hn.subVectors(tc,Ho);let m=Hn.length();if(m<1e-9||r(g))Ti.makeScale(0,0,0);else{hr.setFromUnitVectors(v_,Hn.multiplyScalar(1/m));let p=Math.min(e*.75,m*.12);Ti.compose(Ho,hr,ur.set(p,m,p))}this.bones.setMatrixAt(x,Ti),this.bones.setColorAt(x,n.has(x)?Jl:o(g,fd))}),this.bones.instanceMatrix.needsUpdate=!0,this.bones.instanceColor&&(this.bones.instanceColor.needsUpdate=!0),this.bones.boundingSphere=null;let a=this.axes.geometry.attributes.position,l=a.array,c=0,h=e*4,d=this.axesMode==="all"?this.joints:this.axesMode==="selected"&&this.selected>=0?[this.selected]:[];for(let f of d){if(r(f))continue;let g=t[f].matrixWorld.elements;Vn.set(g[12],g[13],g[14]);for(let x=0;x<3;x++){Hn.set(g[x*4],g[x*4+1],g[x*4+2]);let m=Hn.length()||1;Hn.multiplyScalar(h/m).add(Vn);let p=(c*6+x*2)*3;l[p]=Vn.x,l[p+1]=Vn.y,l[p+2]=Vn.z,l[p+3]=Hn.x,l[p+4]=Hn.y,l[p+5]=Hn.z}if(c++,c*6>l.length/3)break}this.axes.geometry.setDrawRange(0,c*6),a.needsUpdate=!0,this.axes.visible=c>0,this.spheres.visible=this.joints.length>0,this.bones.visible=this.links.length>0,this.controlMesh&&(this.controls.forEach((f,g)=>{t[f].matrixWorld.decompose(Vn,hr,ur);let x=r(f)?0:e*2.2;Ti.compose(Vn,hr,ur.set(x,x,x)),this.controlMesh.setMatrixAt(g,Ti),this.controlMesh.setColorAt(g,f===this.selected?Jl:o(f,x_))}),this.controlMesh.instanceMatrix.needsUpdate=!0,this.controlMesh.instanceColor&&(this.controlMesh.instanceColor.needsUpdate=!0),this.controlMesh.boundingSphere=null)}pick(t){if(!this.spheres||!this.group.visible)return-1;if(this.joints.length){let e=t.intersectObject(this.spheres,!1);if(e.length&&e[0].instanceId!==void 0)return this.joints[e[0].instanceId]}if(this.controlMesh){let e=t.intersectObject(this.controlMesh,!1);if(e.length&&e[0].instanceId!==void 0)return this.controls[e[0].instanceId]}return-1}};var lt=i=>document.getElementById(i),Wo={joint:'<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',transform:'<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',mesh:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',skin:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>'},w_='<svg class="on" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.8" fill="currentColor"/></svg><svg class="off" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M2 12 12 2" stroke="currentColor" stroke-width="1.4"/></svg>',oe=i=>String(i).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),vs=(i,t=3)=>Number.isFinite(i)?(Math.abs(i)<.5*10**-t?0:i).toFixed(t):String(i),Gn=(i,t=3)=>i.map(e=>vs(e,t)).join(", "),rn=i=>i.toLocaleString("ja-JP"),Xo=class{constructor(t){this.app=t,this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null,this.filter="",this.msgTimer=0,this.bindToolbar(),this.bindTabs(),this.bindTree(),this.bindPose(),this.bindPanels(),this.bindResizer()}bindResizer(){let t=lt("left-resizer"),e=lt("app"),n=260,s=160,r=()=>Math.max(s,Math.min(640,Math.floor(window.innerWidth*.5))),o=()=>lt("left").getBoundingClientRect().width,a=h=>{let u=Math.round(Math.max(s,Math.min(r(),h)));return e.style.setProperty("--left-user",u+"px"),t.setAttribute("aria-valuenow",String(u)),u};t.setAttribute("aria-valuemin",String(s)),t.setAttribute("aria-valuemax",String(r()));let l=null;t.addEventListener("pointerdown",h=>{if(h.button===0){h.preventDefault(),l={x:h.clientX,w:o()};try{t.setPointerCapture(h.pointerId)}catch{}t.classList.add("dragging"),document.body.classList.add("resizing")}}),t.addEventListener("pointermove",h=>{l&&a(l.w+(h.clientX-l.x))});let c=()=>{l&&(l=null,t.classList.remove("dragging"),document.body.classList.remove("resizing"))};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c),t.addEventListener("dblclick",()=>{e.style.removeProperty("--left-user"),t.setAttribute("aria-valuenow",String(n))}),t.addEventListener("keydown",h=>{let u=h.shiftKey?64:16;if(h.key==="ArrowLeft")a(o()-u);else if(h.key==="ArrowRight")a(o()+u);else if(h.key==="Home")a(s);else if(h.key==="End")a(r());else return;h.preventDefault(),h.stopPropagation()}),this.setLeftWidth=a}bindPanels(){for(let t of["left","right"])lt(t+"-collapse").addEventListener("click",()=>this.setPanelCollapsed(t,!0)),lt(t+"-expand").addEventListener("click",()=>this.setPanelCollapsed(t,!1))}setPanelCollapsed(t,e){document.body.classList.toggle(t+"-collapsed",e),lt(t+"-collapse").setAttribute("aria-expanded",String(!e)),lt(t+"-expand").setAttribute("aria-expanded",String(!e)),lt(t+(e?"-expand":"-collapse")).focus()}isPanelCollapsed(t){return document.body.classList.contains(t+"-collapsed")}setHost(t){document.body.dataset.host=t}bindToolbar(){let t=(n,s)=>this.app.setSetting(n,s);lt("opt-shading").addEventListener("change",n=>t("shading",n.target.value)),lt("opt-axes").addEventListener("change",n=>t("axes",n.target.value)),lt("opt-weights").addEventListener("change",n=>t("weightMode",n.target.value)),lt("opt-alpha").addEventListener("change",n=>t("alpha",n.target.value)),lt("opt-pose-source").addEventListener("change",n=>t("poseSource",n.target.value)),lt("opt-lighting").addEventListener("change",n=>t("lighting",n.target.value)),lt("opt-map-view").addEventListener("change",n=>t("mapView",n.target.value)),lt("opt-normal-flip").addEventListener("change",n=>t("normalFlipY",n.target.checked)),document.querySelectorAll("#map-toggles [data-map]").forEach(n=>{n.addEventListener("change",()=>this.app.setMapToggle(n.dataset.map,n.checked))}),lt("opt-alpha-style").addEventListener("change",n=>t("alphaStyle",n.target.value)),lt("opt-jsize").addEventListener("input",n=>t("jointSize",parseFloat(n.target.value)));let e={"opt-wire":"wire","opt-skin":"skin","opt-joints":"joints","opt-curves":"curves","opt-xray":"xray","opt-tex":"textures","opt-grid":"grid"};for(let[n,s]of Object.entries(e))lt(n).addEventListener("click",r=>{let o=r.currentTarget.getAttribute("aria-pressed")!=="true";r.currentTarget.setAttribute("aria-pressed",String(o)),t(s,o)});document.querySelectorAll("#opt-tool [data-tool]").forEach(n=>{n.addEventListener("click",()=>t("tool",n.dataset.tool))}),lt("opt-space").addEventListener("click",n=>t("space",n.currentTarget.getAttribute("aria-pressed")==="true"?"local":"world")),this.bindMenus(),lt("btn-undo").addEventListener("click",()=>this.app.undo()),lt("btn-warnings").addEventListener("click",()=>this.app.showWarnings()),lt("warn-dialog-close").addEventListener("click",()=>lt("warn-dialog").close()),lt("btn-redo").addEventListener("click",()=>this.app.redo()),lt("btn-frame-all").addEventListener("click",()=>this.app.frameAll()),lt("btn-frame-sel").addEventListener("click",()=>this.app.frameSelection()),lt("file-input").addEventListener("change",n=>{let s=n.target.files&&n.target.files[0];s&&this.app.loadFile(s),n.target.value=""}),document.querySelector('label[for="file-input"]').addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),lt("file-input").click())})}syncSettings(t){lt("opt-shading").value=t.shading,lt("opt-axes").value=t.axes,lt("opt-weights").value=t.weightMode,lt("opt-jsize").value=t.jointSize,lt("opt-wire").setAttribute("aria-pressed",String(t.wire)),lt("opt-skin").setAttribute("aria-pressed",String(t.skin)),lt("opt-joints").setAttribute("aria-pressed",String(t.joints)),lt("opt-curves").setAttribute("aria-pressed",String(t.curves!==!1)),lt("opt-xray").setAttribute("aria-pressed",String(t.xray)),lt("opt-grid").setAttribute("aria-pressed",String(!!t.grid)),lt("opt-tex").setAttribute("aria-pressed",String(t.textures)),lt("opt-alpha").value=t.alpha,lt("opt-pose-source").value=t.poseSource,lt("opt-lighting").value=t.lighting,lt("opt-map-view").value=t.mapView,lt("opt-normal-flip").checked=!!t.normalFlipY,lt("map-toggles").disabled=t.mapView!=="combined",document.querySelectorAll("#map-toggles [data-map]").forEach(s=>{s.checked=!!t.maps[s.dataset.map]}),lt("opt-alpha-style").value=t.alphaStyle,lt("opt-space").setAttribute("aria-pressed",String(t.space==="world"));let e={baseColor:"\u30D9\u30FC\u30B9\u30AB\u30E9\u30FC",normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},n=[t.lighting==="flat"?"\u30D5\u30E9\u30C3\u30C8\u30E9\u30A4\u30C8":"",t.shading==="none"?"\u30EF\u30A4\u30E4\u30FC\u306E\u307F":t.shading==="flat"?"\u30D5\u30E9\u30C3\u30C8":"",t.poseSource==="file"?"\u30D5\u30A1\u30A4\u30EB\u306E\u5024":""].filter(Boolean).join("\u30FB");lt("menu-view-state").textContent=n,lt("menu-maps-state").textContent=t.mapView!=="combined"&&e[t.mapView]||"",lt("menu-weights-state").textContent={selected:"\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7",all:"\u8272\u5206\u3051"}[t.weightMode]||"",document.querySelectorAll("#opt-tool [data-tool]").forEach(s=>{s.setAttribute("aria-pressed",String(s.dataset.tool===t.tool))})}bindMenus(){let t=[...document.querySelectorAll(".menu-btn")],e=n=>{for(let s of t)s!==n&&(s.setAttribute("aria-expanded","false"),lt(s.getAttribute("aria-controls")).hidden=!0)};for(let n of t)n.addEventListener("click",()=>{let s=n.getAttribute("aria-expanded")!=="true";e(n),n.setAttribute("aria-expanded",String(s)),lt(n.getAttribute("aria-controls")).hidden=!s});document.addEventListener("pointerdown",n=>{n.target.closest(".menu")||e(null)}),document.addEventListener("keydown",n=>{if(n.key!=="Escape")return;let s=t.find(r=>r.getAttribute("aria-expanded")==="true");s&&(e(null),s.focus(),n.stopPropagation(),n.preventDefault())}),this.closeMenus=()=>e(null)}bindTabs(){let t=[["tab-tree","pane-tree"],["tab-meshes","pane-meshes"]];for(let[e,n]of t)lt(e).addEventListener("click",()=>{for(let[s,r]of t)lt(s).setAttribute("aria-selected",String(s===e)),lt(r).hidden=s!==e})}bindTree(){lt("tree").addEventListener("click",e=>{let n=e.target.closest(".row");if(!n)return;let s=this.rows[+n.dataset.row];if(e.target.closest(".eye")){s.mesh>=0?this.app.setMeshVisible(s.mesh,!this.app.built.meshes[s.mesh].selfVisible):this.app.toggleNodeVisible(s.node);return}if(e.target.closest(".twisty")){let r=this.collapsed.has(s.key);e.shiftKey?this.setSubtreeOpen(+n.dataset.row,r):r?this.collapsed.delete(s.key):this.collapsed.add(s.key),this.applyTreeVisibility();return}s.mesh>=0?this.app.selectMesh(s.mesh):this.app.select(s.node,{notify:!0})}),lt("tree-expand-all").addEventListener("click",()=>this.setAllOpen(!0)),lt("tree-collapse-all").addEventListener("click",()=>this.setAllOpen(!1)),lt("tree-filter").addEventListener("input",e=>{this.filter=e.target.value.trim().toLowerCase(),this.applyTreeVisibility()})}populate(t,e){let n=lt("tree");n.textContent="",this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null;let s=new Map;t.meshes.forEach((c,h)=>{s.has(c.transform)||s.set(c.transform,[]),s.get(c.transform).push(h)});let r=document.createDocumentFragment(),o=t.nodes.length>400,a=c=>{let h=document.createElement("div");return h.className="row"+(c.dim?" dim":""),h.setAttribute("role","treeitem"),h.dataset.row=String(this.rows.length),h.style.setProperty("--depth",c.depth),h.innerHTML=`<button class="twisty${c.hasChildren?"":" leaf"}" tabindex="-1" aria-label="\u958B\u9589" title="\u30AF\u30EA\u30C3\u30AF: \u958B\u9589\u3000Shift+\u30AF\u30EA\u30C3\u30AF: \u4E0B\u306E\u968E\u5C64\u3082\u307E\u3068\u3081\u3066\u958B\u9589">\u25BE</button><span class="icon">${c.icon}</span><span class="name" title="${oe(c.title)}">${oe(c.label)}</span><button class="eye" tabindex="-1" aria-pressed="true" aria-label="\u8868\u793A" title="\u8868\u793A\u30FB\u975E\u8868\u793A\uFF08H: \u5207\u308A\u66FF\u3048 / Ctrl+H: \u96A0\u3059 / Shift+H: \u8868\u793A\uFF09">${w_}</button>`,c.eye=h.lastChild,c.el=h,c.twisty=h.firstChild,this.rows.push(c),r.appendChild(h),c},l=(c,h)=>{let u=t.nodes[c],d=e.childrenOf[c],f=s.get(c)||[],g=a({key:"n"+c,node:c,mesh:-1,depth:h,label:u.name,title:u.path,icon:u.type==="joint"?Wo.joint:Wo.transform,hasChildren:d.length+f.length>0,dim:u.visible===!1});this.rowOfNode.set(c,g),o&&h>=2&&g.hasChildren&&this.collapsed.add(g.key);for(let x of f){let m=t.meshes[x];a({key:"m"+x,node:c,mesh:x,depth:h+1,label:m.name,title:m.path,icon:m.skin?Wo.skin:Wo.mesh,hasChildren:!1,dim:m.visible===!1})}for(let x of d)l(x,h+1)};t.nodes.forEach((c,h)=>{c.parent<0&&l(h,0)}),n.appendChild(r),this.applyTreeVisibility(),this.populateMeshes(t,e)}updateVisibilityMarks(t,e,n){for(let s of this.rows){let r,o;if(s.mesh>=0){let a=n[s.mesh];r=a.selfVisible,o=!a.visible}else r=!t.has(s.node),o=!!e[s.node];s.eye.setAttribute("aria-pressed",String(r)),s.eye.setAttribute("aria-label",r?"\u8868\u793A\u4E2D":"\u975E\u8868\u793A"),s.el.classList.toggle("dim",o)}}setSubtreeOpen(t,e){let n=this.rows[t];for(let s=t;s<this.rows.length;s++){let r=this.rows[s];if(s>t&&r.depth<=n.depth)break;r.hasChildren&&(e?this.collapsed.delete(r.key):this.collapsed.add(r.key))}}setAllOpen(t){if(this.collapsed.clear(),!t)for(let e of this.rows)e.hasChildren&&this.collapsed.add(e.key);this.applyTreeVisibility(),t&&this.selectedRow&&!this.selectedRow.el.hidden&&this.selectedRow.el.scrollIntoView({block:"nearest"})}applyTreeVisibility(){let t=this.filter,e=1/0;for(let n of this.rows){if(t){n.el.hidden=!n.label.toLowerCase().includes(t);continue}if(n.depth>e){n.el.hidden=!0;continue}e=1/0,n.el.hidden=!1;let s=this.collapsed.has(n.key);n.twisty.textContent=s?"\u25B8":"\u25BE",n.hasChildren&&n.el.setAttribute("aria-expanded",String(!s)),s&&(e=n.depth)}}highlightNode(t,e){this.selectedRow&&this.selectedRow.el.classList.remove("selected"),this.selectedRow=null;let n=this.rowOfNode.get(t);if(!n)return;let s=e[t].parent,r=!1;for(;s>=0;)this.collapsed.delete("n"+s)&&(r=!0),s=e[s].parent;r&&this.applyTreeVisibility(),n.el.classList.add("selected"),n.el.setAttribute("aria-selected","true"),this.selectedRow=n,n.el.hidden||n.el.scrollIntoView({block:"nearest"})}populateMeshes(t,e,n){let s=lt("mesh-list");s.textContent="";let r=t.materials||[],o=a=>{if(a<0)return'<span class="tex">\u30C6\u30AF\u30B9\u30C1\u30E3\u306A\u3057</span>';let l=(t.textures||[])[a]||{},c=n&&n[a]||{status:l.resolved&&l.format?"loading":"missing"},h=oe(String(l.path||"").split(/[\\/]/).pop()||l.node||"?"),u=oe(l.resolved||l.path||"");if(c.status==="ok"){let f=(c.tiles>1?`UDIM ${c.tiles} \u30BF\u30A4\u30EB\u30FB`:"")+(c.sourceWidth!==c.width?`${c.sourceWidth}\u2192${c.width}px`:`${c.width}px`);return`<span class="tex-ok" aria-label="\u8AAD\u307F\u8FBC\u307F\u6E08\u307F">\u2713</span><span class="tex" title="${u}">${h}\uFF08${f}${c.hasAlpha?"\u30FB\u30A2\u30EB\u30D5\u30A1\u3042\u308A":""}\uFF09</span>`}if(c.status==="loading")return`<span class="tex-wait">\u2026</span><span class="tex" title="${u}">${h}\uFF08\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF09</span>`;if(c.status==="pending")return`<span class="tex-wait">\u2013</span><span class="tex" title="${u}">${h}\uFF08\u672A\u8AAD\u307F\u8FBC\u307F\uFF09</span>`;let d=c.status==="error"?"\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093":l.resolved?"\u5F62\u5F0F\u306B\u672A\u5BFE\u5FDC":"\u898B\u3064\u304B\u308A\u307E\u305B\u3093";return`<span class="tex-bad" aria-label="${d}">\u2715</span><span class="tex" title="${u}">${h}\uFF08${d}\uFF09</span>`};e.meshes.forEach((a,l)=>{let c=t.meshes[l],h=document.createElement("div");h.className="mesh-item";let u="mesh-vis-"+l,d=`\u9802\u70B9 ${rn(a.vertexCount)} \u30FB \u9762 ${rn(c.counts.length)} \u30FB \u4E09\u89D2\u5F62 ${rn(a.triCount)}`;if(a.skin&&(d+=`<br>\u30B9\u30AD\u30F3 ${oe(c.skin.cluster)}\uFF08\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9 ${a.skin.stats.influenceCount}\u30FB\u6700\u5927 ${a.skin.stats.maxCount}/\u9802\u70B9\uFF09`),c.visible===!1&&(d+="<br>Maya \u3067\u306F\u975E\u8868\u793A"),c.uv){let p=0,b=0;for(let y of c.counts){for(let v=0;v<y;v++)if(c.uv.indices[b+v]<0){p++;break}b+=y}d+=`<br>UV ${oe(c.uv.set)}`+(p?`\uFF08<span class="tex-bad">UV \u306E\u306A\u3044\u9762 ${rn(p)}</span>\uFF09`:"")}else d+="<br>UV \u306A\u3057";let f=c.faceMaterials||c.counts.map(()=>c.material??-1),g=new Map;for(let p of f)g.set(p,(g.get(p)||0)+1);let x=g.size>1,m='<ul class="mats">';for(let[p,b]of g){let y=r[p],v=x?`<span class="faces">${rn(b)} \u9762</span>`:"";m+=y?`<li><span title="${oe(y.type)}">${oe(y.name)}</span>${v}${o(y.texture)}</li>`:`<li><span>\u65E2\u5B9A\u306E\u30DE\u30C6\u30EA\u30A2\u30EB</span>${v}</li>`;let w=y&&y.maps?Object.entries(y.maps).filter(([M])=>M!=="baseColor"):[];if(w.length){let M={normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},S={ok:'<span class="tex-ok">\u2713</span>',loading:'<span class="tex-wait">\u2026</span>',pending:'<span class="tex-wait">\u2013</span>',missing:'<span class="tex-bad">\u2715</span>',error:'<span class="tex-bad">\u2715</span>'},C=w.map(([_,E])=>{let D=n&&n[E.texture]||{status:"pending"},V=E.channel&&E.channel!=="rgb"?`\uFF08${E.channel.toUpperCase()}\uFF09`:"";return`${M[_]||_}${V} ${S[D.status]||""}`});m+=`<li class="sub-maps">${C.join("\u3000")}</li>`}}m+="</ul>",h.innerHTML=`<input type="checkbox" id="${u}" ${a.visible?"checked":""} aria-label="${oe(c.name)} \u3092\u8868\u793A"><label class="name" for="${u}">${oe(c.name)}</label><div class="meta">${d}</div>${m}`,h.querySelector("input").addEventListener("change",p=>this.app.setMeshVisible(l,p.target.checked)),h.querySelector(".name").addEventListener("click",p=>{p.preventDefault(),this.app.selectMesh(l)}),s.appendChild(h)})}setMeshChecked(t,e){let n=lt("mesh-vis-"+t);n&&(n.checked=e)}showNodeInfo(t){let e=lt("select-head"),n=lt("select-info");if(!t){e.innerHTML='<p class="muted">\u30B8\u30E7\u30A4\u30F3\u30C8\u3084\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3053\u3053\u306B\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>',n.innerHTML="";return}let s=t.node,r=s.attrs||{},o={joint:"\u30B8\u30E7\u30A4\u30F3\u30C8",transform:"\u30C8\u30E9\u30F3\u30B9\u30D5\u30A9\u30FC\u30E0"}[s.type]||s.type;e.innerHTML=`<p class="info-title">${oe(s.name)}<span class="info-type">${oe(o)}</span>${t.posed?'<span class="posed-badge">\u30DD\u30FC\u30BA\u5909\u66F4\u4E2D</span>':""}</p><p class="info-path">${oe(s.path)}</p>`;let a={pm:"skinCluster \u306E .pm",dagPose:"dagPose",bps:"\u30B8\u30E7\u30A4\u30F3\u30C8\u306E .bps"},l='<table class="kv">';l+=`<tr><th>\u8868\u793A</th><td>${t.hiddenSelf?"\u975E\u8868\u793A":t.hiddenByParent?"\u89AA\u304C\u975E\u8868\u793A\u306E\u305F\u3081\u96A0\u308C\u3066\u3044\u307E\u3059":"\u8868\u793A\u4E2D"}</td></tr>`,l+=`<tr><th>\u59FF\u52E2\u306E\u57FA\u6E96</th><td>${t.usingBind?"\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA":"\u30D5\u30A1\u30A4\u30EB\u306E\u5024"}</td></tr>`,l+=`<tr><th>\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u60C5\u5831</th><td>${t.bindSource?oe(a[t.bindSource]||t.bindSource):"\u306A\u3057"}</td></tr>`,l+="</table>";let c=t.animChannels||[],h=t.rigDrivers||[];(c.length||h.length)&&(l+='<table class="kv">',c.length&&(l+=`<tr><th>\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3</th><td>${oe(c.join("\u30FB"))}</td></tr>`),h.length&&(l+=`<tr><th>\u30EA\u30B0</th><td>${h.slice(0,6).map(oe).join("<br>")}${h.length>6?"<br>\u307B\u304B":""}</td></tr>`),l+="</table>");let u=/（(animCurveT[LAU]|pointConstraint|orientConstraint|parentConstraint|scaleConstraint|poleVectorConstraint|unitConversion|pairBlend|blendColors|multiplyDivide|plusMinusAverage|reverse|condition)）$/,d=(t.drivenBy||[]).filter(f=>!(t.animLoaded&&u.test(f)));if(d.length&&(l+='<p class="note small">\u6B21\u306E\u5024\u306F\u63A5\u7D9A\u3067\u6C7A\u307E\u308B\u305F\u3081\u3001\u30D5\u30A1\u30A4\u30EB\u306B\u6B8B\u3063\u3066\u3044\u307E\u305B\u3093'+(t.bindSource?"\uFF08\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u3067\u3082\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u59FF\u52E2\u3067\u8868\u793A\uFF09":"\uFF08\u65E2\u5B9A\u5024\u3067\u8868\u793A\uFF09")+"\uFF1A<br>"+d.slice(0,6).map(oe).join("<br>")+(d.length>6?"<br>\u307B\u304B":"")+"</p>"),l+='<p class="sub">\u30D5\u30A1\u30A4\u30EB\u4E0A\u306E\u5024</p><table class="kv">',r.t&&(l+=`<tr><th>\u79FB\u52D5</th><td>${Gn(r.t)}</td></tr>`),r.r&&(l+=`<tr><th>\u56DE\u8EE2</th><td>${Gn(r.r,2)}</td></tr>`),r.jo&&(l+=`<tr><th>\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u5411\u304D</th><td>${Gn(r.jo,2)}</td></tr>`),r.s&&(l+=`<tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Gn(r.s)}</td></tr>`),r.ro&&(l+=`<tr><th>\u56DE\u8EE2\u9806</th><td>${oe(r.ro)}</td></tr>`),l+="</table>",t.animValues){let f=t.animValues;l+=`<p class="sub">\u30D5\u30EC\u30FC\u30E0 ${oe(vs(t.frame,Number.isInteger(t.frame)?0:2))} \u306E\u5024</p><table class="kv"><tr><th>\u79FB\u52D5</th><td>${Gn(f.t)}</td></tr><tr><th>\u56DE\u8EE2</th><td>${Gn(f.r,2)}</td></tr><tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Gn(f.s)}</td></tr></table>`}if(l+=`<table class="kv" style="margin-top:6px"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Gn(t.worldPos)}</td></tr></table>`,t.usage&&t.usage.length){l+='<p class="sub">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3068\u3057\u3066</p><table class="kv">';for(let f of t.usage)l+=`<tr><th>${oe(f.meshName)}</th><td>${rn(f.count)} / ${rn(f.total)} \u9802\u70B9</td></tr>`;l+="</table>"}else s.type==="joint"&&(l+='<p class="muted small">\u3069\u306E\u30E1\u30C3\u30B7\u30E5\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u306B\u3082\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002</p>');if(t.meshes&&t.meshes.length)for(let f of t.meshes){if(l+=`<p class="sub">\u30E1\u30C3\u30B7\u30E5 ${oe(f.name)}</p><table class="kv">`,l+=`<tr><th>\u9802\u70B9 / \u9762</th><td>${rn(f.vertices)} / ${rn(f.faces)}</td></tr>`,f.skin){let g=f.skin;l+=`<tr><th>skinCluster</th><td>${oe(f.cluster)}</td></tr>`,l+=`<tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9</th><td>${g.influenceCount}\uFF08\u6700\u5927 ${g.maxCount}/\u9802\u70B9\uFF09</td></tr>`,l+=`<tr><th>5\u301C8 \u3064\u306E\u9802\u70B9</th><td>${rn(g.over4-g.overMax)}</td></tr>`,l+=`<tr><th>9 \u3064\u4EE5\u4E0A\u306E\u9802\u70B9</th><td>${rn(g.overMax)}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9</th><td>${rn(g.unnormalized)}</td></tr>`;let x={0:"\u306A\u3057",1:"\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6",2:"\u30DD\u30B9\u30C8"}[f.normalizeSetting]||"?";l+=`<tr><th>Maya \u306E\u6B63\u898F\u5316\u306E\u8A2D\u5B9A</th><td>${x}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 0 \u306E\u9802\u70B9</th><td>${rn(g.zero)}\uFF08\u5272\u308A\u5F53\u3066\u6E08\u307F\uFF09</td></tr>`}l+="</table>",f.skin&&f.skin.overMax&&(l+='<p class="note small">9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u306F\u3001\u4E0A\u4F4D 8 \u3064\u3067\u5909\u5F62\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF08\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7\u3068\u6570\u5024\u306F\u5168\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\uFF09\u3002</p>')}n.innerHTML=l}showVertexInfo(t){let e=lt("vertex-body");if(!t){e.innerHTML='<p class="muted">\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3044\u3061\u3070\u3093\u8FD1\u3044\u9802\u70B9\u306E\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>';return}let n=`<p class="info-title">${oe(t.meshName)}.vtx[${t.vertex}]</p>`;if(n+=`<table class="kv"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Gn(t.worldPos)}</td></tr></table>`,!t.skinned){n+='<p class="muted">\u3053\u306E\u30E1\u30C3\u30B7\u30E5\u306B\u306F\u30B9\u30AD\u30F3\u304C\u3042\u308A\u307E\u305B\u3093\u3002</p>',e.innerHTML=n;return}if(!t.weights.length){n+='<p class="note err">\u3053\u306E\u9802\u70B9\u306B\u306F\u30A6\u30A7\u30A4\u30C8\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u30B8\u30E7\u30A4\u30F3\u30C8\u3082\u3042\u308A\u307E\u305B\u3093\uFF09\u3002</p>',e.innerHTML=n;return}n+='<ul class="wlist">',t.weights.forEach((s,r)=>{let o=r>=8,l=t.assigned||t.normalized&&Math.abs(t.sum-1)>.001?`${vs(s.weight,4)} \u2192 ${vs(s.effective,4)}`:vs(s.weight,4);n+=`<li class="${o?"dropped":""}"><span class="jn" data-node="${s.nodeIndex}" title="${oe(s.path)}">${oe(s.name)}</span><span class="wv">${l}</span><span class="bar"><i style="width:${Math.min(100,s.effective*100).toFixed(1)}%"></i></span></li>`}),n+="</ul>",n+=`<table class="kv" style="margin-top:6px"><tr><th>\u5408\u8A08</th><td>${vs(t.sum,4)}</td></tr><tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u6570</th><td>${t.weights.length}</td></tr></table>`,t.weights.length>8&&(n+='<p class="note small">9 \u3064\u76EE\u4EE5\u964D\uFF08\u8584\u3044\u8868\u793A\uFF09\u306F\u5909\u5F62\u8868\u793A\u306B\u4F7F\u308F\u308C\u3066\u3044\u307E\u305B\u3093\u3002</p>'),t.assigned?n+=`<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u305F\u3081\u3001\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${t.distribution}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3067\u5909\u5F62\u3057\u3066\u3044\u307E\u3059\u3002</p>`:Math.abs(t.sum-1)>.001&&(n+='<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u5909\u5F62\u306B\u306F\u5408\u8A08\u3067\u5272\u3063\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002</p>'),e.innerHTML=n,e.querySelectorAll(".jn").forEach(s=>{s.addEventListener("click",()=>this.app.select(+s.dataset.node,{notify:!0}))})}bindPose(){let t=["x","y","z"],e=(r,o)=>{let a=parseFloat(lt(r).value);return Number.isFinite(a)?a:o},n=()=>({t:t.map(r=>e("pose-t"+r,0)),r:t.map(r=>e("pose-r"+r,0)),s:t.map(r=>e("pose-s"+r,1))}),s=()=>{this.app.beginPoseEdit([this.app.selected],"\u6570\u5024\u5165\u529B"),this.app.setPoseForSelected(n())};for(let r of["t","r","s"])for(let o of t){let a=lt("pose-"+r+o);a.addEventListener("input",s),a.addEventListener("change",()=>this.app.endPoseEdit()),a.addEventListener("blur",()=>this.app.endPoseEdit()),a.addEventListener("keydown",l=>{l.key==="Enter"&&a.blur()})}lt("pose-reset").addEventListener("click",()=>this.app.resetPose(this.app.selected)),lt("pose-reset-all").addEventListener("click",()=>this.app.resetAllPoses())}showPoseFor(t,e){let n=t>=0;if(lt("pose-ctrls").hidden=!n,!n)return;let s=e||{t:[0,0,0],r:[0,0,0],s:[1,1,1]},r=document.activeElement,o=(a,l)=>{let c=lt(a);c!==r&&(c.value=String(+l.toFixed(4)))};["x","y","z"].forEach((a,l)=>{o("pose-t"+a,s.t[l]),o("pose-r"+a,s.r[l]),o("pose-s"+a,s.s[l])})}addWarnings(t){this.warnings=(this.warnings||[]).concat(t),this.setWarnings(this.warnings)}setWarnings(t){this.warnings=t.slice();let e=lt("btn-warnings");e.hidden=!t.length,lt("warn-count").textContent=String(t.length),e.title=`\u8B66\u544A ${t.length} \u4EF6\u3092\u8868\u793A`,e.setAttribute("aria-label",e.title),lt("warn-body").innerHTML=t.length?"<ul>"+t.map(n=>`<li>${oe(n)}</li>`).join("")+"</ul>":'<p class="muted">\u8B66\u544A\u306F\u3042\u308A\u307E\u305B\u3093\u3002</p>',this.app.onWarningsChanged(this.warnings)}openWarningDialog(){let t=lt("warn-dialog");t.open||t.showModal()}setHistoryState(t){let e=lt("btn-undo"),n=lt("btn-redo");e.disabled=!t.canUndo,n.disabled=!t.canRedo,e.title=(t.canUndo?`\u5143\u306B\u623B\u3059: ${t.undoLabel}`:"\u5143\u306B\u623B\u3059")+"\uFF08Ctrl+Z / Z\uFF09",n.title=(t.canRedo?`\u3084\u308A\u76F4\u3059: ${t.redoLabel}`:"\u3084\u308A\u76F4\u3059")+"\uFF08Ctrl+Y / Shift+Z\uFF09"}setLegend(t,e){let n=lt("legend");if(t==="off"){n.hidden=!0;return}n.hidden=!1,t==="selected"?n.innerHTML=e?`<div class="lg-title">\u30A6\u30A7\u30A4\u30C8: ${oe(e)}</div><div class="lg-bar"></div><div class="lg-scale"><span>0</span><span>0.5</span><span>1</span></div>`:'<div class="lg-title">\u30B8\u30E7\u30A4\u30F3\u30C8\u3092\u9078\u3076\u3068\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059</div>':n.innerHTML='<div class="lg-title">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3054\u3068\u306B\u8272\u5206\u3051</div><div class="muted small">\u5883\u754C\u306E\u6DF7\u8272\u304C\u30A6\u30A7\u30A4\u30C8\u306E\u6DF7\u3056\u308A\u5177\u5408\u3067\u3059\u3002</div>'}setTitle(t){lt("vp-title").textContent=t||""}setFile(t){lt("status-file").textContent=t}setStats(t){lt("status-stats").textContent=t}setMessage(t,e=4e3){lt("status-msg").textContent=t||"",clearTimeout(this.msgTimer),t&&e&&(this.msgTimer=setTimeout(()=>{lt("status-msg").textContent=""},e))}setEmpty(t){lt("empty").hidden=!t}showLoading(t,e){lt("loading").hidden=!1,lt("loading-text").textContent=t||"\u8AAD\u307F\u8FBC\u307F\u4E2D";let n=typeof e=="number"&&e>=0;lt("loading-bar").parentElement.classList.toggle("indeterminate",!n),lt("loading-bar").style.width=n?`${Math.round(Math.min(1,e)*100)}%`:""}hideLoading(){lt("loading").hidden=!0}showError(t){let e=lt("error");e.hidden=!1,e.textContent=t}hideError(){lt("error").hidden=!0}};function qo(){return typeof window<"u"&&typeof window.qt<"u"&&!!window.qt.webChannelTransport}function pd(i){return!qo()||typeof window.QWebChannel>"u"?!1:(new window.QWebChannel(window.qt.webChannelTransport,t=>{let e=t.objects.bridge;e&&i(e)}),!0)}var $o=class{constructor(t,e=200){this.apply=t,this.limit=e,this.undoStack=[],this.redoStack=[],this.onChange=null}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}get undoLabel(){return this.canUndo?this.undoStack[this.undoStack.length-1].label:""}get redoLabel(){return this.canRedo?this.redoStack[this.redoStack.length-1].label:""}push(t){this.undoStack.push(t),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack.length=0,this.changed()}undo(){let t=this.undoStack.pop();return t?(this.apply(t.before),this.redoStack.push(t),this.changed(),t):null}redo(){let t=this.redoStack.pop();return t?(this.apply(t.after),this.undoStack.push(t),this.changed(),t):null}clear(){this.undoStack.length=0,this.redoStack.length=0,this.changed()}changed(){this.onChange&&this.onChange(this)}};function md(i,t){return JSON.stringify(i)===JSON.stringify(t)}var gd=30,xd=31;function yd(i,t=0,e={}){let n=e.size||384,s=e.eightOnGpu!==!1,{renderer:r,camera:o,scene:a}=i,l=i.built.meshes[t];if(!l||!l.skinned)throw new Error("\u30B9\u30AD\u30F3\u4ED8\u304D\u30E1\u30C3\u30B7\u30E5\u3067\u306F\u3042\u308A\u307E\u305B\u3093");i.built.root.updateMatrixWorld(!0);let c=l.geometry.attributes.position.count,h=new Float32Array(c*3),u=new A;for(let S=0;S<c;S++)cr(l,S,!0,u),h[S*3]=u.x,h[S*3+1]=u.y,h[S*3+2]=u.z;let d=new ie;d.setAttribute("position",new _e(h,3)),d.setIndex(l.geometry.index);let f=new Ie({color:16711680,side:ke}),g=new mt(d,f);g.frustumCulled=!1,g.layers.set(xd),a.add(g),g.updateMatrixWorld(!0);let x=new Ie({color:16711680,side:ke});s&&xs(x);let m={material:l.skinned.material,layers:l.skinned.layers.mask,visible:l.skinned.visible,cam:o.layers.mask,aspect:o.aspect,target:r.getRenderTarget()};l.skinned.material=x,l.skinned.layers.set(gd),l.skinned.visible=!0,o.aspect=1,o.updateProjectionMatrix();let p=new pn(n,n),b=S=>{o.layers.set(S),r.setRenderTarget(p),r.clear(),r.render(a,o);let C=new Uint8Array(n*n*4);return r.readRenderTargetPixels(p,0,0,n,n,C),C},y,v;try{y=b(gd),v=b(xd)}finally{r.setRenderTarget(m.target),o.layers.mask=m.cam,o.aspect=m.aspect,o.updateProjectionMatrix(),l.skinned.material=m.material,l.skinned.layers.mask=m.layers,l.skinned.visible=m.visible,a.remove(g),d.dispose(),f.dispose(),x.dispose(),p.dispose(),i.requestRender()}let w=0,M=0;for(let S=3;S<y.length;S+=4){let C=y[S]>127,_=v[S]>127;(C||_)&&w++,C!==_&&M++}return{covered:w,mismatch:M,ratio:w?M/w:0}}var Be={FIXED:1,LINEAR:2,FLAT:3,STEP:5,SLOW:6,FAST:7,SPLINE:9,CLAMPED:10,PLATEAU:16,STEP_NEXT:17,AUTO:18},Ms={CONSTANT:0,LINEAR:1,CYCLE:3,CYCLE_RELATIVE:4,OSCILLATE:5},ec=Math.PI/180,bs=1e-9,bd=1,wd=2;function Yo(i,t=Float32Array){if(i==null)return new t(0);if(Array.isArray(i))return t.from(i);let e=atob(i.data||""),n=new Uint8Array(e.length);for(let r=0;r<e.length;r++)n[r]=e.charCodeAt(r);if(i.dtype==="uint8")return t===Uint8Array?n:t.from(n);let s=new Float32Array(n.buffer,0,Math.floor(n.length/4));return t===Float32Array?s:t.from(s)}function _d(i,t){return i===0&&(i=t||Be.AUTO),i>=19&&i<=21?Be.AUTO:i}function S_(i,t,e,n,s){let r=i.count,o=i.offset,a=Float64Array.from(t.subarray(o,o+r)),l=Float64Array.from(e.subarray(o,o+r)),c=new Float64Array(r),h=new Float64Array(r),u=new Float64Array(r),d=new Float64Array(r),f=new Uint8Array(r),g=!!i.weighted,x=(p,b)=>(l[b]-l[p])/Math.max(a[b]-a[p],bs),m=(p,b,y)=>{let v=b>0,w=b<r-1,M=v?x(b-1,b):0,S=w?x(b,b+1):0;switch(p){case Be.LINEAR:return y==="in"?v?M:S:w?S:M;case Be.FLAT:case Be.STEP:case Be.STEP_NEXT:return 0;case Be.CLAMPED:return!v||!w?v?M:S:Math.abs(l[b]-l[b-1])<bs||Math.abs(l[b+1]-l[b])<bs?0:x(b-1,b+1);case Be.AUTO:case Be.PLATEAU:{if(!v||!w||M*S<=0)return 0;let C=x(b-1,b+1),_=3*Math.min(Math.abs(M),Math.abs(S));return Math.sign(C)*Math.min(Math.abs(C),_)}default:return v&&w?x(b-1,b+1):v?M:S}};for(let p=0;p<r;p++){let b=o+p,y=_d(n.length?n[2*b]:0,i.tangent),v=_d(n.length?n[2*b+1]:0,i.tangent);v===Be.STEP?f[p]=bd:v===Be.STEP_NEXT&&(f[p]=wd);let w=s.get(b);for(let M of["in","out"]){let S=M==="in"?y:v,C=m(S,p,M),_=0,E=w?M==="in"?w[0]:w[2]:NaN,D=w?M==="in"?w[1]:w[3]:NaN;Number.isFinite(E)&&Number.isFinite(D)&&(S===Be.FIXED||g)&&(!(S===Be.LINEAR||S===Be.FLAT||S===Be.STEP||S===Be.STEP_NEXT)&&Math.abs(E)>bs&&(C=D/E),g&&(_=Math.abs(E))),M==="in"?(c[p]=C,u[p]=_):(h[p]=C,d[p]=_)}}return{name:i.name,type:i.type,n:r,t:a,v:l,inSlope:c,outSlope:h,inW:u,outW:d,step:f,weighted:g,pre:i.pre||0,post:i.post||0,last:0}}function E_(i,t,e){let n=i.t[t],s=i.t[t+1],r=i.v[t],o=i.v[t+1];if(i.step[t]===bd)return r;if(i.step[t]===wd)return e>n?o:r;let a=s-n;if(a<=bs)return o;if(!i.weighted||i.outW[t]===0&&i.inW[t+1]===0){let b=(e-n)/a,y=b*b,v=y*b,w=i.outSlope[t]*a,M=i.inSlope[t+1]*a;return(2*v-3*y+1)*r+(v-2*y+b)*w+(-2*v+3*y)*o+(v-y)*M}let l=i.outW[t]||a,c=i.inW[t+1]||a,h=Math.min(n+l/3,s),u=Math.max(s-c/3,n),d=r+i.outSlope[t]*(h-n),f=o-i.inSlope[t+1]*(s-u),g=(b,y,v,w,M)=>{let S=1-M;return S*S*S*b+3*S*S*M*y+3*S*M*M*v+M*M*M*w},x=0,m=1,p=(e-n)/a;for(let b=0;b<40;b++){let y=g(n,h,u,s,p);if(Math.abs(y-e)<1e-7)break;y<e?x=p:m=p,p=(x+m)/2}return g(r,d,f,o,p)}function vd(i,t){let e=i.t,n=i.n;if(t>=e[n-1])return i.v[n-1];let s=i.last;if(!(s<n-1&&e[s]<=t&&t<e[s+1])){let r=0,o=n-1;for(;o-r>1;){let a=r+o>>1;e[a]<=t?r=a:o=a}s=r,i.last=s}return E_(i,s,t)}function dr(i,t){let e=i.n;if(e===0)return 0;if(e===1)return i.v[0];let n=i.t[0],s=i.t[e-1];if(t>=n&&t<=s)return vd(i,t);let r=t<n,o=r?i.pre:i.post;if(o===Ms.LINEAR)return r?i.v[0]+i.inSlope[0]*(t-n):i.v[e-1]+i.outSlope[e-1]*(t-s);let a=s-n;if(a<=bs||!(o===Ms.CYCLE||o===Ms.CYCLE_RELATIVE||o===Ms.OSCILLATE))return r?i.v[0]:i.v[e-1];let l=Math.floor((t-n)/a),c=t-l*a;o===Ms.OSCILLATE&&l%2!==0&&(c=n+s-c);let h=vd(i,c);return o===Ms.CYCLE_RELATIVE?h+l*(i.v[e-1]-i.v[0]):h}var A_=["xyz","yzx","zxy","xzy","yxz","zyx"],T_=A_.map(i=>i.split("").reverse().join("").toUpperCase()),C_=new ve,Ci=new it;function Wn(i,t,e=new it){e.identity();let n=a=>e.premultiply(a),s=(a,l=1)=>a?Ci.makeTranslation(a[0]*l,a[1]*l,a[2]*l):null,r=(a,l)=>Ci.makeRotationFromEuler(C_.set(a[0]*ec,a[1]*ec,a[2]*ec,T_[l]||"ZYX")),o=i.s;return i.joint?(n(Ci.makeScale(o[0],o[1],o[2])),i.ra&&n(r(i.ra,0)),n(r(i.r,i.ro||0)),i.jo&&n(r(i.jo,0)),t&&n(Ci.makeScale(t[0]?1/t[0]:1,t[1]?1/t[1]:1,t[2]?1/t[2]:1)),n(s(i.t)),Md(i,e)):(i.sp&&n(s(i.sp,-1)),n(Ci.makeScale(o[0],o[1],o[2])),i.sh&&n(Ci.set(1,i.sh[0],i.sh[1],0,0,1,i.sh[2],0,0,0,1,0,0,0,0,1)),i.sp&&n(s(i.sp)),i.spt&&n(s(i.spt)),i.rp&&n(s(i.rp,-1)),i.ra&&n(r(i.ra,0)),n(r(i.r,i.ro||0)),i.rp&&n(s(i.rp)),i.rpt&&n(s(i.rpt)),n(s(i.t)),Md(i,e))}function Md(i,t){return i.opm?t.premultiply(i.opm.isMatrix4?i.opm:Ci.fromArray(i.opm)):t}var R_={x:0,y:1,z:2},Zo=class{constructor(t){this.raw=t,this.fps=+t.fps||24,this.start=+t.start,this.end=+t.end,this.end>=this.start||(this.start=0,this.end=0),this.current=Number.isFinite(+t.current)?+t.current:this.start;let e=Yo(t.times),n=Yo(t.values),s=Yo(t.tangentTypes,Uint8Array),r=Yo(t.fixedTangents),o=new Map;for(let l=0;l+4<r.length;l+=5)o.set(r[l],[r[l+1],r[l+2],r[l+3],r[l+4]]);this.curves=(t.curves||[]).map(l=>S_(l,e,n,s,o)),this.timeCurves=this.curves.filter(l=>!l.type||l.type[0]==="T"),this.warnings=(t.warnings||[]).slice();let a=new Map;for(let l of t.nodes||[])a.set(l.node,{node:l.node,rest:l,isNode:l.isNode??-1,isScale:l.isScale||null,channels:[],cur:{...l,t:l.t.slice(),r:l.r.slice(),s:l.s.slice()}});for(let l of t.channels||[]){let c=a.get(l.node),h=this.curves[l.curve];!c||!h||c.channels.push({base:l.attr[0],axis:R_[l.attr[1]],curve:h,attr:l.attr})}this.entries=[...a.values()],this.byNode=a,this.matrices=new Map(this.entries.map(l=>[l.node,new it]))}get nodes(){return this.entries.map(t=>t.node)}channelsOf(t){let e=this.byNode.get(t);return e?e.channels.map(n=>n.attr):[]}keyTimes(t=-1){let e=new Set,n=t>=0?(this.byNode.get(t)||{channels:[]}).channels.map(s=>s.curve):this.timeCurves;for(let s of n)for(let r=0;r<s.n;r++)e.add(s.t[r]);return[...e].sort((s,r)=>s-r)}evaluate(t){for(let e of this.entries){let n=e.cur;for(let s of e.channels)n[s.base][s.axis]=dr(s.curve,t)}for(let e of this.entries){let n=null;if(e.cur.joint&&(e.isScale||e.isNode>=0)){let s=e.isNode>=0?this.byNode.get(e.isNode):null;n=s?s.cur.s:e.isScale}Wn(e.cur,n,this.matrices.get(e.node))}return this.matrices}wrap(t){let e=this.end-this.start+1;return e<=1?this.start:this.start+((t-this.start)%e+e)%e}};var jo=Math.PI/180,fr=180/Math.PI,Sd=1e5,P_=(i,t,e)=>{if(i===t)return e<i?0:1;let n=Math.min(1,Math.max(0,(e-i)/(t-i)));return n*n*(3-2*n)},L_={sin:[1,Math.sin],cos:[1,Math.cos],tan:[1,Math.tan],asin:[1,Math.asin],acos:[1,Math.acos],atan:[1,Math.atan],atan2:[2,Math.atan2],sind:[1,i=>Math.sin(i*jo)],cosd:[1,i=>Math.cos(i*jo)],tand:[1,i=>Math.tan(i*jo)],asind:[1,i=>Math.asin(i)*fr],acosd:[1,i=>Math.acos(i)*fr],atand:[1,i=>Math.atan(i)*fr],atan2d:[2,(i,t)=>Math.atan2(i,t)*fr],abs:[1,Math.abs],sqrt:[1,Math.sqrt],pow:[2,Math.pow],exp:[1,Math.exp],log:[1,Math.log],log10:[1,Math.log10],floor:[1,Math.floor],ceil:[1,Math.ceil],trunc:[1,Math.trunc],sign:[1,Math.sign],min:[2,Math.min],max:[2,Math.max],clamp:[3,(i,t,e)=>Math.min(Math.max(e,i),t)],smoothstep:[3,P_],linstep:[3,(i,t,e)=>i===t?e<i?0:1:Math.min(1,Math.max(0,(e-i)/(t-i)))],deg_to_rad:[1,i=>i*jo],rad_to_deg:[1,i=>i*fr],fmod:[2,(i,t)=>i%t],hypot:[2,Math.hypot],equivalent:[2,(i,t)=>Math.abs(i-t)<=1e-5?1:0],equivalentTol:[3,(i,t,e)=>Math.abs(i-t)<=e?1:0]},Ed={true:1,false:0,on:1,off:0,yes:1,no:0},Ko=/\s+|\/\/[^\n]*|\/\*[\s\S]*?\*\/|(\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+(?:[eE][-+]?\d+)?)|\.([IO])\[(\d+)\]|(\$\w+)|([A-Za-z_]\w*)|(\+\+|--|[-+*/%]=|==|!=|<=|>=|&&|\|\||[-+*/%=<>!?:;,(){}])/y,on=class extends Error{};function I_(i){let t=[];Ko.lastIndex=0;let e=0;for(;e<i.length;){Ko.lastIndex=e;let n=Ko.exec(i);if(!n)throw new on(`\u8AAD\u3081\u306A\u3044\u6587\u5B57\u300C${i[e]}\u300D`);e=Ko.lastIndex,n[1]!==void 0?t.push({t:"num",v:parseFloat(n[1]),int:!/[.eE]/.test(n[1])}):n[2]!==void 0?t.push({t:n[2],v:+n[3]}):n[4]!==void 0?t.push({t:"var",v:n[4]}):n[5]!==void 0?t.push({t:"name",v:n[5]}):n[6]!==void 0&&t.push({t:"op",v:n[6]})}return t.push({t:"end",v:""}),t}function Ad(i){let t=I_(i),e=0,n=new Map,s=new Set,r=()=>t[e],o=y=>t[e].t==="op"&&t[e].v===y,a=y=>{if(!o(y))throw new on(`\u300C${y}\u300D\u304C\u5FC5\u8981\u3067\u3059\uFF08\u300C${t[e].v}\u300D\uFF09`);e++},l=(y,v,w)=>{let M=y.int&&v.int,S=y.f,C=v.f;switch(w){case"+":return{f:_=>S(_)+C(_),int:M};case"-":return{f:_=>S(_)-C(_),int:M};case"*":return{f:_=>S(_)*C(_),int:M};case"/":return M?{f:_=>{let E=C(_);return E===0?0:Math.trunc(S(_)/E)},int:M}:{f:_=>S(_)/C(_),int:M};case"%":return{f:_=>S(_)%C(_),int:M};case"==":return{f:_=>S(_)===C(_)?1:0,int:!0};case"!=":return{f:_=>S(_)!==C(_)?1:0,int:!0};case"<":return{f:_=>S(_)<C(_)?1:0,int:!0};case"<=":return{f:_=>S(_)<=C(_)?1:0,int:!0};case">":return{f:_=>S(_)>C(_)?1:0,int:!0};case">=":return{f:_=>S(_)>=C(_)?1:0,int:!0};case"&&":return{f:_=>S(_)&&C(_)?1:0,int:!0};case"||":return{f:_=>S(_)||C(_)?1:0,int:!0};default:throw new on(`\u672A\u5BFE\u5FDC\u306E\u6F14\u7B97\u5B50 ${w}`)}},c=[["||"],["&&"],["==","!="],["<","<=",">",">="],["+","-"],["*","/","%"]],h=y=>{if(y.t==="var"){let v=y.v;return{get:w=>w.vars.get(v)||0,set:(w,M)=>w.vars.set(v,n.get(v)==="int"?Math.trunc(M):M),declare:w=>{n.has(v)||n.set(v,w?"int":"float")},int:()=>n.get(v)==="int"}}if(y.t==="O"){let v=y.v;return s.add(v),{get:w=>w.out.get(v)||0,set:(w,M)=>w.out.set(v,M),declare:()=>{},int:()=>!1}}throw new on(`\u300C${y.v}\u300D\u306B\u306F\u4EE3\u5165\u3067\u304D\u307E\u305B\u3093`)};function u(){let y=r();if((y.t==="var"||y.t==="O")&&t[e+1].t==="op"&&/^[-+*/%]?=$/.test(t[e+1].v)){e++;let v=t[e++].v,w=h(y),M=u();if(w.declare(M.int),v==="=")return{f:C=>{let _=M.f(C);return w.set(C,_),w.get(C)},int:w.int()};let S=l({f:w.get,int:w.int()},M,v[0]);return{f:C=>(w.set(C,S.f(C)),w.get(C)),int:w.int()}}return d()}function d(){let y=f(0);if(!o("?"))return y;e++;let v=u();a(":");let w=u();return{f:M=>y.f(M)?v.f(M):w.f(M),int:v.int&&w.int}}function f(y){if(y>=c.length)return g();let v=f(y+1);for(;r().t==="op"&&c[y].includes(r().v);){let w=t[e++].v;v=l(v,f(y+1),w)}return v}function g(){if(o("-")){e++;let y=g();return{f:v=>-y.f(v),int:y.int}}if(o("+"))return e++,g();if(o("!")){e++;let y=g();return{f:v=>y.f(v)?0:1,int:!0}}if(o("++")||o("--")){let y=t[e++].v==="++"?1:-1,v=h(t[e++]);return{f:w=>(v.set(w,v.get(w)+y),v.get(w)),int:v.int()}}return x()}function x(){let y=r();if((y.t==="var"||y.t==="O")&&t[e+1].t==="op"&&(t[e+1].v==="++"||t[e+1].v==="--")){e+=2;let v=t[e-1].v==="++"?1:-1,w=h(y);return{f:M=>{let S=w.get(M);return w.set(M,S+v),S},int:w.int()}}return m()}function m(){let y=t[e++];switch(y.t){case"num":{let v=y.v;return{f:()=>v,int:y.int}}case"I":{let v=y.v;return{f:w=>w.input(v),int:!1}}case"O":{let v=y.v;return{f:w=>w.out.get(v)||0,int:!1}}case"var":{let v=y.v;return{f:w=>w.vars.get(v)||0,int:n.get(v)==="int"}}case"name":{if(y.v==="frame")return{f:C=>C.frame,int:!1};if(y.v==="time")return{f:C=>C.time,int:!1};if(y.v in Ed){let C=Ed[y.v];return{f:()=>C,int:!0}}let v=L_[y.v];if(!v)throw new on(`\u672A\u5BFE\u5FDC\u306E\u540D\u524D ${y.v}`);a("(");let w=[];if(!o(")"))for(w.push(u());o(",");)e++,w.push(u());if(a(")"),w.length!==v[0])throw new on(`${y.v} \u306E\u5F15\u6570\u306F ${v[0]} \u500B\u3067\u3059`);let M=v[1],S=w.map(C=>C.f);if(S.length===1){let[C]=S;return{f:_=>M(C(_)),int:!1}}return{f:C=>M(...S.map(_=>_(C))),int:!1}}case"op":if(y.v==="("){if(r().t==="name"&&(r().v==="int"||r().v==="float")&&t[e+1].v===")"){let w=t[e].v==="int";e+=2;let M=g();return w?{f:S=>Math.trunc(M.f(S)),int:!0}:{f:M.f,int:!1}}let v=u();return a(")"),v}break;default:break}throw new on(`\u300C${y.v||"\u5F0F\u306E\u7D42\u308F\u308A"}\u300D\u306F\u8AAD\u3081\u307E\u305B\u3093`)}function p(){let y=r();if(o(";"))return e++,()=>{};if(o("{")){e++;let w=[];for(;!o("}");){if(r().t==="end")throw new on("\u300C}\u300D\u304C\u8DB3\u308A\u307E\u305B\u3093");w.push(p())}return e++,M=>{for(let S of w)S(M)}}if(y.t==="name"&&(y.v==="float"||y.v==="int")){e++;let w=y.v==="int",M=[];for(;;){let S=t[e++];if(S.t!=="var")throw new on("\u5909\u6570\u540D\uFF08$\u2026\uFF09\u304C\u5FC5\u8981\u3067\u3059");n.set(S.v,w?"int":"float");let C=h(S);if(o("=")){e++;let _=u();M.push(E=>C.set(E,_.f(E)))}else M.push(_=>C.set(_,0));if(!o(","))break;e++}return a(";"),S=>{for(let C of M)C(S)}}if(y.t==="name"&&y.v==="if"){e++,a("(");let w=u();a(")");let M=p(),S=null;return r().t==="name"&&r().v==="else"&&(e++,S=p()),C=>{w.f(C)?M(C):S&&S(C)}}if(y.t==="name"&&y.v==="while"){e++,a("(");let w=u();a(")");let M=p();return S=>{let C=0;for(;w.f(S);){if(++C>Sd)throw new on("\u7E70\u308A\u8FD4\u3057\u304C\u591A\u3059\u304E\u307E\u3059");M(S)}}}if(y.t==="name"&&y.v==="for"){e++,a("(");let w=o(";")?null:u();a(";");let M=o(";")?null:u();a(";");let S=o(")")?null:u();a(")");let C=p();return _=>{let E=0;for(w&&w.f(_);!M||M.f(_);S&&S.f(_)){if(++E>Sd)throw new on("\u7E70\u308A\u8FD4\u3057\u304C\u591A\u3059\u304E\u307E\u3059");C(_)}}}let v=u();return r().t!=="end"&&a(";"),w=>{v.f(w)}}let b=[];for(;r().t!=="end";)b.push(p());return{outputs:[...s].sort((y,v)=>y-v),run(y){let v={vars:new Map,out:new Map,input:y.input,frame:y.frame,time:y.time};for(let w of b)w(v);return v}}}function Jo(i){if(!Array.isArray(i)||i.length<6)return null;let t=0,e=Math.round(i[t++]);t++;let n=Math.round(i[t++]),s=Math.round(i[t++])===1,r=Math.round(i[t++]),o=Math.round(i[t++]),a=i.slice(t,t+o);t+=o;let l=Math.round(i[t++]),c=r+(s?1:0),h=[],u=[];for(let f=0;f<l;f++){let g=t+f*c;h.push(new A(i[g],i[g+1],r>=3?i[g+2]:0)),u.push(s?i[g+r]:1)}if(e<1||h.length<e+1||a.length<1)return null;let d=[a[0],...a,a[a.length-1]];return Td(e,n,d,h,s?u:null)}function Td(i,t,e,n,s=null){return{isCurve:!0,degree:i,form:t,knots:e,cvs:n,weights:s}}function ii(i,t){return Td(i.degree,i.form,i.knots,t,i.weights)}function ws(i){let t=i.cvs.length;return[i.knots[i.degree],i.knots[t]]}function pr(i,t,e=new A){let{degree:n,knots:s,cvs:r,weights:o}=i,a=r.length,[l,c]=ws(i);t=Math.min(Math.max(t,l),c);let h=n;for(;h<a-1&&s[h+1]<=t;)h++;let u=[];for(let f=0;f<=n;f++){let g=r[h-n+f],x=o?o[h-n+f]:1;u.push([g.x*x,g.y*x,g.z*x,x])}for(let f=1;f<=n;f++)for(let g=n;g>=f;g--){let x=h-n+g,m=s[x+n-f+1]-s[x],p=m>1e-12?(t-s[x])/m:0;for(let b=0;b<4;b++)u[g][b]=(1-p)*u[g-1][b]+p*u[g][b]}let d=u[n];return e.set(d[0]/d[3],d[1]/d[3],d[2]/d[3])}function Ss(i,t=32){let[e,n]=ws(i),s=Math.max(1,i.cvs.length-i.degree),r=Math.max(16,s*t),o=[],a=[0];for(let l=0;l<=r;l++)o.push(pr(i,e+(n-e)*(l/r))),l>0&&a.push(a[l-1]+o[l].distanceTo(o[l-1]));return{pts:o,len:a,total:a[a.length-1]}}function Cd(i){return Ss(i).total}function Rd(i,t,e=new A){let{pts:n,len:s}=i;if(t<=0)return e.copy(n[0]);if(t>=i.total)return e.copy(n[n.length-1]);let r=0,o=s.length-1;for(;o-r>1;){let l=r+o>>1;s[l]<=t?r=l:o=l}let a=(t-s[r])/Math.max(s[o]-s[r],1e-12);return e.lerpVectors(n[r],n[o],a)}function Pd(i,t,e,n=0){let{pts:s}=i;for(let r=Math.max(0,n);r<s.length-1;r++){let o=s[r],a=s[r+1];if(a.distanceTo(t)<e)continue;let l=new A().subVectors(a,o),c=new A().subVectors(o,t),h=l.dot(l),u=2*c.dot(l),d=c.dot(c)-e*e,f=Math.max(0,u*u-4*h*d),g=h>1e-12?(-u+Math.sqrt(f))/(2*h):0;return{point:o.clone().addScaledVector(l,Math.min(1,Math.max(0,g))),seg:r}}return null}var yn=Math.PI/180,we=180/Math.PI,kt=1e-9,N_=["xyz","yzx","zxy","xzy","yxz","zyx"],ri=N_.map(i=>i.split("").reverse().join("").toUpperCase()),Qt=["x","y","z"],Qo=["r","g","b"],ic=["x","y"],gr=["x","y","z","w"],Ri=new it,Li={multiplyDivide:{i1:[0,0,0],i2:[1,1,1],op:1},plusMinusAverage:{op:1},reverse:{i:[0,0,0]},condition:{ft:0,st:0,op:0,ct:[0,0,0],cf:[1,1,1]},blendColors:{c1:[1,0,0],c2:[0,0,1],b:.5},pairBlend:{w:1,it1:[0,0,0],it2:[0,0,0],ir1:[0,0,0],ir2:[0,0,0],ri:0},unitConversion:{i:0,cf:1},ikHandle:{pv:[0,0,1],twi:0,ikb:1},scaleConstraint:{o:[1,1,1]},aimConstraint:{a:[1,0,0],u:[0,1,0],wu:[0,1,0],wut:3,o:[0,0,0]},decomposeMatrix:{ro:0},composeMatrix:{it:[0,0,0],ir:[0,0,0],is:[1,1,1],ish:[0,0,0],iro:0,uer:1},quatToEuler:{iq:[0,0,0,1],iro:0},eulerToQuat:{irt:[0,0,0],iro:0},quatProd:{iq1:[0,0,0,1],iq2:[0,0,0,1]},quatInvert:{iq:[0,0,0,1]},quatNormalize:{iq:[0,0,0,1]},quatSlerp:{iq1:[0,0,0,1],iq2:[0,0,0,1],it:0},displayLayer:{v:1,dt:0,e:1},addDoubleLinear:{i1:0,i2:0},multDoubleLinear:{i1:1,i2:1},clamp:{ip:[0,0,0],mn:[0,0,0],mx:[0,0,0]},setRange:{v:[0,0,0],n:[0,0,0],m:[0,0,0],on:[0,0,0],om:[0,0,0]},remapValue:{i:0,imn:0,imx:1,omn:0,omx:1},distanceBetween:{p1:[0,0,0],p2:[0,0,0]},vectorProduct:{i1:[0,0,0],i2:[0,0,0],op:1,no:0},blendTwoAttr:{ab:0},blendWeighted:{},choice:{s:0},animBlendNodeAdditiveDL:{ia:0,ib:0,wa:1,wb:1},animBlendNodeAdditiveDA:{ia:0,ib:0,wa:1,wb:1},animBlendNodeAdditiveRotation:{ia:[0,0,0],ib:[0,0,0],wa:1,wb:1},animLayer:{w:1,m:0},cluster:{en:1},pointOnCurveInfo:{pr:0,top:0}};Li.ikHandle={...Li.ikHandle,roc:0,off:0,rol:0,dtce:0,dwut:0,dwua:0,dfa:0,dwuv:[0,1,0],dwve:[0,1,0]};var Ld={unitConversion:/^o$/,multiplyDivide:/^o[xyz]?$/,plusMinusAverage:/^o(1|2[xy]?|3[xyz]?)$/,reverse:/^o[xyz]?$/,condition:/^oc[rgb]?$/,blendColors:/^op[rgb]?$/,pairBlend:/^o[tr][xyz]?$/,pointConstraint:/^ct[xyz]?$/,poleVectorConstraint:/^ct[xyz]?$/,orientConstraint:/^cr[xyz]?$/,parentConstraint:/^c[tr][xyz]?$/,scaleConstraint:/^cs[xyz]?$/,aimConstraint:/^cr[xyz]?$/,quatToEuler:/^ort[xyz]?$/,eulerToQuat:/^oq[xyzw]?$/,quatProd:/^oq[xyzw]?$/,quatInvert:/^oq[xyzw]?$/,quatNormalize:/^oq[xyzw]?$/,quatSlerp:/^oq[xyzw]?$/,curveInfo:/^(al|arcLength)$/,nurbsCurve:/^(ws|worldSpace|l|local)(\[\d+\])?$/,skinCluster:/^og(\[\d+\])?$/,tweak:/^og(\[\d+\])?$/,groupParts:/^og$/,wire:/^og(\[\d+\])?$/,locator:/^(wp|worldPosition)(\[\d+\])?$/,expression:/^(out|output)\[\d+\]$/,addDoubleLinear:/^o$/,multDoubleLinear:/^o$/,clamp:/^op[rgb]?$/,setRange:/^o[xyz]?$/,remapValue:/^(ov|outValue)$/,distanceBetween:/^d$/,vectorProduct:/^o[xyz]?$/,blendTwoAttr:/^o$/,blendWeighted:/^o$/,choice:/^o$/,animBlendNodeAdditiveDL:/^o$/,animBlendNodeAdditiveDA:/^o$/,animBlendNodeAdditiveRotation:/^o[xyz]?$/,animLayer:/^fo$/,cluster:/^og(\[\d+\])?$/,pointOnCurveInfo:/^(p|n|t|nn|nt|cc)[xyz]?$|^cr$/,animCurveUA:/^(o|output)$/,animCurveUL:/^(o|output)$/,animCurveUU:/^(o|output)$/,multMatrix:/^o$/,decomposeMatrix:/^o(t|r|s|sh)[xyz]?$|^oq[xyzw]?$/,composeMatrix:/^omat$/,inverseMatrix:/^omat$/},Id=/^([trs][xyz]?|opm)$/;function Nd(i,t){switch(i){case"pairBlend":return/^ir[12][xyz]?$/.test(t);case"orientConstraint":case"aimConstraint":return/^o[xyz]?$/.test(t);case"composeMatrix":return/^ir[xyz]?$/.test(t);case"eulerToQuat":return/^irt[xyz]?$/.test(t);case"parentConstraint":return/^tg\[\d+\]\.tor[xyz]?$/.test(t);case"ikHandle":return t==="twi";case"animBlendNodeAdditiveDA":return/^i[ab]$/.test(t);case"animBlendNodeAdditiveRotation":return/^i[ab][xyz]?$/.test(t);default:return!1}}function Es(i,t){return i==="blendColors"&&(t==="c1"||t==="c2"||t==="op")||i==="condition"&&(t==="ct"||t==="cf"||t==="oc")||i==="clamp"&&/^(ip|mn|mx|op)$/.test(t)?Qo:i==="plusMinusAverage"&&/^(o2|i2\[\d+\])$/.test(t)?ic:/^(iq|iq1|iq2|oq)$/.test(t)?gr:Qt}var xr=new A,Ud=new A,Pi=new A,nc=new bt,Fd=new ve,Dd=new it;function Ve(i,t=new bt){return i.decompose(xr,t,Pi),t}function Se(i,t=new A){return t.setFromMatrixPosition(i)}function si(i,t=0,e=new bt){return e.setFromEuler(Fd.set(i[0]*yn,i[1]*yn,i[2]*yn,ri[t]||"ZYX"))}function mr(i,t=new bt){return t.setFromEuler(Fd.set(i[0],i[1],i[2],"ZYX"))}function Od(i){let t=new bt(0,0,0,0),e=i[0].q;for(let{q:n,w:s}of i){let r=n.dot(e)<0?-s:s;t.x+=n.x*r,t.y+=n.y*r,t.z+=n.z*r,t.w+=n.w*r}return t.normalize()}var kd=[];for(let i of[1,-1,0])for(let t of["handle","world","start"])for(let e of[1,-1])kd.push({twistSign:i,pvSpace:t,side:e});var U_={ikRPsolver:kd,ikSplineSolver:[{splineInterp:"angle"},{splineInterp:"lerp"}]};function D_(i){if(i.splineInterp)return i.splineInterp==="lerp"?"\u3072\u306D\u308A: up \u30D9\u30AF\u30C8\u30EB\u3092\u76F4\u7DDA\u3067\u88DC\u9593":"\u3072\u306D\u308A: \u89D2\u5EA6\u3067\u914D\u308B\uFF08\u4ECA\u306E\u89E3\u304D\u65B9\uFF09";let t={1:"\u3072\u306D\u308A \u4ECA\u306E\u5411\u304D","-1":"\u3072\u306D\u308A \u9006\u5411\u304D",0:"\u3072\u306D\u308A \u4F7F\u308F\u306A\u3044"}[i.twistSign],e={handle:"\u6975\u30D9\u30AF\u30C8\u30EB \u30CF\u30F3\u30C9\u30EB\u306E\u89AA\u306E\u7A7A\u9593",world:"\u6975\u30D9\u30AF\u30C8\u30EB \u30EF\u30FC\u30EB\u30C9\u7A7A\u9593",start:"\u6975\u30D9\u30AF\u30C8\u30EB \u958B\u59CB\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u89AA\u306E\u7A7A\u9593"}[i.pvSpace];return`${t}\u30FB${e}\u30FB\u8098 ${i.side===1?"\u6975\u30D9\u30AF\u30C8\u30EB\u306E\u5074":"\u53CD\u5BFE\u5074"}`}var ta=class{constructor(t,e,n){this.clip=t,this.sceneNodes=e,this.staticLocal=n,this.graph=(t.raw.graph||[]).slice(),this.byId=new Map(this.graph.map(a=>[a.id,a])),this.dagGraph=new Map;for(let a of this.graph)a.dag>=0&&this.dagGraph.set(a.dag,a);this.ikJoint=new Map;for(let a of this.graph)if(a.ik)for(let l of a.ik.chain.slice(0,-1))this.ikJoint.set(l,a.id);this.drivers=new Set,this.directDrivers=new Set;let s=a=>{this.directDrivers.add(a);for(let l=a;l>=0&&!this.drivers.has(l);l=e[l].parent)this.drivers.add(l)};for(let a of this.graph){a.ik&&(s(a.dag),e[a.dag].parent>=0&&this.directDrivers.add(e[a.dag].parent));for(let l of Object.values(a.inputs||{})){let c=l.node!==void 0?this.byId.get(l.node):null;c&&c.dag>=0&&s(c.dag)}}this.moving=new Set;let r=new Set;for(let a of t.entries){let l=this.dagGraph.get(a.node),c=l&&l.inputs?Object.keys(l.inputs).filter(h=>Id.test(h)):[];(a.channels.length||this.ikJoint.has(a.node)||c.length)&&this.moving.add(a.node),(a.channels.some(h=>h.base==="s")||c.some(h=>h[0]==="s"))&&r.add(a.node)}for(let a of t.entries)(a.rest.isNode??-1)>=0&&r.has(a.rest.isNode)&&this.moving.add(a.node);this.fallback=new Map((t.raw.fallback||[]).map(a=>[a.node,a]));for(let a of this.fallback.keys())this.moving.add(a);let o=new Set(t.raw.tainted||[]);this.tainted=new Set,e.forEach((a,l)=>{let c=a.inheritsTransform!==!1?a.parent:-1;(o.has(l)||c>=0&&this.tainted.has(c)&&!this.fallback.has(l))&&this.tainted.add(l)}),this.bindCache=new Map,this.matrices=new Map,this.splineRoots=new Set(this.graph.filter(a=>a.ik&&a.ik.solver==="ikSplineSolver"&&((a.attrs||{}).roc??0)>=.5).map(a=>a.ik.chain[0])),this.usesTime=this.graph.some(a=>a.type==="expression"&&/\b(frame|time)\b/.test(a.expr||"")),this.problems=new Set,this.ikVariant=null,this.frame=0,this.poseOf=()=>null,this.reset()}get hasGraph(){return this.graph.length>0}reset(){this.cache={chan:new Map,local:new Map,world:new Map,plug:new Map,out:new Map,ik:new Map},this.busy=new Set}evaluate(t,e=()=>null,n=this.matrices){this.frame=t,this.poseOf=e,this.reset();for(let s of this.moving){let r=n.get(s)||new it;r.copy(this.localFile(s)),n.set(s,r)}return n}guard(t,e,n){if(this.busy.has(t))return this.problems.add(`\u5FAA\u74B0: ${t}`),n();this.busy.add(t);try{return e()}finally{this.busy.delete(t)}}rest(t){let e=this.clip.byNode.get(t);return e?e.rest:null}parentWorld(t){let e=this.sceneNodes[t];return e.parent>=0&&e.inheritsTransform!==!1?this.world(e.parent):Ri}chan(t,e="full"){let n=`${e}:${t}`,s=this.cache.chan.get(n);if(s)return s;let r=this.rest(t),o=r?{...r,t:r.t.slice(),r:r.r.slice(),s:r.s.slice()}:null;if(!o)return null;let a=this.guard(`chan ${n}`,()=>{let l=this.clip.byNode.get(t),c=new Set;for(let u of l.channels)e==="t"&&u.base!=="t"||(o[u.base][u.axis]=dr(u.curve,this.frame),c.add(u.attr));let h=this.dagGraph.get(t);if(h&&h.inputs)for(let[u,d]of Object.entries(h.inputs)){if(u==="opm"&&e!=="t"){let m=this.source(d);m&&m.isMatrix4?o.opm=m.toArray():Array.isArray(m)&&m.length===16&&(o.opm=m.slice());continue}let f=u[0];if(!/^[trs][xyz]?$/.test(u)||e==="t"&&f!=="t"||c.has(u))continue;let g=this.source(d);if(g===void 0)continue;let x=f==="r"?we:1;if(u.length===1){if(Array.isArray(g))for(let m=0;m<3;m++)c.has(f+Qt[m])||(o[f][m]=g[m]*x)}else typeof g=="number"&&(o[f][Qt.indexOf(u[1])]=g*x)}if(this.ikJoint.has(t)&&(e==="full"||e==="t"&&this.splineRoots.has(t))){let u=this.solveIK(this.ikJoint.get(t)),d=u&&u.get(t);Array.isArray(d)?e==="full"&&(o.r=d):d&&(d.t&&(o.t=d.t),d.r&&e==="full"&&(o.r=d.r))}return o},()=>o);return this.cache.chan.set(n,a),a}localFile(t){let e=this.cache.local.get(t);if(e)return e;let n=this.fallback.get(t);if(n){let l=n.anchor>=0?this.world(n.anchor).clone().multiply(this.bindWorld(n.anchor).clone().invert()).multiply(this.bindWorld(t)):this.bindWorld(t).clone(),c=this.parentWorld(t).clone().invert().multiply(l);return this.cache.local.set(t,c),c}let s=this.rest(t);if(!s||!this.moving.has(t))return this.staticLocal(t);let r=this.chan(t,"full"),o=null;s.joint&&(s.isScale||(s.isNode??-1)>=0)&&(o=s.isNode>=0&&this.rest(s.isNode)?this.chan(s.isNode,"full").s:s.isScale);let a=Wn(r,o,new it);return this.cache.local.set(t,a),a}world(t){let e=this.cache.world.get(t);if(e)return e;let n=this.guard(`world ${t}`,()=>{let s=this.localFile(t).clone(),r=this.poseOf(t);return r&&s.multiply(r),new it().multiplyMatrices(this.parentWorld(t),s)},()=>{let s=this.staticLocal(t);return new it().multiplyMatrices(this.parentWorld(t),s)});return this.cache.world.set(t,n),n}bindWorld(t){let e=this.bindCache.get(t);if(e)return e;let n=this.sceneNodes[t],s=new it().fromArray(n.bindMatrix||n.matrix),r=n.inheritsTransform!==!1?n.parent:-1,o=r>=0?this.bindWorld(r).clone().multiply(s):s;return this.bindCache.set(t,o),o}statusOf(t){return this.fallback.has(t)?"estimated":this.tainted.has(t)?"unknown":null}pivotPosition(t,e=new A){let n=(this.chan(t,"t")||{t:[0,0,0]}).t;return e.set(n[0],n[1],n[2]).applyMatrix4(this.parentWorld(t))}dagPlug(t,e){let n=this.rest(t),s=this.dagGraph.get(t),r=e.replace(/\[\d+\]$/,""),o=(a,l)=>l>=0?a[l]:a;if(/^[trs][xyz]?$/.test(r)){let a=r.length===2?Qt.indexOf(r[1]):-1,l=n?this.chan(t,r[0]==="t"?"t":"full"):null;return l?r[0]==="t"?o(l.t,a):r[0]==="r"?o(l.r.map(c=>c*yn),a):o(l.s,a):a>=0?r[0]==="s"?1:0:r[0]==="s"?[1,1,1]:[0,0,0]}switch(r){case"pm":case"parentMatrix":return this.parentWorld(t);case"pim":case"parentInverseMatrix":return this.parentWorld(t).clone().invert();case"wm":case"worldMatrix":return this.world(t);case"wim":case"worldInverseMatrix":return this.world(t).clone().invert();case"m":case"matrix":return this.localFile(t);case"rp":case"rpt":case"sp":case"spt":return n&&n[r]?n[r]:[0,0,0];case"jo":case"ra":return n&&n[r]?n[r].map(a=>a*yn):[0,0,0];case"ro":return n&&n.ro||0;case"opm":case"offsetParentMatrix":{let a=n?this.chan(t,"full"):null;return a&&a.opm?new it().fromArray(a.opm):new it}default:break}if(s){let a=this.plug(s.id,e);if(a!==void 0)return a}return 0}source(t){if(t.curve!==void 0){let n=this.clip.curves[t.curve];if(!n)return;let s=dr(n,this.frame);return n.type==="TA"?s*yn:s}let e=this.byId.get(t.node);if(e)return e.dag>=0?this.dagPlug(e.dag,t.attr):this.plug(t.node,t.attr)}plug(t,e){let n=`${t}.${e}`;if(this.cache.plug.has(n))return this.cache.plug.get(n);let s=this.guard(`plug ${n}`,()=>this.plugUncached(t,e),()=>{});return this.cache.plug.set(n,s),s}plugUncached(t,e){let n=this.byId.get(t),s=n.inputs||{};if(s[e])return this.source(s[e]);let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&s[r[1]]&&Es(n.type,r[1]).includes(r[2])){let a=this.source(s[r[1]]);return Array.isArray(a)?a[Es(n.type,r[1]).indexOf(r[2])]:void 0}if(Ld[n.type]&&Ld[n.type].test(e)){let a=this.outputs(t);return a?e in a?a[e]:a[e.replace(/\[\d+\]$/,"")]:void 0}let o=Es(n.type,e);if(o.some(a=>s[e+a])){let a=this.staticValue(n,e);return o.map((l,c)=>{let h=this.plug(t,e+l);return h!==void 0?h:Array.isArray(a)?a[c]:0})}return this.staticValue(n,e)}staticValue(t,e){let n=t.attrs||{},s=Nd(t.type,e)?yn:1,r=l=>Array.isArray(l)?l.map(c=>c*s):l*s;if(e in n)return r(n[e]);let o=/^(.*?)([xyzrgb])$/.exec(e);if(o&&Array.isArray(n[o[1]])){let l=Es(t.type,o[1]).indexOf(o[2]);if(l>=0)return n[o[1]][l]*(Nd(t.type,o[1])?yn:1)}let a=Es(t.type,e);if(a.some(l=>e+l in n)){let l=this.defaultValue(t.type,e);return a.map((c,h)=>(e+c in n?n[e+c]:Array.isArray(l)?l[h]:0)*s)}return this.defaultValue(t.type,e,s)}defaultValue(t,e,n=1){if(/^w\d+$/.test(e)||/\.tw$/.test(e))return 1;let s=Li[t]&&Li[t][e];if(s!==void 0)return Array.isArray(s)?s.map(o=>o*n):s*n;let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&Li[t]&&Array.isArray(Li[t][r[1]]))return Li[t][r[1]][Es(t,r[1]).indexOf(r[2])]*n}mat(t,e){let n=this.plug(t,e);return n&&n.isMatrix4?n:Array.isArray(n)&&n.length===16?new it().fromArray(n):new it}indices(t,e){let n=[...Object.keys(t.inputs||{}),...Object.keys(t.attrs||{})];return[...new Set(n.map(s=>e.exec(s)).filter(Boolean).map(s=>+s[1]))].sort((s,r)=>s-r)}num(t,e,n=0){let s=this.plug(t,e);return typeof s=="number"&&Number.isFinite(s)?s:n}vec(t,e,n=[0,0,0]){let s=this.plug(t,e);return Array.isArray(s)?n.map((r,o)=>Number.isFinite(s[o])?s[o]:r):n.slice()}outputs(t){if(this.cache.out.has(t))return this.cache.out.get(t);let e=this.guard(`out ${t}`,()=>this.outputsUncached(t),()=>null);return this.cache.out.set(t,e),e}outputsUncached(t){let e=this.byId.get(t),n=null;switch(e.type){case"unitConversion":n={o:this.num(t,"i")*this.num(t,"cf",1)};break;case"multiplyDivide":n=this.multiplyDivide(t);break;case"plusMinusAverage":n=this.plusMinusAverage(t);break;case"reverse":n=Jt("o",this.vec(t,"i").map(s=>1-s),Qt);break;case"condition":n=this.condition(t);break;case"blendColors":n=this.blendColors(t);break;case"pairBlend":n=this.pairBlend(t);break;case"pointConstraint":case"orientConstraint":case"parentConstraint":case"scaleConstraint":case"poleVectorConstraint":case"aimConstraint":n=this.constraint(e);break;case"multMatrix":{let s=new it;for(let r of this.indices(e,/^i\[(\d+)\]$/))s.premultiply(this.mat(t,`i[${r}]`));n={o:s};break}case"decomposeMatrix":{let s=new A,r=new bt,o=new A;this.mat(t,"imat").decompose(s,r,o);let a=new ve().setFromQuaternion(r,ri[Math.round(this.num(t,"ro",0))]||"ZYX");n={...Jt("ot",s.toArray(),Qt),...Jt("or",[a.x,a.y,a.z],Qt),...Jt("os",o.toArray(),Qt),...Jt("osh",[0,0,0],Qt),...Jt("oq",[r.x,r.y,r.z,r.w],["x","y","z","w"])};break}case"composeMatrix":{let s=this.vec(t,"it"),r=this.vec(t,"ir"),o=this.vec(t,"is",[1,1,1]),a;if(this.num(t,"uer",1)>=.5)a=new bt().setFromEuler(new ve(r[0],r[1],r[2],ri[Math.round(this.num(t,"iro",0))]||"ZYX"));else{let l=this.vec(t,"iq",[0,0,0,1]);a=new bt(l[0],l[1],l[2],l[3]??1).normalize()}n={omat:new it().compose(new A(...s),a,new A(...o))};break}case"inverseMatrix":n={omat:this.mat(t,"imat").clone().invert()};break;case"quatToEuler":{let s=new ve().setFromQuaternion(this.quat(t,"iq").normalize(),this.order(t,"iro"));n=Jt("ort",[s.x,s.y,s.z],Qt);break}case"eulerToQuat":{let s=this.vec(t,"irt"),r=new bt().setFromEuler(new ve(s[0],s[1],s[2],this.order(t,"iro")));n=Jt("oq",[r.x,r.y,r.z,r.w],gr);break}case"quatProd":{let s=this.quat(t,"iq2").multiply(this.quat(t,"iq1"));n=Jt("oq",[s.x,s.y,s.z,s.w],gr);break}case"quatInvert":case"quatNormalize":{let s=this.quat(t,"iq").normalize();e.type==="quatInvert"&&s.invert(),n=Jt("oq",[s.x,s.y,s.z,s.w],gr);break}case"quatSlerp":{let s=this.quat(t,"iq1").normalize().slerp(this.quat(t,"iq2").normalize(),this.num(t,"it",0));n=Jt("oq",[s.x,s.y,s.z,s.w],gr);break}case"curveInfo":{let s=this.plug(t,"ic"),r=s&&s.isCurve?Cd(s):0;n={al:r,arcLength:r};break}case"nurbsCurve":n=this.curveOutputs(e);break;case"locator":{let s=Se(e.parent>=0?this.world(e.parent):Ri).toArray();n={wp:s,worldPosition:s};break}case"skinCluster":n=this.skinCurve(e);break;case"wire":n=this.wireCurves(e);break;case"cluster":n=this.clusterCurves(e);break;case"addDoubleLinear":n={o:this.num(t,"i1",0)+this.num(t,"i2",0)};break;case"multDoubleLinear":n={o:this.num(t,"i1",1)*this.num(t,"i2",1)};break;case"clamp":{let s=this.vec(t,"ip"),r=this.vec(t,"mn"),o=this.vec(t,"mx");n=Jt("op",s.map((a,l)=>Math.min(Math.max(a,r[l]),o[l])),Qo);break}case"setRange":{let s=this.vec(t,"v"),r=this.vec(t,"n"),o=this.vec(t,"m"),a=this.vec(t,"on"),l=this.vec(t,"om");n=Jt("o",s.map((c,h)=>Math.abs(l[h]-a[h])<1e-12?r[h]:r[h]+(c-a[h])/(l[h]-a[h])*(o[h]-r[h])),Qt);break}case"remapValue":n=this.remapValue(e);break;case"pointOnCurveInfo":n=this.pointOnCurve(e);break;case"distanceBetween":{let s=new A(...this.vec(t,"p1")).applyMatrix4(this.mat(t,"im1")),r=new A(...this.vec(t,"p2")).applyMatrix4(this.mat(t,"im2"));n={d:s.distanceTo(r)};break}case"vectorProduct":{let s=new A(...this.vec(t,"i1")),r=new A(...this.vec(t,"i2")),o=Math.round(this.num(t,"op",1)),a;if(o===1){let l=s.dot(r);a=new A(l,l,l)}else o===2?a=s.clone().cross(r):o===3?a=s.clone().applyMatrix3(new Xt().setFromMatrix4(this.mat(t,"m"))):o===4?a=s.clone().applyMatrix4(this.mat(t,"m")):a=s.clone();this.num(t,"no",0)>=.5&&o!==1&&a.normalize(),n=Jt("o",a.toArray(),Qt);break}case"blendTwoAttr":{let s=this.num(t,"ab",0);n={o:this.num(t,"i[0]",0)*(1-s)+this.num(t,"i[1]",0)*s};break}case"blendWeighted":{let s=0;for(let r of this.indices(e,/^i\[(\d+)\]$/))s+=this.num(t,`i[${r}]`,0)*this.num(t,`w[${r}]`,1);n={o:s};break}case"choice":n={o:this.plug(t,`i[${Math.round(this.num(t,"s",0))}]`)};break;case"animBlendNodeAdditiveDL":case"animBlendNodeAdditiveDA":n={o:this.num(t,"ia",0)*this.num(t,"wa",1)+this.num(t,"ib",0)*this.num(t,"wb",1)};break;case"animBlendNodeAdditiveRotation":{let s=this.vec(t,"ia"),r=this.vec(t,"ib"),o=this.num(t,"wa",1),a=this.num(t,"wb",1);n=Jt("o",s.map((l,c)=>l*o+r[c]*a),Qt);break}case"animCurveUA":case"animCurveUL":case"animCurveUU":{let s=this.clip.curves[e.curve];if(!s)break;let r=dr(s,this.num(t,"i",0));n={o:e.type==="animCurveUA"?r*yn:r},n.output=n.o;break}case"animLayer":n={fo:this.num(t,"m",0)>=.5?0:this.num(t,"w",1)};break;case"expression":n=this.expression(e);break;case"tweak":{let s=this.plug(t,"ip[0].ig");n=s&&s.isCurve?{og:s}:null;break}case"groupParts":{let s=this.plug(t,"ig");n=s&&s.isCurve?{og:s}:null;break}default:break}return n}wireCurves(t){let e=t.id,n=this.indices(t,/^dw\[(\d+)\]$/).map(a=>{let l=this.plug(e,`dw[${a}]`),c=this.plug(e,`bw[${a}]`);if(!l||!l.isCurve||!c||!c.isCurve||l.cvs.length!==c.cvs.length)return null;let h=Ss(c,32).pts,u=Ss(l,32).pts;return{pb:h,pw:u,dds:this.num(e,`dds[${a}]`,1),sc:this.num(e,`sc[${a}]`,1)}}).filter(Boolean),s=this.num(e,"en",1),r=this.num(e,"rot",1),o={};for(let a of this.indices(t,/^ip\[(\d+)\]\.ig$/)){let l=this.plug(e,`ip[${a}].ig`);if(!l||!l.isCurve)continue;let c=(t.geom||{})[a],h=c>=0?this.world(c):Ri,u=h.clone().invert(),d=t.attrs||{},f=l.cvs.map((g,x)=>{let m=d[`wl[${a}].w[${x}]`],p=(typeof m=="number"?m:1)*s;if(!n.length||Math.abs(p)<kt)return g.clone();let b=g.clone().applyMatrix4(h),y=new A;for(let{pb:v,pw:w,dds:M,sc:S}of n){let C=1/0,_=0,E=0;for(let j=0;j<v.length-1;j++){let Z=xr.subVectors(v[j+1],v[j]),tt=Z.lengthSq(),F=tt>kt?Math.min(1,Math.max(0,Ud.subVectors(b,v[j]).dot(Z)/tt)):0,H=Ud.copy(v[j]).addScaledVector(Z,F).distanceToSquared(b);H<C&&(C=H,_=j,E=F)}let D=Math.sqrt(C);if(M<=kt||D>=M)continue;let V=D/M,Q=(1-V*V)*(1-V*V),I=new A().lerpVectors(v[_],v[_+1],E),U=new A().lerpVectors(w[_],w[_+1],E),N=new A().subVectors(v[_+1],v[_]).normalize(),W=new A().subVectors(w[_+1],w[_]).normalize(),G=new bt().slerp(new bt().setFromUnitVectors(N,W),Math.min(1,Math.max(0,r*Q))),z=new A().subVectors(b,I).multiplyScalar(1+(S-1)*Q).applyQuaternion(G);y.add(U.add(z).sub(b).multiplyScalar(Q))}return b.addScaledVector(y,p).applyMatrix4(u)});o[`og[${a}]`]=ii(l,f),o.og||(o.og=o[`og[${a}]`])}return o}clusterCurves(t){let e=t.id,n=this.mat(e,"ma").clone().multiply(this.mat(e,"pm")),s=this.num(e,"en",1),r=t.attrs||{},o={};for(let a of this.indices(t,/^ip\[(\d+)\]\.ig$/)){let l=this.plug(e,`ip[${a}].ig`);if(!l||!l.isCurve)continue;let c=(t.geom||{})[a],h=Array.isArray(r[`gm[${a}]`])?new it().fromArray(r[`gm[${a}]`]):c>=0?this.world(c):Ri,u=h.clone().invert().multiply(n).multiply(h),d=l.cvs.map((f,g)=>{let x=r[`wl[${a}].w[${g}]`],m=(typeof x=="number"?x:1)*s;return Math.abs(m)<kt?f.clone():f.clone().lerp(f.clone().applyMatrix4(u),m)});o[`og[${a}]`]=ii(l,d),o.og||(o.og=o[`og[${a}]`])}return o}pointOnCurve(t){let e=t.id,n=this.plug(e,"ic");if(!n||!n.isCurve)return null;let[s,r]=ws(n),o=this.num(e,"pr",0);if(this.num(e,"top",0)>=.5){let v=Ss(n,64),w=Math.min(Math.max(o,0),1)*v.total,M=0;for(;M<v.len.length-2&&v.len[M+1]<w;)M++;let S=v.len[M+1]-v.len[M],C=S>kt?(w-v.len[M])/S:0;o=s+(r-s)*(M+C)/(v.pts.length-1)}o=Math.min(Math.max(o,s),r);let a=(r-s)*1e-4,l=v=>pr(n,Math.min(Math.max(v,s),r)),c=l(o),h=Math.max(o-a,s),u=Math.min(o+a,r),d=l(u).sub(l(h)).divideScalar(u-h),f=l(u).add(l(h)).sub(c.clone().multiplyScalar(2)).divideScalar(((u-h)/2)**2),g=d.clone().normalize(),x=f.clone().addScaledVector(g,-f.dot(g)),m=d.lengthSq(),p=m>kt?x.length()/m:0,b=p>kt?1/p:0,y=p>kt?c.clone().addScaledVector(x.clone().normalize(),b):c.clone();return{...Jt("p",c.toArray(),Qt),...Jt("t",d.toArray(),Qt),...Jt("nt",g.toArray(),Qt),...Jt("n",x.toArray(),Qt),...Jt("nn",x.clone().normalize().toArray(),Qt),...Jt("cc",y.toArray(),Qt),cr:b}}remapValue(t){let e=t.id,n=this.num(e,"imn",0),s=this.num(e,"imx",1),r=Math.abs(s-n)<1e-12?0:(this.num(e,"i",0)-n)/(s-n),o=t.attrs||{},a=this.indices(t,/^vl\[(\d+)\]/).map(d=>{let f=o[`vl[${d}]`],g=(x,m,p)=>(t.inputs||{})[`vl[${d}].${x}`]?this.num(e,`vl[${d}].${x}`,p):typeof o[`vl[${d}].${x}`]=="number"?o[`vl[${d}].${x}`]:Array.isArray(f)&&Number.isFinite(f[m])?f[m]:p;return{p:g("vp",0,0),v:g("fv",1,0),interp:Math.round(g("vi",2,1))}}).sort((d,f)=>d.p-f.p),l;if(!a.length)l=Math.min(1,Math.max(0,r));else if(r<=a[0].p)l=a[0].v;else if(r>=a[a.length-1].p)l=a[a.length-1].v;else{let d=0;for(;d<a.length-2&&a[d+1].p<=r;)d++;let f=a[d],g=a[d+1],x=(r-f.p)/Math.max(g.p-f.p,1e-12),m=f.interp===0?0:f.interp===1?x:x*x*(3-2*x);l=f.v+(g.v-f.v)*m}let c=this.num(e,"omn",0),h=this.num(e,"omx",1),u=c+l*(h-c);return{ov:u,outValue:u}}expression(t){if(t.program===void 0)try{t.program=Ad(t.expr||"")}catch(s){t.program=null,t.problem=s.message}if(!t.program)return this.problems.add(`expression ${t.name} \u3092\u89E3\u91C8\u3067\u304D\u307E\u305B\u3093: ${t.problem}`),null;let e;try{e=t.program.run({input:s=>this.num(t.id,`in[${s}]`,0),frame:this.frame,time:this.frame/(this.clip.fps||24)})}catch(s){return this.problems.add(`expression ${t.name}: ${s.message}`),null}let n={};for(let[s,r]of e.out)Number.isFinite(r)&&(n[`out[${s}]`]=r);return n}quat(t,e){let n=this.vec(t,e,[0,0,0,1]);return new bt(n[0],n[1],n[2],n[3])}order(t,e){return ri[Math.round(this.num(t,e,0))]||"ZYX"}curveOutputs(t){let e=null,n=t.inputs||{};if(n.cr){let l=this.source(n.cr);l&&l.isCurve&&(e=l)}if(e||(e=Jo((t.attrs||{}).cc)),!e)return null;let s=e.cvs.map(l=>l.clone());for(let[l,c]of Object.entries(t.attrs||{})){let h=/^cp\[(\d+)\]$/.exec(l);h&&s[+h[1]]&&Array.isArray(c)&&s[+h[1]].add(new A(c[0],c[1],c[2]))}for(let[l,c]of Object.entries(n)){let h=/^cp\[(\d+)\](?:\.([xyz])v)?$/.exec(l);if(!h||!s[+h[1]])continue;let u=this.source(c);h[2]&&typeof u=="number"?s[+h[1]].setComponent(Qt.indexOf(h[2]),u):Array.isArray(u)&&s[+h[1]].set(u[0],u[1],u[2])}let r=ii(e,s),o=t.parent>=0?this.world(t.parent):Ri,a=ii(e,s.map(l=>l.clone().applyMatrix4(o)));return{l:r,local:r,ws:a,worldSpace:a}}skinCurve(t){let e=this.plug(t.id,"ip[0].ig");if(!e||!e.isCurve||!t.skin)return null;if(!t.weightsOf){t.weightsOf=new Map;for(let[c,h,u]of t.skin.weights)t.weightsOf.has(c)||t.weightsOf.set(c,[]),t.weightsOf.get(c).push([h,u])}let n=t.skin.gm?new it().fromArray(t.skin.gm):new it,s=n.clone().invert(),r=new Map,o=c=>{if(!r.has(c)){let u=(t.inputs||{})[`pm[${c}]`]?this.mat(t.id,`pm[${c}]`):new it().fromArray(t.skin.pm[String(c)]||new it().elements);r.set(c,this.mat(t.id,`ma[${c}]`).clone().multiply(u).multiply(n))}return r.get(c)},a=e.cvs.map((c,h)=>{let u=t.weightsOf.get(h);if(!u)return c.clone();let d=new A,f=0;for(let[g,x]of u)x!==0&&(d.addScaledVector(c.clone().applyMatrix4(o(g)),x),f+=x);return f>kt?d.divideScalar(f).applyMatrix4(s):c.clone()});return{og:ii(e,a)}}multiplyDivide(t){let e=this.vec(t,"i1"),n=this.vec(t,"i2",[1,1,1]),s=Math.round(this.num(t,"op",1)),r=e.map((o,a)=>s===1?o*n[a]:s===2?Math.abs(n[a])<kt?o:o/n[a]:s===3?o**n[a]:o);return Jt("o",r,Qt)}plusMinusAverage(t){let e=this.byId.get(t),n=Math.round(this.num(t,"op",1)),s=new Set([...Object.keys(e.inputs||{}),...Object.keys(e.attrs||{})]),r=f=>[...new Set([...s].map(g=>f.exec(g)).filter(Boolean).map(g=>+g[1]))].sort((g,x)=>g-x),o=f=>{if(!f.length)return 0;if(n===2)return f.slice(1).reduce((x,m)=>x-m,f[0]);let g=f.reduce((x,m)=>x+m,0);return n===3?g/f.length:n===0?f[0]:g},a=(f,g,x)=>{let m=`i${f}[${g}]`,p=this.plug(t,m);return x.map((b,y)=>{let v=this.plug(t,`${m}.i${f}${b}`);return typeof v=="number"?v:Array.isArray(p)?p[y]:0})},l=r(/^i1\[(\d+)\]$/).map(f=>this.num(t,`i1[${f}]`)),c=r(/^i2\[(\d+)\]/).map(f=>a(2,f,ic)),h=r(/^i3\[(\d+)\]/).map(f=>a(3,f,Qt)),u=[0,1].map(f=>o(c.map(g=>g[f]))),d=[0,1,2].map(f=>o(h.map(g=>g[f])));return{o1:o(l),...Jt("o2",u,ic),...Jt("o3",d,Qt)}}condition(t){let e=this.num(t,"ft"),n=this.num(t,"st"),s=Math.round(this.num(t,"op")),r=[e===n,e!==n,e>n,e>=n,e<n,e<=n][s]??!1;return Jt("oc",r?this.vec(t,"ct",[0,0,0]):this.vec(t,"cf",[1,1,1]),Qo)}blendColors(t){let e=this.vec(t,"c1",[1,0,0]),n=this.vec(t,"c2",[0,0,1]),s=this.num(t,"b",.5);return Jt("op",e.map((r,o)=>r*s+n[o]*(1-s)),Qo)}pairBlend(t){let e=this.num(t,"w",1),n=this.byId.get(t),s=n.inputs||{},r=n.attrs||{},o=(x,m,p)=>{let b=this.vec(t,`${x}${m}`);return Qt.map((y,v)=>{let w=`${x}${y}${m}`;return s[w]?this.num(t,w,0):typeof r[w]=="number"?r[w]*(p?yn:1):b[v]})},a=o("it",1,!1),l=o("it",2,!1),c=o("ir",1,!0),h=o("ir",2,!0),u=x=>Math.round(this.num(t,x,0)),d=(x,m,p)=>p===1?x:p===2?m:x*(1-e)+m*e,f=Qt.map((x,m)=>d(a[m],l[m],u(`t${x}m`))),g;if(Math.round(this.num(t,"ri",0))===1){let x=mr(c).slerp(mr(h,new bt),e),m=new ve().setFromQuaternion(x,"ZYX");g=[m.x,m.y,m.z]}else g=Qt.map((x,m)=>d(c[m],h[m],u(`r${x}m`)));return{...Jt("ot",f,Qt),...Jt("or",g,Qt)}}constraint(t){let e=t.id,n=[];for(let d of t.targets||[]){let f=this.byId.get(d.node);if(!f||f.dag<0)continue;let g=this.num(e,`tg[${d.index}].tw`,1);g>0&&n.push({ni:f.dag,index:d.index,w:g})}let s=n.reduce((d,f)=>d+f.w,0);if(s<=kt)return null;let r=t.driven,o=r>=0?this.parentWorld(r):Ri,a=o.clone().invert(),l=d=>{let f=this.rest(d),g=f&&f.rp?f.rp:[0,0,0];return new A(g[0],g[1],g[2]).applyMatrix4(this.world(d))},c=d=>{let f=new A;for(let g of n)f.addScaledVector(d(g),g.w/s);return f},h=d=>{let f=d.clone().applyMatrix4(a),g=t.type==="pointConstraint"?this.vec(e,"o"):[0,0,0],x=this.vec(e,"crp"),m=this.vec(e,"crt");return[f.x+g[0]-x[0]-m[0],f.y+g[1]-x[1]-m[1],f.z+g[2]-x[2]-m[2]]},u=d=>{let f=Ve(o).invert().multiply(d);return this.localEuler(r,f).map(g=>g*yn)};switch(t.type){case"pointConstraint":return Jt("ct",h(c(d=>l(d.ni))),Qt);case"poleVectorConstraint":{let d=c(m=>l(m.ni)),f=t.pivot>=0?this.pivotPosition(t.pivot):new A,g=d.sub(f),x=new it().extractRotation(a);return Jt("ct",g.applyMatrix4(x).toArray(),Qt)}case"orientConstraint":{let d=this.vec(e,"o"),f=Od(n.map(g=>({q:Ve(this.world(g.ni)),w:g.w})));return Jt("cr",u(f.multiply(mr(d))),Qt)}case"parentConstraint":{let d=n.map(x=>{let m=this.vec(e,`tg[${x.index}].tot`),p=this.vec(e,`tg[${x.index}].tor`);return{m:this.world(x.ni).clone().multiply(Dd.makeTranslation(m[0],m[1],m[2])).multiply(Dd.makeRotationFromQuaternion(mr(p,nc))),w:x.w}}),f=new A;for(let{m:x,w:m}of d)f.addScaledVector(Se(x,xr.clone()),m/s);let g=Od(d.map(({m:x,w:m})=>({q:Ve(x),w:m})));return{...Jt("ct",h(f),Qt),...Jt("cr",u(g),Qt)}}case"aimConstraint":{let d=this.rest(r)||{},f=r>=0?this.chan(r,"t").t:[0,0,0],g=(_,E)=>E?[_[0]+E[0],_[1]+E[1],_[2]+E[2]]:_,x=new A(...g(g(f,d.rp),d.rpt)).applyMatrix4(o),m=c(_=>l(_.ni)).sub(x);if(m.lengthSq()<kt)return null;m.normalize();let p=new A(...this.vec(e,"a",[1,0,0])).normalize(),b=new A(...this.vec(e,"u",[0,1,0])),y=Math.round(this.num(e,"wut",3)),v=new A(...this.vec(e,"wu",[0,1,0])),w=null;y===0?w=(this.clip.raw.upAxis||"y")==="z"?new A(0,0,1):new A(0,1,0):y===1?w=Se(this.mat(e,"wum")).sub(x):y===2?w=v.clone().applyMatrix4(new it().extractRotation(this.mat(e,"wum"))):y===3&&(w=v);let M,S=b.clone().addScaledVector(p,-b.dot(p)),C=w?w.clone().addScaledVector(m,-w.dot(m)):null;if(!w||S.lengthSq()<kt||C.lengthSq()<kt)M=new bt().setFromUnitVectors(p,m);else{let _=(E,D)=>new it().makeBasis(E,D,E.clone().cross(D));S.normalize(),C.normalize(),M=new bt().setFromRotationMatrix(_(m,C).multiply(_(p,S).transpose()))}return Jt("cr",u(M.multiply(mr(this.vec(e,"o")))),Qt)}case"scaleConstraint":{let d=c(g=>(this.world(g.ni).decompose(xr,nc,Pi),Pi.clone()));o.decompose(xr,nc,Pi);let f=this.vec(e,"o",[1,1,1]);return Jt("cs",[d.x/(Pi.x||1)*f[0],d.y/(Pi.y||1)*f[1],d.z/(Pi.z||1)*f[2]],Qt)}default:return null}}localEuler(t,e){let n=this.rest(t)||{joint:!1,ro:0},s=e.clone();n.joint&&n.jo&&(s=si(n.jo,0).invert().multiply(s)),n.ra&&s.multiply(si(n.ra,0).invert());let r=new ve().setFromQuaternion(s,ri[n.ro||0]||"ZYX");return[r.x*we,r.y*we,r.z*we]}solveIK(t){if(this.cache.ik.has(t))return this.cache.ik.get(t);let e=this.guard(`ik ${t}`,()=>this.solveIKUncached(t),()=>null);return this.cache.ik.set(t,e),e}solveIKUncached(t){let e=this.byId.get(t);if(e.ik.solver==="ikSplineSolver")return this.solveSpline(t);if(e.ik.chain.length===2)return this.solveOneBone(t);if(e.ik.chain.length>3)return this.solveChain(t);let[n,s,r]=e.ik.chain,o=e.ik.solver==="ikSCsolver";if(!this.rest(n)||!this.rest(s))return null;let a=this.parentWorld(n),l=this.chan(n,"fk"),c=this.chan(s,"fk"),h=Wn(l,this.isScaleOf(n),new it),u=Wn(c,this.isScaleOf(s),new it),d=(this.chan(r,"t")||{t:[0,0,0]}).t,f=new it().multiplyMatrices(a,h),g=new it().multiplyMatrices(f,u),x=Se(f),m=Se(g),p=new A(d[0],d[1],d[2]).applyMatrix4(g),b=m.distanceTo(x),y=p.distanceTo(m);if(b<kt||y<kt)return null;let v=new A().subVectors(m,x).cross(new A().subVectors(p,m)),w=this.dagGraph.get(s)&&this.dagGraph.get(s).attrs&&this.dagGraph.get(s).attrs.pa;v.lengthSq()<kt*b*y&&Array.isArray(w)&&(u=Wn({...c,r:w},this.isScaleOf(s),new it),g=new it().multiplyMatrices(f,u),p=new A(d[0],d[1],d[2]).applyMatrix4(g),v=new A().subVectors(m,x).cross(new A().subVectors(p,m)));let M=e.dag,S=Se(this.world(M)),C=new A().subVectors(S,x),_=C.length();if(_<kt)return null;C.divideScalar(_);let E=o?[0,0,0]:this.vec(t,"pv",[0,0,1]),D=new it().extractRotation(this.pvSpace(M,n)),V=new A(E[0],E[1],E[2]).applyMatrix4(D),Q=V.clone().addScaledVector(C,-V.dot(C));Q.lengthSq()<kt&&(Q=new A().subVectors(m,x).addScaledVector(C,-new A().subVectors(m,x).dot(C))),Q.lengthSq()<kt&&(Q=new A(0,1,0).cross(C).lengthSq()>kt?new A(0,1,0).cross(C):new A(1,0,0).cross(C)),Q.normalize(),!o&&this.ikVariant&&this.ikVariant.side===-1&&Q.negate();let I=o?0:this.num(t,"twi",0)*this.twistSign();Math.abs(I)>kt&&Q.applyQuaternion(new bt().setFromAxisAngle(C,I));let U=Math.min(Math.max(_,Math.abs(b-y)),b+y),N=Math.min(1,Math.max(-1,(b*b+U*U-y*y)/(2*b*U))),W=Math.sqrt(Math.max(0,1-N*N)),G=x.clone().addScaledVector(C,b*N).addScaledVector(Q,b*W),z=x.clone().addScaledVector(C,U),j=new A().subVectors(m,x).normalize(),Z=new A().subVectors(G,x).normalize(),tt=new A().subVectors(G,x).cross(new A().subVectors(z,G));tt.lengthSq()<kt&&(tt=Q.clone().cross(C)),tt.normalize(),v.lengthSq()<kt?v=tt.clone():v.normalize();let F=(_t,ne)=>new it().makeBasis(_t,ne,_t.clone().cross(ne)),H=new bt().setFromRotationMatrix(F(Z,tt).multiply(F(j,v).transpose())),J=Ve(f),k=H.clone().multiply(J),et=new A().subVectors(p,m).normalize().applyQuaternion(H),gt=new A().subVectors(z,G).normalize(),wt=Math.atan2(tt.dot(et.clone().cross(gt)),et.dot(gt)),Gt=new bt().setFromAxisAngle(tt,wt).multiply(H).multiply(Ve(g)),X=Ve(a),me=this.localEuler(n,X.clone().invert().multiply(k)),At=this.localEuler(s,k.clone().invert().multiply(Gt)),Ut=this.num(t,"ikb",1);if(Ut<1-kt){let _t=(ne,Ft,P)=>{let T=ri[(this.rest(P)||{}).ro||0],q=si(ne,(this.rest(P)||{}).ro||0).slerp(si(Ft,(this.rest(P)||{}).ro||0),Math.max(0,Ut)),rt=new ve().setFromQuaternion(q,T);return[rt.x*we,rt.y*we,rt.z*we]};me=_t(l.r,me,n),At=_t(c.r,At,s)}return new Map([[n,me],[s,At]])}solveOneBone(t){let e=this.byId.get(t),[n,s]=e.ik.chain;if(!this.rest(n))return null;let r=this.parentWorld(n),o=this.chan(n,"fk"),a=new it().multiplyMatrices(r,Wn(o,this.isScaleOf(n),new it)),l=(this.chan(s,"t")||{t:[0,0,0]}).t,c=Se(a),h=new A(l[0],l[1],l[2]).applyMatrix4(a),u=Se(this.world(e.dag)),d=h.sub(c),f=u.sub(c);if(d.lengthSq()<kt||f.lengthSq()<kt)return null;let g=new bt().setFromUnitVectors(d.normalize(),f.normalize()),x=this.localEuler(n,Ve(r).invert().multiply(g.multiply(Ve(a)))),m=this.num(t,"ikb",1);if(m<1-kt){let p=(this.rest(n)||{}).ro||0,b=new ve().setFromQuaternion(si(o.r,p).slerp(si(x,p),Math.max(0,m)),ri[p]);x=[b.x*we,b.y*we,b.z*we]}return new Map([[n,x]])}fkChain(t){let e=this.parentWorld(t[0]),n=[],s=e;return t.forEach((r,o)=>{let a=o===t.length-1?this.chan(r,"t"):this.chan(r,"fk");s=new it().multiplyMatrices(s,Wn(a,this.isScaleOf(r),new it)),n.push(s)}),{P:e,W:n,pos:n.map(r=>Se(r))}}ikLocals(t,e,n,s){let r=this.num(t,"ikb",1),o=new Map,a=Ve(n);return s.forEach((l,c)=>{let h=e[c],u=this.localEuler(h,a.clone().invert().multiply(l));if(r<1-kt){let d=(this.rest(h)||{}).ro||0,f=new ve().setFromQuaternion(si(this.chan(h,"fk").r,d).slerp(si(u,d),Math.max(0,r)),ri[d]);u=[f.x*we,f.y*we,f.z*we]}o.set(h,u),a=l}),o}rotateAlong(t,e,n,s=null){let{W:r,pos:o}=t,a=[],l=n.clone();for(let c=0;c<e.length-1;c++){let h=Ve(r[c]),u=l.clone().multiply(h),d=new A().subVectors(o[c+1],o[c]).normalize().applyQuaternion(l),f=new A().subVectors(e[c+1],e[c]).normalize(),g=new bt().setFromUnitVectors(d,f).multiply(u),x=s?s(c):0;Math.abs(x)>kt&&(g=new bt().setFromAxisAngle(f,x).multiply(g)),a.push(g),l=g.clone().multiply(h.clone().invert())}return a}solveChain(t){let e=this.byId.get(t),n=e.ik.chain;if(n.some(w=>!this.rest(w)))return null;let s=this.fkChain(n),{pos:r}=s,o=r.length,a=[];for(let w=0;w<o-1;w++)a.push(r[w+1].distanceTo(r[w]));if(a.some(w=>w<kt))return null;let l=a.reduce((w,M)=>w+M,0),c=r[0],h=Se(this.world(e.dag)),u=new A().subVectors(h,c),d=u.length();if(d<kt)return null;u.divideScalar(d);let f=new A().subVectors(r[o-1],c).normalize(),g=new A;for(let w=1;w<o-1;w++){let M=new A().subVectors(r[w],c);g.add(M.addScaledVector(f,-M.dot(f)))}let x=null;if(e.ik.solver==="ikRPsolver"){let w=this.vec(t,"pv",[0,0,1]),M=new A(w[0],w[1],w[2]).applyMatrix4(new it().extractRotation(this.pvSpace(e.dag,n[0])));x=M.addScaledVector(u,-M.dot(u)),this.ikVariant&&this.ikVariant.side===-1&&x.negate()}if((!x||x.lengthSq()<kt)&&(x=g.clone().addScaledVector(u,-g.dot(u))),x.lengthSq()<kt&&(x=new A(0,1,0).cross(u).lengthSq()>kt?new A(0,1,0).cross(u):new A(1,0,0).cross(u)),x.normalize(),e.ik.solver==="ikRPsolver"){let w=this.num(t,"twi",0)*this.twistSign();Math.abs(w)>kt&&x.applyQuaternion(new bt().setFromAxisAngle(u,w))}let m=g.lengthSq()>kt?g.clone().normalize().cross(f):null,p=x.clone().cross(u).normalize();(!m||m.lengthSq()<kt)&&(m=p.clone()),m.normalize();let b=(w,M)=>new it().makeBasis(w,M,w.clone().cross(M)),y=new bt().setFromRotationMatrix(b(u,p).multiply(b(f,m).transpose())),v=r.map(w=>w.clone().sub(c).applyQuaternion(y).add(c));if(d>=l){let w=0;for(let M=1;M<o;M++)w+=a[M-1],v[M]=c.clone().addScaledVector(u,w)}else for(let w=0;w<64;w++){v[o-1].copy(h);for(let M=o-2;M>=0;M--)v[M]=v[M+1].clone().add(v[M].clone().sub(v[M+1]).normalize().multiplyScalar(a[M]));v[0].copy(c);for(let M=1;M<o;M++)v[M]=v[M-1].clone().add(v[M].clone().sub(v[M-1]).normalize().multiplyScalar(a[M-1]));if(v[o-1].distanceTo(h)<l*1e-7)break}return this.ikLocals(t,n,s.P,this.rotateAlong(s,v,y))}solveSpline(t){let n=this.byId.get(t).ik.chain;if(n.some(b=>!this.rest(b)))return null;let s=this.plug(t,"ic");if(!s||!s.isCurve)return null;let r=this.fkChain(n),{pos:o}=r,a=o.length,l=[];for(let b=0;b<a-1;b++)l.push(o[b+1].distanceTo(o[b]));let c=Ss(s),h=this.num(t,"roc",0)>=.5,u,d=0;if(h){let b=Math.min(Math.max(this.num(t,"off",0),0),1)*c.total;for(u=Rd(c,b);d<c.len.length-2&&c.len[d+1]<b;)d++}else{u=o[0].clone();let b=1/0;c.pts.forEach((y,v)=>{let w=y.distanceToSquared(u);w<b&&(b=w,d=Math.max(0,v-1))})}let f=[u],g=new A().subVectors(c.pts[c.pts.length-1],c.pts[c.pts.length-2]).normalize();for(let b=0;b<a-1;b++){let y=Pd(c,f[b],l[b],d);y?(f.push(y.point),d=y.seg):f.push(f[b].clone().addScaledVector(g,l[b]))}let x=a-1,m;if(this.num(t,"dtce",0)>=.5&&Math.round(this.num(t,"dwut",0))!==7)m=this.splineAdvancedTwist(t,r,f,x);else{let b=this.num(t,"twi",0),y=this.num(t,"rol",0);m=this.rotateAlong(r,f,new bt,v=>(v===0?y:0)+(x>1?v===0?0:b/(x-1):b))}let p=this.ikLocals(t,n,r.P,m);if(h){let b=u.clone().applyMatrix4(r.P.clone().invert());p.set(n[0],{r:p.get(n[0]),t:b.toArray()})}return p}splineAdvancedTwist(t,e,n,s){let r=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],o=[[0,1,0],[0,-1,0],[0,1,0],[0,0,1],[0,0,-1],[0,0,1],[1,0,0],[-1,0,0],[1,0,0]],a=Math.round(this.num(t,"dwua",0)),l=a===2||a===5||a===8,c=new A(...r[Math.round(this.num(t,"dfa",0))]||r[0]),h=new A(...o[a]||o[0]),u=Math.round(this.num(t,"dwut",0)),d=(_,E)=>{let D=new A(...this.vec(t,_,[0,1,0]));return E?D.applyMatrix4(new it().extractRotation(this.mat(t,E))):D},f=_=>Se(this.mat(t,_)),g=(this.clip.raw.upAxis||"y")==="z"?new A(0,0,1):new A(0,1,0),x=[];for(let _=0;_<s;_++)x.push(new A().subVectors(n[_+1],n[_]).normalize());let m=(_,E)=>{let D=n[_];switch(u){case 1:return f("dwum").sub(D);case 2:return f(E?"dwum":"dwue").sub(D);case 3:return d("dwuv","dwum");case 4:return E?d("dwuv","dwum"):d("dwve","dwue");case 5:return d("dwuv");case 6:return d(E?"dwuv":"dwve");default:return g.clone()}},p=(_,E)=>(_.addScaledVector(E,-_.dot(E)),_.lengthSq()<kt?null:_.normalize()),b=new Array(s).fill(null);if((u===2||u===4||u===6)&&s>1&&this.ikVariant&&this.ikVariant.splineInterp==="lerp"){let _=m(0,!0),E=m(s-1,!1);for(let D=0;D<s;D++)b[D]=p(_.clone().lerp(E,D/(s-1)),x[D])}else if((u===2||u===4||u===6)&&s>1){let _=p(m(0,!0),x[0]),E=p(m(s-1,!1),x[s-1]);if(_){let D=[_.clone()];for(let N=1;N<s;N++)D.push(p(D[N-1].clone().applyQuaternion(new bt().setFromUnitVectors(x[N-1],x[N])),x[N])||D[N-1].clone());let V=D[s-1],Q=E?Math.atan2(x[s-1].dot(V.clone().cross(E)),V.dot(E)):0,I=[0];for(let N=1;N<s;N++)I.push(I[N-1]+n[N].distanceTo(n[N-1]));let U=I[s-1]||1;for(let N=0;N<s;N++)b[N]=D[N].clone().applyQuaternion(new bt().setFromAxisAngle(x[N],Q*I[N]/U))}}else for(let _=0;_<s;_++)b[_]=p(m(_,!0),x[_]);let y=(_,E)=>new it().makeBasis(_,E,_.clone().cross(E)),v=c.clone().normalize(),w=h.clone().addScaledVector(v,-h.dot(v)).normalize(),M=w.clone().negate(),S=l?this.rotateAlong(e,n,new bt):null,C=[];for(let _=0;_<s;_++){let E=x[_],D=b[_];if(!D){C.push(new bt().setFromUnitVectors(v,E));continue}let V=l&&w.clone().applyQuaternion(S[_]).dot(D)<0?M:w;C.push(new bt().setFromRotationMatrix(y(E,D).multiply(y(v,V).transpose())))}return C}pvSpace(t,e){let n=this.ikVariant?this.ikVariant.pvSpace:null;return n==="world"?Ri:n==="start"?this.parentWorld(e):this.parentWorld(t)}twistSign(){let t=this.ikVariant?this.ikVariant.twistSign:void 0;return typeof t=="number"?t:1}fileRestLocal(t){let e=this.rest(t);if(!e)return null;let n=this.dagGraph.get(t),s=n&&n.inputs?Object.keys(n.inputs):[];if(s.some(l=>/^r[xyz]?$/.test(l)))return null;let r=this.clip.byNode.get(t),o=new Set((r?r.channels:[]).map(l=>l.base)),a={...e};return o.has("r")&&(a.r=this.chan(t,"fk").r),(o.has("t")||s.some(l=>/^t[xyz]?$/.test(l)))&&(a.t=this.chan(t,"t").t),(o.has("s")||s.some(l=>/^s[xyz]?$/.test(l)))&&(a.s=this.chan(t).s),s.includes("opm")&&(a.opm=this.chan(t).opm),Wn(a,this.isScaleOf(t),new it)}compareChain(t,e,n){let s=t.ik.chain,r=[],o=this.parentWorld(s[0]),a=null,l=[];for(let d=0;d<s.length;d++){let f=s[d],g=e(f);if(!g)break;let x=o.clone().multiply(g);if(l.push(Se(x)),d===s.length-1){a=x;break}let m=this.world(f),p=Ve(x),y=Ve(m).clone().multiply(p.clone().invert());y.w<0&&(y.x=-y.x,y.y=-y.y,y.z=-y.z,y.w=-y.w);let v=2*Math.acos(Math.min(1,y.w))*we,w=e(s[d+1]),M=w?new A().setFromMatrixPosition(w).applyQuaternion(p).normalize():null,S=0,C=v;if(M&&M.lengthSq()>kt){let E=M.clone().multiplyScalar(new A(y.x,y.y,y.z).dot(M)),D=new bt(E.x,E.y,E.z,y.w).normalize();S=2*Math.atan2(new A(D.x,D.y,D.z).dot(M),D.w)*we,S>180&&(S-=360),S<-180&&(S+=360);let V=y.clone().multiply(D.clone().invert());C=2*Math.acos(Math.min(1,Math.abs(V.w)))*we}let _=Se(x).distanceTo(Se(m));r.push({node:f,name:this.sceneNodes[f].name,angle:v,roll:S,bend:C,position:_,ok:v<=n}),o=x}let c=Se(this.world(t.dag)),h=a?Se(a).distanceTo(c):null,u=null;if(t.ik.solver==="ikRPsolver"&&l.length===s.length&&s.length>=3){let d=l[0],f=c.clone().sub(d).normalize(),g=new A;for(let y=1;y<l.length-1;y++){let v=l[y].clone().sub(d);g.add(v.addScaledVector(f,-v.dot(f)))}let x=this.vec(t.id,"pv",[0,0,1]),m=new A(...x).applyMatrix4(new it().extractRotation(this.pvSpace(t.dag,s[0]))),p=m.addScaledVector(f,-m.dot(f));this.ikVariant&&this.ikVariant.side===-1&&p.negate();let b=this.num(t.id,"twi",0)*this.twistSign();Math.abs(b)>kt&&p.applyQuaternion(new bt().setFromAxisAngle(f,b)),g.lengthSq()>kt&&p.lengthSq()>kt&&(g.normalize(),p.normalize(),u=Math.atan2(f.dot(p.clone().cross(g)),p.dot(g))*we)}return{joints:r,reach:h,poleError:u,error:r.reduce((d,f)=>Math.max(d,f.angle),0)}}parentDrift(t,e,n){let s=[];for(let c=this.sceneNodes[t].parent;c>=0;c=this.sceneNodes[c].inheritsTransform!==!1?this.sceneNodes[c].parent:-1)s.unshift(c);if(!s.length)return null;let r=new it,o=null;for(let c of s){let h=this.localFile(c),u=this.rest(c)?e(c):this.staticLocal(c);if(u||(u=h),r=r.clone().multiply(u),!o){let d=Ve(h).clone().multiply(Ve(u).clone().invert()),f=2*Math.acos(Math.min(1,Math.abs(d.w)))*we,g=Se(h).distanceTo(Se(u));if(f>n||g>.001){let x=this.ikJoint.has(c)?this.byId.get(this.ikJoint.get(c)).name:null;o={name:this.sceneNodes[c].name,angle:f,position:g,ik:x}}}}let a=this.world(s[s.length-1]),l=Ve(a).clone().multiply(Ve(r).clone().invert());return{name:this.sceneNodes[s[s.length-1]].name,angle:2*Math.acos(Math.min(1,Math.abs(l.w)))*we,position:Se(a).distanceTo(Se(r)),firstBad:o}}verifySaved(t,e=.5){let n=[];for(let s of this.graph){if(!s.ik)continue;let r=this.compareChain(s,t,e),o=this.parentDrift(s.ik.chain[0],t,e),a=null;if(r.error>e&&r.joints.length){for(let c of U_[s.ik.solver]||[]){this.ikVariant=c,this.reset();let h=this.compareChain(s,t,e);(!a||h.error<a.error-1e-6)&&(a={variant:c,label:D_(c),error:h.error})}this.ikVariant=null,this.reset()}let l=s.ik.solver==="ikRPsolver"?new A(...this.vec(s.id,"pv",[0,0,1])).applyMatrix4(new it().extractRotation(this.parentWorld(s.dag))).toArray():null;n.push({handle:s.name,solver:s.ik.solver,chain:s.ik.chain.map(c=>this.sceneNodes[c].name),pv:l,twist:this.num(s.id,"twi",0)*we,joints:r.joints,reach:r.reach,poleError:r.poleError,parent:o,error:r.error,best:a,ok:r.joints.every(c=>c.ok)})}return n}isScaleOf(t){let e=this.rest(t);return!e||!e.joint?null:(e.isNode??-1)>=0&&this.rest(e.isNode)?this.chan(e.isNode,"fk").s:e.isScale||null}driversOf(t){let e=this.fallback.get(t);if(e){let r=e.anchor>=0?this.sceneNodes[e.anchor].name:"\u30EF\u30FC\u30EB\u30C9";return[`\u63A8\u5B9A: ${(e.unresolved||[]).join("\u30FB")||"\u89AA\u306E\u4F4D\u7F6E"} \u3092\u6C42\u3081\u3089\u308C\u306A\u3044\u305F\u3081\u3001${r} \u304B\u3089\u306E\u76F8\u5BFE\u3092\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u5F62\u3067\u8868\u793A`]}let n=this.tainted.has(t)?["\u4E0D\u660E: \u672A\u5BFE\u5FDC\u306E\u30CE\u30FC\u30C9\u306E\u5F71\u97FF\u3067\u5024\u3092\u6C42\u3081\u3089\u308C\u307E\u305B\u3093\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u30FB\u65E2\u5B9A\u5024\u306E\u307E\u307E\uFF09"]:[],s=this.dagGraph.get(t);if(s&&s.inputs)for(let[r,o]of Object.entries(s.inputs)){if(!Id.test(r)||o.curve!==void 0)continue;let a=this.byId.get(o.node);a&&n.push(`${r} \u2190 ${a.name}\uFF08${a.type}\uFF09`)}if(this.ikJoint.has(t)){let r=this.byId.get(this.ikJoint.get(t));n.push(`r \u2190 ${r.name}\uFF08IK\uFF09`)}return n}};function Jt(i,t,e){let n={[i]:t};return e.forEach((s,r)=>{n[i+s]=t[r]}),n}var Qe=i=>document.getElementById(i);var As=i=>Number.isInteger(i)?String(i):i.toFixed(2),ea=class{constructor(t){if(this.app=t,this.clip=null,this.status="",this.keys=[],this.root=Qe("timeline"),!this.root)return;this.slider=Qe("tl-slider"),this.canvas=Qe("tl-keys");let e=(s,r,o)=>{let a=Qe(s);a&&a.addEventListener(r,o)};e("tl-play","click",()=>t.togglePlay()),e("tl-prev","click",()=>t.stepFrame(-1)),e("tl-next","click",()=>t.stepFrame(1)),e("tl-prev-key","click",()=>t.stepKey(-1)),e("tl-next-key","click",()=>t.stepKey(1)),e("tl-first","click",()=>t.goToEdge(-1)),e("tl-last","click",()=>t.goToEdge(1)),this.slider.addEventListener("input",()=>t.scrubTo(+this.slider.value)),e("tl-frame","change",s=>{let r=+s.target.value;Number.isFinite(r)?t.scrubTo(r):this.setFrame(t.frame)});let n=()=>t.setPlaybackRange(+Qe("tl-start").value,+Qe("tl-end").value);e("tl-start","change",n),e("tl-end","change",n);for(let s of["tl-frame","tl-start","tl-end"])e(s,"keydown",r=>{r.key==="Enter"&&r.target.blur()});new ResizeObserver(()=>this.drawKeys()).observe(this.slider)}setStatus(t){this.root&&(this.status=t||"",Qe("tl-status").textContent=this.status,this.updateVisibility())}setClip(t){if(this.root){this.clip=t,t&&(this.status="",Qe("tl-status").textContent="",this.setRange(t.start,t.end),Qe("tl-info").textContent=`${As(t.fps)} fps`,Qe("tl-info").title=`\u6642\u9593\u5358\u4F4D: ${t.raw.timeUnit||"?"}\uFF08\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u7BC4\u56F2 ${As(+t.raw.animStart)}\u301C${As(+t.raw.animEnd)}\uFF09`,this.setFrame(t.current)),this.root.classList.toggle("loading",!t);for(let e of this.root.querySelectorAll("button, input"))e.disabled=!t;this.updateVisibility()}}updateVisibility(){let t=!!(this.clip||this.status);this.root.hidden=!t,document.getElementById("viewport").classList.toggle("has-timeline",t),t&&this.drawKeys()}setRange(t,e){this.slider.min=String(t),this.slider.max=String(e),Qe("tl-start").value=As(t),Qe("tl-end").value=As(e),this.drawKeys()}setFrame(t){if(!this.root)return;this.slider.value=String(t);let e=Qe("tl-frame");document.activeElement!==e&&(e.value=As(t))}setPlaying(t){let e=Qe("tl-play");e&&(e.setAttribute("aria-pressed",t?"true":"false"),e.title=t?"\u505C\u6B62\uFF08Alt+V\uFF09":"\u518D\u751F\uFF08Alt+V\uFF09",e.setAttribute("aria-label",t?"\u505C\u6B62":"\u518D\u751F"),e.querySelector(".ic-play").style.display=t?"none":"",e.querySelector(".ic-pause").style.display=t?"":"none")}setKeys(t,e){this.keys=t||[],this.canvas&&(this.canvas.title=e||""),this.drawKeys()}drawKeys(){let t=this.canvas;if(!t||!this.clip||this.root.hidden)return;let e=t.clientWidth,n=t.clientHeight;if(!e||!n)return;let s=window.devicePixelRatio||1;(t.width!==Math.round(e*s)||t.height!==Math.round(n*s))&&(t.width=Math.round(e*s),t.height=Math.round(n*s));let r=t.getContext("2d");r.setTransform(s,0,0,s,0,0),r.clearRect(0,0,e,n);let o=this.clip.start,a=this.clip.end,l=Math.max(a-o,1e-9),c=u=>7+(u-o)/l*(e-2*7),h=[1,2,5,10,20,50,100,200,500,1e3].find(u=>(e-2*7)/(l/u)>=6)||1e3;r.fillStyle="rgba(142, 151, 161, 0.35)";for(let u=Math.ceil(o/h)*h;u<=a;u+=h)r.fillRect(Math.round(c(u)),n-4,1,4);r.fillStyle="#e5675b";for(let u of this.keys)u<o-1e-6||u>a+1e-6||r.fillRect(Math.round(c(u))-1,0,2,n)}};var O_=new Et(13883872),F_=new Et(8423053),k_=new Et(15903035),z_=16;function B_(i){let t=Jo(i.cc);if(!t)return null;if(!i.tweaks||!i.tweaks.length)return t;let e=t.cvs.map(n=>n.clone());for(let[n,s,r,o]of i.tweaks)e[n]&&e[n].add(new A(s,r,o));return ii(t,e)}function zd(i,t=[]){if(t.length=0,i.degree===1){for(let r of i.cvs)t.push(r.clone());return t}let[e,n]=ws(i),s=Math.max(8,(i.cvs.length-i.degree)*z_);for(let r=0;r<=s;r++)t.push(pr(i,e+(n-e)*(r/s)));return t}function Bd(i){let t=new Float32Array(i.length*3);return i.forEach((e,n)=>{t[n*3]=e.x,t[n*3+1]=e.y,t[n*3+2]=e.z}),t}var na=class{constructor(){this.items=[],this.byNode=new Map,this.visible=!0,this.hiddenNodes=null,this.selected=-1}clear(){for(let t of this.items)t.line.removeFromParent(),t.line.geometry.dispose(),t.line.material.dispose();this.items=[],this.byNode=new Map,this.selected=-1}build(t,e){this.clear(),(e||[]).forEach((n,s)=>{let r=B_(n),o=t.nodeObjects[n.transform];if(!r||!o)return;let a=new ie;a.setAttribute("position",new Ht(Bd(zd(r)),3));let l=n.display===1?F_:n.color?new Et().setRGB(n.color[0],n.color[1],n.color[2]):O_,c=new Je(a,new wn({color:l}));c.name=n.name,c.userData={curveIndex:s,nodeIndex:n.transform},c.matrixAutoUpdate=!1,o.add(c);let h={entry:n,line:c,base:r,color:l,node:n.transform,selfVisible:n.visibleSelf??n.visible!==!1};this.items[s]=h,this.byNode.has(n.transform)||this.byNode.set(n.transform,[]),this.byNode.get(n.transform).push(s)}),t.curveItems=this.items,this.apply()}setShape(t,e){let n=this.items[t];if(!n)return;let s=e&&e.isCurve?e:n.base;if(n.current===s)return;n.current=s;let r=Bd(zd(s)),o=n.line.geometry.getAttribute("position");o.array.length===r.length?(o.array.set(r),o.needsUpdate=!0):n.line.geometry.setAttribute("position",new Ht(r,3)),n.line.geometry.boundingSphere=null}setVisible(t){this.visible=t,this.apply()}setHiddenNodes(t){this.hiddenNodes=t,this.apply()}setSelected(t){this.selected=t,this.apply()}hasCurve(t){return this.byNode.has(t)}isShown(t){return this.visible&&t.selfVisible&&!(this.hiddenNodes&&this.hiddenNodes[t.node])}apply(){for(let t of this.items)t&&(t.line.visible=this.isShown(t),t.line.material.color.copy(t.node===this.selected?k_:t.color))}expandBox(t,e=null){for(let n of this.items){if(!n||!n.line.visible||e&&!e.has(n.node))continue;let s=n.line.geometry.getAttribute("position"),r=Math.max(1,Math.floor(s.count/16));for(let o=0;o<s.count;o+=r)t.expandByPoint(V_.fromBufferAttribute(s,o).applyMatrix4(n.line.matrixWorld))}return t}pick(t,e){let n=this.items.filter(o=>o&&o.line.visible).map(o=>o.line);if(!n.length)return{node:-1,distance:1/0};let s=t.params.Line.threshold;t.params.Line.threshold=e;let r=t.intersectObjects(n,!1);return t.params.Line.threshold=s,r.length?{node:r[0].object.userData.nodeIndex,distance:r[0].distance}:{node:-1,distance:1/0}}},V_=new A;var H_="1.0.0",Vd=Math.PI/180,Hd={shading:"smooth",wire:!1,skin:!0,joints:!1,xray:!0,grid:!0,curves:!0,axes:"selected",jointSize:1,weightMode:"off",textures:!0,alpha:"material",alphaStyle:"cutout",poseSource:"bind",lighting:"standard",mapView:"combined",maps:{normal:!0,roughness:!1,metalness:!1,ao:!1,emissive:!1,opacity:!1},normalFlipY:!1,tool:"select",space:"local",gizmoSize:1},G_=["select","translate","rotate","scale"],En=i=>i.toLocaleString("ja-JP"),ia=new A,oi=new A,sc=class{constructor(){this.settings={...Hd},this.data=null,this.built=null,this.selected=-1,this.picked=null,this.pose=null,this.maps=new Vo,this.edit=null,this.history=new $o(t=>this.applyPoseChanges(t)),this.history.onChange=t=>this.historyChanged(t),this.poseDirty=!1,this.gizmoDragging=!1,this.bridge=null,this.transfer=null,this.sceneRadius=50,this.clip=null,this.frame=0,this.playing=!1,this.sceneLoading=!1,this.pendingAnimation=null,this.ui=new Xo(this),this.timeline=new ea(this),this.ui.setHost(qo()?"qt":"browser"),this.ui.syncSettings(this.settings);try{this.initRenderer()}catch(t){this.renderer=null,this.ui.setEmpty(!1),this.ui.showError(`WebGL \u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
GPU \u30C9\u30E9\u30A4\u30D0\u3092\u66F4\u65B0\u3059\u308B\u304B\u3001\u74B0\u5883\u5909\u6570 QTWEBENGINE_CHROMIUM_FLAGS \u306B --ignore-gpu-blocklist \u3092\u6307\u5B9A\u3057\u3066\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002

`+String(t&&t.message||t))}this.bindEvents(),pd(t=>{this.bridge=t,t.jsReady&&t.jsReady(),this.historyChanged(this.history),this.onWarningsChanged(this.ui.warnings||[])})}initRenderer(){let t=document.getElementById("canvas");this.canvas=t,this.renderer=new Gs({canvas:t,antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setClearColor(0,0),this.scene=new mo,this.camera=new qe(35,1,.1,1e4),this.camera.position.set(28,21,28),this.scene.add(this.camera),this.scene.add(new wo(15002866,3880497,1.7));let e=new So(16777215,2);e.position.set(.4,.8,1),e.target.position.set(0,0,-1),this.camera.add(e,e.target),this.grid=null,this.updateGrid(new $e(new A(-10,0,-10),new A(10,10,10))),this.controls=new Io(this.camera,t),this.controls.mouseButtons={LEFT:xn.ROTATE,MIDDLE:xn.PAN,RIGHT:xn.DOLLY},this.controls.screenSpacePanning=!0,this.controls.enableDamping=!1,this.controls.zoomSpeed=1.2,this.controls.addEventListener("change",()=>this.requestRender()),this.poseFrame=new ce,this.poseFrame.name="__poseFrame",this.poseFrame.matrixAutoUpdate=!1,this.poseProxy=new ce,this.poseProxy.name="__poseProxy",this.poseFrame.add(this.poseProxy),this.scene.add(this.poseFrame),this.gizmo=new Fo(this.camera,t),this.gizmo.setSpace("local"),this.gizmo.setSize(Hd.gizmoSize),this.gizmo.addEventListener("change",()=>this.requestRender()),this.gizmo.addEventListener("dragging-changed",r=>{this.gizmoDragging=r.value,this.controls.enabled=!r.value,r.value?this.beginPoseEdit([this.selected],{translate:"\u79FB\u52D5",rotate:"\u56DE\u8EE2",scale:"\u30B9\u30B1\u30FC\u30EB"}[this.gizmo.mode]||"\u5909\u66F4"):(this.endPoseEdit(),this.syncGizmo())}),this.gizmo.addEventListener("objectChange",()=>this.onGizmoChange()),this.scene.add(this.gizmo),this.overlay=new Go,this.curves=new na,this.scene.add(this.overlay.group);let n=new ie;n.setAttribute("position",new Ht([0,0,0],3)),this.marker=new yo(n,new $s({color:15903035,size:10,sizeAttenuation:!1,depthTest:!1,transparent:!0})),this.marker.renderOrder=20,this.marker.visible=!1,this.marker.frustumCulled=!1,this.scene.add(this.marker),this.raycaster=new ds;let s=document.getElementById("viewport");new ResizeObserver(()=>this.resize()).observe(s),this.resize()}resize(){if(!this.renderer)return;let t=document.getElementById("viewport"),e=Math.max(1,t.clientWidth),n=Math.max(1,t.clientHeight);this.renderer.setSize(e,n,!1),this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.render()}requestRender(){this.renderPending||!this.renderer||(this.renderPending=!0,requestAnimationFrame(()=>{this.renderPending=!1,this.render()}))}render(){this.renderer&&this.renderer.render(this.scene,this.camera)}bindEvents(){if(this.canvas){let t=null;this.canvas.addEventListener("pointerdown",e=>{let n=!!(this.gizmo&&this.gizmo.object&&this.gizmo.axis!==null);t={x:e.clientX,y:e.clientY,b:e.button,onGizmo:n}}),this.canvas.addEventListener("pointerup",e=>{t&&!t.onGizmo&&!this.gizmoDragging&&t.b===0&&e.button===0&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<5&&this.pick(e),t=null}),this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}window.addEventListener("keydown",t=>{let e=t.target;if(e&&(e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"))return;let n=t.key.toLowerCase();if((t.ctrlKey||t.metaKey)&&!t.altKey){if(n==="h"&&!t.shiftKey)this.setNodeVisible(this.selected,!1);else if(n==="z"&&!t.shiftKey)this.undo();else if(n==="y"||n==="z"&&t.shiftKey)this.redo();else return;t.preventDefault();return}if(t.altKey&&!t.ctrlKey&&!t.metaKey&&this.hasTimeline){if(t.code==="KeyV")this.togglePlay();else if(t.code==="Comma")this.stepFrame(-1);else if(t.code==="Period")this.stepFrame(1);else return;t.preventDefault();return}if(t.ctrlKey||t.metaKey||t.altKey)return;if(this.hasTimeline&&(n===","||n==="."||n==="home"||n==="end")){n===","?this.stepKey(-1):n==="."?this.stepKey(1):this.goToEdge(n==="home"?-1:1),t.preventDefault();return}if(n==="h"){t.shiftKey?this.setNodeVisible(this.selected,!0):this.toggleNodeVisible(this.selected),t.preventDefault();return}if(n==="z"){t.shiftKey?this.redo():this.undo(),t.preventDefault();return}let s=(r,o)=>{this.setSetting(r,o),this.ui.syncSettings(this.settings)};if(n==="f")this.frameSelection();else if(n==="a")this.frameAll();else if(n==="escape")this.clearSelection();else if(n==="4")s("shading","none");else if(n==="5")s("shading","smooth"),s("textures",!1);else if(n==="6")s("shading","smooth"),s("textures",!0);else if(n==="j")s("joints",!this.settings.joints);else if(n==="q")s("tool","select");else if(n==="w")s("tool","translate");else if(n==="e")s("tool","rotate");else if(n==="r")s("tool","scale");else if(n==="+"||n==="="||n===";")s("gizmoSize",Math.min(4,this.settings.gizmoSize*1.25));else if(n==="-")s("gizmoSize",Math.max(.25,this.settings.gizmoSize/1.25));else return;t.preventDefault()}),qo()||(document.addEventListener("dragover",t=>{t.preventDefault(),document.body.classList.add("drag-over")}),document.addEventListener("dragleave",t=>{t.relatedTarget||document.body.classList.remove("drag-over")}),document.addEventListener("drop",t=>{t.preventDefault(),document.body.classList.remove("drag-over");let e=t.dataTransfer.files&&t.dataTransfer.files[0];e&&this.loadFile(e)})),window.addEventListener("error",t=>this.ui.setMessage("\u30A8\u30E9\u30FC: "+t.message,8e3))}log(t,e){this.bridge&&this.bridge.log&&this.bridge.log(t,String(e))}loadFile(t){if(/\.(ma|mb)$/i.test(t.name)){this.ui.showError(`${t.name} \u306F\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u76F4\u63A5\u8AAD\u3081\u307E\u305B\u3093\u3002
python -m ma_viewer export \u3067JSON\u306B\u5909\u63DB\u3059\u308B\u304B\u3001Qt\u7248\u306E\u30D3\u30E5\u30FC\u30A2\uFF08python -m ma_viewer\uFF09\u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002`);return}this.ui.showLoading(`${t.name} \u3092\u8AAD\u307F\u8FBC\u307F\u4E2D`);let e=new FileReader;e.onload=()=>{try{let n=JSON.parse(e.result);n.source&&!n.source.name&&(n.source.name=t.name),setTimeout(()=>this.loadScene(n),0)}catch(n){this.ui.hideLoading(),this.ui.showError(`${t.name} \u3092 JSON \u3068\u3057\u3066\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
${n.message}`)}},e.readAsText(t)}loadScene(t){if(this.sceneLoading=!1,!this.renderer)return!1;let e=performance.now();this.pause();try{Yl(t),this.clearScene();let n=performance.now(),s=td(t),r=performance.now()-n;this.scene.add(s.root),this.data=t,this.built=s;let o=[],a=performance.now(),l=v=>{let w=performance.now();o.push([v,w-a]),a=w};this.pose=new ko(s,t),this.edit=null,this.history.clear(),jl(s,this.settings.poseSource),this.pose.reapplyAll(),s.root.updateMatrixWorld(!0),this.curves.build(s,t.curves),this.initVisibility(),l("\u59FF\u52E2");let c=Kl(s,!0);this.sceneRadius=Math.max(c.getSize(ia).length()/2,.001),l("\u7BC4\u56F2"),this.overlay.build(s,t.nodes,this.sceneRadius),this.updateGrid(c),l("\u30B8\u30E7\u30A4\u30F3\u30C8"),this.ui.populate(t,s),this.updateVisibility(),l("\u4E00\u89A7"),this.applyAll(),l("\u8868\u793A\u8A2D\u5B9A");let h=(t.warnings||[]).slice();for(let v of s.meshes){if(!v.skin)continue;let w=v.skin.stats;if(w.overMax&&h.push(`${v.name}: 9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u304C ${En(w.overMax)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u8868\u793A\u306F\u4E0A\u4F4D 8 \u3064\uFF09\u3002`),w.unnormalized&&h.push(`${v.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9\u304C ${En(w.unnormalized)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u6642\u306B\u5408\u8A08\u3067\u5272\u3063\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF09\u3002`),w.zero){let M=v.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2";h.push(`${v.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u9802\u70B9\u304C ${En(w.zero)} \u500B\u3042\u308A\u307E\u3059\u3002${v.data.skin.cluster} \u306E\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${M}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002`)}}this.ui.setWarnings(h);let u=t.source||{},d=u.name||(u.path?String(u.path).split(/[\\/]/).pop():"")||(u.kind==="maya"?"Maya \u30B7\u30FC\u30F3":"");this.sceneName=d,this.updateTitle(),this.ui.setFile(d||"\uFF08\u540D\u524D\u306A\u3057\uFF09");let f=s.meshes.reduce((v,w)=>v+w.triCount,0),g=s.meshes.reduce((v,w)=>v+w.vertexCount,0),x=this.curves.items.filter(Boolean).length;this.ui.setStats(`\u30E1\u30C3\u30B7\u30E5 ${En(s.meshes.length)} \u30FB \u9802\u70B9 ${En(g)} \u30FB \u4E09\u89D2\u5F62 ${En(f)} \u30FB \u30B8\u30E7\u30A4\u30F3\u30C8 ${En(s.jointIndices.length)}`+(x?` \u30FB \u30AB\u30FC\u30D6 ${En(x)}`:"")),this.ui.setEmpty(!1),this.ui.hideError(),this.ui.hideLoading(),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.frameAll(!0),this.maps.reset(t),this.requestMaps(),l("\u30DE\u30C6\u30EA\u30A2\u30EB");let m=performance.now();this.ui.setMessage(`\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08${Math.round(performance.now()-e)} ms\uFF09`),this.log("info",`scene loaded: ${s.meshes.length} meshes, ${s.jointIndices.length} joints`);let p=this.timing||{},b=n+r;requestAnimationFrame(()=>requestAnimationFrame(()=>{let v=w=>`${Math.round(w)} ms`;o.push(["\u6700\u521D\u306E\u63CF\u753B",performance.now()-m]),this.lastTiming={transfer:p.transfer||0,parse:p.parse||0,build:r,setup:performance.now()-b,setupParts:Object.fromEntries(o)},this.log("info",`\u8AAD\u307F\u8FBC\u307F\u306E\u5185\u8A33\uFF08\u30D3\u30E5\u30FC\u30A2\uFF09: \u53D7\u3051\u6E21\u3057 ${v(this.lastTiming.transfer)}\u30FBJSON \u306E\u89E3\u91C8 ${v(this.lastTiming.parse)}\u30FB\u30B7\u30FC\u30F3\u306E\u7D44\u307F\u7ACB\u3066 ${v(r)}\u30FB\u753B\u9762\u306E\u6E96\u5099\u3068\u6700\u521D\u306E\u63CF\u753B ${v(this.lastTiming.setup)}\uFF08${o.map(([w,M])=>`${w} ${v(M)}`).join("\u30FB")}\uFF09`),this.timing=null}));let y=this.pendingAnimation||t.animation;return this.pendingAnimation=null,y&&this.setAnimation(y),!0}catch(n){return this.ui.hideLoading(),this.ui.showError(`\u30B7\u30FC\u30F3\u3092\u8868\u793A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+(n&&n.message||n)),this.log("error",n&&n.stack||n),!1}}clearScene(){this.textureToken=(this.textureToken||0)+1,this.maps&&this.maps.reset(null),this.built&&id(this.built),this.built=null,this.data=null,this.overlay.clear(),this.curves.clear(),this.gizmo&&this.gizmo.detach(),this.pose=null,this.edit=null,this.history.clear(),this.selected=-1,this.picked=null,this.marker&&(this.marker.visible=!1),this.pause(),this.clip=null,this.rig=null,this.rigCurves=null,this.timeline.setClip(null)}clearAll(){this.pendingAnimation=null,this.clearScene(),this.timeline.setStatus(""),this.ui.populate({nodes:[],meshes:[]},{childrenOf:[],meshes:[]}),this.ui.setWarnings([]),this.ui.setTitle(""),this.ui.setFile("\u30D5\u30A1\u30A4\u30EB\u672A\u8AAD\u307F\u8FBC\u307F"),this.ui.setStats(""),this.ui.setEmpty(!0),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.ui.setLegend("off"),this.requestRender()}updateTitle(){let t=this.sceneName||"";this.built&&ys(this.built)&&(t+=this.settings.poseSource==="bind"?"\uFF08\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\uFF09":"\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\uFF09"),this.ui.setTitle(t)}updateGrid(t){this.grid&&(this.scene.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose());let e=Math.max(Math.abs(t.min.x),Math.abs(t.max.x),Math.abs(t.min.z),Math.abs(t.max.z),.001),n=W_(e*2.4);this.grid=new Eo(n,20,2830132,6120814),this.grid.material.transparent=!0,this.grid.material.opacity=.6,this.grid.material.depthWrite=!1,this.grid.renderOrder=-1,this.grid.visible=!!this.settings.grid,this.scene.add(this.grid)}setSetting(t,e){if(!(t==="tool"&&!G_.includes(e))){if(this.settings[t]=e,t==="gizmoSize"&&this.gizmo&&this.gizmo.setSize(e),t==="space"&&this.gizmo&&this.gizmo.setSpace(e),t==="grid"&&this.grid&&(this.grid.visible=!!e),this.ui.syncSettings(this.settings),!this.built){this.requestRender();return}switch(t){case"tool":case"space":this.updateGizmo();break;case"shading":case"wire":this.applyShading(),this.applyWeights();break;case"skin":this.applyShading(),this.poseDirty=!0,this.updateMarker(),this.picked&&this.ui.showVertexInfo(this.vertexInfo());break;case"joints":this.overlay.setVisible(e);break;case"curves":this.curves.setVisible(e);break;case"xray":this.overlay.setXray(e);break;case"axes":this.overlay.setAxesMode(e);break;case"jointSize":this.overlay.setSize(e);break;case"weightMode":this.applyWeights();break;case"textures":case"alpha":case"alphaStyle":case"lighting":case"mapView":case"maps":case"normalFlipY":this.requestMaps();break;case"poseSource":jl(this.built,e),this.pose.reapplyAll(),this.afterPoseChange(),this.updateTitle();break;default:break}this.requestRender()}}applyAll(){let t=this.settings;this.overlay.setVisible(t.joints),this.curves.setVisible(t.curves),this.overlay.setXray(t.xray),this.overlay.setAxesMode(t.axes),this.overlay.setSize(t.jointSize),this.applyShading(),this.applyWeights(),this.requestRender()}applyShading(){let t=this.settings;for(let e of this.built.meshes){let n=t.skin&&!!e.skinned,s=e.visible&&t.shading!=="none",r=e.visible&&(t.wire||t.shading==="none");e.staticMesh.visible=s&&!n,e.skinned&&(e.skinned.visible=s&&n),e.staticWire.visible=r&&!n,e.skinnedWire&&(e.skinnedWire.visible=r&&n);let o=t.shading==="none";e.wireMaterial.opacity=o?.95:.5,e.wireMaterial.color.set(o?13161178:1908772)}}applyWeights(){let t=this.settings.weightMode,e=t!=="off";for(let n of this.built.meshes){let s=e&&this.settings.shading==="none";if(n.wireMaterial.vertexColors!==s&&(n.wireMaterial.vertexColors=s,n.wireMaterial.needsUpdate=!0),s&&n.wireMaterial.color.set(16777215),!e)continue;let r=new Float32Array(n.vertexCount*3);if(!n.skin)Yu(r,.42,.43,.45);else if(t==="selected"){let o=this.selected>=0?n.data.skin.influences.indexOf(this.selected):-1;qu(r,n.skin,o,n.vertexCount)}else $u(r,n.skin,n.data.skin.influences,n.vertexCount);nd(n,r)}this.applyMaterials(),this.ui.setLegend(t,this.selected>=0&&this.data?this.data.nodes[this.selected].name:null)}applyMaterials(){if(!this.built)return;let t=this.settings,e=t.weightMode!=="off",n=t.mapView||"combined",s=t.lighting==="flat"||n!=="combined",r=t.shading==="flat",o=this.maps,a=t.textures&&!e,l=(h,u,d)=>{let f=h.maps[u];return a&&f?o.texture(f.key,dd(u,f.channel,d)):null},c=(h,u)=>h.setRGB(u,u,u,xe);for(let h of this.built.allMaterials){let u=h.userData,d=l(u,"baseColor",!1),f=u.maps.baseColor&&u.maps.baseColor.key,x=!!(d&&o.hasAlpha(f))&&t.alpha!=="none"&&(t.alpha==="all"||u.useAlpha),m=t.maps.opacity?l(u,"opacity",!1):null,p=!!(x||m),b=p&&t.alphaStyle==="cutout",y=p&&t.alphaStyle==="blend",v=b?.5:y?.01:0,w=S=>{e||d?S.set(16777215):t.textures&&u.isMaya?S.copy(u.baseColor):S.set(lr)};w(h.color),h.map=d,h.normalMap=t.maps.normal?l(u,"normal",!1):null,h.normalScale.set(1,t.normalFlipY?-1:1),h.roughnessMap=t.maps.roughness?l(u,"roughness",!1):null,h.roughness=h.roughnessMap?1:u.roughness??.78,h.metalnessMap=t.maps.metalness?l(u,"metalness",!1):null,h.metalness=h.metalnessMap?1:u.metalness??0,h.aoMap=t.maps.ao?l(u,"ao",!1):null,h.emissiveMap=t.maps.emissive?l(u,"emissive",!1):null,h.emissive.set(h.emissiveMap?16777215:0),h.alphaMap=m,h.vertexColors=e,h.flatShading=r,h.transparent=y,h.alphaTest=v;let M=u.unlit;M.vertexColors=e,M.alphaMap=null,n==="combined"||e?(w(M.color),M.map=e?null:d,M.transparent=y,M.alphaTest=e?0:v,M.alphaMap=e?null:m):(M.map=l(u,n,!0),M.transparent=!1,M.alphaTest=0,M.map?M.color.set(16777215):n==="baseColor"?w(M.color):n==="normal"?M.color.setRGB(.5,.5,1,xe):n==="roughness"?c(M.color,u.roughness??.78):n==="metalness"?c(M.color,u.metalness??0):n==="emissive"?M.color.set(0):M.color.set(16777215));for(let S of[h,M]){let C=[S.map,S.normalMap,S.roughnessMap,S.metalnessMap,S.aoMap,S.emissiveMap,S.alphaMap].map(_=>_?1:0).join("")+[S.vertexColors,S.flatShading,S.transparent,S.alphaTest>0].join();S.userData.sig!==C&&(S.userData.sig=C,S.needsUpdate=!0)}}for(let h of this.built.meshes){let u=s?h.materials.map(f=>f.userData.unlit):h.materials,d=u.length>1?u:u[0];h.staticMesh.material=d,h.skinned&&(h.skinned.material=d)}this.requestRender()}requestMaps(){if(!this.built)return;let t=this.maps.neededKeys(this.built.allMaterials,this.settings),e=this.bridge&&this.bridge.readFileBase64?r=>new Promise((o,a)=>this.bridge.readFileBase64(r,l=>l?o(ld(l)):a(new Error("Python \u304B\u3089\u53D7\u3051\u53D6\u308C\u307E\u305B\u3093\u3067\u3057\u305F")))):null,n=[],s=this.maps.ensure(t,e,{forceBridge:!!this.forceBridgeTextures},(r,o)=>{this.applyMaterials(),r===o?(this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),n.length&&this.ui.addWarnings(n),this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3 ${o} \u679A\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F`),this.log("info",`textures loaded: ${o}`)):this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF08${r} / ${o}\uFF09`,0)},(r,o)=>n.push(`${o.info.node}: \u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\uFF08${o.resolved}\uFF09: ${o.message}`));s&&this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF080 / ${s}\uFF09`,0),this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),this.applyMaterials()}textureStatusList(){return(this.data&&this.data.textures||[]).map((t,e)=>this.maps.textureStatus(e))}setMapToggle(t,e){this.settings.maps={...this.settings.maps,[t]:e},this.setSetting("maps",this.settings.maps)}initVisibility(){this.hidden=new Set,this.data.nodes.forEach((t,e)=>{t.visible===!1&&this.hidden.add(e)});for(let t of this.built.meshes)t.selfVisible=t.data.visibleSelf!==void 0?t.data.visibleSelf!==!1:t.data.visible!==!1;this.computeVisibility()}computeVisibility(){let t=this.data.nodes,e=new Array(t.length).fill(!1);t.forEach((n,s)=>{e[s]=this.hidden.has(s)||n.parent>=0&&e[n.parent]}),this.hiddenEff=e;for(let n of this.built.meshes)n.visible=n.selfVisible&&!e[n.transform]}updateVisibility(){this.built&&(this.computeVisibility(),this.overlay.setHiddenNodes(this.hiddenEff),this.curves.setHiddenNodes(this.hiddenEff),this.ui.updateVisibilityMarks(this.hidden,this.hiddenEff,this.built.meshes),this.picked&&!this.built.meshes[this.picked.mesh].visible&&(this.picked=null,this.marker.visible=!1,this.ui.showVertexInfo(null)),this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),this.poseDirty=!0,this.applyShading(),this.requestRender())}setNodeVisible(t,e){!this.built||t<0||(e?this.hidden.delete(t):this.hidden.add(t),this.updateVisibility(),this.ui.setMessage(`${e?"\u8868\u793A":"\u975E\u8868\u793A\u306B"}\u3057\u307E\u3057\u305F: ${this.data.nodes[t].name}`))}toggleNodeVisible(t){t>=0&&this.hidden&&this.setNodeVisible(t,this.hidden.has(t))}setMeshVisible(t,e){this.built&&(this.built.meshes[t].selfVisible=e,this.ui.setMeshChecked(t,e),this.updateVisibility())}setAnimation(t){if(this.sceneLoading||!this.built)return this.pendingAnimation=t,!0;let e;try{e=new Zo(t);let a=e.nodes.find(l=>!(l>=0&&l<this.data.nodes.length));if(a!==void 0)throw new Error(`\u30CE\u30FC\u30C9\u756A\u53F7 ${a} \u304C\u30B7\u30FC\u30F3\u306B\u3042\u308A\u307E\u305B\u3093`)}catch(a){return this.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+(a&&a.message||a)),this.log("error",a&&a.stack||a),!1}this.pause(),this.clip=e,this.data.animation=t,this.rig=new ta(e,this.data.nodes,a=>this.built.nodeObjects[a].userData.fileMatrix);let n=new Set;for(let a of this.rig.moving){n.add(a);for(let l of this.built.childrenOf[a])n.add(l)}this.animTouched=[...n].sort((a,l)=>a-l);for(let[a,l]of this.rig.evaluate(e.current,()=>null,new Map))this.built.nodeObjects[a].userData.savedMatrix.copy(l);let s=e.warnings.concat([...this.rig.problems].map(a=>`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3: \u30EA\u30B0\u306E\u8A55\u4FA1\u3092\u6253\u3061\u5207\u308A\u307E\u3057\u305F\uFF08${a}\uFF09\u3002`));s.length&&this.ui.setWarnings((this.ui.warnings||[]).concat(s)),this.overlay.setStatus(this.rig.fallback.size||this.rig.tainted.size?a=>this.rig.statusOf(a):null);let r=new Set(this.built.meshes.map(a=>a.transform));this.overlay.setControllers([...this.rig.directDrivers].filter(a=>this.data.nodes[a].type!=="joint"&&!r.has(a)&&!this.curves.hasCurve(a)).sort((a,l)=>a-l)),this.rigCurves=(t.graph||[]).filter(a=>a.type==="nurbsCurve"&&a.shape>=0).map(a=>[a.shape,a.id]),this.hasTimeline||this.timeline.setStatus(""),this.timeline.setClip(this.hasTimeline?e:null),this.updateTimelineKeys(),this.applyFrame(e.current);let o=t.stats||{};return this.ui.setMessage(`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08\u30AB\u30FC\u30D6 ${En(o.curves??e.curves.length)} \u672C\u30FB\u52D5\u304F\u30CE\u30FC\u30C9 ${En(this.rig.moving.size)} \u500B\u30FB${e.start}\u301C${e.end} \u30D5\u30EC\u30FC\u30E0\uFF09`,6e3),this.log("info",`animation loaded: ${e.curves.length} curves, ${e.nodes.length} nodes`),!0}rigValues(t){let e=this.rig.rest(t)?this.rig.chan(t):null;return e?{t:e.t.slice(),r:e.r.slice(),s:e.s.slice()}:null}verifyRig(){if(!this.rig||!this.clip)return null;this.rig.evaluate(this.clip.current,()=>null,new Map);let t=this.rig.verifySaved(e=>this.rig.fileRestLocal(e));return this.applyFrame(this.frame),{frame:this.clip.current,handles:t}}get hasTimeline(){return!!(this.clip&&(this.clip.timeCurves.length||this.rig&&this.rig.usesTime))}applyFrame(t,e=this.playing){if(!this.clip||!this.built)return;this.frame=t;let n=l=>this.pose&&this.pose.has(l)?Gl(this.pose.get(l),new it):null,s=this.rig.evaluate(t,n),r=this.settings.poseSource,o=ys(this.built);for(let[l,c]of s){let h=this.built.nodeObjects[l].userData;h.fileMatrix.copy(c),h.baseMatrix.copy(Zl(h,r,o))}for(let l of this.animTouched)this.pose.apply(l);let a=r==="bind"&&o;for(let[l,c]of this.rigCurves||[])this.curves.setShape(l,a?null:this.rig.plug(c,"local"));this.timeline.setFrame(t),this.rigBusy=!0;try{this.afterPoseChange(e)}finally{this.rigBusy=!1}}ensureAnimatedPose(){this.settings.poseSource==="bind"&&ys(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}scrubTo(t){this.hasTimeline&&(this.pause(),this.ensureAnimatedPose(),this.applyFrame(t))}stepFrame(t){this.hasTimeline&&this.scrubTo(this.clip.wrap(Math.round(this.frame)+t))}stepKey(t){if(!this.hasTimeline)return;let e=this.keyTimesForSelection(),n=1e-6,s=t>0?e.find(r=>r>this.frame+n):[...e].reverse().find(r=>r<this.frame-n);s!==void 0?this.scrubTo(s):this.ui.setMessage(t>0?"\u3053\u308C\u3088\u308A\u5F8C\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093":"\u3053\u308C\u3088\u308A\u524D\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093")}goToEdge(t){this.hasTimeline&&this.scrubTo(t<0?this.clip.start:this.clip.end)}setPlaybackRange(t,e){if(this.clip){if(!(Number.isFinite(t)&&Number.isFinite(e))){this.timeline.setRange(this.clip.start,this.clip.end);return}e<t&&([t,e]=[e,t]),this.clip.start=t,this.clip.end=e,this.timeline.setRange(t,e),(this.frame<t||this.frame>e)&&this.scrubTo(Math.min(Math.max(this.frame,t),e))}}togglePlay(){this.playing?this.pause():this.play()}play(){if(!this.hasTimeline||this.playing)return;this.ensureAnimatedPose(),this.endPoseEdit();let t=this.frame>=this.clip.start&&this.frame<=this.clip.end?Math.round(this.frame):this.clip.start;this.playing=!0,this.timeline.setPlaying(!0);let e=performance.now(),n=s=>{if(!this.playing||!this.clip)return;let r=this.clip.wrap(t+Math.floor((s-e)/1e3*this.clip.fps));r!==this.frame&&this.applyFrame(r),this.playHandle=requestAnimationFrame(n)};this.playHandle=requestAnimationFrame(n)}pause(){this.playing&&(this.playing=!1,cancelAnimationFrame(this.playHandle),this.timeline.setPlaying(!1),this.built&&this.afterPoseChange())}keyTimesForSelection(){if(!this.clip)return[];let t=this.selected>=0?this.clip.keyTimes(this.selected):[];return t.length?t:this.clip.keyTimes()}updateTimelineKeys(){if(!this.clip)return;let t=this.selected>=0&&this.clip.keyTimes(this.selected).length;this.timeline.setKeys(this.keyTimesForSelection(),t?`${this.data.nodes[this.selected].name} \u306E\u30AD\u30FC`:"\u3059\u3079\u3066\u306E\u30AD\u30FC")}select(t,e={}){!this.built||t<0||t>=this.data.nodes.length||(this.selected=t,this.overlay.setSelected(t),this.curves.setSelected(t),this.ui.highlightNode(t,this.data.nodes),this.ui.showNodeInfo(this.nodeInfo(t)),this.ui.showPoseFor(t,this.pose.get(t)),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),e.notify&&this.bridge&&this.bridge.nodeSelected&&this.bridge.nodeSelected(this.data.nodes[t].path),this.requestRender())}selectMesh(t){this.built&&this.select(this.built.meshes[t].transform,{notify:!0})}selectByPath(t){if(!this.data)return!1;let e=this.data.nodes,n=e.findIndex(s=>s.path===t);if(n<0&&(n=e.findIndex(s=>s.path.endsWith("|"+t.replace(/^\|/,""))||s.name===t)),n<0){let s=this.data.meshes.findIndex(r=>r.path===t||r.name===t);s>=0&&(n=this.data.meshes[s].transform)}return n<0?!1:(this.select(n,{notify:!1}),!0)}clearSelection(){this.built&&(this.selected=-1,this.picked=null,this.marker.visible=!1,this.overlay.setSelected(-1),this.curves.setSelected(-1),this.ui.highlightNode(-1,this.data.nodes),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),this.requestRender())}nodeInfo(t){let e=this.data.nodes[t],n=this.built.nodeObjects[t],s=(this.built.influenceUsage.get(t)||[]).map(o=>{let a=this.built.meshes[o.mesh];return{meshName:a.name,count:a.skin.stats.affected[o.slot],total:a.vertexCount}}),r=this.built.meshes.filter(o=>o.transform===t).map(o=>({name:o.name,vertices:o.vertexCount,faces:o.data.counts.length,cluster:o.data.skin?o.data.skin.cluster:"",skin:o.skin?o.skin.stats:null,normalizeSetting:o.data.skin?o.data.skin.normalize??1:null,normalized:o.skin?o.skin.normalize:!1}));return{node:e,worldPos:ia.setFromMatrixPosition(n.matrixWorld).toArray(),usage:s,meshes:r,posed:this.pose.has(t),hiddenSelf:!!(this.hidden&&this.hidden.has(t)),hiddenByParent:!!(this.hiddenEff&&this.hiddenEff[t]&&!(this.hidden&&this.hidden.has(t))),bindSource:e.bindSource||null,usingBind:this.settings.poseSource==="bind"&&!!e.bindMatrix,drivenBy:e.drivenBy||null,animChannels:this.clip?this.clip.channelsOf(t):[],rigDrivers:this.rig?this.rig.driversOf(t):[],animLoaded:!!this.clip,animValues:this.rig?this.rigValues(t):null,frame:this.frame}}pick(t){if(!this.built)return;let e=this.canvas.getBoundingClientRect(),n=new Lt((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1);if(this.raycaster.setFromCamera(n,this.camera),this.settings.joints){let f=this.overlay.pick(this.raycaster);if(f>=0){this.select(f,{notify:!0});return}}let s=2*this.camera.position.distanceTo(this.controls.target)*Math.tan(this.camera.fov*Vd/2)/Math.max(e.height,1),r=this.curves.pick(this.raycaster,s*5),o=this.settings.skin;if(this.poseDirty){for(let f of this.built.meshes)f.skinned&&(f.skinned.boundingSphere=null,f.skinned.boundingBox=null);this.poseDirty=!1}let a=[];for(let f of this.built.meshes)f.visible&&a.push(o&&f.skinned?f.skinned:f.staticMesh);let l=this.raycaster.intersectObjects(a,!1);if(r.node>=0&&(!l.length||r.distance<=l[0].distance)){this.select(r.node,{notify:!0});return}if(!l.length){this.clearSelection();return}let c=l[0],h=this.built.meshes[c.object.userData.meshIndex],u=-1,d=1/0;for(let f of[c.face.a,c.face.b,c.face.c]){let g=cr(h,f,o,oi).distanceToSquared(c.point);g<d&&(d=g,u=ed(h,f))}this.pickVertex(h.index,u)}pickVertex(t,e){this.picked={mesh:t,vertex:e},this.updateMarker(),this.ui.showVertexInfo(this.vertexInfo()),this.requestRender()}vertexInfo(){if(!this.picked||!this.built)return null;let t=this.built.meshes[this.picked.mesh],e=this.picked.vertex,n=this.settings.skin&&!!t.skinned,s=_s(t,e,n,oi).toArray(),r={meshName:t.name,vertex:e,worldPos:s,skinned:!!t.skin};if(!t.skin)return r;let o=this.data.nodes,a=Xu(t.skin,e).map(l=>{let c=t.data.skin.influences[l.slot];return{name:o[c].name,path:o[c].path,nodeIndex:c,weight:l.weight,effective:l.effective,assigned:!!l.assigned}});return{...r,weights:a,sum:a.reduce((l,c)=>l+c.weight,0),normalized:t.skin.normalize,assigned:a.some(l=>l.assigned),distribution:t.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2"}}updateMarker(){if(!this.picked||!this.built){this.marker&&(this.marker.visible=!1);return}let t=this.built.meshes[this.picked.mesh];_s(t,this.picked.vertex,this.settings.skin&&!!t.skinned,oi);let e=this.marker.geometry.attributes.position;e.setXYZ(0,oi.x,oi.y,oi.z),e.needsUpdate=!0,this.marker.visible=!0}setPoseForSelected(t){this.selected>=0&&this.setPose(this.selected,t)}setPose(t,e){this.pose&&(this.beforeDriverPose(t),this.pose.set(t,e),this.afterPoseChange())}resetPose(t){t<0||!this.pose||(this.endPoseEdit(),this.beginPoseEdit([t],"\u30CE\u30FC\u30C9\u3092\u623B\u3059"),this.pose.reset(t),this.endPoseEdit(),this.afterPoseChange(),this.ui.showPoseFor(t,gs()))}resetAllPoses(){this.pose&&(this.endPoseEdit(),this.beginPoseEdit([...this.pose.poses.keys()],"\u3059\u3079\u3066\u623B\u3059",!0),this.pose.resetAll(),this.endPoseEdit(),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,gs()))}snapshotPose(t){return this.pose&&this.pose.has(t)?this.pose.get(t):null}beginPoseEdit(t,e,n=!1){if(this.edit||!this.pose||(t=t.filter(r=>r>=0),!t.length))return;let s=!n&&t.length===1&&this.data?`\uFF08${this.data.nodes[t[0]].name}\uFF09`:"";this.edit={label:e+s,nodes:t,before:t.map(r=>[r,this.snapshotPose(r)])}}endPoseEdit(){let t=this.edit;if(!t)return;this.edit=null;let e=t.nodes.map(n=>[n,this.snapshotPose(n)]);md(t.before,e)||this.history.push({label:t.label,before:t.before,after:e})}undo(){this.endPoseEdit();let t=this.history.undo();return this.ui.setMessage(t?`\u5143\u306B\u623B\u3057\u307E\u3057\u305F: ${t.label}`:"\u5143\u306B\u623B\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}redo(){this.endPoseEdit();let t=this.history.redo();return this.ui.setMessage(t?`\u3084\u308A\u76F4\u3057\u307E\u3057\u305F: ${t.label}`:"\u3084\u308A\u76F4\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}applyPoseChanges(t){if(this.pose){for(let[e,n]of[...t].sort((s,r)=>s[0]-r[0]))this.pose.set(e,n||gs());t.length===1&&t[0][0]!==this.selected&&this.select(t[0][0],{notify:!1}),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,this.pose.get(this.selected))}}onWarningsChanged(t){this.bridge&&this.bridge.warningsChanged&&this.bridge.warningsChanged(JSON.stringify(t))}showWarnings(){this.bridge&&this.bridge.showWarnings?this.bridge.showWarnings():this.ui.openWarningDialog()}historyChanged(t){this.ui.setHistoryState(t),this.bridge&&this.bridge.historyChanged&&this.bridge.historyChanged(t.canUndo,t.canRedo,t.undoLabel,t.redoLabel)}afterPoseChange(t=!1){if(this.rig&&this.rig.hasGraph&&!this.rigBusy){this.applyFrame(this.frame,t);return}this.built.root.updateMatrixWorld(!0),this.overlay.update(),this.poseDirty=!0,this.updateMarker(),!t&&this.picked&&this.ui.showVertexInfo(this.vertexInfo()),!t&&this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),this.gizmoDragging||this.syncGizmo(),this.requestRender()}beforeDriverPose(t){this.rig&&this.rig.drivers.has(t)&&this.settings.poseSource==="bind"&&ys(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30B3\u30F3\u30C8\u30ED\u30FC\u30E9\u30FC\u306E\u52D5\u304D\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}updateGizmo(){if(!this.gizmo)return;let t=this.settings.tool;!this.built||this.selected<0||t==="select"?this.gizmo.detach():(this.syncGizmo(!0),this.gizmo.setMode(t),this.gizmo.setSpace(this.settings.space),this.gizmo.object!==this.poseProxy&&this.gizmo.attach(this.poseProxy)),this.requestRender()}syncGizmo(t=!1){if(!this.gizmo||this.selected<0||!this.pose||!t&&!this.gizmo.object)return;this.built.root.updateMatrixWorld(!0),this.pose.frameMatrix(this.selected,this.poseFrame.matrix);let e=this.pose.get(this.selected);this.poseProxy.position.fromArray(e.t),Hl(e,this.poseProxy.quaternion),this.poseProxy.scale.fromArray(e.s),this.poseFrame.updateMatrixWorld(!0)}onGizmoChange(){if(this.selected<0||!this.pose)return;let t=this.poseProxy,e=ku(t.position,t.quaternion,t.scale);t.scale.fromArray(e.s),this.beforeDriverPose(this.selected),this.pose.set(this.selected,e),this.afterPoseChange(),this.ui.showPoseFor(this.selected,e)}frameAll(t=!1){if(!this.built||!this.renderer)return;let e=Kl(this.built,this.settings.skin);this.fit(e.getCenter(new A),Math.max(e.getSize(ia).length()/2,.001),t)}frameSelection(){if(!this.built)return;if(this.picked){let s=this.built.meshes[this.picked.mesh],r=_s(s,this.picked.vertex,this.settings.skin&&!!s.skinned,new A);this.fit(r,this.sceneRadius*.12);return}if(this.selected<0){this.frameAll();return}let t=new Set([this.selected]);this.data.nodes.forEach((s,r)=>{t.has(s.parent)&&t.add(r)});let e=new $e;for(let s of this.built.meshes){if(!t.has(s.transform))continue;let r=Math.max(1,Math.floor(s.vertexCount/5e3));for(let o=0;o<s.vertexCount;o+=r)e.expandByPoint(_s(s,o,this.settings.skin,oi))}for(let s of t)e.expandByPoint(oi.setFromMatrixPosition(this.built.nodeObjects[s].matrixWorld));this.curves.expandBox(e,t);let n=Math.max(e.getSize(ia).length()/2,this.overlay.radius()*12,this.sceneRadius*.05);this.fit(e.getCenter(new A),n)}fit(t,e,n=!1){let s=this.camera,r=n?new A(1,.75,1):s.position.clone().sub(this.controls.target);r.lengthSq()<1e-12&&r.set(1,.75,1),r.normalize();let o=e/Math.sin(s.fov*Vd/2)*1.05;this.controls.target.copy(t),s.position.copy(t).addScaledVector(r,o),s.near=Math.max(o/2e3,1e-4),s.far=o*50+e*10,s.updateProjectionMatrix(),this.controls.update(),this.requestRender()}stats(){return this.built?{loaded:!0,meshes:this.built.meshes.length,vertices:this.built.meshes.reduce((t,e)=>t+e.vertexCount,0),triangles:this.built.meshes.reduce((t,e)=>t+e.triCount,0),joints:this.built.jointIndices.length,curves:this.curves.items.filter(Boolean).length,selected:this.selected>=0?this.data.nodes[this.selected].path:null,posedNodes:this.pose?this.pose.size:0,textures:this.textureStatusList().map((t,e)=>({node:this.data.textures[e].node,status:t.status,via:t.via||null,hasAlpha:!!t.hasAlpha,size:t.width?[t.width,t.height]:null,tiles:t.tiles||0})),gizmoAttached:!!(this.gizmo&&this.gizmo.object),timing:this.lastTiming||null,settings:{...this.settings},webgl:!!this.renderer,animation:this.clip?{frame:this.frame,playing:this.playing,start:this.clip.start,end:this.clip.end,fps:this.clip.fps,curves:this.clip.curves.length,nodes:this.rig?this.rig.moving.size:this.clip.nodes.length,graphNodes:this.rig?this.rig.graph.length:0,rigProblems:this.rig?[...this.rig.problems]:[]}:null}:{loaded:!1}}};function W_(i){let t=10**Math.floor(Math.log10(i));for(let e of[1,2,5,10])if(e*t>=i)return e*t;return 10*t}var Pt=new sc;window.mayaViewer={version:H_,loadScene(i){try{let t=performance.now(),e=typeof i=="string"?JSON.parse(i):i;return Pt.timing={...Pt.timing||{},parse:typeof i=="string"?performance.now()-t:0},Pt.loadScene(e)}catch(t){return Pt.sceneLoading=!1,Pt.ui.hideLoading(),Pt.ui.showError(`\u30C7\u30FC\u30BF\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+t.message),!1}},beginTransfer(i){return Pt.transfer=[],Pt.transferStart=performance.now(),Pt.ui.showLoading(i||"\u30C7\u30FC\u30BF\u3092\u53D7\u3051\u53D6\u308A\u4E2D"),!0},appendChunk(i){return Pt.transfer&&Pt.transfer.push(i),!0},endTransfer(){let i=Pt.transfer?Pt.transfer.join(""):"";return Pt.transfer=null,Pt.sceneLoading=!0,Pt.timing={transfer:performance.now()-(Pt.transferStart||performance.now())},Pt.ui.showLoading("\u30B7\u30FC\u30F3\u3092\u7D44\u307F\u7ACB\u3066\u4E2D"),setTimeout(()=>this.loadScene(i),16),i.length},beginAnimationTransfer(){return Pt.transfer=[],!0},endAnimationTransfer(){let i=Pt.transfer?Pt.transfer.join(""):"";Pt.transfer=null;try{return Pt.setAnimation(JSON.parse(i))}catch(t){return Pt.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+t.message),!1}},setAnimation(i){return Pt.setAnimation(typeof i=="string"?JSON.parse(i):i)},setAnimationStatus(i){return Pt.timeline.setStatus(Pt.clip&&!Pt.sceneLoading?"":i),!0},setFrame(i){return Pt.scrubTo(+i),Pt.frame},play(){Pt.play()},pause(){Pt.pause()},showLoading(i,t){Pt.ui.setEmpty(!1),Pt.ui.showLoading(i,t)},hideLoading(){Pt.ui.hideLoading(),Pt.built||Pt.ui.setEmpty(!0)},showError(i){Pt.ui.hideLoading(),Pt.ui.showError(i)},setMessage(i){Pt.ui.setMessage(i)},selectByPath(i){return Pt.selectByPath(i)},clear(){return Pt.clearAll(),!0},getStats(){return Pt.stats()},verifyRig(){return Pt.verifyRig()},getTextureState(){return Pt.stats().textures},frameAll(){Pt.frameAll()},undo(){return Pt.undo()},redo(){return Pt.redo()},getWarnings(){return(Pt.ui.warnings||[]).slice()},showWarnings(){Pt.showWarnings()},getHistory(){let i=Pt.history;return{canUndo:i.canUndo,canRedo:i.canRedo,undo:i.undoStack.map(t=>t.label),redo:i.redoStack.map(t=>t.label)}},debug:{get app(){return Pt},checkSkinning(i=0,t={}){return yd(Pt,i,t)}}};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
