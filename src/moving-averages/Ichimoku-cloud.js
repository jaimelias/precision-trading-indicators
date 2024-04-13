import { findLastCross } from "../signals/find-last-cross"

export const ICHIMOKU_CLOUD = (BigNumber, ohlcv) => {
    const {high, low, close} = ohlcv
    const conversionPeriods = 9
    const basePeriods = 26
    const spanBPeriods = 52
    const displacement = 26
    const len = close.length

    let conversionLine = new Array(len)
    let baseLine = new Array(len)
    let leadingSpanA = new Array(len + displacement)
    let leadingSpanB = new Array(len + displacement)
    let laggingSpan = new Array(len)

    for (let i = 0; i < len; i++) {
        if (i >= conversionPeriods - 1) {
            const { highest: highConversion, lowest: lowConversion } = calculateHighLow(BigNumber, high, i - conversionPeriods + 1, i + 1)
            conversionLine[i] = highConversion.plus(lowConversion).dividedBy(2)
        }

        if (i >= basePeriods - 1) {
            const { highest: highBase, lowest: lowBase } = calculateHighLow(BigNumber, low, i - basePeriods + 1, i + 1)
            baseLine[i] = highBase.plus(lowBase).dividedBy(2)
        }

        if (i >= spanBPeriods - 1) {
            const { highest: highSpanB, lowest: lowSpanB } = calculateHighLow(BigNumber, low, i - spanBPeriods + 1, i + 1)
            leadingSpanB[i + displacement] = highSpanB.plus(lowSpanB).dividedBy(2)
        }

        if (conversionLine[i] && baseLine[i]) {
            leadingSpanA[i + displacement] = conversionLine[i].plus(baseLine[i]).dividedBy(2)
        }

        if (i >= displacement) {
            laggingSpan[i - displacement] = BigNumber(close[i])
        }
    }

    const {crossInterval, crossType} = findLastCross({fast: conversionLine, slow: baseLine})

    return {
        conversionLine,
        baseLine,
        leadingSpanA,
        leadingSpanB,
        laggingSpan,
        crossInterval, 
        crossType
    }
}

const calculateHighLow = (BigNumber, data, from, to) => {
    let highest = BigNumber(data[from])
    let lowest = BigNumber(data[from])
    for (let i = from + 1; i < to; i++) {
        let current = BigNumber(data[i])
        if (current.isGreaterThan(highest)) {
            highest = current
        }
        if (current.isLessThan(lowest)) {
            lowest = current
        }
    }
    return { highest, lowest }
}