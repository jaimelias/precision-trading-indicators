import { EMA } from '../moving-averages/ema.js';
import { findLastCross } from '../signals/find-last-cross.js';


export const STOCHASTIC_RSI = (BigNumber, rsi, kPeriods = 14, kSlowingPeriods = 3, dPeriods = 3) => {
	
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
    
    const K = new EMA(BigNumber, kValues, kSlowingPeriods).get();
    const D = new EMA(BigNumber, K, dPeriods).get();
    
    const {crossType, crossInterval} = findLastCross({fast: D, slow: K});

    //stochasticRsi = D

    return {K, D, crossType, crossInterval};
  }
  