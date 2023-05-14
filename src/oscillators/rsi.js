
export const RSI = (BigNumber, data, period) => {
    if(data.length < period) {
      return [];
    }
  
    let arr = [];
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
  
      const rs = lossperiod.isEqualTo(zero) ? zero : gainperiod.dividedBy(lossperiod);
      const rsi = hundred.minus(hundred.dividedBy(one.plus(rs)));
  
      arr.push(rsi);
  
      pl.splice(0, 1);
    }
  
    return arr;
  }
  