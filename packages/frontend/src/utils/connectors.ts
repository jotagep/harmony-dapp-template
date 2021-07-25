import { OneWalletConnector } from '@harmony-react/onewallet-connector';
import { MathWalletConnector } from '@harmony-react/mathwallet-connector';

import { AbstractConnector } from '@web3-react/abstract-connector';

enum ConnectorNames {
	OneWallet = 'OneWallet',
	Mathwallet = 'MathWallet',
}
export const onewallet = new OneWalletConnector({ chainId: 2 }); // Mainnet -> chainId: 1 // Testnet & Localnet -> chainId 2

export const mathwallet = new MathWalletConnector({ chainId: 2 }); // Mainnet -> chainId: 1 // Testnet & Localnet -> chainId 2

export const connectorsByName: { [connectorName: string]: AbstractConnector } = {
	[ConnectorNames.OneWallet]: onewallet,
	[ConnectorNames.Mathwallet]: mathwallet,
};
