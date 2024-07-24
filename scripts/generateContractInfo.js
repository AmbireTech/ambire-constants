#!/usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ERC20 = require('adex-protocol-eth/abi/ERC20.json')
const ambireTokenList = require('../constants/tokenList.json')
const SWAPPIN_NFT_ABI = require('../abis/SWAPPIN_NFT.json')

const SWAPPIN_UNVERIFIED_NFT_CONTRACT_ADDR = '0xFd090f34707Ac2cA546a4B442FF708308dEd8909'

const etherscans = {
  ethereum: { host: 'api.etherscan.io', key: 'KJJ4NZ9EQHIFCQY5IJ775PT128YE15AV5S' },
  polygon: { host: 'api.polygonscan.com', key: 'YE5YYHA7BH6IPBN5T71UKW5MPEFZ5HUGJJ' },
  bsc: { host: 'api.bscscan.com', key: 'YQM54RYW91YSQA4QJZIJT4E6NWGKTZKQG3' },
  arbitrum: { host: 'api.arbiscan.io/', key: 'FIIYWMPVI4A9EPVZITN8R1YGFTFK84I12A' },
  optimism: { host: 'api-optimistic.etherscan.io', key: '959ZZFJ3A53JT4IR3HNHZHJX426NQHZWWS' },
  avalanche: { host: 'api.snowtrace.io', key: 'PE6FNFM267GVCM3J23QX26J3WWUKI46FJZ' }, 
  moonriver: { host: 'api-moonriver.moonscan.io', key: 'BCVGVFUVUAIEKE914PRQW2RTZUJ8ZB5GS8' },
  moonbeam: { host: 'api-moonbeam.moonscan.io', key: 'UIYN6R2PEUM86KQGIM9AFRFQB5IVQ72SY2' },
  // restricted, might need paid key if we want abis
  andromeda: { host: 'api.routescan.io/v2/network/mainnet/evm/1088/etherscan', key: '' },
  fantom: { host: 'api.ftmscan.com', key: 'D2UJ8TV1UNUDA4TPWE2DWTPF69PWAJPTNG' },
  gnosis: { host: 'blockscout.com/eth/mainnet', key: ''},
  kucoin: { host: 'api.explorer.kcc.io/vip', key: 'cpzPVTSUT2FowxQOFlIn'},
  base: { host: 'api.basescan.org', key: 'PSWKUAFEQVAIQ33CJNNVVBGP7ZU2W1MB35'},
  scroll: { host: 'api.scrollscan.com', key: 'E8Z1SS4KXNJQ6YRAWC6GKUMAKUJF6SY7F3'}
}

