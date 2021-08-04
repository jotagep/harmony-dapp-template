import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render } from '@testing-library/react';

import { useWeb3React } from '@web3-react/core';
import Wallets, { Props } from '../Wallets';

import { connectorsByName } from '../../utils/connectors';
import { mapWallets } from '../../helpers/walletHelpers';

jest.mock('@web3-react/core');

describe('Test Wallets component', () => {
	const testProps: Props = {
		closeModal: jest.fn(),
	};
	const component = <Wallets {...testProps} />;

	const setup = () => render(component);

	beforeEach(() => {
		(useWeb3React as jest.Mock).mockReturnValue({
			activate: jest.fn(),
		});
	});

	afterEach(jest.clearAllMocks);

	it('Should render component without crash', () => {
		const div = document.createElement('div');
		ReactDOM.render(component, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Should match snapshot', () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});

	it('Should call activate this wallet & close modal when click a wallet', () => {
		const walletName = 'OneWallet';
		const { getByText } = setup();

		const oneWallet = getByText(mapWallets[walletName].name);
		fireEvent.click(oneWallet);

		expect(useWeb3React().activate).toHaveBeenCalledWith(connectorsByName[walletName]);
		expect(testProps.closeModal).toHaveBeenCalled();
	});
});
