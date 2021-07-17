import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "hardhat-watcher";

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

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.4',
	},
	defaultNetwork: 'localnet',
	networks: {
		localnet: {
			url: 'http://localhost:9500',
			chainId: 1666700000,
			accounts: accounts.Localnet,
		},
		testnet: {
			url: 'https://api.s0.b.hmny.io',
			chainId: 1666700000,
			accounts: mnemonicAccounts,
		},
		mainnet: {
			url: 'https://api.s0.t.hmny.io',
			chainId: 1666600000,
			accounts: mnemonicAccounts,
		},
	},
	typechain: {
		outDir: 'types',
		target: 'ethers-v5',
	},
	watcher: {
		compilation: {
			tasks: ["compile"],
		}
	},
};

export default config;
