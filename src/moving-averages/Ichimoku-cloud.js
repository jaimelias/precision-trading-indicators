
import { findLastCross } from "../signals/find-last-cross.js" 

export const ICHIMOKU_CLOUD = (BigNumber, ohlcv) => {

    let {high, low, close} = ohlcv
    const TENKAN_SEN_PERIOD = 9
    const KIJUN_SEN_PERIOD = 26
    const SENKOU_SPAN_B_PERIOD = 52
    const SENKOU_SPAN_A_PERIOD = (TENKAN_SEN_PERIOD + KIJUN_SEN_PERIOD) / 2

    let tenkanSen = calculateAverage(BigNumber, high, low, TENKAN_SEN_PERIOD)
    let kijunSen = calculateAverage(BigNumber, high, low, KIJUN_SEN_PERIOD)
    let senkouSpanA = calculateSenkouSpanA(BigNumber, tenkanSen, kijunSen, SENKOU_SPAN_A_PERIOD)
    let senkouSpanB = calculateSenkouSpanB(BigNumber, high, low, SENKOU_SPAN_B_PERIOD)
    let chikouSpan = calculateChikouSpan(close, KIJUN_SEN_PERIOD)


    let startIndex = KIJUN_SEN_PERIOD
    tenkanSen = tenkanSen.slice(startIndex)
    kijunSen = kijunSen.slice(startIndex)
    senkouSpanA = senkouSpanA.slice(startIndex).filter(o => o && !isNaN(o))
    chikouSpan = chikouSpan.slice(0, -KIJUN_SEN_PERIOD)

    const {crossInterval, crossType} = findLastCross({fast: tenkanSen, slow: kijunSen})

    return {
        conversionLine: tenkanSen,
        baseLine: kijunSen,
        leadingSpanA: senkouSpanA,
        leadingSpanB: senkouSpanB,
        laggingSpan: chikouSpan,
        crossInterval,
        crossType
    }
}

const calculateAverage =  (BigNumber, high, low, period) => {
    let averages = []

    for (let i = period - 1; i < high.length; i++) {
        let sum = new BigNumber(0)
        for (let j = i; j > i - period; j--) {
            const calc = (high[j].plus(low[j])).dividedBy(2)
            sum = sum.plus(calc)
        }
        averages.push(sum.dividedBy(period))
    }

    return averages
}

const calculateSenkouSpanA = (BigNumber, tenkanSen, kijunSen, period) => {

    let senkouSpanA = []

    for (let i = 0; i < tenkanSen.length; i++) {
        if (i >= period - 1) {
            let sum = new BigNumber(0)
            for (let j = i; j > i - period; j--) {
                const calc = (tenkanSen[j].plus(kijunSen[j])).dividedBy(2)
                sum = sum.plus(calc)
            }
            senkouSpanA.push(sum.dividedBy(period))
        } else {
            senkouSpanA.push(null)
        }
    }

    return senkouSpanA
}

const calculateSenkouSpanB = (BigNumber, high, low, period) => {

    let senkouSpanB = []

    for (let i = period - 1; i < high.length; i++) {
        let maxHigh = new BigNumber.maximum(...high.slice(i - period + 1, i + 1))
        let minLow = new BigNumber.minimum(...low.slice(i - period + 1, i + 1))
        senkouSpanB.push((maxHigh.plus(minLow)).dividedBy(2))
    }

    return senkouSpanB
}

const calculateChikouSpan = (close, kijunSenPeriod) =>  close.slice(kijunSenPeriod)
