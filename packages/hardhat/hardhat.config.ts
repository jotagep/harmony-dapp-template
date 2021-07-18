import 'dotenv/config';
import { HardhatUserConfig } from 'hardhat/types';
import { task } from "hardhat/config";
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import "hardhat-watcher";

import { fromBech32, toBech32 } from '@harmony-js/crypto';
import { fromWei, isBech32Address, Units, toWei, numberToHex } from '@harmony-js/utils';

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

// Tasks
const parseOneAddress = (address: string): string =>
	isBech32Address(address) ? fromBech32(address) : address

task("balance", "Prints an account's balance")
	.addPositionalParam("account", "The account's address")
	.setAction(async (taskArgs, { ethers }) => {
		const address = parseOneAddress(taskArgs.account);
		const balance = await ethers.provider.getBalance(address)
		console.log('💵 Balance: ' + fromWei(balance.toString(), Units.one), 'ONE')
	});

task("send", "Send ONE to another account")
	.addParam("from", "From account's address")
	.addParam("to", "To account's address")
	.addParam("amount", "Amount to send in ONE")
	.addOptionalParam("data", "Data included in transaction")
	.addOptionalParam("gasPrice", "Price you are willing to pay in gwei")
	.addOptionalParam("gasLimit", "Limit of how much gas to spend")
	.setAction(async (taskArgs, { ethers, network }) => {
		const { from, to, amount, data, gasPrice, gasLimit } = taskArgs;
		const signer = await ethers.getSigner(parseOneAddress(from));
		console.log('Sending transaction...')
		try {
			const txResponse = await signer.sendTransaction({
				from: parseOneAddress(from),
				to: parseOneAddress(to),
				value: numberToHex(toWei(amount, Units.one)),
				nonce: await signer.getTransactionCount(),
				chainId: network.config.chainId,
				...gasPrice && { gasPrice: numberToHex(toWei(gasPrice, Units.Gwei))  },
				...gasLimit && { gasLimit },
				...data && { data }
			});
			console.log('Transaction Done ✅')
			console.log('==================================');
			console.log(`txHash: ${txResponse.hash}`);
			console.log(`from: ${toBech32(txResponse.from)}`);
			console.log(`to: ${txResponse.to ? toBech32(txResponse.to): 'null'}`);
			console.log(`amount: ${fromWei(txResponse.value.toString(), Units.one)} ONE`);
			txResponse.gasPrice && console.log(`gasPrice: ${fromWei(txResponse.gasPrice.toString(), Units.one)} ONE`);
			console.log('==================================');
		} catch (error) {
			console.log('Transaction Failed ❌')
			console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`)
		}

	});

export default config;
