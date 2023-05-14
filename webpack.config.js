import {resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));


const entry = './precision-trading-indicators.js';
const output = {
    filename: 'precision-trading-indicators.min.js',
    path: resolve(__dirname, './dist'),
    library: 'PrecisionTradingIndicators'
};

export default {entry, output, mode: 'production', target: 'web'};