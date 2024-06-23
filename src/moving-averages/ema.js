export class EMA {
  constructor(BigNumber, data, size) {
    this.BigNumber = BigNumber;
    this.size = size;
    this.alpha = BigNumber(2 / (size + 1));
    this.data = data;
    this.result = [];
    this.s = null;

    if (this.alpha.isGreaterThan(1)) {
      this.result = Array(data.length).fill(null);
    } else if (this.alpha.isEqualTo(1)) {
      this.result = [...data];
    } else {
      this.calculateInitialEMA();
    }
  }

  calculateInitialEMA() {
    const length = this.data.length;
    let i = 0;

    // Initialize the first value of EMA
    while (i < length) {
      const datum = this.data[i];
      if (typeof datum === 'object') {
        this.result[i] = datum;
        this.s = datum;
        i++;
        break;
      }
      i++;
    }

    // Calculate EMA for the rest of the data
    const o = this.BigNumber(1).minus(this.alpha);
    for (; i < length; i++) {
      const datum = this.data[i];
      this.s = typeof datum === 'object' ? this.alpha.multipliedBy(datum).plus(o.multipliedBy(this.s)) : this.result[i - 1];
      this.result[i] = this.s;
    }
  }

  add(dataPoint) {
    if (this.result.length === 0) {
      this.s = dataPoint;
      this.result.push(dataPoint);
    } else {
      const o = this.BigNumber(1).minus(this.alpha);
      this.s = this.alpha.multipliedBy(dataPoint).plus(o.multipliedBy(this.s));
      this.result.push(this.s);
    }
  }

  update(dataPoint) {
    if (this.result.length > 0) {
      const o = this.BigNumber(1).minus(this.alpha);
      if (this.result.length === 1) {
        this.s = dataPoint;
        this.result[0] = dataPoint;
      } else {
        this.s = this.alpha.multipliedBy(dataPoint).plus(o.multipliedBy(this.result[this.result.length - 2]));
        this.result[this.result.length - 1] = this.s;
      }
    }
  }

  get() {
    return this.result;
  }
}
