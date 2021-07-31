import { Harmony, HarmonyExtension } from '@harmony-js/core';
import { HarmonyAbstractConnector } from '@harmony-react/abstract-connector';
import { Contract as HarmonyContract } from '@harmony-js/contract';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { getExtension } from '../helpers/harmonyHelpers';
import Web3 from 'web3';
import Contracts from '../contracts/contracts.json';

export const createDonationContract = (hmy: Harmony | HarmonyExtension): HarmonyContract => {
	return hmy.contracts.createContract(Contracts.contracts.Donation.abi, Contracts.contracts.Donation.address);
};

export const getDonationContractFromConnector = async (
	connector: AbstractConnector,
	web3Provider: any,
): Promise<any> => {
	const harmonyConnector = connector as HarmonyAbstractConnector;
	if (harmonyConnector.windowKey) {
		const extensionWallet: any = window[harmonyConnector.windowKey];
		const hmyExtension = getExtension(extensionWallet);
		return new Promise(resolve => resolve(createDonationContract(hmyExtension)));
	}
	// Connector is injected connector
	await web3Provider.provider.request({ method: 'eth_requestAccounts' });
	const web3 = new Web3(web3Provider.provider);
	const web3Contract = new web3.eth.Contract(
		Contracts.contracts.Donation.abi as any,
		Contracts.contracts.Donation.address,
	);
	return web3Contract;
};
