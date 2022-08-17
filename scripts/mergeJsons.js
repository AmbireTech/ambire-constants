const jsonfile = require('jsonfile')
// Single file
const adexToStakingTransfers = require('../constants/rpc/adexToStakingTransfers.json')
// Files to merge
const WALLETInitialClaimableRewards = require('../constants/WALLETInitialClaimableRewards.json')
const tokenList = require('../constants/tokenList.json')
const humanizerInfo = require('../constants/humanizerInfo.json')

const result = WALLETInitialClaimableRewards.concat(tokenList).concat(humanizerInfo)
 
jsonfile.writeFile('build/result.json', result)
  .then(() => console.log('Merge complete'))
  .catch(error => console.error(error))

jsonfile.writeFile('build/adexToStakingTransfers.json', adexToStakingTransfers)
  .then(() => console.log('adexToStakingTransfers copy complete'))
  .catch(err => console.log(err))