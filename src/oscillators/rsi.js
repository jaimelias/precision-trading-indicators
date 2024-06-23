
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
    this.pl = data.slice(0, period);

    if (data.length >= period) {
      this.calculateInitialRSI();
    }

    this.rsiEma = new EMA(BigNumber, this.rsi, emaPeriod);
    this.updateCross();
  }

  calculateInitialRSI() {
    for (let i = this.period, gain = this.zero, loss = this.zero; i < this.data.length; i++, gain = this.zero, loss = this.zero) {
      this.pl.push(this.data[i]);

      for (let q = 1; q < this.pl.length; q++) {
        const thisVal = this.BigNumber(this.pl[q]);
        const prevVal = this.BigNumber(this.pl[q - 1]);

        if (thisVal.minus(prevVal).isLessThan(this.zero)) {
          loss = loss.plus(thisVal.minus(prevVal).abs());
        } else {
          gain = gain.plus(thisVal.minus(prevVal));
        }
      }

      const gainPeriod = gain.dividedBy(this.period);
      const lossPeriod = loss.dividedBy(this.period);

      const gainLoss = lossPeriod.isEqualTo(this.zero) ? this.zero : gainPeriod.dividedBy(lossPeriod);

      this.rsi.push(
        this.hundred.minus(this.hundred.dividedBy(this.one.plus(gainLoss)))
      );

      this.pl.splice(0, 1);
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

    const thisVal = this.BigNumber(dataPoint);
    const prevVal = this.BigNumber(this.data[this.data.length - 2]);

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

    this.rsi.push(
      this.hundred.minus(this.hundred.dividedBy(this.one.plus(gainLoss)))
    );

    if (this.rsi.length > this.period) {
      this.rsi.shift();
    }

    this.rsiEma.add(this.rsi[this.rsi.length - 1]);
    this.updateCross();
  }

  update(dataPoint) {
    if (this.data.length > 0) {
      this.data[this.data.length - 1] = dataPoint;

      const thisVal = this.BigNumber(dataPoint);
      const prevVal = this.BigNumber(this.data[this.data.length - 2]);

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

      this.rsiEma.update(this.rsi[this.rsi.length - 1]);
      this.updateCross();
    }
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