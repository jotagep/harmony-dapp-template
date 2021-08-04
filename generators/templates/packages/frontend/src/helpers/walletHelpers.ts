import { ConnectorNames } from '../utils/connectors';

import MathWallet from '../img/wallets/math.png';
import OneWallet from '../img/wallets/one.svg';
import Metamask from '../img/wallets/metamask.svg';

interface WalletUI {
	name: string;
	image: string;
}

export const mapWallets: { [waletName: string]: WalletUI } = {
	[ConnectorNames.OneWallet]: {
		name: 'One wallet',
		image: OneWallet,
	},
	[ConnectorNames.Mathwallet]: {
		name: 'Math wallet',
		image: MathWallet,
	},
	[ConnectorNames.Metamask]: {
		name: 'Metamask',
		image: Metamask,
	},
};
