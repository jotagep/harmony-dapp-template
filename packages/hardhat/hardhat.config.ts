import 'dotenv/config';
import { HardhatUserConfig} from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-typechain';
import 'solidity-coverage';

let mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
  mnemonic = 'test test test test test test test test test test test junk';
}
const mnemonicAccounts = {
  mnemonic,
};

const accounts = {
  Localnet: [String(process.env.LOCALNET_PRIVATE_KEY)],
  Testnet: [String(process.env.TESTNET_PRIVATE_KEY)],
  Mainnet: [String(process.env.MAINNET_PRIVATE_KEY)],
};

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    coverage: {
      url: 'http://localhost:5458',
      accounts: mnemonicAccounts,
    },
    hardhat: {
      accounts: mnemonicAccounts,
    },
    localhost: {
      url: 'http://localhost:8545',
      accounts: mnemonicAccounts,
    },
    localnet: {
      url: 'http://localhost:9500',
      chainId: 1666700000,
      accounts: accounts.Localnet,
    },
    testnet: {
      url: 'https://api.s0.b.hmny.io',
      chainId: 1666700000,
      accounts: accounts.Testnet,
    },
    mainnet: {
      url: 'https://api.s0.t.hmny.io',
      chainId: 1666600000,
      accounts: accounts.Mainnet,
    },
  },
  paths: {
    sources: 'src',
  },
  external: {
    contracts: [],
    deployments: {},
  },
};

export default config;