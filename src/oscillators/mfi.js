export class MFI {
  constructor(BigNumber, ohlcv, period = 14) {
    this.BigNumber = BigNumber;
    this.period = period;
    this.high = ohlcv.high;
    this.low = ohlcv.low;
    this.close = ohlcv.close;
    this.volume = ohlcv.volume;

    this.zero = new BigNumber(0);
    this.hundred = new BigNumber(100);
    this.one = new BigNumber(1);

    this.typicalPrices = [];
    this.rawMoneyFlows = [];
    this.positiveMoneyFlows = [];
    this.negativeMoneyFlows = [];
    this.moneyFlowRatios = [];
    this.moneyFlowIndexes = [];

    this.calculateInitialMFI();
  }

  calculateInitialMFI() {
    for (let i = 0; i < this.close.length; i++) {
      const typicalPrice = this.high[i].plus(this.low[i]).plus(this.close[i]).dividedBy(3);
      const rawMoneyFlow = typicalPrice.times(this.volume[i]);

      this.typicalPrices.push(typicalPrice);
      this.rawMoneyFlows.push(rawMoneyFlow);
      
      if (i > 0) {
        if (typicalPrice.isGreaterThan(this.typicalPrices[i - 1])) {
          this.positiveMoneyFlows.push(rawMoneyFlow);
          this.negativeMoneyFlows.push(this.zero);
        } else if (typicalPrice.isLessThan(this.typicalPrices[i - 1])) {
          this.positiveMoneyFlows.push(this.zero);
          this.negativeMoneyFlows.push(rawMoneyFlow);
        } else {
          this.positiveMoneyFlows.push(this.zero);
          this.negativeMoneyFlows.push(this.zero);
        }
      } else {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(this.zero);
      }
    }

    for (let i = this.period; i <= this.positiveMoneyFlows.length; i++) {
      const positiveMoneyFlowSum = this.positiveMoneyFlows.slice(i - this.period, i).reduce((sum, value) => sum.plus(value), this.zero);
      const negativeMoneyFlowSum = this.negativeMoneyFlows.slice(i - this.period, i).reduce((sum, value) => sum.plus(value), this.zero);

      if (negativeMoneyFlowSum.isEqualTo(this.zero)) {
        this.moneyFlowRatios.push(this.hundred);  // or handle as needed
      } else {
        const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
        this.moneyFlowRatios.push(moneyFlowRatio);
      }
    }

    this.moneyFlowIndexes = this.moneyFlowRatios.map(mfr => this.hundred.minus(this.hundred.dividedBy(this.one.plus(mfr))));
  }

  add(ohlcv) {
    this.high.push(ohlcv.high);
    this.low.push(ohlcv.low);
    this.close.push(ohlcv.close);
    this.volume.push(ohlcv.volume);

    const typicalPrice = ohlcv.high.plus(ohlcv.low).plus(ohlcv.close).dividedBy(3);
    const rawMoneyFlow = typicalPrice.times(ohlcv.volume);

    this.typicalPrices.push(typicalPrice);
    this.rawMoneyFlows.push(rawMoneyFlow);

    const lastIndex = this.typicalPrices.length - 1;
    if (lastIndex > 0) {
      if (typicalPrice.isGreaterThan(this.typicalPrices[lastIndex - 1])) {
        this.positiveMoneyFlows.push(rawMoneyFlow);
        this.negativeMoneyFlows.push(this.zero);
      } else if (typicalPrice.isLessThan(this.typicalPrices[lastIndex - 1])) {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(rawMoneyFlow);
      } else {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(this.zero);
      }
    }

    if (this.positiveMoneyFlows.length > this.period) {
      const positiveMoneyFlowSum = this.positiveMoneyFlows.slice(-this.period).reduce((sum, value) => sum.plus(value), this.zero);
      const negativeMoneyFlowSum = this.negativeMoneyFlows.slice(-this.period).reduce((sum, value) => sum.plus(value), this.zero);

      let moneyFlowIndex;
      if (negativeMoneyFlowSum.isEqualTo(this.zero)) {
        moneyFlowIndex = this.hundred;  // or handle as needed
      } else {
        const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
        moneyFlowIndex = this.hundred.minus(this.hundred.dividedBy(this.one.plus(moneyFlowRatio)));
      }

      this.moneyFlowIndexes.push(moneyFlowIndex);

      if (this.moneyFlowIndexes.length > this.period) {
        this.moneyFlowIndexes.shift();
      }
    }
  }

  update(ohlcv) {
    if (this.high.length > 0 && this.low.length > 0 && this.close.length > 0 && this.volume.length > 0) {
      const lastIndex = this.high.length - 1;
      this.high[lastIndex] = ohlcv.high;
      this.low[lastIndex] = ohlcv.low;
      this.close[lastIndex] = ohlcv.close;
      this.volume[lastIndex] = ohlcv.volume;

      const typicalPrice = ohlcv.high.plus(ohlcv.low).plus(ohlcv.close).dividedBy(3);
      const rawMoneyFlow = typicalPrice.times(ohlcv.volume);

      this.typicalPrices[lastIndex] = typicalPrice;
      this.rawMoneyFlows[lastIndex] = rawMoneyFlow;

      const previousTypicalPrice = this.typicalPrices[lastIndex - 1];
      
      if (typicalPrice.isGreaterThan(previousTypicalPrice)) {
        this.positiveMoneyFlows[lastIndex] = rawMoneyFlow;
        this.negativeMoneyFlows[lastIndex] = this.zero;
      } else if (typicalPrice.isLessThan(previousTypicalPrice)) {
        this.positiveMoneyFlows[lastIndex] = this.zero;
        this.negativeMoneyFlows[lastIndex] = rawMoneyFlow;
      } else {
        this.positiveMoneyFlows[lastIndex] = this.zero;
        this.negativeMoneyFlows[lastIndex] = this.zero;
      }

      if (this.positiveMoneyFlows.length >= this.period) {
        const positiveMoneyFlowSum = this.positiveMoneyFlows.slice(-this.period).reduce((sum, value) => sum.plus(value), this.zero);
        const negativeMoneyFlowSum = this.negativeMoneyFlows.slice(-this.period).reduce((sum, value) => sum.plus(value), this.zero);

        let moneyFlowIndex;
        if (negativeMoneyFlowSum.isEqualTo(this.zero)) {
          moneyFlowIndex = this.hundred;  // or handle as needed
        } else {
          const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
          moneyFlowIndex = this.hundred.minus(this.hundred.dividedBy(this.one.plus(moneyFlowRatio)));
        }

        this.moneyFlowIndexes[lastIndex] = moneyFlowIndex;
      }
    }
  }

  get() {
    return this.moneyFlowIndexes;
  }
}
