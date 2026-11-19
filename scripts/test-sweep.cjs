const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('dist/sweep.js','utf8'),context);const calc=context.PortfolioSweep.evaluateSweep;
let r=calc({balance:20000000,receipts:3000000,payments:5000000,buffer:7000000});assert.equal(r.sweep,11000000);assert.equal(r.after,7000000);assert.equal(r.gap,0);
r=calc({balance:100,receipts:1000,payments:0,buffer:50});assert.equal(r.sweep,100);assert.equal(r.capped,true);
r=calc({balance:100,receipts:0,payments:80,buffer:50});assert.equal(r.sweep,0);assert.equal(r.gap,30);
r=calc({balance:0.3,receipts:0,payments:0.1,buffer:0.1});assert.equal(r.sweep,0.1);assert.equal(r.after,0.1);
for(const value of [-1,NaN,Infinity,1e13,'100'])assert.throws(()=>calc({balance:value,receipts:0,payments:0,buffer:0}));
console.log('PASS: sweep surplus, current-cash cap, shortfall, currency rounding and invalid-input rejection.');
