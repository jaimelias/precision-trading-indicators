export const getMomentum = ({BigNumber, close, fast, slow}) => {

    const lastFast = fast[fast.length -1]
    const lastSlow = slow[slow.length -1]
    const lastClose = close[close.length -1]

    if(lastClose.isLessThan(lastFast) || lastClose.isLessThan(lastSlow))
    {
        return BigNumber(0)
    }

    return ((lastFast.minus(lastSlow)).dividedBy(lastSlow)).multipliedBy(100)
}
