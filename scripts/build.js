const jsonfile = require('jsonfile')
const fs = require('fs')
// Single file
const adexToStakingTransfers = require('../constants/rpc/adexToStakingTransfers.json')
const packageJson = require('../constants/build-package.json')
// Files to merge
const tokenList = require('../constants/tokenList.json')
const humanizerInfo = require('../constants/humanizerInfo.json')

const result = {
  tokenList: tokenList, 
  humanizerInfo: humanizerInfo
}
 
jsonfile.writeFile('build/result.json', result)
  .then(() => console.log('Merge complete'))
  .catch(err => console.error(err))

jsonfile.writeFile('build/adexToStakingTransfers.json', adexToStakingTransfers)
  .then(() => console.log('adexToStakingTransfers copy complete'))
  .catch(err => console.log(err))

jsonfile.writeFile('build/package.json', packageJson)
  .then(() => console.log('Package.json built'))
  .catch(err => console.log(err))

fs.writeFile("build/CNAME", "jason.ambire.com", (err) => {
  if(err) {
    return console.log(err);
  }
  console.log('CNAME file added')
})

jsonfile.writeFile('build/cache.json', {
  lastUpdated: Date.now()
}).then(() => console.log('Cache.json built'))
.catch(err => console.log(err))