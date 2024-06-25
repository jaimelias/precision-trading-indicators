import PrecisionTradingIndicators from '../precision-trading-indicators.js';
import BigNumber from 'bignumber.js';
const indicators = new PrecisionTradingIndicators(BigNumber);

const {
	EMA, 
    MA, 
    MACD, 
    BollingerBands,
	IchimokuCloud,
    ADX, 
    MFI, 
    RSI, 
    STOCHASTIC_RSI, 
	getMomentum,
	getCandlestickPattern,
	findLastCross,
} = indicators;

const period = 14;

const response = await fetch('https://api.gpu.trading/v1/vpn/candlesticks/AAPL/200')
const json = await response.json()

const ohlcv = {
	open: json.map(item => BigNumber(item.open)),
	high: json.map(item => BigNumber(item.high)),
	low: json.map(item => BigNumber(item.low)),
	close: json.map(item => BigNumber(item.close)),
	volume: json.map(item => BigNumber(item.volume)),
	timestamp: json.map(item => item.timestamp)
}

const {open, high, low, close, volume} = ohlcv;
const rsi = RSI(close, period).get(); //outputs and array

//STOCHASTIC_RSI
//outputs an object with 4 array elements {K <array>, D <array>, crossInterval <number>, crossType <string: 'death' || 'golden'>}
//STOCHASTIC_RSI_VALUES are in D.
//crossInterval indicates in which intervar K and D lines crossed. 0 for the current interval, 1 for the previous interval...
//crossInterval indicates the current trend after the last cross.
const stochasticRsi = STOCHASTIC_RSI(rsi.rsi, period, 3, 3).get();


//MACD
//outputs an object with 5 array elements  {diff <array>, dea <array>, histogram <array>, crossInterval <number>, crossType <string: 'death' || 'golden'>}
//crossInterval indicates in which intervar diff and dea lines crossed. 0 for the current interval, 1 for the previous interval...
//crossInterval indicates the current trend after the last cross..
const macd = MACD(close, 12, 26, 9).get();
const {diff} = macd

//BollingerBands
//outputs an object with 4 array elements {upper <array>, lower <array>, mid <array>, loc <number>}
//loc is a percentage numeric representation of the current price in bollinger bands.
const bollingerBands = BollingerBands(close, 20, 2).get();
const {mid, loc} = bollingerBands;


const adx = ADX(ohlcv, period).get(); //outputs and array
const mfi = MFI(ohlcv, period).get(); //outputs and array
const ema20 = EMA(close, 20).get(); //outputs and array
const ema40 = EMA(close, 40).get(); //outputs and array
const momentum = getMomentum({close, fast: ema20, slow: ema40}); //ouputs a <string: 'up' ||  'strong up' || 'down' || 'strong down' || 'neutral'>
const ma = MA([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 200).get(); //outputs and array
const candlestickPattern = getCandlestickPattern(ohlcv).get();
//console.log({ema20, ema40, ma, rsi, stochasticRsi, macd, trend, momentum, bollingerBands, adx, mfi, candlestickPattern});

const ichi = IchimokuCloud(ohlcv).get()
const {conversionLine, baseLine, leadingSpanA, leadingSpanB, laggingSpan} = ichi

const csv = conversionLine.map((v, i) => ({
	conversionLine: conversionLine[i], 
	baseLine: baseLine[i],
	leadingSpanA: leadingSpanA[i], 
	leadingSpanB: leadingSpanB[i],
	laggingSpan: laggingSpan[i]
}))

console.log(rsi.rsi[rsi.rsi.length -1].toNumber())