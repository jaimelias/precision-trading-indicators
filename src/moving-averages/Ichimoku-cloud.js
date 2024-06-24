import { findLastCross } from "../signals/find-last-cross.js";

export class IchimokuCloud {
  constructor(BigNumber, ohlcv) {
    this.BigNumber = BigNumber;
    this.ohlcv = ohlcv;

    // Ichimoku Cloud periods (constants)
    this.TENKAN_SEN_PERIOD = 9;
    this.KIJUN_SEN_PERIOD = 26;
    this.SENKOU_SPAN_B_PERIOD = 52;
    this.SENKOU_SPAN_A_PERIOD = Math.round((this.TENKAN_SEN_PERIOD + this.KIJUN_SEN_PERIOD) / 2); 

    this.updateLines(); 
  }

  updateLines() {
    // Destructure OHLCV data
    const { high, low, close } = this.ohlcv;

    // Calculate Ichimoku lines
    this.tenkanSen = this.calculateAverage(high, low, this.TENKAN_SEN_PERIOD);
    this.kijunSen = this.calculateAverage(high, low, this.KIJUN_SEN_PERIOD);

    // Optimize Senkou Span A calculation (no need for separate loop)
    this.senkouSpanA = this.tenkanSen.map((value, i) => value.plus(this.kijunSen[i]).dividedBy(2));  

    this.senkouSpanB = this.calculateAverage(high, low, this.SENKOU_SPAN_B_PERIOD);
    this.chikouSpan = close.slice(0, -this.KIJUN_SEN_PERIOD); // Slice to match other lines

    // Shift lines to align properly
    const startIndex = this.KIJUN_SEN_PERIOD;
    this.tenkanSen = this.tenkanSen.slice(startIndex);
    this.kijunSen = this.kijunSen.slice(startIndex);
    this.senkouSpanA = this.senkouSpanA.slice(startIndex - this.KIJUN_SEN_PERIOD); // Adjust for Senkou Span A shift
    this.senkouSpanB = this.senkouSpanB.slice(startIndex - this.KIJUN_SEN_PERIOD); // Adjust for Senkou Span B shift

    // Find crosses (ensure consistent lengths)
    const recentClose = close.slice(-this.tenkanSen.length); // Use recent close for crosses
    this.spanACross = findLastCross({ fast: recentClose, slow: this.senkouSpanA });
    this.spanBCross = findLastCross({ fast: recentClose, slow: this.senkouSpanB });
    this.baseCross = findLastCross({ fast: this.tenkanSen, slow: this.kijunSen });
  }


  add(ohlcvDataPoint) {
    this.ohlcv.high.push(ohlcvDataPoint.high);
    this.ohlcv.low.push(ohlcvDataPoint.low);
    this.ohlcv.close.push(ohlcvDataPoint.close);
    this.updateLines();
  }

  update(ohlcvDataPoint) {
    const lastIndex = this.ohlcv.high.length - 1;
    this.ohlcv.high[lastIndex] = ohlcvDataPoint.high;
    this.ohlcv.low[lastIndex] = ohlcvDataPoint.low;
    this.ohlcv.close[lastIndex] = ohlcvDataPoint.close;
    this.updateLines();
  }

  get() {
    return {
      conversionLine: this.tenkanSen,
      baseLine: this.kijunSen,
      leadingSpanA: this.senkouSpanA,
      leadingSpanB: this.senkouSpanB,
      laggingSpan: this.chikouSpan,
      crosses: {
        spanACross: this.spanACross,
        spanBCross: this.spanBCross,
        baseCross: this.baseCross
      }
    };
  }

  calculateAverage(high, low, period) {
    return high.slice(period - 1).map((_, i) => {
      const highSlice = high.slice(i, i + period);
      const lowSlice = low.slice(i, i + period);
      return this.BigNumber.maximum(...highSlice).plus(this.BigNumber.minimum(...lowSlice)).dividedBy(2);
    });
  }

  calculateSenkouSpanA(tenkanSen, kijunSen) {
    const senkouSpanA = [];
    for (let i = 0; i < tenkanSen.length; i++) {
      senkouSpanA.push(tenkanSen[i].plus(kijunSen[i]).dividedBy(2));
    }
    return senkouSpanA;
  }

  calculateSenkouSpanB(high, low, period) {
    const senkouSpanB = [];
    for (let i = period - 1; i < high.length; i++) {
      const highSlice = high.slice(i - period + 1, i + 1);
      const lowSlice = low.slice(i - period + 1, i + 1);
      const maxHigh = this.BigNumber.maximum(...highSlice);
      const minLow = this.BigNumber.minimum(...lowSlice);
      senkouSpanB.push(maxHigh.plus(minLow).dividedBy(2));
    }
    return senkouSpanB;
  }

  calculateChikouSpan(close, kijunSenPeriod) {
    return close.slice(0, close.length - kijunSenPeriod);
  }
}
