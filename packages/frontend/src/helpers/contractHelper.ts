import { Harmony, HarmonyExtension } from '@harmony-js/core';
import { Contract } from '@harmony-js/contract';
import Contracts from '../contracts/contracts.json';

export const createMoneyContract = (hmy: Harmony | HarmonyExtension): Contract => {
	return hmy.contracts.createContract(Contracts.contracts.Money.abi, Contracts.contracts.Money.address);
};
