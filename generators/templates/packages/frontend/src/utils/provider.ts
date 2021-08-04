import { Web3Provider } from '@ethersproject/providers';
import { ChainID, ChainType } from '@harmony-js/utils';
import { Harmony } from '@harmony-js/core';

type Library = Web3Provider | Harmony;

const envProvider: string = process.env.REACT_APP_FRONTEND_NETWORK || 'localnet';

const configProviders: { [name: string]: any } = {
	localnet: {
		chainId: ChainID.HmyLocal,
		chainType: ChainType.Harmony,
		url: 'http://localhost:9500',
		networkId: '1666700000',
	},
	testnet: {
		chainId: ChainID.HmyTestnet,
		chainType: ChainType.Harmony,
		url: 'https://api.s0.b.hmny.io',
		networkId: '1666700000',
	},
	mainnet: {
		chainId: ChainID.HmyMainnet,
		chainType: ChainType.Harmony,
		url: 'https://api.s0.t.hmny.io',
		networkId: '1666600000',
	},
};

export const getProvider = () => configProviders[envProvider];

export const getLibraryProvider = (provider: any): Library => {
	let library: Web3Provider | Harmony;

	if (provider?.chainType === 'hmy') {
		provider.setProvider(getProvider().url);
		library = provider.blockchain;
	} else {
		library = new Web3Provider(provider);
		library.pollingInterval = 12000;
	}

	return library;
};
