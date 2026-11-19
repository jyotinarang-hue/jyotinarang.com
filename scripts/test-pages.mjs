import assert from 'node:assert/strict';
const base='http://127.0.0.1:4173';const pages=['index','experience','projects','publications','speaking','community','credentials','lockbox-agent','cash-sweep-agent'];
for(const name of pages){const response=await fetch(base+'/'+name+'.html');assert.equal(response.status,200,name);const text=await response.text();assert.ok(text.includes('<title>'),name);assert.ok(text.includes('aria-current="page"'),name);if(name==='lockbox-agent')assert.ok(text.includes('src="demos/lockbox/index.html"'));if(name==='cash-sweep-agent')assert.ok(text.includes('id="sweep-form"'));if(name==='index')assert.ok(!text.includes('id="ongoing-projects"'));}
for(const asset of ['portfolio.js','sweep.js','data/content.js','demos/lockbox/index.html','demos/lockbox/workbench-data.js'])assert.equal((await fetch(base+'/'+asset)).status,200,asset);
console.log('PASS: all nine routes, active navigation, dedicated content, embedded workbench and project dependencies.');
