import { MA } from './ma.js';
import { arrayMath } from '../utilities/array-math.js';
import { bollingerBandsLocation } from '../trend-reversal/bollinger-bands-location.js';

export const BOLLINGER_BANDS = (BigNumber, data, size = 20, times = 2) => {

  times = BigNumber(times);
  const avg = MA(BigNumber, data, size);
  const sd = deviation(BigNumber, data, size);

  const timesSd = arrayMath(sd, times, 'mul', BigNumber)

  let upper = arrayMath(avg, timesSd, 'add', BigNumber);

  let mid = avg;

  let lower = arrayMath(avg, timesSd, 'sub', BigNumber);
  
  const lastValue = data[data.length - 1];

  const loc = bollingerBandsLocation(lastValue, {upper, mid, lower});

  return {upper, mid, lower, loc};
}


const deviation =  (BigNumber, data, size) => {
  
  const zero = BigNumber(0);
  const length = data.length;
  const avg = MA(BigNumber, data, size);
  const ret = [];

  let i = size - 1
  let j
  let sum

  for (; i < length; i ++) {
    sum = zero
    j = i - size + 1

    for (; j <= i; j ++) {
      sum = sum.plus(data[j].minus(avg[i]).pow(2));
    }

    ret[i] = sum.dividedBy(size).sqrt()
  }

  return ret;
}
