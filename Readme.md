# Ambire constants

## 📕 About 📕

This repository contains the static files, shared between `ambire-common` and the `web` and `mobile` wallets.

## 🛠️ Installation 🛠️

The project uses [Yarn](https://yarnpkg.com/). 

1. Make sure that you have `NodeJS v16.14.0` installed.
2. In the root folder run `yarn install`

## 📋 Available Scripts 📋

1. `generate:contractInfo` - this script generates `contants/humanizerInfo.json`.
2. `build` - combines `humanizerInfo.json`, `tokenList.json` and `WALLETInitialClaimableRewards.json` into a single json file (`result.json`) and copies `adexToStakingTransfers.json` and the newly created `result.json` into the `build/` folder.
3. `predeploy` - runs the `build` script. **Only used by github actions.**
4. `deploy` - runs `predeploy` deploys all files inside the `build/` folder using gh-pages. **Only used by github actions.**

## 🚨 Important information 🚨

1. **Contracts** should **NEVER BE DELETED**, only added, even if they are outdated/deprecated. This is due to the fact that even if no new transactions are to be humanized, the old ones should still be humanized.
2. If you make any updates to the humanizers in the web app or the mobile app, you should **UPDATE THE HUMANIZERS IN THE OTHER ONE AS WELL**. Humanizers in the web app are stored internally, while the mobile app uses the ones from `ambire-common`.

## 🆕 Steps to update constants 🆕

1. `tokenList.json` - updated manually. **Don't forget to run `yarn generate:contractInfo && yarn build` after you update it**. This is because humanizerInfo has a property called `tokenList` that depends on `tokenList.json`.
2. `humanizerInfo.json`- in order to update this file you have to make changes in `scripts/generateContractInfo`. To apply your changes to `humanizerInfo.json` run `yarn run generate:contractInfo`.
3. Build your changes by running `yarn run build`. This creates a new file `result.json` in the `build/` folder, copies `adexToStakingTransfers.json` and updates `cache.json`. (The github action will automatically build the changes, but you still have to build locally in order to test them)
4. See the section "Testing the changes".
5. Open a PR with your changes. **This PR should be tested by both the web and mobile app team.**

## 💻 Testing the changes 💻

1. Make sure you have built your changes by running `yarn run build`.
2. Run `yarn dev` to start the development server.
3. Change the `REACT_APP_CONSTANTS_ENDPOINT`'s value to `http://localhost:5000/` in the env file of the web app or the equivalent in the mobile app.
4. Test properly and make sure that everything works as expected.
