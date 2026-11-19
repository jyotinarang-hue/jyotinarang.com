import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {sync,root} from './sync.mjs';
const dir=path.join(root,'.local/test-source');fs.mkdirSync(dir,{recursive:true});
const config=path.join(root,'.local/test-sources.json');const source=path.join(dir,'private-test-notes.txt');
const outputs=['dist/data/work.json','dist/data/work.js','.local/cache.json'].map(p=>path.join(root,p));
const originals=outputs.map(p=>fs.existsSync(p)?fs.readFileSync(p):null);
try{
 fs.writeFileSync(config,JSON.stringify({sources:[{client:'Fixture',paths:[dir]},{client:'Missing',paths:[path.join(dir,'absent')]}]}));
 fs.writeFileSync(source,'CONFIDENTIAL_MARKER FIDES bank connectivity and treasury liquidity');
 let result=await sync(config);assert.equal(result.projects[0].fileCount,1);assert.equal(result.projects[0].extractedCount,1);assert.equal(result.projects[1].connected,false);assert.ok(result.projects[0].topics.some(t=>t.name==='Bank connectivity'));
 const publicJSON=fs.readFileSync(outputs[0],'utf8');assert.ok(!publicJSON.includes('CONFIDENTIAL_MARKER'));assert.ok(!publicJSON.includes('private-test-notes'));assert.ok(!publicJSON.includes(root));
 fs.writeFileSync(source,'Joule artificial intelligence automation, changed content');
 result=await sync(config);assert.ok(result.projects[0].topics.some(t=>t.name==='AI & automation'));assert.ok(!result.projects[0].topics.some(t=>t.name==='Bank connectivity'));
 fs.unlinkSync(source);result=await sync(config);assert.equal(result.projects[0].fileCount,0);assert.equal(result.projects[0].topics.length,0);
 console.log('PASS: extraction, source changes, deletion, missing folders and public data privacy.');
}finally{for(let i=0;i<outputs.length;i++){if(originals[i])fs.writeFileSync(outputs[i],originals[i]);else if(fs.existsSync(outputs[i]))fs.unlinkSync(outputs[i])}if(fs.existsSync(source))fs.unlinkSync(source);fs.unlinkSync(config);fs.rmdirSync(dir)}
