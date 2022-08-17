# Ambire constants

## About

This repository contains the static files, shared between `ambire-common` and the `web` and `mobile` wallets.

## Installation

The project uses [Yarn](https://yarnpkg.com/). 

1. Make sure that you have `NodeJS v16.14.0` installed.
2. In the root folder run `yarn install`

## Available Scripts

1. `generate:contractInfo` - this script generates `contants/humanizerInfo.json`.
2. `build` - combines `humanizerInfo.json`, `tokenList.json` and `WALLETInitialClaimableRewards.json` into a single json file and copies `adexToStakingTransfers.json` into gh-pages
3. `predeploy` - runs `generate:contractInfo` and `build`
4. `deploy` - deploys the json files using gh-pages

