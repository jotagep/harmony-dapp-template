/// <reference types="react-scripts" />
import 'styled-components';

declare global {
    interface Window { onewallet: any; }
}

window.onewallet = window.onewallet || {};