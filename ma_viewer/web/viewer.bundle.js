(()=>{var pl="160",fn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},_i={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ed=0,Kl=1,Ad=2;var Gh=1,Td=2,Tn=3,Zn=0,Ye=1,Oe=2;var qn=0,$i=1,Ql=2,tc=3,ec=4,Cd=5,li=100,Rd=101,Pd=102,nc=103,ic=104,Ld=200,Id=201,Ud=202,Dd=203,Ca=204,Ra=205,Nd=206,Od=207,Fd=208,kd=209,zd=210,Bd=211,Vd=212,Hd=213,Gd=214,Wd=0,Xd=1,qd=2,Br=3,Yd=4,$d=5,Zd=6,jd=7,Wh=0,Jd=1,Kd=2,Yn=0,Qd=1,tf=2,ef=3,nf=4,sf=5,rf=6,sc="attached",go="detached",Xh=300,Ji=301,Ki=302,Pa=303,La=304,_o=306,Qi=1e3,Qe=1001,Ia=1002,Ce=1003,rc=1004;var Zo=1005;var Re=1006,of=1007;var gn=1008;var $n=1009,af=1010,lf=1011,ml=1012,qh=1013,Xn=1014,Cn=1015,Is=1016,Yh=1017,$h=1018,hi=1020,cf=1021,Xe=1023,hf=1024,uf=1025,ui=1026,ts=1027,df=1028,Zh=1029,ff=1030,jh=1031,Jh=1033,jo=33776,Jo=33777,Ko=33778,Qo=33779,oc=35840,ac=35841,lc=35842,cc=35843,Kh=36196,hc=37492,uc=37496,dc=37808,fc=37809,pc=37810,mc=37811,gc=37812,_c=37813,xc=37814,yc=37815,vc=37816,Mc=37817,bc=37818,Sc=37819,wc=37820,Ec=37821,ta=36492,Ac=36494,Tc=36495,pf=36283,Cc=36284,Rc=36285,Pc=36286;var Vr=2300,Hr=2301,ea=2302,Lc=2400,Ic=2401,Uc=2402;var Qh=3e3,di=3001,mf=3200,gf=3201,tu=0,_f=1,qe="",me="srgb",Pn="srgb-linear",gl="display-p3",xo="display-p3-linear",Gr="linear",re="srgb",Wr="rec709",Xr="p3";var Ai=7680;var Dc=519,xf=512,yf=513,vf=514,eu=515,Mf=516,bf=517,Sf=518,wf=519,Nc=35044,$s=35048;var Oc="300 es",Ua=1035,Rn=2e3,qr=2001,_n=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Fc=1234567,Cs=Math.PI/180,Us=180/Math.PI;function xi(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]).toLowerCase()}function Ne(i,t,e){return Math.max(t,Math.min(e,i))}function _l(i,t){return(i%t+t)%t}function Ef(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Af(i,t,e){return i!==t?(e-i)/(t-i):0}function Rs(i,t,e){return(1-e)*i+e*t}function Tf(i,t,e,n){return Rs(i,t,1-Math.exp(-e*n))}function Cf(i,t=1){return t-Math.abs(_l(i,t*2)-t)}function Rf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Pf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Lf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function If(i,t){return i+Math.random()*(t-i)}function Uf(i){return i*(.5-Math.random())}function Df(i){i!==void 0&&(Fc=i);let t=Fc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nf(i){return i*Cs}function Of(i){return i*Us}function Da(i){return(i&i-1)===0&&i!==0}function Ff(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Yr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function kf(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),u=o((t+n)/2),h=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*f,a*c);break;case"YXY":i.set(l*f,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*f,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Gi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var nu={DEG2RAD:Cs,RAD2DEG:Us,generateUUID:xi,clamp:Ne,euclideanModulo:_l,mapLinear:Ef,inverseLerp:Af,lerp:Rs,damp:Tf,pingpong:Cf,smoothstep:Rf,smootherstep:Pf,randInt:Lf,randFloat:If,randFloatSpread:Uf,seededRandom:Df,degToRad:Nf,radToDeg:Of,isPowerOfTwo:Da,ceilPowerOfTwo:Ff,floorPowerOfTwo:Yr,setQuaternionFromProperEuler:kf,normalize:Ve,denormalize:Gi},Rt=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Yt=class i{constructor(t,e,n,s,r,o,a,l,c){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let u=this.elements;return u[0]=t,u[1]=s,u[2]=a,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],f=n[5],g=n[8],_=s[0],p=s[3],m=s[6],y=s[1],x=s[4],M=s[7],A=s[2],b=s[5],S=s[8];return r[0]=o*_+a*y+l*A,r[3]=o*p+a*x+l*b,r[6]=o*m+a*M+l*S,r[1]=c*_+u*y+h*A,r[4]=c*p+u*x+h*b,r[7]=c*m+u*M+h*S,r[2]=d*_+f*y+g*A,r[5]=d*p+f*x+g*b,r[8]=d*m+f*M+g*S,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8];return e*o*u-e*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=u*o-a*c,d=a*l-u*r,f=c*r-o*l,g=e*h+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return t[0]=h*_,t[1]=(s*c-u*n)*_,t[2]=(a*n-s*o)*_,t[3]=d*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-a*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(na.makeScale(t,e)),this}rotate(t){return this.premultiply(na.makeRotation(-t)),this}translate(t,e){return this.premultiply(na.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},na=new Yt;function iu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function $r(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zf(){let i=$r("canvas");return i.style.display="block",i}var kc={};function Ps(i){i in kc||(kc[i]=!0,console.warn(i))}var zc=new Yt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Bc=new Yt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),hr={[Pn]:{transfer:Gr,primaries:Wr,toReference:i=>i,fromReference:i=>i},[me]:{transfer:re,primaries:Wr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[xo]:{transfer:Gr,primaries:Xr,toReference:i=>i.applyMatrix3(Bc),fromReference:i=>i.applyMatrix3(zc)},[gl]:{transfer:re,primaries:Xr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Bc),fromReference:i=>i.applyMatrix3(zc).convertLinearToSRGB()}},Bf=new Set([Pn,xo]),te={enabled:!0,_workingColorSpace:Pn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Bf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=hr[t].toReference,s=hr[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return hr[i].primaries},getTransfer:function(i){return i===qe?Gr:hr[i].transfer}};function Zi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ia(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ti,Zr=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ti===void 0&&(Ti=$r("canvas")),Ti.width=t.width,Ti.height=t.height;let n=Ti.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ti}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=$r("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Zi(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Zi(e[n]/255)*255):e[n]=Zi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Vf=0,jr=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=xi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(sa(s[o].image)):r.push(sa(s[o]))}else r=sa(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function sa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Zr.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Hf=0,$e=class i extends _n{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Qe,s=Qe,r=Re,o=gn,a=Xe,l=$n,c=i.DEFAULT_ANISOTROPY,u=qe){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=xi(),this.name="",this.source=new jr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Rt(0,0),this.repeat=new Rt(1,1),this.center=new Rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===di?me:qe),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Xh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Qi:t.x=t.x-Math.floor(t.x);break;case Qe:t.x=t.x<0?0:1;break;case Ia:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Qi:t.y=t.y-Math.floor(t.y);break;case Qe:t.y=t.y<0?0:1;break;case Ia:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===me?di:Qh}set encoding(t){Ps("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===di?me:qe}};$e.DEFAULT_IMAGE=null;$e.DEFAULT_MAPPING=Xh;$e.DEFAULT_ANISOTROPY=1;var le=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let x=(c+1)/2,M=(f+1)/2,A=(m+1)/2,b=(u+d)/4,S=(h+_)/4,P=(g+p)/4;return x>M&&x>A?x<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(x),s=b/n,r=S/n):M>A?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=b/s,r=P/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=S/r,s=P/r),this.set(n,s,r,e),this}let y=Math.sqrt((p-g)*(p-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(y)<.001&&(y=1),this.x=(p-g)/y,this.y=(h-_)/y,this.z=(d-u)/y,this.w=Math.acos((c+f+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Na=class extends _n{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(Ps("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===di?me:qe),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Re,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new $e(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new jr(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},hn=class extends Na{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Jr=class extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Oa=class extends $e{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ce,this.minFilter=Ce,this.wrapR=Qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ft=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==d||c!==f||u!==g){let p=1-a,m=l*d+c*f+u*g+h*_,y=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){let A=Math.sqrt(x),b=Math.atan2(A,m*y);p=Math.sin(p*b)/A,a=Math.sin(a*b)/A}let M=a*y;if(l=l*p+d*M,c=c*p+f*M,u=u*p+g*M,h=h*p+_*M,p===1-a){let A=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=A,c*=A,u*=A,h*=A}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+u*h+l*f-c*d,t[e+1]=l*g+u*d+c*h-a*f,t[e+2]=c*g+u*f+a*d-l*h,t[e+3]=u*g-a*h-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ne(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,o=this._w,a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;let l=1-a*a;if(l<=Number.EPSILON){let f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}let c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},C=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Vc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Vc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),u=2*(a*e-r*s),h=2*(r*n-o*e);return this.x=e+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ra.copy(this).projectOnVector(t),this.sub(ra)}reflect(t){return this.sub(ra.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},ra=new C,Vc=new Ft,We=class{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(rn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(rn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=rn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,rn):rn.fromBufferAttribute(r,o),rn.applyMatrix4(t.matrixWorld),this.expandByPoint(rn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ur.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ur.copy(n.boundingBox)),ur.applyMatrix4(t.matrixWorld),this.union(ur)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,rn),rn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(bs),dr.subVectors(this.max,bs),Ci.subVectors(t.a,bs),Ri.subVectors(t.b,bs),Pi.subVectors(t.c,bs),Bn.subVectors(Ri,Ci),Vn.subVectors(Pi,Ri),ii.subVectors(Ci,Pi);let e=[0,-Bn.z,Bn.y,0,-Vn.z,Vn.y,0,-ii.z,ii.y,Bn.z,0,-Bn.x,Vn.z,0,-Vn.x,ii.z,0,-ii.x,-Bn.y,Bn.x,0,-Vn.y,Vn.x,0,-ii.y,ii.x,0];return!oa(e,Ci,Ri,Pi,dr)||(e=[1,0,0,0,1,0,0,0,1],!oa(e,Ci,Ri,Pi,dr))?!1:(fr.crossVectors(Bn,Vn),e=[fr.x,fr.y,fr.z],oa(e,Ci,Ri,Pi,dr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,rn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(rn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Mn=[new C,new C,new C,new C,new C,new C,new C,new C],rn=new C,ur=new We,Ci=new C,Ri=new C,Pi=new C,Bn=new C,Vn=new C,ii=new C,bs=new C,dr=new C,fr=new C,si=new C;function oa(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){si.fromArray(i,r);let a=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=t.dot(si),c=e.dot(si),u=n.dot(si);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Gf=new We,Ss=new C,aa=new C,un=class{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Gf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ss.subVectors(t,this.center);let e=Ss.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ss,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(aa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ss.copy(t.center).add(aa)),this.expandByPoint(Ss.copy(t.center).sub(aa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},bn=new C,la=new C,pr=new C,Hn=new C,ca=new C,mr=new C,ha=new C,Ln=class{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,bn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=bn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(bn.copy(this.origin).addScaledVector(this.direction,e),bn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){la.copy(t).add(e).multiplyScalar(.5),pr.copy(e).sub(t).normalize(),Hn.copy(this.origin).sub(la);let r=t.distanceTo(e)*.5,o=-this.direction.dot(pr),a=Hn.dot(this.direction),l=-Hn.dot(pr),c=Hn.lengthSq(),u=Math.abs(1-o*o),h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){let _=1/u;h*=_,d*=_,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(la).addScaledVector(pr,d),f}intersectSphere(t,e){bn.subVectors(t.center,this.origin);let n=bn.dot(this.direction),s=bn.dot(bn)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,o=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,o=(t.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(a=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,bn)!==null}intersectTriangle(t,e,n,s,r){ca.subVectors(e,t),mr.subVectors(n,t),ha.crossVectors(ca,mr);let o=this.direction.dot(ha),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Hn.subVectors(this.origin,t);let l=a*this.direction.dot(mr.crossVectors(Hn,mr));if(l<0)return null;let c=a*this.direction.dot(ca.cross(Hn));if(c<0||l+c>o)return null;let u=-a*Hn.dot(ha);return u<0?null:this.at(u/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ct=class i{constructor(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,p)}set(t,e,n,s,r,o,a,l,c,u,h,d,f,g,_,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/Li.setFromMatrixColumn(t,0).length(),r=1/Li.setFromMatrixColumn(t,1).length(),o=1/Li.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){let d=o*u,f=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-a*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){let d=l*u,f=l*h,g=c*u,_=c*h;e[0]=d+_*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*h,e[5]=o*u,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=o*l}else if(t.order==="ZXY"){let d=l*u,f=l*h,g=c*u,_=c*h;e[0]=d-_*a,e[4]=-o*h,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*u,e[9]=_-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let d=o*u,f=o*h,g=a*u,_=a*h;e[0]=l*u,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*h,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=_-d*h,e[8]=g*h+f,e[1]=h,e[5]=o*u,e[9]=-a*u,e[2]=-c*u,e[6]=f*h+g,e[10]=d-_*h}else if(t.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+_,e[5]=o*u,e[9]=f*h-g,e[2]=g*h-f,e[6]=a*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wf,t,Xf)}lookAt(t,e,n){let s=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),Gn.crossVectors(n,Je),Gn.lengthSq()===0&&(Math.abs(n.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),Gn.crossVectors(n,Je)),Gn.normalize(),gr.crossVectors(Je,Gn),s[0]=Gn.x,s[4]=gr.x,s[8]=Je.x,s[1]=Gn.y,s[5]=gr.y,s[9]=Je.y,s[2]=Gn.z,s[6]=gr.z,s[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],f=n[13],g=n[2],_=n[6],p=n[10],m=n[14],y=n[3],x=n[7],M=n[11],A=n[15],b=s[0],S=s[4],P=s[8],v=s[12],w=s[1],O=s[5],G=s[9],et=s[13],I=s[2],U=s[6],N=s[10],W=s[14],H=s[3],z=s[7],J=s[11],j=s[15];return r[0]=o*b+a*w+l*I+c*H,r[4]=o*S+a*O+l*U+c*z,r[8]=o*P+a*G+l*N+c*J,r[12]=o*v+a*et+l*W+c*j,r[1]=u*b+h*w+d*I+f*H,r[5]=u*S+h*O+d*U+f*z,r[9]=u*P+h*G+d*N+f*J,r[13]=u*v+h*et+d*W+f*j,r[2]=g*b+_*w+p*I+m*H,r[6]=g*S+_*O+p*U+m*z,r[10]=g*P+_*G+p*N+m*J,r[14]=g*v+_*et+p*W+m*j,r[3]=y*b+x*w+M*I+A*H,r[7]=y*S+x*O+M*U+A*z,r[11]=y*P+x*G+M*N+A*J,r[15]=y*v+x*et+M*W+A*j,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],f=t[14],g=t[3],_=t[7],p=t[11],m=t[15];return g*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*f-n*l*f)+_*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*u-r*l*u)+p*(+e*c*h-e*a*f-r*o*h+n*o*f+r*a*u-n*c*u)+m*(-s*a*u-e*l*h+e*a*d+s*o*h-n*o*d+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],f=t[11],g=t[12],_=t[13],p=t[14],m=t[15],y=h*p*c-_*d*c+_*l*f-a*p*f-h*l*m+a*d*m,x=g*d*c-u*p*c-g*l*f+o*p*f+u*l*m-o*d*m,M=u*_*c-g*h*c+g*a*f-o*_*f-u*a*m+o*h*m,A=g*h*l-u*_*l-g*a*d+o*_*d+u*a*p-o*h*p,b=e*y+n*x+s*M+r*A;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let S=1/b;return t[0]=y*S,t[1]=(_*d*r-h*p*r-_*s*f+n*p*f+h*s*m-n*d*m)*S,t[2]=(a*p*r-_*l*r+_*s*c-n*p*c-a*s*m+n*l*m)*S,t[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*f-n*l*f)*S,t[4]=x*S,t[5]=(u*p*r-g*d*r+g*s*f-e*p*f-u*s*m+e*d*m)*S,t[6]=(g*l*r-o*p*r-g*s*c+e*p*c+o*s*m-e*l*m)*S,t[7]=(o*d*r-u*l*r+u*s*c-e*d*c-o*s*f+e*l*f)*S,t[8]=M*S,t[9]=(g*h*r-u*_*r-g*n*f+e*_*f+u*n*m-e*h*m)*S,t[10]=(o*_*r-g*a*r+g*n*c-e*_*c-o*n*m+e*a*m)*S,t[11]=(u*a*r-o*h*r-u*n*c+e*h*c+o*n*f-e*a*f)*S,t[12]=A*S,t[13]=(u*_*s-g*h*s+g*n*d-e*_*d-u*n*p+e*h*p)*S,t[14]=(g*a*s-o*_*s-g*n*l+e*_*l+o*n*p-e*a*p)*S,t[15]=(o*h*s-u*a*s+u*n*l-e*h*l-o*n*d+e*a*d)*S,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,u=o+o,h=a+a,d=r*c,f=r*u,g=r*h,_=o*u,p=o*h,m=a*h,y=l*c,x=l*u,M=l*h,A=n.x,b=n.y,S=n.z;return s[0]=(1-(_+m))*A,s[1]=(f+M)*A,s[2]=(g-x)*A,s[3]=0,s[4]=(f-M)*b,s[5]=(1-(d+m))*b,s[6]=(p+y)*b,s[7]=0,s[8]=(g+x)*S,s[9]=(p-y)*S,s[10]=(1-(d+_))*S,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=Li.set(s[0],s[1],s[2]).length(),o=Li.set(s[4],s[5],s[6]).length(),a=Li.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],on.copy(this);let c=1/r,u=1/o,h=1/a;return on.elements[0]*=c,on.elements[1]*=c,on.elements[2]*=c,on.elements[4]*=u,on.elements[5]*=u,on.elements[6]*=u,on.elements[8]*=h,on.elements[9]*=h,on.elements[10]*=h,e.setFromRotationMatrix(on),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Rn){let l=this.elements,c=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),d=(n+s)/(n-s),f,g;if(a===Rn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===qr)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Rn){let l=this.elements,c=1/(e-t),u=1/(n-s),h=1/(o-r),d=(e+t)*c,f=(n+s)*u,g,_;if(a===Rn)g=(o+r)*h,_=-2*h;else if(a===qr)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Li=new C,on=new ct,Wf=new C(0,0,0),Xf=new C(1,1,1),Gn=new C,gr=new C,Je=new C,Hc=new ct,Gc=new Ft,Te=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ne(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Te.DEFAULT_ORDER="XYZ";var Ds=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qf=0,Wc=new C,Ii=new Ft,Sn=new ct,_r=new C,ws=new C,Yf=new C,$f=new Ft,Xc=new C(1,0,0),qc=new C(0,1,0),Yc=new C(0,0,1),Zf={type:"added"},jf={type:"removed"},oe=class i extends _n{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=xi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new C,e=new Te,n=new Ft,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new Yt}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.multiply(Ii),this}rotateOnWorldAxis(t,e){return Ii.setFromAxisAngle(t,e),this.quaternion.premultiply(Ii),this}rotateX(t){return this.rotateOnAxis(Xc,t)}rotateY(t){return this.rotateOnAxis(qc,t)}rotateZ(t){return this.rotateOnAxis(Yc,t)}translateOnAxis(t,e){return Wc.copy(t).applyQuaternion(this.quaternion),this.position.add(Wc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xc,t)}translateY(t){return this.translateOnAxis(qc,t)}translateZ(t){return this.translateOnAxis(Yc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?_r.copy(t):_r.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ws.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(ws,_r,this.up):Sn.lookAt(_r,ws,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),Ii.setFromRotationMatrix(Sn),this.quaternion.premultiply(Ii.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Zf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(jf)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,t,Yf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ws,$f,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,o=s.length;r<o;r++){let a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),u=o(t.images),h=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};oe.DEFAULT_UP=new C(0,1,0);oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var an=new C,wn=new C,ua=new C,En=new C,Ui=new C,Di=new C,$c=new C,da=new C,fa=new C,pa=new C,xr=!1,Wi=class i{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),an.subVectors(t,e),s.cross(an);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){an.subVectors(s,e),wn.subVectors(n,e),ua.subVectors(t,e);let o=an.dot(an),a=an.dot(wn),l=an.dot(ua),c=wn.dot(wn),u=wn.dot(ua),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getUV(t,e,n,s,r,o,a,l){return xr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),xr=!0),this.getInterpolation(t,e,n,s,r,o,a,l)}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(o,En.y),l.addScaledVector(a,En.z),l)}static isFrontFacing(t,e,n,s){return an.subVectors(n,e),wn.subVectors(t,e),an.cross(wn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),wn.subVectors(this.a,this.b),an.cross(wn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return xr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),xr=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Ui.subVectors(s,n),Di.subVectors(r,n),da.subVectors(t,n);let l=Ui.dot(da),c=Di.dot(da);if(l<=0&&c<=0)return e.copy(n);fa.subVectors(t,s);let u=Ui.dot(fa),h=Di.dot(fa);if(u>=0&&h<=u)return e.copy(s);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),e.copy(n).addScaledVector(Ui,o);pa.subVectors(t,r);let f=Ui.dot(pa),g=Di.dot(pa);if(g>=0&&f<=g)return e.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(Di,a);let p=u*g-f*h;if(p<=0&&h-u>=0&&f-g>=0)return $c.subVectors(r,s),a=(h-u)/(h-u+(f-g)),e.copy(s).addScaledVector($c,a);let m=1/(p+_+d);return o=_*m,a=d*m,e.copy(n).addScaledVector(Ui,o).addScaledVector(Di,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},su={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},yr={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Lt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=me){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=te.workingColorSpace){if(t=_l(t,1),e=Ne(e,0,1),n=Ne(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=ma(o,r,t+1/3),this.g=ma(o,r,t),this.b=ma(o,r,t-1/3)}return te.toWorkingColorSpace(this,s),this}setStyle(t,e=me){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=me){let n=su[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}copyLinearToSRGB(t){return this.r=ia(t.r),this.g=ia(t.g),this.b=ia(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=me){return te.fromWorkingColorSpace(De.copy(this),t),Math.round(Ne(De.r*255,0,255))*65536+Math.round(Ne(De.g*255,0,255))*256+Math.round(Ne(De.b*255,0,255))}getHexString(t=me){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.fromWorkingColorSpace(De.copy(this),e);let n=De.r,s=De.g,r=De.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=te.workingColorSpace){return te.fromWorkingColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=me){te.fromWorkingColorSpace(De.copy(this),t);let e=De.r,n=De.g,s=De.b;return t!==me?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Wn),this.setHSL(Wn.h+t,Wn.s+e,Wn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Wn),t.getHSL(yr);let n=Rs(Wn.h,yr.h,e),s=Rs(Wn.s,yr.s,e),r=Rs(Wn.l,yr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},De=new Lt;Lt.NAMES=su;var Jf=0,In=class extends _n{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=xi(),this.name="",this.type="Material",this.blending=$i,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ca,this.blendDst=Ra,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Lt(0,0,0),this.blendAlpha=0,this.depthFunc=Br,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ai,this.stencilZFail=Ai,this.stencilZPass=Ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ca&&(n.blendSrc=this.blendSrc),this.blendDst!==Ra&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Br&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},Pe=class extends In{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Lt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Wh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var ye=new C,vr=new Rt,_e=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Nc,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Cn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)vr.fromBufferAttribute(this,e),vr.applyMatrix3(t),this.setXY(e,vr.x,vr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Gi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Gi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Gi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Gi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Gi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array),r=Ve(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Nc&&(t.usage=this.usage),t}};var fi=class extends _e{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Kr=class extends _e{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var $t=class extends _e{constructor(t,e,n){super(new Float32Array(t),e,n)}};var Kf=0,nn=new ct,ga=new oe,Ni=new C,Ke=new We,Es=new We,Ae=new C,ee=class i extends _n{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Kf++}),this.uuid=xi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(iu(t)?Kr:fi)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Yt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return nn.makeRotationFromQuaternion(t),this.applyMatrix4(nn),this}rotateX(t){return nn.makeRotationX(t),this.applyMatrix4(nn),this}rotateY(t){return nn.makeRotationY(t),this.applyMatrix4(nn),this}rotateZ(t){return nn.makeRotationZ(t),this.applyMatrix4(nn),this}translate(t,e,n){return nn.makeTranslation(t,e,n),this.applyMatrix4(nn),this}scale(t,e,n){return nn.makeScale(t,e,n),this.applyMatrix4(nn),this}lookAt(t){return ga.lookAt(t),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new $t(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new We);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new un);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new C,1/0);return}if(t){let n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Es.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(Ke.min,Es.min),Ke.expandByPoint(Ae),Ae.addVectors(Ke.max,Es.max),Ke.expandByPoint(Ae)):(Ke.expandByPoint(Es.min),Ke.expandByPoint(Es.max))}Ke.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Ae.fromBufferAttribute(a,c),l&&(Ni.fromBufferAttribute(t,c),Ae.add(Ni)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,o=e.uv.array,a=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _e(new Float32Array(4*a),4));let l=this.getAttribute("tangent").array,c=[],u=[];for(let w=0;w<a;w++)c[w]=new C,u[w]=new C;let h=new C,d=new C,f=new C,g=new Rt,_=new Rt,p=new Rt,m=new C,y=new C;function x(w,O,G){h.fromArray(s,w*3),d.fromArray(s,O*3),f.fromArray(s,G*3),g.fromArray(o,w*2),_.fromArray(o,O*2),p.fromArray(o,G*2),d.sub(h),f.sub(h),_.sub(g),p.sub(g);let et=1/(_.x*p.y-p.x*_.y);isFinite(et)&&(m.copy(d).multiplyScalar(p.y).addScaledVector(f,-_.y).multiplyScalar(et),y.copy(f).multiplyScalar(_.x).addScaledVector(d,-p.x).multiplyScalar(et),c[w].add(m),c[O].add(m),c[G].add(m),u[w].add(y),u[O].add(y),u[G].add(y))}let M=this.groups;M.length===0&&(M=[{start:0,count:n.length}]);for(let w=0,O=M.length;w<O;++w){let G=M[w],et=G.start,I=G.count;for(let U=et,N=et+I;U<N;U+=3)x(n[U+0],n[U+1],n[U+2])}let A=new C,b=new C,S=new C,P=new C;function v(w){S.fromArray(r,w*3),P.copy(S);let O=c[w];A.copy(O),A.sub(S.multiplyScalar(S.dot(O))).normalize(),b.crossVectors(P,O);let et=b.dot(u[w])<0?-1:1;l[w*4]=A.x,l[w*4+1]=A.y,l[w*4+2]=A.z,l[w*4+3]=et}for(let w=0,O=M.length;w<O;++w){let G=M[w],et=G.start,I=G.count;for(let U=et,N=et+I;U<N;U+=3)v(n[U+0]),v(n[U+1]),v(n[U+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _e(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,u=new C,h=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){let g=t.getX(d+0),_=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,p),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,g=0;for(let _=0,p=l.length;_<p;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let m=0;m<u;m++)d[g++]=c[f++]}return new _e(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let c in s){let u=s[c];this.setAttribute(c,u.clone(e))}let r=t.morphAttributes;for(let c in r){let u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zc=new ct,ri=new Ln,Mr=new un,jc=new C,Oi=new C,Fi=new C,ki=new C,_a=new C,br=new C,Sr=new Rt,wr=new Rt,Er=new Rt,Jc=new C,Kc=new C,Qc=new C,Ar=new C,Tr=new C,mt=class extends oe{constructor(t=new ee,e=new Pe){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){br.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let u=a[l],h=r[l];u!==0&&(_a.fromBufferAttribute(h,t),o?br.addScaledVector(_a,u):br.addScaledVector(_a.sub(e),u))}e.add(br)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Mr.copy(n.boundingSphere),Mr.applyMatrix4(r),ri.copy(t.ray).recast(t.near),!(Mr.containsPoint(ri.origin)===!1&&(ri.intersectSphere(Mr,jc)===null||ri.origin.distanceToSquared(jc)>(t.far-t.near)**2))&&(Zc.copy(r).invert(),ri.copy(t.ray).applyMatrix4(Zc),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ri)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let p=d[g],m=o[p.materialIndex],y=Math.max(p.start,f.start),x=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let M=y,A=x;M<A;M+=3){let b=a.getX(M),S=a.getX(M+1),P=a.getX(M+2);s=Cr(this,m,t,n,c,u,h,b,S,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){let y=a.getX(p),x=a.getX(p+1),M=a.getX(p+2);s=Cr(this,o,t,n,c,u,h,y,x,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let p=d[g],m=o[p.materialIndex],y=Math.max(p.start,f.start),x=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let M=y,A=x;M<A;M+=3){let b=M,S=M+1,P=M+2;s=Cr(this,m,t,n,c,u,h,b,S,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let p=g,m=_;p<m;p+=3){let y=p,x=p+1,M=p+2;s=Cr(this,o,t,n,c,u,h,y,x,M),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Qf(i,t,e,n,s,r,o,a){let l;if(t.side===Ye?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Zn,a),l===null)return null;Tr.copy(a),Tr.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(Tr);return c<e.near||c>e.far?null:{distance:c,point:Tr.clone(),object:i}}function Cr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Oi),i.getVertexPosition(l,Fi),i.getVertexPosition(c,ki);let u=Qf(i,t,e,n,Oi,Fi,ki,Ar);if(u){s&&(Sr.fromBufferAttribute(s,a),wr.fromBufferAttribute(s,l),Er.fromBufferAttribute(s,c),u.uv=Wi.getInterpolation(Ar,Oi,Fi,ki,Sr,wr,Er,new Rt)),r&&(Sr.fromBufferAttribute(r,a),wr.fromBufferAttribute(r,l),Er.fromBufferAttribute(r,c),u.uv1=Wi.getInterpolation(Ar,Oi,Fi,ki,Sr,wr,Er,new Rt),u.uv2=u.uv1),o&&(Jc.fromBufferAttribute(o,a),Kc.fromBufferAttribute(o,l),Qc.fromBufferAttribute(o,c),u.normal=Wi.getInterpolation(Ar,Oi,Fi,ki,Jc,Kc,Qc,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new C,materialIndex:0};Wi.getNormal(Oi,Fi,ki,h.normal),u.face=h}return u}var xe=class i extends ee{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new $t(c,3)),this.setAttribute("normal",new $t(u,3)),this.setAttribute("uv",new $t(h,2));function g(_,p,m,y,x,M,A,b,S,P,v){let w=M/S,O=A/P,G=M/2,et=A/2,I=b/2,U=S+1,N=P+1,W=0,H=0,z=new C;for(let J=0;J<N;J++){let j=J*O-et;for(let Q=0;Q<U;Q++){let F=Q*w-G;z[_]=F*y,z[p]=j*x,z[m]=I,c.push(z.x,z.y,z.z),z[_]=0,z[p]=0,z[m]=b>0?1:-1,u.push(z.x,z.y,z.z),h.push(Q/S),h.push(1-J/P),W+=1}}for(let J=0;J<P;J++)for(let j=0;j<S;j++){let Q=d+j+U*J,F=d+j+U*(J+1),V=d+(j+1)+U*(J+1),K=d+(j+1)+U*J;l.push(Q,F,K),l.push(F,V,K),H+=6}a.addGroup(f,H,v),f+=H,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function es(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function He(i){let t={};for(let e=0;e<i.length;e++){let n=es(i[e]);for(let s in n)t[s]=n[s]}return t}function tp(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function ru(i){return i.getRenderTarget()===null?i.outputColorSpace:te.workingColorSpace}var ep={clone:es,merge:He},np=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ip=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Un=class extends In{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=np,this.fragmentShader=ip,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=es(t.uniforms),this.uniformsGroups=tp(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Qr=class extends oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=Rn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ge=class extends Qr{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Us*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Cs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Us*2*Math.atan(Math.tan(Cs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Cs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},zi=-90,Bi=1,Fa=class extends oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ge(zi,Bi,t,e);s.layers=this.layers,this.add(s);let r=new Ge(zi,Bi,t,e);r.layers=this.layers,this.add(r);let o=new Ge(zi,Bi,t,e);o.layers=this.layers,this.add(o);let a=new Ge(zi,Bi,t,e);a.layers=this.layers,this.add(a);let l=new Ge(zi,Bi,t,e);l.layers=this.layers,this.add(l);let c=new Ge(zi,Bi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===qr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},to=class extends $e{constructor(t,e,n,s,r,o,a,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:Ji,super(t,e,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ka=class extends hn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(Ps("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===di?me:qe),this.texture=new to(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Re}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new xe(5,5,5),r=new Un({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:qn});r.uniforms.tEquirect.value=e;let o=new mt(s,r),a=e.minFilter;return e.minFilter===gn&&(e.minFilter=Re),new Fa(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}},xa=new C,sp=new C,rp=new Yt,ln=class{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=xa.subVectors(n,e).cross(sp.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(xa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||rp.getNormalMatrix(t),s=this.coplanarPoint(xa).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},oi=new un,Rr=new C,Ns=class{constructor(t=new ln,e=new ln,n=new ln,s=new ln,r=new ln,o=new ln){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Rn){let n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],d=s[7],f=s[8],g=s[9],_=s[10],p=s[11],m=s[12],y=s[13],x=s[14],M=s[15];if(n[0].setComponents(l-r,d-c,p-f,M-m).normalize(),n[1].setComponents(l+r,d+c,p+f,M+m).normalize(),n[2].setComponents(l+o,d+u,p+g,M+y).normalize(),n[3].setComponents(l-o,d-u,p-g,M-y).normalize(),n[4].setComponents(l-a,d-h,p-_,M-x).normalize(),e===Rn)n[5].setComponents(l+a,d+h,p+_,M+x).normalize();else if(e===qr)n[5].setComponents(a,h,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){return oi.center.set(0,0,0),oi.radius=.7071067811865476,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Rr.x=s.normal.x>0?t.max.x:t.min.x,Rr.y=s.normal.y>0?t.max.y:t.min.y,Rr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Rr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ou(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function op(i,t){let e=t.isWebGL2,n=new WeakMap;function s(c,u){let h=c.array,d=c.usage,f=h.byteLength,g=i.createBuffer();i.bindBuffer(u,g),i.bufferData(u,h,d),c.onUploadCallback();let _;if(h instanceof Float32Array)_=i.FLOAT;else if(h instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=i.SHORT;else if(h instanceof Uint32Array)_=i.UNSIGNED_INT;else if(h instanceof Int32Array)_=i.INT;else if(h instanceof Int8Array)_=i.BYTE;else if(h instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:c.version,size:f}}function r(c,u,h){let d=u.array,f=u._updateRange,g=u.updateRanges;if(i.bindBuffer(h,c),f.count===-1&&g.length===0&&i.bufferSubData(h,0,d),g.length!==0){for(let _=0,p=g.length;_<p;_++){let m=g[_];e?i.bufferSubData(h,m.start*d.BYTES_PER_ELEMENT,d,m.start,m.count):i.bufferSubData(h,m.start*d.BYTES_PER_ELEMENT,d.subarray(m.start,m.start+m.count))}u.clearUpdateRanges()}f.count!==-1&&(e?i.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d,f.offset,f.count):i.bufferSubData(h,f.offset*d.BYTES_PER_ELEMENT,d.subarray(f.offset,f.offset+f.count)),f.count=-1),u.onUploadCallback()}function o(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function a(c){c.isInterleavedBufferAttribute&&(c=c.data);let u=n.get(c);u&&(i.deleteBuffer(u.buffer),n.delete(c))}function l(c,u){if(c.isGLBufferAttribute){let d=n.get(c);(!d||d.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);let h=n.get(c);if(h===void 0)n.set(c,s(c,u));else if(h.version<c.version){if(h.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(h.buffer,c,u),h.version=c.version}}return{get:o,remove:a,update:l}}var Os=class i extends ee{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=t/a,d=e/l,f=[],g=[],_=[],p=[];for(let m=0;m<u;m++){let y=m*d-o;for(let x=0;x<c;x++){let M=x*h-r;g.push(M,-y,0),_.push(0,0,1),p.push(x/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let y=0;y<a;y++){let x=y+c*m,M=y+c*(m+1),A=y+1+c*(m+1),b=y+1+c*m;f.push(x,M,b),f.push(M,A,b)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lp=`#ifdef USE_ALPHAHASH
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
#endif`,cp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,hp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,up=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,dp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fp=`#ifdef USE_AOMAP
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
#endif`,pp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,mp=`#ifdef USE_BATCHING
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
#endif`,gp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,_p=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,yp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,vp=`#ifdef USE_IRIDESCENCE
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
#endif`,Mp=`#ifdef USE_BUMPMAP
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
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ap=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Pp=`#define PI 3.141592653589793
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
} // validated`,Lp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ip=`vec3 transformedNormal = objectNormal;
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
#endif`,Up=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Op=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",kp=`
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
}`,zp=`#ifdef USE_ENVMAP
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
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Vp=`#ifdef USE_ENVMAP
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
#endif`,Hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,qp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Yp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$p=`#ifdef USE_GRADIENTMAP
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
}`,Zp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,jp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qp=`uniform bool receiveShadow;
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
#endif`,tm=`#ifdef USE_ENVMAP
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
#endif`,em=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,im=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sm=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rm=`PhysicalMaterial material;
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
#endif`,om=`struct PhysicalMaterial {
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
}`,am=`
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
#endif`,lm=`#if defined( RE_IndirectDiffuse )
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
#endif`,cm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,um=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,fm=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,pm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_m=`#if defined( USE_POINTS_UV )
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
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ym=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mm=`#ifdef USE_MORPHNORMALS
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
#endif`,bm=`#ifdef USE_MORPHTARGETS
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
#endif`,Sm=`#ifdef USE_MORPHTARGETS
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
#endif`,wm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rm=`#ifdef USE_NORMALMAP
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
#endif`,Pm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Um=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Om=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Fm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Bm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xm=`float getShadowMask() {
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
}`,qm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
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
#endif`,$m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zm=`#ifdef USE_SKINNING
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
#endif`,jm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Km=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tg=`#ifdef USE_TRANSMISSION
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
#endif`,eg=`#ifdef USE_TRANSMISSION
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
#endif`,ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ag=`uniform sampler2D t2D;
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ug=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dg=`#include <common>
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
}`,fg=`#if DEPTH_PACKING == 3200
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
}`,pg=`#define DISTANCE
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
}`,mg=`#define DISTANCE
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
}`,gg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_g=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xg=`uniform float scale;
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
}`,yg=`uniform vec3 diffuse;
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
}`,vg=`#include <common>
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
}`,Mg=`uniform vec3 diffuse;
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
}`,bg=`#define LAMBERT
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
}`,Sg=`#define LAMBERT
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
}`,wg=`#define MATCAP
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
}`,Eg=`#define MATCAP
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
}`,Ag=`#define NORMAL
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
}`,Tg=`#define NORMAL
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
}`,Cg=`#define PHONG
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
}`,Rg=`#define PHONG
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
}`,Pg=`#define STANDARD
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
}`,Lg=`#define STANDARD
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
}`,Ig=`#define TOON
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
}`,Ug=`#define TOON
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
}`,Dg=`uniform float size;
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
}`,Ng=`uniform vec3 diffuse;
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
}`,Og=`#include <common>
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
}`,Fg=`uniform vec3 color;
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
}`,kg=`uniform float rotation;
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
}`,zg=`uniform vec3 diffuse;
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
}`,Ht={alphahash_fragment:ap,alphahash_pars_fragment:lp,alphamap_fragment:cp,alphamap_pars_fragment:hp,alphatest_fragment:up,alphatest_pars_fragment:dp,aomap_fragment:fp,aomap_pars_fragment:pp,batching_pars_vertex:mp,batching_vertex:gp,begin_vertex:_p,beginnormal_vertex:xp,bsdfs:yp,iridescence_fragment:vp,bumpmap_pars_fragment:Mp,clipping_planes_fragment:bp,clipping_planes_pars_fragment:Sp,clipping_planes_pars_vertex:wp,clipping_planes_vertex:Ep,color_fragment:Ap,color_pars_fragment:Tp,color_pars_vertex:Cp,color_vertex:Rp,common:Pp,cube_uv_reflection_fragment:Lp,defaultnormal_vertex:Ip,displacementmap_pars_vertex:Up,displacementmap_vertex:Dp,emissivemap_fragment:Np,emissivemap_pars_fragment:Op,colorspace_fragment:Fp,colorspace_pars_fragment:kp,envmap_fragment:zp,envmap_common_pars_fragment:Bp,envmap_pars_fragment:Vp,envmap_pars_vertex:Hp,envmap_physical_pars_fragment:tm,envmap_vertex:Gp,fog_vertex:Wp,fog_pars_vertex:Xp,fog_fragment:qp,fog_pars_fragment:Yp,gradientmap_pars_fragment:$p,lightmap_fragment:Zp,lightmap_pars_fragment:jp,lights_lambert_fragment:Jp,lights_lambert_pars_fragment:Kp,lights_pars_begin:Qp,lights_toon_fragment:em,lights_toon_pars_fragment:nm,lights_phong_fragment:im,lights_phong_pars_fragment:sm,lights_physical_fragment:rm,lights_physical_pars_fragment:om,lights_fragment_begin:am,lights_fragment_maps:lm,lights_fragment_end:cm,logdepthbuf_fragment:hm,logdepthbuf_pars_fragment:um,logdepthbuf_pars_vertex:dm,logdepthbuf_vertex:fm,map_fragment:pm,map_pars_fragment:mm,map_particle_fragment:gm,map_particle_pars_fragment:_m,metalnessmap_fragment:xm,metalnessmap_pars_fragment:ym,morphcolor_vertex:vm,morphnormal_vertex:Mm,morphtarget_pars_vertex:bm,morphtarget_vertex:Sm,normal_fragment_begin:wm,normal_fragment_maps:Em,normal_pars_fragment:Am,normal_pars_vertex:Tm,normal_vertex:Cm,normalmap_pars_fragment:Rm,clearcoat_normal_fragment_begin:Pm,clearcoat_normal_fragment_maps:Lm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:Um,opaque_fragment:Dm,packing:Nm,premultiplied_alpha_fragment:Om,project_vertex:Fm,dithering_fragment:km,dithering_pars_fragment:zm,roughnessmap_fragment:Bm,roughnessmap_pars_fragment:Vm,shadowmap_pars_fragment:Hm,shadowmap_pars_vertex:Gm,shadowmap_vertex:Wm,shadowmask_pars_fragment:Xm,skinbase_vertex:qm,skinning_pars_vertex:Ym,skinning_vertex:$m,skinnormal_vertex:Zm,specularmap_fragment:jm,specularmap_pars_fragment:Jm,tonemapping_fragment:Km,tonemapping_pars_fragment:Qm,transmission_fragment:tg,transmission_pars_fragment:eg,uv_pars_fragment:ng,uv_pars_vertex:ig,uv_vertex:sg,worldpos_vertex:rg,background_vert:og,background_frag:ag,backgroundCube_vert:lg,backgroundCube_frag:cg,cube_vert:hg,cube_frag:ug,depth_vert:dg,depth_frag:fg,distanceRGBA_vert:pg,distanceRGBA_frag:mg,equirect_vert:gg,equirect_frag:_g,linedashed_vert:xg,linedashed_frag:yg,meshbasic_vert:vg,meshbasic_frag:Mg,meshlambert_vert:bg,meshlambert_frag:Sg,meshmatcap_vert:wg,meshmatcap_frag:Eg,meshnormal_vert:Ag,meshnormal_frag:Tg,meshphong_vert:Cg,meshphong_frag:Rg,meshphysical_vert:Pg,meshphysical_frag:Lg,meshtoon_vert:Ig,meshtoon_frag:Ug,points_vert:Dg,points_frag:Ng,shadow_vert:Og,shadow_frag:Fg,sprite_vert:kg,sprite_frag:zg},pt={common:{diffuse:{value:new Lt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Lt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Lt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new Lt(16777215)},opacity:{value:1},center:{value:new Rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},mn={basic:{uniforms:He([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:He([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:He([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)},specular:{value:new Lt(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:He([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:He([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new Lt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:He([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:He([pt.points,pt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:He([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:He([pt.common,pt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:He([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:He([pt.sprite,pt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:He([pt.common,pt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:He([pt.lights,pt.fog,{color:{value:new Lt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};mn.physical={uniforms:He([mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new Lt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new Lt(0)},specularColor:{value:new Lt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};var Pr={r:0,b:0,g:0};function Bg(i,t,e,n,s,r,o){let a=new Lt(0),l=r===!0?0:1,c,u,h=null,d=0,f=null;function g(p,m){let y=!1,x=m.isScene===!0?m.background:null;x&&x.isTexture&&(x=(m.backgroundBlurriness>0?e:t).get(x)),x===null?_(a,l):x&&x.isColor&&(_(x,1),y=!0);let M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,o):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||y)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),x&&(x.isCubeTexture||x.mapping===_o)?(u===void 0&&(u=new mt(new xe(1,1,1),new Un({name:"BackgroundCubeMaterial",uniforms:es(mn.backgroundCube.uniforms),vertexShader:mn.backgroundCube.vertexShader,fragmentShader:mn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(A,b,S){this.matrixWorld.copyPosition(S.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=x,u.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,u.material.toneMapped=te.getTransfer(x.colorSpace)!==re,(h!==x||d!==x.version||f!==i.toneMapping)&&(u.material.needsUpdate=!0,h=x,d=x.version,f=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new mt(new Os(2,2),new Un({name:"BackgroundMaterial",uniforms:es(mn.background.uniforms),vertexShader:mn.background.vertexShader,fragmentShader:mn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,c.material.toneMapped=te.getTransfer(x.colorSpace)!==re,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||d!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,h=x,d=x.version,f=i.toneMapping),c.layers.enableAll(),p.unshift(c,c.geometry,c.material,0,0,null))}function _(p,m){p.getRGB(Pr,ru(i)),n.buffers.color.setClear(Pr.r,Pr.g,Pr.b,m,o)}return{getClearColor:function(){return a},setClearColor:function(p,m=1){a.set(p),l=m,_(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(a,l)},render:g}}function Vg(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||r!==null,a={},l=p(null),c=l,u=!1;function h(I,U,N,W,H){let z=!1;if(o){let J=_(W,N,U);c!==J&&(c=J,f(c.object)),z=m(I,W,N,H),z&&y(I,W,N,H)}else{let J=U.wireframe===!0;(c.geometry!==W.id||c.program!==N.id||c.wireframe!==J)&&(c.geometry=W.id,c.program=N.id,c.wireframe=J,z=!0)}H!==null&&e.update(H,i.ELEMENT_ARRAY_BUFFER),(z||u)&&(u=!1,P(I,U,N,W),H!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function d(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function f(I){return n.isWebGL2?i.bindVertexArray(I):r.bindVertexArrayOES(I)}function g(I){return n.isWebGL2?i.deleteVertexArray(I):r.deleteVertexArrayOES(I)}function _(I,U,N){let W=N.wireframe===!0,H=a[I.id];H===void 0&&(H={},a[I.id]=H);let z=H[U.id];z===void 0&&(z={},H[U.id]=z);let J=z[W];return J===void 0&&(J=p(d()),z[W]=J),J}function p(I){let U=[],N=[],W=[];for(let H=0;H<s;H++)U[H]=0,N[H]=0,W[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:N,attributeDivisors:W,object:I,attributes:{},index:null}}function m(I,U,N,W){let H=c.attributes,z=U.attributes,J=0,j=N.getAttributes();for(let Q in j)if(j[Q].location>=0){let V=H[Q],K=z[Q];if(K===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),V===void 0||V.attribute!==K||K&&V.data!==K.data)return!0;J++}return c.attributesNum!==J||c.index!==W}function y(I,U,N,W){let H={},z=U.attributes,J=0,j=N.getAttributes();for(let Q in j)if(j[Q].location>=0){let V=z[Q];V===void 0&&(Q==="instanceMatrix"&&I.instanceMatrix&&(V=I.instanceMatrix),Q==="instanceColor"&&I.instanceColor&&(V=I.instanceColor));let K={};K.attribute=V,V&&V.data&&(K.data=V.data),H[Q]=K,J++}c.attributes=H,c.attributesNum=J,c.index=W}function x(){let I=c.newAttributes;for(let U=0,N=I.length;U<N;U++)I[U]=0}function M(I){A(I,0)}function A(I,U){let N=c.newAttributes,W=c.enabledAttributes,H=c.attributeDivisors;N[I]=1,W[I]===0&&(i.enableVertexAttribArray(I),W[I]=1),H[I]!==U&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](I,U),H[I]=U)}function b(){let I=c.newAttributes,U=c.enabledAttributes;for(let N=0,W=U.length;N<W;N++)U[N]!==I[N]&&(i.disableVertexAttribArray(N),U[N]=0)}function S(I,U,N,W,H,z,J){J===!0?i.vertexAttribIPointer(I,U,N,H,z):i.vertexAttribPointer(I,U,N,W,H,z)}function P(I,U,N,W){if(n.isWebGL2===!1&&(I.isInstancedMesh||W.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;x();let H=W.attributes,z=N.getAttributes(),J=U.defaultAttributeValues;for(let j in z){let Q=z[j];if(Q.location>=0){let F=H[j];if(F===void 0&&(j==="instanceMatrix"&&I.instanceMatrix&&(F=I.instanceMatrix),j==="instanceColor"&&I.instanceColor&&(F=I.instanceColor)),F!==void 0){let V=F.normalized,K=F.itemSize,k=e.get(F);if(k===void 0)continue;let tt=k.buffer,gt=k.type,bt=k.bytesPerElement,Mt=n.isWebGL2===!0&&(gt===i.INT||gt===i.UNSIGNED_INT||F.gpuType===qh);if(F.isInterleavedBufferAttribute){let Vt=F.data,X=Vt.stride,fe=F.offset;if(Vt.isInstancedInterleavedBuffer){for(let wt=0;wt<Q.locationSize;wt++)A(Q.location+wt,Vt.meshPerAttribute);I.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Vt.meshPerAttribute*Vt.count)}else for(let wt=0;wt<Q.locationSize;wt++)M(Q.location+wt);i.bindBuffer(i.ARRAY_BUFFER,tt);for(let wt=0;wt<Q.locationSize;wt++)S(Q.location+wt,K/Q.locationSize,gt,V,X*bt,(fe+K/Q.locationSize*wt)*bt,Mt)}else{if(F.isInstancedBufferAttribute){for(let Vt=0;Vt<Q.locationSize;Vt++)A(Q.location+Vt,F.meshPerAttribute);I.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let Vt=0;Vt<Q.locationSize;Vt++)M(Q.location+Vt);i.bindBuffer(i.ARRAY_BUFFER,tt);for(let Vt=0;Vt<Q.locationSize;Vt++)S(Q.location+Vt,K/Q.locationSize,gt,V,K*bt,K/Q.locationSize*Vt*bt,Mt)}}else if(J!==void 0){let V=J[j];if(V!==void 0)switch(V.length){case 2:i.vertexAttrib2fv(Q.location,V);break;case 3:i.vertexAttrib3fv(Q.location,V);break;case 4:i.vertexAttrib4fv(Q.location,V);break;default:i.vertexAttrib1fv(Q.location,V)}}}}b()}function v(){G();for(let I in a){let U=a[I];for(let N in U){let W=U[N];for(let H in W)g(W[H].object),delete W[H];delete U[N]}delete a[I]}}function w(I){if(a[I.id]===void 0)return;let U=a[I.id];for(let N in U){let W=U[N];for(let H in W)g(W[H].object),delete W[H];delete U[N]}delete a[I.id]}function O(I){for(let U in a){let N=a[U];if(N[I.id]===void 0)continue;let W=N[I.id];for(let H in W)g(W[H].object),delete W[H];delete N[I.id]}}function G(){et(),u=!0,c!==l&&(c=l,f(c.object))}function et(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:h,reset:G,resetDefaultState:et,dispose:v,releaseStatesOfGeometry:w,releaseStatesOfProgram:O,initAttributes:x,enableAttribute:M,disableUnusedAttributes:b}}function Hg(i,t,e,n){let s=n.isWebGL2,r;function o(u){r=u}function a(u,h){i.drawArrays(r,u,h),e.update(h,r,1)}function l(u,h,d){if(d===0)return;let f,g;if(s)f=i,g="drawArraysInstanced";else if(f=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",f===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}f[g](r,u,h,d),e.update(h,r,d)}function c(u,h,d){if(d===0)return;let f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d;g++)this.render(u[g],h[g]);else{f.multiDrawArraysWEBGL(r,u,0,h,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_];e.update(g,r,1)}}this.setMode=o,this.render=a,this.renderInstances=l,this.renderMultiDraw=c}function Gg(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(S){if(S==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",a=e.precision!==void 0?e.precision:"highp",l=r(a);l!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",l,"instead."),a=l);let c=o||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),m=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),x=d>0,M=o||t.has("OES_texture_float"),A=x&&M,b=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:c,getMaxAnisotropy:s,getMaxPrecision:r,precision:a,logarithmicDepthBuffer:u,maxTextures:h,maxVertexTextures:d,maxTextureSize:f,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:p,maxVaryings:m,maxFragmentUniforms:y,vertexTextures:x,floatFragmentTextures:M,floatVertexTextures:A,maxSamples:b}}function Wg(i){let t=this,e=null,n=0,s=!1,r=!1,o=new ln,a=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||n!==0||s;return s=d,n=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,f){let g=h.clippingPlanes,_=h.clipIntersection,p=h.clipShadows,m=i.get(h);if(!s||g===null||g.length===0||r&&!p)r?u(null):c();else{let y=r?0:n,x=y*4,M=m.clippingState||null;l.value=M,M=u(g,d,x,f);for(let A=0;A!==x;++A)M[A]=e[A];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,f,g){let _=h!==null?h.length:0,p=null;if(_!==0){if(p=l.value,g!==!0||p===null){let m=f+_*4,y=d.matrixWorldInverse;a.getNormalMatrix(y),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,M=f;x!==_;++x,M+=4)o.copy(h[x]).applyMatrix4(y,a),o.normal.toArray(p,M),p[M+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function Xg(i){let t=new WeakMap;function e(o,a){return a===Pa?o.mapping=Ji:a===La&&(o.mapping=Ki),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===Pa||a===La)if(t.has(o)){let l=t.get(o).texture;return e(l,o.mapping)}else{let l=o.image;if(l&&l.height>0){let c=new ka(l.height/2);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){let a=o.target;a.removeEventListener("dispose",s);let l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var eo=class extends Qr{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Xi=4,th=[.125,.215,.35,.446,.526,.582],ci=20,ya=new eo,eh=new Lt,va=null,Ma=0,ba=0,ai=(1+Math.sqrt(5))/2,Vi=1/ai,nh=[new C(1,1,1),new C(-1,1,1),new C(1,1,-1),new C(-1,1,-1),new C(0,ai,Vi),new C(0,ai,-Vi),new C(Vi,0,ai),new C(-Vi,0,ai),new C(ai,Vi,0),new C(-ai,Vi,0)],no=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){va=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(va,Ma,ba),t.scissorTest=!1,Lr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ji||t.mapping===Ki?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),va=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Re,minFilter:Re,generateMipmaps:!1,type:Is,format:Xe,colorSpace:Pn,depthBuffer:!1},s=ih(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ih(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=qg(r)),this._blurMaterial=Yg(r,t,e)}return s}_compileMaterial(t){let e=new mt(this._lodPlanes[0],t);this._renderer.compile(e,ya)}_sceneToCubeUV(t,e,n,s){let a=new Ge(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(eh),u.toneMapping=Yn,u.autoClear=!1;let f=new Pe({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),g=new mt(new xe,f),_=!1,p=t.background;p?p.isColor&&(f.color.copy(p),t.background=null,_=!0):(f.color.copy(eh),_=!0);for(let m=0;m<6;m++){let y=m%3;y===0?(a.up.set(0,l[m],0),a.lookAt(c[m],0,0)):y===1?(a.up.set(0,0,l[m]),a.lookAt(0,c[m],0)):(a.up.set(0,l[m],0),a.lookAt(0,0,c[m]));let x=this._cubeSize;Lr(s,y*x,m>2?x:0,x,x),u.setRenderTarget(s),_&&u.render(g,a),u.render(t,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ji||t.mapping===Ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rh()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sh());let r=s?this._cubemapMaterial:this._equirectMaterial,o=new mt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Lr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,ya)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=nh[(s-1)%nh.length];this._blur(t,s-1,s,r,o)}e.autoClear=n}_blur(t,e,n,s,r){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){let l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,h=new mt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ci-1),_=r/g,p=isFinite(r)?1+Math.floor(u*_):ci;p>ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ci}`);let m=[],y=0;for(let S=0;S<ci;++S){let P=S/_,v=Math.exp(-P*P/2);m.push(v),S===0?y+=v:S<p&&(y+=2*v)}for(let S=0;S<m.length;S++)m[S]=m[S]/y;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);let{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-n;let M=this._sizeLods[s],A=3*M*(s>x-Xi?s-x+Xi:0),b=4*(this._cubeSize-M);Lr(e,A,b,3*M,2*M),l.setRenderTarget(e),l.render(h,ya)}};function qg(i){let t=[],e=[],n=[],s=i,r=i-Xi+1+th.length;for(let o=0;o<r;o++){let a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Xi?l=th[o-i+Xi-1]:o===0&&(l=0),n.push(l);let c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,_=3,p=2,m=1,y=new Float32Array(_*g*f),x=new Float32Array(p*g*f),M=new Float32Array(m*g*f);for(let b=0;b<f;b++){let S=b%3*2/3-1,P=b>2?0:-1,v=[S,P,0,S+2/3,P,0,S+2/3,P+1,0,S,P,0,S+2/3,P+1,0,S,P+1,0];y.set(v,_*g*b),x.set(d,p*g*b);let w=[b,b,b,b,b,b];M.set(w,m*g*b)}let A=new ee;A.setAttribute("position",new _e(y,_)),A.setAttribute("uv",new _e(x,p)),A.setAttribute("faceIndex",new _e(M,m)),t.push(A),s>Xi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ih(i,t,e){let n=new hn(i,t,e);return n.texture.mapping=_o,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Lr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Yg(i,t,e){let n=new Float32Array(ci),s=new C(0,1,0);return new Un({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xl(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function sh(){return new Un({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xl(),fragmentShader:`

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
		`,blending:qn,depthTest:!1,depthWrite:!1})}function rh(){return new Un({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function xl(){return`

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
	`}function $g(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let l=a.mapping,c=l===Pa||l===La,u=l===Ji||l===Ki;if(c||u)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let h=t.get(a);return e===null&&(e=new no(i)),h=c?e.fromEquirectangular(a,h):e.fromCubemap(a,h),t.set(a,h),h.texture}else{if(t.has(a))return t.get(a).texture;{let h=a.image;if(c&&h&&h.height>0||u&&h&&s(h)){e===null&&(e=new no(i));let d=c?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",r),d.texture}else return null}}}return a}function s(a){let l=0,c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){let l=a.target;l.removeEventListener("dispose",r);let c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Zg(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function jg(i,t,e,n){let s={},r=new WeakMap;function o(h){let d=h.target;d.index!==null&&t.remove(d.index);for(let g in d.attributes)t.remove(d.attributes[g]);for(let g in d.morphAttributes){let _=d.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)t.remove(_[p])}d.removeEventListener("dispose",o),delete s[d.id];let f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(h){let d=h.attributes;for(let g in d)t.update(d[g],i.ARRAY_BUFFER);let f=h.morphAttributes;for(let g in f){let _=f[g];for(let p=0,m=_.length;p<m;p++)t.update(_[p],i.ARRAY_BUFFER)}}function c(h){let d=[],f=h.index,g=h.attributes.position,_=0;if(f!==null){let y=f.array;_=f.version;for(let x=0,M=y.length;x<M;x+=3){let A=y[x+0],b=y[x+1],S=y[x+2];d.push(A,b,b,S,S,A)}}else if(g!==void 0){let y=g.array;_=g.version;for(let x=0,M=y.length/3-1;x<M;x+=3){let A=x+0,b=x+1,S=x+2;d.push(A,b,b,S,S,A)}}else return;let p=new(iu(d)?Kr:fi)(d,1);p.version=_;let m=r.get(h);m&&t.remove(m),r.set(h,p)}function u(h){let d=r.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Jg(i,t,e,n){let s=n.isWebGL2,r;function o(f){r=f}let a,l;function c(f){a=f.type,l=f.bytesPerElement}function u(f,g){i.drawElements(r,g,a,f*l),e.update(g,r,1)}function h(f,g,_){if(_===0)return;let p,m;if(s)p=i,m="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),m="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[m](r,g,a,f*l,_),e.update(g,r,_)}function d(f,g,_){if(_===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<_;m++)this.render(f[m]/l,g[m]);else{p.multiDrawElementsWEBGL(r,g,0,a,f,0,_);let m=0;for(let y=0;y<_;y++)m+=g[y];e.update(m,r,1)}}this.setMode=o,this.setIndex=c,this.render=u,this.renderInstances=h,this.renderMultiDraw=d}function Kg(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Qg(i,t){return i[0]-t[0]}function t0(i,t){return Math.abs(t[1])-Math.abs(i[1])}function e0(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,o=new le,a=[];for(let c=0;c<8;c++)a[c]=[c,0];function l(c,u,h){let d=c.morphTargetInfluences;if(t.isWebGL2===!0){let f=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,g=f!==void 0?f.length:0,_=r.get(u);if(_===void 0||_.count!==g){let I=function(){G.dispose(),r.delete(u),u.removeEventListener("dispose",I)};_!==void 0&&_.texture.dispose();let y=u.morphAttributes.position!==void 0,x=u.morphAttributes.normal!==void 0,M=u.morphAttributes.color!==void 0,A=u.morphAttributes.position||[],b=u.morphAttributes.normal||[],S=u.morphAttributes.color||[],P=0;y===!0&&(P=1),x===!0&&(P=2),M===!0&&(P=3);let v=u.attributes.position.count*P,w=1;v>t.maxTextureSize&&(w=Math.ceil(v/t.maxTextureSize),v=t.maxTextureSize);let O=new Float32Array(v*w*4*g),G=new Jr(O,v,w,g);G.type=Cn,G.needsUpdate=!0;let et=P*4;for(let U=0;U<g;U++){let N=A[U],W=b[U],H=S[U],z=v*w*4*U;for(let J=0;J<N.count;J++){let j=J*et;y===!0&&(o.fromBufferAttribute(N,J),O[z+j+0]=o.x,O[z+j+1]=o.y,O[z+j+2]=o.z,O[z+j+3]=0),x===!0&&(o.fromBufferAttribute(W,J),O[z+j+4]=o.x,O[z+j+5]=o.y,O[z+j+6]=o.z,O[z+j+7]=0),M===!0&&(o.fromBufferAttribute(H,J),O[z+j+8]=o.x,O[z+j+9]=o.y,O[z+j+10]=o.z,O[z+j+11]=H.itemSize===4?o.w:1)}}_={count:g,texture:G,size:new Rt(v,w)},r.set(u,_),u.addEventListener("dispose",I)}let p=0;for(let y=0;y<d.length;y++)p+=d[y];let m=u.morphTargetsRelative?1:1-p;h.getUniforms().setValue(i,"morphTargetBaseInfluence",m),h.getUniforms().setValue(i,"morphTargetInfluences",d),h.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),h.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{let f=d===void 0?0:d.length,g=n[u.id];if(g===void 0||g.length!==f){g=[];for(let x=0;x<f;x++)g[x]=[x,0];n[u.id]=g}for(let x=0;x<f;x++){let M=g[x];M[0]=x,M[1]=d[x]}g.sort(t0);for(let x=0;x<8;x++)x<f&&g[x][1]?(a[x][0]=g[x][0],a[x][1]=g[x][1]):(a[x][0]=Number.MAX_SAFE_INTEGER,a[x][1]=0);a.sort(Qg);let _=u.morphAttributes.position,p=u.morphAttributes.normal,m=0;for(let x=0;x<8;x++){let M=a[x],A=M[0],b=M[1];A!==Number.MAX_SAFE_INTEGER&&b?(_&&u.getAttribute("morphTarget"+x)!==_[A]&&u.setAttribute("morphTarget"+x,_[A]),p&&u.getAttribute("morphNormal"+x)!==p[A]&&u.setAttribute("morphNormal"+x,p[A]),s[x]=b,m+=b):(_&&u.hasAttribute("morphTarget"+x)===!0&&u.deleteAttribute("morphTarget"+x),p&&u.hasAttribute("morphNormal"+x)===!0&&u.deleteAttribute("morphNormal"+x),s[x]=0)}let y=u.morphTargetsRelative?1:1-m;h.getUniforms().setValue(i,"morphTargetBaseInfluence",y),h.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function n0(i,t,e,n){let s=new WeakMap;function r(l){let c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){let c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}var io=class extends $e{constructor(t,e,n,s,r,o,a,l,c,u){if(u=u!==void 0?u:ui,u!==ui&&u!==ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===ui&&(n=Xn),n===void 0&&u===ts&&(n=hi),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Ce,this.minFilter=l!==void 0?l:Ce,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},au=new $e,lu=new io(1,1);lu.compareFunction=eu;var cu=new Jr,hu=new Oa,uu=new to,oh=[],ah=[],lh=new Float32Array(16),ch=new Float32Array(9),hh=new Float32Array(4);function as(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=oh[s];if(r===void 0&&(r=new Float32Array(s),oh[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Me(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function yo(i,t){let e=ah[t];e===void 0&&(e=new Int32Array(t),ah[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function i0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function s0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function r0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Me(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function o0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function a0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;hh.set(n),i.uniformMatrix2fv(this.addr,!1,hh),be(e,n)}}function l0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;ch.set(n),i.uniformMatrix3fv(this.addr,!1,ch),be(e,n)}}function c0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Me(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Me(e,n))return;lh.set(n),i.uniformMatrix4fv(this.addr,!1,lh),be(e,n)}}function h0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function u0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function d0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function f0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function p0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function m0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Me(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function g0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Me(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function _0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Me(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function x0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?lu:au;e.setTexture2D(t||r,s)}function y0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||hu,s)}function v0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||uu,s)}function M0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||cu,s)}function b0(i){switch(i){case 5126:return i0;case 35664:return s0;case 35665:return r0;case 35666:return o0;case 35674:return a0;case 35675:return l0;case 35676:return c0;case 5124:case 35670:return h0;case 35667:case 35671:return u0;case 35668:case 35672:return d0;case 35669:case 35673:return f0;case 5125:return p0;case 36294:return m0;case 36295:return g0;case 36296:return _0;case 35678:case 36198:case 36298:case 36306:case 35682:return x0;case 35679:case 36299:case 36307:return y0;case 35680:case 36300:case 36308:case 36293:return v0;case 36289:case 36303:case 36311:case 36292:return M0}}function S0(i,t){i.uniform1fv(this.addr,t)}function w0(i,t){let e=as(t,this.size,2);i.uniform2fv(this.addr,e)}function E0(i,t){let e=as(t,this.size,3);i.uniform3fv(this.addr,e)}function A0(i,t){let e=as(t,this.size,4);i.uniform4fv(this.addr,e)}function T0(i,t){let e=as(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function C0(i,t){let e=as(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function R0(i,t){let e=as(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function P0(i,t){i.uniform1iv(this.addr,t)}function L0(i,t){i.uniform2iv(this.addr,t)}function I0(i,t){i.uniform3iv(this.addr,t)}function U0(i,t){i.uniform4iv(this.addr,t)}function D0(i,t){i.uniform1uiv(this.addr,t)}function N0(i,t){i.uniform2uiv(this.addr,t)}function O0(i,t){i.uniform3uiv(this.addr,t)}function F0(i,t){i.uniform4uiv(this.addr,t)}function k0(i,t,e){let n=this.cache,s=t.length,r=yo(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||au,r[o])}function z0(i,t,e){let n=this.cache,s=t.length,r=yo(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||hu,r[o])}function B0(i,t,e){let n=this.cache,s=t.length,r=yo(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||uu,r[o])}function V0(i,t,e){let n=this.cache,s=t.length,r=yo(e,s);Me(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||cu,r[o])}function H0(i){switch(i){case 5126:return S0;case 35664:return w0;case 35665:return E0;case 35666:return A0;case 35674:return T0;case 35675:return C0;case 35676:return R0;case 5124:case 35670:return P0;case 35667:case 35671:return L0;case 35668:case 35672:return I0;case 35669:case 35673:return U0;case 5125:return D0;case 36294:return N0;case 36295:return O0;case 36296:return F0;case 35678:case 36198:case 36298:case 36306:case 35682:return k0;case 35679:case 36299:case 36307:return z0;case 35680:case 36300:case 36308:case 36293:return B0;case 36289:case 36303:case 36311:case 36292:return V0}}var za=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=b0(e.type)}},Ba=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=H0(e.type)}},Va=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Sa=/(\w+)(\])?(\[|\.)?/g;function uh(i,t){i.seq.push(t),i.map[t.id]=t}function G0(i,t,e){let n=i.name,s=n.length;for(Sa.lastIndex=0;;){let r=Sa.exec(n),o=Sa.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){uh(e,c===void 0?new za(a,i,t):new Ba(a,i,t));break}else{let h=e.map[a];h===void 0&&(h=new Va(a),uh(e,h)),e=h}}}var ji=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);G0(r,o,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function dh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var W0=37297,X0=0;function q0(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Y0(i){let t=te.getPrimaries(te.workingColorSpace),e=te.getPrimaries(i),n;switch(t===e?n="":t===Xr&&e===Wr?n="LinearDisplayP3ToLinearSRGB":t===Wr&&e===Xr&&(n="LinearSRGBToLinearDisplayP3"),i){case Pn:case xo:return[n,"LinearTransferOETF"];case me:case gl:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function fh(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+q0(i.getShaderSource(t),o)}else return s}function $0(i,t){let e=Y0(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Z0(i,t){let e;switch(t){case Qd:e="Linear";break;case tf:e="Reinhard";break;case ef:e="OptimizedCineon";break;case nf:e="ACESFilmic";break;case rf:e="AgX";break;case sf:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function j0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(qi).join(`
`)}function J0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(qi).join(`
`)}function K0(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Q0(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function qi(i){return i!==""}function ph(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function mh(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var t_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ha(i){return i.replace(t_,n_)}var e_=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function n_(i,t){let e=Ht[t];if(e===void 0){let n=e_.get(t);if(n!==void 0)e=Ht[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ha(e)}var i_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function gh(i){return i.replace(i_,s_)}function s_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _h(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function r_(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Gh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Td?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Tn&&(t="SHADOWMAP_TYPE_VSM"),t}function o_(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ji:case Ki:t="ENVMAP_TYPE_CUBE";break;case _o:t="ENVMAP_TYPE_CUBE_UV";break}return t}function a_(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ki:t="ENVMAP_MODE_REFRACTION";break}return t}function l_(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Wh:t="ENVMAP_BLENDING_MULTIPLY";break;case Jd:t="ENVMAP_BLENDING_MIX";break;case Kd:t="ENVMAP_BLENDING_ADD";break}return t}function c_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function h_(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=r_(e),c=o_(e),u=a_(e),h=l_(e),d=c_(e),f=e.isWebGL2?"":j0(e),g=J0(e),_=K0(r),p=s.createProgram(),m,y,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qi).join(`
`),m.length>0&&(m+=`
`),y=[f,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qi).join(`
`),y.length>0&&(y+=`
`)):(m=[_h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qi).join(`
`),y=[f,_h(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?Ht.tonemapping_pars_fragment:"",e.toneMapping!==Yn?Z0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,$0("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qi).join(`
`)),o=Ha(o),o=ph(o,e),o=mh(o,e),a=Ha(a),a=ph(a,e),a=mh(a,e),o=gh(o),a=gh(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,y=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Oc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Oc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);let M=x+m+o,A=x+y+a,b=dh(s,s.VERTEX_SHADER,M),S=dh(s,s.FRAGMENT_SHADER,A);s.attachShader(p,b),s.attachShader(p,S),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function P(G){if(i.debug.checkShaderErrors){let et=s.getProgramInfoLog(p).trim(),I=s.getShaderInfoLog(b).trim(),U=s.getShaderInfoLog(S).trim(),N=!0,W=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(N=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,b,S);else{let H=fh(s,b,"vertex"),z=fh(s,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+et+`
`+H+`
`+z)}else et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",et):(I===""||U==="")&&(W=!1);W&&(G.diagnostics={runnable:N,programLog:et,vertexShader:{log:I,prefix:m},fragmentShader:{log:U,prefix:y}})}s.deleteShader(b),s.deleteShader(S),v=new ji(s,p),w=Q0(s,p)}let v;this.getUniforms=function(){return v===void 0&&P(this),v};let w;this.getAttributes=function(){return w===void 0&&P(this),w};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(p,W0)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=X0++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=b,this.fragmentShader=S,this}var u_=0,Ga=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Wa(t),e.set(t,n)),n}},Wa=class{constructor(t){this.id=u_++,this.code=t,this.usedTimes=0}};function d_(i,t,e,n,s,r,o){let a=new Ds,l=new Ga,c=[],u=s.isWebGL2,h=s.logarithmicDepthBuffer,d=s.vertexTextures,f=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(v){return v===0?"uv":`uv${v}`}function p(v,w,O,G,et){let I=G.fog,U=et.geometry,N=v.isMeshStandardMaterial?G.environment:null,W=(v.isMeshStandardMaterial?e:t).get(v.envMap||N),H=W&&W.mapping===_o?W.image.height:null,z=g[v.type];v.precision!==null&&(f=s.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));let J=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,j=J!==void 0?J.length:0,Q=0;U.morphAttributes.position!==void 0&&(Q=1),U.morphAttributes.normal!==void 0&&(Q=2),U.morphAttributes.color!==void 0&&(Q=3);let F,V,K,k;if(z){let ze=mn[z];F=ze.vertexShader,V=ze.fragmentShader}else F=v.vertexShader,V=v.fragmentShader,l.update(v),K=l.getVertexShaderID(v),k=l.getFragmentShaderID(v);let tt=i.getRenderTarget(),gt=et.isInstancedMesh===!0,bt=et.isBatchedMesh===!0,Mt=!!v.map,Vt=!!v.matcap,X=!!W,fe=!!v.aoMap,wt=!!v.lightMap,Ut=!!v.bumpMap,yt=!!v.normalMap,Qt=!!v.displacementMap,Ot=!!v.emissiveMap,R=!!v.metalnessMap,E=!!v.roughnessMap,q=v.anisotropy>0,st=v.clearcoat>0,rt=v.iridescence>0,ot=v.sheen>0,St=v.transmission>0,_t=q&&!!v.anisotropyMap,vt=st&&!!v.clearcoatMap,It=st&&!!v.clearcoatNormalMap,zt=st&&!!v.clearcoatRoughnessMap,it=rt&&!!v.iridescenceMap,Zt=rt&&!!v.iridescenceThicknessMap,L=ot&&!!v.sheenColorMap,nt=ot&&!!v.sheenRoughnessMap,ft=!!v.specularMap,lt=!!v.specularColorMap,Et=!!v.specularIntensityMap,Xt=St&&!!v.transmissionMap,jt=St&&!!v.thicknessMap,Gt=!!v.gradientMap,dt=!!v.alphaMap,D=v.alphaTest>0,ht=!!v.alphaHash,ut=!!v.extensions,Pt=!!U.attributes.uv1,At=!!U.attributes.uv2,Jt=!!U.attributes.uv3,Kt=Yn;return v.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Kt=i.toneMapping),{isWebGL2:u,shaderID:z,shaderType:v.type,shaderName:v.name,vertexShader:F,fragmentShader:V,defines:v.defines,customVertexShaderID:K,customFragmentShaderID:k,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:bt,instancing:gt,instancingColor:gt&&et.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:Pn,map:Mt,matcap:Vt,envMap:X,envMapMode:X&&W.mapping,envMapCubeUVHeight:H,aoMap:fe,lightMap:wt,bumpMap:Ut,normalMap:yt,displacementMap:d&&Qt,emissiveMap:Ot,normalMapObjectSpace:yt&&v.normalMapType===_f,normalMapTangentSpace:yt&&v.normalMapType===tu,metalnessMap:R,roughnessMap:E,anisotropy:q,anisotropyMap:_t,clearcoat:st,clearcoatMap:vt,clearcoatNormalMap:It,clearcoatRoughnessMap:zt,iridescence:rt,iridescenceMap:it,iridescenceThicknessMap:Zt,sheen:ot,sheenColorMap:L,sheenRoughnessMap:nt,specularMap:ft,specularColorMap:lt,specularIntensityMap:Et,transmission:St,transmissionMap:Xt,thicknessMap:jt,gradientMap:Gt,opaque:v.transparent===!1&&v.blending===$i,alphaMap:dt,alphaTest:D,alphaHash:ht,combine:v.combine,mapUv:Mt&&_(v.map.channel),aoMapUv:fe&&_(v.aoMap.channel),lightMapUv:wt&&_(v.lightMap.channel),bumpMapUv:Ut&&_(v.bumpMap.channel),normalMapUv:yt&&_(v.normalMap.channel),displacementMapUv:Qt&&_(v.displacementMap.channel),emissiveMapUv:Ot&&_(v.emissiveMap.channel),metalnessMapUv:R&&_(v.metalnessMap.channel),roughnessMapUv:E&&_(v.roughnessMap.channel),anisotropyMapUv:_t&&_(v.anisotropyMap.channel),clearcoatMapUv:vt&&_(v.clearcoatMap.channel),clearcoatNormalMapUv:It&&_(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&_(v.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&_(v.iridescenceMap.channel),iridescenceThicknessMapUv:Zt&&_(v.iridescenceThicknessMap.channel),sheenColorMapUv:L&&_(v.sheenColorMap.channel),sheenRoughnessMapUv:nt&&_(v.sheenRoughnessMap.channel),specularMapUv:ft&&_(v.specularMap.channel),specularColorMapUv:lt&&_(v.specularColorMap.channel),specularIntensityMapUv:Et&&_(v.specularIntensityMap.channel),transmissionMapUv:Xt&&_(v.transmissionMap.channel),thicknessMapUv:jt&&_(v.thicknessMap.channel),alphaMapUv:dt&&_(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(yt||q),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:Pt,vertexUv2s:At,vertexUv3s:Jt,pointsUvs:et.isPoints===!0&&!!U.attributes.uv&&(Mt||dt),fog:!!I,useFog:v.fog===!0,fogExp2:I&&I.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:et.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:j,morphTextureStride:Q,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:Kt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Mt&&v.map.isVideoTexture===!0&&te.getTransfer(v.map.colorSpace)===re,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Oe,flipSided:v.side===Ye,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionDerivatives:ut&&v.extensions.derivatives===!0,extensionFragDepth:ut&&v.extensions.fragDepth===!0,extensionDrawBuffers:ut&&v.extensions.drawBuffers===!0,extensionShaderTextureLOD:ut&&v.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ut&&v.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()}}function m(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let O in v.defines)w.push(O),w.push(v.defines[O]);return v.isRawShaderMaterial===!1&&(y(w,v),x(w,v),w.push(i.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function y(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function x(v,w){a.disableAll(),w.isWebGL2&&a.enable(0),w.supportsVertexTextures&&a.enable(1),w.instancing&&a.enable(2),w.instancingColor&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),v.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.skinning&&a.enable(4),w.morphTargets&&a.enable(5),w.morphNormals&&a.enable(6),w.morphColors&&a.enable(7),w.premultipliedAlpha&&a.enable(8),w.shadowMapEnabled&&a.enable(9),w.useLegacyLights&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),v.push(a.mask)}function M(v){let w=g[v.type],O;if(w){let G=mn[w];O=ep.clone(G.uniforms)}else O=v.uniforms;return O}function A(v,w){let O;for(let G=0,et=c.length;G<et;G++){let I=c[G];if(I.cacheKey===w){O=I,++O.usedTimes;break}}return O===void 0&&(O=new h_(i,w,v,r),c.push(O)),O}function b(v){if(--v.usedTimes===0){let w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),v.destroy()}}function S(v){l.remove(v)}function P(){l.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:M,acquireProgram:A,releaseProgram:b,releaseShaderCache:S,programs:c,dispose:P}}function f_(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function p_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function xh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function yh(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(h,d,f,g,_,p){let m=i[t];return m===void 0?(m={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:_,group:p},i[t]=m):(m.id=h.id,m.object=h,m.geometry=d,m.material=f,m.groupOrder=g,m.renderOrder=h.renderOrder,m.z=_,m.group=p),t++,m}function a(h,d,f,g,_,p){let m=o(h,d,f,g,_,p);f.transmission>0?n.push(m):f.transparent===!0?s.push(m):e.push(m)}function l(h,d,f,g,_,p){let m=o(h,d,f,g,_,p);f.transmission>0?n.unshift(m):f.transparent===!0?s.unshift(m):e.unshift(m)}function c(h,d){e.length>1&&e.sort(h||p_),n.length>1&&n.sort(d||xh),s.length>1&&s.sort(d||xh)}function u(){for(let h=t,d=i.length;h<d;h++){let f=i[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function m_(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new yh,i.set(n,[o])):s>=r.length?(o=new yh,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function g_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Lt};break;case"SpotLight":e={position:new C,direction:new C,color:new Lt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Lt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Lt,groundColor:new Lt};break;case"RectAreaLight":e={color:new Lt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function __(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var x_=0;function y_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function v_(i,t){let e=new g_,n=__(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new C);let r=new C,o=new ct,a=new ct;function l(u,h){let d=0,f=0,g=0;for(let G=0;G<9;G++)s.probe[G].set(0,0,0);let _=0,p=0,m=0,y=0,x=0,M=0,A=0,b=0,S=0,P=0,v=0;u.sort(y_);let w=h===!0?Math.PI:1;for(let G=0,et=u.length;G<et;G++){let I=u[G],U=I.color,N=I.intensity,W=I.distance,H=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)d+=U.r*N*w,f+=U.g*N*w,g+=U.b*N*w;else if(I.isLightProbe){for(let z=0;z<9;z++)s.probe[z].addScaledVector(I.sh.coefficients[z],N);v++}else if(I.isDirectionalLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*w),I.castShadow){let J=I.shadow,j=n.get(I);j.shadowBias=J.bias,j.shadowNormalBias=J.normalBias,j.shadowRadius=J.radius,j.shadowMapSize=J.mapSize,s.directionalShadow[_]=j,s.directionalShadowMap[_]=H,s.directionalShadowMatrix[_]=I.shadow.matrix,M++}s.directional[_]=z,_++}else if(I.isSpotLight){let z=e.get(I);z.position.setFromMatrixPosition(I.matrixWorld),z.color.copy(U).multiplyScalar(N*w),z.distance=W,z.coneCos=Math.cos(I.angle),z.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),z.decay=I.decay,s.spot[m]=z;let J=I.shadow;if(I.map&&(s.spotLightMap[S]=I.map,S++,J.updateMatrices(I),I.castShadow&&P++),s.spotLightMatrix[m]=J.matrix,I.castShadow){let j=n.get(I);j.shadowBias=J.bias,j.shadowNormalBias=J.normalBias,j.shadowRadius=J.radius,j.shadowMapSize=J.mapSize,s.spotShadow[m]=j,s.spotShadowMap[m]=H,b++}m++}else if(I.isRectAreaLight){let z=e.get(I);z.color.copy(U).multiplyScalar(N),z.halfWidth.set(I.width*.5,0,0),z.halfHeight.set(0,I.height*.5,0),s.rectArea[y]=z,y++}else if(I.isPointLight){let z=e.get(I);if(z.color.copy(I.color).multiplyScalar(I.intensity*w),z.distance=I.distance,z.decay=I.decay,I.castShadow){let J=I.shadow,j=n.get(I);j.shadowBias=J.bias,j.shadowNormalBias=J.normalBias,j.shadowRadius=J.radius,j.shadowMapSize=J.mapSize,j.shadowCameraNear=J.camera.near,j.shadowCameraFar=J.camera.far,s.pointShadow[p]=j,s.pointShadowMap[p]=H,s.pointShadowMatrix[p]=I.shadow.matrix,A++}s.point[p]=z,p++}else if(I.isHemisphereLight){let z=e.get(I);z.skyColor.copy(I.color).multiplyScalar(N*w),z.groundColor.copy(I.groundColor).multiplyScalar(N*w),s.hemi[x]=z,x++}}y>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_FLOAT_1,s.rectAreaLTC2=pt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=pt.LTC_HALF_1,s.rectAreaLTC2=pt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=d,s.ambient[1]=f,s.ambient[2]=g;let O=s.hash;(O.directionalLength!==_||O.pointLength!==p||O.spotLength!==m||O.rectAreaLength!==y||O.hemiLength!==x||O.numDirectionalShadows!==M||O.numPointShadows!==A||O.numSpotShadows!==b||O.numSpotMaps!==S||O.numLightProbes!==v)&&(s.directional.length=_,s.spot.length=m,s.rectArea.length=y,s.point.length=p,s.hemi.length=x,s.directionalShadow.length=M,s.directionalShadowMap.length=M,s.pointShadow.length=A,s.pointShadowMap.length=A,s.spotShadow.length=b,s.spotShadowMap.length=b,s.directionalShadowMatrix.length=M,s.pointShadowMatrix.length=A,s.spotLightMatrix.length=b+S-P,s.spotLightMap.length=S,s.numSpotLightShadowsWithMaps=P,s.numLightProbes=v,O.directionalLength=_,O.pointLength=p,O.spotLength=m,O.rectAreaLength=y,O.hemiLength=x,O.numDirectionalShadows=M,O.numPointShadows=A,O.numSpotShadows=b,O.numSpotMaps=S,O.numLightProbes=v,s.version=x_++)}function c(u,h){let d=0,f=0,g=0,_=0,p=0,m=h.matrixWorldInverse;for(let y=0,x=u.length;y<x;y++){let M=u[y];if(M.isDirectionalLight){let A=s.directional[d];A.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(m),d++}else if(M.isSpotLight){let A=s.spot[g];A.position.setFromMatrixPosition(M.matrixWorld),A.position.applyMatrix4(m),A.direction.setFromMatrixPosition(M.matrixWorld),r.setFromMatrixPosition(M.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(m),g++}else if(M.isRectAreaLight){let A=s.rectArea[_];A.position.setFromMatrixPosition(M.matrixWorld),A.position.applyMatrix4(m),a.identity(),o.copy(M.matrixWorld),o.premultiply(m),a.extractRotation(o),A.halfWidth.set(M.width*.5,0,0),A.halfHeight.set(0,M.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),_++}else if(M.isPointLight){let A=s.point[f];A.position.setFromMatrixPosition(M.matrixWorld),A.position.applyMatrix4(m),f++}else if(M.isHemisphereLight){let A=s.hemi[p];A.direction.setFromMatrixPosition(M.matrixWorld),A.direction.transformDirection(m),p++}}}return{setup:l,setupView:c,state:s}}function vh(i,t){let e=new v_(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function o(h){n.push(h)}function a(h){s.push(h)}function l(h){e.setup(n,h)}function c(h){e.setupView(n,h)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function M_(i,t){let e=new WeakMap;function n(r,o=0){let a=e.get(r),l;return a===void 0?(l=new vh(i,t),e.set(r,[l])):o>=a.length?(l=new vh(i,t),a.push(l)):l=a[o],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Xa=class extends In{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},qa=class extends In{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},b_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,S_=`uniform sampler2D shadow_pass;
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
}`;function w_(i,t,e){let n=new Ns,s=new Rt,r=new Rt,o=new le,a=new Xa({depthPacking:gf}),l=new qa,c={},u=e.maxTextureSize,h={[Zn]:Ye,[Ye]:Zn,[Oe]:Oe},d=new Un({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Rt},radius:{value:4}},vertexShader:b_,fragmentShader:S_}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new ee;g.setAttribute("position",new _e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new mt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Gh;let m=this.type;this.render=function(b,S,P){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;let v=i.getRenderTarget(),w=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),G=i.state;G.setBlending(qn),G.buffers.color.setClear(1,1,1,1),G.buffers.depth.setTest(!0),G.setScissorTest(!1);let et=m!==Tn&&this.type===Tn,I=m===Tn&&this.type!==Tn;for(let U=0,N=b.length;U<N;U++){let W=b[U],H=W.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let z=H.getFrameExtents();if(s.multiply(z),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/z.x),s.x=r.x*z.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/z.y),s.y=r.y*z.y,H.mapSize.y=r.y)),H.map===null||et===!0||I===!0){let j=this.type!==Tn?{minFilter:Ce,magFilter:Ce}:{};H.map!==null&&H.map.dispose(),H.map=new hn(s.x,s.y,j),H.map.texture.name=W.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();let J=H.getViewportCount();for(let j=0;j<J;j++){let Q=H.getViewport(j);o.set(r.x*Q.x,r.y*Q.y,r.x*Q.z,r.y*Q.w),G.viewport(o),H.updateMatrices(W,j),n=H.getFrustum(),M(S,P,H.camera,W,this.type)}H.isPointLightShadow!==!0&&this.type===Tn&&y(H,P),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(v,w,O)};function y(b,S){let P=t.update(_);d.defines.VSM_SAMPLES!==b.blurSamples&&(d.defines.VSM_SAMPLES=b.blurSamples,f.defines.VSM_SAMPLES=b.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new hn(s.x,s.y)),d.uniforms.shadow_pass.value=b.map.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(S,null,P,d,_,null),f.uniforms.shadow_pass.value=b.mapPass.texture,f.uniforms.resolution.value=b.mapSize,f.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(S,null,P,f,_,null)}function x(b,S,P,v){let w=null,O=P.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(O!==void 0)w=O;else if(w=P.isPointLight===!0?l:a,i.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0){let G=w.uuid,et=S.uuid,I=c[G];I===void 0&&(I={},c[G]=I);let U=I[et];U===void 0&&(U=w.clone(),I[et]=U,S.addEventListener("dispose",A)),w=U}if(w.visible=S.visible,w.wireframe=S.wireframe,v===Tn?w.side=S.shadowSide!==null?S.shadowSide:S.side:w.side=S.shadowSide!==null?S.shadowSide:h[S.side],w.alphaMap=S.alphaMap,w.alphaTest=S.alphaTest,w.map=S.map,w.clipShadows=S.clipShadows,w.clippingPlanes=S.clippingPlanes,w.clipIntersection=S.clipIntersection,w.displacementMap=S.displacementMap,w.displacementScale=S.displacementScale,w.displacementBias=S.displacementBias,w.wireframeLinewidth=S.wireframeLinewidth,w.linewidth=S.linewidth,P.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let G=i.properties.get(w);G.light=P}return w}function M(b,S,P,v,w){if(b.visible===!1)return;if(b.layers.test(S.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&w===Tn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,b.matrixWorld);let et=t.update(b),I=b.material;if(Array.isArray(I)){let U=et.groups;for(let N=0,W=U.length;N<W;N++){let H=U[N],z=I[H.materialIndex];if(z&&z.visible){let J=x(b,z,v,w);b.onBeforeShadow(i,b,S,P,et,J,H),i.renderBufferDirect(P,null,et,J,b,H),b.onAfterShadow(i,b,S,P,et,J,H)}}}else if(I.visible){let U=x(b,I,v,w);b.onBeforeShadow(i,b,S,P,et,U,null),i.renderBufferDirect(P,null,et,U,b,null),b.onAfterShadow(i,b,S,P,et,U,null)}}let G=b.children;for(let et=0,I=G.length;et<I;et++)M(G[et],S,P,v,w)}function A(b){b.target.removeEventListener("dispose",A);for(let P in c){let v=c[P],w=b.target.uuid;w in v&&(v[w].dispose(),delete v[w])}}}function E_(i,t,e){let n=e.isWebGL2;function s(){let D=!1,ht=new le,ut=null,Pt=new le(0,0,0,0);return{setMask:function(At){ut!==At&&!D&&(i.colorMask(At,At,At,At),ut=At)},setLocked:function(At){D=At},setClear:function(At,Jt,Kt,we,ze){ze===!0&&(At*=we,Jt*=we,Kt*=we),ht.set(At,Jt,Kt,we),Pt.equals(ht)===!1&&(i.clearColor(At,Jt,Kt,we),Pt.copy(ht))},reset:function(){D=!1,ut=null,Pt.set(-1,0,0,0)}}}function r(){let D=!1,ht=null,ut=null,Pt=null;return{setTest:function(At){At?bt(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(At){ht!==At&&!D&&(i.depthMask(At),ht=At)},setFunc:function(At){if(ut!==At){switch(At){case Wd:i.depthFunc(i.NEVER);break;case Xd:i.depthFunc(i.ALWAYS);break;case qd:i.depthFunc(i.LESS);break;case Br:i.depthFunc(i.LEQUAL);break;case Yd:i.depthFunc(i.EQUAL);break;case $d:i.depthFunc(i.GEQUAL);break;case Zd:i.depthFunc(i.GREATER);break;case jd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ut=At}},setLocked:function(At){D=At},setClear:function(At){Pt!==At&&(i.clearDepth(At),Pt=At)},reset:function(){D=!1,ht=null,ut=null,Pt=null}}}function o(){let D=!1,ht=null,ut=null,Pt=null,At=null,Jt=null,Kt=null,we=null,ze=null;return{setTest:function(se){D||(se?bt(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(se){ht!==se&&!D&&(i.stencilMask(se),ht=se)},setFunc:function(se,Be,pn){(ut!==se||Pt!==Be||At!==pn)&&(i.stencilFunc(se,Be,pn),ut=se,Pt=Be,At=pn)},setOp:function(se,Be,pn){(Jt!==se||Kt!==Be||we!==pn)&&(i.stencilOp(se,Be,pn),Jt=se,Kt=Be,we=pn)},setLocked:function(se){D=se},setClear:function(se){ze!==se&&(i.clearStencil(se),ze=se)},reset:function(){D=!1,ht=null,ut=null,Pt=null,At=null,Jt=null,Kt=null,we=null,ze=null}}}let a=new s,l=new r,c=new o,u=new WeakMap,h=new WeakMap,d={},f={},g=new WeakMap,_=[],p=null,m=!1,y=null,x=null,M=null,A=null,b=null,S=null,P=null,v=new Lt(0,0,0),w=0,O=!1,G=null,et=null,I=null,U=null,N=null,W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,z=0,J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(J)[1]),H=z>=1):J.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),H=z>=2);let j=null,Q={},F=i.getParameter(i.SCISSOR_BOX),V=i.getParameter(i.VIEWPORT),K=new le().fromArray(F),k=new le().fromArray(V);function tt(D,ht,ut,Pt){let At=new Uint8Array(4),Jt=i.createTexture();i.bindTexture(D,Jt),i.texParameteri(D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(D,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Kt=0;Kt<ut;Kt++)n&&(D===i.TEXTURE_3D||D===i.TEXTURE_2D_ARRAY)?i.texImage3D(ht,0,i.RGBA,1,1,Pt,0,i.RGBA,i.UNSIGNED_BYTE,At):i.texImage2D(ht+Kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,At);return Jt}let gt={};gt[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),gt[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(gt[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),gt[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),l.setClear(1),c.setClear(0),bt(i.DEPTH_TEST),l.setFunc(Br),Ot(!1),R(Kl),bt(i.CULL_FACE),yt(qn);function bt(D){d[D]!==!0&&(i.enable(D),d[D]=!0)}function Mt(D){d[D]!==!1&&(i.disable(D),d[D]=!1)}function Vt(D,ht){return f[D]!==ht?(i.bindFramebuffer(D,ht),f[D]=ht,n&&(D===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ht),D===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ht)),!0):!1}function X(D,ht){let ut=_,Pt=!1;if(D)if(ut=g.get(ht),ut===void 0&&(ut=[],g.set(ht,ut)),D.isWebGLMultipleRenderTargets){let At=D.texture;if(ut.length!==At.length||ut[0]!==i.COLOR_ATTACHMENT0){for(let Jt=0,Kt=At.length;Jt<Kt;Jt++)ut[Jt]=i.COLOR_ATTACHMENT0+Jt;ut.length=At.length,Pt=!0}}else ut[0]!==i.COLOR_ATTACHMENT0&&(ut[0]=i.COLOR_ATTACHMENT0,Pt=!0);else ut[0]!==i.BACK&&(ut[0]=i.BACK,Pt=!0);Pt&&(e.isWebGL2?i.drawBuffers(ut):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ut))}function fe(D){return p!==D?(i.useProgram(D),p=D,!0):!1}let wt={[li]:i.FUNC_ADD,[Rd]:i.FUNC_SUBTRACT,[Pd]:i.FUNC_REVERSE_SUBTRACT};if(n)wt[nc]=i.MIN,wt[ic]=i.MAX;else{let D=t.get("EXT_blend_minmax");D!==null&&(wt[nc]=D.MIN_EXT,wt[ic]=D.MAX_EXT)}let Ut={[Ld]:i.ZERO,[Id]:i.ONE,[Ud]:i.SRC_COLOR,[Ca]:i.SRC_ALPHA,[zd]:i.SRC_ALPHA_SATURATE,[Fd]:i.DST_COLOR,[Nd]:i.DST_ALPHA,[Dd]:i.ONE_MINUS_SRC_COLOR,[Ra]:i.ONE_MINUS_SRC_ALPHA,[kd]:i.ONE_MINUS_DST_COLOR,[Od]:i.ONE_MINUS_DST_ALPHA,[Bd]:i.CONSTANT_COLOR,[Vd]:i.ONE_MINUS_CONSTANT_COLOR,[Hd]:i.CONSTANT_ALPHA,[Gd]:i.ONE_MINUS_CONSTANT_ALPHA};function yt(D,ht,ut,Pt,At,Jt,Kt,we,ze,se){if(D===qn){m===!0&&(Mt(i.BLEND),m=!1);return}if(m===!1&&(bt(i.BLEND),m=!0),D!==Cd){if(D!==y||se!==O){if((x!==li||b!==li)&&(i.blendEquation(i.FUNC_ADD),x=li,b=li),se)switch(D){case $i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ql:i.blendFunc(i.ONE,i.ONE);break;case tc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ec:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ql:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case tc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ec:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}M=null,A=null,S=null,P=null,v.set(0,0,0),w=0,y=D,O=se}return}At=At||ht,Jt=Jt||ut,Kt=Kt||Pt,(ht!==x||At!==b)&&(i.blendEquationSeparate(wt[ht],wt[At]),x=ht,b=At),(ut!==M||Pt!==A||Jt!==S||Kt!==P)&&(i.blendFuncSeparate(Ut[ut],Ut[Pt],Ut[Jt],Ut[Kt]),M=ut,A=Pt,S=Jt,P=Kt),(we.equals(v)===!1||ze!==w)&&(i.blendColor(we.r,we.g,we.b,ze),v.copy(we),w=ze),y=D,O=!1}function Qt(D,ht){D.side===Oe?Mt(i.CULL_FACE):bt(i.CULL_FACE);let ut=D.side===Ye;ht&&(ut=!ut),Ot(ut),D.blending===$i&&D.transparent===!1?yt(qn):yt(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),l.setFunc(D.depthFunc),l.setTest(D.depthTest),l.setMask(D.depthWrite),a.setMask(D.colorWrite);let Pt=D.stencilWrite;c.setTest(Pt),Pt&&(c.setMask(D.stencilWriteMask),c.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),c.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),q(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?bt(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ot(D){G!==D&&(D?i.frontFace(i.CW):i.frontFace(i.CCW),G=D)}function R(D){D!==Ed?(bt(i.CULL_FACE),D!==et&&(D===Kl?i.cullFace(i.BACK):D===Ad?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),et=D}function E(D){D!==I&&(H&&i.lineWidth(D),I=D)}function q(D,ht,ut){D?(bt(i.POLYGON_OFFSET_FILL),(U!==ht||N!==ut)&&(i.polygonOffset(ht,ut),U=ht,N=ut)):Mt(i.POLYGON_OFFSET_FILL)}function st(D){D?bt(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function rt(D){D===void 0&&(D=i.TEXTURE0+W-1),j!==D&&(i.activeTexture(D),j=D)}function ot(D,ht,ut){ut===void 0&&(j===null?ut=i.TEXTURE0+W-1:ut=j);let Pt=Q[ut];Pt===void 0&&(Pt={type:void 0,texture:void 0},Q[ut]=Pt),(Pt.type!==D||Pt.texture!==ht)&&(j!==ut&&(i.activeTexture(ut),j=ut),i.bindTexture(D,ht||gt[D]),Pt.type=D,Pt.texture=ht)}function St(){let D=Q[j];D!==void 0&&D.type!==void 0&&(i.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function _t(){try{i.compressedTexImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function vt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function It(){try{i.texSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function zt(){try{i.texSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function it(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Zt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function L(){try{i.texStorage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function nt(){try{i.texStorage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ft(){try{i.texImage2D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function lt(){try{i.texImage3D.apply(i,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Et(D){K.equals(D)===!1&&(i.scissor(D.x,D.y,D.z,D.w),K.copy(D))}function Xt(D){k.equals(D)===!1&&(i.viewport(D.x,D.y,D.z,D.w),k.copy(D))}function jt(D,ht){let ut=h.get(ht);ut===void 0&&(ut=new WeakMap,h.set(ht,ut));let Pt=ut.get(D);Pt===void 0&&(Pt=i.getUniformBlockIndex(ht,D.name),ut.set(D,Pt))}function Gt(D,ht){let Pt=h.get(ht).get(D);u.get(ht)!==Pt&&(i.uniformBlockBinding(ht,Pt,D.__bindingPointIndex),u.set(ht,Pt))}function dt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},j=null,Q={},f={},g=new WeakMap,_=[],p=null,m=!1,y=null,x=null,M=null,A=null,b=null,S=null,P=null,v=new Lt(0,0,0),w=0,O=!1,G=null,et=null,I=null,U=null,N=null,K.set(0,0,i.canvas.width,i.canvas.height),k.set(0,0,i.canvas.width,i.canvas.height),a.reset(),l.reset(),c.reset()}return{buffers:{color:a,depth:l,stencil:c},enable:bt,disable:Mt,bindFramebuffer:Vt,drawBuffers:X,useProgram:fe,setBlending:yt,setMaterial:Qt,setFlipSided:Ot,setCullFace:R,setLineWidth:E,setPolygonOffset:q,setScissorTest:st,activeTexture:rt,bindTexture:ot,unbindTexture:St,compressedTexImage2D:_t,compressedTexImage3D:vt,texImage2D:ft,texImage3D:lt,updateUBOMapping:jt,uniformBlockBinding:Gt,texStorage2D:L,texStorage3D:nt,texSubImage2D:It,texSubImage3D:zt,compressedTexSubImage2D:it,compressedTexSubImage3D:Zt,scissor:Et,viewport:Xt,reset:dt}}function A_(i,t,e,n,s,r,o){let a=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,h,d=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,E){return f?new OffscreenCanvas(R,E):$r("canvas")}function _(R,E,q,st){let rt=1;if((R.width>st||R.height>st)&&(rt=st/Math.max(R.width,R.height)),rt<1||E===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){let ot=E?Yr:Math.floor,St=ot(rt*R.width),_t=ot(rt*R.height);h===void 0&&(h=g(St,_t));let vt=q?g(St,_t):h;return vt.width=St,vt.height=_t,vt.getContext("2d").drawImage(R,0,0,St,_t),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+St+"x"+_t+")."),vt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function p(R){return Da(R.width)&&Da(R.height)}function m(R){return a?!1:R.wrapS!==Qe||R.wrapT!==Qe||R.minFilter!==Ce&&R.minFilter!==Re}function y(R,E){return R.generateMipmaps&&E&&R.minFilter!==Ce&&R.minFilter!==Re}function x(R){i.generateMipmap(R)}function M(R,E,q,st,rt=!1){if(a===!1)return E;if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ot=E;if(E===i.RED&&(q===i.FLOAT&&(ot=i.R32F),q===i.HALF_FLOAT&&(ot=i.R16F),q===i.UNSIGNED_BYTE&&(ot=i.R8)),E===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(ot=i.R8UI),q===i.UNSIGNED_SHORT&&(ot=i.R16UI),q===i.UNSIGNED_INT&&(ot=i.R32UI),q===i.BYTE&&(ot=i.R8I),q===i.SHORT&&(ot=i.R16I),q===i.INT&&(ot=i.R32I)),E===i.RG&&(q===i.FLOAT&&(ot=i.RG32F),q===i.HALF_FLOAT&&(ot=i.RG16F),q===i.UNSIGNED_BYTE&&(ot=i.RG8)),E===i.RGBA){let St=rt?Gr:te.getTransfer(st);q===i.FLOAT&&(ot=i.RGBA32F),q===i.HALF_FLOAT&&(ot=i.RGBA16F),q===i.UNSIGNED_BYTE&&(ot=St===re?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT_4_4_4_4&&(ot=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(ot=i.RGB5_A1)}return(ot===i.R16F||ot===i.R32F||ot===i.RG16F||ot===i.RG32F||ot===i.RGBA16F||ot===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ot}function A(R,E,q){return y(R,q)===!0||R.isFramebufferTexture&&R.minFilter!==Ce&&R.minFilter!==Re?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function b(R){return R===Ce||R===rc||R===Zo?i.NEAREST:i.LINEAR}function S(R){let E=R.target;E.removeEventListener("dispose",S),v(E),E.isVideoTexture&&u.delete(E)}function P(R){let E=R.target;E.removeEventListener("dispose",P),O(E)}function v(R){let E=n.get(R);if(E.__webglInit===void 0)return;let q=R.source,st=d.get(q);if(st){let rt=st[E.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&w(R),Object.keys(st).length===0&&d.delete(q)}n.remove(R)}function w(R){let E=n.get(R);i.deleteTexture(E.__webglTexture);let q=R.source,st=d.get(q);delete st[E.__cacheKey],o.memory.textures--}function O(R){let E=R.texture,q=n.get(R),st=n.get(E);if(st.__webglTexture!==void 0&&(i.deleteTexture(st.__webglTexture),o.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(q.__webglFramebuffer[rt]))for(let ot=0;ot<q.__webglFramebuffer[rt].length;ot++)i.deleteFramebuffer(q.__webglFramebuffer[rt][ot]);else i.deleteFramebuffer(q.__webglFramebuffer[rt]);q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer[rt])}else{if(Array.isArray(q.__webglFramebuffer))for(let rt=0;rt<q.__webglFramebuffer.length;rt++)i.deleteFramebuffer(q.__webglFramebuffer[rt]);else i.deleteFramebuffer(q.__webglFramebuffer);if(q.__webglDepthbuffer&&i.deleteRenderbuffer(q.__webglDepthbuffer),q.__webglMultisampledFramebuffer&&i.deleteFramebuffer(q.__webglMultisampledFramebuffer),q.__webglColorRenderbuffer)for(let rt=0;rt<q.__webglColorRenderbuffer.length;rt++)q.__webglColorRenderbuffer[rt]&&i.deleteRenderbuffer(q.__webglColorRenderbuffer[rt]);q.__webglDepthRenderbuffer&&i.deleteRenderbuffer(q.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let rt=0,ot=E.length;rt<ot;rt++){let St=n.get(E[rt]);St.__webglTexture&&(i.deleteTexture(St.__webglTexture),o.memory.textures--),n.remove(E[rt])}n.remove(E),n.remove(R)}let G=0;function et(){G=0}function I(){let R=G;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),G+=1,R}function U(R){let E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function N(R,E){let q=n.get(R);if(R.isVideoTexture&&Qt(R),R.isRenderTargetTexture===!1&&R.version>0&&q.__version!==R.version){let st=R.image;if(st===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(q,R,E);return}}e.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+E)}function W(R,E){let q=n.get(R);if(R.version>0&&q.__version!==R.version){K(q,R,E);return}e.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+E)}function H(R,E){let q=n.get(R);if(R.version>0&&q.__version!==R.version){K(q,R,E);return}e.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+E)}function z(R,E){let q=n.get(R);if(R.version>0&&q.__version!==R.version){k(q,R,E);return}e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+E)}let J={[Qi]:i.REPEAT,[Qe]:i.CLAMP_TO_EDGE,[Ia]:i.MIRRORED_REPEAT},j={[Ce]:i.NEAREST,[rc]:i.NEAREST_MIPMAP_NEAREST,[Zo]:i.NEAREST_MIPMAP_LINEAR,[Re]:i.LINEAR,[of]:i.LINEAR_MIPMAP_NEAREST,[gn]:i.LINEAR_MIPMAP_LINEAR},Q={[xf]:i.NEVER,[wf]:i.ALWAYS,[yf]:i.LESS,[eu]:i.LEQUAL,[vf]:i.EQUAL,[Sf]:i.GEQUAL,[Mf]:i.GREATER,[bf]:i.NOTEQUAL};function F(R,E,q){if(q?(i.texParameteri(R,i.TEXTURE_WRAP_S,J[E.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,J[E.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,J[E.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,j[E.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,j[E.minFilter])):(i.texParameteri(R,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(R,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(E.wrapS!==Qe||E.wrapT!==Qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(R,i.TEXTURE_MAG_FILTER,b(E.magFilter)),i.texParameteri(R,i.TEXTURE_MIN_FILTER,b(E.minFilter)),E.minFilter!==Ce&&E.minFilter!==Re&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),E.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,Q[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let st=t.get("EXT_texture_filter_anisotropic");if(E.magFilter===Ce||E.minFilter!==Zo&&E.minFilter!==gn||E.type===Cn&&t.has("OES_texture_float_linear")===!1||a===!1&&E.type===Is&&t.has("OES_texture_half_float_linear")===!1)return;(E.anisotropy>1||n.get(E).__currentAnisotropy)&&(i.texParameterf(R,st.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy)}}function V(R,E){let q=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",S));let st=E.source,rt=d.get(st);rt===void 0&&(rt={},d.set(st,rt));let ot=U(E);if(ot!==R.__cacheKey){rt[ot]===void 0&&(rt[ot]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),rt[ot].usedTimes++;let St=rt[R.__cacheKey];St!==void 0&&(rt[R.__cacheKey].usedTimes--,St.usedTimes===0&&w(E)),R.__cacheKey=ot,R.__webglTexture=rt[ot].texture}return q}function K(R,E,q){let st=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(st=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(st=i.TEXTURE_3D);let rt=V(R,E),ot=E.source;e.bindTexture(st,R.__webglTexture,i.TEXTURE0+q);let St=n.get(ot);if(ot.version!==St.__version||rt===!0){e.activeTexture(i.TEXTURE0+q);let _t=te.getPrimaries(te.workingColorSpace),vt=E.colorSpace===qe?null:te.getPrimaries(E.colorSpace),It=E.colorSpace===qe||_t===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,It);let zt=m(E)&&p(E.image)===!1,it=_(E.image,zt,!1,s.maxTextureSize);it=Ot(E,it);let Zt=p(it)||a,L=r.convert(E.format,E.colorSpace),nt=r.convert(E.type),ft=M(E.internalFormat,L,nt,E.colorSpace,E.isVideoTexture);F(st,E,Zt);let lt,Et=E.mipmaps,Xt=a&&E.isVideoTexture!==!0&&ft!==Kh,jt=St.__version===void 0||rt===!0,Gt=A(E,it,Zt);if(E.isDepthTexture)ft=i.DEPTH_COMPONENT,a?E.type===Cn?ft=i.DEPTH_COMPONENT32F:E.type===Xn?ft=i.DEPTH_COMPONENT24:E.type===hi?ft=i.DEPTH24_STENCIL8:ft=i.DEPTH_COMPONENT16:E.type===Cn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),E.format===ui&&ft===i.DEPTH_COMPONENT&&E.type!==ml&&E.type!==Xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),E.type=Xn,nt=r.convert(E.type)),E.format===ts&&ft===i.DEPTH_COMPONENT&&(ft=i.DEPTH_STENCIL,E.type!==hi&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),E.type=hi,nt=r.convert(E.type))),jt&&(Xt?e.texStorage2D(i.TEXTURE_2D,1,ft,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,ft,it.width,it.height,0,L,nt,null));else if(E.isDataTexture)if(Et.length>0&&Zt){Xt&&jt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,Et[0].width,Et[0].height);for(let dt=0,D=Et.length;dt<D;dt++)lt=Et[dt],Xt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,lt.width,lt.height,L,nt,lt.data):e.texImage2D(i.TEXTURE_2D,dt,ft,lt.width,lt.height,0,L,nt,lt.data);E.generateMipmaps=!1}else Xt?(jt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,L,nt,it.data)):e.texImage2D(i.TEXTURE_2D,0,ft,it.width,it.height,0,L,nt,it.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Xt&&jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,ft,Et[0].width,Et[0].height,it.depth);for(let dt=0,D=Et.length;dt<D;dt++)lt=Et[dt],E.format!==Xe?L!==null?Xt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,lt.width,lt.height,it.depth,L,lt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,ft,lt.width,lt.height,it.depth,0,lt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,lt.width,lt.height,it.depth,L,nt,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,ft,lt.width,lt.height,it.depth,0,L,nt,lt.data)}else{Xt&&jt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,Et[0].width,Et[0].height);for(let dt=0,D=Et.length;dt<D;dt++)lt=Et[dt],E.format!==Xe?L!==null?Xt?e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,lt.width,lt.height,L,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,ft,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,lt.width,lt.height,L,nt,lt.data):e.texImage2D(i.TEXTURE_2D,dt,ft,lt.width,lt.height,0,L,nt,lt.data)}else if(E.isDataArrayTexture)Xt?(jt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Gt,ft,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,L,nt,it.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ft,it.width,it.height,it.depth,0,L,nt,it.data);else if(E.isData3DTexture)Xt?(jt&&e.texStorage3D(i.TEXTURE_3D,Gt,ft,it.width,it.height,it.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,L,nt,it.data)):e.texImage3D(i.TEXTURE_3D,0,ft,it.width,it.height,it.depth,0,L,nt,it.data);else if(E.isFramebufferTexture){if(jt)if(Xt)e.texStorage2D(i.TEXTURE_2D,Gt,ft,it.width,it.height);else{let dt=it.width,D=it.height;for(let ht=0;ht<Gt;ht++)e.texImage2D(i.TEXTURE_2D,ht,ft,dt,D,0,L,nt,null),dt>>=1,D>>=1}}else if(Et.length>0&&Zt){Xt&&jt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,Et[0].width,Et[0].height);for(let dt=0,D=Et.length;dt<D;dt++)lt=Et[dt],Xt?e.texSubImage2D(i.TEXTURE_2D,dt,0,0,L,nt,lt):e.texImage2D(i.TEXTURE_2D,dt,ft,L,nt,lt);E.generateMipmaps=!1}else Xt?(jt&&e.texStorage2D(i.TEXTURE_2D,Gt,ft,it.width,it.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,L,nt,it)):e.texImage2D(i.TEXTURE_2D,0,ft,L,nt,it);y(E,Zt)&&x(st),St.__version=ot.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function k(R,E,q){if(E.image.length!==6)return;let st=V(R,E),rt=E.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+q);let ot=n.get(rt);if(rt.version!==ot.__version||st===!0){e.activeTexture(i.TEXTURE0+q);let St=te.getPrimaries(te.workingColorSpace),_t=E.colorSpace===qe?null:te.getPrimaries(E.colorSpace),vt=E.colorSpace===qe||St===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);let It=E.isCompressedTexture||E.image[0].isCompressedTexture,zt=E.image[0]&&E.image[0].isDataTexture,it=[];for(let dt=0;dt<6;dt++)!It&&!zt?it[dt]=_(E.image[dt],!1,!0,s.maxCubemapSize):it[dt]=zt?E.image[dt].image:E.image[dt],it[dt]=Ot(E,it[dt]);let Zt=it[0],L=p(Zt)||a,nt=r.convert(E.format,E.colorSpace),ft=r.convert(E.type),lt=M(E.internalFormat,nt,ft,E.colorSpace),Et=a&&E.isVideoTexture!==!0,Xt=ot.__version===void 0||st===!0,jt=A(E,Zt,L);F(i.TEXTURE_CUBE_MAP,E,L);let Gt;if(It){Et&&Xt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,jt,lt,Zt.width,Zt.height);for(let dt=0;dt<6;dt++){Gt=it[dt].mipmaps;for(let D=0;D<Gt.length;D++){let ht=Gt[D];E.format!==Xe?nt!==null?Et?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D,0,0,ht.width,ht.height,nt,ht.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D,lt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Et?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D,0,0,ht.width,ht.height,nt,ft,ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D,lt,ht.width,ht.height,0,nt,ft,ht.data)}}}else{Gt=E.mipmaps,Et&&Xt&&(Gt.length>0&&jt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,jt,lt,it[0].width,it[0].height));for(let dt=0;dt<6;dt++)if(zt){Et?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,it[dt].width,it[dt].height,nt,ft,it[dt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,lt,it[dt].width,it[dt].height,0,nt,ft,it[dt].data);for(let D=0;D<Gt.length;D++){let ut=Gt[D].image[dt].image;Et?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D+1,0,0,ut.width,ut.height,nt,ft,ut.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D+1,lt,ut.width,ut.height,0,nt,ft,ut.data)}}else{Et?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,nt,ft,it[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,lt,nt,ft,it[dt]);for(let D=0;D<Gt.length;D++){let ht=Gt[D];Et?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D+1,0,0,nt,ft,ht.image[dt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,D+1,lt,nt,ft,ht.image[dt])}}}y(E,L)&&x(i.TEXTURE_CUBE_MAP),ot.__version=rt.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function tt(R,E,q,st,rt,ot){let St=r.convert(q.format,q.colorSpace),_t=r.convert(q.type),vt=M(q.internalFormat,St,_t,q.colorSpace);if(!n.get(E).__hasExternalTextures){let zt=Math.max(1,E.width>>ot),it=Math.max(1,E.height>>ot);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,ot,vt,zt,it,E.depth,0,St,_t,null):e.texImage2D(rt,ot,vt,zt,it,0,St,_t,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),yt(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,st,rt,n.get(q).__webglTexture,0,Ut(E)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,st,rt,n.get(q).__webglTexture,ot),e.bindFramebuffer(i.FRAMEBUFFER,null)}function gt(R,E,q){if(i.bindRenderbuffer(i.RENDERBUFFER,R),E.depthBuffer&&!E.stencilBuffer){let st=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(q||yt(E)){let rt=E.depthTexture;rt&&rt.isDepthTexture&&(rt.type===Cn?st=i.DEPTH_COMPONENT32F:rt.type===Xn&&(st=i.DEPTH_COMPONENT24));let ot=Ut(E);yt(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,st,E.width,E.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,st,E.width,E.height)}else i.renderbufferStorage(i.RENDERBUFFER,st,E.width,E.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,R)}else if(E.depthBuffer&&E.stencilBuffer){let st=Ut(E);q&&yt(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,st,i.DEPTH24_STENCIL8,E.width,E.height):yt(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,i.DEPTH24_STENCIL8,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,R)}else{let st=E.isWebGLMultipleRenderTargets===!0?E.texture:[E.texture];for(let rt=0;rt<st.length;rt++){let ot=st[rt],St=r.convert(ot.format,ot.colorSpace),_t=r.convert(ot.type),vt=M(ot.internalFormat,St,_t,ot.colorSpace),It=Ut(E);q&&yt(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,It,vt,E.width,E.height):yt(E)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,It,vt,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,vt,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function bt(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),N(E.depthTexture,0);let st=n.get(E.depthTexture).__webglTexture,rt=Ut(E);if(E.depthTexture.format===ui)yt(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(E.depthTexture.format===ts)yt(E)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Mt(R){let E=n.get(R),q=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(q)throw new Error("target.depthTexture not supported in Cube render targets");bt(E.__webglFramebuffer,R)}else if(q){E.__webglDepthbuffer=[];for(let st=0;st<6;st++)e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[st]),E.__webglDepthbuffer[st]=i.createRenderbuffer(),gt(E.__webglDepthbuffer[st],R,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),gt(E.__webglDepthbuffer,R,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(R,E,q){let st=n.get(R);E!==void 0&&tt(st.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&Mt(R)}function X(R){let E=R.texture,q=n.get(R),st=n.get(E);R.addEventListener("dispose",P),R.isWebGLMultipleRenderTargets!==!0&&(st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture()),st.__version=E.version,o.memory.textures++);let rt=R.isWebGLCubeRenderTarget===!0,ot=R.isWebGLMultipleRenderTargets===!0,St=p(R)||a;if(rt){q.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(a&&E.mipmaps&&E.mipmaps.length>0){q.__webglFramebuffer[_t]=[];for(let vt=0;vt<E.mipmaps.length;vt++)q.__webglFramebuffer[_t][vt]=i.createFramebuffer()}else q.__webglFramebuffer[_t]=i.createFramebuffer()}else{if(a&&E.mipmaps&&E.mipmaps.length>0){q.__webglFramebuffer=[];for(let _t=0;_t<E.mipmaps.length;_t++)q.__webglFramebuffer[_t]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(ot)if(s.drawBuffers){let _t=R.texture;for(let vt=0,It=_t.length;vt<It;vt++){let zt=n.get(_t[vt]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&R.samples>0&&yt(R)===!1){let _t=ot?E:[E];q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let vt=0;vt<_t.length;vt++){let It=_t[vt];q.__webglColorRenderbuffer[vt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[vt]);let zt=r.convert(It.format,It.colorSpace),it=r.convert(It.type),Zt=M(It.internalFormat,zt,it,It.colorSpace,R.isXRRenderTarget===!0),L=Ut(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,L,Zt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,q.__webglColorRenderbuffer[vt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),gt(q.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(rt){e.bindTexture(i.TEXTURE_CUBE_MAP,st.__webglTexture),F(i.TEXTURE_CUBE_MAP,E,St);for(let _t=0;_t<6;_t++)if(a&&E.mipmaps&&E.mipmaps.length>0)for(let vt=0;vt<E.mipmaps.length;vt++)tt(q.__webglFramebuffer[_t][vt],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,vt);else tt(q.__webglFramebuffer[_t],R,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);y(E,St)&&x(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){let _t=R.texture;for(let vt=0,It=_t.length;vt<It;vt++){let zt=_t[vt],it=n.get(zt);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),F(i.TEXTURE_2D,zt,St),tt(q.__webglFramebuffer,R,zt,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,0),y(zt,St)&&x(i.TEXTURE_2D)}e.unbindTexture()}else{let _t=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(a?_t=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(_t,st.__webglTexture),F(_t,E,St),a&&E.mipmaps&&E.mipmaps.length>0)for(let vt=0;vt<E.mipmaps.length;vt++)tt(q.__webglFramebuffer[vt],R,E,i.COLOR_ATTACHMENT0,_t,vt);else tt(q.__webglFramebuffer,R,E,i.COLOR_ATTACHMENT0,_t,0);y(E,St)&&x(_t),e.unbindTexture()}R.depthBuffer&&Mt(R)}function fe(R){let E=p(R)||a,q=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let st=0,rt=q.length;st<rt;st++){let ot=q[st];if(y(ot,E)){let St=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,_t=n.get(ot).__webglTexture;e.bindTexture(St,_t),x(St),e.unbindTexture()}}}function wt(R){if(a&&R.samples>0&&yt(R)===!1){let E=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],q=R.width,st=R.height,rt=i.COLOR_BUFFER_BIT,ot=[],St=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(R),vt=R.isWebGLMultipleRenderTargets===!0;if(vt)for(let It=0;It<E.length;It++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let It=0;It<E.length;It++){ot.push(i.COLOR_ATTACHMENT0+It),R.depthBuffer&&ot.push(St);let zt=_t.__ignoreDepthValues!==void 0?_t.__ignoreDepthValues:!1;if(zt===!1&&(R.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),vt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[It]),zt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[St]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[St])),vt){let it=n.get(E[It]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,it,0)}i.blitFramebuffer(0,0,q,st,0,0,q,st,rt,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),vt)for(let It=0;It<E.length;It++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.RENDERBUFFER,_t.__webglColorRenderbuffer[It]);let zt=n.get(E[It]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+It,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}}function Ut(R){return Math.min(s.maxSamples,R.samples)}function yt(R){let E=n.get(R);return a&&R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Qt(R){let E=o.render.frame;u.get(R)!==E&&(u.set(R,E),R.update())}function Ot(R,E){let q=R.colorSpace,st=R.format,rt=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===Ua||q!==Pn&&q!==qe&&(te.getTransfer(q)===re?a===!1?t.has("EXT_sRGB")===!0&&st===Xe?(R.format=Ua,R.minFilter=Re,R.generateMipmaps=!1):E=Zr.sRGBToLinear(E):(st!==Xe||rt!==$n)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",q)),E}this.allocateTextureUnit=I,this.resetTextureUnits=et,this.setTexture2D=N,this.setTexture2DArray=W,this.setTexture3D=H,this.setTextureCube=z,this.rebindTextures=Vt,this.setupRenderTarget=X,this.updateRenderTargetMipmap=fe,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=tt,this.useMultisampledRTT=yt}function T_(i,t,e){let n=e.isWebGL2;function s(r,o=qe){let a,l=te.getTransfer(o);if(r===$n)return i.UNSIGNED_BYTE;if(r===Yh)return i.UNSIGNED_SHORT_4_4_4_4;if(r===$h)return i.UNSIGNED_SHORT_5_5_5_1;if(r===af)return i.BYTE;if(r===lf)return i.SHORT;if(r===ml)return i.UNSIGNED_SHORT;if(r===qh)return i.INT;if(r===Xn)return i.UNSIGNED_INT;if(r===Cn)return i.FLOAT;if(r===Is)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(r===cf)return i.ALPHA;if(r===Xe)return i.RGBA;if(r===hf)return i.LUMINANCE;if(r===uf)return i.LUMINANCE_ALPHA;if(r===ui)return i.DEPTH_COMPONENT;if(r===ts)return i.DEPTH_STENCIL;if(r===Ua)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(r===df)return i.RED;if(r===Zh)return i.RED_INTEGER;if(r===ff)return i.RG;if(r===jh)return i.RG_INTEGER;if(r===Jh)return i.RGBA_INTEGER;if(r===jo||r===Jo||r===Ko||r===Qo)if(l===re)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(r===jo)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Jo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Ko)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Qo)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(r===jo)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Jo)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Ko)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Qo)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===oc||r===ac||r===lc||r===cc)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(r===oc)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===ac)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===lc)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===cc)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Kh)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===hc||r===uc)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(r===hc)return l===re?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(r===uc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===dc||r===fc||r===pc||r===mc||r===gc||r===_c||r===xc||r===yc||r===vc||r===Mc||r===bc||r===Sc||r===wc||r===Ec)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(r===dc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===fc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===pc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===mc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===gc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===_c)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===xc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===yc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===vc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Mc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===bc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Sc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===wc)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Ec)return l===re?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===ta||r===Ac||r===Tc)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(r===ta)return l===re?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Ac)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Tc)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===pf||r===Cc||r===Rc||r===Pc)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(r===ta)return a.COMPRESSED_RED_RGTC1_EXT;if(r===Cc)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Rc)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Pc)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===hi?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Ya=class extends Ge{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},cn=class extends oe{constructor(){super(),this.isGroup=!0,this.type="Group"}},C_={type:"move"},Ls=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let _ of t.hand.values()){let p=e.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(C_)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new cn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},$a=class extends _n{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null,_=e.getContextAttributes(),p=null,m=null,y=[],x=[],M=new Rt,A=null,b=new Ge;b.layers.enable(1),b.viewport=new le;let S=new Ge;S.layers.enable(2),S.viewport=new le;let P=[b,S],v=new Ya;v.layers.enable(1),v.layers.enable(2);let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(F){let V=y[F];return V===void 0&&(V=new Ls,y[F]=V),V.getTargetRaySpace()},this.getControllerGrip=function(F){let V=y[F];return V===void 0&&(V=new Ls,y[F]=V),V.getGripSpace()},this.getHand=function(F){let V=y[F];return V===void 0&&(V=new Ls,y[F]=V),V.getHandSpace()};function G(F){let V=x.indexOf(F.inputSource);if(V===-1)return;let K=y[V];K!==void 0&&(K.update(F.inputSource,F.frame,c||o),K.dispatchEvent({type:F.type,data:F.inputSource}))}function et(){s.removeEventListener("select",G),s.removeEventListener("selectstart",G),s.removeEventListener("selectend",G),s.removeEventListener("squeeze",G),s.removeEventListener("squeezestart",G),s.removeEventListener("squeezeend",G),s.removeEventListener("end",et),s.removeEventListener("inputsourceschange",I);for(let F=0;F<y.length;F++){let V=x[F];V!==null&&(x[F]=null,y[F].disconnect(V))}w=null,O=null,t.setRenderTarget(p),f=null,d=null,h=null,s=null,m=null,Q.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(F){r=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(F){a=F,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(F){c=F},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(F){if(s=F,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",G),s.addEventListener("selectstart",G),s.addEventListener("selectend",G),s.addEventListener("squeeze",G),s.addEventListener("squeezestart",G),s.addEventListener("squeezeend",G),s.addEventListener("end",et),s.addEventListener("inputsourceschange",I),_.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(M),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let V={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,V),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),m=new hn(f.framebufferWidth,f.framebufferHeight,{format:Xe,type:$n,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let V=null,K=null,k=null;_.depth&&(k=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,V=_.stencil?ts:ui,K=_.stencil?hi:Xn);let tt={colorFormat:e.RGBA8,depthFormat:k,scaleFactor:r};h=new XRWebGLBinding(s,e),d=h.createProjectionLayer(tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),m=new hn(d.textureWidth,d.textureHeight,{format:Xe,type:$n,depthTexture:new io(d.textureWidth,d.textureHeight,K,void 0,void 0,void 0,void 0,void 0,void 0,V),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let gt=t.properties.get(m);gt.__ignoreDepthValues=d.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Q.setContext(s),Q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function I(F){for(let V=0;V<F.removed.length;V++){let K=F.removed[V],k=x.indexOf(K);k>=0&&(x[k]=null,y[k].disconnect(K))}for(let V=0;V<F.added.length;V++){let K=F.added[V],k=x.indexOf(K);if(k===-1){for(let gt=0;gt<y.length;gt++)if(gt>=x.length){x.push(K),k=gt;break}else if(x[gt]===null){x[gt]=K,k=gt;break}if(k===-1)break}let tt=y[k];tt&&tt.connect(K)}}let U=new C,N=new C;function W(F,V,K){U.setFromMatrixPosition(V.matrixWorld),N.setFromMatrixPosition(K.matrixWorld);let k=U.distanceTo(N),tt=V.projectionMatrix.elements,gt=K.projectionMatrix.elements,bt=tt[14]/(tt[10]-1),Mt=tt[14]/(tt[10]+1),Vt=(tt[9]+1)/tt[5],X=(tt[9]-1)/tt[5],fe=(tt[8]-1)/tt[0],wt=(gt[8]+1)/gt[0],Ut=bt*fe,yt=bt*wt,Qt=k/(-fe+wt),Ot=Qt*-fe;V.matrixWorld.decompose(F.position,F.quaternion,F.scale),F.translateX(Ot),F.translateZ(Qt),F.matrixWorld.compose(F.position,F.quaternion,F.scale),F.matrixWorldInverse.copy(F.matrixWorld).invert();let R=bt+Qt,E=Mt+Qt,q=Ut-Ot,st=yt+(k-Ot),rt=Vt*Mt/E*R,ot=X*Mt/E*R;F.projectionMatrix.makePerspective(q,st,rt,ot,R,E),F.projectionMatrixInverse.copy(F.projectionMatrix).invert()}function H(F,V){V===null?F.matrixWorld.copy(F.matrix):F.matrixWorld.multiplyMatrices(V.matrixWorld,F.matrix),F.matrixWorldInverse.copy(F.matrixWorld).invert()}this.updateCamera=function(F){if(s===null)return;v.near=S.near=b.near=F.near,v.far=S.far=b.far=F.far,(w!==v.near||O!==v.far)&&(s.updateRenderState({depthNear:v.near,depthFar:v.far}),w=v.near,O=v.far);let V=F.parent,K=v.cameras;H(v,V);for(let k=0;k<K.length;k++)H(K[k],V);K.length===2?W(v,b,S):v.projectionMatrix.copy(b.projectionMatrix),z(F,v,V)};function z(F,V,K){K===null?F.matrix.copy(V.matrixWorld):(F.matrix.copy(K.matrixWorld),F.matrix.invert(),F.matrix.multiply(V.matrixWorld)),F.matrix.decompose(F.position,F.quaternion,F.scale),F.updateMatrixWorld(!0),F.projectionMatrix.copy(V.projectionMatrix),F.projectionMatrixInverse.copy(V.projectionMatrixInverse),F.isPerspectiveCamera&&(F.fov=Us*2*Math.atan(1/F.projectionMatrix.elements[5]),F.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(F){l=F,d!==null&&(d.fixedFoveation=F),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=F)};let J=null;function j(F,V){if(u=V.getViewerPose(c||o),g=V,u!==null){let K=u.views;f!==null&&(t.setRenderTargetFramebuffer(m,f.framebuffer),t.setRenderTarget(m));let k=!1;K.length!==v.cameras.length&&(v.cameras.length=0,k=!0);for(let tt=0;tt<K.length;tt++){let gt=K[tt],bt=null;if(f!==null)bt=f.getViewport(gt);else{let Vt=h.getViewSubImage(d,gt);bt=Vt.viewport,tt===0&&(t.setRenderTargetTextures(m,Vt.colorTexture,d.ignoreDepthValues?void 0:Vt.depthStencilTexture),t.setRenderTarget(m))}let Mt=P[tt];Mt===void 0&&(Mt=new Ge,Mt.layers.enable(tt),Mt.viewport=new le,P[tt]=Mt),Mt.matrix.fromArray(gt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(gt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(bt.x,bt.y,bt.width,bt.height),tt===0&&(v.matrix.copy(Mt.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),k===!0&&v.cameras.push(Mt)}}for(let K=0;K<y.length;K++){let k=x[K],tt=y[K];k!==null&&tt!==void 0&&tt.update(k,V,c||o)}J&&J(F,V),V.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:V}),g=null}let Q=new ou;Q.setAnimationLoop(j),this.setAnimationLoop=function(F){J=F},this.dispose=function(){}}};function R_(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,ru(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,y,x,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(p,m):m.isMeshToonMaterial?(r(p,m),h(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m)):m.isMeshStandardMaterial?(r(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,M)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,y,x):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ye&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ye&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let y=t.get(m).envMap;if(y&&(p.envMap.value=y,p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap){p.lightMap.value=m.lightMap;let x=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=m.lightMapIntensity*x,e(m.lightMap,p.lightMapTransform)}m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,y,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*y,p.scale.value=x*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),t.get(m).envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,y){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ye&&p.clearcoatNormalScale.value.negate())),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){let y=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function P_(i,t,e,n){let s={},r={},o=[],a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(y,x){let M=x.program;n.uniformBlockBinding(y,M)}function c(y,x){let M=s[y.id];M===void 0&&(g(y),M=u(y),s[y.id]=M,y.addEventListener("dispose",p));let A=x.program;n.updateUBOMapping(y,A);let b=t.render.frame;r[y.id]!==b&&(d(y),r[y.id]=b)}function u(y){let x=h();y.__bindingPointIndex=x;let M=i.createBuffer(),A=y.__size,b=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,A,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,M),M}function h(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){let x=s[y.id],M=y.uniforms,A=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let b=0,S=M.length;b<S;b++){let P=Array.isArray(M[b])?M[b]:[M[b]];for(let v=0,w=P.length;v<w;v++){let O=P[v];if(f(O,b,v,A)===!0){let G=O.__offset,et=Array.isArray(O.value)?O.value:[O.value],I=0;for(let U=0;U<et.length;U++){let N=et[U],W=_(N);typeof N=="number"||typeof N=="boolean"?(O.__data[0]=N,i.bufferSubData(i.UNIFORM_BUFFER,G+I,O.__data)):N.isMatrix3?(O.__data[0]=N.elements[0],O.__data[1]=N.elements[1],O.__data[2]=N.elements[2],O.__data[3]=0,O.__data[4]=N.elements[3],O.__data[5]=N.elements[4],O.__data[6]=N.elements[5],O.__data[7]=0,O.__data[8]=N.elements[6],O.__data[9]=N.elements[7],O.__data[10]=N.elements[8],O.__data[11]=0):(N.toArray(O.__data,I),I+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,G,O.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(y,x,M,A){let b=y.value,S=x+"_"+M;if(A[S]===void 0)return typeof b=="number"||typeof b=="boolean"?A[S]=b:A[S]=b.clone(),!0;{let P=A[S];if(typeof b=="number"||typeof b=="boolean"){if(P!==b)return A[S]=b,!0}else if(P.equals(b)===!1)return P.copy(b),!0}return!1}function g(y){let x=y.uniforms,M=0,A=16;for(let S=0,P=x.length;S<P;S++){let v=Array.isArray(x[S])?x[S]:[x[S]];for(let w=0,O=v.length;w<O;w++){let G=v[w],et=Array.isArray(G.value)?G.value:[G.value];for(let I=0,U=et.length;I<U;I++){let N=et[I],W=_(N),H=M%A;H!==0&&A-H<W.boundary&&(M+=A-H),G.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),G.__offset=M,M+=W.storage}}}let b=M%A;return b>0&&(M+=A-b),y.__size=M,y.__cache={},this}function _(y){let x={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(x.boundary=4,x.storage=4):y.isVector2?(x.boundary=8,x.storage=8):y.isVector3||y.isColor?(x.boundary=16,x.storage=12):y.isVector4?(x.boundary=16,x.storage=16):y.isMatrix3?(x.boundary=48,x.storage=48):y.isMatrix4?(x.boundary=64,x.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),x}function p(y){let x=y.target;x.removeEventListener("dispose",p);let M=o.indexOf(x.__bindingPointIndex);o.splice(M,1),i.deleteBuffer(s[x.id]),delete s[x.id],delete r[x.id]}function m(){for(let y in s)i.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:m}}var Fs=class{constructor(t={}){let{canvas:e=zf(),context:n=null,depth:s=!0,stencil:r=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;let f=new Uint32Array(4),g=new Int32Array(4),_=null,p=null,m=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=me,this._useLegacyLights=!1,this.toneMapping=Yn,this.toneMappingExposure=1;let x=this,M=!1,A=0,b=0,S=null,P=-1,v=null,w=new le,O=new le,G=null,et=new Lt(0),I=0,U=e.width,N=e.height,W=1,H=null,z=null,J=new le(0,0,U,N),j=new le(0,0,U,N),Q=!1,F=new Ns,V=!1,K=!1,k=null,tt=new ct,gt=new Rt,bt=new C,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Vt(){return S===null?W:1}let X=n;function fe(T,B){for(let $=0;$<T.length;$++){let Z=T[$],Y=e.getContext(Z,B);if(Y!==null)return Y}return null}try{let T={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${pl}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",D,!1),e.addEventListener("webglcontextcreationerror",ht,!1),X===null){let B=["webgl2","webgl","experimental-webgl"];if(x.isWebGL1Renderer===!0&&B.shift(),X=fe(B,T),X===null)throw fe(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&X instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),X.getShaderPrecisionFormat===void 0&&(X.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let wt,Ut,yt,Qt,Ot,R,E,q,st,rt,ot,St,_t,vt,It,zt,it,Zt,L,nt,ft,lt,Et,Xt;function jt(){wt=new Zg(X),Ut=new Gg(X,wt,t),wt.init(Ut),lt=new T_(X,wt,Ut),yt=new E_(X,wt,Ut),Qt=new Kg(X),Ot=new f_,R=new A_(X,wt,yt,Ot,Ut,lt,Qt),E=new Xg(x),q=new $g(x),st=new op(X,Ut),Et=new Vg(X,wt,st,Ut),rt=new jg(X,st,Qt,Et),ot=new n0(X,rt,st,Qt),L=new e0(X,Ut,R),zt=new Wg(Ot),St=new d_(x,E,q,wt,Ut,Et,zt),_t=new R_(x,Ot),vt=new m_,It=new M_(wt,Ut),Zt=new Bg(x,E,q,yt,ot,d,l),it=new w_(x,ot,Ut),Xt=new P_(X,Qt,Ut,yt),nt=new Hg(X,wt,Qt,Ut),ft=new Jg(X,wt,Qt,Ut),Qt.programs=St.programs,x.capabilities=Ut,x.extensions=wt,x.properties=Ot,x.renderLists=vt,x.shadowMap=it,x.state=yt,x.info=Qt}jt();let Gt=new $a(x,X);this.xr=Gt,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){let T=wt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=wt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(T){T!==void 0&&(W=T,this.setSize(U,N,!1))},this.getSize=function(T){return T.set(U,N)},this.setSize=function(T,B,$=!0){if(Gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=T,N=B,e.width=Math.floor(T*W),e.height=Math.floor(B*W),$===!0&&(e.style.width=T+"px",e.style.height=B+"px"),this.setViewport(0,0,T,B)},this.getDrawingBufferSize=function(T){return T.set(U*W,N*W).floor()},this.setDrawingBufferSize=function(T,B,$){U=T,N=B,W=$,e.width=Math.floor(T*$),e.height=Math.floor(B*$),this.setViewport(0,0,T,B)},this.getCurrentViewport=function(T){return T.copy(w)},this.getViewport=function(T){return T.copy(J)},this.setViewport=function(T,B,$,Z){T.isVector4?J.set(T.x,T.y,T.z,T.w):J.set(T,B,$,Z),yt.viewport(w.copy(J).multiplyScalar(W).floor())},this.getScissor=function(T){return T.copy(j)},this.setScissor=function(T,B,$,Z){T.isVector4?j.set(T.x,T.y,T.z,T.w):j.set(T,B,$,Z),yt.scissor(O.copy(j).multiplyScalar(W).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(T){yt.setScissorTest(Q=T)},this.setOpaqueSort=function(T){H=T},this.setTransparentSort=function(T){z=T},this.getClearColor=function(T){return T.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor.apply(Zt,arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha.apply(Zt,arguments)},this.clear=function(T=!0,B=!0,$=!0){let Z=0;if(T){let Y=!1;if(S!==null){let xt=S.texture.format;Y=xt===Jh||xt===jh||xt===Zh}if(Y){let xt=S.texture.type,Tt=xt===$n||xt===Xn||xt===ml||xt===hi||xt===Yh||xt===$h,Dt=Zt.getClearColor(),Nt=Zt.getClearAlpha(),Wt=Dt.r,kt=Dt.g,Bt=Dt.b;Tt?(f[0]=Wt,f[1]=kt,f[2]=Bt,f[3]=Nt,X.clearBufferuiv(X.COLOR,0,f)):(g[0]=Wt,g[1]=kt,g[2]=Bt,g[3]=Nt,X.clearBufferiv(X.COLOR,0,g))}else Z|=X.COLOR_BUFFER_BIT}B&&(Z|=X.DEPTH_BUFFER_BIT),$&&(Z|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",D,!1),e.removeEventListener("webglcontextcreationerror",ht,!1),vt.dispose(),It.dispose(),Ot.dispose(),E.dispose(),q.dispose(),ot.dispose(),Et.dispose(),Xt.dispose(),St.dispose(),Gt.dispose(),Gt.removeEventListener("sessionstart",ze),Gt.removeEventListener("sessionend",se),k&&(k.dispose(),k=null),Be.stop()};function dt(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function D(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;let T=Qt.autoReset,B=it.enabled,$=it.autoUpdate,Z=it.needsUpdate,Y=it.type;jt(),Qt.autoReset=T,it.enabled=B,it.autoUpdate=$,it.needsUpdate=Z,it.type=Y}function ht(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ut(T){let B=T.target;B.removeEventListener("dispose",ut),Pt(B)}function Pt(T){At(T),Ot.remove(T)}function At(T){let B=Ot.get(T).programs;B!==void 0&&(B.forEach(function($){St.releaseProgram($)}),T.isShaderMaterial&&St.releaseShaderCache(T))}this.renderBufferDirect=function(T,B,$,Z,Y,xt){B===null&&(B=Mt);let Tt=Y.isMesh&&Y.matrixWorld.determinant()<0,Dt=Md(T,B,$,Z,Y);yt.setMaterial(Z,Tt);let Nt=$.index,Wt=1;if(Z.wireframe===!0){if(Nt=rt.getWireframeAttribute($),Nt===void 0)return;Wt=2}let kt=$.drawRange,Bt=$.attributes.position,ge=kt.start*Wt,je=(kt.start+kt.count)*Wt;xt!==null&&(ge=Math.max(ge,xt.start*Wt),je=Math.min(je,(xt.start+xt.count)*Wt)),Nt!==null?(ge=Math.max(ge,0),je=Math.min(je,Nt.count)):Bt!=null&&(ge=Math.max(ge,0),je=Math.min(je,Bt.count));let Ee=je-ge;if(Ee<0||Ee===1/0)return;Et.setup(Y,Z,Dt,$,Nt);let vn,he=nt;if(Nt!==null&&(vn=st.get(Nt),he=ft,he.setIndex(vn)),Y.isMesh)Z.wireframe===!0?(yt.setLineWidth(Z.wireframeLinewidth*Vt()),he.setMode(X.LINES)):he.setMode(X.TRIANGLES);else if(Y.isLine){let qt=Z.linewidth;qt===void 0&&(qt=1),yt.setLineWidth(qt*Vt()),Y.isLineSegments?he.setMode(X.LINES):Y.isLineLoop?he.setMode(X.LINE_LOOP):he.setMode(X.LINE_STRIP)}else Y.isPoints?he.setMode(X.POINTS):Y.isSprite&&he.setMode(X.TRIANGLES);if(Y.isBatchedMesh)he.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else if(Y.isInstancedMesh)he.renderInstances(ge,Ee,Y.count);else if($.isInstancedBufferGeometry){let qt=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,Xo=Math.min($.instanceCount,qt);he.renderInstances(ge,Ee,Xo)}else he.render(ge,Ee)};function Jt(T,B,$){T.transparent===!0&&T.side===Oe&&T.forceSinglePass===!1?(T.side=Ye,T.needsUpdate=!0,cr(T,B,$),T.side=Zn,T.needsUpdate=!0,cr(T,B,$),T.side=Oe):cr(T,B,$)}this.compile=function(T,B,$=null){$===null&&($=T),p=It.get($),p.init(),y.push(p),$.traverseVisible(function(Y){Y.isLight&&Y.layers.test(B.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),T!==$&&T.traverseVisible(function(Y){Y.isLight&&Y.layers.test(B.layers)&&(p.pushLight(Y),Y.castShadow&&p.pushShadow(Y))}),p.setupLights(x._useLegacyLights);let Z=new Set;return T.traverse(function(Y){let xt=Y.material;if(xt)if(Array.isArray(xt))for(let Tt=0;Tt<xt.length;Tt++){let Dt=xt[Tt];Jt(Dt,$,Y),Z.add(Dt)}else Jt(xt,$,Y),Z.add(xt)}),y.pop(),p=null,Z},this.compileAsync=function(T,B,$=null){let Z=this.compile(T,B,$);return new Promise(Y=>{function xt(){if(Z.forEach(function(Tt){Ot.get(Tt).currentProgram.isReady()&&Z.delete(Tt)}),Z.size===0){Y(T);return}setTimeout(xt,10)}wt.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let Kt=null;function we(T){Kt&&Kt(T)}function ze(){Be.stop()}function se(){Be.start()}let Be=new ou;Be.setAnimationLoop(we),typeof self<"u"&&Be.setContext(self),this.setAnimationLoop=function(T){Kt=T,Gt.setAnimationLoop(T),T===null?Be.stop():Be.start()},Gt.addEventListener("sessionstart",ze),Gt.addEventListener("sessionend",se),this.render=function(T,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Gt.enabled===!0&&Gt.isPresenting===!0&&(Gt.cameraAutoUpdate===!0&&Gt.updateCamera(B),B=Gt.getCamera()),T.isScene===!0&&T.onBeforeRender(x,T,B,S),p=It.get(T,y.length),p.init(),y.push(p),tt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),F.setFromProjectionMatrix(tt),K=this.localClippingEnabled,V=zt.init(this.clippingPlanes,K),_=vt.get(T,m.length),_.init(),m.push(_),pn(T,B,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(H,z),this.info.render.frame++,V===!0&&zt.beginShadows();let $=p.state.shadowsArray;if(it.render($,T,B),V===!0&&zt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Zt.render(_,T),p.setupLights(x._useLegacyLights),B.isArrayCamera){let Z=B.cameras;for(let Y=0,xt=Z.length;Y<xt;Y++){let Tt=Z[Y];ql(_,T,Tt,Tt.viewport)}}else ql(_,T,B);S!==null&&(R.updateMultisampleRenderTarget(S),R.updateRenderTargetMipmap(S)),T.isScene===!0&&T.onAfterRender(x,T,B),Et.resetDefaultState(),P=-1,v=null,y.pop(),y.length>0?p=y[y.length-1]:p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function pn(T,B,$,Z){if(T.visible===!1)return;if(T.layers.test(B.layers)){if(T.isGroup)$=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(B);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||F.intersectsSprite(T)){Z&&bt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(tt);let Tt=ot.update(T),Dt=T.material;Dt.visible&&_.push(T,Tt,Dt,$,bt.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||F.intersectsObject(T))){let Tt=ot.update(T),Dt=T.material;if(Z&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),bt.copy(T.boundingSphere.center)):(Tt.boundingSphere===null&&Tt.computeBoundingSphere(),bt.copy(Tt.boundingSphere.center)),bt.applyMatrix4(T.matrixWorld).applyMatrix4(tt)),Array.isArray(Dt)){let Nt=Tt.groups;for(let Wt=0,kt=Nt.length;Wt<kt;Wt++){let Bt=Nt[Wt],ge=Dt[Bt.materialIndex];ge&&ge.visible&&_.push(T,Tt,ge,$,bt.z,Bt)}}else Dt.visible&&_.push(T,Tt,Dt,$,bt.z,null)}}let xt=T.children;for(let Tt=0,Dt=xt.length;Tt<Dt;Tt++)pn(xt[Tt],B,$,Z)}function ql(T,B,$,Z){let Y=T.opaque,xt=T.transmissive,Tt=T.transparent;p.setupLightsView($),V===!0&&zt.setGlobalState(x.clippingPlanes,$),xt.length>0&&vd(Y,xt,B,$),Z&&yt.viewport(w.copy(Z)),Y.length>0&&lr(Y,B,$),xt.length>0&&lr(xt,B,$),Tt.length>0&&lr(Tt,B,$),yt.buffers.depth.setTest(!0),yt.buffers.depth.setMask(!0),yt.buffers.color.setMask(!0),yt.setPolygonOffset(!1)}function vd(T,B,$,Z){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;let xt=Ut.isWebGL2;k===null&&(k=new hn(1,1,{generateMipmaps:!0,type:wt.has("EXT_color_buffer_half_float")?Is:$n,minFilter:gn,samples:xt?4:0})),x.getDrawingBufferSize(gt),xt?k.setSize(gt.x,gt.y):k.setSize(Yr(gt.x),Yr(gt.y));let Tt=x.getRenderTarget();x.setRenderTarget(k),x.getClearColor(et),I=x.getClearAlpha(),I<1&&x.setClearColor(16777215,.5),x.clear();let Dt=x.toneMapping;x.toneMapping=Yn,lr(T,$,Z),R.updateMultisampleRenderTarget(k),R.updateRenderTargetMipmap(k);let Nt=!1;for(let Wt=0,kt=B.length;Wt<kt;Wt++){let Bt=B[Wt],ge=Bt.object,je=Bt.geometry,Ee=Bt.material,vn=Bt.group;if(Ee.side===Oe&&ge.layers.test(Z.layers)){let he=Ee.side;Ee.side=Ye,Ee.needsUpdate=!0,Yl(ge,$,Z,je,Ee,vn),Ee.side=he,Ee.needsUpdate=!0,Nt=!0}}Nt===!0&&(R.updateMultisampleRenderTarget(k),R.updateRenderTargetMipmap(k)),x.setRenderTarget(Tt),x.setClearColor(et,I),x.toneMapping=Dt}function lr(T,B,$){let Z=B.isScene===!0?B.overrideMaterial:null;for(let Y=0,xt=T.length;Y<xt;Y++){let Tt=T[Y],Dt=Tt.object,Nt=Tt.geometry,Wt=Z===null?Tt.material:Z,kt=Tt.group;Dt.layers.test($.layers)&&Yl(Dt,B,$,Nt,Wt,kt)}}function Yl(T,B,$,Z,Y,xt){T.onBeforeRender(x,B,$,Z,Y,xt),T.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),Y.onBeforeRender(x,B,$,Z,T,xt),Y.transparent===!0&&Y.side===Oe&&Y.forceSinglePass===!1?(Y.side=Ye,Y.needsUpdate=!0,x.renderBufferDirect($,B,Z,Y,T,xt),Y.side=Zn,Y.needsUpdate=!0,x.renderBufferDirect($,B,Z,Y,T,xt),Y.side=Oe):x.renderBufferDirect($,B,Z,Y,T,xt),T.onAfterRender(x,B,$,Z,Y,xt)}function cr(T,B,$){B.isScene!==!0&&(B=Mt);let Z=Ot.get(T),Y=p.state.lights,xt=p.state.shadowsArray,Tt=Y.state.version,Dt=St.getParameters(T,Y.state,xt,B,$),Nt=St.getProgramCacheKey(Dt),Wt=Z.programs;Z.environment=T.isMeshStandardMaterial?B.environment:null,Z.fog=B.fog,Z.envMap=(T.isMeshStandardMaterial?q:E).get(T.envMap||Z.environment),Wt===void 0&&(T.addEventListener("dispose",ut),Wt=new Map,Z.programs=Wt);let kt=Wt.get(Nt);if(kt!==void 0){if(Z.currentProgram===kt&&Z.lightsStateVersion===Tt)return Zl(T,Dt),kt}else Dt.uniforms=St.getUniforms(T),T.onBuild($,Dt,x),T.onBeforeCompile(Dt,x),kt=St.acquireProgram(Dt,Nt),Wt.set(Nt,kt),Z.uniforms=Dt.uniforms;let Bt=Z.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Bt.clippingPlanes=zt.uniform),Zl(T,Dt),Z.needsLights=Sd(T),Z.lightsStateVersion=Tt,Z.needsLights&&(Bt.ambientLightColor.value=Y.state.ambient,Bt.lightProbe.value=Y.state.probe,Bt.directionalLights.value=Y.state.directional,Bt.directionalLightShadows.value=Y.state.directionalShadow,Bt.spotLights.value=Y.state.spot,Bt.spotLightShadows.value=Y.state.spotShadow,Bt.rectAreaLights.value=Y.state.rectArea,Bt.ltc_1.value=Y.state.rectAreaLTC1,Bt.ltc_2.value=Y.state.rectAreaLTC2,Bt.pointLights.value=Y.state.point,Bt.pointLightShadows.value=Y.state.pointShadow,Bt.hemisphereLights.value=Y.state.hemi,Bt.directionalShadowMap.value=Y.state.directionalShadowMap,Bt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Bt.spotShadowMap.value=Y.state.spotShadowMap,Bt.spotLightMatrix.value=Y.state.spotLightMatrix,Bt.spotLightMap.value=Y.state.spotLightMap,Bt.pointShadowMap.value=Y.state.pointShadowMap,Bt.pointShadowMatrix.value=Y.state.pointShadowMatrix),Z.currentProgram=kt,Z.uniformsList=null,kt}function $l(T){if(T.uniformsList===null){let B=T.currentProgram.getUniforms();T.uniformsList=ji.seqWithValue(B.seq,T.uniforms)}return T.uniformsList}function Zl(T,B){let $=Ot.get(T);$.outputColorSpace=B.outputColorSpace,$.batching=B.batching,$.instancing=B.instancing,$.instancingColor=B.instancingColor,$.skinning=B.skinning,$.morphTargets=B.morphTargets,$.morphNormals=B.morphNormals,$.morphColors=B.morphColors,$.morphTargetsCount=B.morphTargetsCount,$.numClippingPlanes=B.numClippingPlanes,$.numIntersection=B.numClipIntersection,$.vertexAlphas=B.vertexAlphas,$.vertexTangents=B.vertexTangents,$.toneMapping=B.toneMapping}function Md(T,B,$,Z,Y){B.isScene!==!0&&(B=Mt),R.resetTextureUnits();let xt=B.fog,Tt=Z.isMeshStandardMaterial?B.environment:null,Dt=S===null?x.outputColorSpace:S.isXRRenderTarget===!0?S.texture.colorSpace:Pn,Nt=(Z.isMeshStandardMaterial?q:E).get(Z.envMap||Tt),Wt=Z.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,kt=!!$.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Bt=!!$.morphAttributes.position,ge=!!$.morphAttributes.normal,je=!!$.morphAttributes.color,Ee=Yn;Z.toneMapped&&(S===null||S.isXRRenderTarget===!0)&&(Ee=x.toneMapping);let vn=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,he=vn!==void 0?vn.length:0,qt=Ot.get(Z),Xo=p.state.lights;if(V===!0&&(K===!0||T!==v)){let en=T===v&&Z.id===P;zt.setState(Z,T,en)}let pe=!1;Z.version===qt.__version?(qt.needsLights&&qt.lightsStateVersion!==Xo.state.version||qt.outputColorSpace!==Dt||Y.isBatchedMesh&&qt.batching===!1||!Y.isBatchedMesh&&qt.batching===!0||Y.isInstancedMesh&&qt.instancing===!1||!Y.isInstancedMesh&&qt.instancing===!0||Y.isSkinnedMesh&&qt.skinning===!1||!Y.isSkinnedMesh&&qt.skinning===!0||Y.isInstancedMesh&&qt.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&qt.instancingColor===!1&&Y.instanceColor!==null||qt.envMap!==Nt||Z.fog===!0&&qt.fog!==xt||qt.numClippingPlanes!==void 0&&(qt.numClippingPlanes!==zt.numPlanes||qt.numIntersection!==zt.numIntersection)||qt.vertexAlphas!==Wt||qt.vertexTangents!==kt||qt.morphTargets!==Bt||qt.morphNormals!==ge||qt.morphColors!==je||qt.toneMapping!==Ee||Ut.isWebGL2===!0&&qt.morphTargetsCount!==he)&&(pe=!0):(pe=!0,qt.__version=Z.version);let ei=qt.currentProgram;pe===!0&&(ei=cr(Z,B,Y));let jl=!1,Ms=!1,qo=!1,Ie=ei.getUniforms(),ni=qt.uniforms;if(yt.useProgram(ei.program)&&(jl=!0,Ms=!0,qo=!0),Z.id!==P&&(P=Z.id,Ms=!0),jl||v!==T){Ie.setValue(X,"projectionMatrix",T.projectionMatrix),Ie.setValue(X,"viewMatrix",T.matrixWorldInverse);let en=Ie.map.cameraPosition;en!==void 0&&en.setValue(X,bt.setFromMatrixPosition(T.matrixWorld)),Ut.logarithmicDepthBuffer&&Ie.setValue(X,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&Ie.setValue(X,"isOrthographic",T.isOrthographicCamera===!0),v!==T&&(v=T,Ms=!0,qo=!0)}if(Y.isSkinnedMesh){Ie.setOptional(X,Y,"bindMatrix"),Ie.setOptional(X,Y,"bindMatrixInverse");let en=Y.skeleton;en&&(Ut.floatVertexTextures?(en.boneTexture===null&&en.computeBoneTexture(),Ie.setValue(X,"boneTexture",en.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Y.isBatchedMesh&&(Ie.setOptional(X,Y,"batchingTexture"),Ie.setValue(X,"batchingTexture",Y._matricesTexture,R));let Yo=$.morphAttributes;if((Yo.position!==void 0||Yo.normal!==void 0||Yo.color!==void 0&&Ut.isWebGL2===!0)&&L.update(Y,$,ei),(Ms||qt.receiveShadow!==Y.receiveShadow)&&(qt.receiveShadow=Y.receiveShadow,Ie.setValue(X,"receiveShadow",Y.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(ni.envMap.value=Nt,ni.flipEnvMap.value=Nt.isCubeTexture&&Nt.isRenderTargetTexture===!1?-1:1),Ms&&(Ie.setValue(X,"toneMappingExposure",x.toneMappingExposure),qt.needsLights&&bd(ni,qo),xt&&Z.fog===!0&&_t.refreshFogUniforms(ni,xt),_t.refreshMaterialUniforms(ni,Z,W,N,k),ji.upload(X,$l(qt),ni,R)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(ji.upload(X,$l(qt),ni,R),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&Ie.setValue(X,"center",Y.center),Ie.setValue(X,"modelViewMatrix",Y.modelViewMatrix),Ie.setValue(X,"normalMatrix",Y.normalMatrix),Ie.setValue(X,"modelMatrix",Y.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){let en=Z.uniformsGroups;for(let $o=0,wd=en.length;$o<wd;$o++)if(Ut.isWebGL2){let Jl=en[$o];Xt.update(Jl,ei),Xt.bind(Jl,ei)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ei}function bd(T,B){T.ambientLightColor.needsUpdate=B,T.lightProbe.needsUpdate=B,T.directionalLights.needsUpdate=B,T.directionalLightShadows.needsUpdate=B,T.pointLights.needsUpdate=B,T.pointLightShadows.needsUpdate=B,T.spotLights.needsUpdate=B,T.spotLightShadows.needsUpdate=B,T.rectAreaLights.needsUpdate=B,T.hemisphereLights.needsUpdate=B}function Sd(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return S},this.setRenderTargetTextures=function(T,B,$){Ot.get(T.texture).__webglTexture=B,Ot.get(T.depthTexture).__webglTexture=$;let Z=Ot.get(T);Z.__hasExternalTextures=!0,Z.__hasExternalTextures&&(Z.__autoAllocateDepthBuffer=$===void 0,Z.__autoAllocateDepthBuffer||wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Z.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,B){let $=Ot.get(T);$.__webglFramebuffer=B,$.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(T,B=0,$=0){S=T,A=B,b=$;let Z=!0,Y=null,xt=!1,Tt=!1;if(T){let Nt=Ot.get(T);Nt.__useDefaultFramebuffer!==void 0?(yt.bindFramebuffer(X.FRAMEBUFFER,null),Z=!1):Nt.__webglFramebuffer===void 0?R.setupRenderTarget(T):Nt.__hasExternalTextures&&R.rebindTextures(T,Ot.get(T.texture).__webglTexture,Ot.get(T.depthTexture).__webglTexture);let Wt=T.texture;(Wt.isData3DTexture||Wt.isDataArrayTexture||Wt.isCompressedArrayTexture)&&(Tt=!0);let kt=Ot.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(kt[B])?Y=kt[B][$]:Y=kt[B],xt=!0):Ut.isWebGL2&&T.samples>0&&R.useMultisampledRTT(T)===!1?Y=Ot.get(T).__webglMultisampledFramebuffer:Array.isArray(kt)?Y=kt[$]:Y=kt,w.copy(T.viewport),O.copy(T.scissor),G=T.scissorTest}else w.copy(J).multiplyScalar(W).floor(),O.copy(j).multiplyScalar(W).floor(),G=Q;if(yt.bindFramebuffer(X.FRAMEBUFFER,Y)&&Ut.drawBuffers&&Z&&yt.drawBuffers(T,Y),yt.viewport(w),yt.scissor(O),yt.setScissorTest(G),xt){let Nt=Ot.get(T.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+B,Nt.__webglTexture,$)}else if(Tt){let Nt=Ot.get(T.texture),Wt=B||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,Nt.__webglTexture,$||0,Wt)}P=-1},this.readRenderTargetPixels=function(T,B,$,Z,Y,xt,Tt){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Dt=Ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Tt!==void 0&&(Dt=Dt[Tt]),Dt){yt.bindFramebuffer(X.FRAMEBUFFER,Dt);try{let Nt=T.texture,Wt=Nt.format,kt=Nt.type;if(Wt!==Xe&&lt.convert(Wt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let Bt=kt===Is&&(wt.has("EXT_color_buffer_half_float")||Ut.isWebGL2&&wt.has("EXT_color_buffer_float"));if(kt!==$n&&lt.convert(kt)!==X.getParameter(X.IMPLEMENTATION_COLOR_READ_TYPE)&&!(kt===Cn&&(Ut.isWebGL2||wt.has("OES_texture_float")||wt.has("WEBGL_color_buffer_float")))&&!Bt){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=T.width-Z&&$>=0&&$<=T.height-Y&&X.readPixels(B,$,Z,Y,lt.convert(Wt),lt.convert(kt),xt)}finally{let Nt=S!==null?Ot.get(S).__webglFramebuffer:null;yt.bindFramebuffer(X.FRAMEBUFFER,Nt)}}},this.copyFramebufferToTexture=function(T,B,$=0){let Z=Math.pow(2,-$),Y=Math.floor(B.image.width*Z),xt=Math.floor(B.image.height*Z);R.setTexture2D(B,0),X.copyTexSubImage2D(X.TEXTURE_2D,$,0,0,T.x,T.y,Y,xt),yt.unbindTexture()},this.copyTextureToTexture=function(T,B,$,Z=0){let Y=B.image.width,xt=B.image.height,Tt=lt.convert($.format),Dt=lt.convert($.type);R.setTexture2D($,0),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,$.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,$.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,$.unpackAlignment),B.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,Z,T.x,T.y,Y,xt,Tt,Dt,B.image.data):B.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,Z,T.x,T.y,B.mipmaps[0].width,B.mipmaps[0].height,Tt,B.mipmaps[0].data):X.texSubImage2D(X.TEXTURE_2D,Z,T.x,T.y,Tt,Dt,B.image),Z===0&&$.generateMipmaps&&X.generateMipmap(X.TEXTURE_2D),yt.unbindTexture()},this.copyTextureToTexture3D=function(T,B,$,Z,Y=0){if(x.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let xt=T.max.x-T.min.x+1,Tt=T.max.y-T.min.y+1,Dt=T.max.z-T.min.z+1,Nt=lt.convert(Z.format),Wt=lt.convert(Z.type),kt;if(Z.isData3DTexture)R.setTexture3D(Z,0),kt=X.TEXTURE_3D;else if(Z.isDataArrayTexture||Z.isCompressedArrayTexture)R.setTexture2DArray(Z,0),kt=X.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,Z.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,Z.unpackAlignment);let Bt=X.getParameter(X.UNPACK_ROW_LENGTH),ge=X.getParameter(X.UNPACK_IMAGE_HEIGHT),je=X.getParameter(X.UNPACK_SKIP_PIXELS),Ee=X.getParameter(X.UNPACK_SKIP_ROWS),vn=X.getParameter(X.UNPACK_SKIP_IMAGES),he=$.isCompressedTexture?$.mipmaps[Y]:$.image;X.pixelStorei(X.UNPACK_ROW_LENGTH,he.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,he.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,T.min.x),X.pixelStorei(X.UNPACK_SKIP_ROWS,T.min.y),X.pixelStorei(X.UNPACK_SKIP_IMAGES,T.min.z),$.isDataTexture||$.isData3DTexture?X.texSubImage3D(kt,Y,B.x,B.y,B.z,xt,Tt,Dt,Nt,Wt,he.data):$.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),X.compressedTexSubImage3D(kt,Y,B.x,B.y,B.z,xt,Tt,Dt,Nt,he.data)):X.texSubImage3D(kt,Y,B.x,B.y,B.z,xt,Tt,Dt,Nt,Wt,he),X.pixelStorei(X.UNPACK_ROW_LENGTH,Bt),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,ge),X.pixelStorei(X.UNPACK_SKIP_PIXELS,je),X.pixelStorei(X.UNPACK_SKIP_ROWS,Ee),X.pixelStorei(X.UNPACK_SKIP_IMAGES,vn),Y===0&&Z.generateMipmaps&&X.generateMipmap(kt),yt.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?R.setTextureCube(T,0):T.isData3DTexture?R.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?R.setTexture2DArray(T,0):R.setTexture2D(T,0),yt.unbindTexture()},this.resetState=function(){A=0,b=0,S=null,yt.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===gl?"display-p3":"srgb",e.unpackColorSpace=te.workingColorSpace===xo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===me?di:Qh}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===di?me:Pn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Za=class extends Fs{};Za.prototype.isWebGL1Renderer=!0;var so=class extends oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}};var Mh=new C,bh=new le,Sh=new le,L_=new C,wh=new ct,Ir=new C,wa=new un,Eh=new ct,Ea=new Ln,ks=class extends mt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=sc,this.bindMatrix=new ct,this.bindMatrixInverse=new ct,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new We),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ir),this.boundingBox.expandByPoint(Ir)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new un),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Ir),this.boundingSphere.expandByPoint(Ir)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),wa.copy(this.boundingSphere),wa.applyMatrix4(s),t.ray.intersectsSphere(wa)!==!1&&(Eh.copy(s).invert(),Ea.copy(t.ray).applyMatrix4(Eh),!(this.boundingBox!==null&&Ea.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Ea)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new le,e=this.geometry.attributes.skinWeight;for(let n=0,s=e.count;n<s;n++){t.fromBufferAttribute(e,n);let r=1/t.manhattanLength();r!==1/0?t.multiplyScalar(r):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===sc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===go?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,s=this.geometry;bh.fromBufferAttribute(s.attributes.skinIndex,t),Sh.fromBufferAttribute(s.attributes.skinWeight,t),Mh.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let r=0;r<4;r++){let o=Sh.getComponent(r);if(o!==0){let a=bh.getComponent(r);wh.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(L_.copy(Mh).applyMatrix4(wh),o)}}return e.applyMatrix4(this.bindMatrixInverse)}boneTransform(t,e){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(t,e)}},zs=class extends oe{constructor(){super(),this.isBone=!0,this.type="Bone"}},ns=class extends $e{constructor(t=null,e=1,n=1,s,r,o,a,l,c=Ce,u=Ce,h,d){super(null,o,a,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ah=new ct,I_=new ct,ro=class i{constructor(t=[],e=[]){this.uuid=xi(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new ct)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new ct;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=t.length;r<o;r++){let a=t[r]?t[r].matrixWorld:I_;Ah.multiplyMatrices(a,e[r]),Ah.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new i(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new ns(e,t,t,Xe,Cn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let s=this.bones[e];if(s.name===t)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,s=t.bones.length;n<s;n++){let r=t.bones[n],o=e[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new zs),this.bones.push(o),this.boneInverses.push(new ct().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let s=0,r=e.length;s<r;s++){let o=e[s];t.bones.push(o.uuid);let a=n[s];t.boneInverses.push(a.toArray())}return t}},oo=class extends _e{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},Hi=new ct,Th=new ct,Ur=[],Ch=new We,U_=new ct,As=new mt,Ts=new un,is=class extends mt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new oo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,U_)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new We),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Hi),Ch.copy(t.boundingBox).applyMatrix4(Hi),this.boundingBox.union(Ch)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new un),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Hi),Ts.copy(t.boundingSphere).applyMatrix4(Hi),this.boundingSphere.union(Ts)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(As.geometry=this.geometry,As.material=this.material,As.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ts.copy(this.boundingSphere),Ts.applyMatrix4(n),t.ray.intersectsSphere(Ts)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Hi),Th.multiplyMatrices(n,Hi),As.matrixWorld=Th,As.raycast(t,Ur);for(let o=0,a=Ur.length;o<a;o++){let l=Ur[o];l.instanceId=r,l.object=this,e.push(l)}Ur.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new oo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var jn=class extends In{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Lt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},Rh=new C,Ph=new C,Lh=new ct,Aa=new Ln,Dr=new un,sn=class extends oe{constructor(t=new ee,e=new jn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Rh.fromBufferAttribute(e,s-1),Ph.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Rh.distanceTo(Ph);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(s),Dr.radius+=r,t.ray.intersectsSphere(Dr)===!1)return;Lh.copy(s).invert(),Aa.copy(t.ray).applyMatrix4(Lh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=new C,u=new C,h=new C,d=new C,f=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){let m=Math.max(0,o.start),y=Math.min(g.count,o.start+o.count);for(let x=m,M=y-1;x<M;x+=f){let A=g.getX(x),b=g.getX(x+1);if(c.fromBufferAttribute(p,A),u.fromBufferAttribute(p,b),Aa.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);let P=t.ray.origin.distanceTo(d);P<t.near||P>t.far||e.push({distance:P,point:h.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}else{let m=Math.max(0,o.start),y=Math.min(p.count,o.start+o.count);for(let x=m,M=y-1;x<M;x+=f){if(c.fromBufferAttribute(p,x),u.fromBufferAttribute(p,x+1),Aa.distanceSqToSegment(c,u,d,h)>l)continue;d.applyMatrix4(this.matrixWorld);let b=t.ray.origin.distanceTo(d);b<t.near||b>t.far||e.push({distance:b,point:h.clone().applyMatrix4(this.matrixWorld),index:x,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}},Ih=new C,Uh=new C,Bs=class extends sn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Ih.fromBufferAttribute(e,s),Uh.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ih.distanceTo(Uh);t.setAttribute("lineDistance",new $t(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Vs=class extends In{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Lt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Dh=new ct,ja=new Ln,Nr=new un,Or=new C,ao=class extends oe{constructor(t=new ee,e=new Vs){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(s),Nr.radius+=r,t.ray.intersectsSphere(Nr)===!1)return;Dh.copy(s).invert(),ja.copy(t.ray).applyMatrix4(Dh);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,h=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let p=c.getX(g);Or.fromBufferAttribute(h,p),Nh(Or,p,l,s,t,e,this)}}else{let d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let g=d,_=f;g<_;g++)Or.fromBufferAttribute(h,g),Nh(Or,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Nh(i,t,e,n,s,r,o){let a=ja.distanceSqToPoint(i);if(a<e){let l=new C;ja.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,object:o})}}var Le=class i extends ee{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;s=Math.floor(s),r=Math.floor(r);let u=[],h=[],d=[],f=[],g=0,_=[],p=n/2,m=0;y(),o===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new $t(h,3)),this.setAttribute("normal",new $t(d,3)),this.setAttribute("uv",new $t(f,2));function y(){let M=new C,A=new C,b=0,S=(e-t)/n;for(let P=0;P<=r;P++){let v=[],w=P/r,O=w*(e-t)+t;for(let G=0;G<=s;G++){let et=G/s,I=et*l+a,U=Math.sin(I),N=Math.cos(I);A.x=O*U,A.y=-w*n+p,A.z=O*N,h.push(A.x,A.y,A.z),M.set(U,S,N).normalize(),d.push(M.x,M.y,M.z),f.push(et,1-w),v.push(g++)}_.push(v)}for(let P=0;P<s;P++)for(let v=0;v<r;v++){let w=_[v][P],O=_[v+1][P],G=_[v+1][P+1],et=_[v][P+1];u.push(w,O,et),u.push(O,G,et),b+=6}c.addGroup(m,b,0),m+=b}function x(M){let A=g,b=new Rt,S=new C,P=0,v=M===!0?t:e,w=M===!0?1:-1;for(let G=1;G<=s;G++)h.push(0,p*w,0),d.push(0,w,0),f.push(.5,.5),g++;let O=g;for(let G=0;G<=s;G++){let I=G/s*l+a,U=Math.cos(I),N=Math.sin(I);S.x=v*N,S.y=p*w,S.z=v*U,h.push(S.x,S.y,S.z),d.push(0,w,0),b.x=U*.5+.5,b.y=N*.5*w+.5,f.push(b.x,b.y),g++}for(let G=0;G<s;G++){let et=A+G,I=O+G;M===!0?u.push(I,I+1,et):u.push(I+1,I,et),P+=3}c.addGroup(m,P,M===!0?1:2),m+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var Ja=class i extends ee{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],o=[];a(s),c(n),u(),this.setAttribute("position",new $t(r,3)),this.setAttribute("normal",new $t(r.slice(),3)),this.setAttribute("uv",new $t(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(y){let x=new C,M=new C,A=new C;for(let b=0;b<e.length;b+=3)f(e[b+0],x),f(e[b+1],M),f(e[b+2],A),l(x,M,A,y)}function l(y,x,M,A){let b=A+1,S=[];for(let P=0;P<=b;P++){S[P]=[];let v=y.clone().lerp(M,P/b),w=x.clone().lerp(M,P/b),O=b-P;for(let G=0;G<=O;G++)G===0&&P===b?S[P][G]=v:S[P][G]=v.clone().lerp(w,G/O)}for(let P=0;P<b;P++)for(let v=0;v<2*(b-P)-1;v++){let w=Math.floor(v/2);v%2===0?(d(S[P][w+1]),d(S[P+1][w]),d(S[P][w])):(d(S[P][w+1]),d(S[P+1][w+1]),d(S[P+1][w]))}}function c(y){let x=new C;for(let M=0;M<r.length;M+=3)x.x=r[M+0],x.y=r[M+1],x.z=r[M+2],x.normalize().multiplyScalar(y),r[M+0]=x.x,r[M+1]=x.y,r[M+2]=x.z}function u(){let y=new C;for(let x=0;x<r.length;x+=3){y.x=r[x+0],y.y=r[x+1],y.z=r[x+2];let M=p(y)/2/Math.PI+.5,A=m(y)/Math.PI+.5;o.push(M,1-A)}g(),h()}function h(){for(let y=0;y<o.length;y+=6){let x=o[y+0],M=o[y+2],A=o[y+4],b=Math.max(x,M,A),S=Math.min(x,M,A);b>.9&&S<.1&&(x<.2&&(o[y+0]+=1),M<.2&&(o[y+2]+=1),A<.2&&(o[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function f(y,x){let M=y*3;x.x=t[M+0],x.y=t[M+1],x.z=t[M+2]}function g(){let y=new C,x=new C,M=new C,A=new C,b=new Rt,S=new Rt,P=new Rt;for(let v=0,w=0;v<r.length;v+=9,w+=6){y.set(r[v+0],r[v+1],r[v+2]),x.set(r[v+3],r[v+4],r[v+5]),M.set(r[v+6],r[v+7],r[v+8]),b.set(o[w+0],o[w+1]),S.set(o[w+2],o[w+3]),P.set(o[w+4],o[w+5]),A.copy(y).add(x).add(M).divideScalar(3);let O=p(A);_(b,w+0,y,O),_(S,w+2,x,O),_(P,w+4,M,O)}}function _(y,x,M,A){A<0&&y.x===1&&(o[x]=y.x-1),M.x===0&&M.z===0&&(o[x]=A/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function m(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var D_={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=du(i,0,s,e,!0),o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,d,f;if(n&&(r=z_(i,t,r,e)),i.length>80*e){a=c=i[0],l=u=i[1];for(let g=e;g<s;g+=e)h=i[g],d=i[g+1],h<a&&(a=h),d<l&&(l=d),h>c&&(c=h),d>u&&(u=d);f=Math.max(c-a,u-l),f=f!==0?32767/f:0}return Hs(r,o,e,a,l,f,0),o}};function du(i,t,e,n,s){let r,o;if(s===j_(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Oh(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Oh(r,i[r],i[r+1],o);return o&&vo(o,o.next)&&(Ws(o),o=o.next),o}function pi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(vo(e,e.next)||ue(e.prev,e,e.next)===0)){if(Ws(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Hs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&W_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?O_(i,n,s,r):N_(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Ws(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=F_(pi(i),t,e),Hs(i,t,e,n,s,r,2)):o===2&&k_(i,t,e,n,s,r):Hs(pi(i),t,e,n,s,r,1);break}}}function N_(i){let t=i.prev,e=i,n=i.next;if(ue(t,e,n)>=0)return!1;let s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c,g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&Yi(s,a,r,l,o,c,g.x,g.y)&&ue(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function O_(i,t,e,n){let s=i.prev,r=i,o=i.next;if(ue(s,r,o)>=0)return!1;let a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,f=a<l?a<c?a:c:l<c?l:c,g=u<h?u<d?u:d:h<d?h:d,_=a>l?a>c?a:c:l>c?l:c,p=u>h?u>d?u:d:h>d?h:d,m=Ka(f,g,t,e,n),y=Ka(_,p,t,e,n),x=i.prevZ,M=i.nextZ;for(;x&&x.z>=m&&M&&M.z<=y;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Yi(a,u,l,h,c,d,x.x,x.y)&&ue(x.prev,x,x.next)>=0||(x=x.prevZ,M.x>=f&&M.x<=_&&M.y>=g&&M.y<=p&&M!==s&&M!==o&&Yi(a,u,l,h,c,d,M.x,M.y)&&ue(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;x&&x.z>=m;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=p&&x!==s&&x!==o&&Yi(a,u,l,h,c,d,x.x,x.y)&&ue(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;M&&M.z<=y;){if(M.x>=f&&M.x<=_&&M.y>=g&&M.y<=p&&M!==s&&M!==o&&Yi(a,u,l,h,c,d,M.x,M.y)&&ue(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function F_(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!vo(s,r)&&fu(s,n,n.next,r)&&Gs(s,r)&&Gs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Ws(n),Ws(n.next),n=i=r),n=n.next}while(n!==i);return pi(n)}function k_(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Y_(o,a)){let l=pu(o,a);o=pi(o,o.next),l=pi(l,l.next),Hs(o,t,e,n,s,r,0),Hs(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function z_(i,t,e,n){let s=[],r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=du(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(q_(c));for(s.sort(B_),r=0;r<s.length;r++)e=V_(s[r],e);return e}function B_(i,t){return i.x-t.x}function V_(i,t){let e=H_(i,t);if(!e)return t;let n=pu(e,i);return pi(n,n.next),pi(e,e.next)}function H_(i,t){let e=t,n=-1/0,s,r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,s=e.x<e.next.x?e:e.next,d===r))return s}e=e.next}while(e!==t);if(!s)return null;let a=s,l=s.x,c=s.y,u=1/0,h;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Yi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(h=Math.abs(o-e.y)/(r-e.x),Gs(e,i)&&(h<u||h===u&&(e.x>s.x||e.x===s.x&&G_(s,e)))&&(s=e,u=h)),e=e.next;while(e!==a);return s}function G_(i,t){return ue(i.prev,i,t.prev)<0&&ue(t.next,i,i.next)<0}function W_(i,t,e,n){let s=i;do s.z===0&&(s.z=Ka(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,X_(s)}function X_(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function Ka(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function q_(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Yi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Y_(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!$_(i,t)&&(Gs(i,t)&&Gs(t,i)&&Z_(i,t)&&(ue(i.prev,i,t.prev)||ue(i,t.prev,t))||vo(i,t)&&ue(i.prev,i,i.next)>0&&ue(t.prev,t,t.next)>0)}function ue(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function vo(i,t){return i.x===t.x&&i.y===t.y}function fu(i,t,e,n){let s=kr(ue(i,t,e)),r=kr(ue(i,t,n)),o=kr(ue(e,n,i)),a=kr(ue(e,n,t));return!!(s!==r&&o!==a||s===0&&Fr(i,e,t)||r===0&&Fr(i,n,t)||o===0&&Fr(e,i,n)||a===0&&Fr(e,t,n))}function Fr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function kr(i){return i>0?1:i<0?-1:0}function $_(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&fu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Gs(i,t){return ue(i.prev,i,i.next)<0?ue(i,t,i.next)>=0&&ue(i,i.prev,t)>=0:ue(i,t,i.prev)<0||ue(i,i.next,t)<0}function Z_(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function pu(i,t){let e=new Qa(i.i,i.x,i.y),n=new Qa(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Oh(i,t,e,n){let s=new Qa(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ws(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Qa(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function j_(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}var lo=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];Fh(t),kh(n,t);let o=t.length;e.forEach(Fh);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,kh(n,e[l]);let a=D_.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}};function Fh(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function kh(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Dn=class i extends Ja{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var ss=class i extends ee{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,u=[],h=new C,d=new C,f=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){let y=[],x=m/n,M=0;m===0&&o===0?M=.5/e:m===n&&l===Math.PI&&(M=-.5/e);for(let A=0;A<=e;A++){let b=A/e;h.x=-t*Math.cos(s+b*r)*Math.sin(o+x*a),h.y=t*Math.cos(o+x*a),h.z=t*Math.sin(s+b*r)*Math.sin(o+x*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),p.push(b+M,1-x),y.push(c++)}u.push(y)}for(let m=0;m<n;m++)for(let y=0;y<e;y++){let x=u[m][y+1],M=u[m][y],A=u[m+1][y],b=u[m+1][y+1];(m!==0||o>0)&&f.push(x,M,b),(m!==n-1||l<Math.PI)&&f.push(M,A,b)}this.setIndex(f),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(_,3)),this.setAttribute("uv",new $t(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Jn=class i extends ee{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let o=[],a=[],l=[],c=[],u=new C,h=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){let _=g/s*r,p=f/n*Math.PI*2;h.x=(t+e*Math.cos(p))*Math.cos(_),h.y=(t+e*Math.cos(p))*Math.sin(_),h.z=e*Math.sin(p),a.push(h.x,h.y,h.z),u.x=t*Math.cos(_),u.y=t*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){let _=(s+1)*f+g-1,p=(s+1)*(f-1)+g-1,m=(s+1)*(f-1)+g,y=(s+1)*f+g;o.push(_,p,y),o.push(p,m,y)}this.setIndex(o),this.setAttribute("position",new $t(a,3)),this.setAttribute("normal",new $t(l,3)),this.setAttribute("uv",new $t(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var co=class extends In{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Lt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Lt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=tu,this.normalScale=new Rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function zr(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function J_(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var rs=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},tl=class extends rs{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Lc,endingEnd:Lc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Ic:r=t,a=2*e-n;break;case Uc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Ic:o=t,l=2*n-e;break;case Uc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,u=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*u,this._offsetNext=o*u}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-e)/(s-e),_=g*g,p=_*g,m=-d*p+2*d*_-d*g,y=(1+d)*p+(-1.5-2*d)*_+(-.5+d)*g+1,x=(-1-f)*p+(1.5+f)*_+.5*g,M=f*p-f*_;for(let A=0;A!==a;++A)r[A]=m*o[u+A]+y*o[c+A]+x*o[l+A]+M*o[h+A];return r}},el=class extends rs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,u=(n-e)/(s-e),h=1-u;for(let d=0;d!==a;++d)r[d]=o[c+d]*h+o[l+d]*u;return r}},nl=class extends rs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},dn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=zr(e,this.TimeBufferType),this.values=zr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:zr(t.times,Array),values:zr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new nl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new el(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new tl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Vr:e=this.InterpolantFactoryMethodDiscrete;break;case Hr:e=this.InterpolantFactoryMethodLinear;break;case ea:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Vr;case this.InterpolantFactoryMethodLinear:return Hr;case this.InterpolantFactoryMethodSmooth:return ea}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&J_(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ea,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],u=t[a+1];if(c!==u&&(a!==1||c!==t[0]))if(s)l=!0;else{let h=a*n,d=h-n,f=h+n;for(let g=0;g!==n;++g){let _=e[h+g];if(_!==e[d+g]||_!==e[f+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let h=a*n,d=o*n;for(let f=0;f!==n;++f)e[d+f]=e[h+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};dn.prototype.TimeBufferType=Float32Array;dn.prototype.ValueBufferType=Float32Array;dn.prototype.DefaultInterpolation=Hr;var mi=class extends dn{};mi.prototype.ValueTypeName="bool";mi.prototype.ValueBufferType=Array;mi.prototype.DefaultInterpolation=Vr;mi.prototype.InterpolantFactoryMethodLinear=void 0;mi.prototype.InterpolantFactoryMethodSmooth=void 0;var il=class extends dn{};il.prototype.ValueTypeName="color";var sl=class extends dn{};sl.prototype.ValueTypeName="number";var rl=class extends rs{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let u=c+a;c!==u;c+=4)Ft.slerpFlat(r,0,o,c-a,o,c,l);return r}},Xs=class extends dn{InterpolantFactoryMethodLinear(t){return new rl(this.times,this.values,this.getValueSize(),t)}};Xs.prototype.ValueTypeName="quaternion";Xs.prototype.DefaultInterpolation=Hr;Xs.prototype.InterpolantFactoryMethodSmooth=void 0;var gi=class extends dn{};gi.prototype.ValueTypeName="string";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=Vr;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var ol=class extends dn{};ol.prototype.ValueTypeName="vector";var zh={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(this.files[i]=t)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}},al=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null}}},K_=new al,qs=class{constructor(t){this.manager=t!==void 0?t:K_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};qs.DEFAULT_MATERIAL_NAME="__DEFAULT";var An={},ll=class extends Error{constructor(t,e){super(t),this.response=e}},cl=class extends qs{constructor(t){super(t)}load(t,e,n,s){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=zh.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(An[t]!==void 0){An[t].push({onLoad:e,onProgress:n,onError:s});return}An[t]=[],An[t].push({onLoad:e,onProgress:n,onError:s});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let u=An[t],h=c.body.getReader(),d=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),f=d?parseInt(d):0,g=f!==0,_=0,p=new ReadableStream({start(m){y();function y(){h.read().then(({done:x,value:M})=>{if(x)m.close();else{_+=M.byteLength;let A=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let b=0,S=u.length;b<S;b++){let P=u[b];P.onProgress&&P.onProgress(A)}m.enqueue(M),y()}})}}});return new Response(p)}else throw new ll(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(u=>new DOMParser().parseFromString(u,a));case"json":return c.json();default:if(a===void 0)return c.text();{let h=/charset="?([^;"\s]*)"?/i.exec(a),d=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{zh.add(t,c);let u=An[t];delete An[t];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onLoad&&f.onLoad(c)}}).catch(c=>{let u=An[t];if(u===void 0)throw this.manager.itemError(t),c;delete An[t];for(let h=0,d=u.length;h<d;h++){let f=u[h];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}};var ho=class extends qs{constructor(t){super(t)}load(t,e,n,s){let r=this,o=new ns,a=new cl(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(l){let c;try{c=r.parse(l)}catch(u){if(s!==void 0)s(u);else{console.error(u);return}}c.image!==void 0?o.image=c.image:c.data!==void 0&&(o.image.width=c.width,o.image.height=c.height,o.image.data=c.data),o.wrapS=c.wrapS!==void 0?c.wrapS:Qe,o.wrapT=c.wrapT!==void 0?c.wrapT:Qe,o.magFilter=c.magFilter!==void 0?c.magFilter:Re,o.minFilter=c.minFilter!==void 0?c.minFilter:Re,o.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0?o.colorSpace=c.colorSpace:c.encoding!==void 0&&(o.encoding=c.encoding),c.flipY!==void 0&&(o.flipY=c.flipY),c.format!==void 0&&(o.format=c.format),c.type!==void 0&&(o.type=c.type),c.mipmaps!==void 0&&(o.mipmaps=c.mipmaps,o.minFilter=gn),c.mipmapCount===1&&(o.minFilter=Re),c.generateMipmaps!==void 0&&(o.generateMipmaps=c.generateMipmaps),o.needsUpdate=!0,e&&e(o,c)},n,s),o}};var uo=class extends oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Lt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},fo=class extends uo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Lt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Ta=new ct,Bh=new C,Vh=new C,hl=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Rt(512,512),this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ns,this._frameExtents=new Rt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Bh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bh),Vh.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Vh),e.updateMatrixWorld(),Ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ta),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var ul=class extends hl{constructor(){super(new eo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},po=class extends uo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.shadow=new ul}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var yl="\\[\\]\\.:\\/",Q_=new RegExp("["+yl+"]","g"),vl="[^"+yl+"]",tx="[^"+yl.replace("\\.","")+"]",ex=/((?:WC+[\/:])*)/.source.replace("WC",vl),nx=/(WCOD+)?/.source.replace("WCOD",tx),ix=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",vl),sx=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",vl),rx=new RegExp("^"+ex+nx+ix+sx+"$"),ox=["material","materials","bones","map"],dl=class{constructor(t,e,n){let s=n||ae.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ae=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Q_,"")}static parseTrackName(t){let e=rx.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);ox.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===c){c=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ae.Composite=dl;ae.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ae.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ae.prototype.GetterByBindingType=[ae.prototype._getValue_direct,ae.prototype._getValue_array,ae.prototype._getValue_arrayElement,ae.prototype._getValue_toArray];ae.prototype.SetterByBindingTypeAndVersioning=[[ae.prototype._setValue_direct,ae.prototype._setValue_direct_setNeedsUpdate,ae.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_array,ae.prototype._setValue_array_setNeedsUpdate,ae.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_arrayElement,ae.prototype._setValue_arrayElement_setNeedsUpdate,ae.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ae.prototype._setValue_fromArray,ae.prototype._setValue_fromArray_setNeedsUpdate,ae.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var hy=new Float32Array(1);var os=class{constructor(t,e,n=0,s=1/0){this.ray=new Ln(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ds,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return fl(t,this,n,e),n.sort(Hh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)fl(t[s],this,n,e);return n.sort(Hh),n}};function Hh(i,t){return i.distance-t.distance}function fl(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,o=s.length;r<o;r++)fl(s[r],t,e,!0)}}var Ys=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var mo=class extends Bs{constructor(t=10,e=10,n=4473924,s=8947848){n=new Lt(n),s=new Lt(s);let r=e/2,o=t/e,a=t/2,l=[],c=[];for(let d=0,f=0,g=-a;d<=e;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);let _=d===r?n:s;_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3,_.toArray(c,f),f+=3}let u=new ee;u.setAttribute("position",new $t(l,3)),u.setAttribute("color",new $t(c,3));let h=new jn({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pl);var mu={type:"change"},Ml={type:"start"},gu={type:"end"},Mo=new Ln,_u=new ln,ax=Math.cos(70*nu.DEG2RAD),bo=class extends _n{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:fn.ROTATE,MIDDLE:fn.DOLLY,RIGHT:fn.PAN},this.touches={ONE:_i.ROTATE,TWO:_i.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(L){L.addEventListener("keydown",ot),this._domElementKeyEvents=L},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ot),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(mu),n.update(),r=s.NONE},this.update=function(){let L=new C,nt=new Ft().setFromUnitVectors(t.up,new C(0,1,0)),ft=nt.clone().invert(),lt=new C,Et=new Ft,Xt=new C,jt=2*Math.PI;return function(dt=null){let D=n.object.position;L.copy(D).sub(n.target),L.applyQuaternion(nt),a.setFromVector3(L),n.autoRotate&&r===s.NONE&&O(v(dt)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let ht=n.minAzimuthAngle,ut=n.maxAzimuthAngle;isFinite(ht)&&isFinite(ut)&&(ht<-Math.PI?ht+=jt:ht>Math.PI&&(ht-=jt),ut<-Math.PI?ut+=jt:ut>Math.PI&&(ut-=jt),ht<=ut?a.theta=Math.max(ht,Math.min(ut,a.theta)):a.theta=a.theta>(ht+ut)/2?Math.max(ht,a.theta):Math.min(ut,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&b||n.object.isOrthographicCamera?a.radius=z(a.radius):a.radius=z(a.radius*c),L.setFromSpherical(a),L.applyQuaternion(ft),D.copy(n.target).add(L),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let Pt=!1;if(n.zoomToCursor&&b){let At=null;if(n.object.isPerspectiveCamera){let Jt=L.length();At=z(Jt*c);let Kt=Jt-At;n.object.position.addScaledVector(M,Kt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let Jt=new C(A.x,A.y,0);Jt.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Pt=!0;let Kt=new C(A.x,A.y,0);Kt.unproject(n.object),n.object.position.sub(Kt).add(Jt),n.object.updateMatrixWorld(),At=L.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;At!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(At).add(n.object.position):(Mo.origin.copy(n.object.position),Mo.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Mo.direction))<ax?t.lookAt(n.target):(_u.setFromNormalAndCoplanarPoint(n.object.up,n.target),Mo.intersectPlane(_u,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Pt=!0);return c=1,b=!1,Pt||lt.distanceToSquared(n.object.position)>o||8*(1-Et.dot(n.object.quaternion))>o||Xt.distanceToSquared(n.target)>0?(n.dispatchEvent(mu),lt.copy(n.object.position),Et.copy(n.object.quaternion),Xt.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",vt),n.domElement.removeEventListener("pointerdown",Ot),n.domElement.removeEventListener("pointercancel",E),n.domElement.removeEventListener("wheel",rt),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",E),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ot),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,o=1e-6,a=new Ys,l=new Ys,c=1,u=new C,h=new Rt,d=new Rt,f=new Rt,g=new Rt,_=new Rt,p=new Rt,m=new Rt,y=new Rt,x=new Rt,M=new C,A=new Rt,b=!1,S=[],P={};function v(L){return L!==null?2*Math.PI/60*n.autoRotateSpeed*L:2*Math.PI/60/60*n.autoRotateSpeed}function w(L){let nt=Math.abs(L)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*nt)}function O(L){l.theta-=L}function G(L){l.phi-=L}let et=function(){let L=new C;return function(ft,lt){L.setFromMatrixColumn(lt,0),L.multiplyScalar(-ft),u.add(L)}}(),I=function(){let L=new C;return function(ft,lt){n.screenSpacePanning===!0?L.setFromMatrixColumn(lt,1):(L.setFromMatrixColumn(lt,0),L.crossVectors(n.object.up,L)),L.multiplyScalar(ft),u.add(L)}}(),U=function(){let L=new C;return function(ft,lt){let Et=n.domElement;if(n.object.isPerspectiveCamera){let Xt=n.object.position;L.copy(Xt).sub(n.target);let jt=L.length();jt*=Math.tan(n.object.fov/2*Math.PI/180),et(2*ft*jt/Et.clientHeight,n.object.matrix),I(2*lt*jt/Et.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(et(ft*(n.object.right-n.object.left)/n.object.zoom/Et.clientWidth,n.object.matrix),I(lt*(n.object.top-n.object.bottom)/n.object.zoom/Et.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function N(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function W(L){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=L:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function H(L,nt){if(!n.zoomToCursor)return;b=!0;let ft=n.domElement.getBoundingClientRect(),lt=L-ft.left,Et=nt-ft.top,Xt=ft.width,jt=ft.height;A.x=lt/Xt*2-1,A.y=-(Et/jt)*2+1,M.set(A.x,A.y,1).unproject(n.object).sub(n.object.position).normalize()}function z(L){return Math.max(n.minDistance,Math.min(n.maxDistance,L))}function J(L){h.set(L.clientX,L.clientY)}function j(L){H(L.clientX,L.clientX),m.set(L.clientX,L.clientY)}function Q(L){g.set(L.clientX,L.clientY)}function F(L){d.set(L.clientX,L.clientY),f.subVectors(d,h).multiplyScalar(n.rotateSpeed);let nt=n.domElement;O(2*Math.PI*f.x/nt.clientHeight),G(2*Math.PI*f.y/nt.clientHeight),h.copy(d),n.update()}function V(L){y.set(L.clientX,L.clientY),x.subVectors(y,m),x.y>0?N(w(x.y)):x.y<0&&W(w(x.y)),m.copy(y),n.update()}function K(L){_.set(L.clientX,L.clientY),p.subVectors(_,g).multiplyScalar(n.panSpeed),U(p.x,p.y),g.copy(_),n.update()}function k(L){H(L.clientX,L.clientY),L.deltaY<0?W(w(L.deltaY)):L.deltaY>0&&N(w(L.deltaY)),n.update()}function tt(L){let nt=!1;switch(L.code){case n.keys.UP:L.ctrlKey||L.metaKey||L.shiftKey?G(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,n.keyPanSpeed),nt=!0;break;case n.keys.BOTTOM:L.ctrlKey||L.metaKey||L.shiftKey?G(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(0,-n.keyPanSpeed),nt=!0;break;case n.keys.LEFT:L.ctrlKey||L.metaKey||L.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(n.keyPanSpeed,0),nt=!0;break;case n.keys.RIGHT:L.ctrlKey||L.metaKey||L.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):U(-n.keyPanSpeed,0),nt=!0;break}nt&&(L.preventDefault(),n.update())}function gt(L){if(S.length===1)h.set(L.pageX,L.pageY);else{let nt=Zt(L),ft=.5*(L.pageX+nt.x),lt=.5*(L.pageY+nt.y);h.set(ft,lt)}}function bt(L){if(S.length===1)g.set(L.pageX,L.pageY);else{let nt=Zt(L),ft=.5*(L.pageX+nt.x),lt=.5*(L.pageY+nt.y);g.set(ft,lt)}}function Mt(L){let nt=Zt(L),ft=L.pageX-nt.x,lt=L.pageY-nt.y,Et=Math.sqrt(ft*ft+lt*lt);m.set(0,Et)}function Vt(L){n.enableZoom&&Mt(L),n.enablePan&&bt(L)}function X(L){n.enableZoom&&Mt(L),n.enableRotate&&gt(L)}function fe(L){if(S.length==1)d.set(L.pageX,L.pageY);else{let ft=Zt(L),lt=.5*(L.pageX+ft.x),Et=.5*(L.pageY+ft.y);d.set(lt,Et)}f.subVectors(d,h).multiplyScalar(n.rotateSpeed);let nt=n.domElement;O(2*Math.PI*f.x/nt.clientHeight),G(2*Math.PI*f.y/nt.clientHeight),h.copy(d)}function wt(L){if(S.length===1)_.set(L.pageX,L.pageY);else{let nt=Zt(L),ft=.5*(L.pageX+nt.x),lt=.5*(L.pageY+nt.y);_.set(ft,lt)}p.subVectors(_,g).multiplyScalar(n.panSpeed),U(p.x,p.y),g.copy(_)}function Ut(L){let nt=Zt(L),ft=L.pageX-nt.x,lt=L.pageY-nt.y,Et=Math.sqrt(ft*ft+lt*lt);y.set(0,Et),x.set(0,Math.pow(y.y/m.y,n.zoomSpeed)),N(x.y),m.copy(y);let Xt=(L.pageX+nt.x)*.5,jt=(L.pageY+nt.y)*.5;H(Xt,jt)}function yt(L){n.enableZoom&&Ut(L),n.enablePan&&wt(L)}function Qt(L){n.enableZoom&&Ut(L),n.enableRotate&&fe(L)}function Ot(L){n.enabled!==!1&&(S.length===0&&(n.domElement.setPointerCapture(L.pointerId),n.domElement.addEventListener("pointermove",R),n.domElement.addEventListener("pointerup",E)),It(L),L.pointerType==="touch"?St(L):q(L))}function R(L){n.enabled!==!1&&(L.pointerType==="touch"?_t(L):st(L))}function E(L){zt(L),S.length===0&&(n.domElement.releasePointerCapture(L.pointerId),n.domElement.removeEventListener("pointermove",R),n.domElement.removeEventListener("pointerup",E)),n.dispatchEvent(gu),r=s.NONE}function q(L){let nt;switch(L.button){case 0:nt=n.mouseButtons.LEFT;break;case 1:nt=n.mouseButtons.MIDDLE;break;case 2:nt=n.mouseButtons.RIGHT;break;default:nt=-1}switch(nt){case fn.DOLLY:if(n.enableZoom===!1)return;j(L),r=s.DOLLY;break;case fn.ROTATE:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enablePan===!1)return;Q(L),r=s.PAN}else{if(n.enableRotate===!1)return;J(L),r=s.ROTATE}break;case fn.PAN:if(L.ctrlKey||L.metaKey||L.shiftKey){if(n.enableRotate===!1)return;J(L),r=s.ROTATE}else{if(n.enablePan===!1)return;Q(L),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ml)}function st(L){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;F(L);break;case s.DOLLY:if(n.enableZoom===!1)return;V(L);break;case s.PAN:if(n.enablePan===!1)return;K(L);break}}function rt(L){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(L.preventDefault(),n.dispatchEvent(Ml),k(L),n.dispatchEvent(gu))}function ot(L){n.enabled===!1||n.enablePan===!1||tt(L)}function St(L){switch(it(L),S.length){case 1:switch(n.touches.ONE){case _i.ROTATE:if(n.enableRotate===!1)return;gt(L),r=s.TOUCH_ROTATE;break;case _i.PAN:if(n.enablePan===!1)return;bt(L),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case _i.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Vt(L),r=s.TOUCH_DOLLY_PAN;break;case _i.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;X(L),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ml)}function _t(L){switch(it(L),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;fe(L),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;wt(L),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;yt(L),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Qt(L),n.update();break;default:r=s.NONE}}function vt(L){n.enabled!==!1&&L.preventDefault()}function It(L){S.push(L.pointerId)}function zt(L){delete P[L.pointerId];for(let nt=0;nt<S.length;nt++)if(S[nt]==L.pointerId){S.splice(nt,1);return}}function it(L){let nt=P[L.pointerId];nt===void 0&&(nt=new Rt,P[L.pointerId]=nt),nt.set(L.pageX,L.pageY)}function Zt(L){let nt=L.pointerId===S[0]?S[1]:S[0];return P[nt]}n.domElement.addEventListener("contextmenu",vt),n.domElement.addEventListener("pointerdown",Ot),n.domElement.addEventListener("pointercancel",E),n.domElement.addEventListener("wheel",rt,{passive:!1}),this.update()}};var yi=new os,Fe=new C,Kn=new C,ce=new Ft,xu={X:new C(1,0,0),Y:new C(0,1,0),Z:new C(0,0,1)},bl={type:"change"},yu={type:"mouseDown"},vu={type:"mouseUp",mode:null},Mu={type:"objectChange"},To=class extends oe{constructor(t,e){super(),e===void 0&&(console.warn('THREE.TransformControls: The second parameter "domElement" is now mandatory.'),e=document),this.isTransformControls=!0,this.visible=!1,this.domElement=e,this.domElement.style.touchAction="none";let n=new wl;this._gizmo=n,this.add(n);let s=new El;this._plane=s,this.add(s);let r=this;function o(y,x){let M=x;Object.defineProperty(r,y,{get:function(){return M!==void 0?M:x},set:function(A){M!==A&&(M=A,s[y]=A,n[y]=A,r.dispatchEvent({type:y+"-changed",value:A}),r.dispatchEvent(bl))}}),r[y]=x,s[y]=x,n[y]=x}o("camera",t),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0);let a=new C,l=new C,c=new Ft,u=new Ft,h=new C,d=new Ft,f=new C,g=new C,_=new C,p=0,m=new C;o("worldPosition",a),o("worldPositionStart",l),o("worldQuaternion",c),o("worldQuaternionStart",u),o("cameraPosition",h),o("cameraQuaternion",d),o("pointStart",f),o("pointEnd",g),o("rotationAxis",_),o("rotationAngle",p),o("eye",m),this._offset=new C,this._startNorm=new C,this._endNorm=new C,this._cameraScale=new C,this._parentPosition=new C,this._parentQuaternion=new Ft,this._parentQuaternionInv=new Ft,this._parentScale=new C,this._worldScaleStart=new C,this._worldQuaternionInv=new Ft,this._worldScale=new C,this._positionStart=new C,this._quaternionStart=new Ft,this._scaleStart=new C,this._getPointer=lx.bind(this),this._onPointerDown=hx.bind(this),this._onPointerHover=cx.bind(this),this._onPointerMove=ux.bind(this),this._onPointerUp=dx.bind(this),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp)}updateMatrixWorld(){this.object!==void 0&&(this.object.updateMatrixWorld(),this.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):this.object.parent.matrixWorld.decompose(this._parentPosition,this._parentQuaternion,this._parentScale),this.object.matrixWorld.decompose(this.worldPosition,this.worldQuaternion,this._worldScale),this._parentQuaternionInv.copy(this._parentQuaternion).invert(),this._worldQuaternionInv.copy(this.worldQuaternion).invert()),this.camera.updateMatrixWorld(),this.camera.matrixWorld.decompose(this.cameraPosition,this.cameraQuaternion,this._cameraScale),this.camera.isOrthographicCamera?this.camera.getWorldDirection(this.eye).negate():this.eye.copy(this.cameraPosition).sub(this.worldPosition).normalize(),super.updateMatrixWorld(this)}pointerHover(t){if(this.object===void 0||this.dragging===!0)return;yi.setFromCamera(t,this.camera);let e=Sl(this._gizmo.picker[this.mode],yi);e?this.axis=e.object.name:this.axis=null}pointerDown(t){if(!(this.object===void 0||this.dragging===!0||t.button!==0)&&this.axis!==null){yi.setFromCamera(t,this.camera);let e=Sl(this._plane,yi,!0);e&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(e.point).sub(this.worldPositionStart)),this.dragging=!0,yu.mode=this.mode,this.dispatchEvent(yu)}}pointerMove(t){let e=this.axis,n=this.mode,s=this.object,r=this.space;if(n==="scale"?r="local":(e==="E"||e==="XYZE"||e==="XYZ")&&(r="world"),s===void 0||e===null||this.dragging===!1||t.button!==-1)return;yi.setFromCamera(t,this.camera);let o=Sl(this._plane,yi,!0);if(o){if(this.pointEnd.copy(o.point).sub(this.worldPositionStart),n==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&e!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),e.indexOf("X")===-1&&(this._offset.x=0),e.indexOf("Y")===-1&&(this._offset.y=0),e.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&e!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(ce.copy(this._quaternionStart).invert()),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Fe.setFromMatrixPosition(s.parent.matrixWorld)),e.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),e.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),e.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Fe.setFromMatrixPosition(s.parent.matrixWorld))));else if(n==="scale"){if(e.search("XYZ")!==-1){let a=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(a*=-1),Kn.set(a,a,a)}else Fe.copy(this.pointStart),Kn.copy(this.pointEnd),Fe.applyQuaternion(this._worldQuaternionInv),Kn.applyQuaternion(this._worldQuaternionInv),Kn.divide(Fe),e.search("X")===-1&&(Kn.x=1),e.search("Y")===-1&&(Kn.y=1),e.search("Z")===-1&&(Kn.z=1);s.scale.copy(this._scaleStart).multiply(Kn),this.scaleSnap&&(e.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),e.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(n==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);let a=20/this.worldPosition.distanceTo(Fe.setFromMatrixPosition(this.camera.matrixWorld)),l=!1;e==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Fe.copy(this.rotationAxis).cross(this.eye))*a):(e==="X"||e==="Y"||e==="Z")&&(this.rotationAxis.copy(xu[e]),Fe.copy(xu[e]),r==="local"&&Fe.applyQuaternion(this.worldQuaternion),Fe.cross(this.eye),Fe.length()===0?l=!0:this.rotationAngle=this._offset.dot(Fe.normalize())*a),(e==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&e!=="E"&&e!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(ce.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(ce.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(bl),this.dispatchEvent(Mu)}}pointerUp(t){t.button===0&&(this.dragging&&this.axis!==null&&(vu.mode=this.mode,this.dispatchEvent(vu)),this.dragging=!1,this.axis=null)}dispose(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.traverse(function(t){t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}attach(t){return this.object=t,this.visible=!0,this}detach(){return this.object=void 0,this.visible=!1,this.axis=null,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(bl),this.dispatchEvent(Mu),this.pointStart.copy(this.pointEnd))}getRaycaster(){return yi}getMode(){return this.mode}setMode(t){this.mode=t}setTranslationSnap(t){this.translationSnap=t}setRotationSnap(t){this.rotationSnap=t}setScaleSnap(t){this.scaleSnap=t}setSize(t){this.size=t}setSpace(t){this.space=t}};function lx(i){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:i.button};{let t=this.domElement.getBoundingClientRect();return{x:(i.clientX-t.left)/t.width*2-1,y:-(i.clientY-t.top)/t.height*2+1,button:i.button}}}function cx(i){if(this.enabled)switch(i.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(i));break}}function hx(i){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(i)),this.pointerDown(this._getPointer(i)))}function ux(i){this.enabled&&this.pointerMove(this._getPointer(i))}function dx(i){this.enabled&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(i)))}function Sl(i,t,e){let n=t.intersectObject(i,!0);for(let s=0;s<n.length;s++)if(n[s].object.visible||e)return n[s];return!1}var So=new Te,ne=new C(0,1,0),bu=new C(0,0,0),Su=new ct,wo=new Ft,Ao=new Ft,xn=new C,wu=new ct,Js=new C(1,0,0),vi=new C(0,1,0),Ks=new C(0,0,1),Eo=new C,Zs=new C,js=new C,wl=class extends oe{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";let t=new Pe({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),e=new jn({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),n=t.clone();n.opacity=.15;let s=e.clone();s.opacity=.5;let r=t.clone();r.color.setHex(16711680);let o=t.clone();o.color.setHex(65280);let a=t.clone();a.color.setHex(255);let l=t.clone();l.color.setHex(16711680),l.opacity=.5;let c=t.clone();c.color.setHex(65280),c.opacity=.5;let u=t.clone();u.color.setHex(255),u.opacity=.5;let h=t.clone();h.opacity=.25;let d=t.clone();d.color.setHex(16776960),d.opacity=.25,t.clone().color.setHex(16776960);let g=t.clone();g.color.setHex(7895160);let _=new Le(0,.04,.1,12);_.translate(0,.05,0);let p=new xe(.08,.08,.08);p.translate(0,.04,0);let m=new ee;m.setAttribute("position",new $t([0,0,0,1,0,0],3));let y=new Le(.0075,.0075,.5,3);y.translate(0,.25,0);function x(U,N){let W=new Jn(U,.0075,3,64,N*Math.PI*2);return W.rotateY(Math.PI/2),W.rotateX(Math.PI/2),W}function M(){let U=new ee;return U.setAttribute("position",new $t([0,0,0,1,1,1],3)),U}let A={X:[[new mt(_,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(_,r),[-.5,0,0],[0,0,Math.PI/2]],[new mt(y,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new mt(_,o),[0,.5,0]],[new mt(_,o),[0,-.5,0],[Math.PI,0,0]],[new mt(y,o)]],Z:[[new mt(_,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(_,a),[0,0,-.5],[-Math.PI/2,0,0]],[new mt(y,a),null,[Math.PI/2,0,0]]],XYZ:[[new mt(new Dn(.1,0),h.clone()),[0,0,0]]],XY:[[new mt(new xe(.15,.15,.01),u.clone()),[.15,.15,0]]],YZ:[[new mt(new xe(.15,.15,.01),l.clone()),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new xe(.15,.15,.01),c.clone()),[.15,0,.15],[-Math.PI/2,0,0]]]},b={X:[[new mt(new Le(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Le(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Le(.2,0,.6,4),n),[0,.3,0]],[new mt(new Le(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Le(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Le(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new mt(new Dn(.2,0),n)]],XY:[[new mt(new xe(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new xe(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new xe(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new mt(new Dn(.01,2),s),null,null,null,"helper"]],END:[[new mt(new Dn(.01,2),s),null,null,null,"helper"]],DELTA:[[new sn(M(),s),null,null,null,"helper"]],X:[[new sn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new sn(m,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new sn(m,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},P={XYZE:[[new mt(x(.5,1),g),null,[0,Math.PI/2,0]]],X:[[new mt(x(.5,.5),r)]],Y:[[new mt(x(.5,.5),o),null,[0,0,-Math.PI/2]]],Z:[[new mt(x(.5,.5),a),null,[0,Math.PI/2,0]]],E:[[new mt(x(.75,1),d),null,[0,Math.PI/2,0]]]},v={AXIS:[[new sn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]]},w={XYZE:[[new mt(new ss(.25,10,8),n)]],X:[[new mt(new Jn(.5,.1,4,24),n),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new mt(new Jn(.5,.1,4,24),n),[0,0,0],[Math.PI/2,0,0]]],Z:[[new mt(new Jn(.5,.1,4,24),n),[0,0,0],[0,0,-Math.PI/2]]],E:[[new mt(new Jn(.75,.1,2,24),n)]]},O={X:[[new mt(p,r),[.5,0,0],[0,0,-Math.PI/2]],[new mt(y,r),[0,0,0],[0,0,-Math.PI/2]],[new mt(p,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new mt(p,o),[0,.5,0]],[new mt(y,o)],[new mt(p,o),[0,-.5,0],[0,0,Math.PI]]],Z:[[new mt(p,a),[0,0,.5],[Math.PI/2,0,0]],[new mt(y,a),[0,0,0],[Math.PI/2,0,0]],[new mt(p,a),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new mt(new xe(.15,.15,.01),u),[.15,.15,0]]],YZ:[[new mt(new xe(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new xe(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new xe(.1,.1,.1),h.clone())]]},G={X:[[new mt(new Le(.2,0,.6,4),n),[.3,0,0],[0,0,-Math.PI/2]],[new mt(new Le(.2,0,.6,4),n),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new mt(new Le(.2,0,.6,4),n),[0,.3,0]],[new mt(new Le(.2,0,.6,4),n),[0,-.3,0],[0,0,Math.PI]]],Z:[[new mt(new Le(.2,0,.6,4),n),[0,0,.3],[Math.PI/2,0,0]],[new mt(new Le(.2,0,.6,4),n),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new mt(new xe(.2,.2,.01),n),[.15,.15,0]]],YZ:[[new mt(new xe(.2,.2,.01),n),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new mt(new xe(.2,.2,.01),n),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new mt(new xe(.2,.2,.2),n),[0,0,0]]]},et={X:[[new sn(m,s.clone()),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new sn(m,s.clone()),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new sn(m,s.clone()),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function I(U){let N=new oe;for(let W in U)for(let H=U[W].length;H--;){let z=U[W][H][0].clone(),J=U[W][H][1],j=U[W][H][2],Q=U[W][H][3],F=U[W][H][4];z.name=W,z.tag=F,J&&z.position.set(J[0],J[1],J[2]),j&&z.rotation.set(j[0],j[1],j[2]),Q&&z.scale.set(Q[0],Q[1],Q[2]),z.updateMatrix();let V=z.geometry.clone();V.applyMatrix4(z.matrix),z.geometry=V,z.renderOrder=1/0,z.position.set(0,0,0),z.rotation.set(0,0,0),z.scale.set(1,1,1),N.add(z)}return N}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=I(A)),this.add(this.gizmo.rotate=I(P)),this.add(this.gizmo.scale=I(O)),this.add(this.picker.translate=I(b)),this.add(this.picker.rotate=I(w)),this.add(this.picker.scale=I(G)),this.add(this.helper.translate=I(S)),this.add(this.helper.rotate=I(v)),this.add(this.helper.scale=I(et)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(t){let n=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Ao;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){let o=s[r];o.visible=!0,o.rotation.set(0,0,0),o.position.copy(this.worldPosition);let a;if(this.camera.isOrthographicCamera?a=(this.camera.top-this.camera.bottom)/this.camera.zoom:a=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),o.scale.set(1,1,1).multiplyScalar(a*this.size/4),o.tag==="helper"){o.visible=!1,o.name==="AXIS"?(o.visible=!!this.axis,this.axis==="X"&&(ce.setFromEuler(So.set(0,0,0)),o.quaternion.copy(n).multiply(ce),Math.abs(ne.copy(Js).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Y"&&(ce.setFromEuler(So.set(0,0,Math.PI/2)),o.quaternion.copy(n).multiply(ce),Math.abs(ne.copy(vi).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="Z"&&(ce.setFromEuler(So.set(0,Math.PI/2,0)),o.quaternion.copy(n).multiply(ce),Math.abs(ne.copy(Ks).applyQuaternion(n).dot(this.eye))>.9&&(o.visible=!1)),this.axis==="XYZE"&&(ce.setFromEuler(So.set(0,Math.PI/2,0)),ne.copy(this.rotationAxis),o.quaternion.setFromRotationMatrix(Su.lookAt(bu,ne,vi)),o.quaternion.multiply(ce),o.visible=this.dragging),this.axis==="E"&&(o.visible=!1)):o.name==="START"?(o.position.copy(this.worldPositionStart),o.visible=this.dragging):o.name==="END"?(o.position.copy(this.worldPosition),o.visible=this.dragging):o.name==="DELTA"?(o.position.copy(this.worldPositionStart),o.quaternion.copy(this.worldQuaternionStart),Fe.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Fe.applyQuaternion(this.worldQuaternionStart.clone().invert()),o.scale.copy(Fe),o.visible=this.dragging):(o.quaternion.copy(n),this.dragging?o.position.copy(this.worldPositionStart):o.position.copy(this.worldPosition),this.axis&&(o.visible=this.axis.search(o.name)!==-1));continue}o.quaternion.copy(n),this.mode==="translate"||this.mode==="scale"?(o.name==="X"&&Math.abs(ne.copy(Js).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Y"&&Math.abs(ne.copy(vi).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="Z"&&Math.abs(ne.copy(Ks).applyQuaternion(n).dot(this.eye))>.99&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XY"&&Math.abs(ne.copy(Ks).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="YZ"&&Math.abs(ne.copy(Js).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1),o.name==="XZ"&&Math.abs(ne.copy(vi).applyQuaternion(n).dot(this.eye))<.2&&(o.scale.set(1e-10,1e-10,1e-10),o.visible=!1)):this.mode==="rotate"&&(wo.copy(n),ne.copy(this.eye).applyQuaternion(ce.copy(n).invert()),o.name.search("E")!==-1&&o.quaternion.setFromRotationMatrix(Su.lookAt(this.eye,bu,vi)),o.name==="X"&&(ce.setFromAxisAngle(Js,Math.atan2(-ne.y,ne.z)),ce.multiplyQuaternions(wo,ce),o.quaternion.copy(ce)),o.name==="Y"&&(ce.setFromAxisAngle(vi,Math.atan2(ne.x,ne.z)),ce.multiplyQuaternions(wo,ce),o.quaternion.copy(ce)),o.name==="Z"&&(ce.setFromAxisAngle(Ks,Math.atan2(ne.y,ne.x)),ce.multiplyQuaternions(wo,ce),o.quaternion.copy(ce))),o.visible=o.visible&&(o.name.indexOf("X")===-1||this.showX),o.visible=o.visible&&(o.name.indexOf("Y")===-1||this.showY),o.visible=o.visible&&(o.name.indexOf("Z")===-1||this.showZ),o.visible=o.visible&&(o.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),o.material._color=o.material._color||o.material.color.clone(),o.material._opacity=o.material._opacity||o.material.opacity,o.material.color.copy(o.material._color),o.material.opacity=o.material._opacity,this.enabled&&this.axis&&(o.name===this.axis||this.axis.split("").some(function(l){return o.name===l}))&&(o.material.color.setHex(16776960),o.material.opacity=1)}super.updateMatrixWorld(t)}},El=class extends mt{constructor(){super(new Os(1e5,1e5,2,2),new Pe({visible:!1,wireframe:!0,side:Oe,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(t){let e=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(e="local"),Eo.copy(Js).applyQuaternion(e==="local"?this.worldQuaternion:Ao),Zs.copy(vi).applyQuaternion(e==="local"?this.worldQuaternion:Ao),js.copy(Ks).applyQuaternion(e==="local"?this.worldQuaternion:Ao),ne.copy(Zs),this.mode){case"translate":case"scale":switch(this.axis){case"X":ne.copy(this.eye).cross(Eo),xn.copy(Eo).cross(ne);break;case"Y":ne.copy(this.eye).cross(Zs),xn.copy(Zs).cross(ne);break;case"Z":ne.copy(this.eye).cross(js),xn.copy(js).cross(ne);break;case"XY":xn.copy(js);break;case"YZ":xn.copy(Eo);break;case"XZ":ne.copy(js),xn.copy(Zs);break;case"XYZ":case"E":xn.set(0,0,0);break}break;case"rotate":default:xn.set(0,0,0)}xn.length()===0?this.quaternion.copy(this.cameraQuaternion):(wu.lookAt(Fe.set(0,0,0),xn,ne),this.quaternion.setFromRotationMatrix(wu)),super.updateMatrixWorld(t)}};var cs=Math.PI/180,Al=.001,ls=new Te,fx=new Ft,px=new C,mx=new C,Tl=new ct,Qs=new ct,gx=new ct;function hs(){return{t:[0,0,0],r:[0,0,0],s:[1,1,1]}}function _x(i){return Number.isFinite(i)?Math.abs(i)<Al?i<0?-Al:Al:i:1}function Cl(i){let t=(e,n)=>Array.isArray(e)&&e.length===3?e.map(s=>Number.isFinite(+s)?+s:n):[n,n,n];return{t:t(i&&i.t,0),r:t(i&&i.r,0),s:t(i&&i.s,1).map(_x)}}function xx(i,t=1e-9){return i.t.every(e=>Math.abs(e)<=t)&&i.r.every(e=>Math.abs(e)<=t)&&i.s.every(e=>Math.abs(e-1)<=t)}function Rl(i,t=new Ft){return ls.set(i.r[0]*cs,i.r[1]*cs,i.r[2]*cs,"ZYX"),t.setFromEuler(ls)}function Pl(i,t=new ct){return t.compose(px.fromArray(i.t),Rl(i,fx),mx.fromArray(i.s))}function Eu(i,t,e){return ls.setFromQuaternion(t,"ZYX"),Cl({t:i.toArray(),r:[ls.x/cs,ls.y/cs,ls.z/cs],s:e.toArray()})}var Co=class{constructor(t,e){this.built=t,this.data=e,this.poses=new Map}has(t){return this.poses.has(t)}get(t){let e=this.poses.get(t);return e?Cl(e):hs()}get size(){return this.poses.size}restLocal(t,e=new ct){let s=this.built.nodeObjects[t].userData.baseMatrix;e.copy(s);let r=this.data.nodes[t],o=r.parent;if(r.type!=="joint"||r.segmentScaleCompensate===!1||r.inheritsTransform===!1||o<0||this.data.nodes[o].type!=="joint")return e;let a=this.poses.get(o);if(!a)return e;let l=a.s;if(l[0]===1&&l[1]===1&&l[2]===1)return e;let c=s.elements,u=c[12],h=c[13],d=c[14];return Qs.copy(s),Qs.elements[12]=0,Qs.elements[13]=0,Qs.elements[14]=0,Tl.makeScale(1/l[0],1/l[1],1/l[2]),e.multiplyMatrices(Tl,Qs),e.elements[12]=u,e.elements[13]=h,e.elements[14]=d,e}apply(t){let e=this.built.nodeObjects[t];this.restLocal(t,e.matrix);let n=this.poses.get(t);n&&e.matrix.multiply(Pl(n,gx))}set(t,e){let n=Cl(e);xx(n)?this.poses.delete(t):this.poses.set(t,n),this.apply(t);for(let s of this.built.childrenOf[t])this.apply(s)}reset(t){this.set(t,hs())}reapplyAll(){for(let t=0;t<this.built.nodeObjects.length;t++)this.apply(t)}resetAll(){this.poses.clear(),this.built.nodeObjects.forEach(t=>t.matrix.copy(t.userData.baseMatrix))}frameMatrix(t,e=new ct){let n=this.built.nodeObjects[t];return e.multiplyMatrices(n.parent.matrixWorld,this.restLocal(t,Tl.clone()))}};function Tu(i,t,e){let n=0;for(let h=0;h<t.length;h++)n+=Math.max(0,t[h]-2);let s=new Uint32Array(n*3),r=new Uint32Array(n),o=0,a=0,l=(h,d)=>i[h*3+d],c=(h,d,f,g)=>{s[o*3]=h,s[o*3+1]=d,s[o*3+2]=f,r[o++]=g};for(let h=0;h<t.length;h++){let d=t[h];if(d===3)c(a,a+1,a+2,h);else if(d===4){let f=e[a],g=e[a+1],_=e[a+2],p=e[a+3];Au(l,f,_)<=Au(l,g,p)?(c(a,a+1,a+2,h),c(a,a+2,a+3,h)):(c(a,a+1,a+3,h),c(a+1,a+2,a+3,h))}else if(d>4){let f=Array.from(e.slice(a,a+d)),g=vx(i,f);for(let _=0;_<g.length;_+=3)c(a+g[_],a+g[_+1],a+g[_+2],h)}a+=d}let u=new Uint32Array(o*3);for(let h=0;h<o*3;h++)u[h]=e[s[h]];return{index:u,corners:s,triCount:o,triToFace:r}}function Au(i,t,e){let n=i(t,0)-i(e,0),s=i(t,1)-i(e,1),r=i(t,2)-i(e,2);return n*n+s*s+r*r}function yx(i,t){let e=0,n=0,s=0;for(let r=0;r<t.length;r++){let o=t[r]*3,a=t[(r+1)%t.length]*3,l=i[o],c=i[o+1],u=i[o+2],h=i[a],d=i[a+1],f=i[a+2];e+=(c-d)*(u+f),n+=(u-f)*(l+h),s+=(l-h)*(c+d)}return[e,n,s]}function vx(i,t){let e=t.length,n=yx(i,t),s=Math.abs(n[0]),r=Math.abs(n[1]),o=Math.abs(n[2]),a=0,l=1;s>=r&&s>=o?(a=1,l=2):r>=o&&(a=2,l=0);let c=t.map(d=>new Rt(i[d*3+a],i[d*3+l])),u=null;try{u=lo.triangulateShape(c,[])}catch{u=null}let h=[];if(u&&u.length===e-2){for(let[d,f,g]of u){let _=f,p=g,m=Mx(i,t[d],t[_],t[p]);if(m[0]*n[0]+m[1]*n[1]+m[2]*n[2]<0){let y=_;_=p,p=y}h.push(d,_,p)}return h}for(let d=1;d<e-1;d++)h.push(0,d,d+1);return h}function Mx(i,t,e,n){let s=i[t*3],r=i[t*3+1],o=i[t*3+2],a=i[e*3]-s,l=i[e*3+1]-r,c=i[e*3+2]-o,u=i[n*3]-s,h=i[n*3+1]-r,d=i[n*3+2]-o;return[l*d-c*h,c*u-a*d,a*h-l*u]}function Cu(i,t,e){let n=t.length,s=new Int32Array(n),r=0;for(let h=0;h<i.length;h++){let d=i[h];for(let f=0;f<d;f++)s[r+f]=t[r+(f+1)%d];r+=d}let o=new Uint32Array(e+1);for(let h=0;h<n;h++)o[t[h]+1]++;for(let h=0;h<e;h++)o[h+1]+=o[h];let a=o.slice(0,e),l=new Uint32Array(n);for(let h=0;h<n;h++)l[a[t[h]]++]=h;let c=new Uint32Array(n*3),u=0;for(let h=0;h<n;h++){let d=t[h],f=s[h],g=!0;for(let _=o[d];_<o[d+1]&&g;_++){let p=l[_];if(p>=h)break;s[p]===f&&(g=!1)}for(let _=o[f];_<o[f+1]&&g;_++){let p=l[_];if(p>=h)break;s[p]===d&&(g=!1)}g&&(c[u++]=d,c[u++]=f,c[u++]=f)}return{index:c.slice(0,u),edgeCount:u/3}}var tr=8,bx=.001;function Ru(i,t,e={}){let n=e.normalize!==!1,s=i.counts,r=new Uint32Array(t+1);for(let A=0;A<t;A++)r[A+1]=r[A]+(s[A]||0);let o=Uint16Array.from(i.indices),a=Float32Array.from(i.weights),l=new Float32Array(a.length),c=i.influences.length,u=new Uint16Array(t*4),h=new Float32Array(t*4),d=new Uint16Array(t*4),f=new Float32Array(t*4),g=new Uint32Array(c),_=[],p=0,m=0,y=0,x=0,M=[];for(let A=0;A<t;A++){let b=r[A],S=r[A+1],P=S-b;P>x&&(x=P);let v=0;for(let U=b;U<S;U++)v+=a[U];if(v<=0){_.push(A);continue}for(let U=b;U<S;U++)a[U]>0&&g[o[U]]++;Math.abs(v-1)>bx&&y++,P>4&&p++,P>tr&&m++;let w=n?1/v:1;for(let U=b;U<S;U++)l[U]=a[U]*w;M.length=0;for(let U=b;U<S;U++)M.push(U);P>tr&&M.sort((U,N)=>l[N]-l[U]);let O=Math.min(P,tr),G=0;for(let U=0;U<O;U++)G+=l[M[U]];let et=n?1:v,I=P>tr&&G>0?et/G:1;for(let U=0;U<O;U++){let N=o[M[U]],W=l[M[U]]*I;U<4?(u[A*4+U]=N,h[A*4+U]=W):(d[A*4+U-4]=N,f[A*4+U-4]=W)}}return{offsets:r,slots:o,values:a,eff:l,normalize:n,skinIndex:u,skinWeight:h,skinIndex1:d,skinWeight1:f,zeroVertices:_,override:new Map,stats:{influenceCount:c,over4:p,overMax:m,unnormalized:y,zero:_.length,maxCount:x,affected:g}}}function Pu(i,t,e){let n=e.filter(r=>r.w>0).sort((r,o)=>o.w-r.w).slice(0,tr),s=n.reduce((r,o)=>r+o.w,0)||1;i.override.set(t,n.map(r=>({slot:r.slot,w:r.w/s})));for(let r=0;r<4;r++)i.skinIndex[t*4+r]=0,i.skinWeight[t*4+r]=0,i.skinIndex1[t*4+r]=0,i.skinWeight1[t*4+r]=0;n.forEach((r,o)=>{o<4?(i.skinIndex[t*4+o]=r.slot,i.skinWeight[t*4+o]=r.w/s):(i.skinIndex1[t*4+o-4]=r.slot,i.skinWeight1[t*4+o-4]=r.w/s),i.stats.affected[r.slot]++})}function Lu(i,t){let e=[];for(let n=i.offsets[t];n<i.offsets[t+1];n++)e.push(i.slots[n]);return e}function Iu(i,t){let e=[],n=i.override.get(t);if(n){let s=new Map;for(let r=i.offsets[t];r<i.offsets[t+1];r++)s.set(i.slots[r],i.values[r]);for(let r of n)e.push({slot:r.slot,weight:s.get(r.slot)||0,effective:r.w,assigned:!0});for(let[r,o]of s)n.some(a=>a.slot===r)||e.push({slot:r,weight:o,effective:0,assigned:!0})}else for(let s=i.offsets[t];s<i.offsets[t+1];s++)e.push({slot:i.slots[s],weight:i.values[s],effective:i.eff[s]});return e.sort((s,r)=>r.effective-s.effective),e}function Ll(i,t,e){let n=i.override.get(t);if(n){let s=n.find(r=>r.slot===e);return s?s.w:0}for(let s=i.offsets[t];s<i.offsets[t+1];s++)if(i.slots[s]===e)return i.eff[s];return 0}var Ro=new Lt;function Sx(i,t){if(!(i>1e-6))return t.setRGB(.11,.12,.16);let e=Math.min(1,Math.max(0,i));return t.setHSL((1-e)*.6667,.95,.5)}function wx(i,t){let e=i*.6180339887%1;return t.setHSL(e,.7,.55)}function Uu(i,t,e,n){for(let s=0;s<n;s++)Sx(e>=0?Ll(t,s,e):0,Ro),i[s*3]=Ro.r,i[s*3+1]=Ro.g,i[s*3+2]=Ro.b}function Du(i,t,e,n){let s=e.map(r=>wx(r,new Lt));for(let r=0;r<n;r++){let o=0,a=0,l=0,c=0,u=(d,f)=>{let g=s[d];o+=g.r*f,a+=g.g*f,l+=g.b*f,c+=f},h=t.override.get(r);if(h)for(let d of h)u(d.slot,d.w);else for(let d=t.offsets[r];d<t.offsets[r+1];d++)u(t.slots[d],t.eff[d]);c<=0?(o=.11,a=.12,l=.16):(o/=c,a/=c,l/=c),i[r*3]=o,i[r*3+1]=a,i[r*3+2]=l}}function Nu(i,t,e,n){for(let s=0;s<i.length;s+=3)i[s]=t,i[s+1]=e,i[s+2]=n}function Ex(i,t,e){let n=new Float32Array(t.length*3),s=0;for(let r=0;r<t.length;r++){let o=t[r],a=0,l=0,c=0;for(let u=0;u<o;u++){let h=e[s+u]*3,d=e[s+(u+1)%o]*3;a+=(i[h+1]-i[d+1])*(i[h+2]+i[d+2]),l+=(i[h+2]-i[d+2])*(i[h]+i[d]),c+=(i[h]-i[d])*(i[h+1]+i[d+1])}n[r*3]=a,n[r*3+1]=l,n[r*3+2]=c,s+=o}return n}function Ou(i,t,e,n,s){let r=e.length,o=t.length,a=Ex(i,t,e),l=new Uint32Array(r),c=new Int32Array(r),u=new Int32Array(r),h=0;for(let b=0;b<o;b++){let S=t[b];for(let P=0;P<S;P++){let v=h+P;l[v]=b,c[v]=e[h+(P+S-1)%S],u[v]=e[h+(P+1)%S]}h+=S}let d=new Uint32Array(s+1);for(let b=0;b<r;b++)d[e[b]+1]++;for(let b=0;b<s;b++)d[b+1]+=d[b];let f=d.slice(0,s),g=new Uint32Array(r);for(let b=0;b<r;b++)g[f[e[b]]++]=b;let _=new Set;for(let b=0;b+1<(n?n.length:0);b+=2){let S=n[b],P=n[b+1];_.add(S<P?S*s+P:P*s+S)}let p=(b,S)=>!_.size||!_.has(b<S?b*s+S:S*s+b),m=new Int32Array(r);for(let b=0;b<r;b++)m[b]=b;let y=b=>{for(;m[b]!==b;)m[b]=m[m[b]],b=m[b];return b};for(let b=0;b<s;b++){let S=d[b],P=d[b+1];for(let v=S;v<P;v++){let w=g[v];for(let O=v+1;O<P;O++){let G=g[O],et=-1;if(c[w]===c[G]||c[w]===u[G]?et=c[w]:(u[w]===c[G]||u[w]===u[G])&&(et=u[w]),et<0||et===b||!p(b,et))continue;let I=y(w),U=y(G);I!==U&&(m[U]=I)}}}let x=new Float64Array(r*3);for(let b=0;b<r;b++){let S=y(b)*3,P=l[b]*3;x[S]+=a[P],x[S+1]+=a[P+1],x[S+2]+=a[P+2]}let M=new Int32Array(r),A=new Float32Array(r*3);for(let b=0;b<r;b++){let S=y(b);M[b]=S;let P=x[S*3],v=x[S*3+1],w=x[S*3+2],O=Math.sqrt(P*P+v*v+w*w)||1;A[b*3]=P/O,A[b*3+1]=v/O,A[b*3+2]=w/O}return{group:M,normals:A}}var Ax="maya-viewer-skin8",Tx=`
#include <skinning_pars_vertex>
#ifdef USE_SKINNING
	attribute vec4 skinIndex1;
	attribute vec4 skinWeight1;
#endif
`,Cx=`
#include <skinbase_vertex>
#ifdef USE_SKINNING
	mat4 boneMat1X = getBoneMatrix( skinIndex1.x );
	mat4 boneMat1Y = getBoneMatrix( skinIndex1.y );
	mat4 boneMat1Z = getBoneMatrix( skinIndex1.z );
	mat4 boneMat1W = getBoneMatrix( skinIndex1.w );
#endif
`,Rx=`
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
`,Px=`
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
`;function Lx(i){let t=(n,s,r)=>{if(!n.includes(s))throw new Error("\u30B7\u30A7\u30FC\u30C0\u30FC\u306B "+s+" \u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\uFF08three.js \u306E\u30D0\u30FC\u30B8\u30E7\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF09");return n.replace(s,r)},e=i;return e=t(e,"#include <skinning_pars_vertex>",Tx),e=t(e,"#include <skinbase_vertex>",Cx),e.includes("#include <skinnormal_vertex>")&&(e=e.replace("#include <skinnormal_vertex>",Rx)),e=t(e,"#include <skinning_vertex>",Px),e}function us(i){return i.onBeforeCompile=t=>{t.vertexShader=Lx(t.vertexShader)},i.customProgramCacheKey=()=>Ax,i.needsUpdate=!0,i}var Fu=new C,Ix=new C,ku=new le,zu=new le,Bu=new ct,Ux=[["skinIndex","skinWeight"],["skinIndex1","skinWeight1"]];function Dx(i,t,e){let n=i.skeleton,s=i.geometry.attributes;Fu.copy(e).applyMatrix4(i.bindMatrix),e.set(0,0,0);for(let[r,o]of Ux){let a=s[r],l=s[o];if(!(!a||!l)){ku.fromBufferAttribute(a,t),zu.fromBufferAttribute(l,t);for(let c=0;c<4;c++){let u=zu.getComponent(c);if(u!==0){let h=ku.getComponent(c);Bu.multiplyMatrices(n.bones[h].matrixWorld,n.boneInverses[h]),e.addScaledVector(Ix.copy(Fu).applyMatrix4(Bu),u)}}}}return e.applyMatrix4(i.bindMatrixInverse)}function Il(i){return i.applyBoneTransform=function(e,n){return Dx(this,e,n)},i}var Nx="maya-scene-lite";function Dl(i){if(!i||i.schema!==Nx)throw new Error("\u5BFE\u5FDC\u3057\u3066\u3044\u306A\u3044\u30C7\u30FC\u30BF\u5F62\u5F0F\u3067\u3059\uFF08schema \u304C maya-scene-lite \u3067\u306F\u3042\u308A\u307E\u305B\u3093\uFF09");if(!Array.isArray(i.nodes)||!Array.isArray(i.meshes))throw new Error("nodes / meshes \u304C\u3042\u308A\u307E\u305B\u3093")}function Hu(i,t={}){Dl(i);let e=new cn;e.name="__mayaRoot",e.matrixAutoUpdate=!1;let n=i.nodes.map((f,g)=>{let _=f.type==="joint"?new zs:new cn;return _.name=f.name,_.matrixAutoUpdate=!1,_.matrix.fromArray(f.matrix),_.userData={nodeIndex:g,path:f.path,type:f.type,baseMatrix:_.matrix.clone(),fileMatrix:_.matrix.clone(),savedMatrix:_.matrix.clone(),bindMatrix:f.bindMatrix?new ct().fromArray(f.bindMatrix):null},_}),s=i.nodes.map(()=>[]);i.nodes.forEach((f,g)=>{let _=f.parent;_>=0&&s[_].push(g),(_>=0&&f.inheritsTransform!==!1?n[_]:e).add(n[g])}),e.updateMatrixWorld(!0);let r=[];i.nodes.forEach((f,g)=>{f.type==="joint"&&r.push(g)});let o=(i.materials||[]).map((f,g)=>Ul(f,g,0,i.textures)),a=Ul(null,-1,0,i.textures),l=[a,...o],c=new Map,u=(f,g)=>{if(!(f>=0&&f<o.length))return a;let _=o[f];if(!g||!_.userData.udim)return _;let p=f+":"+g;if(!c.has(p)){let m=Ul(i.materials[f],f,g,i.textures);c.set(p,m),l.push(m)}return c.get(p)},h=new Map,d=i.meshes.map((f,g)=>{let _=Vx(f,g,n,o,u,t);return _.skin&&f.skin.influences.forEach((p,m)=>{h.has(p)||h.set(p,[]),h.get(p).push({mesh:g,slot:m})}),_});return e.updateMatrixWorld(!0),{root:e,nodeObjects:n,meshes:d,jointIndices:r,childrenOf:s,influenceUsage:h,materials:o,defaultMaterial:a,allMaterials:l}}var nr=13223616;function Ox(i,t="always"){return t==="always"?!0:t==="none"?!1:i.normalize===2}function Fx(i,t,e){let n=i.zeroVertices;if(!n.length)return 0;let s=t.skin,r=new ct().fromArray(s.geomMatrix),o=new ct,a=s.bindPreMatrices.map(h=>new C().setFromMatrixPosition(o.fromArray(h).invert())),l=new C,c=new Set(n),u=null;if(s.weightDistribution===1){u=new Map;let h=(f,g)=>{u.has(f)||u.set(f,new Set),u.get(f).add(g)},d=0;for(let f of t.counts){for(let g=0;g<f;g++){let _=t.indices[d+g],p=t.indices[d+(g+1)%f];c.has(_)&&h(_,p),c.has(p)&&h(p,_)}d+=f}}for(let h of n){let d=Lu(i,h),f=null;if(u&&u.has(h)){let g=new Map;for(let _ of u.get(h))if(!c.has(_))for(let p=0;p<a.length;p++){let m=Ll(i,_,p);m>0&&(!d.length||d.includes(p))&&g.set(p,(g.get(p)||0)+m)}g.size&&(f=[...g].map(([_,p])=>({slot:_,w:p})))}if(!f){l.fromArray(e,h*3).applyMatrix4(r);let g=_=>Math.max(l.distanceTo(a[_]),1e-6);if(d.length)f=d.map(_=>({slot:_,w:1/g(_)}));else{let _=0;for(let p=1;p<a.length;p++)g(p)<g(_)&&(_=p);f=[{slot:_,w:1}]}}Pu(i,h,f)}return n.length}function Nl(i,t,e=!0){return t!=="bind"||!e?i.fileMatrix:i.bindMatrix||i.savedMatrix||i.fileMatrix}function Ol(i,t){let e=ds(i);for(let n of i.nodeObjects){let s=n.userData;s.baseMatrix.copy(Nl(s,t,e)),n.matrix.copy(s.baseMatrix)}i.root.updateMatrixWorld(!0)}function ds(i){return i.hasBind===void 0&&(i.hasBind=i.nodeObjects.some(t=>t.userData.bindMatrix)),i.hasBind}function kx(i,t){return t?`${i}:${t}`:String(i)}function Ul(i,t,e,n){let s={side:Oe,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1},r=new co({color:nr,roughness:.78,metalness:0,...s}),o=new Pe({color:nr,...s});us(r),us(o),r.name=i?i.name+(e?` <${e}>`:""):"(\u65E2\u5B9A)",o.name=r.name;let a=new Lt(nr);i&&Array.isArray(i.color)&&a.setRGB(i.color[0],i.color[1],i.color[2]);let l={},c=!1,u=i&&i.maps||(i&&i.texture>=0?{baseColor:{texture:i.texture,channel:"rgb"}}:{});for(let[h,d]of Object.entries(u)){let f=(n||[])[d.texture];f&&(f.udim&&(c=!0),l[h]={texture:d.texture,channel:d.channel||"rgb",key:kx(d.texture,f.udim?e:0)})}return r.userData={index:t,tile:e,udim:c,isMaya:!!i,baseColor:a,maps:l,textureIndex:l.baseColor?l.baseColor.texture:-1,useAlpha:!!(i&&i.useAlpha),roughness:i&&typeof i.roughness=="number"?i.roughness:null,metalness:i&&typeof i.metalness=="number"?i.metalness:null,textures:{},hasAlpha:!1,unlit:o,sig:""},r}function zx(i,t,e=null){let n=i.indices.length,s=i.uv;if((!s||!s.values||!s.values.length)&&!e){let _=new Uint32Array(t);for(let p=0;p<t;p++)_[p]=p;return{renderCount:t,origOf:_,firstRender:Int32Array.from(_),cornerRender:Uint32Array.from(i.indices),uvs:null}}let r=s&&s.values?s.values.length/2:0,o=e?n:t,a=new Int32Array(o).fill(-2),l=new Int32Array(o),c=new Map,u=new Uint32Array(n+t),h=r?new Float32Array((n+t)*2):null,d=0,f=new Uint32Array(n);for(let _=0;_<n;_++){let p=i.indices[_],m=r?s.indices[_]:-1,y=e?e[_]:p,x;if(a[y]===-2)a[y]=m,x=l[y]=d++;else if(a[y]===m)x=l[y];else{let M=y*(r+1)+(m+1);if(x=c.get(M),x===void 0)x=d++,c.set(M,x);else{f[_]=x;continue}}x===d-1&&(u[x]=p,h&&(h[x*2]=m>=0?s.values[m*2]:0,h[x*2+1]=m>=0?s.values[m*2+1]:0)),f[_]=x}let g=new Int32Array(t).fill(-1);for(let _=0;_<d;_++)g[u[_]]<0&&(g[u[_]]=_);for(let _=0;_<t;_++)g[_]<0&&(g[_]=d,u[d++]=_);return{renderCount:d,origOf:u.slice(0,d),firstRender:g,cornerRender:f,uvs:h?h.slice(0,d*2):null}}function er(i,t,e,n=i.constructor){let s=new n(e.length*t);for(let r=0;r<e.length;r++){let o=e[r]*t,a=r*t;for(let l=0;l<t;l++)s[a+l]=i[o+l]}return s}function Bx(i){let t=new Uint16Array(i.counts.length).fill(1001),e=i.uv;if(!e)return t;let n=0;for(let s=0;s<i.counts.length;s++){let r=0,o=0,a=0;for(let l=0;l<i.counts[s];l++){let c=e.indices[n+l];c>=0&&(r+=e.values[c*2],o+=e.values[c*2+1],a++)}if(a){let l=Math.min(9,Math.max(0,Math.floor(r/a))),c=Math.max(0,Math.floor(o/a));t[s]=1001+l+10*c}n+=i.counts[s]}return t}function Vx(i,t,e,n,s,r){let o=Float32Array.from(i.positions),a=o.length/3,l=Tu(o,i.counts,i.indices),c=Cu(i.counts,i.indices,a),u=Ou(o,i.counts,i.indices,i.hardEdges,a),h=zx(i,a,u.group),{origOf:d,firstRender:f,cornerRender:g}=h,_=new Float32Array(h.renderCount*3);for(let k=0;k<g.length;k++)_.set(u.normals.subarray(k*3,k*3+3),g[k]*3);let p=i.faceMaterials||null,m=Number.isInteger(i.material)?i.material:-1,x=(p||[m]).some(k=>n[k]&&n[k].userData.udim)?Bx(i):null,M=new Map,A=[],b=k=>{let tt=s(p?p[k]:m,x?x[k]:0);return M.has(tt)||(M.set(tt,A.length),A.push(tt)),M.get(tt)},S=new Uint16Array(l.triCount);for(let k=0;k<l.triCount;k++)S[k]=b(l.triToFace[k]);A.length||A.push(s(m,0));let P=new Uint32Array(A.length);for(let k=0;k<l.triCount;k++)P[S[k]]++;let v=new Uint32Array(A.length);for(let k=1;k<A.length;k++)v[k]=v[k-1]+P[k-1];let w=v.slice(),O=new Uint32Array(l.triCount*3);for(let k=0;k<l.triCount;k++){let tt=w[S[k]]++*3;O[tt]=g[l.corners[k*3]],O[tt+1]=g[l.corners[k*3+1]],O[tt+2]=g[l.corners[k*3+2]]}let G=new _e(er(o,3,d),3),et=new $t(new Float32Array(h.renderCount*3).fill(1),3),I=new ee;if(I.setAttribute("position",G),I.setAttribute("normal",new _e(_,3)),I.setAttribute("color",et),h.uvs&&I.setAttribute("uv",new _e(h.uvs,2)),I.setIndex(new _e(O,1)),A.length>1)for(let k=0;k<A.length;k++)I.addGroup(v[k]*3,P[k]*3,k);let U=A.length>1?A:A[0],N=new Uint32Array(c.index.length);for(let k=0;k<c.index.length;k++)N[k]=f[c.index[k]];let W=new ee;W.setAttribute("position",G),W.setAttribute("color",et),W.setIndex(new _e(N,1));let H=r.wireMaterial||new Pe({color:1908772,wireframe:!0,transparent:!0,opacity:.55,depthWrite:!1});us(H);let z=e[i.transform],J=null,j=null,Q=null,F=null,V=new mt(I,U),K=new mt(W,H);if(i.skin){Q=Ru(i.skin,a,{normalize:Ox(i.skin,r.normalizeMode)}),Q.normalize&&Fx(Q,i,o);let k={skinIndex:new fi(er(Q.skinIndex,4,d),4),skinWeight:new $t(er(Q.skinWeight,4,d),4),skinIndex1:new fi(er(Q.skinIndex1,4,d),4),skinWeight1:new $t(er(Q.skinWeight1,4,d),4)};for(let[Mt,Vt]of Object.entries(k))I.setAttribute(Mt,Vt),W.setAttribute(Mt,Vt);let tt=i.skin.influences.map(Mt=>e[Mt]),gt=i.skin.bindPreMatrices.map(Mt=>new ct().fromArray(Mt));F=new ro(tt,gt);let bt=new ct().fromArray(i.skin.geomMatrix);J=Il(new ks(I,U)),J.bindMode=go,J.bind(F,bt),j=Il(new ks(W,H)),j.bindMode=go,j.bind(F,bt)}for(let k of[V,K,J,j])k&&(k.matrixAutoUpdate=!1,k.frustumCulled=!1,k.userData.meshIndex=t,z.add(k));return K.renderOrder=1,j&&(j.renderOrder=1),{index:t,name:i.name,path:i.path,transform:i.transform,data:i,vertexCount:a,renderVertexCount:h.renderCount,origOf:d,firstRender:f,triCount:l.triCount,edgeCount:c.edgeCount,geometry:I,wireGeometry:W,wireMaterial:H,materials:A,staticMesh:V,staticWire:K,skinned:J,skinnedWire:j,skeleton:F,skin:Q,visible:i.visible!==!1}}var Vu=new C;function ir(i,t,e,n){return n.fromBufferAttribute(i.geometry.attributes.position,t),e&&i.skinned?(i.skinned.applyBoneTransform(t,n),n.applyMatrix4(i.skinned.matrixWorld)):n.applyMatrix4(i.staticMesh.matrixWorld)}function fs(i,t,e,n){return ir(i,i.firstRender[t],e,n)}function Gu(i,t){return i.origOf[t]}function Wu(i,t){let e=i.geometry.attributes.color,n=e.array,s=i.origOf;for(let r=0;r<s.length;r++){let o=s[r]*3;n[r*3]=t[o],n[r*3+1]=t[o+1],n[r*3+2]=t[o+2]}e.needsUpdate=!0}function Fl(i,t,e=!1){let n=new We;for(let s of i.meshes){if(!e&&!s.visible)continue;let r=Math.max(1,Math.floor(s.vertexCount/2e4));for(let o=0;o<s.vertexCount;o+=r)n.expandByPoint(fs(s,o,t,Vu))}for(let s of i.jointIndices)n.expandByPoint(Vu.setFromMatrixPosition(i.nodeObjects[s].matrixWorld));return n.isEmpty()&&n.set(new C(-50,-50,-50),new C(50,50,50)),n}function Xu(i){if(!i)return;let t=new Set,e=n=>{n&&!t.has(n)&&(t.add(n),n.dispose())};for(let n of i.allMaterials||[])n.userData.unlit&&e(n.userData.unlit),e(n);for(let n of i.meshes)e(n.geometry),e(n.wireGeometry),e(n.wireMaterial),n.skeleton&&n.skeleton.dispose();i.root.removeFromParent()}var Po=class extends ho{constructor(t){super(t)}parse(t){function e(N){switch(N.image_type){case d:case _:if(N.colormap_length>256||N.colormap_size!==24||N.colormap_type!==1)throw new Error("THREE.TGALoader: Invalid type colormap data for indexed type.");break;case f:case g:case p:case m:if(N.colormap_type)throw new Error("THREE.TGALoader: Invalid type colormap data for colormap type.");break;case h:throw new Error("THREE.TGALoader: No data.");default:throw new Error("THREE.TGALoader: Invalid type "+N.image_type)}if(N.width<=0||N.height<=0)throw new Error("THREE.TGALoader: Invalid image size.");if(N.pixel_size!==8&&N.pixel_size!==16&&N.pixel_size!==24&&N.pixel_size!==32)throw new Error("THREE.TGALoader: Invalid pixel size "+N.pixel_size)}function n(N,W,H,z,J){let j,Q,F=H.pixel_size>>3,V=H.width*H.height*F;if(W&&(Q=J.subarray(z,z+=H.colormap_length*(H.colormap_size>>3))),N){j=new Uint8Array(V);let K,k,tt,gt=0,bt=new Uint8Array(F);for(;gt<V;)if(K=J[z++],k=(K&127)+1,K&128){for(tt=0;tt<F;++tt)bt[tt]=J[z++];for(tt=0;tt<k;++tt)j.set(bt,gt+tt*F);gt+=F*k}else{for(k*=F,tt=0;tt<k;++tt)j[gt+tt]=J[z++];gt+=k}}else j=J.subarray(z,z+=W?H.width*H.height:V);return{pixel_data:j,palettes:Q}}function s(N,W,H,z,J,j,Q,F,V){let K=V,k,tt=0,gt,bt,Mt=w.width;for(bt=W;bt!==z;bt+=H)for(gt=J;gt!==Q;gt+=j,tt++)k=F[tt],N[(gt+Mt*bt)*4+3]=255,N[(gt+Mt*bt)*4+2]=K[k*3+0],N[(gt+Mt*bt)*4+1]=K[k*3+1],N[(gt+Mt*bt)*4+0]=K[k*3+2];return N}function r(N,W,H,z,J,j,Q,F){let V,K=0,k,tt,gt=w.width;for(tt=W;tt!==z;tt+=H)for(k=J;k!==Q;k+=j,K+=2)V=F[K+0]+(F[K+1]<<8),N[(k+gt*tt)*4+0]=(V&31744)>>7,N[(k+gt*tt)*4+1]=(V&992)>>2,N[(k+gt*tt)*4+2]=(V&31)<<3,N[(k+gt*tt)*4+3]=V&32768?0:255;return N}function o(N,W,H,z,J,j,Q,F){let V=0,K,k,tt=w.width;for(k=W;k!==z;k+=H)for(K=J;K!==Q;K+=j,V+=3)N[(K+tt*k)*4+3]=255,N[(K+tt*k)*4+2]=F[V+0],N[(K+tt*k)*4+1]=F[V+1],N[(K+tt*k)*4+0]=F[V+2];return N}function a(N,W,H,z,J,j,Q,F){let V=0,K,k,tt=w.width;for(k=W;k!==z;k+=H)for(K=J;K!==Q;K+=j,V+=4)N[(K+tt*k)*4+2]=F[V+0],N[(K+tt*k)*4+1]=F[V+1],N[(K+tt*k)*4+0]=F[V+2],N[(K+tt*k)*4+3]=F[V+3];return N}function l(N,W,H,z,J,j,Q,F){let V,K=0,k,tt,gt=w.width;for(tt=W;tt!==z;tt+=H)for(k=J;k!==Q;k+=j,K++)V=F[K],N[(k+gt*tt)*4+0]=V,N[(k+gt*tt)*4+1]=V,N[(k+gt*tt)*4+2]=V,N[(k+gt*tt)*4+3]=255;return N}function c(N,W,H,z,J,j,Q,F){let V=0,K,k,tt=w.width;for(k=W;k!==z;k+=H)for(K=J;K!==Q;K+=j,V+=2)N[(K+tt*k)*4+0]=F[V+0],N[(K+tt*k)*4+1]=F[V+0],N[(K+tt*k)*4+2]=F[V+0],N[(K+tt*k)*4+3]=F[V+1];return N}function u(N,W,H,z,J){let j,Q,F,V,K,k;switch((w.flags&y)>>x){default:case b:j=0,F=1,K=W,Q=0,V=1,k=H;break;case M:j=0,F=1,K=W,Q=H-1,V=-1,k=-1;break;case S:j=W-1,F=-1,K=-1,Q=0,V=1,k=H;break;case A:j=W-1,F=-1,K=-1,Q=H-1,V=-1,k=-1;break}if(et)switch(w.pixel_size){case 8:l(N,Q,V,k,j,F,K,z);break;case 16:c(N,Q,V,k,j,F,K,z);break;default:throw new Error("THREE.TGALoader: Format not supported.")}else switch(w.pixel_size){case 8:s(N,Q,V,k,j,F,K,z,J);break;case 16:r(N,Q,V,k,j,F,K,z);break;case 24:o(N,Q,V,k,j,F,K,z);break;case 32:a(N,Q,V,k,j,F,K,z);break;default:throw new Error("THREE.TGALoader: Format not supported.")}return N}let h=0,d=1,f=2,g=3,_=9,p=10,m=11,y=48,x=4,M=0,A=1,b=2,S=3;if(t.length<19)throw new Error("THREE.TGALoader: Not enough data to contain header.");let P=0,v=new Uint8Array(t),w={id_length:v[P++],colormap_type:v[P++],image_type:v[P++],colormap_index:v[P++]|v[P++]<<8,colormap_length:v[P++]|v[P++]<<8,colormap_size:v[P++],origin:[v[P++]|v[P++]<<8,v[P++]|v[P++]<<8],width:v[P++]|v[P++]<<8,height:v[P++]|v[P++]<<8,pixel_size:v[P++],flags:v[P++]};if(e(w),w.id_length+P>t.length)throw new Error("THREE.TGALoader: No data.");P+=w.id_length;let O=!1,G=!1,et=!1;switch(w.image_type){case _:O=!0,G=!0;break;case d:G=!0;break;case p:O=!0;break;case f:break;case m:O=!0,et=!0;break;case g:et=!0;break}let I=new Uint8Array(w.width*w.height*4),U=n(O,G,w,P,v);return u(I,w.width,w.height,U.pixel_data,U.palettes),{data:I,width:w.width,height:w.height,flipY:!0,generateMipmaps:!0,minFilter:gn}}};var qu=2048;function Hx(i){return new Promise((t,e)=>{let n=new XMLHttpRequest;n.open("GET",i,!0),n.responseType="arraybuffer",n.onload=()=>{(n.status===200||n.status===0)&&n.response&&n.response.byteLength?t(n.response):e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08status "+n.status+"\uFF09"))},n.onerror=()=>e(new Error("\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\uFF08\u30A2\u30AF\u30BB\u30B9\u304C\u8A31\u53EF\u3055\u308C\u3066\u3044\u306A\u3044\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\uFF09")),n.send()})}function ju(i){let t=atob(i),e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e.buffer}function Ju(i,t){let e=document.createElement("canvas");return e.width=i,e.height=t,e}function Yu(i){for(let t=3;t<i.length;t+=4)if(i[t]<250)return!0;return!1}function Gx(i,t,e,n,s){let r=new Uint8Array(n*s*4),o=t/n,a=e/s;for(let l=0;l<s;l++){let c=Math.floor(l*a),u=Math.max(c+1,Math.floor((l+1)*a));for(let h=0;h<n;h++){let d=Math.floor(h*o),f=Math.max(d+1,Math.floor((h+1)*o)),g=0,_=0,p=0,m=0;for(let M=c;M<u;M++){let A=(M*t+d)*4;for(let b=d;b<f;b++,A+=4)g+=i[A],_+=i[A+1],p+=i[A+2],m+=i[A+3]}let y=(u-c)*(f-d),x=(l*n+h)*4;r[x]=g/y,r[x+1]=_/y,r[x+2]=p/y,r[x+3]=m/y}}return r}function $u(i,t){let e=Math.max(i,t);if(e<=qu)return[i,t];let n=qu/e;return[Math.max(1,Math.round(i*n)),Math.max(1,Math.round(t*n))]}async function Wx(i,t){if(t==="tga"){let f=new Po().parse(i);if(!f||!f.data||!f.width)throw new Error("TGA \u3092\u89E3\u6790\u3067\u304D\u307E\u305B\u3093");let g=new Uint8Array(f.data.buffer,f.data.byteOffset,f.width*f.height*4),[_,p]=$u(f.width,f.height);return _!==f.width&&(g=Gx(g,f.width,f.height,_,p)),{kind:"data",image:{data:g,width:_,height:p},width:_,height:p,sourceWidth:f.width,sourceHeight:f.height,hasAlpha:Yu(g)}}let e=new Blob([i]),n=await createImageBitmap(e),s=n.width,r=n.height;n.close&&n.close();let[o,a]=$u(s,r),l={premultiplyAlpha:"none",colorSpaceConversion:"none",imageOrientation:"flipY"};o!==s&&Object.assign(l,{resizeWidth:o,resizeHeight:a,resizeQuality:"high"});let c=await createImageBitmap(e,l),u=Ju(c.width,c.height),h=u.getContext("2d",{willReadFrequently:!0});h.drawImage(c,0,0);let d=Yu(h.getImageData(0,0,u.width,u.height).data);return{kind:"bitmap",image:c,width:c.width,height:c.height,sourceWidth:s,sourceHeight:r,hasAlpha:d}}function Xx(i){if(i.kind==="data")return i.image.data;if(!i.pixels){let e=Ju(i.width,i.height).getContext("2d",{willReadFrequently:!0});e.translate(0,i.height),e.scale(1,-1),e.drawImage(i.image,0,0),i.pixels=e.getImageData(0,0,i.width,i.height).data}return i.pixels}function qx(i,t){let e={r:0,g:1,b:2,a:3}[t]??0,n=new Uint8Array(i.length);for(let s=0;s<i.length;s+=4){let r=i[s+e];n[s]=r,n[s+1]=r,n[s+2]=r,n[s+3]=255}return n}function Zu(i,t,e){let n=new ns(i,t,e,Xe);return n.flipY=!0,n.magFilter=Re,n.minFilter=gn,n.generateMipmaps=!0,n}function Ku(i,t){let[e,n]=t.split(":"),s;if(n&&n!=="rgb")s=Zu(qx(Xx(i),n),i.width,i.height);else if(i.kind==="data"){let{data:r,width:o,height:a}=i.image;s=Zu(r,o,a)}else s=new $e(i.image),s.flipY=!1;return s.premultiplyAlpha=!1,s.colorSpace=e==="color"||e==="view"?me:qe,s.wrapS=Qi,s.wrapT=Qi,s.anisotropy=4,s.needsUpdate=!0,s}async function Qu(i,t,e,n,s={}){let r=null,o="file",a=null;if(i&&!s.forceBridge)try{r=await Hx(i)}catch(l){a=l}if(!r&&n&&t&&(r=await n(t),o="python"),!r)throw a||new Error("\u8AAD\u307F\u8FBC\u3080\u65B9\u6CD5\u304C\u3042\u308A\u307E\u305B\u3093");return{decoded:await Wx(r,e),via:o}}function td(i,t,e){let n=!t||t==="rgb"?i==="baseColor"||i==="emissive"||i==="normal"?"rgb":"r":t;return e?n==="rgb"?"view:rgb":"view:"+n:i==="baseColor"||i==="emissive"?n==="rgb"?"color":"scalar:"+n:i==="normal"?"normal":"scalar:"+n}function Yx(i){if(!i.textures)return[];if(i.mapView&&i.mapView!=="combined")return[i.mapView];let t=["baseColor"];for(let e of["normal","roughness","metalness","ao","emissive","opacity"])i.maps&&i.maps[e]&&t.push(e);return t}var Lo=class{constructor(){this.state=new Map,this.token=0,this.data=null}reset(t){for(let e of this.state.values())for(let n of e.textures.values())n.dispose();this.state.clear(),this.token++,this.data=t}source(t){let[e,n]=String(t).split(":"),s=+e,r=n?+n:0,o=(this.data&&this.data.textures||[])[s];if(!o)return null;if(o.udim){let a=(o.tiles||[]).find(l=>l.tile===r);return{ti:s,tile:r,info:o,url:a?a.url:null,resolved:a?a.resolved:null,format:o.format}}return{ti:s,tile:r,info:o,url:o.url,resolved:o.resolved,format:o.format}}neededKeys(t,e){let n=Yx(e),s=new Set;for(let r of t)for(let o of n){let a=r.userData.maps[o];a&&s.add(a.key)}return s}ensure(t,e,n,s,r){let o=this.token,a=[];for(let c of t){if(this.state.has(c))continue;let u=this.source(c);if(!u||!u.resolved||!u.format){this.state.set(c,{status:"missing",...u,textures:new Map});continue}let h={status:"loading",...u,textures:new Map};this.state.set(c,h),a.push([c,h])}let l=0;for(let[c,u]of a)Qu(u.url,u.resolved,u.format,e,n).then(h=>{o===this.token&&(u.status="ok",u.decoded=h.decoded,u.via=h.via)}).catch(h=>{o===this.token&&(u.status="error",u.message=String(h&&h.message||h),r&&r(c,u))}).finally(()=>{o===this.token&&(l++,s&&s(l,a.length))});return a.length}texture(t,e){let n=this.state.get(t);if(!n||n.status!=="ok")return null;let s=n.textures.get(e);return s||(s=Ku(n.decoded,e),n.textures.set(e,s)),s}hasAlpha(t){let e=this.state.get(t);return!!(e&&e.status==="ok"&&e.decoded.hasAlpha)}textureStatus(t){let e=(this.data&&this.data.textures||[])[t];if(!e)return{status:"missing"};let n=e.udim?(e.tiles||[]).map(r=>`${t}:${r.tile}`):[String(t)];if(!n.length)return{status:"missing",info:e};let s=n.map(r=>this.state.get(r));if(s.some(r=>r&&r.status==="loading"))return{status:"loading",info:e};if(s.some(r=>r&&r.status==="error"))return{status:"error",info:e,message:s.find(r=>r&&r.status==="error").message};if(s.some(r=>r&&r.status==="missing"))return{status:"missing",info:e};if(s.every(r=>r&&r.status==="ok")){let r=s[0].decoded;return{status:"ok",info:e,via:s[0].via,tiles:n.length,width:r.width,height:r.height,sourceWidth:r.sourceWidth,sourceHeight:r.sourceHeight,hasAlpha:s.some(o=>o.decoded.hasAlpha)}}return{status:"pending",info:e}}};var ed=new Lt(6211813),kl=new Lt(15903035),$x=new Lt(12903275),zl=[new Lt(15034203),new Lt(8376683),new Lt(6000624)],Mi=new ct,Nn=new C,sr=new Ft,rr=new C,Io=new C,Bl=new C,On=new C,Zx=new C(0,1,0),jx=new Ft;function Jx(){let e=[0,0,0,1,.1,0,0,.1,1,-1,.1,0,0,.1,-1,0,1,0],n=[0,2,1,0,3,2,0,4,3,0,1,4,5,1,2,5,2,3,5,3,4,5,4,1],s=new ee;return s.setAttribute("position",new $t(e,3)),s.setIndex(n),s}var Uo=class{constructor(){this.group=new cn,this.group.name="__jointOverlay",this.size=1,this.xray=!0,this.axesMode="selected",this.selected=-1,this.hiddenNodes=null,this.joints=[],this.links=[],this.slotOf=new Map,this.sphereGeo=new ss(1,14,10),this.boneGeo=Jx(),this.sphereMat=new Pe({color:16777215,transparent:!0,opacity:.92}),this.boneMat=new Pe({color:16777215,wireframe:!0,transparent:!0,opacity:.9}),this.axesMat=new jn({vertexColors:!0,transparent:!0,opacity:1}),this.spheres=null,this.bones=null,this.axes=null,this.controls=[],this.controlGeo=new Dn(1,0),this.controlMat=new Pe({color:16777215,wireframe:!0,transparent:!0,opacity:.95}),this.controlMesh=null}clear(){for(let t of[this.spheres,this.bones,this.axes])t&&(this.group.remove(t),t.isLineSegments?t.geometry.dispose():t.dispose?.());this.spheres=this.bones=this.axes=null,this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controlMesh=null,this.controls=[],this.joints=[],this.links=[],this.slotOf=new Map,this.selected=-1}build(t,e,n){this.clear(),this.built=t,this.joints=t.jointIndices.slice(),this.joints.forEach((u,h)=>this.slotOf.set(u,h));for(let u of this.joints){let h=e[u].parent;for(;h>=0&&e[h].type!=="joint";)h=e[h].parent;h>=0&&this.links.push([h,u])}let s=this.links.map(([u,h])=>Io.setFromMatrixPosition(t.nodeObjects[u].matrixWorld).distanceTo(Bl.setFromMatrixPosition(t.nodeObjects[h].matrixWorld))).filter(u=>u>1e-9).sort((u,h)=>u-h),r=s.length?s[s.length>>1]:0;this.baseSize=r>0?Math.min(n*.015,r*.12):n*.012;let o=Math.max(1,this.joints.length);this.spheres=new is(this.sphereGeo,this.sphereMat,o),this.spheres.count=this.joints.length,this.spheres.instanceMatrix.setUsage($s),this.spheres.frustumCulled=!1;let a=Math.max(1,this.links.length);this.bones=new is(this.boneGeo,this.boneMat,a),this.bones.count=this.links.length,this.bones.instanceMatrix.setUsage($s),this.bones.frustumCulled=!1;let l=new ee;l.setAttribute("position",new $t(new Float32Array(o*18),3).setUsage($s));let c=new Float32Array(o*18);for(let u=0;u<o;u++)for(let h=0;h<3;h++)for(let d=0;d<2;d++){let f=(u*6+h*2+d)*3;c[f]=zl[h].r,c[f+1]=zl[h].g,c[f+2]=zl[h].b}l.setAttribute("color",new $t(c,3)),this.axes=new Bs(l,this.axesMat),this.axes.frustumCulled=!1,this.group.add(this.bones,this.spheres,this.axes),this.applyXray(),this.update()}applyXray(){for(let t of[this.sphereMat,this.boneMat,this.axesMat,this.controlMat])t.depthTest=!this.xray,t.depthWrite=!this.xray,t.needsUpdate=!0;for(let t of[this.spheres,this.bones,this.axes,this.controlMesh])t&&(t.renderOrder=this.xray?10:0)}setControllers(t){this.controlMesh&&(this.group.remove(this.controlMesh),this.controlMesh.dispose()),this.controls=t.slice(),this.controlMesh=null,this.controls.length&&(this.controlMesh=new is(this.controlGeo,this.controlMat,this.controls.length),this.controlMesh.instanceMatrix.setUsage($s),this.controlMesh.frustumCulled=!1,this.group.add(this.controlMesh)),this.applyXray(),this.update()}setXray(t){this.xray=t,this.applyXray()}setSize(t){this.size=t,this.update()}setAxesMode(t){this.axesMode=t,this.update()}setSelected(t){this.selected=t,this.update()}setVisible(t){this.group.visible=t}setHiddenNodes(t){this.hiddenNodes=t,this.update()}radius(){return this.baseSize*this.size}update(){if(!this.spheres)return;let t=this.built.nodeObjects,e=this.radius(),n=new Set;this.links.forEach(([d,f],g)=>{d===this.selected&&n.add(g)});let s=this.hiddenNodes,r=d=>!!(s&&s[d]);this.joints.forEach((d,f)=>{t[d].matrixWorld.decompose(Nn,sr,rr);let g=r(d)?0:e;Mi.compose(Nn,jx,rr.set(g,g,g)),this.spheres.setMatrixAt(f,Mi),this.spheres.setColorAt(f,d===this.selected?kl:ed)}),this.spheres.instanceMatrix.needsUpdate=!0,this.spheres.instanceColor&&(this.spheres.instanceColor.needsUpdate=!0),this.spheres.boundingSphere=null,this.links.forEach(([d,f],g)=>{Io.setFromMatrixPosition(t[d].matrixWorld),Bl.setFromMatrixPosition(t[f].matrixWorld),On.subVectors(Bl,Io);let _=On.length();if(_<1e-9||r(f))Mi.makeScale(0,0,0);else{sr.setFromUnitVectors(Zx,On.multiplyScalar(1/_));let p=Math.min(e*.75,_*.12);Mi.compose(Io,sr,rr.set(p,_,p))}this.bones.setMatrixAt(g,Mi),this.bones.setColorAt(g,n.has(g)?kl:ed)}),this.bones.instanceMatrix.needsUpdate=!0,this.bones.instanceColor&&(this.bones.instanceColor.needsUpdate=!0),this.bones.boundingSphere=null;let o=this.axes.geometry.attributes.position,a=o.array,l=0,c=e*4,h=this.axesMode==="all"?this.joints:this.axesMode==="selected"&&this.selected>=0?[this.selected]:[];for(let d of h){if(r(d))continue;let f=t[d].matrixWorld.elements;Nn.set(f[12],f[13],f[14]);for(let g=0;g<3;g++){On.set(f[g*4],f[g*4+1],f[g*4+2]);let _=On.length()||1;On.multiplyScalar(c/_).add(Nn);let p=(l*6+g*2)*3;a[p]=Nn.x,a[p+1]=Nn.y,a[p+2]=Nn.z,a[p+3]=On.x,a[p+4]=On.y,a[p+5]=On.z}if(l++,l*6>a.length/3)break}this.axes.geometry.setDrawRange(0,l*6),o.needsUpdate=!0,this.axes.visible=l>0,this.spheres.visible=this.joints.length>0,this.bones.visible=this.links.length>0,this.controlMesh&&(this.controls.forEach((d,f)=>{t[d].matrixWorld.decompose(Nn,sr,rr);let g=r(d)?0:e*2.2;Mi.compose(Nn,sr,rr.set(g,g,g)),this.controlMesh.setMatrixAt(f,Mi),this.controlMesh.setColorAt(f,d===this.selected?kl:$x)}),this.controlMesh.instanceMatrix.needsUpdate=!0,this.controlMesh.instanceColor&&(this.controlMesh.instanceColor.needsUpdate=!0),this.controlMesh.boundingSphere=null)}pick(t){if(!this.spheres||!this.group.visible)return-1;if(this.joints.length){let e=t.intersectObject(this.spheres,!1);if(e.length&&e[0].instanceId!==void 0)return this.joints[e[0].instanceId]}if(this.controlMesh){let e=t.intersectObject(this.controlMesh,!1);if(e.length&&e[0].instanceId!==void 0)return this.controls[e[0].instanceId]}return-1}};var at=i=>document.getElementById(i),Do={joint:'<svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="3.2" fill="none" stroke="#5ec8e5" stroke-width="1.6"/></svg>',transform:'<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="#8e97a1" stroke-width="1.3"/></svg>',mesh:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="none" stroke="#c9c6c0" stroke-width="1.3" stroke-linejoin="round"/></svg>',skin:'<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1.5 10.5 9.5H1.5Z" fill="rgba(94,200,229,.25)" stroke="#5ec8e5" stroke-width="1.3" stroke-linejoin="round"/></svg>'},Kx='<svg class="on" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="7" cy="7" r="1.8" fill="currentColor"/></svg><svg class="off" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4Z" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/><path d="M2 12 12 2" stroke="currentColor" stroke-width="1.4"/></svg>',ie=i=>String(i).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),ps=(i,t=3)=>Number.isFinite(i)?(Math.abs(i)<.5*10**-t?0:i).toFixed(t):String(i),Fn=(i,t=3)=>i.map(e=>ps(e,t)).join(", "),tn=i=>i.toLocaleString("ja-JP"),No=class{constructor(t){this.app=t,this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null,this.filter="",this.msgTimer=0,this.bindToolbar(),this.bindTabs(),this.bindTree(),this.bindPose(),this.bindPanels(),this.bindResizer()}bindResizer(){let t=at("left-resizer"),e=at("app"),n=260,s=160,r=()=>Math.max(s,Math.min(640,Math.floor(window.innerWidth*.5))),o=()=>at("left").getBoundingClientRect().width,a=u=>{let h=Math.round(Math.max(s,Math.min(r(),u)));return e.style.setProperty("--left-user",h+"px"),t.setAttribute("aria-valuenow",String(h)),h};t.setAttribute("aria-valuemin",String(s)),t.setAttribute("aria-valuemax",String(r()));let l=null;t.addEventListener("pointerdown",u=>{if(u.button===0){u.preventDefault(),l={x:u.clientX,w:o()};try{t.setPointerCapture(u.pointerId)}catch{}t.classList.add("dragging"),document.body.classList.add("resizing")}}),t.addEventListener("pointermove",u=>{l&&a(l.w+(u.clientX-l.x))});let c=()=>{l&&(l=null,t.classList.remove("dragging"),document.body.classList.remove("resizing"))};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c),t.addEventListener("dblclick",()=>{e.style.removeProperty("--left-user"),t.setAttribute("aria-valuenow",String(n))}),t.addEventListener("keydown",u=>{let h=u.shiftKey?64:16;if(u.key==="ArrowLeft")a(o()-h);else if(u.key==="ArrowRight")a(o()+h);else if(u.key==="Home")a(s);else if(u.key==="End")a(r());else return;u.preventDefault(),u.stopPropagation()}),this.setLeftWidth=a}bindPanels(){for(let t of["left","right"])at(t+"-collapse").addEventListener("click",()=>this.setPanelCollapsed(t,!0)),at(t+"-expand").addEventListener("click",()=>this.setPanelCollapsed(t,!1))}setPanelCollapsed(t,e){document.body.classList.toggle(t+"-collapsed",e),at(t+"-collapse").setAttribute("aria-expanded",String(!e)),at(t+"-expand").setAttribute("aria-expanded",String(!e)),at(t+(e?"-expand":"-collapse")).focus()}isPanelCollapsed(t){return document.body.classList.contains(t+"-collapsed")}setHost(t){document.body.dataset.host=t}bindToolbar(){let t=(n,s)=>this.app.setSetting(n,s);at("opt-shading").addEventListener("change",n=>t("shading",n.target.value)),at("opt-axes").addEventListener("change",n=>t("axes",n.target.value)),at("opt-weights").addEventListener("change",n=>t("weightMode",n.target.value)),at("opt-alpha").addEventListener("change",n=>t("alpha",n.target.value)),at("opt-pose-source").addEventListener("change",n=>t("poseSource",n.target.value)),at("opt-lighting").addEventListener("change",n=>t("lighting",n.target.value)),at("opt-map-view").addEventListener("change",n=>t("mapView",n.target.value)),at("opt-normal-flip").addEventListener("change",n=>t("normalFlipY",n.target.checked)),document.querySelectorAll("#map-toggles [data-map]").forEach(n=>{n.addEventListener("change",()=>this.app.setMapToggle(n.dataset.map,n.checked))}),at("opt-alpha-style").addEventListener("change",n=>t("alphaStyle",n.target.value)),at("opt-jsize").addEventListener("input",n=>t("jointSize",parseFloat(n.target.value)));let e={"opt-wire":"wire","opt-skin":"skin","opt-joints":"joints","opt-xray":"xray","opt-tex":"textures","opt-grid":"grid"};for(let[n,s]of Object.entries(e))at(n).addEventListener("click",r=>{let o=r.currentTarget.getAttribute("aria-pressed")!=="true";r.currentTarget.setAttribute("aria-pressed",String(o)),t(s,o)});document.querySelectorAll("#opt-tool [data-tool]").forEach(n=>{n.addEventListener("click",()=>t("tool",n.dataset.tool))}),at("opt-space").addEventListener("click",n=>t("space",n.currentTarget.getAttribute("aria-pressed")==="true"?"local":"world")),this.bindMenus(),at("btn-undo").addEventListener("click",()=>this.app.undo()),at("btn-warnings").addEventListener("click",()=>this.app.showWarnings()),at("warn-dialog-close").addEventListener("click",()=>at("warn-dialog").close()),at("btn-redo").addEventListener("click",()=>this.app.redo()),at("btn-frame-all").addEventListener("click",()=>this.app.frameAll()),at("btn-frame-sel").addEventListener("click",()=>this.app.frameSelection()),at("file-input").addEventListener("change",n=>{let s=n.target.files&&n.target.files[0];s&&this.app.loadFile(s),n.target.value=""}),document.querySelector('label[for="file-input"]').addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),at("file-input").click())})}syncSettings(t){at("opt-shading").value=t.shading,at("opt-axes").value=t.axes,at("opt-weights").value=t.weightMode,at("opt-jsize").value=t.jointSize,at("opt-wire").setAttribute("aria-pressed",String(t.wire)),at("opt-skin").setAttribute("aria-pressed",String(t.skin)),at("opt-joints").setAttribute("aria-pressed",String(t.joints)),at("opt-xray").setAttribute("aria-pressed",String(t.xray)),at("opt-grid").setAttribute("aria-pressed",String(!!t.grid)),at("opt-tex").setAttribute("aria-pressed",String(t.textures)),at("opt-alpha").value=t.alpha,at("opt-pose-source").value=t.poseSource,at("opt-lighting").value=t.lighting,at("opt-map-view").value=t.mapView,at("opt-normal-flip").checked=!!t.normalFlipY,at("map-toggles").disabled=t.mapView!=="combined",document.querySelectorAll("#map-toggles [data-map]").forEach(s=>{s.checked=!!t.maps[s.dataset.map]}),at("opt-alpha-style").value=t.alphaStyle,at("opt-space").setAttribute("aria-pressed",String(t.space==="world"));let e={baseColor:"\u30D9\u30FC\u30B9\u30AB\u30E9\u30FC",normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},n=[t.lighting==="flat"?"\u30D5\u30E9\u30C3\u30C8\u30E9\u30A4\u30C8":"",t.shading==="none"?"\u30EF\u30A4\u30E4\u30FC\u306E\u307F":t.shading==="flat"?"\u30D5\u30E9\u30C3\u30C8":"",t.poseSource==="file"?"\u30D5\u30A1\u30A4\u30EB\u306E\u5024":""].filter(Boolean).join("\u30FB");at("menu-view-state").textContent=n,at("menu-maps-state").textContent=t.mapView!=="combined"&&e[t.mapView]||"",at("menu-weights-state").textContent={selected:"\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7",all:"\u8272\u5206\u3051"}[t.weightMode]||"",document.querySelectorAll("#opt-tool [data-tool]").forEach(s=>{s.setAttribute("aria-pressed",String(s.dataset.tool===t.tool))})}bindMenus(){let t=[...document.querySelectorAll(".menu-btn")],e=n=>{for(let s of t)s!==n&&(s.setAttribute("aria-expanded","false"),at(s.getAttribute("aria-controls")).hidden=!0)};for(let n of t)n.addEventListener("click",()=>{let s=n.getAttribute("aria-expanded")!=="true";e(n),n.setAttribute("aria-expanded",String(s)),at(n.getAttribute("aria-controls")).hidden=!s});document.addEventListener("pointerdown",n=>{n.target.closest(".menu")||e(null)}),document.addEventListener("keydown",n=>{if(n.key!=="Escape")return;let s=t.find(r=>r.getAttribute("aria-expanded")==="true");s&&(e(null),s.focus(),n.stopPropagation(),n.preventDefault())}),this.closeMenus=()=>e(null)}bindTabs(){let t=[["tab-tree","pane-tree"],["tab-meshes","pane-meshes"]];for(let[e,n]of t)at(e).addEventListener("click",()=>{for(let[s,r]of t)at(s).setAttribute("aria-selected",String(s===e)),at(r).hidden=s!==e})}bindTree(){at("tree").addEventListener("click",e=>{let n=e.target.closest(".row");if(!n)return;let s=this.rows[+n.dataset.row];if(e.target.closest(".eye")){s.mesh>=0?this.app.setMeshVisible(s.mesh,!this.app.built.meshes[s.mesh].selfVisible):this.app.toggleNodeVisible(s.node);return}if(e.target.closest(".twisty")){let r=this.collapsed.has(s.key);e.shiftKey?this.setSubtreeOpen(+n.dataset.row,r):r?this.collapsed.delete(s.key):this.collapsed.add(s.key),this.applyTreeVisibility();return}s.mesh>=0?this.app.selectMesh(s.mesh):this.app.select(s.node,{notify:!0})}),at("tree-expand-all").addEventListener("click",()=>this.setAllOpen(!0)),at("tree-collapse-all").addEventListener("click",()=>this.setAllOpen(!1)),at("tree-filter").addEventListener("input",e=>{this.filter=e.target.value.trim().toLowerCase(),this.applyTreeVisibility()})}populate(t,e){let n=at("tree");n.textContent="",this.rows=[],this.rowOfNode=new Map,this.collapsed=new Set,this.selectedRow=null;let s=new Map;t.meshes.forEach((c,u)=>{s.has(c.transform)||s.set(c.transform,[]),s.get(c.transform).push(u)});let r=document.createDocumentFragment(),o=t.nodes.length>400,a=c=>{let u=document.createElement("div");return u.className="row"+(c.dim?" dim":""),u.setAttribute("role","treeitem"),u.dataset.row=String(this.rows.length),u.style.setProperty("--depth",c.depth),u.innerHTML=`<button class="twisty${c.hasChildren?"":" leaf"}" tabindex="-1" aria-label="\u958B\u9589" title="\u30AF\u30EA\u30C3\u30AF: \u958B\u9589\u3000Shift+\u30AF\u30EA\u30C3\u30AF: \u4E0B\u306E\u968E\u5C64\u3082\u307E\u3068\u3081\u3066\u958B\u9589">\u25BE</button><span class="icon">${c.icon}</span><span class="name" title="${ie(c.title)}">${ie(c.label)}</span><button class="eye" tabindex="-1" aria-pressed="true" aria-label="\u8868\u793A" title="\u8868\u793A\u30FB\u975E\u8868\u793A\uFF08H: \u5207\u308A\u66FF\u3048 / Ctrl+H: \u96A0\u3059 / Shift+H: \u8868\u793A\uFF09">${Kx}</button>`,c.eye=u.lastChild,c.el=u,c.twisty=u.firstChild,this.rows.push(c),r.appendChild(u),c},l=(c,u)=>{let h=t.nodes[c],d=e.childrenOf[c],f=s.get(c)||[],g=a({key:"n"+c,node:c,mesh:-1,depth:u,label:h.name,title:h.path,icon:h.type==="joint"?Do.joint:Do.transform,hasChildren:d.length+f.length>0,dim:h.visible===!1});this.rowOfNode.set(c,g),o&&u>=2&&g.hasChildren&&this.collapsed.add(g.key);for(let _ of f){let p=t.meshes[_];a({key:"m"+_,node:c,mesh:_,depth:u+1,label:p.name,title:p.path,icon:p.skin?Do.skin:Do.mesh,hasChildren:!1,dim:p.visible===!1})}for(let _ of d)l(_,u+1)};t.nodes.forEach((c,u)=>{c.parent<0&&l(u,0)}),n.appendChild(r),this.applyTreeVisibility(),this.populateMeshes(t,e)}updateVisibilityMarks(t,e,n){for(let s of this.rows){let r,o;if(s.mesh>=0){let a=n[s.mesh];r=a.selfVisible,o=!a.visible}else r=!t.has(s.node),o=!!e[s.node];s.eye.setAttribute("aria-pressed",String(r)),s.eye.setAttribute("aria-label",r?"\u8868\u793A\u4E2D":"\u975E\u8868\u793A"),s.el.classList.toggle("dim",o)}}setSubtreeOpen(t,e){let n=this.rows[t];for(let s=t;s<this.rows.length;s++){let r=this.rows[s];if(s>t&&r.depth<=n.depth)break;r.hasChildren&&(e?this.collapsed.delete(r.key):this.collapsed.add(r.key))}}setAllOpen(t){if(this.collapsed.clear(),!t)for(let e of this.rows)e.hasChildren&&this.collapsed.add(e.key);this.applyTreeVisibility(),t&&this.selectedRow&&!this.selectedRow.el.hidden&&this.selectedRow.el.scrollIntoView({block:"nearest"})}applyTreeVisibility(){let t=this.filter,e=1/0;for(let n of this.rows){if(t){n.el.hidden=!n.label.toLowerCase().includes(t);continue}if(n.depth>e){n.el.hidden=!0;continue}e=1/0,n.el.hidden=!1;let s=this.collapsed.has(n.key);n.twisty.textContent=s?"\u25B8":"\u25BE",n.hasChildren&&n.el.setAttribute("aria-expanded",String(!s)),s&&(e=n.depth)}}highlightNode(t,e){this.selectedRow&&this.selectedRow.el.classList.remove("selected"),this.selectedRow=null;let n=this.rowOfNode.get(t);if(!n)return;let s=e[t].parent,r=!1;for(;s>=0;)this.collapsed.delete("n"+s)&&(r=!0),s=e[s].parent;r&&this.applyTreeVisibility(),n.el.classList.add("selected"),n.el.setAttribute("aria-selected","true"),this.selectedRow=n,n.el.hidden||n.el.scrollIntoView({block:"nearest"})}populateMeshes(t,e,n){let s=at("mesh-list");s.textContent="";let r=t.materials||[],o=a=>{if(a<0)return'<span class="tex">\u30C6\u30AF\u30B9\u30C1\u30E3\u306A\u3057</span>';let l=(t.textures||[])[a]||{},c=n&&n[a]||{status:l.resolved&&l.format?"loading":"missing"},u=ie(String(l.path||"").split(/[\\/]/).pop()||l.node||"?"),h=ie(l.resolved||l.path||"");if(c.status==="ok"){let f=(c.tiles>1?`UDIM ${c.tiles} \u30BF\u30A4\u30EB\u30FB`:"")+(c.sourceWidth!==c.width?`${c.sourceWidth}\u2192${c.width}px`:`${c.width}px`);return`<span class="tex-ok" aria-label="\u8AAD\u307F\u8FBC\u307F\u6E08\u307F">\u2713</span><span class="tex" title="${h}">${u}\uFF08${f}${c.hasAlpha?"\u30FB\u30A2\u30EB\u30D5\u30A1\u3042\u308A":""}\uFF09</span>`}if(c.status==="loading")return`<span class="tex-wait">\u2026</span><span class="tex" title="${h}">${u}\uFF08\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF09</span>`;if(c.status==="pending")return`<span class="tex-wait">\u2013</span><span class="tex" title="${h}">${u}\uFF08\u672A\u8AAD\u307F\u8FBC\u307F\uFF09</span>`;let d=c.status==="error"?"\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093":l.resolved?"\u5F62\u5F0F\u306B\u672A\u5BFE\u5FDC":"\u898B\u3064\u304B\u308A\u307E\u305B\u3093";return`<span class="tex-bad" aria-label="${d}">\u2715</span><span class="tex" title="${h}">${u}\uFF08${d}\uFF09</span>`};e.meshes.forEach((a,l)=>{let c=t.meshes[l],u=document.createElement("div");u.className="mesh-item";let h="mesh-vis-"+l,d=`\u9802\u70B9 ${tn(a.vertexCount)} \u30FB \u9762 ${tn(c.counts.length)} \u30FB \u4E09\u89D2\u5F62 ${tn(a.triCount)}`;if(a.skin&&(d+=`<br>\u30B9\u30AD\u30F3 ${ie(c.skin.cluster)}\uFF08\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9 ${a.skin.stats.influenceCount}\u30FB\u6700\u5927 ${a.skin.stats.maxCount}/\u9802\u70B9\uFF09`),c.visible===!1&&(d+="<br>Maya \u3067\u306F\u975E\u8868\u793A"),c.uv){let m=0,y=0;for(let x of c.counts){for(let M=0;M<x;M++)if(c.uv.indices[y+M]<0){m++;break}y+=x}d+=`<br>UV ${ie(c.uv.set)}`+(m?`\uFF08<span class="tex-bad">UV \u306E\u306A\u3044\u9762 ${tn(m)}</span>\uFF09`:"")}else d+="<br>UV \u306A\u3057";let f=c.faceMaterials||c.counts.map(()=>c.material??-1),g=new Map;for(let m of f)g.set(m,(g.get(m)||0)+1);let _=g.size>1,p='<ul class="mats">';for(let[m,y]of g){let x=r[m],M=_?`<span class="faces">${tn(y)} \u9762</span>`:"";p+=x?`<li><span title="${ie(x.type)}">${ie(x.name)}</span>${M}${o(x.texture)}</li>`:`<li><span>\u65E2\u5B9A\u306E\u30DE\u30C6\u30EA\u30A2\u30EB</span>${M}</li>`;let A=x&&x.maps?Object.entries(x.maps).filter(([b])=>b!=="baseColor"):[];if(A.length){let b={normal:"\u6CD5\u7DDA",roughness:"\u30E9\u30D5\u30CD\u30B9",metalness:"\u30E1\u30BF\u30EA\u30C3\u30AF",ao:"AO",emissive:"\u30A8\u30DF\u30C3\u30B7\u30D6",opacity:"\u4E0D\u900F\u660E\u5EA6"},S={ok:'<span class="tex-ok">\u2713</span>',loading:'<span class="tex-wait">\u2026</span>',pending:'<span class="tex-wait">\u2013</span>',missing:'<span class="tex-bad">\u2715</span>',error:'<span class="tex-bad">\u2715</span>'},P=A.map(([v,w])=>{let O=n&&n[w.texture]||{status:"pending"},G=w.channel&&w.channel!=="rgb"?`\uFF08${w.channel.toUpperCase()}\uFF09`:"";return`${b[v]||v}${G} ${S[O.status]||""}`});p+=`<li class="sub-maps">${P.join("\u3000")}</li>`}}p+="</ul>",u.innerHTML=`<input type="checkbox" id="${h}" ${a.visible?"checked":""} aria-label="${ie(c.name)} \u3092\u8868\u793A"><label class="name" for="${h}">${ie(c.name)}</label><div class="meta">${d}</div>${p}`,u.querySelector("input").addEventListener("change",m=>this.app.setMeshVisible(l,m.target.checked)),u.querySelector(".name").addEventListener("click",m=>{m.preventDefault(),this.app.selectMesh(l)}),s.appendChild(u)})}setMeshChecked(t,e){let n=at("mesh-vis-"+t);n&&(n.checked=e)}showNodeInfo(t){let e=at("select-head"),n=at("select-info");if(!t){e.innerHTML='<p class="muted">\u30B8\u30E7\u30A4\u30F3\u30C8\u3084\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3053\u3053\u306B\u60C5\u5831\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>',n.innerHTML="";return}let s=t.node,r=s.attrs||{},o={joint:"\u30B8\u30E7\u30A4\u30F3\u30C8",transform:"\u30C8\u30E9\u30F3\u30B9\u30D5\u30A9\u30FC\u30E0"}[s.type]||s.type;e.innerHTML=`<p class="info-title">${ie(s.name)}<span class="info-type">${ie(o)}</span>${t.posed?'<span class="posed-badge">\u30DD\u30FC\u30BA\u5909\u66F4\u4E2D</span>':""}</p><p class="info-path">${ie(s.path)}</p>`;let a={pm:"skinCluster \u306E .pm",dagPose:"dagPose",bps:"\u30B8\u30E7\u30A4\u30F3\u30C8\u306E .bps"},l='<table class="kv">';l+=`<tr><th>\u8868\u793A</th><td>${t.hiddenSelf?"\u975E\u8868\u793A":t.hiddenByParent?"\u89AA\u304C\u975E\u8868\u793A\u306E\u305F\u3081\u96A0\u308C\u3066\u3044\u307E\u3059":"\u8868\u793A\u4E2D"}</td></tr>`,l+=`<tr><th>\u59FF\u52E2\u306E\u57FA\u6E96</th><td>${t.usingBind?"\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA":"\u30D5\u30A1\u30A4\u30EB\u306E\u5024"}</td></tr>`,l+=`<tr><th>\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u60C5\u5831</th><td>${t.bindSource?ie(a[t.bindSource]||t.bindSource):"\u306A\u3057"}</td></tr>`,l+="</table>";let c=t.animChannels||[],u=t.rigDrivers||[];(c.length||u.length)&&(l+='<table class="kv">',c.length&&(l+=`<tr><th>\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3</th><td>${ie(c.join("\u30FB"))}</td></tr>`),u.length&&(l+=`<tr><th>\u30EA\u30B0</th><td>${u.slice(0,6).map(ie).join("<br>")}${u.length>6?"<br>\u307B\u304B":""}</td></tr>`),l+="</table>");let h=/（(animCurveT[LAU]|pointConstraint|orientConstraint|parentConstraint|scaleConstraint|poleVectorConstraint|unitConversion|pairBlend|blendColors|multiplyDivide|plusMinusAverage|reverse|condition)）$/,d=(t.drivenBy||[]).filter(f=>!(t.animLoaded&&h.test(f)));if(d.length&&(l+='<p class="note small">\u6B21\u306E\u5024\u306F\u63A5\u7D9A\u3067\u6C7A\u307E\u308B\u305F\u3081\u3001\u30D5\u30A1\u30A4\u30EB\u306B\u6B8B\u3063\u3066\u3044\u307E\u305B\u3093'+(t.bindSource?"\uFF08\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u3067\u3082\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\u306E\u59FF\u52E2\u3067\u8868\u793A\uFF09":"\uFF08\u65E2\u5B9A\u5024\u3067\u8868\u793A\uFF09")+"\uFF1A<br>"+d.slice(0,6).map(ie).join("<br>")+(d.length>6?"<br>\u307B\u304B":"")+"</p>"),l+='<p class="sub">\u30D5\u30A1\u30A4\u30EB\u4E0A\u306E\u5024</p><table class="kv">',r.t&&(l+=`<tr><th>\u79FB\u52D5</th><td>${Fn(r.t)}</td></tr>`),r.r&&(l+=`<tr><th>\u56DE\u8EE2</th><td>${Fn(r.r,2)}</td></tr>`),r.jo&&(l+=`<tr><th>\u30B8\u30E7\u30A4\u30F3\u30C8\u306E\u5411\u304D</th><td>${Fn(r.jo,2)}</td></tr>`),r.s&&(l+=`<tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Fn(r.s)}</td></tr>`),r.ro&&(l+=`<tr><th>\u56DE\u8EE2\u9806</th><td>${ie(r.ro)}</td></tr>`),l+="</table>",t.animValues){let f=t.animValues;l+=`<p class="sub">\u30D5\u30EC\u30FC\u30E0 ${ie(ps(t.frame,Number.isInteger(t.frame)?0:2))} \u306E\u5024</p><table class="kv"><tr><th>\u79FB\u52D5</th><td>${Fn(f.t)}</td></tr><tr><th>\u56DE\u8EE2</th><td>${Fn(f.r,2)}</td></tr><tr><th>\u30B9\u30B1\u30FC\u30EB</th><td>${Fn(f.s)}</td></tr></table>`}if(l+=`<table class="kv" style="margin-top:6px"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Fn(t.worldPos)}</td></tr></table>`,t.usage&&t.usage.length){l+='<p class="sub">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3068\u3057\u3066</p><table class="kv">';for(let f of t.usage)l+=`<tr><th>${ie(f.meshName)}</th><td>${tn(f.count)} / ${tn(f.total)} \u9802\u70B9</td></tr>`;l+="</table>"}else s.type==="joint"&&(l+='<p class="muted small">\u3069\u306E\u30E1\u30C3\u30B7\u30E5\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u306B\u3082\u306A\u3063\u3066\u3044\u307E\u305B\u3093\u3002</p>');if(t.meshes&&t.meshes.length)for(let f of t.meshes){if(l+=`<p class="sub">\u30E1\u30C3\u30B7\u30E5 ${ie(f.name)}</p><table class="kv">`,l+=`<tr><th>\u9802\u70B9 / \u9762</th><td>${tn(f.vertices)} / ${tn(f.faces)}</td></tr>`,f.skin){let g=f.skin;l+=`<tr><th>skinCluster</th><td>${ie(f.cluster)}</td></tr>`,l+=`<tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9</th><td>${g.influenceCount}\uFF08\u6700\u5927 ${g.maxCount}/\u9802\u70B9\uFF09</td></tr>`,l+=`<tr><th>5\u301C8 \u3064\u306E\u9802\u70B9</th><td>${tn(g.over4-g.overMax)}</td></tr>`,l+=`<tr><th>9 \u3064\u4EE5\u4E0A\u306E\u9802\u70B9</th><td>${tn(g.overMax)}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9</th><td>${tn(g.unnormalized)}</td></tr>`;let _={0:"\u306A\u3057",1:"\u30A4\u30F3\u30BF\u30E9\u30AF\u30C6\u30A3\u30D6",2:"\u30DD\u30B9\u30C8"}[f.normalizeSetting]||"?";l+=`<tr><th>Maya \u306E\u6B63\u898F\u5316\u306E\u8A2D\u5B9A</th><td>${_}</td></tr>`,l+=`<tr><th>\u5408\u8A08\u304C 0 \u306E\u9802\u70B9</th><td>${tn(g.zero)}\uFF08\u5272\u308A\u5F53\u3066\u6E08\u307F\uFF09</td></tr>`}l+="</table>",f.skin&&f.skin.overMax&&(l+='<p class="note small">9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u306F\u3001\u4E0A\u4F4D 8 \u3064\u3067\u5909\u5F62\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF08\u30D2\u30FC\u30C8\u30DE\u30C3\u30D7\u3068\u6570\u5024\u306F\u5168\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\uFF09\u3002</p>')}n.innerHTML=l}showVertexInfo(t){let e=at("vertex-body");if(!t){e.innerHTML='<p class="muted">\u30E1\u30C3\u30B7\u30E5\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u3001\u3044\u3061\u3070\u3093\u8FD1\u3044\u9802\u70B9\u306E\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059\u3002</p>';return}let n=`<p class="info-title">${ie(t.meshName)}.vtx[${t.vertex}]</p>`;if(n+=`<table class="kv"><tr><th>\u30EF\u30FC\u30EB\u30C9\u4F4D\u7F6E</th><td>${Fn(t.worldPos)}</td></tr></table>`,!t.skinned){n+='<p class="muted">\u3053\u306E\u30E1\u30C3\u30B7\u30E5\u306B\u306F\u30B9\u30AD\u30F3\u304C\u3042\u308A\u307E\u305B\u3093\u3002</p>',e.innerHTML=n;return}if(!t.weights.length){n+='<p class="note err">\u3053\u306E\u9802\u70B9\u306B\u306F\u30A6\u30A7\u30A4\u30C8\u304C\u3042\u308A\u307E\u305B\u3093\uFF08\u30B8\u30E7\u30A4\u30F3\u30C8\u3082\u3042\u308A\u307E\u305B\u3093\uFF09\u3002</p>',e.innerHTML=n;return}n+='<ul class="wlist">',t.weights.forEach((s,r)=>{let o=r>=8,l=t.assigned||t.normalized&&Math.abs(t.sum-1)>.001?`${ps(s.weight,4)} \u2192 ${ps(s.effective,4)}`:ps(s.weight,4);n+=`<li class="${o?"dropped":""}"><span class="jn" data-node="${s.nodeIndex}" title="${ie(s.path)}">${ie(s.name)}</span><span class="wv">${l}</span><span class="bar"><i style="width:${Math.min(100,s.effective*100).toFixed(1)}%"></i></span></li>`}),n+="</ul>",n+=`<table class="kv" style="margin-top:6px"><tr><th>\u5408\u8A08</th><td>${ps(t.sum,4)}</td></tr><tr><th>\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u6570</th><td>${t.weights.length}</td></tr></table>`,t.weights.length>8&&(n+='<p class="note small">9 \u3064\u76EE\u4EE5\u964D\uFF08\u8584\u3044\u8868\u793A\uFF09\u306F\u5909\u5F62\u8868\u793A\u306B\u4F7F\u308F\u308C\u3066\u3044\u307E\u305B\u3093\u3002</p>'),t.assigned?n+=`<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u305F\u3081\u3001\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${t.distribution}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3067\u5909\u5F62\u3057\u3066\u3044\u307E\u3059\u3002</p>`:Math.abs(t.sum-1)>.001&&(n+='<p class="note small">\u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306F\u3042\u308A\u307E\u305B\u3093\u3002\u5909\u5F62\u306B\u306F\u5408\u8A08\u3067\u5272\u3063\u305F\u5024\uFF08\u2192 \u306E\u53F3\uFF09\u3092\u4F7F\u3063\u3066\u3044\u307E\u3059\u3002</p>'),e.innerHTML=n,e.querySelectorAll(".jn").forEach(s=>{s.addEventListener("click",()=>this.app.select(+s.dataset.node,{notify:!0}))})}bindPose(){let t=["x","y","z"],e=(r,o)=>{let a=parseFloat(at(r).value);return Number.isFinite(a)?a:o},n=()=>({t:t.map(r=>e("pose-t"+r,0)),r:t.map(r=>e("pose-r"+r,0)),s:t.map(r=>e("pose-s"+r,1))}),s=()=>{this.app.beginPoseEdit([this.app.selected],"\u6570\u5024\u5165\u529B"),this.app.setPoseForSelected(n())};for(let r of["t","r","s"])for(let o of t){let a=at("pose-"+r+o);a.addEventListener("input",s),a.addEventListener("change",()=>this.app.endPoseEdit()),a.addEventListener("blur",()=>this.app.endPoseEdit()),a.addEventListener("keydown",l=>{l.key==="Enter"&&a.blur()})}at("pose-reset").addEventListener("click",()=>this.app.resetPose(this.app.selected)),at("pose-reset-all").addEventListener("click",()=>this.app.resetAllPoses())}showPoseFor(t,e){let n=t>=0;if(at("pose-ctrls").hidden=!n,!n)return;let s=e||{t:[0,0,0],r:[0,0,0],s:[1,1,1]},r=document.activeElement,o=(a,l)=>{let c=at(a);c!==r&&(c.value=String(+l.toFixed(4)))};["x","y","z"].forEach((a,l)=>{o("pose-t"+a,s.t[l]),o("pose-r"+a,s.r[l]),o("pose-s"+a,s.s[l])})}addWarnings(t){this.warnings=(this.warnings||[]).concat(t),this.setWarnings(this.warnings)}setWarnings(t){this.warnings=t.slice();let e=at("btn-warnings");e.hidden=!t.length,at("warn-count").textContent=String(t.length),e.title=`\u8B66\u544A ${t.length} \u4EF6\u3092\u8868\u793A`,e.setAttribute("aria-label",e.title),at("warn-body").innerHTML=t.length?"<ul>"+t.map(n=>`<li>${ie(n)}</li>`).join("")+"</ul>":'<p class="muted">\u8B66\u544A\u306F\u3042\u308A\u307E\u305B\u3093\u3002</p>',this.app.onWarningsChanged(this.warnings)}openWarningDialog(){let t=at("warn-dialog");t.open||t.showModal()}setHistoryState(t){let e=at("btn-undo"),n=at("btn-redo");e.disabled=!t.canUndo,n.disabled=!t.canRedo,e.title=(t.canUndo?`\u5143\u306B\u623B\u3059: ${t.undoLabel}`:"\u5143\u306B\u623B\u3059")+"\uFF08Ctrl+Z / Z\uFF09",n.title=(t.canRedo?`\u3084\u308A\u76F4\u3059: ${t.redoLabel}`:"\u3084\u308A\u76F4\u3059")+"\uFF08Ctrl+Y / Shift+Z\uFF09"}setLegend(t,e){let n=at("legend");if(t==="off"){n.hidden=!0;return}n.hidden=!1,t==="selected"?n.innerHTML=e?`<div class="lg-title">\u30A6\u30A7\u30A4\u30C8: ${ie(e)}</div><div class="lg-bar"></div><div class="lg-scale"><span>0</span><span>0.5</span><span>1</span></div>`:'<div class="lg-title">\u30B8\u30E7\u30A4\u30F3\u30C8\u3092\u9078\u3076\u3068\u30A6\u30A7\u30A4\u30C8\u3092\u8868\u793A\u3057\u307E\u3059</div>':n.innerHTML='<div class="lg-title">\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3054\u3068\u306B\u8272\u5206\u3051</div><div class="muted small">\u5883\u754C\u306E\u6DF7\u8272\u304C\u30A6\u30A7\u30A4\u30C8\u306E\u6DF7\u3056\u308A\u5177\u5408\u3067\u3059\u3002</div>'}setTitle(t){at("vp-title").textContent=t||""}setFile(t){at("status-file").textContent=t}setStats(t){at("status-stats").textContent=t}setMessage(t,e=4e3){at("status-msg").textContent=t||"",clearTimeout(this.msgTimer),t&&e&&(this.msgTimer=setTimeout(()=>{at("status-msg").textContent=""},e))}setEmpty(t){at("empty").hidden=!t}showLoading(t,e){at("loading").hidden=!1,at("loading-text").textContent=t||"\u8AAD\u307F\u8FBC\u307F\u4E2D";let n=typeof e=="number"&&e>=0;at("loading-bar").parentElement.classList.toggle("indeterminate",!n),at("loading-bar").style.width=n?`${Math.round(Math.min(1,e)*100)}%`:""}hideLoading(){at("loading").hidden=!0}showError(t){let e=at("error");e.hidden=!1,e.textContent=t}hideError(){at("error").hidden=!0}};function Oo(){return typeof window<"u"&&typeof window.qt<"u"&&!!window.qt.webChannelTransport}function nd(i){return!Oo()||typeof window.QWebChannel>"u"?!1:(new window.QWebChannel(window.qt.webChannelTransport,t=>{let e=t.objects.bridge;e&&i(e)}),!0)}var Fo=class{constructor(t,e=200){this.apply=t,this.limit=e,this.undoStack=[],this.redoStack=[],this.onChange=null}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}get undoLabel(){return this.canUndo?this.undoStack[this.undoStack.length-1].label:""}get redoLabel(){return this.canRedo?this.redoStack[this.redoStack.length-1].label:""}push(t){this.undoStack.push(t),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack.length=0,this.changed()}undo(){let t=this.undoStack.pop();return t?(this.apply(t.before),this.redoStack.push(t),this.changed(),t):null}redo(){let t=this.redoStack.pop();return t?(this.apply(t.after),this.undoStack.push(t),this.changed(),t):null}clear(){this.undoStack.length=0,this.redoStack.length=0,this.changed()}changed(){this.onChange&&this.onChange(this)}};function id(i,t){return JSON.stringify(i)===JSON.stringify(t)}var sd=30,rd=31;function od(i,t=0,e={}){let n=e.size||384,s=e.eightOnGpu!==!1,{renderer:r,camera:o,scene:a}=i,l=i.built.meshes[t];if(!l||!l.skinned)throw new Error("\u30B9\u30AD\u30F3\u4ED8\u304D\u30E1\u30C3\u30B7\u30E5\u3067\u306F\u3042\u308A\u307E\u305B\u3093");i.built.root.updateMatrixWorld(!0);let c=l.geometry.attributes.position.count,u=new Float32Array(c*3),h=new C;for(let S=0;S<c;S++)ir(l,S,!0,h),u[S*3]=h.x,u[S*3+1]=h.y,u[S*3+2]=h.z;let d=new ee;d.setAttribute("position",new _e(u,3)),d.setIndex(l.geometry.index);let f=new Pe({color:16711680,side:Oe}),g=new mt(d,f);g.frustumCulled=!1,g.layers.set(rd),a.add(g),g.updateMatrixWorld(!0);let _=new Pe({color:16711680,side:Oe});s&&us(_);let p={material:l.skinned.material,layers:l.skinned.layers.mask,visible:l.skinned.visible,cam:o.layers.mask,aspect:o.aspect,target:r.getRenderTarget()};l.skinned.material=_,l.skinned.layers.set(sd),l.skinned.visible=!0,o.aspect=1,o.updateProjectionMatrix();let m=new hn(n,n),y=S=>{o.layers.set(S),r.setRenderTarget(m),r.clear(),r.render(a,o);let P=new Uint8Array(n*n*4);return r.readRenderTargetPixels(m,0,0,n,n,P),P},x,M;try{x=y(sd),M=y(rd)}finally{r.setRenderTarget(p.target),o.layers.mask=p.cam,o.aspect=p.aspect,o.updateProjectionMatrix(),l.skinned.material=p.material,l.skinned.layers.mask=p.layers,l.skinned.visible=p.visible,a.remove(g),d.dispose(),f.dispose(),_.dispose(),m.dispose(),i.requestRender()}let A=0,b=0;for(let S=3;S<x.length;S+=4){let P=x[S]>127,v=M[S]>127;(P||v)&&A++,P!==v&&b++}return{covered:A,mismatch:b,ratio:A?b/A:0}}var ke={FIXED:1,LINEAR:2,FLAT:3,STEP:5,SLOW:6,FAST:7,SPLINE:9,CLAMPED:10,PLATEAU:16,STEP_NEXT:17,AUTO:18},ms={CONSTANT:0,LINEAR:1,CYCLE:3,CYCLE_RELATIVE:4,OSCILLATE:5},Vl=Math.PI/180,gs=1e-9,hd=1,ud=2;function ko(i,t=Float32Array){if(i==null)return new t(0);if(Array.isArray(i))return t.from(i);let e=atob(i.data||""),n=new Uint8Array(e.length);for(let r=0;r<e.length;r++)n[r]=e.charCodeAt(r);if(i.dtype==="uint8")return t===Uint8Array?n:t.from(n);let s=new Float32Array(n.buffer,0,Math.floor(n.length/4));return t===Float32Array?s:t.from(s)}function ad(i,t){return i===0&&(i=t||ke.AUTO),i>=19&&i<=21?ke.AUTO:i}function Qx(i,t,e,n,s){let r=i.count,o=i.offset,a=Float64Array.from(t.subarray(o,o+r)),l=Float64Array.from(e.subarray(o,o+r)),c=new Float64Array(r),u=new Float64Array(r),h=new Float64Array(r),d=new Float64Array(r),f=new Uint8Array(r),g=!!i.weighted,_=(m,y)=>(l[y]-l[m])/Math.max(a[y]-a[m],gs),p=(m,y,x)=>{let M=y>0,A=y<r-1,b=M?_(y-1,y):0,S=A?_(y,y+1):0;switch(m){case ke.LINEAR:return x==="in"?M?b:S:A?S:b;case ke.FLAT:case ke.STEP:case ke.STEP_NEXT:return 0;case ke.CLAMPED:return!M||!A?M?b:S:Math.abs(l[y]-l[y-1])<gs||Math.abs(l[y+1]-l[y])<gs?0:_(y-1,y+1);case ke.AUTO:case ke.PLATEAU:{if(!M||!A||b*S<=0)return 0;let P=_(y-1,y+1),v=3*Math.min(Math.abs(b),Math.abs(S));return Math.sign(P)*Math.min(Math.abs(P),v)}default:return M&&A?_(y-1,y+1):M?b:S}};for(let m=0;m<r;m++){let y=o+m,x=ad(n.length?n[2*y]:0,i.tangent),M=ad(n.length?n[2*y+1]:0,i.tangent);M===ke.STEP?f[m]=hd:M===ke.STEP_NEXT&&(f[m]=ud);let A=s.get(y);for(let b of["in","out"]){let S=b==="in"?x:M,P=p(S,m,b),v=0,w=A?b==="in"?A[0]:A[2]:NaN,O=A?b==="in"?A[1]:A[3]:NaN;Number.isFinite(w)&&Number.isFinite(O)&&(S===ke.FIXED||g)&&(!(S===ke.LINEAR||S===ke.FLAT||S===ke.STEP||S===ke.STEP_NEXT)&&Math.abs(w)>gs&&(P=O/w),g&&(v=Math.abs(w))),b==="in"?(c[m]=P,h[m]=v):(u[m]=P,d[m]=v)}}return{name:i.name,type:i.type,n:r,t:a,v:l,inSlope:c,outSlope:u,inW:h,outW:d,step:f,weighted:g,pre:i.pre||0,post:i.post||0,last:0}}function ty(i,t,e){let n=i.t[t],s=i.t[t+1],r=i.v[t],o=i.v[t+1];if(i.step[t]===hd)return r;if(i.step[t]===ud)return e>n?o:r;let a=s-n;if(a<=gs)return o;if(!i.weighted||i.outW[t]===0&&i.inW[t+1]===0){let y=(e-n)/a,x=y*y,M=x*y,A=i.outSlope[t]*a,b=i.inSlope[t+1]*a;return(2*M-3*x+1)*r+(M-2*x+y)*A+(-2*M+3*x)*o+(M-x)*b}let l=i.outW[t]||a,c=i.inW[t+1]||a,u=Math.min(n+l/3,s),h=Math.max(s-c/3,n),d=r+i.outSlope[t]*(u-n),f=o-i.inSlope[t+1]*(s-h),g=(y,x,M,A,b)=>{let S=1-b;return S*S*S*y+3*S*S*b*x+3*S*b*b*M+b*b*b*A},_=0,p=1,m=(e-n)/a;for(let y=0;y<40;y++){let x=g(n,u,h,s,m);if(Math.abs(x-e)<1e-7)break;x<e?_=m:p=m,m=(_+p)/2}return g(r,d,f,o,m)}function ld(i,t){let e=i.t,n=i.n;if(t>=e[n-1])return i.v[n-1];let s=i.last;if(!(s<n-1&&e[s]<=t&&t<e[s+1])){let r=0,o=n-1;for(;o-r>1;){let a=r+o>>1;e[a]<=t?r=a:o=a}s=r,i.last=s}return ty(i,s,t)}function Bo(i,t){let e=i.n;if(e===0)return 0;if(e===1)return i.v[0];let n=i.t[0],s=i.t[e-1];if(t>=n&&t<=s)return ld(i,t);let r=t<n,o=r?i.pre:i.post;if(o===ms.LINEAR)return r?i.v[0]+i.inSlope[0]*(t-n):i.v[e-1]+i.outSlope[e-1]*(t-s);let a=s-n;if(a<=gs||!(o===ms.CYCLE||o===ms.CYCLE_RELATIVE||o===ms.OSCILLATE))return r?i.v[0]:i.v[e-1];let l=Math.floor((t-n)/a),c=t-l*a;o===ms.OSCILLATE&&l%2!==0&&(c=n+s-c);let u=ld(i,c);return o===ms.CYCLE_RELATIVE?u+l*(i.v[e-1]-i.v[0]):u}var ey=["xyz","yzx","zxy","xzy","yxz","zyx"],ny=ey.map(i=>i.split("").reverse().join("").toUpperCase()),iy=new Te,bi=new ct;function Si(i,t,e=new ct){e.identity();let n=a=>e.premultiply(a),s=(a,l=1)=>a?bi.makeTranslation(a[0]*l,a[1]*l,a[2]*l):null,r=(a,l)=>bi.makeRotationFromEuler(iy.set(a[0]*Vl,a[1]*Vl,a[2]*Vl,ny[l]||"ZYX")),o=i.s;return i.joint?(n(bi.makeScale(o[0],o[1],o[2])),i.ra&&n(r(i.ra,0)),n(r(i.r,i.ro||0)),i.jo&&n(r(i.jo,0)),t&&n(bi.makeScale(t[0]?1/t[0]:1,t[1]?1/t[1]:1,t[2]?1/t[2]:1)),n(s(i.t)),cd(i,e)):(i.sp&&n(s(i.sp,-1)),n(bi.makeScale(o[0],o[1],o[2])),i.sh&&n(bi.set(1,i.sh[0],i.sh[1],0,0,1,i.sh[2],0,0,0,1,0,0,0,0,1)),i.sp&&n(s(i.sp)),i.spt&&n(s(i.spt)),i.rp&&n(s(i.rp,-1)),i.ra&&n(r(i.ra,0)),n(r(i.r,i.ro||0)),i.rp&&n(s(i.rp)),i.rpt&&n(s(i.rpt)),n(s(i.t)),cd(i,e))}function cd(i,t){return i.opm?t.premultiply(i.opm.isMatrix4?i.opm:bi.fromArray(i.opm)):t}var sy={x:0,y:1,z:2},zo=class{constructor(t){this.raw=t,this.fps=+t.fps||24,this.start=+t.start,this.end=+t.end,this.end>=this.start||(this.start=0,this.end=0),this.current=Number.isFinite(+t.current)?+t.current:this.start;let e=ko(t.times),n=ko(t.values),s=ko(t.tangentTypes,Uint8Array),r=ko(t.fixedTangents),o=new Map;for(let l=0;l+4<r.length;l+=5)o.set(r[l],[r[l+1],r[l+2],r[l+3],r[l+4]]);this.curves=(t.curves||[]).map(l=>Qx(l,e,n,s,o)),this.warnings=(t.warnings||[]).slice();let a=new Map;for(let l of t.nodes||[])a.set(l.node,{node:l.node,rest:l,isNode:l.isNode??-1,isScale:l.isScale||null,channels:[],cur:{...l,t:l.t.slice(),r:l.r.slice(),s:l.s.slice()}});for(let l of t.channels||[]){let c=a.get(l.node),u=this.curves[l.curve];!c||!u||c.channels.push({base:l.attr[0],axis:sy[l.attr[1]],curve:u,attr:l.attr})}this.entries=[...a.values()],this.byNode=a,this.matrices=new Map(this.entries.map(l=>[l.node,new ct]))}get nodes(){return this.entries.map(t=>t.node)}channelsOf(t){let e=this.byNode.get(t);return e?e.channels.map(n=>n.attr):[]}keyTimes(t=-1){let e=new Set,n=t>=0?(this.byNode.get(t)||{channels:[]}).channels.map(s=>s.curve):this.curves;for(let s of n)for(let r=0;r<s.n;r++)e.add(s.t[r]);return[...e].sort((s,r)=>s-r)}evaluate(t){for(let e of this.entries){let n=e.cur;for(let s of e.channels)n[s.base][s.axis]=Bo(s.curve,t)}for(let e of this.entries){let n=null;if(e.cur.joint&&(e.isScale||e.isNode>=0)){let s=e.isNode>=0?this.byNode.get(e.isNode):null;n=s?s.cur.s:e.isScale}Si(e.cur,n,this.matrices.get(e.node))}return this.matrices}wrap(t){let e=this.end-this.start+1;return e<=1?this.start:this.start+((t-this.start)%e+e)%e}};var kn=Math.PI/180,yn=180/Math.PI,Se=1e-9,ry=["xyz","yzx","zxy","xzy","yxz","zyx"],ys=ry.map(i=>i.split("").reverse().join("").toUpperCase()),de=["x","y","z"],Gl=["r","g","b"],Wl=["x","y"],dd=new ct,or={multiplyDivide:{i1:[0,0,0],i2:[1,1,1],op:1},plusMinusAverage:{op:1},reverse:{i:[0,0,0]},condition:{ft:0,st:0,op:0,ct:[0,0,0],cf:[1,1,1]},blendColors:{c1:[1,0,0],c2:[0,0,1],b:.5},pairBlend:{w:1,it1:[0,0,0],it2:[0,0,0],ir1:[0,0,0],ir2:[0,0,0],ri:0},unitConversion:{i:0,cf:1},ikHandle:{pv:[0,1,0],twi:0,ikb:1},scaleConstraint:{o:[1,1,1]},aimConstraint:{a:[1,0,0],u:[0,1,0],wu:[0,1,0],wut:3,o:[0,0,0]},decomposeMatrix:{ro:0},composeMatrix:{it:[0,0,0],ir:[0,0,0],is:[1,1,1],ish:[0,0,0],iro:0,uer:1}},fd={unitConversion:/^o$/,multiplyDivide:/^o[xyz]?$/,plusMinusAverage:/^o(1|2[xy]?|3[xyz]?)$/,reverse:/^o[xyz]?$/,condition:/^oc[rgb]?$/,blendColors:/^op[rgb]?$/,pairBlend:/^o[tr][xyz]?$/,pointConstraint:/^ct[xyz]?$/,poleVectorConstraint:/^ct[xyz]?$/,orientConstraint:/^cr[xyz]?$/,parentConstraint:/^c[tr][xyz]?$/,scaleConstraint:/^cs[xyz]?$/,aimConstraint:/^cr[xyz]?$/,multMatrix:/^o$/,decomposeMatrix:/^o(t|r|s|sh)[xyz]?$|^oq[xyzw]?$/,composeMatrix:/^omat$/,inverseMatrix:/^omat$/},pd=/^([trs][xyz]?|opm)$/;function md(i,t){switch(i){case"pairBlend":return/^ir[12][xyz]?$/.test(t);case"orientConstraint":case"aimConstraint":return/^o[xyz]?$/.test(t);case"composeMatrix":return/^ir[xyz]?$/.test(t);case"parentConstraint":return/^tg\[\d+\]\.tor[xyz]?$/.test(t);case"ikHandle":return t==="twi";default:return!1}}function _s(i,t){return i==="blendColors"&&(t==="c1"||t==="c2"||t==="op")||i==="condition"&&(t==="ct"||t==="cf"||t==="oc")?Gl:i==="plusMinusAverage"&&/^(o2|i2\[\d+\])$/.test(t)?Wl:de}var Vo=new C,Ei=new C,Hl=new Ft,xd=new Te,gd=new ct;function Qn(i,t=new Ft){return i.decompose(Vo,t,Ei),t}function wi(i,t=new C){return t.setFromMatrixPosition(i)}function xs(i,t=0,e=new Ft){return e.setFromEuler(xd.set(i[0]*kn,i[1]*kn,i[2]*kn,ys[t]||"ZYX"))}function ar(i,t=new Ft){return t.setFromEuler(xd.set(i[0],i[1],i[2],"ZYX"))}function _d(i){let t=new Ft(0,0,0,0),e=i[0].q;for(let{q:n,w:s}of i){let r=n.dot(e)<0?-s:s;t.x+=n.x*r,t.y+=n.y*r,t.z+=n.z*r,t.w+=n.w*r}return t.normalize()}var Ho=class{constructor(t,e,n){this.clip=t,this.sceneNodes=e,this.staticLocal=n,this.graph=(t.raw.graph||[]).slice(),this.byId=new Map(this.graph.map(o=>[o.id,o])),this.dagGraph=new Map;for(let o of this.graph)o.dag>=0&&this.dagGraph.set(o.dag,o);this.ikJoint=new Map;for(let o of this.graph)if(o.ik)for(let a of o.ik.chain.slice(0,-1))this.ikJoint.set(a,o.id);this.drivers=new Set,this.directDrivers=new Set;let s=o=>{this.directDrivers.add(o);for(let a=o;a>=0&&!this.drivers.has(a);a=e[a].parent)this.drivers.add(a)};for(let o of this.graph){o.ik&&(s(o.dag),e[o.dag].parent>=0&&this.directDrivers.add(e[o.dag].parent));for(let a of Object.values(o.inputs||{})){let l=a.node!==void 0?this.byId.get(a.node):null;l&&l.dag>=0&&s(l.dag)}}this.moving=new Set;let r=new Set;for(let o of t.entries){let a=this.dagGraph.get(o.node),l=a&&a.inputs?Object.keys(a.inputs).filter(c=>pd.test(c)):[];(o.channels.length||this.ikJoint.has(o.node)||l.length)&&this.moving.add(o.node),(o.channels.some(c=>c.base==="s")||l.some(c=>c[0]==="s"))&&r.add(o.node)}for(let o of t.entries)(o.rest.isNode??-1)>=0&&r.has(o.rest.isNode)&&this.moving.add(o.node);this.matrices=new Map,this.problems=new Set,this.frame=0,this.poseOf=()=>null,this.reset()}get hasGraph(){return this.graph.length>0}reset(){this.cache={chan:new Map,local:new Map,world:new Map,plug:new Map,out:new Map,ik:new Map},this.busy=new Set}evaluate(t,e=()=>null,n=this.matrices){this.frame=t,this.poseOf=e,this.reset();for(let s of this.moving){let r=n.get(s)||new ct;r.copy(this.localFile(s)),n.set(s,r)}return n}guard(t,e,n){if(this.busy.has(t))return this.problems.add(`\u5FAA\u74B0: ${t}`),n();this.busy.add(t);try{return e()}finally{this.busy.delete(t)}}rest(t){let e=this.clip.byNode.get(t);return e?e.rest:null}parentWorld(t){let e=this.sceneNodes[t];return e.parent>=0&&e.inheritsTransform!==!1?this.world(e.parent):dd}chan(t,e="full"){let n=`${e}:${t}`,s=this.cache.chan.get(n);if(s)return s;let r=this.rest(t),o=r?{...r,t:r.t.slice(),r:r.r.slice(),s:r.s.slice()}:null;if(!o)return null;let a=this.guard(`chan ${n}`,()=>{let l=this.clip.byNode.get(t),c=new Set;for(let h of l.channels)e==="t"&&h.base!=="t"||(o[h.base][h.axis]=Bo(h.curve,this.frame),c.add(h.attr));let u=this.dagGraph.get(t);if(u&&u.inputs)for(let[h,d]of Object.entries(u.inputs)){if(h==="opm"&&e!=="t"){let p=this.source(d);p&&p.isMatrix4?o.opm=p.toArray():Array.isArray(p)&&p.length===16&&(o.opm=p.slice());continue}let f=h[0];if(!/^[trs][xyz]?$/.test(h)||e==="t"&&f!=="t"||c.has(h))continue;let g=this.source(d);if(g===void 0)continue;let _=f==="r"?yn:1;if(h.length===1){if(Array.isArray(g))for(let p=0;p<3;p++)c.has(f+de[p])||(o[f][p]=g[p]*_)}else typeof g=="number"&&(o[f][de.indexOf(h[1])]=g*_)}if(e==="full"&&this.ikJoint.has(t)){let h=this.solveIK(this.ikJoint.get(t));h&&h.has(t)&&(o.r=h.get(t))}return o},()=>o);return this.cache.chan.set(n,a),a}localFile(t){let e=this.cache.local.get(t);if(e)return e;let n=this.rest(t);if(!n||!this.moving.has(t))return this.staticLocal(t);let s=this.chan(t,"full"),r=null;n.joint&&(n.isScale||(n.isNode??-1)>=0)&&(r=n.isNode>=0&&this.rest(n.isNode)?this.chan(n.isNode,"full").s:n.isScale);let o=Si(s,r,new ct);return this.cache.local.set(t,o),o}world(t){let e=this.cache.world.get(t);if(e)return e;let n=this.guard(`world ${t}`,()=>{let s=this.localFile(t).clone(),r=this.poseOf(t);return r&&s.multiply(r),new ct().multiplyMatrices(this.parentWorld(t),s)},()=>{let s=this.staticLocal(t);return new ct().multiplyMatrices(this.parentWorld(t),s)});return this.cache.world.set(t,n),n}pivotPosition(t,e=new C){let n=(this.chan(t,"t")||{t:[0,0,0]}).t;return e.set(n[0],n[1],n[2]).applyMatrix4(this.parentWorld(t))}dagPlug(t,e){let n=this.rest(t),s=this.dagGraph.get(t),r=e.replace(/\[\d+\]$/,""),o=(a,l)=>l>=0?a[l]:a;if(/^[trs][xyz]?$/.test(r)){let a=r.length===2?de.indexOf(r[1]):-1,l=n?this.chan(t,r[0]==="t"?"t":"full"):null;return l?r[0]==="t"?o(l.t,a):r[0]==="r"?o(l.r.map(c=>c*kn),a):o(l.s,a):a>=0?r[0]==="s"?1:0:r[0]==="s"?[1,1,1]:[0,0,0]}switch(r){case"pm":case"parentMatrix":return this.parentWorld(t);case"pim":case"parentInverseMatrix":return this.parentWorld(t).clone().invert();case"wm":case"worldMatrix":return this.world(t);case"wim":case"worldInverseMatrix":return this.world(t).clone().invert();case"m":case"matrix":return this.localFile(t);case"rp":case"rpt":case"sp":case"spt":return n&&n[r]?n[r]:[0,0,0];case"jo":case"ra":return n&&n[r]?n[r].map(a=>a*kn):[0,0,0];case"ro":return n&&n.ro||0;case"opm":case"offsetParentMatrix":{let a=n?this.chan(t,"full"):null;return a&&a.opm?new ct().fromArray(a.opm):new ct}default:break}if(s){let a=this.plug(s.id,e);if(a!==void 0)return a}return 0}source(t){if(t.curve!==void 0){let n=this.clip.curves[t.curve];if(!n)return;let s=Bo(n,this.frame);return n.type==="TA"?s*kn:s}let e=this.byId.get(t.node);if(e)return e.dag>=0?this.dagPlug(e.dag,t.attr):this.plug(t.node,t.attr)}plug(t,e){let n=`${t}.${e}`;if(this.cache.plug.has(n))return this.cache.plug.get(n);let s=this.guard(`plug ${n}`,()=>this.plugUncached(t,e),()=>{});return this.cache.plug.set(n,s),s}plugUncached(t,e){let n=this.byId.get(t),s=n.inputs||{};if(s[e])return this.source(s[e]);let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&s[r[1]]&&_s(n.type,r[1]).includes(r[2])){let a=this.source(s[r[1]]);return Array.isArray(a)?a[_s(n.type,r[1]).indexOf(r[2])]:void 0}if(fd[n.type]&&fd[n.type].test(e)){let a=this.outputs(t);return a&&e in a?a[e]:void 0}let o=_s(n.type,e);if(o.some(a=>s[e+a])){let a=this.staticValue(n,e);return o.map((l,c)=>{let u=this.plug(t,e+l);return u!==void 0?u:Array.isArray(a)?a[c]:0})}return this.staticValue(n,e)}staticValue(t,e){let n=t.attrs||{},s=md(t.type,e)?kn:1,r=l=>Array.isArray(l)?l.map(c=>c*s):l*s;if(e in n)return r(n[e]);let o=/^(.*?)([xyzrgb])$/.exec(e);if(o&&Array.isArray(n[o[1]])){let l=_s(t.type,o[1]).indexOf(o[2]);if(l>=0)return n[o[1]][l]*(md(t.type,o[1])?kn:1)}let a=_s(t.type,e);if(a.some(l=>e+l in n)){let l=this.defaultValue(t.type,e);return a.map((c,u)=>(e+c in n?n[e+c]:Array.isArray(l)?l[u]:0)*s)}return this.defaultValue(t.type,e,s)}defaultValue(t,e,n=1){if(/^w\d+$/.test(e)||/\.tw$/.test(e))return 1;let s=or[t]&&or[t][e];if(s!==void 0)return Array.isArray(s)?s.map(o=>o*n):s*n;let r=/^(.*?)([xyzrgb])$/.exec(e);if(r&&or[t]&&Array.isArray(or[t][r[1]]))return or[t][r[1]][_s(t,r[1]).indexOf(r[2])]*n}mat(t,e){let n=this.plug(t,e);return n&&n.isMatrix4?n:Array.isArray(n)&&n.length===16?new ct().fromArray(n):new ct}indices(t,e){let n=[...Object.keys(t.inputs||{}),...Object.keys(t.attrs||{})];return[...new Set(n.map(s=>e.exec(s)).filter(Boolean).map(s=>+s[1]))].sort((s,r)=>s-r)}num(t,e,n=0){let s=this.plug(t,e);return typeof s=="number"&&Number.isFinite(s)?s:n}vec(t,e,n=[0,0,0]){let s=this.plug(t,e);return Array.isArray(s)?n.map((r,o)=>Number.isFinite(s[o])?s[o]:r):n.slice()}outputs(t){if(this.cache.out.has(t))return this.cache.out.get(t);let e=this.guard(`out ${t}`,()=>this.outputsUncached(t),()=>null);return this.cache.out.set(t,e),e}outputsUncached(t){let e=this.byId.get(t),n=null;switch(e.type){case"unitConversion":n={o:this.num(t,"i")*this.num(t,"cf",1)};break;case"multiplyDivide":n=this.multiplyDivide(t);break;case"plusMinusAverage":n=this.plusMinusAverage(t);break;case"reverse":n=ve("o",this.vec(t,"i").map(s=>1-s),de);break;case"condition":n=this.condition(t);break;case"blendColors":n=this.blendColors(t);break;case"pairBlend":n=this.pairBlend(t);break;case"pointConstraint":case"orientConstraint":case"parentConstraint":case"scaleConstraint":case"poleVectorConstraint":case"aimConstraint":n=this.constraint(e);break;case"multMatrix":{let s=new ct;for(let r of this.indices(e,/^i\[(\d+)\]$/))s.premultiply(this.mat(t,`i[${r}]`));n={o:s};break}case"decomposeMatrix":{let s=new C,r=new Ft,o=new C;this.mat(t,"imat").decompose(s,r,o);let a=new Te().setFromQuaternion(r,ys[Math.round(this.num(t,"ro",0))]||"ZYX");n={...ve("ot",s.toArray(),de),...ve("or",[a.x,a.y,a.z],de),...ve("os",o.toArray(),de),...ve("osh",[0,0,0],de),...ve("oq",[r.x,r.y,r.z,r.w],["x","y","z","w"])};break}case"composeMatrix":{let s=this.vec(t,"it"),r=this.vec(t,"ir"),o=this.vec(t,"is",[1,1,1]),a;if(this.num(t,"uer",1)>=.5)a=new Ft().setFromEuler(new Te(r[0],r[1],r[2],ys[Math.round(this.num(t,"iro",0))]||"ZYX"));else{let l=this.vec(t,"iq",[0,0,0,1]);a=new Ft(l[0],l[1],l[2],l[3]??1).normalize()}n={omat:new ct().compose(new C(...s),a,new C(...o))};break}case"inverseMatrix":n={omat:this.mat(t,"imat").clone().invert()};break;default:break}return n}multiplyDivide(t){let e=this.vec(t,"i1"),n=this.vec(t,"i2",[1,1,1]),s=Math.round(this.num(t,"op",1)),r=e.map((o,a)=>s===1?o*n[a]:s===2?Math.abs(n[a])<Se?o:o/n[a]:s===3?o**n[a]:o);return ve("o",r,de)}plusMinusAverage(t){let e=this.byId.get(t),n=Math.round(this.num(t,"op",1)),s=new Set([...Object.keys(e.inputs||{}),...Object.keys(e.attrs||{})]),r=f=>[...new Set([...s].map(g=>f.exec(g)).filter(Boolean).map(g=>+g[1]))].sort((g,_)=>g-_),o=f=>{if(!f.length)return 0;if(n===2)return f.slice(1).reduce((_,p)=>_-p,f[0]);let g=f.reduce((_,p)=>_+p,0);return n===3?g/f.length:n===0?f[0]:g},a=(f,g,_)=>{let p=`i${f}[${g}]`,m=this.plug(t,p);return _.map((y,x)=>{let M=this.plug(t,`${p}.i${f}${y}`);return typeof M=="number"?M:Array.isArray(m)?m[x]:0})},l=r(/^i1\[(\d+)\]$/).map(f=>this.num(t,`i1[${f}]`)),c=r(/^i2\[(\d+)\]/).map(f=>a(2,f,Wl)),u=r(/^i3\[(\d+)\]/).map(f=>a(3,f,de)),h=[0,1].map(f=>o(c.map(g=>g[f]))),d=[0,1,2].map(f=>o(u.map(g=>g[f])));return{o1:o(l),...ve("o2",h,Wl),...ve("o3",d,de)}}condition(t){let e=this.num(t,"ft"),n=this.num(t,"st"),s=Math.round(this.num(t,"op")),r=[e===n,e!==n,e>n,e>=n,e<n,e<=n][s]??!1;return ve("oc",r?this.vec(t,"ct",[0,0,0]):this.vec(t,"cf",[1,1,1]),Gl)}blendColors(t){let e=this.vec(t,"c1",[1,0,0]),n=this.vec(t,"c2",[0,0,1]),s=this.num(t,"b",.5);return ve("op",e.map((r,o)=>r*s+n[o]*(1-s)),Gl)}pairBlend(t){let e=this.num(t,"w",1),n=this.vec(t,"it1"),s=this.vec(t,"it2"),r=this.vec(t,"ir1"),o=this.vec(t,"ir2"),a=h=>Math.round(this.num(t,h,0)),l=(h,d,f)=>f===1?h:f===2?d:h*(1-e)+d*e,c=de.map((h,d)=>l(n[d],s[d],a(`t${h}m`))),u;if(Math.round(this.num(t,"ri",0))===1){let h=ar(r).slerp(ar(o,new Ft),e),d=new Te().setFromQuaternion(h,"ZYX");u=[d.x,d.y,d.z]}else u=de.map((h,d)=>l(r[d],o[d],a(`r${h}m`)));return{...ve("ot",c,de),...ve("or",u,de)}}constraint(t){let e=t.id,n=[];for(let d of t.targets||[]){let f=this.byId.get(d.node);if(!f||f.dag<0)continue;let g=this.num(e,`tg[${d.index}].tw`,1);g>0&&n.push({ni:f.dag,index:d.index,w:g})}let s=n.reduce((d,f)=>d+f.w,0);if(s<=Se)return null;let r=t.driven,o=r>=0?this.parentWorld(r):dd,a=o.clone().invert(),l=d=>{let f=this.rest(d),g=f&&f.rp?f.rp:[0,0,0];return new C(g[0],g[1],g[2]).applyMatrix4(this.world(d))},c=d=>{let f=new C;for(let g of n)f.addScaledVector(d(g),g.w/s);return f},u=d=>{let f=d.clone().applyMatrix4(a),g=t.type==="pointConstraint"?this.vec(e,"o"):[0,0,0],_=this.vec(e,"crp"),p=this.vec(e,"crt");return[f.x+g[0]-_[0]-p[0],f.y+g[1]-_[1]-p[1],f.z+g[2]-_[2]-p[2]]},h=d=>{let f=Qn(o).invert().multiply(d);return this.localEuler(r,f).map(g=>g*kn)};switch(t.type){case"pointConstraint":return ve("ct",u(c(d=>l(d.ni))),de);case"poleVectorConstraint":{let d=c(p=>l(p.ni)),f=t.pivot>=0?this.pivotPosition(t.pivot):new C,g=d.sub(f),_=new ct().extractRotation(a);return ve("ct",g.applyMatrix4(_).toArray(),de)}case"orientConstraint":{let d=this.vec(e,"o"),f=_d(n.map(g=>({q:Qn(this.world(g.ni)),w:g.w})));return ve("cr",h(f.multiply(ar(d))),de)}case"parentConstraint":{let d=n.map(_=>{let p=this.vec(e,`tg[${_.index}].tot`),m=this.vec(e,`tg[${_.index}].tor`);return{m:this.world(_.ni).clone().multiply(gd.makeTranslation(p[0],p[1],p[2])).multiply(gd.makeRotationFromQuaternion(ar(m,Hl))),w:_.w}}),f=new C;for(let{m:_,w:p}of d)f.addScaledVector(wi(_,Vo.clone()),p/s);let g=_d(d.map(({m:_,w:p})=>({q:Qn(_),w:p})));return{...ve("ct",u(f),de),...ve("cr",h(g),de)}}case"aimConstraint":{let d=this.rest(r)||{},f=r>=0?this.chan(r,"t").t:[0,0,0],g=(v,w)=>w?[v[0]+w[0],v[1]+w[1],v[2]+w[2]]:v,_=new C(...g(g(f,d.rp),d.rpt)).applyMatrix4(o),p=c(v=>l(v.ni)).sub(_);if(p.lengthSq()<Se)return null;p.normalize();let m=new C(...this.vec(e,"a",[1,0,0])).normalize(),y=new C(...this.vec(e,"u",[0,1,0])),x=Math.round(this.num(e,"wut",3)),M=new C(...this.vec(e,"wu",[0,1,0])),A=null;x===0?A=(this.clip.raw.upAxis||"y")==="z"?new C(0,0,1):new C(0,1,0):x===1?A=wi(this.mat(e,"wum")).sub(_):x===2?A=M.clone().applyMatrix4(new ct().extractRotation(this.mat(e,"wum"))):x===3&&(A=M);let b,S=y.clone().addScaledVector(m,-y.dot(m)),P=A?A.clone().addScaledVector(p,-A.dot(p)):null;if(!A||S.lengthSq()<Se||P.lengthSq()<Se)b=new Ft().setFromUnitVectors(m,p);else{let v=(w,O)=>new ct().makeBasis(w,O,w.clone().cross(O));S.normalize(),P.normalize(),b=new Ft().setFromRotationMatrix(v(p,P).multiply(v(m,S).transpose()))}return ve("cr",h(b.multiply(ar(this.vec(e,"o")))),de)}case"scaleConstraint":{let d=c(g=>(this.world(g.ni).decompose(Vo,Hl,Ei),Ei.clone()));o.decompose(Vo,Hl,Ei);let f=this.vec(e,"o",[1,1,1]);return ve("cs",[d.x/(Ei.x||1)*f[0],d.y/(Ei.y||1)*f[1],d.z/(Ei.z||1)*f[2]],de)}default:return null}}localEuler(t,e){let n=this.rest(t)||{joint:!1,ro:0},s=e.clone();n.joint&&n.jo&&(s=xs(n.jo,0).invert().multiply(s)),n.ra&&s.multiply(xs(n.ra,0).invert());let r=new Te().setFromQuaternion(s,ys[n.ro||0]||"ZYX");return[r.x*yn,r.y*yn,r.z*yn]}solveIK(t){if(this.cache.ik.has(t))return this.cache.ik.get(t);let e=this.guard(`ik ${t}`,()=>this.solveIKUncached(t),()=>null);return this.cache.ik.set(t,e),e}solveIKUncached(t){let e=this.byId.get(t);if(e.ik.chain.length===2)return this.solveOneBone(t);let[n,s,r]=e.ik.chain,o=e.ik.solver==="ikSCsolver";if(!this.rest(n)||!this.rest(s))return null;let a=this.parentWorld(n),l=this.chan(n,"fk"),c=this.chan(s,"fk"),u=Si(l,this.isScaleOf(n),new ct),h=Si(c,this.isScaleOf(s),new ct),d=(this.chan(r,"t")||{t:[0,0,0]}).t,f=new ct().multiplyMatrices(a,u),g=new ct().multiplyMatrices(f,h),_=wi(f),p=wi(g),m=new C(d[0],d[1],d[2]).applyMatrix4(g),y=p.distanceTo(_),x=m.distanceTo(p);if(y<Se||x<Se)return null;let M=new C().subVectors(p,_).cross(new C().subVectors(m,p)),A=this.dagGraph.get(s)&&this.dagGraph.get(s).attrs&&this.dagGraph.get(s).attrs.pa;M.lengthSq()<Se*y*x&&Array.isArray(A)&&(h=Si({...c,r:A},this.isScaleOf(s),new ct),g=new ct().multiplyMatrices(f,h),m=new C(d[0],d[1],d[2]).applyMatrix4(g),M=new C().subVectors(p,_).cross(new C().subVectors(m,p)));let b=e.dag,S=wi(this.world(b)),P=new C().subVectors(S,_),v=P.length();if(v<Se)return null;P.divideScalar(v);let w=o?[0,0,0]:this.vec(t,"pv",[0,1,0]),O=new ct().extractRotation(this.parentWorld(b)),G=new C(w[0],w[1],w[2]).applyMatrix4(O),et=G.clone().addScaledVector(P,-G.dot(P));et.lengthSq()<Se&&(et=new C().subVectors(p,_).addScaledVector(P,-new C().subVectors(p,_).dot(P))),et.lengthSq()<Se&&(et=new C(0,1,0).cross(P).lengthSq()>Se?new C(0,1,0).cross(P):new C(1,0,0).cross(P)),et.normalize();let I=o?0:this.num(t,"twi",0);Math.abs(I)>Se&&et.applyQuaternion(new Ft().setFromAxisAngle(P,I));let U=Math.min(Math.max(v,Math.abs(y-x)),y+x),N=Math.min(1,Math.max(-1,(y*y+U*U-x*x)/(2*y*U))),W=Math.sqrt(Math.max(0,1-N*N)),H=_.clone().addScaledVector(P,y*N).addScaledVector(et,y*W),z=_.clone().addScaledVector(P,U),J=new C().subVectors(p,_).normalize(),j=new C().subVectors(H,_).normalize(),Q=new C().subVectors(H,_).cross(new C().subVectors(z,H));Q.lengthSq()<Se&&(Q=et.clone().cross(P)),Q.normalize(),M.lengthSq()<Se?M=Q.clone():M.normalize();let F=(yt,Qt)=>new ct().makeBasis(yt,Qt,yt.clone().cross(Qt)),V=new Ft().setFromRotationMatrix(F(j,Q).multiply(F(J,M).transpose())),K=Qn(f),k=V.clone().multiply(K),tt=new C().subVectors(m,p).normalize().applyQuaternion(V),gt=new C().subVectors(z,H).normalize(),bt=Math.atan2(Q.dot(tt.clone().cross(gt)),tt.dot(gt)),Vt=new Ft().setFromAxisAngle(Q,bt).multiply(V).multiply(Qn(g)),X=Qn(a),fe=this.localEuler(n,X.clone().invert().multiply(k)),wt=this.localEuler(s,k.clone().invert().multiply(Vt)),Ut=this.num(t,"ikb",1);if(Ut<1-Se){let yt=(Qt,Ot,R)=>{let E=ys[(this.rest(R)||{}).ro||0],q=xs(Qt,(this.rest(R)||{}).ro||0).slerp(xs(Ot,(this.rest(R)||{}).ro||0),Math.max(0,Ut)),st=new Te().setFromQuaternion(q,E);return[st.x*yn,st.y*yn,st.z*yn]};fe=yt(l.r,fe,n),wt=yt(c.r,wt,s)}return new Map([[n,fe],[s,wt]])}solveOneBone(t){let e=this.byId.get(t),[n,s]=e.ik.chain;if(!this.rest(n))return null;let r=this.parentWorld(n),o=this.chan(n,"fk"),a=new ct().multiplyMatrices(r,Si(o,this.isScaleOf(n),new ct)),l=(this.chan(s,"t")||{t:[0,0,0]}).t,c=wi(a),u=new C(l[0],l[1],l[2]).applyMatrix4(a),h=wi(this.world(e.dag)),d=u.sub(c),f=h.sub(c);if(d.lengthSq()<Se||f.lengthSq()<Se)return null;let g=new Ft().setFromUnitVectors(d.normalize(),f.normalize()),_=this.localEuler(n,Qn(r).invert().multiply(g.multiply(Qn(a)))),p=this.num(t,"ikb",1);if(p<1-Se){let m=(this.rest(n)||{}).ro||0,y=new Te().setFromQuaternion(xs(o.r,m).slerp(xs(_,m),Math.max(0,p)),ys[m]);_=[y.x*yn,y.y*yn,y.z*yn]}return new Map([[n,_]])}isScaleOf(t){let e=this.rest(t);return!e||!e.joint?null:(e.isNode??-1)>=0&&this.rest(e.isNode)?this.chan(e.isNode,"fk").s:e.isScale||null}driversOf(t){let e=[],n=this.dagGraph.get(t);if(n&&n.inputs)for(let[s,r]of Object.entries(n.inputs)){if(!pd.test(s)||r.curve!==void 0)continue;let o=this.byId.get(r.node);o&&e.push(`${s} \u2190 ${o.name}\uFF08${o.type}\uFF09`)}if(this.ikJoint.has(t)){let s=this.byId.get(this.ikJoint.get(t));e.push(`r \u2190 ${s.name}\uFF08IK\uFF09`)}return e}};function ve(i,t,e){let n={[i]:t};return e.forEach((s,r)=>{n[i+s]=t[r]}),n}var Ze=i=>document.getElementById(i);var vs=i=>Number.isInteger(i)?String(i):i.toFixed(2),Go=class{constructor(t){if(this.app=t,this.clip=null,this.status="",this.keys=[],this.root=Ze("timeline"),!this.root)return;this.slider=Ze("tl-slider"),this.canvas=Ze("tl-keys");let e=(s,r,o)=>{let a=Ze(s);a&&a.addEventListener(r,o)};e("tl-play","click",()=>t.togglePlay()),e("tl-prev","click",()=>t.stepFrame(-1)),e("tl-next","click",()=>t.stepFrame(1)),e("tl-prev-key","click",()=>t.stepKey(-1)),e("tl-next-key","click",()=>t.stepKey(1)),e("tl-first","click",()=>t.goToEdge(-1)),e("tl-last","click",()=>t.goToEdge(1)),this.slider.addEventListener("input",()=>t.scrubTo(+this.slider.value)),e("tl-frame","change",s=>{let r=+s.target.value;Number.isFinite(r)?t.scrubTo(r):this.setFrame(t.frame)});let n=()=>t.setPlaybackRange(+Ze("tl-start").value,+Ze("tl-end").value);e("tl-start","change",n),e("tl-end","change",n);for(let s of["tl-frame","tl-start","tl-end"])e(s,"keydown",r=>{r.key==="Enter"&&r.target.blur()});new ResizeObserver(()=>this.drawKeys()).observe(this.slider)}setStatus(t){this.root&&(this.status=t||"",Ze("tl-status").textContent=this.status,this.updateVisibility())}setClip(t){if(this.root){this.clip=t,t&&(this.status="",Ze("tl-status").textContent="",this.setRange(t.start,t.end),Ze("tl-info").textContent=`${vs(t.fps)} fps`,Ze("tl-info").title=`\u6642\u9593\u5358\u4F4D: ${t.raw.timeUnit||"?"}\uFF08\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u306E\u7BC4\u56F2 ${vs(+t.raw.animStart)}\u301C${vs(+t.raw.animEnd)}\uFF09`,this.setFrame(t.current)),this.root.classList.toggle("loading",!t);for(let e of this.root.querySelectorAll("button, input"))e.disabled=!t;this.updateVisibility()}}updateVisibility(){let t=!!(this.clip||this.status);this.root.hidden=!t,document.getElementById("viewport").classList.toggle("has-timeline",t),t&&this.drawKeys()}setRange(t,e){this.slider.min=String(t),this.slider.max=String(e),Ze("tl-start").value=vs(t),Ze("tl-end").value=vs(e),this.drawKeys()}setFrame(t){if(!this.root)return;this.slider.value=String(t);let e=Ze("tl-frame");document.activeElement!==e&&(e.value=vs(t))}setPlaying(t){let e=Ze("tl-play");e&&(e.setAttribute("aria-pressed",t?"true":"false"),e.title=t?"\u505C\u6B62\uFF08Alt+V\uFF09":"\u518D\u751F\uFF08Alt+V\uFF09",e.setAttribute("aria-label",t?"\u505C\u6B62":"\u518D\u751F"),e.querySelector(".ic-play").style.display=t?"none":"",e.querySelector(".ic-pause").style.display=t?"":"none")}setKeys(t,e){this.keys=t||[],this.canvas&&(this.canvas.title=e||""),this.drawKeys()}drawKeys(){let t=this.canvas;if(!t||!this.clip||this.root.hidden)return;let e=t.clientWidth,n=t.clientHeight;if(!e||!n)return;let s=window.devicePixelRatio||1;(t.width!==Math.round(e*s)||t.height!==Math.round(n*s))&&(t.width=Math.round(e*s),t.height=Math.round(n*s));let r=t.getContext("2d");r.setTransform(s,0,0,s,0,0),r.clearRect(0,0,e,n);let o=this.clip.start,a=this.clip.end,l=Math.max(a-o,1e-9),c=h=>7+(h-o)/l*(e-2*7),u=[1,2,5,10,20,50,100,200,500,1e3].find(h=>(e-2*7)/(l/h)>=6)||1e3;r.fillStyle="rgba(142, 151, 161, 0.35)";for(let h=Math.ceil(o/u)*u;h<=a;h+=u)r.fillRect(Math.round(c(h)),n-4,1,4);r.fillStyle="#e5675b";for(let h of this.keys)h<o-1e-6||h>a+1e-6||r.fillRect(Math.round(c(h))-1,0,2,n)}};var oy="1.0.0",ay=Math.PI/180,yd={shading:"smooth",wire:!1,skin:!0,joints:!1,xray:!0,grid:!0,axes:"selected",jointSize:1,weightMode:"off",textures:!0,alpha:"material",alphaStyle:"cutout",poseSource:"bind",lighting:"standard",mapView:"combined",maps:{normal:!0,roughness:!1,metalness:!1,ao:!1,emissive:!1,opacity:!1},normalFlipY:!1,tool:"select",space:"local",gizmoSize:1},ly=["select","translate","rotate","scale"],zn=i=>i.toLocaleString("ja-JP"),Wo=new C,ti=new C,Xl=class{constructor(){this.settings={...yd},this.data=null,this.built=null,this.selected=-1,this.picked=null,this.pose=null,this.maps=new Lo,this.edit=null,this.history=new Fo(t=>this.applyPoseChanges(t)),this.history.onChange=t=>this.historyChanged(t),this.poseDirty=!1,this.gizmoDragging=!1,this.bridge=null,this.transfer=null,this.sceneRadius=50,this.clip=null,this.frame=0,this.playing=!1,this.sceneLoading=!1,this.pendingAnimation=null,this.ui=new No(this),this.timeline=new Go(this),this.ui.setHost(Oo()?"qt":"browser"),this.ui.syncSettings(this.settings);try{this.initRenderer()}catch(t){this.renderer=null,this.ui.setEmpty(!1),this.ui.showError(`WebGL \u3092\u521D\u671F\u5316\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
GPU \u30C9\u30E9\u30A4\u30D0\u3092\u66F4\u65B0\u3059\u308B\u304B\u3001\u74B0\u5883\u5909\u6570 QTWEBENGINE_CHROMIUM_FLAGS \u306B --ignore-gpu-blocklist \u3092\u6307\u5B9A\u3057\u3066\u8D77\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002

`+String(t&&t.message||t))}this.bindEvents(),nd(t=>{this.bridge=t,t.jsReady&&t.jsReady(),this.historyChanged(this.history),this.onWarningsChanged(this.ui.warnings||[])})}initRenderer(){let t=document.getElementById("canvas");this.canvas=t,this.renderer=new Fs({canvas:t,antialias:!0,alpha:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.setClearColor(0,0),this.scene=new so,this.camera=new Ge(35,1,.1,1e4),this.camera.position.set(28,21,28),this.scene.add(this.camera),this.scene.add(new fo(15002866,3880497,1.7));let e=new po(16777215,2);e.position.set(.4,.8,1),e.target.position.set(0,0,-1),this.camera.add(e,e.target),this.grid=null,this.updateGrid(new We(new C(-10,0,-10),new C(10,10,10))),this.controls=new bo(this.camera,t),this.controls.mouseButtons={LEFT:fn.ROTATE,MIDDLE:fn.PAN,RIGHT:fn.DOLLY},this.controls.screenSpacePanning=!0,this.controls.enableDamping=!1,this.controls.zoomSpeed=1.2,this.controls.addEventListener("change",()=>this.requestRender()),this.poseFrame=new oe,this.poseFrame.name="__poseFrame",this.poseFrame.matrixAutoUpdate=!1,this.poseProxy=new oe,this.poseProxy.name="__poseProxy",this.poseFrame.add(this.poseProxy),this.scene.add(this.poseFrame),this.gizmo=new To(this.camera,t),this.gizmo.setSpace("local"),this.gizmo.setSize(yd.gizmoSize),this.gizmo.addEventListener("change",()=>this.requestRender()),this.gizmo.addEventListener("dragging-changed",r=>{this.gizmoDragging=r.value,this.controls.enabled=!r.value,r.value?this.beginPoseEdit([this.selected],{translate:"\u79FB\u52D5",rotate:"\u56DE\u8EE2",scale:"\u30B9\u30B1\u30FC\u30EB"}[this.gizmo.mode]||"\u5909\u66F4"):(this.endPoseEdit(),this.syncGizmo())}),this.gizmo.addEventListener("objectChange",()=>this.onGizmoChange()),this.scene.add(this.gizmo),this.overlay=new Uo,this.scene.add(this.overlay.group);let n=new ee;n.setAttribute("position",new $t([0,0,0],3)),this.marker=new ao(n,new Vs({color:15903035,size:10,sizeAttenuation:!1,depthTest:!1,transparent:!0})),this.marker.renderOrder=20,this.marker.visible=!1,this.marker.frustumCulled=!1,this.scene.add(this.marker),this.raycaster=new os;let s=document.getElementById("viewport");new ResizeObserver(()=>this.resize()).observe(s),this.resize()}resize(){if(!this.renderer)return;let t=document.getElementById("viewport"),e=Math.max(1,t.clientWidth),n=Math.max(1,t.clientHeight);this.renderer.setSize(e,n,!1),this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.render()}requestRender(){this.renderPending||!this.renderer||(this.renderPending=!0,requestAnimationFrame(()=>{this.renderPending=!1,this.render()}))}render(){this.renderer&&this.renderer.render(this.scene,this.camera)}bindEvents(){if(this.canvas){let t=null;this.canvas.addEventListener("pointerdown",e=>{let n=!!(this.gizmo&&this.gizmo.object&&this.gizmo.axis!==null);t={x:e.clientX,y:e.clientY,b:e.button,onGizmo:n}}),this.canvas.addEventListener("pointerup",e=>{t&&!t.onGizmo&&!this.gizmoDragging&&t.b===0&&e.button===0&&Math.hypot(e.clientX-t.x,e.clientY-t.y)<5&&this.pick(e),t=null}),this.canvas.addEventListener("contextmenu",e=>e.preventDefault())}window.addEventListener("keydown",t=>{let e=t.target;if(e&&(e.tagName==="INPUT"||e.tagName==="SELECT"||e.tagName==="TEXTAREA"))return;let n=t.key.toLowerCase();if((t.ctrlKey||t.metaKey)&&!t.altKey){if(n==="h"&&!t.shiftKey)this.setNodeVisible(this.selected,!1);else if(n==="z"&&!t.shiftKey)this.undo();else if(n==="y"||n==="z"&&t.shiftKey)this.redo();else return;t.preventDefault();return}if(t.altKey&&!t.ctrlKey&&!t.metaKey&&this.hasTimeline){if(t.code==="KeyV")this.togglePlay();else if(t.code==="Comma")this.stepFrame(-1);else if(t.code==="Period")this.stepFrame(1);else return;t.preventDefault();return}if(t.ctrlKey||t.metaKey||t.altKey)return;if(this.hasTimeline&&(n===","||n==="."||n==="home"||n==="end")){n===","?this.stepKey(-1):n==="."?this.stepKey(1):this.goToEdge(n==="home"?-1:1),t.preventDefault();return}if(n==="h"){t.shiftKey?this.setNodeVisible(this.selected,!0):this.toggleNodeVisible(this.selected),t.preventDefault();return}if(n==="z"){t.shiftKey?this.redo():this.undo(),t.preventDefault();return}let s=(r,o)=>{this.setSetting(r,o),this.ui.syncSettings(this.settings)};if(n==="f")this.frameSelection();else if(n==="a")this.frameAll();else if(n==="escape")this.clearSelection();else if(n==="4")s("shading","none");else if(n==="5")s("shading","smooth"),s("textures",!1);else if(n==="6")s("shading","smooth"),s("textures",!0);else if(n==="j")s("joints",!this.settings.joints);else if(n==="q")s("tool","select");else if(n==="w")s("tool","translate");else if(n==="e")s("tool","rotate");else if(n==="r")s("tool","scale");else if(n==="+"||n==="="||n===";")s("gizmoSize",Math.min(4,this.settings.gizmoSize*1.25));else if(n==="-")s("gizmoSize",Math.max(.25,this.settings.gizmoSize/1.25));else return;t.preventDefault()}),Oo()||(document.addEventListener("dragover",t=>{t.preventDefault(),document.body.classList.add("drag-over")}),document.addEventListener("dragleave",t=>{t.relatedTarget||document.body.classList.remove("drag-over")}),document.addEventListener("drop",t=>{t.preventDefault(),document.body.classList.remove("drag-over");let e=t.dataTransfer.files&&t.dataTransfer.files[0];e&&this.loadFile(e)})),window.addEventListener("error",t=>this.ui.setMessage("\u30A8\u30E9\u30FC: "+t.message,8e3))}log(t,e){this.bridge&&this.bridge.log&&this.bridge.log(t,String(e))}loadFile(t){if(/\.(ma|mb)$/i.test(t.name)){this.ui.showError(`${t.name} \u306F\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u76F4\u63A5\u8AAD\u3081\u307E\u305B\u3093\u3002
python -m ma_viewer export \u3067JSON\u306B\u5909\u63DB\u3059\u308B\u304B\u3001Qt\u7248\u306E\u30D3\u30E5\u30FC\u30A2\uFF08python -m ma_viewer\uFF09\u3067\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002`);return}this.ui.showLoading(`${t.name} \u3092\u8AAD\u307F\u8FBC\u307F\u4E2D`);let e=new FileReader;e.onload=()=>{try{let n=JSON.parse(e.result);n.source&&!n.source.name&&(n.source.name=t.name),setTimeout(()=>this.loadScene(n),0)}catch(n){this.ui.hideLoading(),this.ui.showError(`${t.name} \u3092 JSON \u3068\u3057\u3066\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
${n.message}`)}},e.readAsText(t)}loadScene(t){if(this.sceneLoading=!1,!this.renderer)return!1;let e=performance.now();this.pause();try{Dl(t),this.clearScene();let n=performance.now(),s=Hu(t),r=performance.now()-n;this.scene.add(s.root),this.data=t,this.built=s;let o=[],a=performance.now(),l=x=>{let M=performance.now();o.push([x,M-a]),a=M};this.pose=new Co(s,t),this.edit=null,this.history.clear(),Ol(s,this.settings.poseSource),this.pose.reapplyAll(),s.root.updateMatrixWorld(!0),this.initVisibility(),l("\u59FF\u52E2");let c=Fl(s,!0);this.sceneRadius=Math.max(c.getSize(Wo).length()/2,.001),l("\u7BC4\u56F2"),this.overlay.build(s,t.nodes,this.sceneRadius),this.updateGrid(c),l("\u30B8\u30E7\u30A4\u30F3\u30C8"),this.ui.populate(t,s),this.updateVisibility(),l("\u4E00\u89A7"),this.applyAll(),l("\u8868\u793A\u8A2D\u5B9A");let u=(t.warnings||[]).slice();for(let x of s.meshes){if(!x.skin)continue;let M=x.skin.stats;if(M.overMax&&u.push(`${x.name}: 9 \u3064\u4EE5\u4E0A\u306E\u30A4\u30F3\u30D5\u30EB\u30A8\u30F3\u30B9\u3092\u6301\u3064\u9802\u70B9\u304C ${zn(M.overMax)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u8868\u793A\u306F\u4E0A\u4F4D 8 \u3064\uFF09\u3002`),M.unnormalized&&u.push(`${x.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 1 \u3067\u306A\u3044\u9802\u70B9\u304C ${zn(M.unnormalized)} \u500B\u3042\u308A\u307E\u3059\uFF08\u5909\u5F62\u6642\u306B\u5408\u8A08\u3067\u5272\u3063\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\uFF09\u3002`),M.zero){let A=x.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2";u.push(`${x.name}: \u30A6\u30A7\u30A4\u30C8\u306E\u5408\u8A08\u304C 0 \u306E\u9802\u70B9\u304C ${zn(M.zero)} \u500B\u3042\u308A\u307E\u3059\u3002${x.data.skin.cluster} \u306E\u300C\u30A6\u30A7\u30A4\u30C8\u306E\u5206\u914D\u300D\uFF08${A}\uFF09\u306B\u5408\u308F\u305B\u3066\u5272\u308A\u5F53\u3066\u3066\u8868\u793A\u3057\u3066\u3044\u307E\u3059\u3002`)}}this.ui.setWarnings(u);let h=t.source||{},d=h.name||(h.path?String(h.path).split(/[\\/]/).pop():"")||(h.kind==="maya"?"Maya \u30B7\u30FC\u30F3":"");this.sceneName=d,this.updateTitle(),this.ui.setFile(d||"\uFF08\u540D\u524D\u306A\u3057\uFF09");let f=s.meshes.reduce((x,M)=>x+M.triCount,0),g=s.meshes.reduce((x,M)=>x+M.vertexCount,0);this.ui.setStats(`\u30E1\u30C3\u30B7\u30E5 ${zn(s.meshes.length)} \u30FB \u9802\u70B9 ${zn(g)} \u30FB \u4E09\u89D2\u5F62 ${zn(f)} \u30FB \u30B8\u30E7\u30A4\u30F3\u30C8 ${zn(s.jointIndices.length)}`),this.ui.setEmpty(!1),this.ui.hideError(),this.ui.hideLoading(),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.frameAll(!0),this.maps.reset(t),this.requestMaps(),l("\u30DE\u30C6\u30EA\u30A2\u30EB");let _=performance.now();this.ui.setMessage(`\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08${Math.round(performance.now()-e)} ms\uFF09`),this.log("info",`scene loaded: ${s.meshes.length} meshes, ${s.jointIndices.length} joints`);let p=this.timing||{},m=n+r;requestAnimationFrame(()=>requestAnimationFrame(()=>{let x=M=>`${Math.round(M)} ms`;o.push(["\u6700\u521D\u306E\u63CF\u753B",performance.now()-_]),this.lastTiming={transfer:p.transfer||0,parse:p.parse||0,build:r,setup:performance.now()-m,setupParts:Object.fromEntries(o)},this.log("info",`\u8AAD\u307F\u8FBC\u307F\u306E\u5185\u8A33\uFF08\u30D3\u30E5\u30FC\u30A2\uFF09: \u53D7\u3051\u6E21\u3057 ${x(this.lastTiming.transfer)}\u30FBJSON \u306E\u89E3\u91C8 ${x(this.lastTiming.parse)}\u30FB\u30B7\u30FC\u30F3\u306E\u7D44\u307F\u7ACB\u3066 ${x(r)}\u30FB\u753B\u9762\u306E\u6E96\u5099\u3068\u6700\u521D\u306E\u63CF\u753B ${x(this.lastTiming.setup)}\uFF08${o.map(([M,A])=>`${M} ${x(A)}`).join("\u30FB")}\uFF09`),this.timing=null}));let y=this.pendingAnimation||t.animation;return this.pendingAnimation=null,y&&this.setAnimation(y),!0}catch(n){return this.ui.hideLoading(),this.ui.showError(`\u30B7\u30FC\u30F3\u3092\u8868\u793A\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+(n&&n.message||n)),this.log("error",n&&n.stack||n),!1}}clearScene(){this.textureToken=(this.textureToken||0)+1,this.maps&&this.maps.reset(null),this.built&&Xu(this.built),this.built=null,this.data=null,this.overlay.clear(),this.gizmo&&this.gizmo.detach(),this.pose=null,this.edit=null,this.history.clear(),this.selected=-1,this.picked=null,this.marker&&(this.marker.visible=!1),this.pause(),this.clip=null,this.rig=null,this.timeline.setClip(null)}clearAll(){this.pendingAnimation=null,this.clearScene(),this.timeline.setStatus(""),this.ui.populate({nodes:[],meshes:[]},{childrenOf:[],meshes:[]}),this.ui.setWarnings([]),this.ui.setTitle(""),this.ui.setFile("\u30D5\u30A1\u30A4\u30EB\u672A\u8AAD\u307F\u8FBC\u307F"),this.ui.setStats(""),this.ui.setEmpty(!0),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.ui.setLegend("off"),this.requestRender()}updateTitle(){let t=this.sceneName||"";this.built&&ds(this.built)&&(t+=this.settings.poseSource==="bind"?"\uFF08\u30D0\u30A4\u30F3\u30C9\u30DD\u30FC\u30BA\uFF09":"\uFF08\u30D5\u30A1\u30A4\u30EB\u306E\u5024\uFF09"),this.ui.setTitle(t)}updateGrid(t){this.grid&&(this.scene.remove(this.grid),this.grid.geometry.dispose(),this.grid.material.dispose());let e=Math.max(Math.abs(t.min.x),Math.abs(t.max.x),Math.abs(t.min.z),Math.abs(t.max.z),.001),n=cy(e*2.4);this.grid=new mo(n,20,2830132,6120814),this.grid.material.transparent=!0,this.grid.material.opacity=.6,this.grid.material.depthWrite=!1,this.grid.renderOrder=-1,this.grid.visible=!!this.settings.grid,this.scene.add(this.grid)}setSetting(t,e){if(!(t==="tool"&&!ly.includes(e))){if(this.settings[t]=e,t==="gizmoSize"&&this.gizmo&&this.gizmo.setSize(e),t==="space"&&this.gizmo&&this.gizmo.setSpace(e),t==="grid"&&this.grid&&(this.grid.visible=!!e),this.ui.syncSettings(this.settings),!this.built){this.requestRender();return}switch(t){case"tool":case"space":this.updateGizmo();break;case"shading":case"wire":this.applyShading(),this.applyWeights();break;case"skin":this.applyShading(),this.poseDirty=!0,this.updateMarker(),this.picked&&this.ui.showVertexInfo(this.vertexInfo());break;case"joints":this.overlay.setVisible(e);break;case"xray":this.overlay.setXray(e);break;case"axes":this.overlay.setAxesMode(e);break;case"jointSize":this.overlay.setSize(e);break;case"weightMode":this.applyWeights();break;case"textures":case"alpha":case"alphaStyle":case"lighting":case"mapView":case"maps":case"normalFlipY":this.requestMaps();break;case"poseSource":Ol(this.built,e),this.pose.reapplyAll(),this.afterPoseChange(),this.updateTitle();break;default:break}this.requestRender()}}applyAll(){let t=this.settings;this.overlay.setVisible(t.joints),this.overlay.setXray(t.xray),this.overlay.setAxesMode(t.axes),this.overlay.setSize(t.jointSize),this.applyShading(),this.applyWeights(),this.requestRender()}applyShading(){let t=this.settings;for(let e of this.built.meshes){let n=t.skin&&!!e.skinned,s=e.visible&&t.shading!=="none",r=e.visible&&(t.wire||t.shading==="none");e.staticMesh.visible=s&&!n,e.skinned&&(e.skinned.visible=s&&n),e.staticWire.visible=r&&!n,e.skinnedWire&&(e.skinnedWire.visible=r&&n);let o=t.shading==="none";e.wireMaterial.opacity=o?.95:.5,e.wireMaterial.color.set(o?13161178:1908772)}}applyWeights(){let t=this.settings.weightMode,e=t!=="off";for(let n of this.built.meshes){let s=e&&this.settings.shading==="none";if(n.wireMaterial.vertexColors!==s&&(n.wireMaterial.vertexColors=s,n.wireMaterial.needsUpdate=!0),s&&n.wireMaterial.color.set(16777215),!e)continue;let r=new Float32Array(n.vertexCount*3);if(!n.skin)Nu(r,.42,.43,.45);else if(t==="selected"){let o=this.selected>=0?n.data.skin.influences.indexOf(this.selected):-1;Uu(r,n.skin,o,n.vertexCount)}else Du(r,n.skin,n.data.skin.influences,n.vertexCount);Wu(n,r)}this.applyMaterials(),this.ui.setLegend(t,this.selected>=0&&this.data?this.data.nodes[this.selected].name:null)}applyMaterials(){if(!this.built)return;let t=this.settings,e=t.weightMode!=="off",n=t.mapView||"combined",s=t.lighting==="flat"||n!=="combined",r=t.shading==="flat",o=this.maps,a=t.textures&&!e,l=(u,h,d)=>{let f=u.maps[h];return a&&f?o.texture(f.key,td(h,f.channel,d)):null},c=(u,h)=>u.setRGB(h,h,h,me);for(let u of this.built.allMaterials){let h=u.userData,d=l(h,"baseColor",!1),f=h.maps.baseColor&&h.maps.baseColor.key,_=!!(d&&o.hasAlpha(f))&&t.alpha!=="none"&&(t.alpha==="all"||h.useAlpha),p=t.maps.opacity?l(h,"opacity",!1):null,m=!!(_||p),y=m&&t.alphaStyle==="cutout",x=m&&t.alphaStyle==="blend",M=y?.5:x?.01:0,A=S=>{e||d?S.set(16777215):t.textures&&h.isMaya?S.copy(h.baseColor):S.set(nr)};A(u.color),u.map=d,u.normalMap=t.maps.normal?l(h,"normal",!1):null,u.normalScale.set(1,t.normalFlipY?-1:1),u.roughnessMap=t.maps.roughness?l(h,"roughness",!1):null,u.roughness=u.roughnessMap?1:h.roughness??.78,u.metalnessMap=t.maps.metalness?l(h,"metalness",!1):null,u.metalness=u.metalnessMap?1:h.metalness??0,u.aoMap=t.maps.ao?l(h,"ao",!1):null,u.emissiveMap=t.maps.emissive?l(h,"emissive",!1):null,u.emissive.set(u.emissiveMap?16777215:0),u.alphaMap=p,u.vertexColors=e,u.flatShading=r,u.transparent=x,u.alphaTest=M;let b=h.unlit;b.vertexColors=e,b.alphaMap=null,n==="combined"||e?(A(b.color),b.map=e?null:d,b.transparent=x,b.alphaTest=e?0:M,b.alphaMap=e?null:p):(b.map=l(h,n,!0),b.transparent=!1,b.alphaTest=0,b.map?b.color.set(16777215):n==="baseColor"?A(b.color):n==="normal"?b.color.setRGB(.5,.5,1,me):n==="roughness"?c(b.color,h.roughness??.78):n==="metalness"?c(b.color,h.metalness??0):n==="emissive"?b.color.set(0):b.color.set(16777215));for(let S of[u,b]){let P=[S.map,S.normalMap,S.roughnessMap,S.metalnessMap,S.aoMap,S.emissiveMap,S.alphaMap].map(v=>v?1:0).join("")+[S.vertexColors,S.flatShading,S.transparent,S.alphaTest>0].join();S.userData.sig!==P&&(S.userData.sig=P,S.needsUpdate=!0)}}for(let u of this.built.meshes){let h=s?u.materials.map(f=>f.userData.unlit):u.materials,d=h.length>1?h:h[0];u.staticMesh.material=d,u.skinned&&(u.skinned.material=d)}this.requestRender()}requestMaps(){if(!this.built)return;let t=this.maps.neededKeys(this.built.allMaterials,this.settings),e=this.bridge&&this.bridge.readFileBase64?r=>new Promise((o,a)=>this.bridge.readFileBase64(r,l=>l?o(ju(l)):a(new Error("Python \u304B\u3089\u53D7\u3051\u53D6\u308C\u307E\u305B\u3093\u3067\u3057\u305F")))):null,n=[],s=this.maps.ensure(t,e,{forceBridge:!!this.forceBridgeTextures},(r,o)=>{this.applyMaterials(),r===o?(this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),n.length&&this.ui.addWarnings(n),this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3 ${o} \u679A\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F`),this.log("info",`textures loaded: ${o}`)):this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF08${r} / ${o}\uFF09`,0)},(r,o)=>n.push(`${o.info.node}: \u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\uFF08${o.resolved}\uFF09: ${o.message}`));s&&this.ui.setMessage(`\u30C6\u30AF\u30B9\u30C1\u30E3\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\uFF080 / ${s}\uFF09`,0),this.ui.populateMeshes(this.data,this.built,this.textureStatusList()),this.applyMaterials()}textureStatusList(){return(this.data&&this.data.textures||[]).map((t,e)=>this.maps.textureStatus(e))}setMapToggle(t,e){this.settings.maps={...this.settings.maps,[t]:e},this.setSetting("maps",this.settings.maps)}initVisibility(){this.hidden=new Set,this.data.nodes.forEach((t,e)=>{t.visible===!1&&this.hidden.add(e)});for(let t of this.built.meshes)t.selfVisible=t.data.visibleSelf!==void 0?t.data.visibleSelf!==!1:t.data.visible!==!1;this.computeVisibility()}computeVisibility(){let t=this.data.nodes,e=new Array(t.length).fill(!1);t.forEach((n,s)=>{e[s]=this.hidden.has(s)||n.parent>=0&&e[n.parent]}),this.hiddenEff=e;for(let n of this.built.meshes)n.visible=n.selfVisible&&!e[n.transform]}updateVisibility(){this.built&&(this.computeVisibility(),this.overlay.setHiddenNodes(this.hiddenEff),this.ui.updateVisibilityMarks(this.hidden,this.hiddenEff,this.built.meshes),this.picked&&!this.built.meshes[this.picked.mesh].visible&&(this.picked=null,this.marker.visible=!1,this.ui.showVertexInfo(null)),this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),this.poseDirty=!0,this.applyShading(),this.requestRender())}setNodeVisible(t,e){!this.built||t<0||(e?this.hidden.delete(t):this.hidden.add(t),this.updateVisibility(),this.ui.setMessage(`${e?"\u8868\u793A":"\u975E\u8868\u793A\u306B"}\u3057\u307E\u3057\u305F: ${this.data.nodes[t].name}`))}toggleNodeVisible(t){t>=0&&this.hidden&&this.setNodeVisible(t,this.hidden.has(t))}setMeshVisible(t,e){this.built&&(this.built.meshes[t].selfVisible=e,this.ui.setMeshChecked(t,e),this.updateVisibility())}setAnimation(t){if(this.sceneLoading||!this.built)return this.pendingAnimation=t,!0;let e;try{e=new zo(t);let a=e.nodes.find(l=>!(l>=0&&l<this.data.nodes.length));if(a!==void 0)throw new Error(`\u30CE\u30FC\u30C9\u756A\u53F7 ${a} \u304C\u30B7\u30FC\u30F3\u306B\u3042\u308A\u307E\u305B\u3093`)}catch(a){return this.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+(a&&a.message||a)),this.log("error",a&&a.stack||a),!1}this.pause(),this.clip=e,this.data.animation=t,this.rig=new Ho(e,this.data.nodes,a=>this.built.nodeObjects[a].userData.fileMatrix);let n=new Set;for(let a of e.nodes){n.add(a);for(let l of this.built.childrenOf[a])n.add(l)}this.animTouched=[...n].sort((a,l)=>a-l);for(let[a,l]of this.rig.evaluate(e.current,()=>null,new Map))this.built.nodeObjects[a].userData.savedMatrix.copy(l);let s=e.warnings.concat([...this.rig.problems].map(a=>`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3: \u30EA\u30B0\u306E\u8A55\u4FA1\u3092\u6253\u3061\u5207\u308A\u307E\u3057\u305F\uFF08${a}\uFF09\u3002`));s.length&&this.ui.setWarnings((this.ui.warnings||[]).concat(s));let r=new Set(this.built.meshes.map(a=>a.transform));this.overlay.setControllers([...this.rig.directDrivers].filter(a=>this.data.nodes[a].type!=="joint"&&!r.has(a)).sort((a,l)=>a-l)),this.hasTimeline||this.timeline.setStatus(""),this.timeline.setClip(this.hasTimeline?e:null),this.updateTimelineKeys(),this.applyFrame(e.current);let o=t.stats||{};return this.ui.setMessage(`\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u307F\u8FBC\u307F\u307E\u3057\u305F\uFF08\u30AB\u30FC\u30D6 ${zn(o.curves??e.curves.length)} \u672C\u30FB\u52D5\u304F\u30CE\u30FC\u30C9 ${zn(this.rig.moving.size)} \u500B\u30FB${e.start}\u301C${e.end} \u30D5\u30EC\u30FC\u30E0\uFF09`,6e3),this.log("info",`animation loaded: ${e.curves.length} curves, ${e.nodes.length} nodes`),!0}rigValues(t){let e=this.rig.rest(t)?this.rig.chan(t):null;return e?{t:e.t.slice(),r:e.r.slice(),s:e.s.slice()}:null}get hasTimeline(){return!!(this.clip&&this.clip.curves.length)}applyFrame(t,e=this.playing){if(!this.clip||!this.built)return;this.frame=t;let n=a=>this.pose&&this.pose.has(a)?Pl(this.pose.get(a),new ct):null,s=this.rig.evaluate(t,n),r=this.settings.poseSource,o=ds(this.built);for(let[a,l]of s){let c=this.built.nodeObjects[a].userData;c.fileMatrix.copy(l),c.baseMatrix.copy(Nl(c,r,o))}for(let a of this.animTouched)this.pose.apply(a);this.timeline.setFrame(t),this.rigBusy=!0;try{this.afterPoseChange(e)}finally{this.rigBusy=!1}}ensureAnimatedPose(){this.settings.poseSource==="bind"&&ds(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}scrubTo(t){this.hasTimeline&&(this.pause(),this.ensureAnimatedPose(),this.applyFrame(t))}stepFrame(t){this.hasTimeline&&this.scrubTo(this.clip.wrap(Math.round(this.frame)+t))}stepKey(t){if(!this.hasTimeline)return;let e=this.keyTimesForSelection(),n=1e-6,s=t>0?e.find(r=>r>this.frame+n):[...e].reverse().find(r=>r<this.frame-n);s!==void 0?this.scrubTo(s):this.ui.setMessage(t>0?"\u3053\u308C\u3088\u308A\u5F8C\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093":"\u3053\u308C\u3088\u308A\u524D\u306E\u30AD\u30FC\u306F\u3042\u308A\u307E\u305B\u3093")}goToEdge(t){this.hasTimeline&&this.scrubTo(t<0?this.clip.start:this.clip.end)}setPlaybackRange(t,e){if(this.clip){if(!(Number.isFinite(t)&&Number.isFinite(e))){this.timeline.setRange(this.clip.start,this.clip.end);return}e<t&&([t,e]=[e,t]),this.clip.start=t,this.clip.end=e,this.timeline.setRange(t,e),(this.frame<t||this.frame>e)&&this.scrubTo(Math.min(Math.max(this.frame,t),e))}}togglePlay(){this.playing?this.pause():this.play()}play(){if(!this.hasTimeline||this.playing)return;this.ensureAnimatedPose(),this.endPoseEdit();let t=this.frame>=this.clip.start&&this.frame<=this.clip.end?Math.round(this.frame):this.clip.start;this.playing=!0,this.timeline.setPlaying(!0);let e=performance.now(),n=s=>{if(!this.playing||!this.clip)return;let r=this.clip.wrap(t+Math.floor((s-e)/1e3*this.clip.fps));r!==this.frame&&this.applyFrame(r),this.playHandle=requestAnimationFrame(n)};this.playHandle=requestAnimationFrame(n)}pause(){this.playing&&(this.playing=!1,cancelAnimationFrame(this.playHandle),this.timeline.setPlaying(!1),this.built&&this.afterPoseChange())}keyTimesForSelection(){if(!this.clip)return[];let t=this.selected>=0?this.clip.keyTimes(this.selected):[];return t.length?t:this.clip.keyTimes()}updateTimelineKeys(){if(!this.clip)return;let t=this.selected>=0&&this.clip.keyTimes(this.selected).length;this.timeline.setKeys(this.keyTimesForSelection(),t?`${this.data.nodes[this.selected].name} \u306E\u30AD\u30FC`:"\u3059\u3079\u3066\u306E\u30AD\u30FC")}select(t,e={}){!this.built||t<0||t>=this.data.nodes.length||(this.selected=t,this.overlay.setSelected(t),this.ui.highlightNode(t,this.data.nodes),this.ui.showNodeInfo(this.nodeInfo(t)),this.ui.showPoseFor(t,this.pose.get(t)),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),e.notify&&this.bridge&&this.bridge.nodeSelected&&this.bridge.nodeSelected(this.data.nodes[t].path),this.requestRender())}selectMesh(t){this.built&&this.select(this.built.meshes[t].transform,{notify:!0})}selectByPath(t){if(!this.data)return!1;let e=this.data.nodes,n=e.findIndex(s=>s.path===t);if(n<0&&(n=e.findIndex(s=>s.path.endsWith("|"+t.replace(/^\|/,""))||s.name===t)),n<0){let s=this.data.meshes.findIndex(r=>r.path===t||r.name===t);s>=0&&(n=this.data.meshes[s].transform)}return n<0?!1:(this.select(n,{notify:!1}),!0)}clearSelection(){this.built&&(this.selected=-1,this.picked=null,this.marker.visible=!1,this.overlay.setSelected(-1),this.ui.highlightNode(-1,this.data.nodes),this.ui.showNodeInfo(null),this.ui.showVertexInfo(null),this.ui.showPoseFor(-1),this.updateGizmo(),this.settings.weightMode==="selected"&&this.applyWeights(),this.updateTimelineKeys(),this.requestRender())}nodeInfo(t){let e=this.data.nodes[t],n=this.built.nodeObjects[t],s=(this.built.influenceUsage.get(t)||[]).map(o=>{let a=this.built.meshes[o.mesh];return{meshName:a.name,count:a.skin.stats.affected[o.slot],total:a.vertexCount}}),r=this.built.meshes.filter(o=>o.transform===t).map(o=>({name:o.name,vertices:o.vertexCount,faces:o.data.counts.length,cluster:o.data.skin?o.data.skin.cluster:"",skin:o.skin?o.skin.stats:null,normalizeSetting:o.data.skin?o.data.skin.normalize??1:null,normalized:o.skin?o.skin.normalize:!1}));return{node:e,worldPos:Wo.setFromMatrixPosition(n.matrixWorld).toArray(),usage:s,meshes:r,posed:this.pose.has(t),hiddenSelf:!!(this.hidden&&this.hidden.has(t)),hiddenByParent:!!(this.hiddenEff&&this.hiddenEff[t]&&!(this.hidden&&this.hidden.has(t))),bindSource:e.bindSource||null,usingBind:this.settings.poseSource==="bind"&&!!e.bindMatrix,drivenBy:e.drivenBy||null,animChannels:this.clip?this.clip.channelsOf(t):[],rigDrivers:this.rig?this.rig.driversOf(t):[],animLoaded:!!this.clip,animValues:this.rig?this.rigValues(t):null,frame:this.frame}}pick(t){if(!this.built)return;let e=this.canvas.getBoundingClientRect(),n=new Rt((t.clientX-e.left)/e.width*2-1,-((t.clientY-e.top)/e.height)*2+1);if(this.raycaster.setFromCamera(n,this.camera),this.settings.joints){let h=this.overlay.pick(this.raycaster);if(h>=0){this.select(h,{notify:!0});return}}let s=this.settings.skin;if(this.poseDirty){for(let h of this.built.meshes)h.skinned&&(h.skinned.boundingSphere=null,h.skinned.boundingBox=null);this.poseDirty=!1}let r=[];for(let h of this.built.meshes)h.visible&&r.push(s&&h.skinned?h.skinned:h.staticMesh);let o=this.raycaster.intersectObjects(r,!1);if(!o.length){this.clearSelection();return}let a=o[0],l=this.built.meshes[a.object.userData.meshIndex],c=-1,u=1/0;for(let h of[a.face.a,a.face.b,a.face.c]){let d=ir(l,h,s,ti).distanceToSquared(a.point);d<u&&(u=d,c=Gu(l,h))}this.pickVertex(l.index,c)}pickVertex(t,e){this.picked={mesh:t,vertex:e},this.updateMarker(),this.ui.showVertexInfo(this.vertexInfo()),this.requestRender()}vertexInfo(){if(!this.picked||!this.built)return null;let t=this.built.meshes[this.picked.mesh],e=this.picked.vertex,n=this.settings.skin&&!!t.skinned,s=fs(t,e,n,ti).toArray(),r={meshName:t.name,vertex:e,worldPos:s,skinned:!!t.skin};if(!t.skin)return r;let o=this.data.nodes,a=Iu(t.skin,e).map(l=>{let c=t.data.skin.influences[l.slot];return{name:o[c].name,path:o[c].path,nodeIndex:c,weight:l.weight,effective:l.effective,assigned:!!l.assigned}});return{...r,weights:a,sum:a.reduce((l,c)=>l+c.weight,0),normalized:t.skin.normalize,assigned:a.some(l=>l.assigned),distribution:t.data.skin.weightDistribution===1?"\u8FD1\u508D":"\u8DDD\u96E2"}}updateMarker(){if(!this.picked||!this.built){this.marker&&(this.marker.visible=!1);return}let t=this.built.meshes[this.picked.mesh];fs(t,this.picked.vertex,this.settings.skin&&!!t.skinned,ti);let e=this.marker.geometry.attributes.position;e.setXYZ(0,ti.x,ti.y,ti.z),e.needsUpdate=!0,this.marker.visible=!0}setPoseForSelected(t){this.selected>=0&&this.setPose(this.selected,t)}setPose(t,e){this.pose&&(this.beforeDriverPose(t),this.pose.set(t,e),this.afterPoseChange())}resetPose(t){t<0||!this.pose||(this.endPoseEdit(),this.beginPoseEdit([t],"\u30CE\u30FC\u30C9\u3092\u623B\u3059"),this.pose.reset(t),this.endPoseEdit(),this.afterPoseChange(),this.ui.showPoseFor(t,hs()))}resetAllPoses(){this.pose&&(this.endPoseEdit(),this.beginPoseEdit([...this.pose.poses.keys()],"\u3059\u3079\u3066\u623B\u3059",!0),this.pose.resetAll(),this.endPoseEdit(),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,hs()))}snapshotPose(t){return this.pose&&this.pose.has(t)?this.pose.get(t):null}beginPoseEdit(t,e,n=!1){if(this.edit||!this.pose||(t=t.filter(r=>r>=0),!t.length))return;let s=!n&&t.length===1&&this.data?`\uFF08${this.data.nodes[t[0]].name}\uFF09`:"";this.edit={label:e+s,nodes:t,before:t.map(r=>[r,this.snapshotPose(r)])}}endPoseEdit(){let t=this.edit;if(!t)return;this.edit=null;let e=t.nodes.map(n=>[n,this.snapshotPose(n)]);id(t.before,e)||this.history.push({label:t.label,before:t.before,after:e})}undo(){this.endPoseEdit();let t=this.history.undo();return this.ui.setMessage(t?`\u5143\u306B\u623B\u3057\u307E\u3057\u305F: ${t.label}`:"\u5143\u306B\u623B\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}redo(){this.endPoseEdit();let t=this.history.redo();return this.ui.setMessage(t?`\u3084\u308A\u76F4\u3057\u307E\u3057\u305F: ${t.label}`:"\u3084\u308A\u76F4\u305B\u308B\u64CD\u4F5C\u306F\u3042\u308A\u307E\u305B\u3093"),!!t}applyPoseChanges(t){if(this.pose){for(let[e,n]of[...t].sort((s,r)=>s[0]-r[0]))this.pose.set(e,n||hs());t.length===1&&t[0][0]!==this.selected&&this.select(t[0][0],{notify:!1}),this.afterPoseChange(),this.selected>=0&&this.ui.showPoseFor(this.selected,this.pose.get(this.selected))}}onWarningsChanged(t){this.bridge&&this.bridge.warningsChanged&&this.bridge.warningsChanged(JSON.stringify(t))}showWarnings(){this.bridge&&this.bridge.showWarnings?this.bridge.showWarnings():this.ui.openWarningDialog()}historyChanged(t){this.ui.setHistoryState(t),this.bridge&&this.bridge.historyChanged&&this.bridge.historyChanged(t.canUndo,t.canRedo,t.undoLabel,t.redoLabel)}afterPoseChange(t=!1){if(this.rig&&this.rig.hasGraph&&!this.rigBusy){this.applyFrame(this.frame,t);return}this.built.root.updateMatrixWorld(!0),this.overlay.update(),this.poseDirty=!0,this.updateMarker(),!t&&this.picked&&this.ui.showVertexInfo(this.vertexInfo()),!t&&this.selected>=0&&this.ui.showNodeInfo(this.nodeInfo(this.selected)),this.gizmoDragging||this.syncGizmo(),this.requestRender()}beforeDriverPose(t){this.rig&&this.rig.drivers.has(t)&&this.settings.poseSource==="bind"&&ds(this.built)&&(this.setSetting("poseSource","file"),this.ui.setMessage("\u30B3\u30F3\u30C8\u30ED\u30FC\u30E9\u30FC\u306E\u52D5\u304D\u3092\u78BA\u8A8D\u3059\u308B\u305F\u3081\u3001\u59FF\u52E2\u306E\u57FA\u6E96\u3092\u300C\u30D5\u30A1\u30A4\u30EB\u306E\u5024\u300D\u306B\u5207\u308A\u66FF\u3048\u307E\u3057\u305F",6e3))}updateGizmo(){if(!this.gizmo)return;let t=this.settings.tool;!this.built||this.selected<0||t==="select"?this.gizmo.detach():(this.syncGizmo(!0),this.gizmo.setMode(t),this.gizmo.setSpace(this.settings.space),this.gizmo.object!==this.poseProxy&&this.gizmo.attach(this.poseProxy)),this.requestRender()}syncGizmo(t=!1){if(!this.gizmo||this.selected<0||!this.pose||!t&&!this.gizmo.object)return;this.built.root.updateMatrixWorld(!0),this.pose.frameMatrix(this.selected,this.poseFrame.matrix);let e=this.pose.get(this.selected);this.poseProxy.position.fromArray(e.t),Rl(e,this.poseProxy.quaternion),this.poseProxy.scale.fromArray(e.s),this.poseFrame.updateMatrixWorld(!0)}onGizmoChange(){if(this.selected<0||!this.pose)return;let t=this.poseProxy,e=Eu(t.position,t.quaternion,t.scale);t.scale.fromArray(e.s),this.beforeDriverPose(this.selected),this.pose.set(this.selected,e),this.afterPoseChange(),this.ui.showPoseFor(this.selected,e)}frameAll(t=!1){if(!this.built||!this.renderer)return;let e=Fl(this.built,this.settings.skin);this.fit(e.getCenter(new C),Math.max(e.getSize(Wo).length()/2,.001),t)}frameSelection(){if(!this.built)return;if(this.picked){let s=this.built.meshes[this.picked.mesh],r=fs(s,this.picked.vertex,this.settings.skin&&!!s.skinned,new C);this.fit(r,this.sceneRadius*.12);return}if(this.selected<0){this.frameAll();return}let t=new Set([this.selected]);this.data.nodes.forEach((s,r)=>{t.has(s.parent)&&t.add(r)});let e=new We;for(let s of this.built.meshes){if(!t.has(s.transform))continue;let r=Math.max(1,Math.floor(s.vertexCount/5e3));for(let o=0;o<s.vertexCount;o+=r)e.expandByPoint(fs(s,o,this.settings.skin,ti))}for(let s of t)e.expandByPoint(ti.setFromMatrixPosition(this.built.nodeObjects[s].matrixWorld));let n=Math.max(e.getSize(Wo).length()/2,this.overlay.radius()*12,this.sceneRadius*.05);this.fit(e.getCenter(new C),n)}fit(t,e,n=!1){let s=this.camera,r=n?new C(1,.75,1):s.position.clone().sub(this.controls.target);r.lengthSq()<1e-12&&r.set(1,.75,1),r.normalize();let o=e/Math.sin(s.fov*ay/2)*1.05;this.controls.target.copy(t),s.position.copy(t).addScaledVector(r,o),s.near=Math.max(o/2e3,1e-4),s.far=o*50+e*10,s.updateProjectionMatrix(),this.controls.update(),this.requestRender()}stats(){return this.built?{loaded:!0,meshes:this.built.meshes.length,vertices:this.built.meshes.reduce((t,e)=>t+e.vertexCount,0),triangles:this.built.meshes.reduce((t,e)=>t+e.triCount,0),joints:this.built.jointIndices.length,selected:this.selected>=0?this.data.nodes[this.selected].path:null,posedNodes:this.pose?this.pose.size:0,textures:this.textureStatusList().map((t,e)=>({node:this.data.textures[e].node,status:t.status,via:t.via||null,hasAlpha:!!t.hasAlpha,size:t.width?[t.width,t.height]:null,tiles:t.tiles||0})),gizmoAttached:!!(this.gizmo&&this.gizmo.object),timing:this.lastTiming||null,settings:{...this.settings},webgl:!!this.renderer,animation:this.clip?{frame:this.frame,playing:this.playing,start:this.clip.start,end:this.clip.end,fps:this.clip.fps,curves:this.clip.curves.length,nodes:this.rig?this.rig.moving.size:this.clip.nodes.length,graphNodes:this.rig?this.rig.graph.length:0,rigProblems:this.rig?[...this.rig.problems]:[]}:null}:{loaded:!1}}};function cy(i){let t=10**Math.floor(Math.log10(i));for(let e of[1,2,5,10])if(e*t>=i)return e*t;return 10*t}var Ct=new Xl;window.mayaViewer={version:oy,loadScene(i){try{let t=performance.now(),e=typeof i=="string"?JSON.parse(i):i;return Ct.timing={...Ct.timing||{},parse:typeof i=="string"?performance.now()-t:0},Ct.loadScene(e)}catch(t){return Ct.sceneLoading=!1,Ct.ui.hideLoading(),Ct.ui.showError(`\u30C7\u30FC\u30BF\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002
`+t.message),!1}},beginTransfer(i){return Ct.transfer=[],Ct.transferStart=performance.now(),Ct.ui.showLoading(i||"\u30C7\u30FC\u30BF\u3092\u53D7\u3051\u53D6\u308A\u4E2D"),!0},appendChunk(i){return Ct.transfer&&Ct.transfer.push(i),!0},endTransfer(){let i=Ct.transfer?Ct.transfer.join(""):"";return Ct.transfer=null,Ct.sceneLoading=!0,Ct.timing={transfer:performance.now()-(Ct.transferStart||performance.now())},Ct.ui.showLoading("\u30B7\u30FC\u30F3\u3092\u7D44\u307F\u7ACB\u3066\u4E2D"),setTimeout(()=>this.loadScene(i),16),i.length},beginAnimationTransfer(){return Ct.transfer=[],!0},endAnimationTransfer(){let i=Ct.transfer?Ct.transfer.join(""):"";Ct.transfer=null;try{return Ct.setAnimation(JSON.parse(i))}catch(t){return Ct.timeline.setStatus("\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u3092\u8AAD\u3081\u307E\u305B\u3093\u3067\u3057\u305F: "+t.message),!1}},setAnimation(i){return Ct.setAnimation(typeof i=="string"?JSON.parse(i):i)},setAnimationStatus(i){return Ct.timeline.setStatus(Ct.clip&&!Ct.sceneLoading?"":i),!0},setFrame(i){return Ct.scrubTo(+i),Ct.frame},play(){Ct.play()},pause(){Ct.pause()},showLoading(i,t){Ct.ui.setEmpty(!1),Ct.ui.showLoading(i,t)},hideLoading(){Ct.ui.hideLoading(),Ct.built||Ct.ui.setEmpty(!0)},showError(i){Ct.ui.hideLoading(),Ct.ui.showError(i)},setMessage(i){Ct.ui.setMessage(i)},selectByPath(i){return Ct.selectByPath(i)},clear(){return Ct.clearAll(),!0},getStats(){return Ct.stats()},getTextureState(){return Ct.stats().textures},frameAll(){Ct.frameAll()},undo(){return Ct.undo()},redo(){return Ct.redo()},getWarnings(){return(Ct.ui.warnings||[]).slice()},showWarnings(){Ct.showWarnings()},getHistory(){let i=Ct.history;return{canUndo:i.canUndo,canRedo:i.canRedo,undo:i.undoStack.map(t=>t.label),redo:i.redoStack.map(t=>t.label)}},debug:{get app(){return Ct},checkSkinning(i=0,t={}){return od(Ct,i,t)}}};})();
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2023 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
