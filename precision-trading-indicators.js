
import {EMA} from './src/moving-averages/ema.js'
import {MA} from './src/moving-averages/ma.js'
import {MACD} from './src/moving-averages/macd.js'
import {BollingerBands} from './src/moving-averages/bollinger-bands.js'
import {ADX} from './src/oscillators/adx.js'
import {MFI} from './src/oscillators/mfi.js'
import {RSI} from './src/oscillators/rsi.js'
import {STOCHASTIC_RSI} from './src/oscillators/stochastic-rsi.js'
import {bollingerBandsLocation} from './src/signals/bollinger-bands-location.js'
import {findLastCross} from './src/signals/find-last-cross.js'
import {getMomentum} from './src/signals/get-momentum.js'
import {getCandlestickPattern} from './src/patterns/candlestick-pattern.js'
import { IchimokuCloud } from './src/moving-averages/Ichimoku-cloud.js'

export default class PrecisionTradingIndicators {
    constructor(BigNumber)
    {
        //utilities
        this.BigNumber = BigNumber

        //moving averages
        this.EMA = this.EMA.bind(this)
        this.MA = this.MA.bind(this)
        this.MACD = this.MACD.bind(this)
        this.BollingerBands = this.BollingerBands.bind(this)
        this.IchimokuCloud = this.IchimokuCloud.bind(this)

        //oscillators
        this.ADX = this.ADX.bind(this)
        this.MFI = this.MFI.bind(this)
        this.RSI = this.RSI.bind(this)
        this.STOCHASTIC_RSI = this.STOCHASTIC_RSI.bind(this)

        //trend and reversals
        this.bollingerBandsLocation = this.bollingerBandsLocation.bind(this)
        this.findLastCross = this.findLastCross.bind(this)
        this.getMomentum = this.getMomentum.bind(this)

        //patterns
        //this.getCandlestickPattern = this.getCandlestickPattern(this)
    }
    EMA(data, size)
    {
        return new EMA(this.BigNumber, data, size)
    }
    MA(data, size)
    {
        return new MA(this.BigNumber, data, size)
    }
    MACD(data, fastLine, slowLine, signalLine)
    {
        return new MACD(this.BigNumber, data, fastLine, slowLine, signalLine)
    }
    BollingerBands(data, size, times)
    {
        return new BollingerBands(this.BigNumber, data, size, times)
    }
    IchimokuCloud(ohlcv)
    {
        return new IchimokuCloud(this.BigNumber, ohlcv)
    }
    ADX(ohlcv, period)
    {
        return new ADX(this.BigNumber, ohlcv, period)
    }
    MFI(ohlcv, period)
    {
        return new MFI(this.BigNumber, ohlcv, period)
    }
    RSI(data, period, emaPeriod)
    {
        return new RSI(this.BigNumber, data, period, emaPeriod)
    }
    STOCHASTIC_RSI(rsi, kPeriods, kSlowingPeriods, dPeriods)
    {
        return new STOCHASTIC_RSI(this.BigNumber, rsi, kPeriods, kSlowingPeriods, dPeriods)
    }
    bollingerBandsLocation(value, bollingerBands)
    {
        return  bollingerBandsLocation(value, bollingerBands)
    }
    findLastCross({fast, slow})
    {
        return findLastCross({fast, slow})
    }
    getMomentum({data, close, fast, slow})
    {
        return getMomentum({BigNumber: this.BigNumber, data, close, fast, slow})
    }
    getCandlestickPattern(ohlcv)
    {
        return new getCandlestickPattern(ohlcv)
    }
}