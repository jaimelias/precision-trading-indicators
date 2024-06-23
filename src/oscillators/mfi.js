
export class MFI {
  constructor(BigNumber, ohlcv, period = 14) {
    this.BigNumber = BigNumber;
    this.period = period;
    this.high = ohlcv.high;
    this.low = ohlcv.low;
    this.close = ohlcv.close;
    this.volume = ohlcv.volume;

    this.zero = BigNumber(0);
    this.hundred = BigNumber(100);
    this.one = BigNumber(1);

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
    }

    for (let i = 1; i < this.typicalPrices.length; i++) {
      if (this.typicalPrices[i].isGreaterThan(this.typicalPrices[i - 1])) {
        this.positiveMoneyFlows.push(this.rawMoneyFlows[i]);
        this.negativeMoneyFlows.push(this.zero);
      } else if (this.typicalPrices[i].isLessThan(this.typicalPrices[i - 1])) {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(this.rawMoneyFlows[i]);
      } else {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(this.zero);
      }
    }

    for (let i = this.period; i <= this.positiveMoneyFlows.length; i++) {
      const positiveMoneyFlowSlice = this.positiveMoneyFlows.slice(i - this.period, i);
      const negativeMoneyFlowSlice = this.negativeMoneyFlows.slice(i - this.period, i);

      const positiveMoneyFlowSum = positiveMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);
      const negativeMoneyFlowSum = negativeMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);

      const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
      this.moneyFlowRatios.push(moneyFlowRatio);
    }

    for (let i = 0; i < this.moneyFlowRatios.length; i++) {
      const moneyFlowIndex = this.hundred.minus(this.hundred.dividedBy(this.one.plus(this.moneyFlowRatios[i])));
      this.moneyFlowIndexes.push(moneyFlowIndex);
    }
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

    if (this.typicalPrices.length > 1) {
      const previousTypicalPrice = this.typicalPrices[this.typicalPrices.length - 2];

      if (typicalPrice.isGreaterThan(previousTypicalPrice)) {
        this.positiveMoneyFlows.push(rawMoneyFlow);
        this.negativeMoneyFlows.push(this.zero);
      } else if (typicalPrice.isLessThan(previousTypicalPrice)) {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(rawMoneyFlow);
      } else {
        this.positiveMoneyFlows.push(this.zero);
        this.negativeMoneyFlows.push(this.zero);
      }

      if (this.positiveMoneyFlows.length > this.period) {
        const positiveMoneyFlowSlice = this.positiveMoneyFlows.slice(-this.period);
        const negativeMoneyFlowSlice = this.negativeMoneyFlows.slice(-this.period);

        const positiveMoneyFlowSum = positiveMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);
        const negativeMoneyFlowSum = negativeMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);

        const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
        const moneyFlowIndex = this.hundred.minus(this.hundred.dividedBy(this.one.plus(moneyFlowRatio)));

        this.moneyFlowIndexes.push(moneyFlowIndex);

        if (this.moneyFlowIndexes.length > this.period) {
          this.moneyFlowIndexes.shift();
        }
      }
    }
  }

  update(ohlcv) {
    if (this.high.length > 0 && this.low.length > 0 && this.close.length > 0 && this.volume.length > 0) {
      this.high[this.high.length - 1] = ohlcv.high;
      this.low[this.low.length - 1] = ohlcv.low;
      this.close[this.close.length - 1] = ohlcv.close;
      this.volume[this.volume.length - 1] = ohlcv.volume;

      const typicalPrice = ohlcv.high.plus(ohlcv.low).plus(ohlcv.close).dividedBy(3);
      const rawMoneyFlow = typicalPrice.times(ohlcv.volume);

      this.typicalPrices[this.typicalPrices.length - 1] = typicalPrice;
      this.rawMoneyFlows[this.rawMoneyFlows.length - 1] = rawMoneyFlow;

      const previousTypicalPrice = this.typicalPrices[this.typicalPrices.length - 2];

      if (typicalPrice.isGreaterThan(previousTypicalPrice)) {
        this.positiveMoneyFlows[this.positiveMoneyFlows.length - 1] = rawMoneyFlow;
        this.negativeMoneyFlows[this.negativeMoneyFlows.length - 1] = this.zero;
      } else if (typicalPrice.isLessThan(previousTypicalPrice)) {
        this.positiveMoneyFlows[this.positiveMoneyFlows.length - 1] = this.zero;
        this.negativeMoneyFlows[this.negativeMoneyFlows.length - 1] = rawMoneyFlow;
      } else {
        this.positiveMoneyFlows[this.positiveMoneyFlows.length - 1] = this.zero;
        this.negativeMoneyFlows[this.negativeMoneyFlows.length - 1] = this.zero;
      }

      if (this.positiveMoneyFlows.length >= this.period) {
        const positiveMoneyFlowSlice = this.positiveMoneyFlows.slice(-this.period);
        const negativeMoneyFlowSlice = this.negativeMoneyFlows.slice(-this.period);

        const positiveMoneyFlowSum = positiveMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);
        const negativeMoneyFlowSum = negativeMoneyFlowSlice.reduce((sum, value) => sum.plus(value), this.zero);

        const moneyFlowRatio = positiveMoneyFlowSum.dividedBy(negativeMoneyFlowSum);
        const moneyFlowIndex = this.hundred.minus(this.hundred.dividedBy(this.one.plus(moneyFlowRatio)));

        this.moneyFlowIndexes[this.moneyFlowIndexes.length - 1] = moneyFlowIndex;
      }
    }
  }

  get() {
    return this.moneyFlowIndexes;
  }
}
