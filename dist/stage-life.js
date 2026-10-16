'use strict';
// Original ambient vector animation; visual time never changes the simulation.
const quietScene=window.matchMedia('(prefers-reduced-motion: reduce)');
const staticScene=background;
function neighbour(c,x,y,t,cart=false){
 c.save();c.translate(x,y);c.globalAlpha=.62;const stride=Math.sin(t*3.5),skin='#977e69';
 c.fillStyle='#121b1c55';c.beginPath();c.ellipse(0,2,cart?37:12,3,0,0,7);c.fill();
 line(c,[[0,-28],[-5-stride*5,-13],[-9-stride*4,0]],'#303733',5);line(c,[[1,-28],[6+stride*5,-14],[9+stride*4,0]],'#29312d',5);
 path(c,[[-7,-48],[7,-48],[8,-26],[-6,-26]],cart?'#6b6758':'#555d61',null);c.fillStyle=skin;c.beginPath();c.ellipse(0,-55,5,7,0,0,7);c.fill();
 line(c,[[-5,-45],[-9,-34],[cart?20:-12,-30]],skin,3);line(c,[[5,-44],[10,-35],[cart?23:12,-28]],skin,3);
 if(cart){line(c,[[19,-30],[27,-10],[63,-10]],'#51554a',2);for(const xx of [34,61]){c.fillStyle='#1b2525';c.beginPath();c.arc(xx,-3,6,0,7);c.fill();c.strokeStyle='#6b7267';c.lineWidth=1;c.stroke()}
 path(c,[[29,-31],[62,-28],[66,-10],[28,-10]],'#726b51','#343d35',1);for(let i=0;i<5;i++){const dx=30+i*6;line(c,[[dx,-27-i%2*5],[dx+3,-11]],'#a5926c',2)}path(c,[[32,-29],[36,-42],[56,-39],[60,-28]],'#8a7e5e','#59563f',1)}c.restore();
}
function streetDog(c,x,y,t){c.save();c.translate(x,y);c.globalAlpha=.65;const step=Math.sin(t*6);c.fillStyle='#1b211e44';c.beginPath();c.ellipse(0,2,23,3,0,0,7);c.fill();for(const [dx,phase]of [[-13,1],[9,-1]]){line(c,[[dx,-12],[dx+step*phase*4,-5],[dx-step*phase*4,0]],'#5b5346',3)}c.fillStyle='#81705a';c.beginPath();c.ellipse(0,-15,18,8,0,0,7);c.fill();path(c,[[10,-18],[15,-31],[23,-31],[28,-22],[21,-19]],'#7a6854',null);path(c,[[15,-30],[12,-36],[19,-31]],'#554e42',null);line(c,[[-15,-17],[-24,-23+Math.sin(t*4)*3]],'#7a6854',3);c.restore()}
function passingTrain(c,t){const cycle=t%58;if(cycle>20)return;const x=1100-cycle*140;c.save();c.globalAlpha=.55;for(let i=0;i<4;i++){const xx=x+i*205;rect(c,xx,230,195,58,'#637976');rect(c,xx,261,195,17,'#5c6a62');rect(c,xx,272,195,6,'#434f49');for(let j=0;j<5;j++){rect(c,xx+11+j*35,238,24,17,'#233e44');rect(c,xx+12+j*35,239,23,3,'#879c9270')}rect(c,xx+156,235,24,40,'#445b59');line(c,[[xx+169,235],[xx+169,275]],'#a3afa355',1);for(let j=0;j<2;j++){c.fillStyle='#273333';c.beginPath();c.arc(xx+35+j*122,286,8,0,7);c.fill()}}c.restore()}
background=function(c,s,w=960,h=500){staticScene(c,s,w,h);c.save();c.scale(w/960,h/500);const t=quietScene.matches?8:visualClock;
 if(s===0){
  // Reflections and the platform signal animate inside the photographed-style train.
  c.save();c.globalAlpha=.035+.025*Math.sin(t*.8);for(let i=0;i<7;i++)rect(c,500+i*61,174,24,43,'#d9e6c2');c.restore();
  c.fillStyle=Math.floor(t/12)%2?'#b8d49b88':'#cd8c6d88';c.beginPath();c.arc(904,123,3,0,7);c.fill();
 }
 const walkerX=((t*(s===4?8:5)+s*127)%1220)-130;neighbour(c,walkerX,326,t,s===1||s===4||s===5);
 streetDog(c,950-((t*9+s*173)%1170),342,t);
 // Resident resting near belongings, with barely perceptible breathing.
 if(s===3||s===4||s===5){c.save();c.globalAlpha=.5;c.translate(770,320);path(c,[[-27,0],[-22,-13],[8,-15-Math.sin(t)*.5],[25,-5],[26,0]],'#6c7168','#353e37',1);c.fillStyle='#9b8670';c.beginPath();c.ellipse(-24,-10,5,4,0,0,7);c.fill();rect(c,32,-13,13,13,'#86734f');c.restore()}
 if([1,2,5,6].includes(s)){line(c,[[70,159],[260,164],[440,151]],'#343f3a88',1);for(let i=0;i<7;i++){const x=90+i*47,y=160-i*.5,a=Math.sin(t*1.4+i)*2;path(c,[[x,y],[x+19,y],[x+20+a,y+22+i%3*4],[x+a,y+25+i%3*4]],['#7b7b6c66','#9a8a7466','#556e7466'][i%3],null)}}
 if(s===1||s===4){c.globalAlpha=.1+.025*Math.sin(t*3);glow(c,s===1?730:180,207,50,'#ffd99c');c.globalAlpha=1}
 for(let i=0;i<5;i++){const x=(i*191+t*13)%1000-20,y=350+(i%3)*5+Math.sin(t*2+i)*2;c.save();c.translate(x,y);c.rotate(Math.sin(t+i)*.3);rect(c,0,0,7+i%3,3,'#a79e7d44');c.restore()}
 c.restore();};
