# Ambire constants

## 📕 About 📕

This repository contains the static files, shared between `ambire-common` and the `web` and `mobile` wallets.

## 🛠️ Installation 🛠️

The project uses [Yarn](https://yarnpkg.com/). 

1. Make sure that you have `NodeJS v16.14.0` installed.
2. In the root folder run `yarn install`

## 📋 Available Scripts 📋

1. `generate:contractInfo` - this script generates `contants/humanizerInfo.json`.
2. `build` - combines `humanizerInfo.json`, `tokenList.json` and `WALLETInitialClaimableRewards.json` into a single json file and copies `adexToStakingTransfers.json` and the newly created `result.json` into the `build/` folder.
3. `predeploy` - runs the `build` script.
4. `deploy` - runs `predeploy` deploys all files inside the `build/` folder using gh-pages

## 🆕 Steps to update constants 🆕

1. `tokenList.json` and `WALLETInitialClaimableRewards.json` - these files must be updated manually
2. `humanizerInfo.json`- this file can both be updated manually and generated using the `yarn run generate:contractInfo` command.
3. Commit the changes
4. For now push directly to the `main` branch

## 🚨 Possible errors 🚨

Incase you see this error, don't worry. Just rerun the github action after a few minutes.

```
{ status: '0', message: 'NOTOK', result: 'Max rate limit reached' }
```
