#!/usr/bin/env node
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const ERC20 = require('adex-protocol-eth/abi/ERC20.json')
const ambireTokenList = require('../constants/tokenList.json')

const etherscans = {
  ethereum: { host: 'api.etherscan.io', key: 'KJJ4NZ9EQHIFCQY5IJ775PT128YE15AV5S' },
  polygon: { host: 'api.polygonscan.com', key: 'YE5YYHA7BH6IPBN5T71UKW5MPEFZ5HUGJJ' },
  bsc: { host: 'api.bscscan.com', key: 'YQM54RYW91YSQA4QJZIJT4E6NWGKTZKQG3' },
  arbitrum: { host: 'api.arbiscan.io/', key: 'FIIYWMPVI4A9EPVZITN8R1YGFTFK84I12A' },
  optimism: { host: 'api-optimistic.etherscan.io', key: '959ZZFJ3A53JT4IR3HNHZHJX426NQHZWWS' },
  avalanche: { host: 'api.snowtrace.io', key: 'PE6FNFM267GVCM3J23QX26J3WWUKI46FJZ' }, 
  moonriver: { host: 'api-moonriver.moonscan.io', key: 'BCVGVFUVUAIEKE914PRQW2RTZUJ8ZB5GS8' },
  moonbeam: { host: 'api-moonbeam.moonscan.io', key: 'UIYN6R2PEUM86KQGIM9AFRFQB5IVQ72SY2' },
  andromeda: { host: 'andromeda-explorer.metis.io', key: '' },
  fantom: { host: 'api.ftmscan.com', key: 'D2UJ8TV1UNUDA4TPWE2DWTPF69PWAJPTNG' },
  gnosis: { host: 'blockscout.com/eth/mainnet', key: ''},
  kucoin: { host: 'api.explorer.kcc.io/vip', key: 'cpzPVTSUT2FowxQOFlIn'}
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
    addr: '0x6FDb43bca2D8fe6284242d92620156205d4fA028'
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
    addr: '0x4c60051384bd2d3c01bfc845cf5f4b44bcbe9de5',
    abiName: 'UniswapUniversalRouter'
  },
  { name: 'Permit2', network: 'ethereum', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'polygon', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'arbitrum', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'Permit2', network: 'optimism', addr: '0x000000000022d473030f116ddee9f6b43ac78ba3', abiName: 'Permit2' },
  { name: 'SushiSwap', network: 'ethereum', addr: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F' },
  { name: 'SushiSwap', network: 'polygon', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
  { name: 'SushiSwap', network: 'fantom', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
  { name: 'SushiSwap', network: 'bsc', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
  { name: 'SushiSwap', network: 'avalanche', addr: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506' },
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
  { name: 'Aave', network: 'polygon', addr: '0xbEadf48d62aCC944a06EEaE0A9054A90E5A7dc97' },
  { name: 'Aave', network: 'polygon', addr: '0x1e4b7a6b903680eab0c5dabcb8fd429cd2a9598c' },
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
    addr: '0x0c2de78e008020500c38e76e2956ae4a81c5124c',
    abiName: 'SwappinOwn'
  },
  {
    name: 'Swappin',
    network: 'polygon',
    addr: '0x0c2de78e008020500c38e76e2956ae4a81c5124c',
    abiName: 'SwappinOwn'
  },
  {
    name: 'Swappin',
    network: 'bsc',
    addr: '0x0c2de78e008020500c38e76e2956ae4a81c5124c',
    abiName: 'SwappinOwn'
  },
  {
    name: 'Swappin',
    network: 'avalanche',
    addr: '0x0c2de78e008020500c38e76e2956ae4a81c5124c',
    abiName: 'SwappinOwn'
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
  { name: 'Gas Tank', addr: '0x942f9CE5D9a33a82F88D233AEb3292E680230348' }
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
  {
    address: '0x55d398326f99059ff775485246999027b3197955',
    symbol: 'USDT',
    decimal: 6
  },
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
    const { host, key } = etherscans[network]
    // @TODO rate limiting
    const url = (network === 'kucoin') ? 
      `https://api.explorer.kcc.io/vipapi/contract/getabi?address=${abiAddr || addr}&apikey=${key}` :
      `https://${host}/api?module=contract&action=getabi&address=${abiAddr || addr}&apikey=${key}`
    const abiResp = await fetch(url).then((r) => r.json())
    if (abiResp.status !== '1') throw abiResp
    abis[abiName] = JSON.parse(abiResp.result)
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

  const tokens = tokenLists.reduce((acc, list) => {
    list.tokens.forEach((t) => {
      const address = t.address.toLowerCase()
      if (acc[address] && acc[address].decimals !== acc[address].decimals) {
        throw new Error('unexpected token conflict: same addr token, different decimals')
      }
      acc[address] = [t.symbol, t.decimals]
    })
    return acc
  }, {})
  console.log(JSON.stringify({ abis, tokens, names, yearnVaults, tesseractVaults }))
}

generate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
