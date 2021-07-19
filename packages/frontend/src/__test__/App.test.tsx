import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import App from '../App';

describe('Test App component', () => {
	const component = <App />;

	const setup = () => render(component);

	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(<App />, div);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('Should match snapshot', () => {
		const { container } = setup();
		expect(container).toMatchSnapshot();
	});
});
