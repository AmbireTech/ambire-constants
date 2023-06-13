const tokenList = require('../constants/tokenList.json')

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

console.log(JSON.stringify(tokenListToLowerCaseAddresses))
