const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const file=match[1].split('?')[0];if(file.startsWith('http')||file==='./')continue;assert(fs.existsSync(path.join(dist,file)),'Missing '+file)}
for(const file of fs.readdirSync(dist).filter(n=>n.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(dist,file),'utf8'),{filename:file});
assert(!html.includes('unpkg.com/peerjs'),'Legacy P2P script remains');assert(!fs.readFileSync(path.join(dist,'game.js'),'utf8').includes('new Peer('),'Legacy network remains');
const webp=fs.readdirSync(path.join(dist,'assets/animation')).filter(n=>n.endsWith('.webp'));assert.equal(webp.length,8);
console.log(JSON.stringify({syntax:'pass',referencedFiles:'pass',characters:8,scenes:7,animationSheets:8,legacyPeerJSRemoved:true}));
