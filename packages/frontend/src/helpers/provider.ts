import { Web3Provider } from '@ethersproject/providers';
import {ChainID, ChainType } from "@harmony-js/utils";
import { Harmony } from '@harmony-js/core';

type Library = Web3Provider | Harmony;

const envProvider: string = process.env.FRONTEND_PROVIDER || 'localnet';

const configProviders: {[name:string]: any} = {
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
    Chain_Type: ChainType.Harmony,
    url: 'https://api.s0.t.hmny.io',
    networkId: '1666600000',
  }
}

export const getLibraryProvider = (provider: any): Library => {
	let library: Web3Provider | Harmony;

	if (provider?.chainType === 'hmy') {
    provider.setProvider(configProviders[envProvider].url)
		library = provider.blockchain;
	} else {
		library = new Web3Provider(provider);
		library.pollingInterval = 12000;
	}

	return library;
};

export const isHmyLibrary = (library: any): boolean => library?.messenger?.chainType === 'hmy';  