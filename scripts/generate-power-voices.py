"""Offline build tool. Piper binary is downloaded separately from its official release.
Only the rendered WAVs ship to browsers; models and tool binaries are not deployed.
"""
import json, math, subprocess, urllib.request, wave, hashlib, sys
from pathlib import Path
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
TOOLS=ROOT.parent/'work/voice-tools'
OUT=ROOT/'dist/assets/audio/powers'
OUT.mkdir(parents=True,exist_ok=True)
PROFILES=[
 dict(id=0,name='Lautaro',model='es/es_MX/ald/medium',voice='es_MX-ald-medium',speaker=0,speed=.83,pitch=.96,grit=.16),
 dict(id=1,name='Patricio',model='es/es_ES/davefx/medium',voice='es_ES-davefx-medium',speaker=0,speed=.94,pitch=1.02,grit=.01),
 dict(id=2,name='El Tano',model='es/es_ES/carlfm/x_low',voice='es_ES-carlfm-x_low',speaker=0,speed=.84,pitch=1.06,grit=.09),
 dict(id=3,name='La Colo',model='es/es_ES/sharvard/medium',voice='es_ES-sharvard-medium',speaker=1,speed=.79,pitch=.97,grit=.18),
 dict(id=4,name='Doc Marta',model='es/es_ES/sharvard/medium',voice='es_ES-sharvard-medium',speaker=1,speed=.96,pitch=1.09,grit=0),
 dict(id=5,name='El Rulo',model='es/es_ES/mls_10246/low',voice='es_ES-mls_10246-low',speaker=0,speed=.9,pitch=.91,grit=.22),
 dict(id=6,name='La Nona',model='es/es_ES/sharvard/medium',voice='es_ES-sharvard-medium',speaker=1,speed=1.08,pitch=.9,grit=.05),
 dict(id=7,name='El Chapa',model='es/es_ES/sharvard/medium',voice='es_ES-sharvard-medium',speaker=0,speed=.85,pitch=.94,grit=.13),
]
LINES=[['¡Llave voladora!','¡Cortocircuito!','¡Porro del taller!','¡Maldito piperooooo!'],['¡Tarjeta sin fondo!','¡Interés compuesto!','¡Porro financiero!','¡Karakotooooo!'],['¡Tomatazo!','¡Lluvia de papas!','¡Cajón express!','¡Ofertón del día!'],['¡Chorizo boom!','¡Gancho de mostrador!','¡Asado giratorio!','¡Todo a la parrilla!'],['¡Receta voladora!','¡Pulso eléctrico!','¡Guardia activa!','¡Código barrio!'],['¡Bocinazo!','¡Rueda suelta!','¡Acople bravo!','¡Pasó el camión!'],['¡Ñoqui misil!','¡Sartenazo!','¡Nube de harina!','¡A comer, carajo!'],['¡Tuercazo!','¡Gato hidráulico!','¡Aceite turbo!','¡Rectificada total!']]
def download(url,dest):
 with urllib.request.urlopen(url,timeout=120) as response,dest.open('wb') as out:
  while chunk:=response.read(1024*512):out.write(chunk)
def design_voice(src,dest,profile,ultimate):
 with wave.open(str(src),'rb') as w:
  sr=w.getframerate(); samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float64)/32768
 active=np.flatnonzero(np.abs(samples)>.012)
 if len(active):samples=samples[max(0,active[0]-int(sr*.025)):min(len(samples),active[-1]+int(sr*.09))]
 # Per-character cadence, resonance, saturation and short room reflections.
 n=max(1,int(len(samples)/profile['pitch']));samples=np.interp(np.linspace(0,len(samples)-1,n),np.arange(len(samples)),samples)
 pre=np.r_[0,samples[:-1]];samples=samples-.12*pre
 drive=1+profile['grit']*4+(0.2 if ultimate else 0)
 samples=np.tanh(samples*drive)/math.tanh(drive)
 delay=int(sr*(.022 if profile['id'] in [0,5,7] else .014))
 if len(samples)>delay:samples[delay:]+=samples[:-delay]*.095
 peak=np.max(np.abs(samples));samples*=.82/max(peak,.001)
 fade=min(int(sr*.012),len(samples)//2);samples[:fade]*=np.linspace(0,1,fade);samples[-fade:]*=np.linspace(1,0,fade)
 # 16 kHz mono PCM: readily decoded on both Safari and Chrome, no runtime TTS.
 output=np.interp(np.arange(0,len(samples),sr/16000),np.arange(len(samples)),samples)
 with wave.open(str(dest),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(16000);w.writeframes((np.clip(output,-1,1)*32767).astype('<i2').tobytes())
for row in LINES:
 for i,text in enumerate(row):row[i]=text.replace('Karakotooooo!','Karakotoooooo!')
wanted={int(sys.argv[1])} if len(sys.argv)>1 else set(range(8))
PROFILES=[p for p in PROFILES if p['id'] in wanted]
previous=json.loads((OUT/'manifest.json').read_text(encoding='utf-8')) if (OUT/'manifest.json').exists() else {}
records=[r for r in previous.get('lines',[]) if r['character'] not in wanted]
try:
 for model in dict.fromkeys(p['model'] for p in PROFILES):
  profiles=[p for p in PROFILES if p['model']==model];voice=profiles[0]['voice'];base='https://huggingface.co/rhasspy/piper-voices/resolve/main/'+model+'/'
  model_path=TOOLS/'voice.onnx';config=TOOLS/'voice.onnx.json';card=TOOLS/('card-'+voice+'.txt')
  print('Downloading '+voice,flush=True)
  download(base+'MODEL_CARD',card);download(base+voice+'.onnx.json',config);download(base+voice+'.onnx',model_path)
  for p in profiles:
   for i,text in enumerate(LINES[p['id']]):
    target=OUT/f"{p['id']}-{i}.wav";raw=TOOLS/'line.wav'
    command=[str(TOOLS/'piper/piper.exe'),'-m',str(model_path),'-c',str(config),'-s',str(p['speaker']),'--length_scale',str(p['speed']),'--noise_scale','.72','--sentence_silence','.04','-f',str(raw)]
    result=subprocess.run(command,input=text.encode('utf-8'),capture_output=True,cwd=TOOLS/'piper',timeout=60)
    if result.returncode:raise RuntimeError(result.stderr.decode(errors='replace'))
    design_voice(raw,target,p,i==3);records.append(dict(character=p['id'],power=i,text=text,path=f"assets/audio/powers/{p['id']}-{i}.wav",voice=p['voice'],speaker=p['speaker'],sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
   print('Rendered '+p['name'],flush=True)
  model_path.unlink();config.unlink()
 records.sort(key=lambda r:(r['character'],r['power']))
 all_profiles=[p for p in previous.get('profiles',[]) if p['id'] not in wanted]+PROFILES
 all_profiles.sort(key=lambda p:p['id'])
 (OUT/'manifest.json').write_text(json.dumps(dict(generation='Piper neural synthesis with character-specific cadence and audio design; no browser speech synthesis and no cloned people',profiles=all_profiles,lines=records),ensure_ascii=False,indent=2),encoding='utf-8')
 print('Completed '+str(len(records))+' voice lines',flush=True)
finally:
 # Only temporary downloads made by this build tool; original art/audio untouched.
 for name in ['voice.onnx','voice.onnx.json','line.wav']:
  (TOOLS/name).unlink(missing_ok=True)
