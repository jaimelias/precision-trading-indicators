export const getMomentum = ({data, fast, slow, threshold = 0.02 }) => {

  const dataDifference = data[data.length - 1].minus(fast[fast.length - 1]);
  const fastSlowDiff = fast[fast.length - 1].minus(slow[slow.length - 1]);
  const fastValue = fast[fast.length - 1];

  if (dataDifference.isGreaterThan(0) && fastSlowDiff.isGreaterThan(0)) {

    const dataDividedByFast = dataDifference.dividedBy(fastValue);
    const fastSlowDividedByFast = fastSlowDiff.dividedBy(fastValue);

    if (dataDividedByFast.isGreaterThan(threshold) && fastSlowDividedByFast.isGreaterThan(threshold)) {
      return 2; //strong up
    }
    else 
    {
      return 1; //up
    }

  }
  else if (dataDifference.isLessThan(0) && fastSlowDiff.isLessThan(0))
  {
    const absDataDividedByFast = dataDifference.abs().dividedBy(fastValue);
    const absFastSlowDividedByFast = fastSlowDiff.abs().dividedBy(fastValue);

    if (absDataDividedByFast.isGreaterThan(threshold) && absFastSlowDividedByFast.isGreaterThan(threshold))
    {
      return -2; //strong down
    }
    else
    {
      return -1; //down
    }
  }
  else 
  {
    return 0;
  }
};
