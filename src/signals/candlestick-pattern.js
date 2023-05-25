export const getCandlestickPattern = ohlcv => {

  const { open, high, low, close } = ohlcv;

  const candlesticks = [
    { open: open[open.length - 2], high: high[high.length - 2], low: low[low.length - 2], close: close[close.length - 2] },
    { open: open[open.length - 1], high: high[high.length - 1], low: low[low.length - 1], close: close[close.length - 1] }
  ];
  
  const [prev, curr] = candlesticks.slice(-2);

  const isBullish = curr.close.isGreaterThan(curr.open);
  const isBearish = curr.open.isGreaterThan(curr.close);

  if (isBullish) {
    if (curr.low.isLessThan(prev.low) && curr.high.isGreaterThan(prev.high)) {
      return 'Bullish: Engulfing';
    }
    if (curr.close.isGreaterThan(prev.close)) {
      if (curr.open.isLessThan(prev.open)) {
        return 'Bullish: Piercing Line';
      }
      if (curr.open.isEqualTo(prev.open)) {
        return 'Bullish: Morning Star';
      }
    }
    if (curr.close.isEqualTo(prev.open)) {
      if (curr.open.isGreaterThan(prev.close)) {
        return 'Bullish: Harami';
      }
      if (curr.open.isEqualTo(prev.close)) {
        return 'Bullish: Doji';
      }
    }
    if (curr.close.isGreaterThan(prev.close)) {
      return 'Bullish: Marubozu';
    }
    if (curr.open.isGreaterThan(prev.open)) {
      return 'Bullish: Belt Hold';
    }
    if (curr.open.isLessThan(prev.open) && curr.close.isLessThan(prev.close)) {
      return 'Bullish: Kicker';
    }
  }

  if (isBearish) {
    if (curr.high.isGreaterThan(prev.high) && curr.low.isLessThan(prev.low)) {
      return 'Bearish: Engulfing';
    }
    if (curr.close.isLessThan(prev.close)) {
      if (curr.open.isGreaterThan(prev.open)) {
        return 'Bearish: Dark Cloud Cover';
      }
      if (curr.open.isEqualTo(prev.open)) {
        return 'Bearish: Evening Star';
      }
    }
    if (curr.close.isEqualTo(prev.open)) {
      if (curr.open.isLessThan(prev.close)) {
        return 'Bearish: Harami';
      }
      if (curr.open.isEqualTo(prev.close)) {
        return 'Bearish: Doji';
      }
    }
    if (curr.close.isLessThan(prev.close)) {
      return 'Bearish: Marubozu';
    }
    if (curr.open.isLessThan(prev.open)) {
      return 'Bearish: Belt Hold';
    }
    if (curr.open.isGreaterThan(prev.open) && curr.close.isGreaterThan(prev.close)) {
      return 'Bearish: Kicker';
    }
  }

  return 'Unknown';
};