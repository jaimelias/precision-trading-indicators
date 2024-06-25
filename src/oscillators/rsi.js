import { EMA } from "../moving-averages/ema.js";
import { findLastCross } from "../signals/find-last-cross.js";

export class RSI {
  constructor(BigNumber, data, period = 14, emaPeriod = 14) {
    this.BigNumber = BigNumber;
    this.period = period;
    this.emaPeriod = emaPeriod;
    this.data = data;

    this.zero = BigNumber(0);
    this.hundred = BigNumber(100);
    this.one = BigNumber(1);

    this.rsi = [];
    this.pl = data.slice(0, period + 1);

    if (data.length >= period) {
      this.calculateInitialRSI();
    }

    this.rsiEma = new EMA(BigNumber, this.rsi, emaPeriod);
    this.updateCross();
  }

  calculateInitialRSI() {
    let gain = this.zero;
    let loss = this.zero;

    for (let i = 1; i < this.period; i++) {
      const thisVal = this.BigNumber(this.data[i]);
      const prevVal = this.BigNumber(this.data[i - 1]);

      if (thisVal.minus(prevVal).isLessThan(this.zero)) {
        loss = loss.plus(thisVal.minus(prevVal).abs());
      } else {
        gain = gain.plus(thisVal.minus(prevVal));
      }
    }

    let avgGain = gain.dividedBy(this.period);
    let avgLoss = loss.dividedBy(this.period);

    for (let i = this.period; i < this.data.length; i++) {
      const thisVal = this.BigNumber(this.data[i]);
      const prevVal = this.BigNumber(this.data[i - 1]);

      if (thisVal.minus(prevVal).isLessThan(this.zero)) {
        loss = thisVal.minus(prevVal).abs();
        gain = this.zero;
      } else {
        gain = thisVal.minus(prevVal);
        loss = this.zero;
      }

      avgGain = avgGain.times(this.period - 1).plus(gain).dividedBy(this.period);
      avgLoss = avgLoss.times(this.period - 1).plus(loss).dividedBy(this.period);

      const rs = avgLoss.isEqualTo(this.zero) ? this.hundred : avgGain.dividedBy(avgLoss);
      this.rsi.push(this.hundred.minus(this.hundred.dividedBy(this.one.plus(rs))));
    }
  }

  updateCross() {
    const rsiEmaResult = this.rsiEma.get();
    const { crossType, crossInterval } = findLastCross({ fast: this.rsi, slow: rsiEmaResult });
    this.crossType = crossType;
    this.crossInterval = crossInterval;
  }

  add(dataPoint) {
    this.data.push(dataPoint);

    this.calculateAndUpdateRSI(this.data.length - 1);

    if (this.rsi.length > this.period) {
      this.rsi.shift();
    }

    this.rsiEma.add(this.rsi[this.rsi.length - 1]);
    this.updateCross();
  }

  update(dataPoint) {
    if (this.data.length > 0) {
      this.data[this.data.length - 1] = dataPoint;
      this.calculateAndUpdateRSI(this.data.length - 1);
      this.rsiEma.update(this.rsi[this.rsi.length - 1]);
      this.updateCross();
    }
  }

  calculateAndUpdateRSI(index) {
    const thisVal = this.BigNumber(this.data[index]);
    const prevVal = this.BigNumber(this.data[index - 1]);

    let gain = this.zero;
    let loss = this.zero;

    if (thisVal.minus(prevVal).isLessThan(this.zero)) {
      loss = loss.plus(thisVal.minus(prevVal).abs());
    } else {
      gain = gain.plus(thisVal.minus(prevVal));
    }

    const gainPeriod = gain.dividedBy(this.period);
    const lossPeriod = loss.dividedBy(this.period);

    const gainLoss = lossPeriod.isEqualTo(this.zero) ? this.zero : gainPeriod.dividedBy(lossPeriod);

    this.rsi[this.rsi.length - 1] = this.hundred.minus(this.hundred.dividedBy(this.one.plus(gainLoss)));
  }

  get() {
    return {
      rsi: this.rsi,
      rsiEma: this.rsiEma.get(),
      crossType: this.crossType,
      crossInterval: this.crossInterval
    };
  }
}
