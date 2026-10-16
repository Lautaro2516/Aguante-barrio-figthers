(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ArenaInputs=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
const VALID=new Set(['jump','jumpButton','punch','kick','p0','p1','p2','ult']);
class InputBuffer{
 constructor(now=()=>performance.now()){this.now=now;this.pending=new Map()}
 press(key){if(VALID.has(key))this.pending.set(key,this.now()+120)}
 keys(raw){const result={...raw};for(const [key,until]of this.pending){if(until<this.now())this.pending.delete(key);else result[key]=true}return result}
 consume(){const keys=Object.keys(this.keys({}));this.pending.clear();return keys.map(key=>key==='jumpButton'?'jump':key)}
 clear(){this.pending.clear()}
}
return{InputBuffer};
});
