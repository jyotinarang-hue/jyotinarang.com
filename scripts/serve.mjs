import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {root,sync} from './sync.mjs';
const port=Number(process.env.PORT||4173), origin=`http://127.0.0.1:${port}`;
let busy=null,lastError=null;
function refresh(){if(!busy)busy=sync().then(x=>{lastError=null;return x}).catch(e=>{lastError='Folder sync failed. Check the terminal and source configuration.';console.error(e.message);throw e}).finally(()=>{busy=null});return busy;}
await refresh();
const config=JSON.parse(fs.readFileSync(path.join(root,'sources.local.json'),'utf8').replace(/^\uFEFF/,''));
const timer=setInterval(()=>refresh().catch(()=>{}),Math.max(15,config.refreshSeconds||60)*1000);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.pdf':'application/pdf','.mp4':'video/mp4','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
const server=http.createServer(async(req,res)=>{
 if(req.headers.host!==`127.0.0.1:${port}`&&req.headers.host!==`localhost:${port}`){res.writeHead(403);res.end();return}
 const url=new URL(req.url,origin);
 if(url.pathname==='/api/refresh'){
 if(req.method!=='POST'||req.headers.origin!==origin){res.writeHead(403);res.end();return}
 try{const result=await refresh();res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(result))}catch{res.writeHead(500);res.end(JSON.stringify({error:lastError}))}return;
 }
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return}
 let decoded;try{decoded=decodeURIComponent(url.pathname)}catch{res.writeHead(400);res.end();return}
 const base=path.join(root,'dist'),file=path.resolve(base,'.'+(decoded==='/'?'/index.html':decoded));
 if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return}
 let stat;try{stat=fs.statSync(file);if(!stat.isFile())throw Error()}catch{res.writeHead(404);res.end();return}
 const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
 if(file.endsWith('work.json')&&lastError)headers['X-Sync-Warning']='failed';
 let start=0,end=stat.size-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m){res.writeHead(416);res.end();return}if(m[1]){start=Number(m[1]);end=m[2]?Number(m[2]):end}else if(m[2])start=Math.max(0,stat.size-Number(m[2]));if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return}end=Math.min(end,stat.size-1);status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}
 headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio running at ${origin}\nFolder sync every ${Math.max(15,config.refreshSeconds||60)} seconds. Ctrl+C stops it.`));
process.on('SIGINT',()=>{clearInterval(timer);server.close(()=>process.exit())});
