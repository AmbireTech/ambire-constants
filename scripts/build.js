const jsonfile = require('jsonfile')
const fs = require('fs')
// Single file
const adexToStakingTransfers = require('../constants/rpc/adexToStakingTransfers.json')
const packageJson = require('../constants/build-package.json')
// Files to merge
const tokenList = require('../constants/tokenList.json')
const humanizerInfo = require('../constants/humanizerInfo.json')
const customTokens = require('../constants/customTokens.json')

const tokenListToLowerCaseAddresses = {}

Object.keys(tokenList).forEach((key) => {
  if (Array.isArray(tokenList[key])) {
    tokenListToLowerCaseAddresses[key] = tokenList[key].map((item) => {
      const newItem = { ...item };
      if (newItem.hasOwnProperty("address")) {
        newItem.address = newItem.address.toLowerCase();
      }
      return newItem;
    });
  }
})

const result = {
  tokenList: JSON.stringify(tokenListToLowerCaseAddresses), 
  humanizerInfo: humanizerInfo,
  ...customTokens
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