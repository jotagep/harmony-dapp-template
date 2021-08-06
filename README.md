# Generator Harmony Dapp 🚀

[![Version](https://badge.fury.io/js/generator-harmony-dapp.svg)](https://npmjs.org/package/generator-harmony-dapp)

Generate your Harmony dapp project in a few seconds with just a command.

## Prerequisites
* [Docker 20.10+](https://docs.docker.com/engine/)
* [Node 12+](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/)
* [Harmony One Wallet Extension](https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib)
* [Math Wallet Extension](https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc)
* [Metamask wallet](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) - *Learn [how to configure](https://docs.harmony.one/home/network/wallets/browser-extensions-wallets/metamask-wallet) to use harmony network*
> NOTE: Tested on Ubuntu 20.04.2 LTS

## How to use it?

**You can check our new tutorial** ***NEW** -> [Youtube](https://youtu.be/ys7dtz1YvpM)

We just need two simple steps.

> Install Yeoman globally and our generator **generator-harmony-dapp**

```bash
npm install -g yo
npm install -g generator-harmony-dapp
```

> Create your folder project and use the generator inside

```bash
mkdir harmony-project
cd harmony-project
yo harmony-dapp
```

![generator](https://user-images.githubusercontent.com/8777166/128394173-8c28f717-8d6d-495f-85ca-8054bac5918f.png)

### That's all 🎉

Once our project is generated, you can start to create your dapp.

```bash
#Quick start
yarn autoinit
```

Check [full documentation](https://github.com/jotagep/harmony-dapp-template) to know how to use in depth

## Options CLI

Harmony-dapp generator has a cli options that helps you to configure your project:

 - **Project title** : Introduce your project title
 - **Author**: Author of new project
 - **Testnet Key** *(optional)*: Add your testnet account's private key if you want to deploy to testnet.
 - **Mainnet Key** *(optional)*: Add your mainnet account's private key if you want to deploy to mainnet.

This generator is built in [Yeoman](https://yeoman.io/) 👌