import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import { useWeb3React } from '@web3-react/core';
import { useHarmony } from '../../context/harmonyContext';

import Balance from '../Balance';

jest.mock('@web3-react/core');

jest.mock('../../context/harmonyContext');

describe('Test Balance component', () => {
	const component = <Balance />;

	const setup = () => render(component);

	beforeEach(() => {
		(useWeb3React as jest.Mock).mockReturnValue({
			account: '0xcfffa6ace98eb3464f77af3059389f8f2c18b6e9',
			chainId: '2',
		});
		(useHarmony as jest.Mock).mockReturnValue({
			balance: '0',
			fetchBalance: jest.fn(),
			resetBalance: jest.fn(),
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

	it('Should call fetch balance if we have an account', () => {
		setup();
		expect(useHarmony().fetchBalance).toHaveBeenCalled();
	});

	it('Should call reset balance if we dont have an account', () => {
		(useWeb3React as jest.Mock).mockReturnValue({
			account: null,
			chainId: '2',
		});
		setup();
		expect(useHarmony().resetBalance).toHaveBeenCalled();
	});
});
