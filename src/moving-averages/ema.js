export const EMA = (BigNumber, data, size) => {
  const alpha = BigNumber(2 / (size + 1));
  const length = data.length;
  const ret = [];

  if (alpha.isGreaterThan(1)) {
    return Array(length);
  }

  if (alpha.isEqualTo(1)) {
    return [...data];
  }

  let s = 0;

  // Handles head
  let i = 0;
  for (; i < length; i++) {
    const datum = data[i];
    if (typeof datum === 'object') {
      ret[i] = datum;
      s = datum;
      i++;
      break;
    }
  }

  if (Array.isArray(alpha)) {
    for (; i < length; i++) {
      const datum = data[i];
      if (typeof datum === 'object' && typeof alpha[i] === 'object') {
        s = ret[i] = alpha[i].multipliedBy(datum).plus(alpha[i].minus(1).multipliedBy(s));
      } else {
        ret[i] = ret[i - 1];
      }
    }
  } else {
    const o = BigNumber(1).minus(alpha);
    for (; i < length; i++) {
      const datum = data[i];
      s = typeof datum === 'object' ? alpha.multipliedBy(datum).plus(o.multipliedBy(s)) : ret[i - 1];
      ret[i] = s;
    }
  }

  return ret;
};
