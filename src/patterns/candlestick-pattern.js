export class getCandlestickPattern {
  constructor({ open, high, low, close }) {
    this.open = open;
    this.high = high;
    this.low = low;
    this.close = close;
  }

  get() {
    if (![this.open, this.high, this.low, this.close].every(arr => Array.isArray(arr) && arr.length > 1)) {
      return { pattern: '', name: '', score: 0 };
    }

    const prevIndex = this.open.length - 2;
    const currIndex = this.open.length - 1;

    const prev = {
      open: Number(this.open[prevIndex]),
      high: Number(this.high[prevIndex]),
      low: Number(this.low[prevIndex]),
      close: Number(this.close[prevIndex])
    };

    const curr = {
      open: Number(this.open[currIndex]),
      high: Number(this.high[currIndex]),
      low: Number(this.low[currIndex]),
      close: Number(this.close[currIndex])
    };

    const conditions = {
      bullish: [
        { name: 'Engulfing', condition: curr.low < prev.low && curr.high > prev.high && curr.close > curr.open, score: 2 },
        { name: 'Piercing Line', condition: curr.close > prev.close && curr.open < prev.open && curr.close > ((prev.open + prev.close) / 2), score: 1 },
        { name: 'Morning Star', condition: curr.close > prev.close && curr.open < prev.open && prev.close < prev.open, score: 2 },
        { name: 'Harami', condition: curr.close < prev.open && curr.open > prev.close && curr.close < prev.close && curr.open > prev.open, score: 1 },
        { name: 'Doji', condition: Math.abs(curr.close - curr.open) < (curr.close * 0.01), score: 0 },
        { name: 'Marubozu', condition: Math.abs(curr.close - curr.open) > (curr.close * 0.99), score: 3 },
        { name: 'Belt Hold', condition: curr.open > prev.open && curr.close === curr.high && prev.close === prev.low, score: 1 },
        { name: 'Kicker', condition: curr.open > prev.close && curr.close > curr.open, score: 2 }
      ],
      bearish: [
        { name: 'Engulfing', condition: curr.high > prev.high && curr.low < prev.low && curr.close < curr.open, score: -2 },
        { name: 'Dark Cloud Cover', condition: curr.close < prev.close && curr.open > prev.open && curr.close < ((prev.open + prev.close) / 2), score: -1 },
        { name: 'Evening Star', condition: curr.close < prev.close && curr.open > prev.open && prev.close > prev.open, score: -2 },
        { name: 'Harami', condition: curr.close > prev.open && curr.open < prev.close && curr.close > prev.close && curr.open < prev.open, score: -1 },
        { name: 'Doji', condition: Math.abs(curr.close - curr.open) < (curr.close * 0.01), score: 0 },
        { name: 'Marubozu', condition: Math.abs(curr.close - curr.open) > (curr.close * 0.99), score: -3 },
        { name: 'Belt Hold', condition: curr.open < prev.open && curr.close === curr.low && prev.close === prev.high, score: -1 },
        { name: 'Kicker', condition: curr.open < prev.close && curr.close < curr.open, score: -2 }
      ]
    };

    for (const pattern of ['bullish', 'bearish']) {
      for (const { name, condition, score } of conditions[pattern]) {
        if (condition) {
          return { pattern, name, score };
        }
      }
    }

    return { pattern: '', name: '', score: 0 };
  }

  add({ open, high, low, close }) {
    this.open.push(open);
    this.high.push(high);
    this.low.push(low);
    this.close.push(close);
  }

  update({ open, high, low, close }) {
    const lastIndex = this.open.length - 1;
    this.open[lastIndex] = open;
    this.high[lastIndex] = high;
    this.low[lastIndex] = low;
    this.close[lastIndex] = close;
  }
}
