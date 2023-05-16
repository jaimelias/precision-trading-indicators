import { EMA } from '../moving-averages/ema.js';
import { findLastCross } from '../trend-reversal/find-last-cross.js';


export const STOCHASTIC_RSI = (BigNumber, rsi, kPeriods, kSlowingPeriods, dPeriods) => {
	
    if(rsi.length < kPeriods)
    {
        return [];
    }
    
    const rsiRange = BigNumber.max(kPeriods, kSlowingPeriods, dPeriods);
    
    const kValues = [];
    for (let i = rsiRange.toNumber(); i < rsi.length; i++) {
      const rsiSlice = rsi.slice(i - rsiRange.toNumber(), i + 1);
      const minRsi = BigNumber.min(...rsiSlice);
      const maxRsi = BigNumber.max(...rsiSlice);
      const currentRsi = rsi[i];
      const kValue = currentRsi.minus(minRsi).dividedBy(maxRsi.minus(minRsi)).times(100);
      kValues.push(kValue);
    }
    
    const K = EMA(BigNumber, kValues, kSlowingPeriods);
    
    const D = EMA(BigNumber, K, dPeriods);
    
    const {crossType, crossInterval} = findLastCross({fast: K, slow: D});

    //stochasticRsi = D

    return {K, D, crossType, crossInterval};
  }
  