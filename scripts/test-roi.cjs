const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('dist/demos/roi/roi.js','utf8'),context);
const {evaluate,EXAMPLE}=context.PortfolioROI;

let r=evaluate({...EXAMPLE});
// 2,000,000,000 / 365 * 2 = 10,958,904.11
assert.equal(r.workingCapitalReleased,10958904.11);
assert.equal(r.financingBenefit,657534.25);
assert.equal(r.bankFeeSavings,225000);
assert.equal(r.paymentsMovedToStp,50000);
assert.equal(r.stpSavings,600000);
assert.equal(r.exceptionsResolved,20000);
assert.equal(r.exceptionSavings,300000);
assert.equal(r.annualBenefit,1782534.25);
assert.equal(r.threeYearNet,3847602.75);
assert.ok(Math.abs(r.paybackMonths-10.1)<0.01);

r=evaluate({...EXAMPLE,annualRevenue:0,annualBankFees:0,annualPayments:0,annualCashExceptions:0});
assert.equal(r.annualBenefit,0);assert.equal(r.paybackMonths,null);assert.equal(r.threeYearNet,-1500000);

for(const bad of [-1,NaN,Infinity,1e14,'5'])assert.throws(()=>evaluate({...EXAMPLE,annualRevenue:bad}));
assert.throws(()=>evaluate({...EXAMPLE,feeReductionPct:101}));
assert.throws(()=>evaluate({...EXAMPLE,dsoReductionDays:400}));
assert.throws(()=>evaluate({...EXAMPLE,currentStpPct:95,targetStpPct:90}));
console.log('PASS: ROI working capital, fee, STP, exception, payback and invalid-input rules.');
