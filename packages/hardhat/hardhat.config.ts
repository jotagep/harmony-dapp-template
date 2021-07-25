import 'dotenv/config';
import fs from 'fs';
import fsExtra from 'fs-extra';
import { HardhatUserConfig } from 'hardhat/types';
import { subtask, task, types } from 'hardhat/config';
import { TASK_CLEAN } from 'hardhat/builtin-tasks/task-names';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';

import { fromBech32, toBech32 } from '@harmony-js/crypto';
import { fromWei, isBech32Address, Units, toWei, numberToHex } from '@harmony-js/utils';

let mnemonic = process.env.MNEMONIC;
if (!mnemonic) {
	mnemonic = 'test test test test test test test test test test test junk';
}
const mnemonicAccounts = {
	mnemonic,
};

// This account is added in harmony node localnet as test account
const testLocalnetAccount = {
	address: 'one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q',
	privateKey: '0x144109d9b1182b51233955c112f64a545bb70143539f161e936bb01f8b1e081d',
};

const account: { [name: string]: string | undefined } = {
	Localnet: process.env.LOCALNET_PRIVATE_KEY,
	Testnet: process.env.TESTNET_PRIVATE_KEY,
	Mainnet: process.env.MAINNET_PRIVATE_KEY,
};

// Default output dir to abi contracts in frontend
const outputDir = '../frontend/src/contracts';

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.4',
	},
	defaultNetwork: 'localnet',
	networks: {
		hardhat: {
			accounts: mnemonicAccounts,
		},
		localnet: {
			live: false,
			url: 'http://localhost:9500',
			chainId: 1666700000,
			accounts: account.Localnet ? [account.Localnet] : [testLocalnetAccount.privateKey],
		},
		testnet: {
			url: 'https://api.s0.b.hmny.io',
			chainId: 1666700000,
			accounts: account.Testnet ? [account.Testnet] : mnemonicAccounts,
		},
		mainnet: {
			url: 'https://api.s0.t.hmny.io',
			chainId: 1666600000,
			accounts: account.Mainnet ? [account.Mainnet] : mnemonicAccounts,
		},
	},
	typechain: {
		outDir: 'types',
		target: 'ethers-v5',
	},
	namedAccounts: {
		deployer: {
			default: 0, // here this will by default take the first account as deployer
		},
	},
};

const parseOneAddress = (address: string): string => (isBech32Address(address) ? fromBech32(address) : address);

// Tasks
task('balance', "Prints an account's balance")
	.addPositionalParam('account', "The account's address")
	.setAction(async (taskArgs, { ethers }) => {
		const address = parseOneAddress(taskArgs.account);
		const balance = await ethers.provider.getBalance(address);
		console.log('💵 Balance: ' + fromWei(balance.toString(), Units.one), 'ONE');
	});

task('fund', 'Get 100 ONE into your account')
	.addPositionalParam('address', "Your account's address")
	.addOptionalParam('from', "From account's address", testLocalnetAccount.address)
	.addOptionalParam('amount', 'Amount to send in ONE', 100, types.float)
	.setAction(async (taskArgs, { ethers, network }) => {
		const { address, from, amount } = taskArgs;
		const signer = await ethers.getSigner(parseOneAddress(from));
		console.log('Sending transaction...');
		try {
			const txResponse = await signer.sendTransaction({
				from: parseOneAddress(from),
				to: parseOneAddress(address),
				value: numberToHex(toWei(amount, Units.one)),
				nonce: await signer.getTransactionCount(),
				chainId: network.config.chainId,
			});
			console.log('Funds Done ✅');
			console.log('==================================');
			console.log(`account: ${txResponse.to ? toBech32(txResponse.to) : 'null'}`);
			console.log(`amount: ${fromWei(txResponse.value.toString(), Units.one)} ONE`);
			console.log('==================================');
		} catch (error) {
			console.log('Funds Failed ❌');
			error.reason ? console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`) : console.log(error);
		}
	});

task('send', 'Send ONE to another account')
	.addParam('from', "From account's address")
	.addParam('to', "To account's address")
	.addParam('amount', 'Amount to send in ONE')
	.addOptionalParam('data', 'Data included in transaction')
	.addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
	.addOptionalParam('gasLimit', 'Limit of how much gas to spend')
	.setAction(async (taskArgs, { ethers, network }) => {
		const { from, to, amount, data, gasPrice, gasLimit } = taskArgs;
		const signer = await ethers.getSigner(parseOneAddress(from));
		console.log('Sending transaction...');
		try {
			const txResponse = await signer.sendTransaction({
				from: parseOneAddress(from),
				to: parseOneAddress(to),
				value: numberToHex(toWei(amount, Units.one)),
				nonce: await signer.getTransactionCount(),
				chainId: network.config.chainId,
				...(gasPrice && { gasPrice: numberToHex(toWei(gasPrice, Units.Gwei)) }),
				...(gasLimit && { gasLimit }),
				...(data && { data }),
			});
			console.log('Transaction Done ✅');
			console.log('==================================');
			console.log(`txHash: ${txResponse.hash}`);
			console.log(`from: ${toBech32(txResponse.from)}`);
			console.log(`to: ${txResponse.to ? toBech32(txResponse.to) : 'null'}`);
			console.log(`amount: ${fromWei(txResponse.value.toString(), Units.one)} ONE`);
			txResponse.gasPrice && console.log(`gasPrice: ${fromWei(txResponse.gasPrice.toString(), Units.one)} ONE`);
			console.log('==================================');
		} catch (error) {
			console.log('Transaction Failed ❌');
			error.reason ? console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`) : console.log(error);
		}
	});

task(TASK_CLEAN, 'Clean all artifacts & folder contracts in frontend').setAction(async (taskArgs, hre, runSuper) => {
	await runSuper();
	if (fs.existsSync('./deployments')) {
		fs.rmdirSync('./deployments', { recursive: true });
	}
	await hre.run('clean-front-contracts');
});

subtask('clean-front-contracts', 'Clear frontend contracts folder').setAction(async () => {
	// Clear if exist
	if (fs.existsSync(outputDir)) {
		fsExtra.emptyDirSync(outputDir);
	}
});

export default config;
