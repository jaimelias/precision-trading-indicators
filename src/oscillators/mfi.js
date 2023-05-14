export const MFI = (BigNumber, ohlcv, period = 14) => {
    const { high, low, close, volume } = ohlcv;
    const zero = BigNumber(0);
    const hundred = BigNumber(100);
    const one = BigNumber(1);
    const typicalPrices = []; // Typical price = (high + low + close) / 3
    const rawMoneyFlows = []; // Raw money flow = typical price * volume
    const positiveMoneyFlows = []; // Positive money flow
    const negativeMoneyFlows = []; // Negative money flow
    const moneyFlowRatios = []; // Money flow ratio = (14-day positive money flow) / (14-day negative money flow)
    const moneyFlowIndexes = []; // Money flow index = 100 - (100 / (1 + money flow ratio))
  
    // Calculate typical prices and raw money flows
    for (let i = 0; i < close.length; i++) {
      const typicalPrice = high[i].plus(low[i]).plus(close[i]).dividedBy(3);
      const rawMoneyFlow = typicalPrice.times(volume[i]);
  
      typicalPrices.push(typicalPrice);
      rawMoneyFlows.push(rawMoneyFlow);
    }
  
    // Calculate positive and negative money flows
    for (let i = 1; i < typicalPrices.length; i++) {
      if (typicalPrices[i].isGreaterThan(typicalPrices[i - 1])) {
        positiveMoneyFlows.push(rawMoneyFlows[i]);
        negativeMoneyFlows.push(zero);
      } else if (typicalPrices[i].isLessThan(typicalPrices[i - 1])) {
        positiveMoneyFlows.push(zero);
        negativeMoneyFlows.push(rawMoneyFlows[i]);
      } else {
        positiveMoneyFlows.push(zero);
        negativeMoneyFlows.push(zero);
      }
    }
  
    // Calculate money flow ratios
    for (let i = period; i <= positiveMoneyFlows.length; i++) {
      const positiveMoneyFlowSlice = positiveMoneyFlows.slice(i - period, i);
      const negativeMoneyFlowSlice = negativeMoneyFlows.slice(i - period, i);
  
      const positiveMoneyFlowSum = positiveMoneyFlowSlice.reduce((sum, value) => sum.plus(value), zero);
      const negativeMoneyFlowSum = negativeMoneyFlowSlice.reduce((sum, value) => sum.plus(value), zero);
  
      const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
      moneyFlowRatios.push(moneyFlowRatio);
    }
  
    // Calculate money flow indexes
    for (let i = 0; i < moneyFlowRatios.length; i++) {
      const moneyFlowIndex = hundred.minus(hundred.dividedBy(one.plus(moneyFlowRatios[i])));
      moneyFlowIndexes.push(moneyFlowIndex);
    }
  
    return moneyFlowIndexes;
  };
  