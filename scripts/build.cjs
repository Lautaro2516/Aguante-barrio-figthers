const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dist=path.resolve(__dirname,'../dist'),file=path.join(dist,'index.html');let html=fs.readFileSync(file,'utf8');
html=html.replace(/(src|href)="([a-zA-Z0-9.-]+\.(?:js|css))(?:\?v=[a-f0-9]+)?"/g,(_,attr,name)=>{const hash=crypto.createHash('sha256').update(fs.readFileSync(path.join(dist,name))).digest('hex').slice(0,12);return `${attr}="${name}?v=${hash}"`});fs.writeFileSync(file,html);console.log('Production asset hashes updated.');
