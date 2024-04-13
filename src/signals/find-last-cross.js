
export const findLastCross = ({fast, slow}) => {
  let size = Math.min(fast.length, slow.length)

  while (fast.length > size) {
    fast.shift()
  }
  while (slow.length > size) {
    slow.shift()
  }
  
  let crossType = null;
  let lastCrossIndex = null;
  let i = size - 1;

  while (i >= 0 && crossType === null) {
    if (fast[i].isLessThan(slow[i]) && i > 0 && fast[i - 1].isGreaterThanOrEqualTo(slow[i - 1])) {
      crossType = 'down';
      lastCrossIndex = i;
    } else if (fast[i].isGreaterThan(slow[i]) && i > 0 && fast[i - 1].isLessThanOrEqualTo(slow[i - 1])) {
      crossType = 'up';
      lastCrossIndex = i;
    }
    i--;
  }

  if (crossType === null) {
    return { crossInterval: null, crossType: null };
  }

  const crossInterval = lastCrossIndex < size - 1 ? size - 1 - lastCrossIndex : 0;
  
  return { crossInterval, crossType };
};
