import { OneWalletConnector } from '@harmony-react/onewallet-connector';
import { MathWalletConnector } from '@harmony-react/mathwallet-connector';
import { InjectedConnector } from '@web3-react/injected-connector';

import { AbstractConnector } from '@web3-react/abstract-connector';

export enum ConnectorNames {
	OneWallet = 'OneWallet',
	Mathwallet = 'MathWallet',
	Metamask = 'Metamask',
}

const onewallet = new OneWalletConnector({ chainId: 2 }); // Mainnet -> chainId: 1 // Testnet & Localnet -> chainId 2
const mathwallet = new MathWalletConnector({ chainId: 2 }); // Mainnet -> chainId: 1 // Testnet & Localnet -> chainId 2
export const injected = new InjectedConnector({ supportedChainIds: [1666600000, 1666700000] });

export const connectorsByName: { [connectorName: string]: AbstractConnector } = {
	[ConnectorNames.OneWallet]: onewallet,
	[ConnectorNames.Mathwallet]: mathwallet,
	[ConnectorNames.Metamask]: injected,
};
