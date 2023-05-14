export const getTrend = (BigNumber, data, period) => {
    const n = data.length;
    const startIndex = Math.max(0, n - period);
    const endIndex = n - 1;
    let direction = '';
    const zero = BigNumber(0);
    const threshold = BigNumber(0.5);
  
    const priceDiffs = new Array(endIndex - startIndex);
    
    for (let i = startIndex; i < endIndex; i++) {
      priceDiffs[i - startIndex] = data[i + 1].minus(data[i]);
    }
  
    const priceDiffAvg = priceDiffs.reduce(
      (acc, cur) => acc.plus(cur),
      zero
    ).dividedBy(priceDiffs.length);
  
    const priceDiffStdDev = priceDiffs
      .reduce(
        (acc, cur) => acc.plus(cur.minus(priceDiffAvg).pow(2)),
        zero
      ).dividedBy(priceDiffs.length - 1).sqrt();
  
    if (priceDiffAvg.isGreaterThan(zero) && priceDiffStdDev.isGreaterThan(threshold.times(priceDiffAvg))) {
      direction = 'upward';
    } else if (priceDiffAvg.isLessThan(zero) && priceDiffStdDev.isGreaterThan(threshold.times(priceDiffAvg.abs()))) {
      direction = 'downward';
    } else {
      direction = 'sideward';
    }
  
    return direction;
  };
  