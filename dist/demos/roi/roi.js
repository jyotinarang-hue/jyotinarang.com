// Treasury Transformation ROI Simulator: pure calculation (no DOM). Tested by scripts/test-roi.cjs.
(function (root) {
  'use strict';
  const MAX = 1e13;
  const FIELDS = {
    annualRevenue: {pct: false}, dsoReductionDays: {pct: false, max: 365}, costOfCapitalPct: {pct: true},
    annualBankFees: {pct: false}, feeReductionPct: {pct: true},
    annualPayments: {pct: false}, currentStpPct: {pct: true}, targetStpPct: {pct: true}, costPerManualPayment: {pct: false},
    annualCashExceptions: {pct: false}, autoResolvePct: {pct: true}, costPerException: {pct: false},
    oneTimeInvestment: {pct: false}
  };
  const EXAMPLE = {
    annualRevenue: 2000000000, dsoReductionDays: 2, costOfCapitalPct: 6,
    annualBankFees: 1500000, feeReductionPct: 15,
    annualPayments: 250000, currentStpPct: 70, targetStpPct: 90, costPerManualPayment: 12,
    annualCashExceptions: 40000, autoResolvePct: 50, costPerException: 15,
    oneTimeInvestment: 1500000
  };
  const round = n => Math.round(n * 100) / 100;

  function evaluate(input) {
    const v = {};
    for (const [key, rule] of Object.entries(FIELDS)) {
      const n = input[key];
      if (typeof n !== 'number' || !Number.isFinite(n) || n < 0) throw new RangeError(key + ' must be a non-negative number.');
      const limit = rule.pct ? 100 : (rule.max || MAX);
      if (n > limit) throw new RangeError(key + ' must not exceed ' + limit + '.');
      v[key] = n;
    }
    if (v.targetStpPct < v.currentStpPct) throw new RangeError('Target STP rate must be at least the current STP rate.');

    const workingCapitalReleased = round(v.annualRevenue / 365 * v.dsoReductionDays);
    const financingBenefit = round(workingCapitalReleased * v.costOfCapitalPct / 100);
    const bankFeeSavings = round(v.annualBankFees * v.feeReductionPct / 100);
    const paymentsMovedToStp = Math.round(v.annualPayments * (v.targetStpPct - v.currentStpPct) / 100);
    const stpSavings = round(paymentsMovedToStp * v.costPerManualPayment);
    const exceptionsResolved = Math.round(v.annualCashExceptions * v.autoResolvePct / 100);
    const exceptionSavings = round(exceptionsResolved * v.costPerException);
    const annualBenefit = round(financingBenefit + bankFeeSavings + stpSavings + exceptionSavings);
    const paybackMonths = annualBenefit > 0 ? round(v.oneTimeInvestment / (annualBenefit / 12)) : null;
    const threeYearNet = round(annualBenefit * 3 - v.oneTimeInvestment);
    return {workingCapitalReleased, financingBenefit, bankFeeSavings, paymentsMovedToStp, stpSavings, exceptionsResolved, exceptionSavings, annualBenefit, paybackMonths, threeYearNet};
  }

  root.PortfolioROI = {evaluate, EXAMPLE, FIELDS};
})(typeof window !== 'undefined' ? window : globalThis);
