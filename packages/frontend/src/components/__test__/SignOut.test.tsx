import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render } from '@testing-library/react';

import { useWeb3React } from '@web3-react/core';
import SignOut, { Props } from '../SignOut';

jest.mock('@web3-react/core');

describe('Test SignOut component', () => {
	const testProps: Props = {
		account: '0xcfffa6ace98eb3464f77af3059389f8f2c18b6e9',
		closeModal: jest.fn(),
	};
	const component = <SignOut {...testProps} />;

	const setup = () => render(component);

	beforeEach(() => {
		(useWeb3React as jest.Mock).mockReturnValue({
			deactivate: jest.fn(),
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

	it('Should call deactivate & close modal when click sign out', () => {
		const { getByText } = setup();

		const signOut = getByText('Sign out');
		fireEvent.click(signOut);

		expect(useWeb3React().deactivate).toHaveBeenCalled();
		expect(testProps.closeModal).toHaveBeenCalled();
	});
});
