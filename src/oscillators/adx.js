export const ADX = (BigNumber, ohlcv, period = 14) => {
    let { high, low, close } = ohlcv;
    const zero = BigNumber(0);
    const hundred = BigNumber(100);
    const length = high.length;
    
    // Helper function to sum an array of numbers
    const sum = arr => arr.reduce((acc, val) => acc.plus(val), zero);

    const plusDM = [];
    const minusDM = [];
    const tr = [];
    const emaPlusDM = [];
    const emaMinusDM = [];
    const emaTR = [];
    const diPlus = [];
    const diMinus = [];
    const dx = [];
    const adx = [];

    // Calculate +DM, -DM, and true range for each period
    for (let i = 1; i < length; i++) {
        const upMove = high[i].minus(high[i - 1]);
        const downMove = low[i - 1].minus(low[i]);
        const plusDmValue = (upMove.isGreaterThan(downMove) && upMove.isGreaterThan(0)) ? upMove : zero;
        const minusDmValue = (downMove.isGreaterThan(upMove) && downMove.isGreaterThan(0)) ? downMove : zero;
        const trueRangeValue = BigNumber.max(high[i].minus(low[i]), high[i].minus(close[i - 1]).abs(), low[i].minus(close[i - 1]).abs());
        plusDM.push(plusDmValue);
        minusDM.push(minusDmValue);
        tr.push(trueRangeValue);
        
        if (i >= period) {
            const initialEMAPlusDM = sum(plusDM.slice(i - period, i)).dividedBy(period);
            const initialEMAMinusDM = sum(minusDM.slice(i - period, i)).dividedBy(period);
            const initialEMATR = sum(tr.slice(i - period, i)).dividedBy(period);
            emaPlusDM.push(initialEMAPlusDM);
            emaMinusDM.push(initialEMAMinusDM);
            emaTR.push(initialEMATR);
        }
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
        const diPlusPeriodSum = sum(diPlus.slice(i - period + 1, i + 1));
        const diMinusPeriodSum = sum(diMinus.slice(i - period + 1, i + 1));
        const dxValue = hundred.times(diPlusPeriodSum.minus(diMinusPeriodSum).abs().div(diPlusPeriodSum.plus(diMinusPeriodSum)));
        dx.push(dxValue);
    }

    // Filter NaN values and ensure length
    const filteredDx = dx.filter(v => !isNaN(v));
    if (filteredDx.length >= period - 1) {
        // Calculate the initial value of ADX
        const initialADX = sum(filteredDx.slice(0, period - 1)).div(period - 1);
        adx.push(initialADX);

        // Calculate the ADX for each period
        for (let i = period - 1; i < filteredDx.length; i++) {
            const currentADX = adx[i - period + 1].times(period - 1).plus(filteredDx[i]).div(period);
            adx.push(currentADX);
        }
    }

    return {adx, diMinus, diPlus};
}
