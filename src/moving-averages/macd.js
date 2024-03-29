import { EMA } from './ema.js';
import { arrayMath } from '../utilities/array-math.js';
import { findLastCross } from '../signals/find-last-cross.js';


export const MACD = (BigNumber, data, fastLine = 12, slowLine = 26, signalLine = 9) => {

	const ema12 = EMA(BigNumber, data, fastLine);
	const ema26 = EMA(BigNumber, data, slowLine);
	const diff = arrayMath(ema12, ema26, 'sub', BigNumber);
	const dea = EMA(BigNumber, diff, signalLine);
	const histogram = arrayMath(BigNumber(2), arrayMath(diff, dea, 'sub', BigNumber), 'mul', BigNumber);
	const {crossType, crossInterval} = findLastCross({fast: diff, slow: dea});


	return {
		diff, 
		dea,
		histogram,
		crossType, 
		crossInterval
	};
}