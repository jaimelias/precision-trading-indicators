
import { EMA } from "../moving-averages/ema.js";
import { findLastCross } from "../signals/find-last-cross.js";

export const RSI = (BigNumber, data, period = 14, emaPeriod = 14) => {
    if(data.length < period) {
      return [];
    }
  
    let rsi = [];
    let pl = data.slice(0, period);  
    const zero = BigNumber(0);
    const hundred = BigNumber(100);
    const one = BigNumber(1);
  
    for (let i = period, gain = zero, loss = zero; i < data.length; i++, gain = zero, loss = zero) {
      pl.push(data[i]);
  
      for (let q = 1; q < pl.length; q++) {
        const thisVal = BigNumber(pl[q]);
        const prevVal = BigNumber(pl[q - 1]);
  
        if (thisVal.minus(prevVal).isLessThan(zero)) {
          loss = loss.plus(thisVal.minus(prevVal).abs());
        } else {
          gain = gain.plus(thisVal.minus(prevVal));
        }
      }
  
      const gainperiod = gain.dividedBy(period);
      const lossperiod = loss.dividedBy(period);
  
      const gainLoss = lossperiod.isEqualTo(zero) ? zero : gainperiod.dividedBy(lossperiod);
  
      rsi.push(
        hundred.minus(hundred.dividedBy(one.plus(gainLoss)))
      )
  
      pl.splice(0, 1);
    }

    const rsiEma = EMA(BigNumber, rsi, emaPeriod)

    const {crossType, crossInterval} = findLastCross({fast: rsi, slow: rsiEma});
  
    return {rsi, rsiEma, crossType, crossInterval};
  }
  