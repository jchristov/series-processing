/**
 * Exponential Moving Average
 * @see https://en.wikipedia.org/wiki/Exponential_smoothing
 *
 * <output series> = ema(<input series>, length)
 */
export const EMA = (outputKey, inputKey, length) => (lastPoint, dataStream) => {
  if (typeof lastPoint === 'undefined' || typeof lastPoint[inputKey] === 'undefined') {
    return null;
  }

  const previousPoint = dataStream.getPrevious();
  // Use the last data item as the first previous EMA value (if not available)
  const previousEma = (previousPoint && previousPoint[outputKey]) ? previousPoint[outputKey] : lastPoint[inputKey];
  const previousVal = (previousPoint) ? previousPoint[inputKey] : lastPoint[inputKey];
  const K = 2 / (1 + length);
  const distance = dataStream.calcDistanceWithLast();
  const ema = processEma(previousEma, previousVal, lastPoint[inputKey], K, distance);
  // const ema = (lastPoint[inputKey] * K) + (previousEma * (1 - K));
  return { [outputKey] : ema, d: dataStream.calcDistanceWithLast() };
};

const processEma = (startRes, startVal, newVal, K, distance) => {
  if (distance === 0) return newVal;

  const delta = (newVal - startVal) / distance;
  let newRes = startRes;
  for (let i=1; i<=distance; i++) {
    const currVal = startVal + i * delta;
    // console.log(`Curr: ${currVal}, ${startVal}, ${newRes}`);
    newRes = K * currVal + (1 - K) * newRes;
  }
  return newRes;
};