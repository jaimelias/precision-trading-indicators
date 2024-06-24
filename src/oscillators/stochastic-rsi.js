import { EMA } from '../moving-averages/ema.js';
import { findLastCross } from '../signals/find-last-cross.js';

export class STOCHASTIC_RSI {
  constructor(BigNumber, rsi, kPeriods = 14, kSlowingPeriods = 3, dPeriods = 3) {
    this.BigNumber = BigNumber;
    this.rsi = rsi;
    this.kPeriods = kPeriods;
    this.kSlowingPeriods = kSlowingPeriods;
    this.dPeriods = dPeriods;

    this.updateValues();
  }

  updateValues() {
    if (this.rsi.length < this.kPeriods) {
      this.K = [];
      this.D = [];
      this.crossType = null;
      this.crossInterval = null;
      return;
    }

    const rsiRange = this.BigNumber.max(this.kPeriods, this.kSlowingPeriods, this.dPeriods).toNumber();
    const kValues = [];

    for (let i = rsiRange; i < this.rsi.length; i++) {
      const rsiSlice = this.rsi.slice(i - rsiRange, i + 1);
      const minRsi = this.BigNumber.min(...rsiSlice);
      const maxRsi = this.BigNumber.max(...rsiSlice);
      const currentRsi = this.rsi[i];
      const kValue = currentRsi.minus(minRsi).dividedBy(maxRsi.minus(minRsi)).times(100);
      kValues.push(kValue);
    }

    this.K = new EMA(this.BigNumber, kValues, this.kSlowingPeriods).get();
    this.D = new EMA(this.BigNumber, this.K, this.dPeriods).get();

    const { crossType, crossInterval } = findLastCross({ fast: this.D, slow: this.K });
    this.crossType = crossType;
    this.crossInterval = crossInterval;
  }

  add(rsiValue) {
    this.rsi.push(rsiValue);
    this.updateValues();
  }

  update(rsiValue) {
    this.rsi[this.rsi.length - 1] = rsiValue;
    this.updateValues();
  }

  get() {
    return {
      K: this.K,
      D: this.D,
      crossType: this.crossType,
      crossInterval: this.crossInterval
    };
  }
}