const yearnVaults = [
  {
    name: 'Yearn WETH Vault',
    network: 'ethereum',
    addr: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    abiName: 'YearnVault',
    baseToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
  },
  {
    name: 'Yearn USDC Vault',
    network: 'ethereum',
    addr: '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
    baseToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6
  },
  {
    name: 'Yearn USDT Vault',
    network: 'ethereum',
    addr: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
    baseToken: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6
  },
  {
    name: 'Yearn DAI Vault',
    network: 'ethereum',
    addr: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
    baseToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18
  },
  {
    name: 'Yearn YFI Vault',
    network: 'ethereum',
    addr: '0xdb25cA703181E7484a155DD612b06f57E12Be5F0',
    baseToken: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    decimals: 18
  },
  {
    name: 'Yearn WBTC Vault',
    network: 'ethereum',
    addr: '0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E',
    baseToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8
  },
  {
    name: 'Yearn 1INCH Vault',
    network: 'ethereum',
    addr: '0xB8C3B7A2A618C552C23B1E4701109a9E756Bab67',
    baseToken: '0x111111111117dC0aa78b770fA6A738034120C302',
    decimals: 18
  },
  {
    name: 'Yearn HEGIC Vault',
    network: 'ethereum',
    addr: '0xe11ba472F74869176652C35D30dB89854b5ae84D',
    baseToken: '0x584bC13c7D411c00c01A62e8019472dE68768430',
    decimals: 18
  },
  {
    name: 'Yearn UNI Vault',
    network: 'ethereum',
    addr: '0xFBEB78a723b8087fD2ea7Ef1afEc93d35E8Bed42',
    baseToken: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18
  },
  {
    name: 'Yearn SUSHI Vault',
    network: 'ethereum',
    addr: '0x6d765CbE5bC922694afE112C140b8878b9FB0390',
    baseToken: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    decimals: 18
  },
  {
    name: 'Yearn TUSD Vault',
    network: 'ethereum',
    addr: '0xFD0877d9095789cAF24c98F7CCe092fa8E120775',
    baseToken: '0x0000000000085d4780B73119b644AE5ecd22b376',
    decimals: 18
  },
  {
    name: 'Yearn AAVE Vault',
    network: 'ethereum',
    addr: '0xd9788f3931Ede4D5018184E198699dC6d66C1915',
    baseToken: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18
  },
  {
    name: 'Curve AVAX yVault',
    network: 'fantom',
    addr: '0x03b82e4070ca32ff63a03f2ecfc16c0165689a9d',
    baseToken: '0x511d35c52a3c244e7b8bd92c0c297755fbd89212',
    decimals: 18
  },
  {
    name: 'CRV yVault',
    network: 'fantom',
    addr: '0x0446acab3e0242fcf33aa526f1c95a88068d5042',
    baseToken: '0x1e4f97b9f9f913c46f1632781732927b9019c68b',
    decimals: 18
  },
  {
    name: 'MIM yVault',
    network: 'fantom',
    addr: '0x0a0b23d9786963de69cb2447dc125c49929419d8',
    baseToken: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    decimals: 18
  },
  {
    name: 'WFTM yVault',
    network: 'fantom',
    addr: '0x0dec85e74a92c52b7f708c4b10207d9560cefaf0',
    baseToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18
  },
  {
    name: 'BOO yVault',
    network: 'fantom',
    addr: '0x0fbbf9848d969776a5eb842edafaf29ef4467698',
    baseToken: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
    decimals: 18
  },
  {
    name: 'WFTM yVault',
    network: 'fantom',
    addr: '0x1482faf8b5a9c458c94e6a561ccf93ed7a9f552e',
    baseToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18
  },
  {
    name: 'USDT yVault',
    network: 'fantom',
    addr: '0x148c05caf1bb09b5670f00d511718f733c54bc4c',
    baseToken: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    decimals: 6
  },
  {
    name: 'DOLA yVault',
    network: 'fantom',
    addr: '0x1b48641d8251c3e84ecbe3f2bd76b3701401906d',
    baseToken: '0x3129662808bec728a27ab6a6b9afd3cbaca8a43c',
    decimals: 18
  },
  {
    name: 'fBEETS yVault',
    network: 'fantom',
    addr: '0x1e2fe8074a5ce1bb7394856b0c618e75d823b93b',
    baseToken: '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1',
    decimals: 18
  },
  {
    name: 'MIM yVault',
    network: 'fantom',
    addr: '0x209667b173fe4e9559bda7818e53bd5f5e0f9acd',
    baseToken: '0x82f0b8b456c1a451378467398982d4834b6829c1',
    decimals: 18
  },
  {
    name: 'WFTM yVault',
    network: 'fantom',
    addr: '0x27cbf0fddb356a2d1ebdef604cfa90f8f300d34e',
    baseToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18
  },
  {
    name: 'YFI yVault',
    network: 'fantom',
    addr: '0x2c850cced00ce2b14aa9d658b7cad5df659493db',
    baseToken: '0x29b0da86e484e1c0029b56e817912d778ac0ec69',
    decimals: 18
  },
  {
    name: 'FRAX yVault',
    network: 'fantom',
    addr: '0x357ca46da26e1eefc195287ce9d838a6d5023ef3',
    baseToken: '0xdc301622e621166bd8e82f2ca0a26c13ad0be355',
    decimals: 18
  },
  {
    name: 'Curve Geist yVault',
    network: 'fantom',
    addr: '0x3d8473724287eb1d903fe62688d3734de2b97ee8',
    baseToken: '0xd02a30d33153877bc20e5721ee53dedee0422b2f',
    decimals: 18
  },
  {
    name: 'fBEETS yVault',
    network: 'fantom',
    addr: '0x3f0e90a85eab7f2c441379cfc9a080a4e864ae82',
    baseToken: '0xfcef8a994209d6916eb2c86cdd2afd60aa6f54b1',
    decimals: 18
  },
  {
    name: 'DAI yVault',
    network: 'fantom',
    addr: '0x637ec617c86d24e421328e6caea1d92114892439',
    baseToken: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
    decimals: 18
  },
  {
    name: 'WBTC yVault',
    network: 'fantom',
    addr: '0x85611d071406a9e08ba49c073087e3eb57819839',
    baseToken: '0x321162cd933e2be498cd2267a90534a804051b11',
    decimals: 8
  },
  {
    name: 'WFTM yVault',
    network: 'fantom',
    addr: '0x8853a6232e3debe12098bf682898a92ec10c9921',
    baseToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18
  },
  {
    name: 'USDC yVault',
    network: 'fantom',
    addr: '0x9e3922fcbb28f40026da2e58926f0f249d8a138d',
    baseToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6
  },
  {
    name: 'USDC yVault',
    network: 'fantom',
    addr: '0x9f87fc463327021b510f7e84a5683e1bdce02dcc',
    baseToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6
  },
  {
    name: 'Curve USDT yVault',
    network: 'fantom',
    addr: '0xa946c861de1dd6cb530a07687da99e989b929139',
    baseToken: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
    decimals: 6
  },
  {
    name: 'Curve MIM Pool Vault',
    network: 'fantom',
    addr: '0xa97e7da01c7047d6a65f894c99be8c832227a8bc',
    baseToken: '0x2dd7c9371965472e5a5fd28fbe165007c61439e1',
    decimals: 18
  },
  {
    name: 'Curve Tricrypto Pool yVault',
    network: 'fantom',
    addr: '0xcbcaf8cb8cbeafa927ecee0c5c56560f83e9b7d9',
    baseToken: '0x58e57ca18b7a47112b877e31929798cd3d703b0f',
    decimals: 18
  },
  {
    name: 'WETH yVault',
    network: 'fantom',
    addr: '0xce2fc0bdc18bd6a4d9a725791a3dee33f3a23bb7',
    baseToken: '0x74b23882a30290451a17c44f4f05243b6b58c76d',
    decimals: 18
  },
  {
    name: 'SPELL yVault',
    network: 'fantom',
    addr: '0xd3c19eb022cac706c898d60d756bf1535d605e1d',
    baseToken: '0x468003b688943977e6130f4f68f23aad939a1040',
    decimals: 18
  },
  {
    name: 'USDC yVault',
    network: 'fantom',
    addr: '0xef0210eb96c7eb36af8ed1c20306462764935607',
    baseToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    decimals: 6
  },
  {
    name: 'Curve Geist Pool yVault',
    network: 'fantom',
    addr: '0xf137d22d7b23eeb1950b3e19d1f578c053ed9715',
    baseToken: '0xd02a30d33153877bc20e5721ee53dedee0422b2f',
    decimals: 18
  },
  {
    name: 'WFTM yVault',
    network: 'fantom',
    addr: '0xc3ca90f164d43e2053cca591ac6e63fcaad80782',
    baseToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    decimals: 18
  },
  {
    name: 'WBTC yVault',
    network: 'fantom',
    addr: '0xd817a100ab8a29fe3dbd925c2eb489d67f758da9',
    baseToken: '0x321162cd933e2be498cd2267a90534a804051b11',
    decimals: 8
  },
  {
    name: 'LINK yVault',
    network: 'fantom',
    addr: '0xf2d323621785a066e64282d2b407eac79cc04966',
    baseToken: '0xb3654dc3d10ea7645f8319668e8f54d2574fbdc8',
    decimals: 18
  }
]
const tesseractVaults = [
  {
    name: 'Tesseract USDC Vault',
    network: 'polygon',
    addr: '0x57bDbb788d0F39aEAbe66774436c19196653C3F2',
    baseToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6
  },
  {
    name: 'Tesseract DAI Vault',
    network: 'polygon',
    addr: '0x4c8C6379b7cd039C892ab179846CD30a1A52b125',
    baseToken: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    decimals: 18
  },
  {
    name: 'Tesseract WBTC Vault',
    network: 'polygon',
    addr: '0x6962785c731e812073948a1f5E181cf83274D7c6',
    baseToken: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    decimals: 8
  },
  {
    name: 'Tesseract WETH Vault',
    network: 'polygon',
    addr: '0x3d44F03a04b08863cc8825384f834dfb97466b9B',
    baseToken: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    decimals: 18
  },
  {
    name: 'Tesseract WMATIC Vault',
    network: 'polygon',
    addr: '0xE11678341625cD88Bb25544e39B2c62CeDcC83f1',
    baseToken: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    decimals: 18
  }
]
const contracts = [
  {
    name: '$WALLET distributor',
    network: 'ethereum',
    addr: '0xA69B8074CE03A33B13057B1e9D37DCDE0024Aaff'
  },
  {
    name: 'PancakeSwap',
    network: 'bsc',
    addr: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    abiName: 'PancakeRouter'
  },
  {
    name: 'Uniswap',
    network: 'ethereum',
    addr: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
    abiName: 'UniV2Router'
  },
  {
    name: 'Uniswap',
    network: 'ethereum',
    addr: '0xe592427a0aece92de3edee1f18e0157c05861564',
    abiName: 'UniV3Router'
  },
  {
    name: 'Uniswap',
    network: 'ethereum',
    addr: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    abiName: 'UniV3Router2'
  },
  {
    name: 'Uniswap',
    network: 'polygon',
    addr: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    abiName: 'UniV3Router3'
  },
  {
    name: 'Uniswap',
    network: 'arbitrum',
    addr: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    abiName: 'UniV3Router4'
  },
  {
    name: 'Uniswap',
    network: 'optimism',
    addr: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45',
    abiName: 'UniV3Router5'
  },
  {
    name: 'UniswapV3Pool',
    network: 'ethereum',
    addr: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    abiName: 'UniswapV3Pool'
  },
  {
    name: 'UniswapV3Pool',
    network: 'polygon',
    addr: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
    abiName: 'UniswapV3Pool'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'polygon',
    addr: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'polygon',
    addr: '0x643770E279d5D0733F21d6DC03A8efbABf3255B4',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'optimism',
    addr: '0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'bsc',
    addr: '0x5302086A3a25d473aAbBd0356eFf8Dd811a4d89B',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'base',
    addr: '0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'UniswapUniversalRouter',
    network: 'avalanche',
    addr: '0x82635AF6146972cD6601161c4472ffe97237D292',
    abiName: 'UniswapUniversalRouter'
  },
  {
    name: 'CowSwap',
    network: 'ethereum',
    addr: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
    abiName: 'CowSwapSettlement'
  },
  {
    name: 'CowSwap',
    network: 'ethereum',
    addr: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
    abiName: 'CowSwapGPv2VaultRelayer'
  },
  {
    name: 'ParaSwapV5',
    network: 'ethereum',
    addr: '0x216B4B4Ba9F3e719726886d34a177484278Bfcae',
    abiName: 'ParaSwapTokenTransferProxy'
  },
  {
    name: 'ParaSwapV5',
    network: 'ethereum',
    addr: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
    abiName: 'ParaSwapV5'
  },
  { name: 'Permit2', network: 'ethereum', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'polygon', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'arbitrum', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'optimism', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'SushiSwap', network: 'ethereum', addr: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', abiName: 'Sushiswap' },
  { name: 'SushiSwap', network: 'optimism', addr: '0xEb94EcA012eC0bbB254722FdDa2CE7475875A52B', abiName:'RouteProcessor' },
  { name: 'SushiSwap', network: 'polygon', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'}, // abi same as eth
  { name: 'SushiSwap', network: 'polygon', addr: '0xE7eb31f23A5BefEEFf76dbD2ED6AdC822568a5d2' }, // abi same as optimism
  { name: 'SushiSwap', network: 'fantom', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
  { name: 'SushiSwap', network: 'bsc', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'},
  { name: 'SushiSwap', network: 'avalanche', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
  { name: 'BentoBoxV1', network: 'polygon', addr: '0xc35dadb65012ec5796536bd9864ed8773abc74c4' },
  { name: 'QuickSwap', network: 'polygon', addr: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff' },
  {
    name: 'Wrapped ETH',
    network: 'ethereum',
    addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    abiName: 'WETH'
  },
  { name: 'Wrapped MATIC', network: 'polygon', addr: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270' },
  {
    name: 'Aave',
    network: 'ethereum',
    addr: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    abiAddr: '0xc6845a5c768bf8d7681249f8927877efda425baf',
    abiName: 'AaveLendingPoolV2'
  },
  { name: 'Aave', network: 'polygon', addr: '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf' },
  { name: 'Aave', network: 'ethereum', addr: '0xeffc18fc3b7eb8e676dac549e0c693ad50d1ce31' },
  {
    name: 'Aave',
    network: 'ethereum',
    addr: '0xcc9a0b7c43dc2a5f023bb9b738e45b0ef6b06e04',
    abiName: 'AaveWethGatewayV2'
  },
  {
    name: 'Aave',
    network: 'ethereum',
    addr: '0xD322A49006FC828F9B5B37Ab215F99B4E5caB19C',
    abiName: 'AaveWrappedTokenGateway'
  },
  { name: 'Aave', network: 'polygon', addr: '0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97' },
  { name: 'Aave', network: 'polygon', addr: '0x1e4b7a6b903680eab0c5dabcb8fd429cd2a9598c' },
  {
    name: 'AavePoolV3',
    network: 'ethereum',
    addr: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
    abiName: 'AavePoolV3'
  },
  {
    name: 'Aave',
    network: 'arbitrum',
    addr: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    abiName: 'AavePool'
  },
  {
    name: 'Aave',
    network: 'optimism',
    addr: '0x76D3030728e52DEB8848d5613aBaDE88441cbc59',
    abiName: 'AaveWETHGateway'
  },
  {
    name: 'Aave',
    network: 'andromeda',
    addr: '0x90df02551bB792286e8D4f13E0e357b4Bf1D6a57',
  },
  {
    name: 'Balancer',
    network: 'ethereum',
    addr: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    abiName: 'BalancerCore'
  },
  {
    name: 'StakeWise',
    network: 'ethereum',
    addr: '0xC874b064f465bdD6411D45734b56fac750Cda29A',
    abiName: 'StakeWiseETH2'
  },
  {
    name: 'Silo',
    network: 'ethereum',
    addr: '0x8658047e48cc09161f4152c79155dac1d710ff0a',
    abiName: 'SiloRouterV2'
  },
  {
    name: 'SiloLlama',
    network: 'ethereum',
    addr: '0xF380F025675A868eD5614a1Dd77c6b05f4147004',
    abiName: 'SiloLlamaRouter'
  },
  {
    name: 'Silo',
    network: 'arbitrum',
    addr: '0x9992f660137979C1ca7f8b119Cd16361594E3681',
    abiName: 'SiloRouter'
  },
  { name: 'Movr 1inch', network: 'ethereum', addr: '0x8f9eaee5c5df888aba3c1ab19689a0660d042c6d' },
  { name: 'Movr 1inch', network: 'polygon', addr: '0x2fc9c3bf505b74e59a538fe9d67bc1deb4c03d91' },
  {
    name: 'Movr Router',
    network: 'bsc',
    addr: '0xc30141B657f4216252dc59Af2e7CdB9D8792e1B0',
    abiName: 'MovrRouter'
  },
  {
    name: 'Movr Anyswap',
    network: 'polygon',
    addr: '0x3901581b7ff54667a2bf51cb93dba704e60e24f4',
    abiName: 'MovrAnyswap'
  },
  //{ name: 'Movr Anyswap', network: 'polygon', addr: '0x43aa68673e54e95e07e8388bdd8612abe6df6f81' },
  {
    name: 'Bored Ape Yacht Club',
    network: 'ethereum',
    addr: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
    abiName: 'ERC721'
  },
  ...yearnVaults,
  ...tesseractVaults,
  {
    name: 'Ambire Factory',
    network: 'ethereum',
    addr: '0xBf07a0Df119Ca234634588fbDb5625594E2a5BCA',
    abiName: 'IdentityFactory'
  },
  {
    name: 'Ambire Batcher',
    network: 'ethereum',
    addr: '0x460fad03099f67391d84c9cc0ea7aa2457969cea',
    abiName: 'Batcher'
  },
  {
    name: 'WALLET Staking Pool',
    network: 'ethereum',
    addr: '0x47cd7e91c3cbaaf266369fe8518345fc4fc12935',
    abiName: 'StakingPool'
  },
  {
    name: 'ADX Staking Pool',
    network: 'ethereum',
    addr: '0xb6456b57f03352be48bf101b46c1752a0813491a',
    abiName: 'StakingPool'
  },
  {
    name: 'OpenSea',
    network: 'ethereum',
    addr: '0x7Be8076f4EA4A4AD08075C2508e481d6C946D12b',
    abiName: 'WyvernExchange'
  },
  {
    name: 'OpenSeaDrop',
    network: 'ethereum',
    addr: '0x00005ea00ac477b1030ce78506496e8c2de24bf5',
    abiName: 'OpenSeaDrop'
  },
  {
    name: '1inch',
    network: 'ethereum',
    addr: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
    abiName: 'Swappin'
  },
  {
    name: '1inch',
    network: 'polygon',
    addr: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
    abiName: 'Swappin'
  },
  {
    name: '1inch',
    network: 'bsc',
    addr: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
    abiName: 'Swappin'
  },
  {
    name: '1inch',
    network: 'avalanche',
    addr: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
    abiName: 'Swappin'
  },
  {
    name: 'Swappin',
    network: 'ethereum',
    addr: '0x0F545C6178830e249117B5162120378735FDD635',
    abiName: 'SwappinGatewayV2'
  },
  {
    name: 'Swappin',
    network: 'ethereum',
    addr: '0xFd090f34707Ac2cA546a4B442FF708308dEd8909',
    abiName: 'SwappinNFTV2'
  },
  {
    name: 'PancakeFarm',
    network: 'bsc',
    addr: '0xa5f8c5dbd5f286960b9d90548680ae5ebff07652',
    abiName: 'PancakeMasterChefV2'
  },
  {
    name: 'SudoSwapFactory',
    network: 'ethereum',
    addr: '0xb16c1342e617a5b6e4b631eb114483fdb289c0a4',
    abiName: 'SudoSwapFactory'
  },
  {
    name: 'SudoSwapRouter',
    network: 'ethereum',
    addr: '0x2b2e8cda09bba9660dca5cb6233787738ad68329',
    abiName: 'SudoSwapRouter'
  },
  {
    name: 'LSSVMPairEnumerableETH',
    network: 'ethereum',
    addr: '0x08ce97807a81896e85841d74fb7e7b065ab3ef05',
    abiName: 'LSSVMPairEnumerableETH'
  },
  {
    name: 'Mean finance',
    network: 'ethereum',
    addr: '0xA5AdC5484f9997fBF7D405b9AA62A7d88883C345',
    abiName: 'MeanFinance'
  } ,
  {
    name:'DCAHub Companion',
    network: 'ethereum',
    addr: '0xDf0dbc66f85979a1d54671c4D9e439F306Be27EE',
    abiName: 'DCAHubCompanion'
  } ,
  {
    name: 'GMXPositionRouter',
    network: 'avalanche',
    addr: '0xffF6D276Bc37c61A23f06410Dce4A400f66420f8',
    abiName: 'GMXPositionRouter'
  },
  {
    name: 'GMXOrderHandler',
    network: 'arbitrum',
    addr: '0x352f684ab9e97a6321a13cf03a61316b681d9fd2',
    abiName: 'GMXOrderHandler'
  },
  {
    name: 'ExchangeRouter',
    network: 'arbitrum',
    addr: '0x7C68C7866A64FA2160F78EEaE12217FFbf871fa8',
    abiName: 'ExchangeRouter'
  },
  {
    name: 'ExchangeRouter',
    network: 'avalanche',
    addr: '0x11e590f6092d557bf71baded50d81521674f8275',
  },
  {
    name: 'SocketGateway',
    network: 'ethereum',
    addr: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
    abiName: 'SocketGateway'
  },
  { name: 'Gas Tank', addr: '0x942f9CE5D9a33a82F88D233AEb3292E680230348' },
  {
    name: 'Joe Router',
    network: 'avalanche',
    addr: '0x60aE616a2155Ee3d9A68541Ba4544862310933d4',
    abiName: 'JoeRouter'
  },
  {
    name: 'Lido Staking Ether',
    network: 'ethereum',
    addr: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  },
  {
    name: 'Lido Staking Ether Implementation',
    network: 'ethereum',
    addr: '0x17144556fd3424edc8fc8a4c940b2d04936d17eb',
    abiName: 'LidoStETH'
  },
  {
    name: 'stETH Withdrawal NFT (unstETH)',
    network: 'ethereum',
    addr: '0x889edc2edab5f40e902b864ad4d7ade8e412f9b1',
  },
  {
    name: 'stETH Withdrawal NFT (unstETH) implementation',
    network: 'ethereum',
    addr: '0xe42c659dc09109566720ea8b2de186c2be7d94d9',
    abiName: 'unstETH'
  },
  {
    name: 'Lido Staking Matic',
    network: 'ethereum',
    addr: '0x9ee91f9f426fa633d227f7a9b000e28b9dfd8599',
  },
  {
    name: 'Lido Staking Matic Implementation',
    network: 'ethereum',
    addr: '0x6c25aebd494a9984a3d7c8cf395c8713e0c74d98',
    abiName: 'LidoStMATIC'
  },
  {
		name: 'Swappin',
		network: 'ethereum',
		addr: '0x0c2de78e008020500c38e76e2956ae4a81c5124c',
		abiName: 'SwappinOwn'
	},
  {
		name: 'Stargate Implementation L2 V2',
		network: 'ethereum',
		addr: '0xa3c4e32af0da5efaddb20cc9fb26159f55c8c42f',
		abiName: 'StargateImplL2V2'
	},
  {
      "name":"GMX Vault",
      "network":"avalanche",
      "addr":"0x9ab2De34A33fB459b538c43f251eB825645e8595"
  },
  {
      "name":"GMX Router",
      "network":"avalanche",
      "addr":"0x5f719c2f1095f7b9fc68a68e35b51194f4b6abe8"
  },
  {
      "name":"GMX Glp Manager",
      "network":"avalanche",
      "addr":"0xe1ae4d4b06A5Fe1fc288f6B4CD72f9F8323B107F"
  },
  {
      "name":"GMX Reward RouterV2",
      "network":"avalanche",
      "addr":"0x82147C5A7E850eA4E28155DF107F2590fD4ba327"
  },
  {
      "name":"GMX GLP",
      "network":"avalanche",
      "addr":"0x01234181085565ed162a948b6a5e88758CD7c7b8"
  },
  {
      "name":"GMX GMX",
      "network":"avalanche",
      "addr":"0x62edc0692BD897D2295872a9FFCac5425011c661"
  },
  {
      "name":"GMX EsGMX",
      "network":"avalanche",
      "addr":"0xFf1489227BbAAC61a9209A08929E4c2a526DdD17"
  },
  {
      "name":"GMX BnGMX",
      "network":"avalanche",
      "addr":"0x8087a341D32D445d9aC8aCc9c14F5781E04A26d2"
  },
  {
      "name":"GMX USDG",
      "network":"avalanche",
      "addr":"0xc0253c3cC6aa5Ab407b5795a04c28fB063273894"
  },
  {
      "name":"GMX Staked Gmx Tracker",
      "network":"avalanche",
      "addr":"0x2bD10f8E93B3669b6d42E74eEedC65dd1B0a1342"
  },
  {
      "name":"GMX Bonus Gmx Tracker",
      "network":"avalanche",
      "addr":"0x908C4D94D34924765f1eDc22A1DD098397c59dD4"
  },
  {
      "name":"GMX Fee Gmx Tracker",
      "network":"avalanche",
      "addr":"0x4d268a7d4C16ceB5a606c173Bd974984343fea13"
  },
  {
      "name":"GMX Staked Glp Tracker",
      "network":"avalanche",
      "addr":"0x9e295B5B976a184B14aD8cd72413aD846C299660"
  },
  {
      "name":"GMX Fee Glp Tracker",
      "network":"avalanche",
      "addr":"0xd2D1162512F927a7e282Ef43a362659E4F2a728F"
  },
  {
      "name":"GMX Staked Gmx Distributor",
      "network":"avalanche",
      "addr":"0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a"
  },
  {
      "name":"GMX Bonus Gmx Distributor",
      "network":"avalanche",
      "addr":"0x23208b91a98c7c1cd9fe63085bff68311494f193"
  },
  {
      "name":"GMX Fee Gmx Distributor",
      "network":"avalanche",
      "addr":"0x03f349b3cc4f200d7fae4d8ddaf1507f5a40d356"
  },
  {
      "name":"GMX Staked Glp Distributor",
      "network":"avalanche",
      "addr":"0xdd593cf40734199afc9207ebe9fff23da4bf7720"
  },
  {
      "name":"GMX Fee Glp Distributor",
      "network":"avalanche",
      "addr":"0x1de098faf30bd74f22753c28db17a2560d4f5554"
  },
  {
      "name":"GMX Gmx Vester",
      "network":"avalanche",
      "addr":"0x472361d3cA5F49c8E633FB50385BfaD1e018b445"
  },
  {
      "name":"GMX Glp Vester",
      "network":"avalanche",
      "addr":"0x62331A7Bd1dfB3A7642B7db50B5509E57CA3154A"
  },
  {
      "name":"GMX Staked Glp",
      "network":"avalanche",
      "addr":"0x5643F4b25E36478eE1E90418d5343cb6591BcB9d"
  },
  {
      "name":"GMX Order Book",
      "network":"avalanche",
      "addr":"0x4296e307f108B2f583FF2F7B7270ee7831574Ae5"
  },
  {
      "name":"GMX AdlHandler",
      "network":"avalanche",
      "addr":"0x5c5DBbcDf420B5d81d4FfDBa5b26Eb24E6E60d52"
  },
  {
      "name":"GMX AdlUtils",
      "network":"avalanche",
      "addr":"0x80EDF3eA04D30FEc027C4B397ab034D7FA98b894"
  },
  {
      "name":"GMX BaseOrderUtils",
      "network":"avalanche",
      "addr":"0x1771EeeC42DA492F2294010eC5292E9bCe25f288"
  },
  {
      "name":"GMX CallbackUtils",
      "network":"avalanche",
      "addr":"0x61af99b07995cb7Ee8c2FACF6D8fb6042FeAA0d9"
  },
  {
      "name":"GMX Config",
      "network":"avalanche",
      "addr":"0x7309223E21dc2FFbb660E5Bd5aBF95ae06ba4Da0"
  },
  {
      "name":"GMX DataStore",
      "network":"avalanche",
      "addr":"0x2F0b22339414ADeD7D5F06f9D604c7fF5b2fe3f6"
  },
  {
      "name":"GMX DecreaseOrderUtils",
      "network":"avalanche",
      "addr":"0x5104257d85df1aF13b267e161E289847dd8950C6"
  },
  {
      "name":"GMX DecreasePositionCollateralUtils",
      "network":"avalanche",
      "addr":"0x901f26a57edCe65Ef3FBcCD260433De9B2279852"
  },
  {
      "name":"GMX DecreasePositionSwapUtils",
      "network":"avalanche",
      "addr":"0xb92b643950f57d0aCCf79950d6436557c869c5F8"
  },
  {
      "name":"GMX DecreasePositionUtils",
      "network":"avalanche",
      "addr":"0x17b80086D9b00f1eE4C245409b03383e9cee2A7E"
  },
  {
      "name":"GMX DepositEventUtils",
      "network":"avalanche",
      "addr":"0x1A4D623301b9f58405d3Fff7a63624411d5eb940"
  },
  {
      "name":"GMX DepositHandler",
      "network":"avalanche",
      "addr":"0x72fa3978E2E330C7B2debc23CB676A3ae63333F6"
  },
  {
      "name":"GMX DepositStoreUtils",
      "network":"avalanche",
      "addr":"0xb5fbb36853a136DD5DFf9314c48dF6AC0278dc72"
  },
  {
      "name":"GMX DepositUtils",
      "network":"avalanche",
      "addr":"0xB4085c68765bEAf991D3e4EEbC48427EDECBA778"
  },
  {
      "name":"GMX DepositVault",
      "network":"avalanche",
      "addr":"0x90c670825d0C62ede1c5ee9571d6d9a17A722DFF"
  },
  {
      "name":"GMX EventEmitter",
      "network":"avalanche",
      "addr":"0xDb17B211c34240B014ab6d61d4A31FA0C0e20c26"
  },
  {
      "name":"GMX ExecuteDepositUtils",
      "network":"avalanche",
      "addr":"0xd5C33a34915CB7199537a20F1098Ff666203C42c"
  },
  {
      "name":"GMX ExecuteWithdrawalUtils",
      "network":"avalanche",
      "addr":"0x6EBfF697250ae729AD0752f5Ca6CE98Bc62D4213"
  },
  {
      "name":"GMX FeeHandler",
      "network":"avalanche",
      "addr":"0xc7D8E3561f1247EBDa491bA5f042699C2807C33C"
  },
  {
      "name":"GMX FeeUtils",
      "network":"avalanche",
      "addr":"0xa254B60cbB85a92F6151B10E1233639F601f2F0F"
  },
  {
      "name":"GMX GasUtils",
      "network":"avalanche",
      "addr":"0xa99aC1961F3ab92aF63a217Aede378FC0e49359F"
  },
  {
      "name":"GMX IncreaseOrderUtils",
      "network":"avalanche",
      "addr":"0x40d680E41FC4Bf973F0EA664981f6359195a6383"
  },
  {
      "name":"GMX IncreasePositionUtils",
      "network":"avalanche",
      "addr":"0xDc613305e9267f0770072dEaB8c03162e0554b2d"
  },
  {
      "name":"GMX LiquidationHandler",
      "network":"avalanche",
      "addr":"0x931C18AF613f56289253F0EeD57F315dE7dbAFcd"
  },
  {
      "name":"GMX LiquidationUtils",
      "network":"avalanche",
      "addr":"0xe137BF562908DEeC9e697657f59750CE84ebbC7f"
  },
  {
      "name":"GMX MarketEventUtils",
      "network":"avalanche",
      "addr":"0x5f5B2022cC2CCe4E375c2c79F5B370A99A74940b"
  },
  {
      "name":"GMX MarketFactory",
      "network":"avalanche",
      "addr":"0xc57C155FacCd93F62546F329D1483E0E5b9C1241"
  },
  {
      "name":"GMX MarketStoreUtils",
      "network":"avalanche",
      "addr":"0x796DbDaB1e36a0969e139DD64b6AbBEEdCbFb658"
  },
  {
      "name":"GMX MarketUtils",
      "network":"avalanche",
      "addr":"0x58f9c8b240E28fD1970605001A516c3C44f8AddB"
  },
  {
      "name":"GMX Multicall3",
      "network":"avalanche",
      "addr":"0x50474CAe810B316c294111807F94F9f48527e7F8"
  },
  {
      "name":"GMX Oracle",
      "network":"avalanche",
      "addr":"0x090FA7eb8B4647DaDbEA315E68f8f88e8E62Bd54"
  },
  {
      "name":"GMX OracleModuleTest",
      "network":"avalanche",
      "addr":"0xED467Ce941BA9ec2aa74DCDAea7A53995840a79d"
  },
  {
      "name":"GMX OracleStore",
      "network":"avalanche",
      "addr":"0xA6aC2e08C6d6bbD9B237e0DaaEcd7577996f4e84"
  },
  {
      "name":"GMX OrderEventUtils",
      "network":"avalanche",
      "addr":"0x3eFdCD2B09f2C234C661a758E2304514D1bE7DAB"
  },
  {
      "name":"GMX OrderHandler",
      "network":"avalanche",
      "addr":"0xd3B6E962f135634C43415d57A28E688Fb4f15A58"
  },
  {
      "name":"GMX OrderStoreUtils",
      "network":"avalanche",
      "addr":"0x7b61992477DacB757eB92e22bfC8a19E428A94aa"
  },
  {
      "name":"GMX OrderUtils",
      "network":"avalanche",
      "addr":"0x4ef8394CD5DD7E3EE6D30824689eF461783a3360"
  },
  {
      "name":"GMX OrderVault",
      "network":"avalanche",
      "addr":"0xD3D60D22d415aD43b7e64b510D86A30f19B1B12C"
  },
  {
      "name":"GMX PositionEventUtils",
      "network":"avalanche",
      "addr":"0x77356449b835976410beA4d4571D84a1A3e048BD"
  },
  {
      "name":"GMX PositionPricingUtils",
      "network":"avalanche",
      "addr":"0xDa7ae3598A4fC9dDCc5FcF5eB81087b1ED35Ef3f"
  },
  {
      "name":"GMX PositionStoreUtils",
      "network":"avalanche",
      "addr":"0x094eD353aa973Aaa8aC41ac27B57136a6f1de539"
  },
  {
      "name":"GMX PositionUtils",
      "network":"avalanche",
      "addr":"0x174632B051728c288464Ea08a6e6EefbcaafE1eF"
  },
  {
      "name":"GMX Reader",
      "network":"avalanche",
      "addr":"0x73BA021ACF4Bb6741E82690DdB821e7936050f8C"
  },
  {
      "name":"GMX ReaderDepositUtils",
      "network":"avalanche",
      "addr":"0x731643975e628184462fdD8c0aa57104c79a6589"
  },
  {
      "name":"GMX ReaderPricingUtils",
      "network":"avalanche",
      "addr":"0x1639063F217E14635674bAA129AbC80BC21b24AA"
  },
  {
      "name":"GMX ReaderUtils",
      "network":"avalanche",
      "addr":"0x47AA86eF9aB65cceA0BF5babB5Ddd4C576125eF7"
  },
  {
      "name":"GMX ReaderWithdrawalUtils",
      "network":"avalanche",
      "addr":"0x50715a98095A137942dE15c17e18f1856E102Cf6"
  },
  {
      "name":"GMX ReferralEventUtils",
      "network":"avalanche",
      "addr":"0x2F6799988B4Fee7067217bB4C91eC5b1b7276712"
  },
  {
      "name":"GMX ReferralUtils",
      "network":"avalanche",
      "addr":"0xfbb9C41046E27405224a911f44602C3667f9D8f6"
  },
  {
      "name":"GMX RoleStore",
      "network":"avalanche",
      "addr":"0xA44F830B6a2B6fa76657a3B92C1fe74fcB7C6AfD"
  },
  {
      "name":"GMX Router",
      "network":"avalanche",
      "addr":"0x820F5FfC5b525cD4d88Cd91aCf2c28F16530Cc68"
  },
  {
      "name":"GMX SwapHandler",
      "network":"avalanche",
      "addr":"0xEE027373517a6D96Fe62f70E9A0A395cB5a39Eee"
  },
  {
      "name":"GMX SwapOrderUtils",
      "network":"avalanche",
      "addr":"0x0eaAbf9234333FF67CB8FDBc3Dafe13F7E7c2B71"
  },
  {
      "name":"GMX SwapPricingUtils",
      "network":"avalanche",
      "addr":"0xA42677E4974Ab236B72D71C3102493B484Ef39c6"
  },
  {
      "name":"GMX SwapUtils",
      "network":"avalanche",
      "addr":"0x02391482c3837C92fC51277cf7d78a179ba647C3"
  },
  {
      "name":"GMX Timelock",
      "network":"avalanche",
      "addr":"0x4Db91a1Fa4ba3c75510B2885d7d7da48E0209F38"
  },
  {
      "name":"GMX WithdrawalEventUtils",
      "network":"avalanche",
      "addr":"0x348Eca94e7c6F35430aF1cAccE27C29E9Bef9ae3"
  },
  {
      "name":"GMX WithdrawalHandler",
      "network":"avalanche",
      "addr":"0x790Ee987b9B253374d700b07F16347a7d4C4ff2e"
  },
  {
      "name":"GMX WithdrawalStoreUtils",
      "network":"avalanche",
      "addr":"0x7f8eF83C92B48a4B5B954A24D98a6cD0Ed4D160a"
  },
  {
      "name":"GMX WithdrawalUtils",
      "network":"avalanche",
      "addr":"0x8622db0e78671e3C5696AF763D6679dE5c18890c"
  },
  {
      "name":"GMX WithdrawalVault",
      "network":"avalanche",
      "addr":"0xf5F30B10141E1F63FC11eD772931A8294a591996"
  },
  {
      "name":"GMX Vault",
      "network":"arbitrum",
      "addr":"0x489ee077994B6658eAfA855C308275EAd8097C4A"
  },
  {
      "name":"GMX Router",
      "network":"arbitrum",
      "addr":"0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064"
  },
  {
      "name":"GMX Glp Manager",
      "network":"arbitrum",
      "addr":"0x321f653eed006ad1c29d174e17d96351bde22649"
  },
  {
      "name":"GMX Reward RouterV2",
      "network":"arbitrum",
      "addr":"0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1"
  },
  {
      "name":"GMX GLP",
      "network":"arbitrum",
      "addr":"0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258"
  },
  {
      "name":"GMX EsGMX",
      "network":"arbitrum",
      "addr":"0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA"
  },
  {
      "name":"GMX BnGMX",
      "network":"arbitrum",
      "addr":"0x35247165119B69A40edD5304969560D0ef486921"
  },
  {
      "name":"GMX USDG",
      "network":"arbitrum",
      "addr":"0x45096e7aA921f27590f8F19e457794EB09678141"
  },
  {
      "name":"GMX Staked Glp Tracker",
      "network":"arbitrum",
      "addr":"0x1aDDD80E6039594eE970E5872D247bf0414C8903"
  },
  {
      "name":"GMX Fee Glp Tracker",
      "network":"arbitrum",
      "addr":"0x4e971a87900b931fF39d1Aad67697F49835400b6"
  },
  {
      "name":"GMX Staked Glp Distributor",
      "network":"arbitrum",
      "addr":"0x60519b48ec4183a61ca2b8e37869e675fd203b34"
  },
  {
      "name":"GMX Fee Glp Distributor",
      "network":"arbitrum",
      "addr":"0x5c04a12eb54a093c396f61355c6da0b15890150d"
  },
  {
      "name":"GMX Gmx Vester",
      "network":"arbitrum",
      "addr":"0x199070DDfd1CFb69173aa2F7e20906F26B363004"
  },
  {
      "name":"GMX Glp Vester",
      "network":"arbitrum",
      "addr":"0xA75287d2f8b217273E7FCD7E86eF07D33972042E"
  },
  {
      "name":"GMX Timelock",
      "network":"arbitrum",
      "addr":"0x3f3e77421e30271568ef7a0ab5c5f2667675341e"
  },
  {
      "name":"GMX Staked Glp",
      "network":"arbitrum",
      "addr":"0x01AF26b74409d10e15b102621EDd29c326ba1c55"
  },
  {
      "name":"GMX Glp Balance",
      "network":"arbitrum",
      "addr":"0x13E0BbE893B33b64D4f3F96725dd70531fA4EbCe"
  },
  {
      "name":"GMX Order Book",
      "network":"arbitrum",
      "addr":"0x09f77e8a13de9a35a7231028187e9fd5db8a2acb"
  },
  {
      "name":"GMX AdlHandler",
      "network":"arbitrum",
      "addr":"0x8514fc704317057FA86961Ba9b9490956993A5ed"
  },
  {
      "name":"GMX AdlUtils",
      "network":"arbitrum",
      "addr":"0x0DBb1B891636dc90A2bCa29D1CfB80dFdd73193f"
  },
  {
      "name":"GMX BaseOrderUtils",
      "network":"arbitrum",
      "addr":"0xA2F2f7F0766cb06Fff3241Ff7D3469eFC961b907"
  },
  {
      "name":"GMX CallbackUtils",
      "network":"arbitrum",
      "addr":"0xC55e165Bf9247256DBeCA8DDE892aE9a7B271b2D"
  },
  {
      "name":"GMX Config",
      "network":"arbitrum",
      "addr":"0x226ED647C6eA2C0cE4C08578e2F37b8c2F922849"
  },
  {
      "name":"GMX DataStore",
      "network":"arbitrum",
      "addr":"0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8"
  },
  {
      "name":"GMX DecreaseOrderUtils",
      "network":"arbitrum",
      "addr":"0xADC8aAc56A7E9B17ba7338cAdF0a4a8c6ae29f8C"
  },
  {
      "name":"GMX DecreasePositionCollateralUtils",
      "network":"arbitrum",
      "addr":"0x368a8539D4034313Dc5A029C874c33e3D0CAa456"
  },
  {
      "name":"GMX DecreasePositionSwapUtils",
      "network":"arbitrum",
      "addr":"0x86e92E21a0773cF542FEcBc791c05E4bae35a92f"
  },
  {
      "name":"GMX DecreasePositionUtils",
      "network":"arbitrum",
      "addr":"0x5f95c1BbFb8985981fEDD2fb4dd28725D726Ca46"
  },
  {
      "name":"GMX DepositEventUtils",
      "network":"arbitrum",
      "addr":"0x224330635e0cA7447E42C563590C5474ceb377bc"
  },
  {
      "name":"GMX DepositHandler",
      "network":"arbitrum",
      "addr":"0x9Dc4f12Eb2d8405b499FB5B8AF79a5f64aB8a457"
  },
  {
      "name":"GMX DepositStoreUtils",
      "network":"arbitrum",
      "addr":"0x556665e81c1516B6028d04EE081518b3818D1453"
  },
  {
      "name":"GMX DepositUtils",
      "network":"arbitrum",
      "addr":"0xAA31CF8C39b1C5D56E1d87Fe940128492cC218e4"
  },
  {
      "name":"GMX DepositVault",
      "network":"arbitrum",
      "addr":"0xF89e77e8Dc11691C9e8757e84aaFbCD8A67d7A55"
  },
  {
      "name":"GMX EventEmitter",
      "network":"arbitrum",
      "addr":"0xC8ee91A54287DB53897056e12D9819156D3822Fb"
  },
  {
      "name":"GMX ExecuteDepositUtils",
      "network":"arbitrum",
      "addr":"0x527FA75aa16E4835f5298CD2Cb4f91A5b1CfBbd2"
  },
  {
      "name":"GMX ExecuteWithdrawalUtils",
      "network":"arbitrum",
      "addr":"0xb54C8fB6B2F143dD58f5B00fDE7dA4FA05077B20"
  },
  {
      "name":"GMX FeeHandler",
      "network":"arbitrum",
      "addr":"0xbF56A2F030C3F920F0E2aD9Cf456B9954c49383a"
  },
  {
      "name":"GMX FeeUtils",
      "network":"arbitrum",
      "addr":"0xbF225C4c4471419B214064cA20E1dc2523594f91"
  },
  {
      "name":"GMX GasUtils",
      "network":"arbitrum",
      "addr":"0x6Ee83F82757C5B10468855753F5374FFF826BDCB"
  },
  {
      "name":"GMX IncreaseOrderUtils",
      "network":"arbitrum",
      "addr":"0xbbdB0d899698146119FE63e4B4d9efD8af23B448"
  },
  {
      "name":"GMX IncreasePositionUtils",
      "network":"arbitrum",
      "addr":"0x78cf6e5370A262Ff6618D328cd748b2Fa1917Ca4"
  },
  {
      "name":"GMX LiquidationHandler",
      "network":"arbitrum",
      "addr":"0x9e0521C3dbB18E849F4955087E065E5C9C879917"
  },
  {
      "name":"GMX LiquidationUtils",
      "network":"arbitrum",
      "addr":"0xa0C51Eb832c683d69AF71C225FA9b57ee409299E"
  },
  {
      "name":"GMX MarketEventUtils",
      "network":"arbitrum",
      "addr":"0xdfE1EA56e7200B04ee596737CAee714937824304"
  },
  {
      "name":"GMX MarketStoreUtils",
      "network":"arbitrum",
      "addr":"0x41613136174912714faF4cF0680fB1Acbe0cC7D1"
  },
  {
      "name":"GMX MarketUtils",
      "network":"arbitrum",
      "addr":"0x7ffF7ef2fc8Db5159B0046ad49d018A5aB40dB11"
  },
  {
      "name":"GMX Multicall3",
      "network":"arbitrum",
      "addr":"0xe79118d6D92a4b23369ba356C90b9A7ABf1CB961"
  },
  {
      "name":"GMX Oracle",
      "network":"arbitrum",
      "addr":"0xa11B501c2dd83Acd29F6727570f2502FAaa617F2"
  },
  {
      "name":"GMX OracleModuleTest",
      "network":"arbitrum",
      "addr":"0x2e246061BE08DC56d33E03Dc0cb962C2155722b5"
  },
  {
      "name":"GMX OracleStore",
      "network":"arbitrum",
      "addr":"0xA8AF9B86fC47deAde1bc66B12673706615E2B011"
  },
  {
      "name":"GMX OrderEventUtils",
      "network":"arbitrum",
      "addr":"0x805a15bf16582eC8d76841062A47dFfEa7903131"
  },
  {
      "name":"GMX OrderStoreUtils",
      "network":"arbitrum",
      "addr":"0xA5cd5caA2453DAf1Daaf1A5C8e9E52CBB750386B"
  },
  {
      "name":"GMX OrderUtils",
      "network":"arbitrum",
      "addr":"0x09C7a13E0ff43d4F9e3cfd2ED3b2b41198aF761f"
  },
  {
      "name":"GMX OrderVault",
      "network":"arbitrum",
      "addr":"0x31eF83a530Fde1B38EE9A18093A333D8Bbbc40D5"
  },
  {
      "name":"GMX PositionEventUtils",
      "network":"arbitrum",
      "addr":"0x0F9BB54Ec2cC65344Cde88CFB06C71F68599D2A4"
  },
  {
      "name":"GMX PositionPricingUtils",
      "network":"arbitrum",
      "addr":"0xAC3D81b7a9CEaC542c556734799c0f68Ae1CDA4d"
  },
  {
      "name":"GMX PositionStoreUtils",
      "network":"arbitrum",
      "addr":"0xdFEC6f2a72Bea53660a04806CcEefA7b970a0e46"
  },
  {
      "name":"GMX PositionUtils",
      "network":"arbitrum",
      "addr":"0xd7458f20433F77D81B066361435E17dBBc33fEf4"
  },
  {
      "name":"GMX Reader",
      "network":"arbitrum",
      "addr":"0xf60becbba223EEA9495Da3f606753867eC10d139"
  },
  {
      "name":"GMX ReaderDepositUtils",
      "network":"arbitrum",
      "addr":"0x43D27C0E3b235Ad25e787C80c8Bdfab731CBa26C"
  },
  {
      "name":"GMX ReaderPricingUtils",
      "network":"arbitrum",
      "addr":"0xaF7984F705249f2C8720a634dD0d8b00d5eE5d39"
  },
  {
      "name":"GMX ReaderUtils",
      "network":"arbitrum",
      "addr":"0xAe2453Dca7704080052AF3c212E862cab50d65C0"
  },
  {
      "name":"GMX ReaderWithdrawalUtils",
      "network":"arbitrum",
      "addr":"0xE2628EBb4AeBbc246f758942c48E87B646eE75b3"
  },
  {
      "name":"GMX ReferralEventUtils",
      "network":"arbitrum",
      "addr":"0x7f397B555f71F711d5331241519825180dc78489"
  },
  {
      "name":"GMX ReferralUtils",
      "network":"arbitrum",
      "addr":"0x4045A052a14A08D5053d79AfD06128cFb3946AA8"
  },
  {
      "name":"GMX RoleStore",
      "network":"arbitrum",
      "addr":"0x3c3d99FD298f679DBC2CEcd132b4eC4d0F5e6e72"
  },
  {
      "name":"GMX Router",
      "network":"arbitrum",
      "addr":"0x7452c558d45f8afC8c83dAe62C3f8A5BE19c71f6"
  },
  {
      "name":"GMX SwapHandler",
      "network":"arbitrum",
      "addr":"0xF6b804F6Cc847a22F2D022C9b0373190850bE34D"
  },
  {
      "name":"GMX SwapOrderUtils",
      "network":"arbitrum",
      "addr":"0x1DAB177e756bA3C0E22ac1dE7a030b76dd158174"
  },
  {
      "name":"GMX SwapPricingUtils",
      "network":"arbitrum",
      "addr":"0xFD20A53afd789997451f1c9Dd8C02d6A6D3F96dC"
  },
  {
      "name":"GMX SwapUtils",
      "network":"arbitrum",
      "addr":"0xb34A6e9Dc8E721361a9C620EEF245535d6A5B234"
  },
  {
      "name":"GMX Timelock",
      "network":"arbitrum",
      "addr":"0x62aB76Ed722C507f297f2B97920dCA04518fe274"
  },
  {
      "name":"GMX WithdrawalEventUtils",
      "network":"arbitrum",
      "addr":"0xAd7a7568F500F65AEA3D9417A210CBc5dcD7b273"
  },
  {
      "name":"GMX WithdrawalHandler",
      "network":"arbitrum",
      "addr":"0x9E32088F3c1a5EB38D32d1Ec6ba0bCBF499DC9ac"
  },
  {
      "name":"GMX WithdrawalStoreUtils",
      "network":"arbitrum",
      "addr":"0x713c6a2479f6C079055A6AD3690D95dEDCEf9e1e"
  },
  {
      "name":"GMX WithdrawalUtils",
      "network":"arbitrum",
      "addr":"0x46088fA22988c40CE5aBC0647a7638D27A8bF7d1"
  },
  {
      "name":"GMX WithdrawalVault",
      "network":"arbitrum",
      "addr":"0x0628D46b5D145f183AdB6Ef1f2c97eD1C4701C55"
  },
  {
      "name":"Account abstraction entry point v0.6.0",
      "network":"ethereum",
      "addr":"0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
      "abiName":"ERC-4337-EntryPoint-0.6.0"
  },
  {
    "name":"L2 WETH Gateway",
    "network":"scroll",
    "addr":"0x7003E7B7186f0E6601203b99F7B8DECBfA391cf9",
    "abiName":"L2-WETH-Gateway"
  },
  {
    "name":"L2 ERC20 Standard Gateway",
    "network":"scroll",
    "addr":"0xE2b4795039517653c5Ae8C2A9BFdd783b48f447A",
    "abiName":"L2-ERC20-Standard-Gateway"
  },
  {
    "name":"L2 ERC20 Custom Gateway",
    "network":"scroll",
    "addr":"0x64CCBE37c9A82D85A1F2E74649b7A42923067988",
    "abiName":"L2-ERC20-Custom-Gateway"
  },
  {
    "name":"Uni Router",
    "network":"scroll",
    "addr":"0xfc30937f5cDe93Df8d48aCAF7e6f5D8D8A31F636",
  },
  {
    "name":"NFT Position Manager",
    "network":"scroll",
    "addr":"0xB39002E4033b162fAc607fc3471E205FA2aE5967",
  },
  {
    "name":"NFT Position Manager",
    "network":"scroll",
    "addr":"0xB39002E4033b162fAc607fc3471E205FA2aE5967",
  },
  {
    "name":"Aave Pool",
    "network":"scroll",
    "addr":"0x11fCfe756c05AD438e312a7fd934381537D3cFfe",
  },
  {
    "name":"Paraswap router",
    "network":"ethereum",
    "addr":"0x6a000f20005980200259b80c5102003040001068",
    "abiName": "ParaswapRouter"
  }
]
const tokenlists = [
  'https://github.com/trustwallet/assets/raw/master/blockchains/ethereum/tokenlist.json',
  //'https://api.coinmarketcap.com/data-api/v3/uniswap/all.json',
  'https://tokens.coingecko.com/uniswap/all.json',
  'https://github.com/trustwallet/assets/raw/master/blockchains/polygon/tokenlist.json',
  'https://api-polygon-tokens.polygon.technology/tokenlists/allTokens.tokenlist.json'
]

const customTokens = [
  {
    address: '0x88800092ff476844f74dc2fc427974bbee2794ae',
    symbol: 'WALLET',
    decimals: 18
  },
  // {
  //   address: '0x55d398326f99059ff775485246999027b3197955',
  //   symbol: 'USDT',
  //   decimals: 6
  // },
  {
    address: '0x47cd7e91c3cbaaf266369fe8518345fc4fc12935',
    symbol: 'xWALLET',
    decimals: 18
  },
  {
    address: '0x0ed7e52944161450477ee417de9cd3a859b14fd0',
    symbol: 'Cake-BNB LP',
    decimals: 18
  },
  {
    address: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16',
    symbol: 'BNB-BUSD LP',
    decimals: 18
  },
  {
    address: '0x28415ff2c35b65b9e5c7de82126b4015ab9d031f',
    symbol: 'ADA-BNB LP',
    decimals: 18
  },
  {
    address: '0xdd5bad8f8b360d76d12fda230f8baf42fe0022cf',
    symbol: 'DOT-BNB LP',
    decimals: 18
  },
  {
    address: '0x824eb9fadfb377394430d2744fa7c42916de3ece',
    symbol: 'BNB-LINK LP',
    decimals: 18
  },
  {
    address: '0x7efaef62fddcca950418312c6c91aef321375a00',
    symbol: 'USDT-BUSD LP',
    decimals: 18
  },
  {
    address: '0x3dcb1787a95d2ea0eb7d00887704eebf0d79bb13',
    symbol: 'TWT-BNB LP',
    decimals: 18
  },
  {
    address: '0x7eb5d86fd78f3852a3e0e064f2842d45a3db6ea2',
    symbol: 'BNB-XVS LP',
    decimals: 18
  },
  {
    address: '0x74e4716e431f45807dcf19f284c7aa99f18a4fbc',
    symbol: 'ETH-BNB LP',
    decimals: 18
  },
  {
    address: '0x61eb789d75a95caa3ff50ed7e47b96c132fec082',
    symbol: 'BTCB-BNB LP',
    decimals: 18
  },
  {
    address: '0xacf47cbeaab5c8a6ee99263cfe43995f89fb3206',
    symbol: 'ALPHA-BNB LP',
    decimals: 18
  },
  {
    address: '0x16b9a82891338f9ba80e2d6970fdda79d1eb0dae',
    symbol: 'USDT-BNB LP',
    decimals: 18
  },
  {
    address: '0x03f18135c44c64ebfdcbad8297fe5bdafdbbdd86',
    symbol: 'XRP-BNB LP',
    decimals: 18
  },
  {
    address: '0x014608e87af97a054c9a49f81e1473076d51d9a3',
    symbol: 'BNB-UNI LP',
    decimals: 18
  },
  {
    address: '0x1bdcebca3b93af70b58c41272aea2231754b23ca',
    symbol: 'INJ-BNB LP',
    decimals: 18
  },
  {
    address: '0xd8e2f8b6db204c405543953ef6359912fe3a88d6',
    symbol: 'SXP-BNB LP',
    decimals: 18
  },
  {
    address: '0x133ee93fe93320e1182923e1a640912ede17c90c',
    symbol: 'VAI-BUSD LP',
    decimals: 18
  },
  {
    address: '0x66fdb2eccfb58cf098eaa419e5efde841368e489',
    symbol: 'DAI-BUSD LP',
    decimals: 18
  },
  {
    address: '0x2354ef4df11afacb85a5c7f98b624072eccddbb1',
    symbol: 'USDC-BUSD LP',
    decimals: 18
  },
  {
    address: '0x71b01ebddd797c8e9e0b003ea2f4fd207fbf46cc',
    symbol: 'LTC-BNB LP',
    decimals: 18
  },
  {
    address: '0xb2678c414ebc63c9cc6d1a0fc45f43e249b50fde',
    symbol: 'BTCST-BNB LP',
    decimals: 18
  },
  {
    address: '0x05faf555522fa3f93959f86b41a3808666093210',
    symbol: 'UST-BUSD LP',
    decimals: 18
  },
  {
    address: '0xc5768c5371568cf1114cddd52caed163a42626ed',
    symbol: 'LINA-BUSD LP',
    decimals: 18
  },
  {
    address: '0x942b294e59a8c47a0f7f20df105b082710f7c305',
    symbol: 'BNB-SFP LP',
    decimals: 18
  },
  {
    address: '0x16afc4f2ad82986bbe2a4525601f8199ab9c832d',
    symbol: 'ETH-SUSHI LP',
    decimals: 18
  },
  {
    address: '0xc13aa76aac067c86ae38028019f414d731b3d86a',
    symbol: 'IOTX-BUSD LP',
    decimals: 18
  },
  {
    address: '0xe834bf723f5bdff34a5d1129f3c31ea4787bc76a',
    symbol: 'RAMP-BUSD LP',
    decimals: 18
  },
  {
    address: '0xf3bc6fc080ffcc30d93df48bfa2aa14b869554bb',
    symbol: 'BNB-BELT LP',
    decimals: 18
  },
  {
    address: '0xcad7019d6d84a3294b0494aef02e73bd0f2572eb',
    symbol: 'ALICE-BNB LP',
    decimals: 18
  },
  {
    address: '0x3f1a9f3d9aad8bd339ed4853f345d2ef89fbfe0c',
    symbol: 'BNB-BIFI LP',
    decimals: 18
  },
  {
    address: '0xffd4b200d3c77a0b691b5562d804b3bd54294e6e',
    symbol: 'TKO-BNB LP',
    decimals: 18
  },
  {
    address: '0xdde420cbb3794ebd8ffc3ac69f9c78e5d1411870',
    symbol: 'EPS-BNB LP',
    decimals: 18
  },
  {
    address: '0xe6b421a4408c82381b226ab5b6f8c4b639044359',
    symbol: 'TLM-BNB LP',
    decimals: 18
  },
  {
    address: '0x7752e1fa9f3a2e860856458517008558deb989e3',
    symbol: 'ALPACA-BUSD LP',
    decimals: 18
  },
  {
    address: '0xf45cd219aef8618a92baa7ad848364a158a24f33',
    symbol: 'BTCB-BUSD LP',
    decimals: 18
  },
  {
    address: '0xac109c8025f272414fd9e2faa805a583708a017f',
    symbol: 'DOGE-BNB LP',
    decimals: 18
  },
  {
    address: '0xf23bad605e94de0e3b60c9718a43a94a5af43915',
    symbol: 'HOTCROSS-BNB LP',
    decimals: 18
  },
  {
    address: '0x804678fa97d91b974ec2af3c843270886528a9e6',
    symbol: 'Cake-BUSD LP',
    decimals: 18
  },
  {
    address: '0x6045931e511ef7e53a4a817f971e0ca28c758809',
    symbol: 'BUSD-CHR LP',
    decimals: 18
  },
  {
    address: '0x2e28b9b74d6d99d4697e913b82b41ef1cac51c6c',
    symbol: 'TUSD-BUSD LP',
    decimals: 18
  },
  {
    address: '0x8fa59693458289914db0097f5f366d771b7a7c3f',
    symbol: 'MBOX-BNB LP',
    decimals: 18
  },
  {
    address: '0xd171b26e4484402de70e3ea256be5a2630d7e88d',
    symbol: 'ETH-BTCB LP',
    decimals: 18
  },
  {
    address: '0xea26b78255df2bbc31c1ebf60010d78670185bd0',
    symbol: 'ETH-USDC LP',
    decimals: 18
  },
  {
    address: '0x89ee0491ce55d2f7472a97602a95426216167189',
    symbol: 'WOO-BNB LP',
    decimals: 18
  },
  {
    address: '0xba01662e978de7d67f8ffc937726215eb8995d17',
    symbol: 'BSCPAD-BNB LP',
    decimals: 18
  },
  {
    address: '0xa39af17ce4a8eb807e076805da1e2b8ea7d0755b',
    symbol: 'Cake-USDT LP',
    decimals: 18
  },
  {
    address: '0xec6557348085aa57c72514d67070dc863c0a5a8c',
    symbol: 'USDT-USDC LP',
    decimals: 18
  },
  {
    address: '0x89ebf9cd99864f6e51bd7a578965922029cab977',
    symbol: 'DVI-BNB LP',
    decimals: 18
  },
  {
    address: '0x9d2296e2fe3cdbf2eb3e3e2ca8811bafa42eedff',
    symbol: 'ONE-BNB LP',
    decimals: 18
  },
  {
    address: '0x1472976e0b97f5b2fc93f1fff14e2b5c4447b64f',
    symbol: 'CHESS-USDC LP',
    decimals: 18
  },
  {
    address: '0xc2d00de94795e60fb76bc37d899170996cbda436',
    symbol: 'AXS-BNB LP',
    decimals: 18
  },
  {
    address: '0x92247860a03f48d5c6425c7ca35cdcfcb1013aa1',
    symbol: 'C98-BNB LP',
    decimals: 18
  },
  {
    address: '0xfdfde3af740a22648b9dd66d05698e5095940850',
    symbol: 'SPS-BNB LP',
    decimals: 18
  },
  {
    address: '0x6a445ceb72c8b1751755386c3990055ff92e14a0',
    symbol: 'WIN-BUSD LP',
    decimals: 18
  },
  {
    address: '0xb5d108578be3750209d1b3a8f45ffee8c5a75146',
    symbol: 'TRX-BUSD LP',
    decimals: 18
  },
  {
    address: '0x59fac9e98479fc9979ae2a0c7422af50bcbb9b26',
    symbol: 'rUSD-BUSD LP',
    decimals: 18
  },
  {
    address: '0x2bf2deb40639201c9a94c9e33b4852d9aea5fd2d',
    symbol: 'BP-BNB LP',
    decimals: 18
  },
  {
    address: '0x74fa517715c4ec65ef01d55ad5335f90dce7cc87',
    symbol: 'SFUND-BNB LP',
    decimals: 18
  },
  {
    address: '0x0ecc84c9629317a494f12bc56aa2522475bf32e8',
    symbol: 'NFT-BNB LP',
    decimals: 18
  },
  {
    address: '0x88a02d94f437799f06f8c256ff07aa397e6d0016',
    symbol: 'BNB-BETA LP',
    decimals: 18
  },
  {
    address: '0x11c0b2bb4fbb430825d07507a9e24e4c32f7704d',
    symbol: 'LAZIO-BNB LP',
    decimals: 18
  },
  {
    address: '0x365c3f921b2915a480308d0b1c04aef7b99c2876',
    symbol: 'DKT-BNB LP',
    decimals: 18
  },
  {
    address: '0x6db23b5360c9d2859fdcbf41c56494e7b8573649',
    symbol: 'FINA-BUSD LP',
    decimals: 18
  },
  {
    address: '0x062f88e2b4896e823ac78ac314468c29eec4186d',
    symbol: 'DAR-BNB LP',
    decimals: 18
  },
  {
    address: '0x936928146a21afccd30dfa84824a780572b1630b',
    symbol: 'XWG-USDC LP',
    decimals: 18
  },
  {
    address: '0x0a292e96abb35297786a38fdd67dc4f82689e670',
    symbol: 'PORTO-BNB LP',
    decimals: 18
  },
  {
    address: '0xf924e642f05acc57fc3b14990c2b1a137683b201',
    symbol: 'QI-BNB LP',
    decimals: 18
  },
  {
    address: '0x06043b346450bbcfde066ebc39fdc264fdffed74',
    symbol: 'SANTOS-BNB LP',
    decimals: 18
  },
  {
    address: '0x71e6de81381efe0aa98f56b3b43eb3727d640715',
    symbol: 'IDIA-BUSD LP',
    decimals: 18
  },
  {
    address: '0x486697ae24469cb1122f537924aa46e705b142aa',
    symbol: 'THG-BNB LP',
    decimals: 18
  },
  {
    address: '0x141e9558f66cc21c93628400cca7d830c15c2c24',
    symbol: 'BNB-DPT LP',
    decimals: 18
  },
  {
    address: '0xe98ac95a1db2fcaaa9c7d4ba7ecfce4877ca2bea',
    symbol: 'HIGH-BUSD LP',
    decimals: 18
  },
  {
    address: '0x2ae94a6c768d59f5ddc25bd7f12c7cbe1d51dc04',
    symbol: 'WOOP-BNB LP',
    decimals: 18
  },
  {
    address: '0x88c9bf5e334e2591c6a866d5e20683e31226be3d',
    symbol: 'AOG-BUSD LP',
    decimals: 18
  },
  {
    address: '0x2eebe0c34da9ba65521e98cbaa7d97496d05f489',
    symbol: 'BCOIN-BNB LP',
    decimals: 18
  },
  {
    address: '0xa0ee789a8f581cb92dd9742ed0b5d54a0916976c',
    symbol: 'APX-BUSD LP',
    decimals: 18
  },
  {
    address: '0x1ce76390dd210b9c9ae28373fdf79714206ecb73',
    symbol: 'BNB-Froyo LP',
    decimals: 18
  },
  {
    address: '0x6483f166b9e4310a165a55fea04f867499aded06',
    symbol: 'FUSE-BNB LP',
    decimals: 18
  },
  {
    address: '0x70531b39e2bb4d8da59e2ce41a98eba2990f8497',
    symbol: 'ERTHA-BNB LP',
    decimals: 18
  },
  {
    address: '0x8e744ec2795c8b836689d1b4ebe1489204357dac',
    symbol: 'RACA-BUSD LP',
    decimals: 18
  },
  {
    address: '0x28bdb16b623176426305a70d8b475be73aca71f3',
    symbol: 'USDT-ACH LP',
    decimals: 18
  },
  {
    address: '0xb7e73daee6a6ca37a21f8e4bfba4da448dfe4d92',
    symbol: 'BTT-BUSD LP',
    decimals: 18
  },
  {
    address: '0x53a63ac301d6410915385294527f947aff616599',
    symbol: 'ERA-BNB LP',
    decimals: 18
  },
  {
    address: '0x007ec643c7cc33a70c083fc305c283dd009c8b94',
    symbol: 'GMT-USDC LP',
    decimals: 18
  },
  {
    address: '0xbdf0aa1d1985caa357a6ac6661d838da8691c569',
    symbol: 'Cake-DUET LP',
    decimals: 18
  },
  {
    address: '0x8ca3ff14a52b080c54a6d1a405eeca02959d39fe',
    symbol: 'BSW-BNB LP',
    decimals: 18
  },
  {
    address: '0x1ccc3cc95c8148477afd18a552f03835be9d182a',
    symbol: 'Cake-Froyo LP',
    decimals: 18
  },
  {
    address: '0x58d4b61983ca0afe6e352e90719f403e24e016f4',
    symbol: 'GMI-BNB LP',
    decimals: 18
  },
  {
    address: '0x5ca96e8bde0bc587dac9e02422fd205b1102daa4',
    symbol: 'PEX-BNB LP',
    decimals: 18
  },
  {
    address: '0x0d5b9a0f4315a4bce36d1ea7d6b6d3123167afaa',
    symbol: 'TINC-BNB LP',
    decimals: 18
  },
  {
    address: '0x046a9b3a9b743340ee2bc4c6ddd35543e237c6c2',
    symbol: 'CEEK-BNB LP',
    decimals: 18
  },
  {
    address: '0x008604a38cd589680f7b8f085dc2d5b4f81151db',
    symbol: 'HAPPY-BNB LP',
    decimals: 18
  },
  {
    address: '0xee456d906a38e10680c9d157fff143390e9681ba',
    symbol: 'WZRD-BUSD LP',
    decimals: 18
  },
  ...Object.keys(ambireTokenList)
    .map((n) => ambireTokenList[n])
    .flat()
]

async function generate() {
  let abis = {}
  for (let contract of contracts) {
    const { network, addr, abiName, abiAddr } = contract
    if (!abiName) continue

    if (addr !== SWAPPIN_UNVERIFIED_NFT_CONTRACT_ADDR) {
      const { host, key } = etherscans[network]
      // @TODO rate limiting
      const url = (network === 'kucoin') ? 
        `https://api.explorer.kcc.io/vipapi/contract/getabi?address=${abiAddr || addr}&apikey=${key}` :
        `https://${host}/api?module=contract&action=getabi&address=${abiAddr || addr}&apikey=${key}`
      const abiResp = await fetch(url).then((r) => r.json())
      if (abiResp.status !== '1') throw abiResp

      abis[abiName] = JSON.parse(abiResp.result)

      continue
    }

    // console.log(SWAPPIN_NFT_ABI)
    abis[abiName] = SWAPPIN_NFT_ABI
  }
  abis.ERC20 = ERC20

  let names = {}
  contracts.forEach(({ name, addr }) => {
    const address = addr.toLowerCase()
    if (names[address] && names[address] !== name)
      throw new Error(`unexpected name confict: ${addr} ${name}`)
    names[address] = name
  })

  const tokenLists = (
    await Promise.all(tokenlists.map(async (url) => await fetch(url).then((r) => r.json())))
  ).concat({ tokens: customTokens })

	const tokens = tokenLists.filter((tokenListT) => typeof tokenListT === 'object').reduce((acc, list) => {
		list.tokens.forEach((t) => {
			const address = t.address.toLowerCase()

			if (acc[address] && t.decimals !== acc[address][1]) {
				throw new Error('unexpected token conflict: same addr token, different decimals')
			}
			acc[address] = [t.symbol, t.decimals]
		})
		return acc
	}, {})

  console.log(JSON.stringify({ abis, tokens, names, yearnVaults, tesseractVaults }, null, 2))
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
