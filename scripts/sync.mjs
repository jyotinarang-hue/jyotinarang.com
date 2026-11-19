import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec = promisify(execFile);
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const readJSON=(p,fallback)=>{try{return JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''))}catch{return fallback}};
const excluded=new Set(['node_modules','.git','.venv','.local']);
const formats=new Set(['.docx','.pptx','.xlsx','.pdf','.txt','.md','.csv','.mp4']);
const topics=[
 ['Treasury & liquidity',/treasury|liquidity|cash management|cash forecast|in.house cash/i,'Treasury architecture, cash visibility and liquidity planning'],
 ['Bank connectivity',/fides|multi.bank|\bmbc\b|bank connectivity|swift/i,'Bank connectivity and integration architecture'],
 ['Payment governance',/\bbcm\b|approval|segregation|payment control/i,'Payment workflows, approval design and financial controls'],
 ['ISO 20022',/iso.?20022|dmeex|pain\.001|payment format/i,'Payment standardization and global format design'],
 ['Finance transformation',/s.4hana|finance|general ledger|accounts payable|accounts receivable/i,'Finance process and SAP transformation'],
 ['Tax & divestitures',/onesource|vertex|divestiture|carve.out/i,'Tax integration and enterprise separation'],
 ['Delivery leadership',/workshop|roadmap|resource loading|kick.off|stakeholder|project plan/i,'Design facilitation, roadmap planning and coordinated delivery'],
 ['AI & automation',/\bjoule\b|artificial intelligence|\bai\b|machine learning|automation/i,'AI and automation opportunities in finance']
];
function walk(dir,source,out,errors){
 let entries;try{entries=fs.readdirSync(dir,{withFileTypes:true})}catch{errors.push('A source folder could not be read');return}
 for(const entry of entries){if(entry.isSymbolicLink()||excluded.has(entry.name)||entry.name.startsWith('~$'))continue;
 const p=path.join(dir,entry.name);
 if(entry.isDirectory()){if((source.excludeClients||[]).some(c=>entry.name.toLowerCase()===c.toLowerCase()))continue;walk(p,source,out,errors)}
 else if(formats.has(path.extname(p).toLowerCase())){try{const s=fs.statSync(p);out.set(p,{path:p,size:s.size,mtime:s.mtimeMs})}catch{errors.push('A file could not be read')}}
 }
}
export async function sync(configPath=path.join(root,'sources.local.json')){
 const config=readJSON(configPath,null);if(!config?.sources)throw Error('Missing sources.local.json');
 const local=path.join(root,'.local');fs.mkdirSync(local,{recursive:true});
 const cache=readJSON(path.join(local,'cache.json'),{});const inventories=[];const pending=new Map();
 for(const source of config.sources){const files=new Map(),errors=[];let found=false;
 for(const dir of source.paths){if(fs.existsSync(dir)){found=true;walk(dir,source,files,errors)}}
 for(const item of files.values()){const old=cache[item.path];if(!old||old.size!==item.size||old.mtime!==item.mtime)pending.set(item.path,item)}
 inventories.push({source,files,found,errors});}
 if(pending.size){const input=path.join(local,'extract-input.json');fs.writeFileSync(input,JSON.stringify([...pending.values()]));
 const {stdout}=await exec('powershell.exe',['-NoProfile','-Command',"& ([scriptblock]::Create([IO.File]::ReadAllText('"+path.join(root,'scripts/extract.ps1').replaceAll("'","''")+"'))) -InputFile '"+input.replaceAll("'","''")+"'"],{maxBuffer:64*1024*1024,windowsHide:true});
 const extracted=readJSON(input+'.result.json',null);if(!Array.isArray(extracted))throw Error('Invalid extraction result');
 for(const row of extracted){const item=pending.get(row.path);const evidence=path.basename(row.path)+' '+row.text;cache[row.path]={...item,status:row.status,topics:topics.filter(t=>t[1].test(evidence)).map(t=>t[0])};}
 fs.unlinkSync(input);fs.unlinkSync(input+'.result.json');
 }
 const projects=inventories.map(({source,files,found,errors})=>{
 const rows=[...files.keys()].map(p=>cache[p]).filter(Boolean);
 const signals=topics.map(([name,,description])=>({name,description,count:rows.filter(r=>r.topics.includes(name)).length})).filter(t=>t.count);
 return {client:source.client,connected:found,fileCount:files.size,extractedCount:rows.filter(r=>r.status==='extracted').length,unreadableCount:rows.filter(r=>r.status==='unreadable').length,warning:errors.length>0,latestModified:rows.length?new Date(Math.max(...rows.map(r=>r.mtime))).toISOString():null,topics:signals};
 });
 const output={updatedAt:new Date().toISOString(),projects};
 // Public output contains topic summaries only. Private paths and filenames stay outside dist.
 const json=JSON.stringify(output,null,2);fs.mkdirSync(path.join(root,'dist/data'),{recursive:true});
 fs.writeFileSync(path.join(root,'dist/data/work.json'),json);
 fs.writeFileSync(path.join(root,'dist/data/work.js'),'window.PORTFOLIO_WORK='+json+';');
 fs.writeFileSync(path.join(local,'cache.json'),JSON.stringify(cache));
 return output;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))sync().then(x=>console.log(JSON.stringify(x,null,2))).catch(e=>{console.error(e.message);process.exitCode=1});
