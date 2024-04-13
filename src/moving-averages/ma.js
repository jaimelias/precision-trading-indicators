export const MA = (BigNumber, data, size) => {
  const length = data.length
  const newData = data

  if (!size) {
    const sum = newData.reduce((a, b) => a.plus(b));
    return sum.dividedBy(length);
  }

  if (size <= 1) {
    return newData.slice();
  }

  if (size > length) {
    return Array(length);
  }

  const ret = [];
  let sum = BigNumber(0);

  for (let i = 0; i < length; i++) {
    const thisVal = newData[i];

    if (typeof thisVal === 'object') {
      sum = sum.plus(thisVal);
    }

    if (i >= size) {
      const prevVal = newData[i - size];

      if (typeof prevVal === 'object') {
        sum = sum.minus(prevVal);
      }
    }

    if (i >= size - 1) {
      ret[i] = sum.dividedBy(size);
    }
  }

  return ret;
}