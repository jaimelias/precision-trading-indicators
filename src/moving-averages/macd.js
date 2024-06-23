import { EMA } from './ema.js';
import { arrayMath } from '../utilities/array-math.js';
import { findLastCross } from '../signals/find-last-cross.js';


export class MACD {
	constructor(BigNumber, data, fastLine = 12, slowLine = 26, signalLine = 9) {
	  this.BigNumber = BigNumber;
	  this.fastLine = fastLine;
	  this.slowLine = slowLine;
	  this.signalLine = signalLine;
	  this.data = data;
  
	  this.ema12 = new EMA(BigNumber, data, fastLine);
	  this.ema26 = new EMA(BigNumber, data, slowLine);
	  this.updateDiffAndDea();
	}
  
	updateDiffAndDea() {
	  const ema12Result = this.ema12.get();
	  const ema26Result = this.ema26.get();
	  this.diff = arrayMath(ema12Result, ema26Result, 'sub', this.BigNumber);
	  this.dea = new EMA(this.BigNumber, this.diff, this.signalLine);
	  this.deaResult = this.dea.get();
	  this.histogram = arrayMath(this.BigNumber(2), arrayMath(this.diff, this.deaResult, 'sub', this.BigNumber), 'mul', this.BigNumber);
	  const { crossType, crossInterval } = findLastCross({ fast: this.diff, slow: this.deaResult });
	  this.crossType = crossType;
	  this.crossInterval = crossInterval;
	}
  
	add(dataPoint) {
	  this.ema12.add(dataPoint);
	  this.ema26.add(dataPoint);
	  this.updateDiffAndDea();
	}
  
	update(dataPoint) {
	  this.ema12.update(dataPoint);
	  this.ema26.update(dataPoint);
	  this.updateDiffAndDea();
	}
  
	get() {
	  return {
		diff: this.diff,
		dea: this.deaResult,
		histogram: this.histogram,
		crossType: this.crossType,
		crossInterval: this.crossInterval
	  };
	}
  }