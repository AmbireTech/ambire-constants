const jsonfile = require('jsonfile')
// Single file
const adexToStakingTransfers = require('../constants/rpc/adexToStakingTransfers.json')
// Files to merge
const WALLETInitialClaimableRewards = require('../constants/WALLETInitialClaimableRewards.json')
const tokenList = require('../constants/tokenList.json')
const humanizerInfo = require('../constants/humanizerInfo.json')
const packageJson = require('../constants/build-package.json')

const result = {
  WALLETInitialClaimableRewards: WALLETInitialClaimableRewards, 
  tokenList: tokenList, 
  humanizerInfo: humanizerInfo
}
 
jsonfile.writeFile('build/result.json', result)
  .then(() => console.log('Merge complete'))
  .catch(error => console.error(error))

jsonfile.writeFile('build/adexToStakingTransfers.json', adexToStakingTransfers)
  .then(() => console.log('adexToStakingTransfers copy complete'))
  .catch(err => console.log(err))

jsonfile.writeFile('build/package.json', packageJson)
  .then(() => console.log('Package.json built'))
  .catch(error => console.log(error))