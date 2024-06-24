import { MA } from './ma.js';
import { arrayMath } from '../utilities/array-math.js';
import { bollingerBandsLocation } from '../signals/bollinger-bands-location.js';

export class BollingerBands {
  constructor(BigNumber, data, size = 20, times = 2) {
    this.BigNumber = BigNumber;
    this.size = size;
    this.times = BigNumber(times);
    this.data = data;

    this.avg = new MA(BigNumber, data, size);
    this.sd = this.calculateDeviation();
    this.updateBands();
  }

  calculateDeviation() {
    const zero = this.BigNumber(0);
    const length = this.data.length;
    const avg = this.avg.get();
    const ret = [];

    let i = this.size - 1;
    let j;
    let sum;

    for (; i < length; i++) {
      sum = zero;
      j = i - this.size + 1;

      for (; j <= i; j++) {
        sum = sum.plus(this.data[j].minus(avg[i]).pow(2));
      }

      ret[i] = sum.dividedBy(this.size).sqrt();
    }

    return ret;
  }

  updateBands() {
    const avg = this.avg.get();
    const sd = this.sd;

    const timesSd = arrayMath(sd, this.times, 'mul', this.BigNumber);

    this.upper = arrayMath(avg, timesSd, 'add', this.BigNumber);
    this.mid = avg;
    this.lower = arrayMath(avg, timesSd, 'sub', this.BigNumber);
  }

  add(dataPoint) {
    this.data.push(dataPoint);
    this.avg.add(dataPoint);
    this.sd = this.calculateDeviation();
    this.updateBands();
  }

  update(dataPoint) {
    this.data[this.data.length - 1] = dataPoint;
    this.avg.update(dataPoint);
    this.sd = this.calculateDeviation();
    this.updateBands();
  }

  get() {
    const lastValue = this.data[this.data.length - 1];
    const loc = bollingerBandsLocation(lastValue, { upper: this.upper, mid: this.mid, lower: this.lower });
    return { upper: this.upper, mid: this.mid, lower: this.lower, loc };
  }
}