'use strict';
// Recorded voices, not browser speech synthesis. Sources and licenses: CREDITOS.txt.
const voiceClips=new Map();let voiceUnlocked=false,voiceSerial=0,remoteAudioSeq=-1;
function playClip(name,volume=.65,rate=1){if(!sound||!voiceUnlocked)return;try{let base=voiceClips.get(name);if(!base){base=new Audio(`assets/audio/${name}.mp3`);base.preload='auto';voiceClips.set(name,base)}const clip=base.cloneNode();clip.volume=volume;clip.playbackRate=rate;clip.play().catch(()=>{})}catch{}}
function playFighterVoice(id,kind){const female=[3,4,6].includes(id),n=Math.floor(Math.random()*(female?(kind==='hurt'?7:6):12));const name=female?(kind==='hurt'?`female-hurt-${n}`:`female-attack-${n}`):`male-${n}`;const rates=[.99,1.06,.86,1.04,.94,.81,.9,.91];playClip(name,kind==='super'?.9:.62,rates[id])}
sound=true;$('#sound').textContent='SONIDO: SÍ';
document.addEventListener('pointerdown',()=>{if(voiceUnlocked)return;voiceUnlocked=true;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume()}catch{}},{once:true});
document.addEventListener('keydown',()=>{voiceUnlocked=true},{once:true});
$('#sound').onclick=()=>{sound=!sound;voiceUnlocked=true;$('#sound').textContent='SONIDO: '+(sound?'SÍ':'NO');if(sound)playClip('announcer-ready')};
say=function(text){if(!sound)return;const upper=text.toUpperCase();if(roster.some(r=>r.slice(3).includes(text)))return;
 if(upper.includes('DALE')){const token=++voiceSerial;playClip('announcer-ready');setTimeout(()=>{if(playing&&token===voiceSerial)playClip('announcer-fight',.8)},1650)}
 else if(game?.done){const own=host?0:1;playClip(game.p[own].wins>=2?'announcer-you_win':'announcer-you_lose',.8)}
 else if(game?.wait>0){const token=voiceSerial;setTimeout(()=>{if(playing&&token===voiceSerial)playClip(`announcer-round_${Math.min(game.round,5)}`)},1600);setTimeout(()=>{if(playing&&token===voiceSerial)playClip('announcer-fight')},2950)}
};
const voicedDraw=draw;draw=function(now){voicedDraw(now);if(game?.audioCue&&remoteAudioSeq!==game.audioCue.seq){remoteAudioSeq=game.audioCue.seq;playFighterVoice(game.audioCue.id,game.audioCue.kind)}};
