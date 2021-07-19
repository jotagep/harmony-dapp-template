import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { HardhatUserConfig } from 'hardhat/types';
import { subtask, task, types } from "hardhat/config";
import { TASK_COMPILE,TASK_CLEAN } from 'hardhat/builtin-tasks/task-names'
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

// This account is added in harmony node localnet as test account
const testLocalnetAccount = {
	address: 'one1v92y4v2x4q27vzydf8zq62zu9g0jl6z0lx2c8q',
	privateKey: '0x144109d9b1182b51233955c112f64a545bb70143539f161e936bb01f8b1e081d'
}

const account: {[name: string] : string | undefined } = {
	Localnet: process.env.LOCALNET_PRIVATE_KEY,
	Testnet: process.env.TESTNET_PRIVATE_KEY,
	Mainnet: process.env.MAINNET_PRIVATE_KEY,
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
	watcher: {
		compilation: {
			tasks: [TASK_COMPILE],
		}
	},
};

const parseOneAddress = (address: string): string =>
	isBech32Address(address) ? fromBech32(address) : address;

// Tasks
task("balance", "Prints an account's balance")
	.addPositionalParam("account", "The account's address")
	.setAction(async (taskArgs, { ethers }) => {
		const address = parseOneAddress(taskArgs.account);
		const balance = await ethers.provider.getBalance(address)
		console.log('💵 Balance: ' + fromWei(balance.toString(), Units.one), 'ONE')
	});

task("fund", "Get 100 ONE into your account")
	.addPositionalParam("address", "Your account's address")
	.addOptionalParam("from", "From account's address", testLocalnetAccount.address)
	.addOptionalParam("amount", "Amount to send in ONE", 100, types.float)
	.setAction(async (taskArgs, { ethers, network }) => {
		const { 
			address,
			from,
			amount
		} = taskArgs;
		const signer = await ethers.getSigner(parseOneAddress(from));
		console.log('Sending transaction...')
		try {
			const txResponse = await signer.sendTransaction({
				from: parseOneAddress(from),
				to: parseOneAddress(address),
				value: numberToHex(toWei(amount, Units.one)),
				nonce: await signer.getTransactionCount(),
				chainId: network.config.chainId,
			});
			console.log('Funds Done ✅')
			console.log('==================================');
			console.log(`account: ${txResponse.to ? toBech32(txResponse.to): 'null'}`);
			console.log(`amount: ${fromWei(txResponse.value.toString(), Units.one)} ONE`);
			console.log('==================================');
		} catch (error) {	
			console.log('Funds Failed ❌')
			error.reason ? console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`) : console.log(error);
		}

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
			error.reason ? console.error(`ERROR: ${error.reason} // ${error.code} -> ${error.value}`) : console.log(error);
		}

	});

	task(TASK_COMPILE, "Compile contracts")
		.setAction(async (taskArgs, hre, runSuper) => {
			await runSuper();
			await hre.run("copy-artifacts");
		});

	task(TASK_CLEAN, "Clean contracts & abi folder in frontend")
		.setAction(async (taskArgs, hre, runSuper) => {
			await runSuper();
			await hre.run("clean-front-abi");
		});

	// Default output dir to abi contracts in frontend
	const outputDir = '../frontend/src/abi';

	subtask("copy-artifacts", "Move abi to frontend")
		.setAction(async (taskArgs, { artifacts }) => {
			
			// Clear if exist
			if (fs.existsSync(outputDir)) {
				fs.rmdirSync(outputDir, { recursive: true });
			}

			// Create dir if not exist
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}
			
			for (const fullName of await artifacts.getAllFullyQualifiedNames()) {
			
				const { abi, contractName } = await artifacts.readArtifact(fullName);
			
				if (!abi.length) continue;
			
				const destination = path.resolve(
				  outputDir,
				  contractName
				) + '.json';
			
				if (!fs.existsSync(path.dirname(destination))) {
				  fs.mkdirSync(path.dirname(destination), { recursive: true });
				}
			
				fs.writeFileSync(destination, `${ JSON.stringify(abi, null, 2) }\n`, { flag: 'w' });
			  }
		});

	subtask("clean-front-abi", "Clear frontend abi folder")
		.setAction(async () => {
			// Clear if exist
			if (fs.existsSync(outputDir)) {
				fs.rmdirSync(outputDir, { recursive: true });
			}
		});


export default config;
