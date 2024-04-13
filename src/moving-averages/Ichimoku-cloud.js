export function ICHIMOKU_CLOUD(ohlcv) {

    let {high, low, close} = ohlcv
    high = high.map(v => v.toNumber())
    low = low.map(v => v.toNumber())
    close = close.map(v => v.toNumber())

    const TENKAN_SEN_PERIOD = 9;
    const KIJUN_SEN_PERIOD = 26;
    const SENKOU_SPAN_B_PERIOD = 52;
    const SENKOU_SPAN_A_PERIOD = (TENKAN_SEN_PERIOD + KIJUN_SEN_PERIOD) / 2;

    let tenkanSen = calculateAverage(high, low, TENKAN_SEN_PERIOD);
    let kijunSen = calculateAverage(high, low, KIJUN_SEN_PERIOD);
    let senkouSpanA = calculateSenkouSpanA(tenkanSen, kijunSen, SENKOU_SPAN_A_PERIOD);
    let senkouSpanB = calculateSenkouSpanB(high, low, SENKOU_SPAN_B_PERIOD);
    let chikouSpan = calculateChikouSpan(close, KIJUN_SEN_PERIOD); // Corrected chikouSpan calculation

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

function calculateAverage(high, low, period) {
    let averages = [];
    for (let i = period - 1; i < high.length; i++) {
        let sum = 0;
        for (let j = i; j > i - period; j--) {
            sum += (high[j] + low[j]) / 2;
        }
        averages.push(sum / period);
    }
    return averages;
}

function calculateSenkouSpanA(tenkanSen, kijunSen, period) {
    let senkouSpanA = [];
    for (let i = 0; i < tenkanSen.length; i++) {
        if (i >= period - 1) {
            let sum = 0;
            for (let j = i; j > i - period; j--) {
                sum += (tenkanSen[j] + kijunSen[j]) / 2;
            }
            senkouSpanA.push(sum / period);
        } else {
            senkouSpanA.push(null); // Not enough data for calculation
        }
    }
    return senkouSpanA;
}

function calculateSenkouSpanB(high, low, period) {
    let senkouSpanB = [];
    for (let i = period - 1; i < high.length; i++) {
        let maxHigh = Math.max(...high.slice(i - period + 1, i + 1));
        let minLow = Math.min(...low.slice(i - period + 1, i + 1));
        senkouSpanB.push((maxHigh + minLow) / 2);
    }
    return senkouSpanB;
}

function calculateChikouSpan(close, kijunSenPeriod) {
    return close.slice(kijunSenPeriod); // Just slice the close prices
}
