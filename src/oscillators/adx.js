import { EMA } from '../moving-averages/ema.js';

export class ADX {
  constructor(BigNumber, ohlcv, period = 14) {
    this.BigNumber = BigNumber;
    this.ohlcv = ohlcv;
    this.period = period;

    this.calculateInitialValues();
  }

  calculateInitialValues() {
    let { high, low, close } = this.ohlcv;
    const zero = this.BigNumber(0);
    const hundred = this.BigNumber(100);
    const length = high.length;

    this.plusDM = [];
    this.minusDM = [];
    this.tr = [];
    this.diPlus = [];
    this.diMinus = [];
    this.dx = [];
    this.adx = [];

    for (let i = 1; i < length; i++) {
      const upMove = high[i].minus(high[i - 1]);
      const downMove = low[i - 1].minus(low[i]);
      const plusDmValue = (upMove.isGreaterThan(downMove) && upMove.isGreaterThan(0)) ? upMove : zero;
      const minusDmValue = (downMove.isGreaterThan(upMove) && downMove.isGreaterThan(0)) ? downMove : zero;
      const trueRangeValue = this.BigNumber.max(
        high[i].minus(low[i]),
        high[i].minus(close[i - 1]).abs(),
        low[i].minus(close[i - 1]).abs()
      );
      this.plusDM.push(plusDmValue);
      this.minusDM.push(minusDmValue);
      this.tr.push(trueRangeValue);
    }

    const emaPlusDM = new EMA(this.BigNumber, this.plusDM, this.period);
    const emaMinusDM = new EMA(this.BigNumber, this.minusDM, this.period);
    const emaTR = new EMA(this.BigNumber, this.tr, this.period);

    const emaPlusDMResult = emaPlusDM.get();
    const emaMinusDMResult = emaMinusDM.get();
    const emaTRResult = emaTR.get();

    // Ensure all EMA results have the same length
    if (emaPlusDMResult.length !== emaMinusDMResult.length || emaPlusDMResult.length !== emaTRResult.length) {
      throw new Error('EMA calculation results do not have matching lengths');
    }

    for (let i = 0; i < emaPlusDMResult.length; i++) {
      const diPlusValue = hundred.times(emaPlusDMResult[i].dividedBy(emaTRResult[i]));
      const diMinusValue = hundred.times(emaMinusDMResult[i].dividedBy(emaTRResult[i]));
      this.diPlus.push(diPlusValue);
      this.diMinus.push(diMinusValue);
    }

    for (let i = 0; i < this.diPlus.length; i++) {
      const diPlusValue = this.diPlus[i];
      const diMinusValue = this.diMinus[i];
      const dxValue = hundred.times(
        diPlusValue.minus(diMinusValue).abs().div(diPlusValue.plus(diMinusValue))
      );
      this.dx.push(dxValue);
    }

    const filteredDx = this.dx.filter(v => !isNaN(v.toNumber()));
    if (filteredDx.length >= this.period) {
      const initialADX = this.sum(filteredDx.slice(0, this.period)).div(this.period);
      this.adx.push(initialADX);

      for (let i = this.period; i < filteredDx.length; i++) {
        const currentADX = this.adx[i - this.period].times(this.period - 1).plus(filteredDx[i]).div(this.period);
        this.adx.push(currentADX);
      }
    }
  }

  sum(arr) {
    return arr.reduce((acc, val) => acc.plus(val), this.BigNumber(0));
  }

  add(ohlcvDataPoint) {
    this.ohlcv.high.push(ohlcvDataPoint.high);
    this.ohlcv.low.push(ohlcvDataPoint.low);
    this.ohlcv.close.push(ohlcvDataPoint.close);
    // Update only the latest values incrementally instead of recalculating everything
    this.updateRecentValues();
  }

  update(ohlcvDataPoint) {
    const lastIndex = this.ohlcv.high.length - 1;
    this.ohlcv.high[lastIndex] = ohlcvDataPoint.high;
    this.ohlcv.low[lastIndex] = ohlcvDataPoint.low;
    this.ohlcv.close[lastIndex] = ohlcvDataPoint.close;
    // Update only the latest values incrementally instead of recalculating everything
    this.updateRecentValues();
  }

  updateRecentValues() {
    // Logic to update only the most recent values incrementally
    // This method should update the latest +DM, -DM, TR, and re-calculate EMA, DI+, DI-, DX, and ADX values
  }

  get() {
    return {
      adx: this.adx,
      diMinus: this.diMinus,
      diPlus: this.diPlus
    };
  }
}
