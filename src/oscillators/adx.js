export const ADX = (BigNumber, ohlcv, period = 14) => {
	let {
		high,
		low,
		close
	} = ohlcv;
	const zero = BigNumber(0);
	const hundred = BigNumber(100);
	// Helper function to sum an array of numbers
	const sum = arr => arr.reduce((acc, val) => acc.plus(val), zero);
	//console.log([low, high, close]);
	const plusDM = []; // Array to store +DM values
	const minusDM = []; // Array to store -DM values
	const tr = []; // Array to store true range values
	const emaPlusDM = []; // Array to store EMA of +DM values
	const emaMinusDM = []; // Array to store EMA of -DM values
	const emaTR = []; // Array to store EMA of true range values
	const diPlus = []; // Array to store +DI values
	const diMinus = []; // Array to store -DI values
	let dx = []; // Array to store DX values
	const adx = []; // Array to store ADX values
	// Calculate +DM, -DM, and true range for each period
	for (let i = 1; i < high.length; i++) {
		const upMove = high[i].minus(high[i - 1]);
		const downMove = low[i - 1].minus(low[i]);
		const plusDmValue = (upMove.isGreaterThan(downMove) && upMove.isGreaterThan(0)) ? upMove : zero;
		const minusDmValue = (downMove.isGreaterThan(upMove) && downMove.isGreaterThan(0)) ? downMove : zero;
		const trueRangeValue = BigNumber.max(high[i].minus(low[i]), high[i].minus(close[i - 1]).abs(), low[i].minus(close[i - 1]).abs());
		plusDM.push(plusDmValue);
		minusDM.push(minusDmValue);
		tr.push(trueRangeValue);
	}
	// Calculate the initial values of EMA for +DM, -DM, and true range
	const initialEMAPlusDM = sum(plusDM.slice(0, period)).dividedBy(period);
	const initialEMAMinusDM = sum(minusDM.slice(0, period)).dividedBy(period);
	const initialEMATR = sum(tr.slice(0, period)).dividedBy(period);
	emaPlusDM.push(initialEMAPlusDM);
	emaMinusDM.push(initialEMAMinusDM);
	emaTR.push(initialEMATR);
	// Calculate the EMA of +DM, -DM, and true range for each period
	for (let i = period; i < high.length; i++) {
		const currentEMAPlusDM = emaPlusDM[i - period].times(period - 1).plus(plusDM[i]).dividedBy(period);
		const currentEMAMinusDM = emaMinusDM[i - period].times(period - 1).plus(minusDM[i]).dividedBy(period);
		const currentEMATR = emaTR[i - period].times(period - 1).plus(tr[i]).dividedBy(period);
		emaPlusDM.push(currentEMAPlusDM);
		emaMinusDM.push(currentEMAMinusDM);
		emaTR.push(currentEMATR);
	}
	// Calculate +DI and -DI for each period
	for (let i = 0; i < emaPlusDM.length; i++) {
		const diPlusValue = hundred.times(emaPlusDM[i].dividedBy(emaTR[i]));
		const diMinusValue = hundred.times(emaMinusDM[i].dividedBy(emaTR[i]));
		diPlus.push(diPlusValue);
		diMinus.push(diMinusValue);
	}
	// Calculate the directional movement index (DX) for each period
	for (let i = period; i < emaPlusDM.length; i++) {
		const diPlusPeriodSum = diPlus.slice(i - period + 1, i + 1).reduce((a, b) => a.plus(b));
		const diMinusPeriodSum = diMinus.slice(i - period + 1, i + 1).reduce((a, b) => a.plus(b));
		const dxValue = hundred.times(diPlusPeriodSum.minus(diMinusPeriodSum).abs().div(diPlusPeriodSum.plus(diMinusPeriodSum)));
		dx.push(dxValue);
	}
	if (dx.length >= 2 * period - 1) {
		dx = dx.filter(v => !isNaN(v));
	}
	// Calculate the initial value of ADX
	const initialADX = dx.slice(0, period).reduce((a, b) => a.plus(b)).div(period);
	adx.push(initialADX);
	// Calculate the ADX for each period
	for (let i = period; i < dx.length; i++) {
		const currentADX = adx[i - period].times(period - 1).plus(dx[i]).div(period);
		adx.push(currentADX);
	}
	// Return the ADX values
	return adx;
}


