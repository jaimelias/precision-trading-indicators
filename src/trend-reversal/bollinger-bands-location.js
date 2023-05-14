export const bollingerBandsLocation = (value, bollingerBands) => {
	let {upper, lower, mid} = bollingerBands;
	upper = upper[upper.length - 1];
	lower = lower[lower.length - 1];
	mid = mid[mid.length - 1];	
	const range = upper.minus(lower);
	const loc = ((value.minus(lower)).dividedBy(range)).times(100);

	return loc;
}
