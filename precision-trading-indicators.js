
import {EMA} from './src/moving-averages/ema.js';
import {MA} from './src/moving-averages/ma.js';
import {MACD} from './src/moving-averages/macd.js';
import {BOLLINGER_BANDS} from './src/moving-averages/bollinger-bands.js';
import {ADX} from './src/oscillators/adx.js';
import {MFI} from './src/oscillators/mfi.js';
import {RSI} from './src/oscillators/rsi.js';
import {STOCHASTIC_RSI} from './src/oscillators/stochastic-rsi.js';
import {bollingerBandsLocation} from './src/signals/bollinger-bands-location.js';
import {getTrend} from './src/signals/get-trend.js';
import {findLastCross} from './src/signals/find-last-cross.js';
import {getMomentum} from './src/signals/get-momentum.js';
import {getCandlestickPattern} from './src/signals/candlestick-pattern.js';

export default class PrecisionTradingIndicators {
    constructor(BigNumber)
    {
        //utilities
        this.BigNumber = BigNumber;

        //moving averages
        this.EMA = this.EMA.bind(this);
        this.MA = this.MA.bind(this);
        this.MACD = this.MACD.bind(this);
        this.BOLLINGER_BANDS = this.BOLLINGER_BANDS.bind(this);

        //oscillators
        this.ADX = this.ADX.bind(this);
        this.MFI = this.MFI.bind(this);
        this.RSI = this.RSI.bind(this);
        this.STOCHASTIC_RSI = this.STOCHASTIC_RSI.bind(this);

        //trend and reversals
        this.bollingerBandsLocation = this.bollingerBandsLocation.bind(this);
        this.getTrend = this.getTrend.bind(this);
        this.findLastCross = this.findLastCross.bind(this);
        this.getMomentum = this.getMomentum.bind(this);
    }
    EMA(data, size)
    {
        return EMA(this.BigNumber, data, size);
    }
    MA(data, size)
    {
        return MA(this.BigNumber, data, size);
    }
    MACD(data, fastLine, slowLine, signalLine)
    {
        return MACD(this.BigNumber, data, fastLine, slowLine, signalLine);
    }
    BOLLINGER_BANDS(data, size, times)
    {
        return BOLLINGER_BANDS(this.BigNumber, data, size, times);
    }
    ADX(ohlcv, period)
    {
        return ADX(this.BigNumber, ohlcv, period);
    }
    MFI(ohlcv, period)
    {
        return MFI(this.BigNumber, ohlcv, period);
    }
    RSI(data, period)
    {
        return RSI(this.BigNumber, data, period);
    }
    STOCHASTIC_RSI(rsi, kPeriods, kSlowingPeriods, dPeriods)
    {
        return STOCHASTIC_RSI(this.BigNumber, rsi, kPeriods, kSlowingPeriods, dPeriods);
    }
    bollingerBandsLocation(value, bollingerBands)
    {
        return bollingerBandsLocation(value, bollingerBands);
    }
    getTrend(data, period)
    {
        return getTrend(this.BigNumber, data, period);
    }
    findLastCross({fast, slow})
    {
        return findLastCross({fast, slow});
    }
    getMomentum({data, fast, slow, threshold})
    {
        return getMomentum({data, fast, slow, threshold});
    }
    getCandlestickPattern(ohlcv)
    {
        return getCandlestickPattern(ohlcv);
    }
}