import PrecisionTradingIndicators from '../precision-trading-indicators.js';
import BigNumber from 'bignumber.js';
const indicators = new PrecisionTradingIndicators(BigNumber);

const {
	EMA, 
    MA, 
    MACD, 
    BOLLINGER_BANDS,
	ICHIMOKU_CLOUD,
    ADX, 
    MFI, 
    RSI, 
    STOCHASTIC_RSI, 
    getTrend,
	getMomentum,
	getCandlestickPattern
} = indicators;

const period = 14;

let data = [
	[1675382400000, "23493.00", "23719.90", "23201.00", "23424.70", "470831.438", 1675468799999, "11047679446.95720", 3231984, "232037.850", "5445353439.87534", "0"],
	[1675468800000, "23424.70", "23591.40", "23250.00", "23322.60", "197118.393", 1675555199999, "4613381157.56320", 1515159, "97925.022", "2292235317.28000", "0"],
	[1675555200000, "23322.60", "23436.00", "22741.00", "22929.20", "356665.034", 1675641599999, "8235110913.12042", 2413892, "168478.328", "3890523800.89990", "0"],
	[1675641600000, "22929.30", "23159.40", "22600.00", "22757.70", "417160.143", 1675727999999, "8515737261.55546", 2671329, "205648.867", "4208112572.44176", "0"],
	[1675728000000, "22757.80", "23368.60", "22742.40", "23234.10", "447273.494", 1675814399999, "10297159070.89130", 2811376, "227838.755", "5246060241.38648", "0"],
	[1675814400000, "23234.10", "23450.00", "22662.90", "22955.90", "383465.481", 1675900799999, "8824616946.18832", 2432733, "188193.359", "4331860417.27920", "0"],
	[1675900800000, "22955.90", "23007.80", "21684.70", "21793.40", "732295.350", 1675987199999, "16381601662.80056", 4168493, "352383.973", "7884131203.56675", "0"],
	[1675987200000, "21793.30", "21933.80", "21405.00", "21618.60", "439986.497", 1676073599999, "9560010537.24584", 2754970, "218401.918", "4746056750.47950", "0"],
	[1676073600000, "21618.60", "21891.90", "21594.40", "21851.30", "189249.667", 1676159999999, "4107550899.47300", 1293121, "97140.493", "2108626609.71500", "0"],
	[1676160000000, "21851.20", "22080.90", "21618.00", "21771.10", "276787.093", 1676246399999, "6050172252.91270", 1829939, "137801.412", "3012674101.98673", "0"],
	[1676246400000, "21771.00", "21888.00", "21338.00", "21766.20", "511595.693", 1676332799999, "11064385171.50844", 3063623, "254937.184", "5514335125.55216", "0"],
	[1676332800000, "21766.10", "22320.00", "21485.20", "22187.40", "598791.509", 1676419199999, "13138446771.27616", 3582749, "301714.763", "6620555834.92226", "0"],
	[1676419200000, "22187.40", "24420.00", "22038.50", "24332.60", "824676.471", 1676505599999, "19105717014.29069", 4773998, "438095.939", "10150489392.24219", "0"],
	[1676505600000, "24332.70", "25290.00", "23518.00", "23526.60", "959463.159", 1676591999999, "23594991207.78344", 6066350, "476025.725", "11713610216.77922", "0"],
	[1676592000000, "23526.60", "25043.20", "23350.00", "24581.50", "922717.148", 1676678399999, "22269729549.78749", 5941536, "466655.784", "11265293279.35803", "0"],
	[1676678400000, "24581.30", "24887.50", "24430.60", "24636.90", "261555.556", 1676764799999, "6441713215.92101", 2200570, "130552.462", "3215740824.08061", "0"],
	[1676764800000, "24636.80", "25200.00", "24179.40", "24265.90", "543506.628", 1676851199999, "13409130913.30667", 3533276, "263715.507", "6508964121.49515", "0"],
	[1676851200000, "24265.90", "25140.00", "23827.00", "24849.90", "646401.072", 1676937599999, "15954258831.26220", 4489943, "325756.247", "8042075424.60315", "0"],
	[1676937600000, "24849.90", "25347.60", "24150.00", "24443.40", "729290.575", 1677023999999, "17996162952.26349", 4820541, "357778.843", "8833009456.17446", "0"],
	[1677024000000, "24443.30", "24468.50", "23572.00", "24171.30", "730414.101", 1677110399999, "17500937832.07492", 5090139, "352155.899", "8438976506.53682", "0"],
	[1677110400000, "24171.30", "24588.00", "23590.00", "23928.80", "751339.414", 1677196799999, "18066676937.66089", 5244513, "369788.469", "8893367081.65688", "0"],
	[1677196800000, "23928.70", "24138.60", "22800.00", "23175.60", "731577.942", 1677283199999, "17176351552.41237", 4944260, "350601.005", "8234014172.71578", "0"],
	[1677283200000, "23175.50", "23210.50", "22700.00", "23146.20", "310795.648", 1677369599999, "7149097149.93959", 2424080, "151634.042", "3488785432.40751", "0"],
	[1677369600000, "23146.20", "23675.00", "23050.00", "23545.30", "371395.056", 1677455999999, "8663022665.24848", 2819306, "189099.315", "4411672661.35098", "0"],
	[1677456000000, "23545.20", "23888.00", "23088.00", "23480.00", "576754.966", 1677542399999, "13533218116.93548", 4171455, "286691.878", "6728538499.90897", "0"],
	[1677542400000, "23480.00", "23592.80", "23010.00", "23129.60", "456919.838", 1677628799999, "10669916658.50471", 3350674, "221073.577", "5163282472.25300", "0"],
	[1677628800000, "23129.70", "24022.70", "23008.40", "23619.80", "617250.311", 1677715199999, "14566071875.52603", 4206389, "314962.841", "7433802213.08850", "0"],
	[1677715200000, "23619.80", "23790.50", "23183.00", "23457.10", "419256.601", 1677801599999, "9812612221.27088", 3015967, "206750.719", "4839526748.25830", "0"],
	[1677801600000, "23457.10", "23468.50", "21883.20", "22342.80", "608518.137", 1677887999999, "13631210171.56995", 3866916, "283462.569", "6347417060.56692", "0"],
	[1677888000000, "22342.80", "22400.00", "22147.50", "22335.70", "175309.211", 1677974399999, "3909987751.02620", 1305968, "88103.197", "1965194667.71090", "0"],
	[1677974400000, "22335.80", "22650.00", "22174.90", "22419.40", "282261.745", 1678060799999, "6328721520.62350", 1874867, "143873.702", "3226160540.52170", "0"],
	[1678060800000, "22419.30", "22594.50", "22240.10", "22397.10", "298976.397", 1678147199999, "6702364485.61290", 2012422, "147055.495", "3296881966.44010", "0"],
	[1678147200000, "22397.10", "22550.00", "21908.00", "22187.10", "548494.099", 1678233599999, "12196490218.23626", 3202168, "270677.072", "6020127655.34381", "0"],
	[1678233600000, "22187.10", "22276.40", "21540.50", "21695.40", "547867.967", 1678319999999, "12052988553.65670", 3276230, "263516.807", "5799355284.33350", "0"],
	[1678320000000, "21695.30", "21823.00", "20003.50", "20348.30", "951903.360", 1678406399999, "20058296300.05462", 5290521, "451515.553", "9520938436.91080", "0"],
	[1678406400000, "20348.40", "20351.80", "19521.60", "20140.30", "1238135.265", 1678492799999, "24701622102.43860", 6670105, "613446.983", "12240445784.38266", "0"],
	[1678492800000, "20140.30", "20674.50", "19752.50", "20447.30", "753479.558", 1678579199999, "15236396244.00332", 4855620, "385590.707", "7798516747.10955", "0"],
	[1678579200000, "20447.30", "22184.00", "20262.20", "21986.20", "881522.402", 1678665599999, "18488877763.69799", 5400565, "462807.905", "9711424272.47629", "0"],
	[1678665600000, "21986.20", "24517.20", "21804.00", "24119.50", "1534982.176", 1678751999999, "35400848297.96145", 10210273, "792707.751", "18280845428.45666", "0"],
	[1678752000000, "24119.50", "26489.90", "23951.00", "24682.50", "1572562.635", 1678838399999, "39411234190.48011", 11299346, "787298.568", "19735183976.84621", "0"],
	[1678838400000, "24682.50", "25200.00", "23888.00", "24288.00", "1102056.429", 1678924799999, "27097556193.83353", 8302944, "550068.277", "13527752107.95273", "0"],
	[1678924800000, "24287.90", "25167.90", "24120.50", "24990.40", "735446.946", 1679011199999, "18170050595.51308", 6238982, "368306.410", "9101111741.13063", "0"],
	[1679011200000, "24990.50", "27763.40", "24875.30", "27384.00", "1341159.064", 1679097599999, "35443530287.65108", 10192241, "692742.466", "18307537966.56740", "0"],
	[1679097600000, "27383.90", "27726.40", "26555.50", "26907.00", "740232.316", 1679183999999, "20184491452.70674", 6453518, "362122.498", "9877028394.80117", "0"],
	[1679184000000, "26907.00", "28397.00", "26815.90", "27955.70", "759367.078", 1679270399999, "20977139675.99659", 6421005, "385924.863", "10663327634.68572", "0"],
	[1679270400000, "27955.80", "28483.20", "27120.60", "27704.10", "937223.448", 1679356799999, "26103780621.31453", 7758928, "463901.530", "12924206254.85234", "0"],
	[1679356800000, "27704.10", "28460.00", "27288.00", "28091.10", "685487.714", 1679443199999, "19152913743.53478", 6537638, "341214.282", "9535776429.15329", "0"],
	[1679443200000, "28091.10", "28881.00", "26590.00", "27233.80", "1080393.270", 1679529599999, "30186741704.76973", 8635170, "536538.588", "14999230711.37439", "0"],
	[1679529600000, "27233.80", "28777.00", "27101.00", "28284.10", "808173.434", 1679615999999, "22583147907.22827", 6394484, "411445.525", "11498503263.01036", "0"],
	[1679616000000, "28284.00", "28369.10", "26960.00", "27438.90", "696075.370", 1679702399999, "19369885616.52528", 5519306, "338210.882", "9414918125.99339", "0"],
	[1679702400000, "27439.00", "27788.00", "27131.80", "27447.30", "335674.055", 1679788799999, "9219228887.09329", 3026808, "166700.041", "4579168625.36854", "0"],
	[1679788800000, "27447.20", "28186.90", "27400.00", "27954.30", "399756.985", 1679875199999, "11110815846.83666", 3281476, "202591.082", "5631661123.28706", "0"],
	[1679875200000, "27954.30", "28019.40", "26480.00", "27112.00", "642434.822", 1679961599999, "17542947640.15402", 5064388, "309890.679", "8462580599.71231", "0"],
	[1679961600000, "27112.00", "27500.00", "26610.00", "27249.70", "585080.772", 1680047999999, "15806950765.76132", 4777546, "292760.916", "7911119288.16518", "0"],
	[1680048000000, "27249.70", "28649.90", "27223.60", "28338.50", "655852.971", 1680134399999, "18472646921.01927", 5388434, "336722.192", "9482580881.81991", "0"],
	[1680134400000, "28338.60", "29184.80", "27654.10", "28015.00", "770966.100", 1680220799999, "21882841599.42791", 6177264, "381217.000", "10823868916.86587", "0"],
	[1680220800000, "28015.00", "28675.30", "27500.00", "28454.90", "611557.290", 1680307199999, "17241323711.94637", 5207648, "307763.883", "8679287555.29000", "0"],
	[1680307200000, "28454.80", "28845.30", "28180.00", "28443.80", "256487.222", 1680393599999, "7298340524.07105", 2401480, "127870.841", "3639363641.61016", "0"],
	[1680393600000, "28443.70", "28516.50", "27820.00", "28161.20", "316658.670", 1680479999999, "8922911429.06440", 2802195, "153621.035", "4329266889.29578", "0"],
	[1680480000000, "28161.30", "28540.00", "27166.00", "27786.10", "741665.563", 1680566399999, "20745208330.25454", 5406685, "362467.885", "10142224927.20930", "0"],
	[1680566400000, "27786.10", "28450.00", "27650.20", "28155.20", "432370.612", 1680652799999, "12148930975.14344", 3984245, "217893.823", "6123096292.81752", "0"],
	[1680652800000, "28155.10", "28800.00", "27775.00", "28154.00", "543712.838", 1680739199999, "15395006484.55794", 4531402, "271962.292", "7702654694.54489", "0"],
	[1680739200000, "28154.00", "28175.00", "27684.20", "28022.80", "355916.782", 1680825599999, "9953310708.79362", 3071514, "173330.310", "4847803106.43654", "0"],
	[1680825600000, "28022.90", "28096.00", "27755.00", "27890.70", "219250.178", 1680911999999, "6118045792.51450", 1917751, "107602.684", "3002745520.71110", "0"],
	[1680912000000, "27890.70", "28153.60", "27850.10", "27924.90", "159129.560", 1680998399999, "4453733138.91332", 1314182, "79060.895", "2212908144.45924", "0"],
	[1680998400000, "27924.90", "28539.10", "27762.80", "28309.40", "305861.880", 1681084799999, "8589117716.66099", 2214631, "156920.895", "4408179639.25343", "0"],
	[1681084800000, "28309.40", "29840.00", "28153.60", "29623.10", "580061.925", 1681171199999, "16759574206.41599", 4123452, "307108.653", "8875711866.48355", "0"],
	[1681171200000, "29623.10", "30564.00", "29573.90", "30185.10", "628978.491", 1681257599999, "18933421282.50967", 4729571, "320948.789", "9662923739.48705", "0"],
	[1681257600000, "30185.10", "30480.00", "29620.00", "29875.00", "563668.430", 1681343999999, "16925990333.74135", 4387682, "274095.011", "8232888836.54609", "0"],
	[1681344000000, "29874.90", "30648.90", "29836.70", "30362.70", "436182.494", 1681430399999, "13196552183.52759", 3715786, "221110.303", "6690678820.49995", "0"],
	[1681430400000, "30362.70", "31059.00", "29925.00", "30453.10", "615391.615", 1681516799999, "18803216668.18100", 5129517, "305214.369", "9328551186.23577", "0"],
	[1681516800000, "30453.00", "30599.90", "30186.00", "30280.40", "180234.082", 1681603199999, "5470537724.74858", 1830086, "88235.857", "2678489804.56793", "0"],
	[1681603200000, "30280.40", "30560.00", "30102.00", "30286.60", "210226.019", 1681689599999, "6372172002.43268", 1979267, "104891.341", "3179663431.59551", "0"],
	[1681689600000, "30286.60", "30307.40", "29219.90", "29420.00", "455518.548", 1681775999999, "13503235174.14893", 3560659, "216409.834", "6414429315.19702", "0"],
	[1681776000000, "29420.10", "30480.00", "29078.10", "30365.80", "533189.270", 1681862399999, "16000595786.75336", 4274050, "268618.874", "8062491742.44141", "0"],
	[1681862400000, "30365.80", "30410.00", "28557.30", "28795.10", "643866.110", 1681948799999, "18890822746.77531", 5132636, "304917.003", "8946658537.96385", "0"],
	[1681948800000, "28795.00", "29078.00", "27983.00", "28229.90", "639179.286", 1682035199999, "18268559026.79414", 5539024, "312317.655", "8928741908.61007", "0"],
	[1682035200000, "28229.90", "28368.90", "27100.00", "27252.50", "687832.833", 1682121599999, "19154822175.12687", 5562056, "335401.125", "9343883615.18001", "0"],
	[1682121600000, "27252.60", "27888.00", "27126.00", "27807.20", "345549.021", 1682207999999, "9486931563.84220", 2977249, "176885.971", "4857095933.51294", "0"],
	[1682208000000, "27807.20", "27807.30", "27279.70", "27576.00", "332082.355", 1682294399999, "9148054894.69136", 3098041, "162384.617", "4473558049.47598", "0"],
	[1682294400000, "27575.90", "28000.00", "26919.30", "27497.50", "581268.268", 1682380799999, "15953818918.34071", 5618420, "286930.069", "7877560164.38120", "0"],
	[1682380800000, "27497.40", "28379.90", "27176.60", "28286.70", "508254.515", 1682467199999, "14045812538.45073", 4735859, "262433.053", "7254921517.45639", "0"],
	[1682467200000, "28286.70", "30048.20", "27200.00", "28395.90", "1284924.668", 1682553599999, "36973550164.94095", 8966446, "646460.662", "18605129887.66778", "0"],
	[1682553600000, "28396.00", "29898.00", "28365.30", "29459.00", "952584.739", 1682639999999, "27782772896.56456", 8339857, "482300.814", "14069917959.83486", "0"],
	[1682640000000, "29459.00", "29591.10", "28870.00", "29300.00", "508350.155", 1682726399999, "14879300727.03726", 5098353, "251881.846", "7373806020.86186", "0"],
	[1682726400000, "29300.00", "29443.90", "29000.40", "29212.70", "218013.244", 1682812799999, "6381226955.68392", 2326398, "106970.978", "3131356693.56310", "0"],
	[1682812800000, "29212.70", "29950.00", "29067.40", "29223.00", "417798.846", 1682899199999, "12308569143.22655", 3831415, "209537.432", "6174181640.74801", "0"],
	[1682899200000, "29223.00", "29325.50", "27650.00", "28054.40", "624974.488", 1682985599999, "17715530181.15137", 5751299, "299961.517", "8502177382.21380", "0"],
	[1682985600000, "28054.50", "28888.00", "27854.00", "28656.50", "513546.269", 1683071999999, "14563151413.11936", 5054283, "261246.324", "7410061314.69640", "0"],
	[1683072000000, "28656.40", "29258.40", "28080.00", "29018.40", "676466.230", 1683158399999, "19317326412.84522", 6377432, "342465.824", "9782198497.49407", "0"],
	[1683158400000, "29018.40", "29380.00", "28660.00", "28826.00", "426425.584", 1683244799999, "12351553435.64055", 4742919, "210626.637", "6102163251.10883", "0"],
	[1683244800000, "28826.00", "29693.00", "28618.30", "29491.50", "578485.177", 1683331199999, "16927223730.86086", 5470394, "295386.667", "8645297072.35527", "0"],
	[1683331200000, "29491.50", "29840.00", "28333.00", "28837.80", "475628.901", 1683417599999, "13798897391.83881", 4534010, "230364.328", "6685476928.26591", "0"],
	[1683417600000, "28837.90", "29137.00", "28370.00", "28419.40", "308410.643", 1683503999999, "8896354660.35729", 3445261, "150881.809", "4353309036.01683", "0"],
	[1683504000000, "28419.50", "28624.60", "27250.00", "27659.80", "658188.777", 1683590399999, "18339478036.73547", 6208727, "317479.470", "8846487495.82370", "0"],
	[1683590400000, "27659.80", "27815.60", "27316.80", "27610.20", "367664.686", 1683676799999, "10141376746.46744", 4277816, "184389.401", "5086790813.76146", "0"],
	[1683676800000, "27610.20", "28297.00", "26666.60", "27582.90", "722502.676", 1683763199999, "20001892800.24953", 6667421, "357840.011", "9910309901.39146", "0"],
	[1683763200000, "27583.00", "27630.00", "26688.80", "26956.40", "538822.363", 1683849599999, "14649119359.74357", 5661571, "263065.114", "7153190242.43016", "0"],
	[1683849600000, "26956.40", "27090.00", "25751.00", "26785.10", "615645.508", 1683935999999, "16266529977.65859", 6231218, "300548.409", "7943454570.29941", "0"],
	[1683936000000, "26785.20", "27051.50", "26674.90", "26799.10", "208610.788", 1684022399999, "5594300818.27282", 2394653, "106984.765", "2869478130.81180", "0"]
]


