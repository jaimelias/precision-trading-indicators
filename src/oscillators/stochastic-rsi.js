import { EMA } from '../moving-averages/ema.js';

export const STOCHASTIC_RSI = (BigNumber, rsi, kPeriods, kSlowingPeriods, dPeriods) => {
	
    if(rsi.length < kPeriods)
    {
        return NaN;
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
    
    let K = EMA(BigNumber, kValues, kSlowingPeriods);
    
    let D = EMA(BigNumber, K, dPeriods);
    
  
    //stochasticRsi = D

    return {K, D};
  }
  