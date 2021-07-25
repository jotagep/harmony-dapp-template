import React, { createContext, useContext, useState, useCallback } from 'react';
import { Harmony } from '@harmony-js/core';
import { toBech32 } from '@harmony-js/crypto';
import { isBech32Address, fromWei, hexToNumber, Units } from '@harmony-js/utils';

import { getProvider } from '../utils/provider';

type HarmonyProviderProps = { children: React.ReactNode };

interface HamonyProviderContext {
	hmy: Harmony;
	balance: string | undefined;
	fetchBalance: (account: string) => Promise<void>;
	resetBalance: () => void;
}

const provider = getProvider();
const hmy = new Harmony(provider.url, { chainId: provider.chainId, chainType: provider.chainType });

const HarmonyContext = createContext<HamonyProviderContext | undefined>(undefined);

export const HarmonyProvider = ({ children }: HarmonyProviderProps) => {
	const contextBalance = useBalance();

	const value: HamonyProviderContext = {
		hmy,
		...contextBalance,
	};

	return <HarmonyContext.Provider value={value}>{children}</HarmonyContext.Provider>;
};

const useBalance = () => {
	const [balance, setBalance] = useState<string>();

	const fetchBalance = useCallback(
		async (account: string) => {
			const address = isBech32Address(account) ? account : toBech32(account);
			const balance = await hmy.blockchain.getBalance({ address });
			const parsedBalance = fromWei(hexToNumber(balance.result), Units.one);
			setBalance(parsedBalance);
		},
		[hmy, setBalance],
	);

	const resetBalance = () => {
		setBalance(undefined);
	};

	return {
		balance,
		fetchBalance,
		resetBalance,
	};
};

export const useHarmony = () => {
	const context = useContext(HarmonyContext);
	if (!context) {
		throw 'No Harmony provider';
	}
	return context;
};
