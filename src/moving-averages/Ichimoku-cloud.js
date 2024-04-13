export function ICHIMOKU_CLOUD(BigNumber, ohlcv) {

    let {high, low, close} = ohlcv
    const TENKAN_SEN_PERIOD = 9;
    const KIJUN_SEN_PERIOD = 26;
    const SENKOU_SPAN_B_PERIOD = 52;
    const SENKOU_SPAN_A_PERIOD = (TENKAN_SEN_PERIOD + KIJUN_SEN_PERIOD) / 2;

    let tenkanSen = calculateAverage(BigNumber, high, low, TENKAN_SEN_PERIOD);
    let kijunSen = calculateAverage(BigNumber, high, low, KIJUN_SEN_PERIOD);
    let senkouSpanA = calculateSenkouSpanA(BigNumber, tenkanSen, kijunSen, SENKOU_SPAN_A_PERIOD);
    let senkouSpanB = calculateSenkouSpanB(BigNumber, high, low, SENKOU_SPAN_B_PERIOD);
    let chikouSpan = calculateChikouSpan(close, KIJUN_SEN_PERIOD); 

    let startIndex = KIJUN_SEN_PERIOD;
    tenkanSen = tenkanSen.slice(startIndex);
    kijunSen = kijunSen.slice(startIndex);
    senkouSpanA = senkouSpanA.slice(startIndex);
    chikouSpan = chikouSpan.slice(0, -KIJUN_SEN_PERIOD);
    senkouSpanB = senkouSpanB.slice(startIndex);

    return {
        conversionLine: tenkanSen,
        baseLine: kijunSen,
        leadingSpanA: senkouSpanA,
        leadingSpanB: senkouSpanB,
        laggingSpan: chikouSpan
    };
}

function calculateAverage(BigNumber, high, low, period) {
    let averages = [];
    for (let i = period - 1; i < high.length; i++) {
        let sum = BigNumber(0);
        for (let j = i; j > i - period; j--) {
            sum = (high[j].plus(low[j])).dividedBy(2)
        }
        averages.push(sum.dividedBy(period));
    }
    return averages;
}

function calculateSenkouSpanA(BigNumber, tenkanSen, kijunSen, period) {
    let senkouSpanA = [];
    for (let i = 0; i < tenkanSen.length; i++) {
        if (i >= period - 1) {
            let sum = BigNumber(0);
            for (let j = i; j > i - period; j--) {
                sum = (tenkanSen[j].plus(kijunSen[j])).dividedBy(2)
            }
            senkouSpanA.push(sum.dividedBy(period));
        } else {
            senkouSpanA.push(null); // Not enough data for calculation
        }
    }
    return senkouSpanA;
}

function calculateSenkouSpanB(BigNumber, high, low, period) {
    let senkouSpanB = [];
    for (let i = period - 1; i < high.length; i++) {
        let maxHigh = BigNumber.maximum(...high.slice(i - period + 1, i + 1));
        let minLow = BigNumber.minimum(...low.slice(i - period + 1, i + 1));
        senkouSpanB.push((maxHigh.plus(minLow)).dividedBy(2));
    }
    return senkouSpanB;
}

function calculateChikouSpan(close, kijunSenPeriod) {
    return close.slice(kijunSenPeriod); // Just slice the close prices
}
