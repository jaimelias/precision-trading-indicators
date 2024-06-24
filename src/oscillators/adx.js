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
      this.emaPlusDM = [];
      this.emaMinusDM = [];
      this.emaTR = [];
      this.diPlus = [];
      this.diMinus = [];
      this.dx = [];
      this.adx = [];
  
      // Calculate +DM, -DM, and true range for each period
      for (let i = 1; i < length; i++) {
        const upMove = high[i].minus(high[i - 1]);
        const downMove = low[i - 1].minus(low[i]);
        const plusDmValue = (upMove.isGreaterThan(downMove) && upMove.isGreaterThan(0)) ? upMove : zero;
        const minusDmValue = (downMove.isGreaterThan(upMove) && downMove.isGreaterThan(0)) ? downMove : zero;
        const trueRangeValue = this.BigNumber.max(high[i].minus(low[i]), high[i].minus(close[i - 1]).abs(), low[i].minus(close[i - 1]).abs());
        this.plusDM.push(plusDmValue);
        this.minusDM.push(minusDmValue);
        this.tr.push(trueRangeValue);
      }
  
      // Calculate initial EMA values for +DM, -DM, and TR
      for (let i = this.period; i < length; i++) {
        const initialEMAPlusDM = this.sum(this.plusDM.slice(i - this.period, i)).dividedBy(this.period);
        const initialEMAMinusDM = this.sum(this.minusDM.slice(i - this.period, i)).dividedBy(this.period);
        const initialEMATR = this.sum(this.tr.slice(i - this.period, i)).dividedBy(this.period);
        this.emaPlusDM.push(initialEMAPlusDM);
        this.emaMinusDM.push(initialEMAMinusDM);
        this.emaTR.push(initialEMATR);
      }
  
      // Calculate +DI and -DI for each period
      for (let i = 0; i < this.emaPlusDM.length; i++) {
        const diPlusValue = hundred.times(this.emaPlusDM[i].dividedBy(this.emaTR[i]));
        const diMinusValue = hundred.times(this.emaMinusDM[i].dividedBy(this.emaTR[i]));
        this.diPlus.push(diPlusValue);
        this.diMinus.push(diMinusValue);
      }
  
      // Calculate the directional movement index (DX) for each period
      for (let i = this.period; i < this.emaPlusDM.length; i++) {
        const diPlusPeriodSum = this.sum(this.diPlus.slice(i - this.period + 1, i + 1));
        const diMinusPeriodSum = this.sum(this.diMinus.slice(i - this.period + 1, i + 1));
        const dxValue = hundred.times(diPlusPeriodSum.minus(diMinusPeriodSum).abs().div(diPlusPeriodSum.plus(diMinusPeriodSum)));
        this.dx.push(dxValue);
      }
  
      // Filter NaN values and ensure length
      const filteredDx = this.dx.filter(v => !isNaN(v));
      if (filteredDx.length >= this.period - 1) {
        // Calculate the initial value of ADX
        const initialADX = this.sum(filteredDx.slice(0, this.period - 1)).div(this.period - 1);
        this.adx.push(initialADX);
  
        // Calculate the ADX for each period
        for (let i = this.period - 1; i < filteredDx.length; i++) {
          const currentADX = this.adx[i - this.period + 1].times(this.period - 1).plus(filteredDx[i]).div(this.period);
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
      this.calculateInitialValues();
    }
  
    update(ohlcvDataPoint) {
      const lastIndex = this.ohlcv.high.length - 1;
      this.ohlcv.high[lastIndex] = ohlcvDataPoint.high;
      this.ohlcv.low[lastIndex] = ohlcvDataPoint.low;
      this.ohlcv.close[lastIndex] = ohlcvDataPoint.close;
      this.calculateInitialValues();
    }
  
    get() {
      return {
        adx: this.adx,
        diMinus: this.diMinus,
        diPlus: this.diPlus
      };
    }
  }
  