import { Harmony, HarmonyExtension } from '@harmony-js/core';
import { Contract } from '@harmony-js/contract';
import Contracts from '../contracts/contracts.json';

export const createDonationContract = (hmy: Harmony | HarmonyExtension): Contract => {
	return hmy.contracts.createContract(Contracts.contracts.Donation.abi, Contracts.contracts.Donation.address);
};
