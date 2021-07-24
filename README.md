![header](https://user-images.githubusercontent.com/8777166/126854579-2f3d6973-b3c7-45da-add4-1362ad9a68ae.jpg)

![example workflow](https://github.com/jotagep/harmony-dapp-template/actions/workflows/unit-tests.yaml/badge.svg)
# 🧰 Harmony Dapp Template

> All-in-one forkable dev stack to build your dapp in Harmony 🚀

🧪 Play with contracts and frontend to see how Harmony One works:

![image](https://user-images.githubusercontent.com/8777166/126853046-376352db-627b-48c5-b569-30836ca410c7.png)

## 🚴 Quick Start

## Prerequisites
* [Docker 20.10+](https://docs.docker.com/engine/)
* [Node 12+](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/)
* [Harmony One Wallet Extension](https://chrome.google.com/webstore/detail/harmony-one-wallet/fnnegphlobjdpkhecapkijjdkgcjhkib)
* [Math Wallet Extension](https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc)
> NOTE: Tested on Ubuntu 20.04.2 LTS

> Clone/fork 🧰 Harmony Dapp Template:

```bash
git clone https://github.com/jotagep/harmony-dapp-template
```

> Install dependencies and build & start your ⛓️ Harmony Localnet Node:

```bash
cd harmony-dapp-template
yarn install
yarn localnet:build
yarn localnet:start
```
> Open a second terminal window, 🛰 deploy your contract:

```bash
cd harmony-dapp-template
yarn deploy
```

or if you want to have **Hot reloading** to deploy your contracts on live:

```bash
cd harmony-dapp-template
yarn deploy:watch
```

> Open a third terminal window, start your 📱 frontend:

```bash
cd harmony-dapp-template
yarn start
```

🔏 Edit your smart contract `Money.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/frontend/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app


### Start to play with your dapp 🥳 !!

> To get **100 ONEs** in your wallet on localnet

```bash
cd harmony-dapp-template
yarn fund 'YOUR_WALLET_ADDRESS'
```

Now you have all you need to interact with example dapp, but that's not all. 
We decide to add more tasks to Hardhat to simplify your life.

```bash
cd harmony-dapp-template
yarn hardhat [GLOBAL_OPTION] [AVALIABLE_TASK]
# Example: yarn hardhat clean
```
![screenshot](https://user-images.githubusercontent.com/8777166/126854082-b4a04bae-c67d-4fb9-9ff4-425186e8cc8c.png)

To see this info in your terminal: 

```bash
yarn hardhat --help
```

### passenger_ship Ship it!
Once you have your project done, you can deployed to live

```bash
cd harmony-dapp-template
yarn surge
# By default your frontend is build on localnet network
# You can deploy testnet or mainnet
# Example: yarn surge:tesnet
```

# 📚 Extra Documentation

* Learn how to use [Hardhat Framework](https://hardhat.org/tutorial/) 
* Learn **Solidity**:
    - In depth [Documentation](https://docs.soliditylang.org)
    - By doing a interactive game [CryptoZombies](https://cryptozombies.io/en/course/)
* Learn [React](https://es.reactjs.org/docs/getting-started.html) to develop your frontend
* Learn [Harmony One](https://docs.harmony.one/home/developers/getting-started) to get complete knowledge about the blockchain and how interact with contracts and wallets.

---
## Checklist for [Gitcoin Bountie](https://gitcoin.co/issue/harmony-one/bounties/53/100026000)

- [x] UI/UX React boilerplate code for DApp
  - [x] Simple UI with Home Page
  - Connection to as many popular wallets as possible
    - [x] OneWallet
    - [x] Mathwallet
  - [x] Simple interaction with demo contract
  - [x] Tests for UI/UX application
- Smart contract:
  - [x] Something simple but more than Hello World so that it can interact with UX/UI
  - [x] Tests
- Development environment (CLI):
  - [x] CLI command to create sandbox env for both contract (Ganache) and UX/UI (React) so that it can run on localhost.
  - [x] CLI command to deploy contract to testnet/mainnet.
  - [x] CLI command to run tests for both contract and UX/UI.
- README:
  - [x] Installation guide (any dependencies etc.)
  - [x] Basic usage on how to run and interact with template.
  - [x] Document CLI.
  - [x] Provide extra resources and "kickstart" documentation links for developers.
  - [x] Document how to deploy React application (simplified).
- Nice-to-have
  - [ ] Would be nice to use tool like cookiecutter to make template customizable with Author, App Name, Software Versions, Tags, Logos and other things that might be non-static.
  - [x] Include CI workflow (probably easiest to use git workflow) to run test on push.

## ⏱️ Coming soon...

* Template generator using Yeoman
* Demo Video explanation on how to use the monorepo

---

🙏 Inspired by [scaffold-eth](https://github.com/austintgriffith/scaffold-eth) - [Austin Griffith](https://austingriffith.com/) genius 🧞 