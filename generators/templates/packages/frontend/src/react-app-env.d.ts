/// <reference types="react-scripts" />
import 'styled-components';

declare global {
	interface Window {
		ethereum: any;
		harmony: any;
		onewallet: any;
	}
}

window.onewallet = window.onewallet || {};
