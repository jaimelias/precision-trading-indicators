export const fibonacciLevels = (BigNumber, ohlcv, period = 14) => {

    let {open, high, low, close} = ohlcv
    const levels = [0.236, 0.382, 0.5, 0.618, 1.0];

    const fibonacciRetracementLevel = (start, end, level) => start.plus((end.minus(start)).multipliedBy(level))

    open = open.slice(-period)
    high = high.slice(-period)
    low = low.slice(-period)
    close = close.slice(-period)

    const highestHigh = BigNumber.maximum(...high)
    const lowestLow = BigNumber.minimum(...low)

    const fibLevels = {}
    levels.forEach((level, index) => {
        fibLevels[`fb${index+1}`] = fibonacciRetracementLevel(lowestLow, highestHigh, level)
    })

    return fibLevels
}