const ohlcv = data.reduce(
	(acc, [timestamp, open, high, low, close, volume]) => ({
	  timestamp: [...acc.open, timestamp],
	  open: [...acc.open, BigNumber(open)],
	  high: [...acc.high, BigNumber(high)],
	  low: [...acc.low, BigNumber(low)],
	  close: [...acc.close, BigNumber(close)],
	  volume: [...acc.volume, volume],
	}),
	{ timestamp: [], open: [], high: [], low: [], close: [], volume: [] }
  );	

const {close} = ohlcv;

const rsi = RSI(close, period); //outputs and array

//STOCHASTIC_RSI
//outputs an object with 4 array elements {K <array>, D <array>, crossInterval <number>, crossType <string: 'death' || 'golden'>}
//STOCHASTIC_RSI_VALUES are in D.
//crossInterval indicates in which intervar K and D lines crossed. 0 for the current interval, 1 for the previous interval...
//crossInterval indicates the current trend after the last cross.
const stochasticRsi = STOCHASTIC_RSI(rsi, period, 3, 3);


//MACD
//outputs an object with 5 array elements  {diff <array>, dea <array>, histogram <array>, crossInterval <number>, crossType <string: 'death' || 'golden'>}
//crossInterval indicates in which intervar diff and dea lines crossed. 0 for the current interval, 1 for the previous interval...
//crossInterval indicates the current trend after the last cross..
const macd = MACD(close, 12, 26, 9);

//BOLLINGER_BANDS
//outputs an object with 4 array elements {upper <array>, lower <array>, mid <array>, loc <number>}
//loc is a percentage numeric representation of the current price in bollinger bands.
const bollingerBands = BOLLINGER_BANDS(close, 20, 2);
const {mid} = bollingerBands;


const {adx, diMinus, diPlus} = ADX(ohlcv, period); //outputs and array
const mfi = MFI(ohlcv, period); //outputs and array
const ema20 = EMA(close, 20); //outputs and array
const ema40 = EMA(close, 40); //outputs and array
const momentum = getMomentum({fast: ema20, slow: ema40}); //ouputs a <string: 'up' ||  'strong up' || 'down' || 'strong down' || 'neutral'>
const trend = getTrend(mid, period); //ouputs a <string: 'up' || 'down' || 'neutral'> indicating the direction of the trend
const ma = MA(close, period); //outputs and array
const candlestickPattern = getCandlestickPattern(ohlcv);
//console.log({ema20, ema40, ma, rsi, stochasticRsi, macd, trend, momentum, bollingerBands, adx, mfi, candlestickPattern});

const ichi = ICHIMOKU_CLOUD(ohlcv)

//console.log(JSON.stringify(ichi))