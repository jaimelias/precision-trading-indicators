export const getCandlestickPattern = ({ open, high, low, close }) => {

  if(![open, high, low, close].every(o => Array.isArray(o) && o.length >1))
  {
    return { pattern: '', name: '', score: 0}
  }

  const prevIndex = open.length - 2
  const currIndex = open.length - 1

  const prev = {
    open: open[prevIndex].toNumber(),
    high: high[prevIndex].toNumber(),
    low: low[prevIndex].toNumber(),
    close: close[prevIndex].toNumber()
  }

  const curr = {
    open: open[currIndex].toNumber(),
    high: high[currIndex].toNumber(),
    low: low[currIndex].toNumber(),
    close: close[currIndex].toNumber()
  }

  const conditions = {
    bullish: [
      { name: 'Engulfing', condition: curr.low < prev.low && curr.high > prev.high, score: 2 },
      { name: 'Piercing Line', condition: curr.close > prev.close && curr.open < prev.open && curr.close > ((prev.open + prev.close) / 2), score: 1 },
      { name: 'Morning Star', condition: curr.close > prev.close && curr.open < prev.open && prev.close < prev.open, score: 2 },
      { name: 'Harami', condition: curr.close < prev.open && curr.open > prev.close && curr.close < prev.close && curr.open > prev.open, score: 1 },
      { name: 'Doji', condition: Math.abs(curr.close - curr.open) < (curr.close * 0.01), score: 0 }, // Assuming a Doji if the difference between open and close is less than 1% of the close price
      { name: 'Marubozu', condition: Math.abs(curr.close - curr.open) > (curr.close * 0.99), score: 3 }, // Assuming a Marubozu if the difference between open and close is more than 99% of the close price
      { name: 'Belt Hold', condition: curr.open > prev.open && curr.close === curr.high && prev.close === prev.low, score: 1 },
      { name: 'Kicker', condition: curr.open < prev.open && curr.close < prev.close && curr.close < curr.open, score: 2 }
    ],
    bearish: [
      { name: 'Engulfing', condition: curr.high > prev.high && curr.low < prev.low, score: -2 },
      { name: 'Dark Cloud Cover', condition: curr.close < prev.close && curr.open > prev.open && curr.close < ((prev.open + prev.close) / 2), score: -1 },
      { name: 'Evening Star', condition: curr.close < prev.close && curr.open > prev.open && prev.close < prev.open, score: -2 },
      { name: 'Harami', condition: curr.close > prev.open && curr.open < prev.close && curr.close > prev.close && curr.open < prev.open, score: -1 },
      { name: 'Doji', condition: Math.abs(curr.close - curr.open) < (curr.close * 0.01), score: 0 }, // Same Doji condition as bullish
      { name: 'Marubozu', condition: Math.abs(curr.close - curr.open) > (curr.close * 0.99), score: -3 }, // Same Marubozu condition as bullish
      { name: 'Belt Hold', condition: curr.open < prev.open && curr.close === curr.low && prev.close === prev.high, score: -1 },
      { name: 'Kicker', condition: curr.open > prev.open && curr.close > prev.close && curr.close > curr.open, score: -2 }
    ]
  }
  
  

  for (const pattern of ['bullish', 'bearish']) {
    for (const { name, condition, score } of conditions[pattern]) {
      if (condition) {
        return { pattern, name, score}
      }
    }
  }

  return { pattern: '', name: '', score: 0}
}
