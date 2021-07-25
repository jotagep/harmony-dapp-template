import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import { useWeb3React } from '@web3-react/core';
import Account from '../Account';

import { mockComponent } from '../../helpers/testHelper';

jest.mock('@web3-react/core');

jest.mock('../SignOut', () => (props: any) => mockComponent('Wallets', props));
jest.mock('../Wallets', () => (props: any) => mockComponent('Wallets', props));

describe('Test Account component', () => {
	const component = <Account />;

	const setup = () => render(component);

	beforeEach(() => {
		(useWeb3React as jest.Mock).mockReturnValue({
			account: '0xcfffa6ace98eb3464f77af3059389f8f2c18b6e9',
			library: {
				messenger: {
					chainType: 'hmy',
				},
			},
		});
	});

	afterEach(jest.clearAllMocks);

	it('Should render component without crash', () => {
		const div = document.createElement('div');
		div.id = 'root';
		ReactDOM.render(component, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Should match snapshot', () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});
});
