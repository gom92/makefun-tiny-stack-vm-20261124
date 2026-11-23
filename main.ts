// Tiny stack VM: a complete interpreter for the tiny stack VM ISA
// (32-bit wrapping ints, 256-value stack, 64-deep calls, 256 words of
// memory, all 10 traps). Plain JS, no deps, deterministic.
import{readdirSync as R,readFileSync as F,mkdirSync as K,writeFileSync as W}from"node:fs";
function run(p,I){
let D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536),s=0,c=0,t=0,u=0,l=0,g=0,n=p.length,E=x=>({o:O.slice(0,l),c:x});
for(;;){
if(s==1e6)return E(10);
if(c<0||c>=n)return E(9);
let o=p[c];s++;
if(o==0)return E(0);
else if(o==1){if(c+1>=n)return E(9);if(t>255)return E(3);D[t++]=(p[c+1]<<24)>>24;c+=2;}
else if(o==2){if(c+4>=n)return E(9);if(t>255)return E(3);D[t++]=p[c+1]|p[c+2]<<8|p[c+3]<<16|p[c+4]<<24;c+=5;}
else if(o==3){if(t<1)return E(2);t--;c++;}
else if(o==4){if(t<1)return E(2);if(t>255)return E(3);D[t]=D[t-1];t++;c++;}
else if(o==5){if(t<2)return E(2);let x=D[t-1];D[t-1]=D[t-2];D[t-2]=x;c++;}
else if(o==6){if(t<2)return E(2);if(t>255)return E(3);D[t]=D[t-2];t++;c++;}
else if(o==7){if(t<3)return E(2);let x=D[t-3];D[t-3]=D[t-2];D[t-2]=D[t-1];D[t-1]=x;c++;}
else if(o==23){if(t<1)return E(2);D[t-1]=-D[t-1];c++;}
else if(o==27){if(t<1)return E(2);D[t-1]=~D[t-1];c++;}
else if(o>15&&o<35&&o!=31){
if(t<2)return E(2);
let b=D[t-1],a=D[t-2],r;
if(o==16)r=a+b;else if(o==17)r=a-b;else if(o==18)r=Math.imul(a,b);
else if(o==19){if(!b)return E(4);r=a/b;}
else if(o==20){if(!b)return E(4);r=a%b;}
else if(o==21){if(!b)return E(4);r=Math.floor((a>>>0)/(b>>>0));}
else if(o==22){if(!b)return E(4);r=(a>>>0)%(b>>>0);}
else if(o==24)r=a&b;else if(o==25)r=a|b;else if(o==26)r=a^b;
else if(o==28)r=a<<(b&31);else if(o==29)r=a>>(b&31);else if(o==30)r=a>>>(b&31);
else if(o==32)r=a==b?1:0;else if(o==33)r=a<b?1:0;else r=(a>>>0)<(b>>>0)?1:0;
D[t-2]=r;t--;c++;}
else if(o>47&&o<52){
if(c+2>=n)return E(9);
if(o==51){if(u==64)return E(7);C[u++]=c+3;c=p[c+1]|p[c+2]<<8;}
else{let v=(p[c+1]|p[c+2]<<8)<<16>>16;
if(o==48)c+=3+v;
else{if(t<1)return E(2);let x=D[--t];c+=3;if((o==49)==(x==0))c+=v;}}}
else if(o==52){if(!u)return E(8);c=C[--u];}
else if(o==64){if(t<1)return E(2);let a=D[t-1];if(a<0||a>255)return E(6);D[t-1]=M[a];c++;}
else if(o==65){if(t<2)return E(2);let a=D[t-1],v=D[t-2];if(a<0||a>255)return E(6);t-=2;M[a]=v;c++;}
else if(o==80){if(t<1)return E(2);let y=String(D[t-1]);if(l+y.length>65536)return E(11);t--;for(let j=0;j<y.length;j++)O[l++]=y.charCodeAt(j);c++;}
else if(o==81){if(t<1)return E(2);if(l>65535)return E(11);O[l++]=D[--t]&255;c++;}
else if(o==82){if(t>255)return E(3);D[t++]=g<I.length?I[g++]:-1;c++;}
else if(o==83){if(t<1)return E(2);return E(D[--t]&255);}
else return E(5);
}
}
let I=process.env.MAKEFUN_INPUT_DIR||"/input",O=process.env.MAKEFUN_OUTPUT_DIR||"/output";
for(let d of R(I).sort()){let r=run(F(I+"/"+d+"/program.bin"),F(I+"/"+d+"/input.bin"));K(O+"/"+d,{recursive:true});W(O+"/"+d+"/stdout.bin",r.o);W(O+"/"+d+"/exit.txt",r.c+"\n");}
