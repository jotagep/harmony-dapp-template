import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import { useWeb3React } from '@web3-react/core';
import Account from '../Account';

jest.mock('@web3-react/core');

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
		ReactDOM.render(component, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Should match snapshot', () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});
});
