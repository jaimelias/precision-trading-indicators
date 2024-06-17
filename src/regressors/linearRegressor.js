export const linearRegression = (BigNumber, prices, predict) => {

    const zero = new BigNumber(0)
    const n = new BigNumber(prices.length)

    const sum = prices.reduce((acc, price, idx) => {

        idx = new BigNumber(idx)

        return {
            sumX: acc.sumX.plus(idx),
            sumY: acc.sumY.plus(price),
            sumXY: acc.sumXY.plus(idx.multipliedBy(price)),
            sumX2: acc.sumX2.plus(idx.multipliedBy(idx))
        };
    }, { sumX: zero, sumY: zero, sumXY: zero, sumX2: zero })

    const slope = n.multipliedBy(sum.sumXY).minus(sum.sumX.multipliedBy(sum.sumY))
        .dividedBy(n.multipliedBy(sum.sumX2).minus(sum.sumX.multipliedBy(sum.sumX)))

    const intercept = sum.sumY.minus(slope.multipliedBy(sum.sumX)).dividedBy(n)

    const forecasts = [];
    for (let i = 0; i < predict; i++) {
        const x = new BigNumber(n.plus(i))
        forecasts.push(slope.multipliedBy(x).plus(intercept))
    }

    return forecasts
}