'use strict';
// Thirty original drawings per fighter. Combat advances on the host simulation.
const motionSheets=Array.from({length:8},()=>new Image());
function loadMotionSheet(id){const image=motionSheets[id];if(image&&!image._requested){image._requested=true;image.src=`assets/animation/${id}.webp`}}
function trimMotionSheets(ids){motionSheets.forEach((image,id)=>{if(!ids.includes(id)&&image._requested){image.removeAttribute('src');image._requested=false}})}
loadMotionSheet(0);loadMotionSheet(1);
const fallbackFighter=fighter;
function drawMotionCell(c,id,frame,x,y,scale=1,dir=1){
 const sheet=motionSheets[id];if(!sheet?.complete||!sheet.naturalWidth)return false;
 const unit=166/220*scale;c.save();c.translate(Math.round(x),Math.round(y));c.scale(dir,1);c.imageSmoothingEnabled=false;
 c.drawImage(sheet,(frame%6)*512,Math.floor(frame/6)*256,512,256,-160*unit,-245*unit,512*unit,256*unit);c.restore();return true;
}
fighter=function(c,id,x,y,scale=1,dir=1,pose=0,t=0){const frame=pose===1?14:pose===2?21:pose===3?29:Math.floor(t*7)%6;if(!drawMotionCell(c,id,frame,x,y,scale,dir))fallbackFighter(c,id,x,y,scale,dir,pose,t)};
renderMobileFighter=function(c,p){
 const clock=p.animClock||0,air=p.y<FLOOR-1;let frame=Math.floor(clock*7)%6;
 if(p.attack&&p.attack.t<p.attack.duration){const kick=p.attack.type==='kick'||p.attack.type==='p1'&&[3,6,7].includes(p.id);frame=(kick?18:12)+Math.min(5,Math.floor(p.attack.t/p.attack.duration*6))}
 else if(p.state==='defeat')frame=(p.defeatTime||0)>.35?27:28;else if(p.guardStun>0||p.guard)frame=p.crouch?24:29;else if(p.stun>0)frame=28;else if(air)frame=p.vy<0?25:26;else if(p.landTick>0)frame=27;
 else if(Math.abs(p.vx||0)>30){let n=Math.floor(clock*11)%6;frame=6+((p.vx*p.dir<0)?5-n:n)}
 c.save();c.fillStyle='#05091570';c.beginPath();c.ellipse(p.x,FLOOR+5,Math.max(17,45-(FLOOR-p.y)*.12),6,0,0,7);c.fill();
 if(p.shield>0){c.strokeStyle='#8effd2';c.lineWidth=2;c.globalAlpha=.5+.2*Math.sin(clock*16);c.beginPath();c.ellipse(p.x,p.y-95,60,112,0,0,7);c.stroke();c.globalAlpha=1}
 if(p.attack?.type==='ult'&&p.attack.t<.5){glow(c,p.x,p.y-85,110,'#cbb3ff77');for(let i=0;i<8;i++){let a=clock*10+i*.8;line(c,[[p.x+Math.cos(a)*65,p.y-80+Math.sin(a)*80],[p.x+Math.cos(a)*88,p.y-80+Math.sin(a)*105]],'#e4cbff88',3)}}
 if(!drawMotionCell(c,p.id,frame,p.x,p.y,1.35,p.dir))fallbackFighter(c,p.id,p.x,p.y,1.35,p.dir,p.pose,clock);c.restore();
};
const baseObject=object;
object=function(c,id,k,t){if(k===2&&id===2){path(c,[[-25,-21],[25,-21],[25,20],[-25,20]],'#93603d');for(let i=-1;i<2;i++)line(c,[[-23,i*11],[23,i*11]],'#d5a469',4);return}
 if((id===6&&k===1)||(id===3&&k===1)){c.fillStyle='#374457';c.beginPath();c.arc(0,0,23,0,7);c.fill();c.strokeStyle='#c4cbd2';c.lineWidth=4;c.stroke();rect(c,17,-4,35,8,'#95714a');return}
 if(id===5&&k===1){for(let i=0;i<3;i++){c.strokeStyle='#ffe7a3';c.lineWidth=3;c.beginPath();c.arc(-15,0,16+i*11,-1.2,1.2);c.stroke()}return}
 if(id===7&&k===2){c.fillStyle='#181b33';c.beginPath();c.ellipse(0,0,32,8,0,0,7);c.fill();line(c,[[-18,-2],[9,-5]],'#9370c5',3);return}baseObject(c,id,k,t)};
let lobbyFrame=0;setInterval(()=>{if(!playing&&document.visibilityState==='visible'){lobbyFrame++;document.querySelectorAll('.fighter canvas').forEach((el,id)=>{const c=el.getContext('2d');c.clearRect(0,0,100,130);rect(c,0,0,100,130,'#1b263a');fighter(c,id,50,128,.72,1,0,lobbyFrame/8)});renderPoster()}},125);
motionSheets.forEach(image=>image.onload=()=>{redrawArt();const loaded=motionSheets.filter(i=>i.complete&&i.naturalWidth).length;loading.textContent='DREAM MATCH · 8 LUCHADORES'});
