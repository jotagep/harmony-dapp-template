import { fromBech32 } from '@harmony-js/crypto';
import { isBech32Address } from '@harmony-js/utils';

export const parseOneAddress = (address: string): string => (isBech32Address(address) ? fromBech32(address) : address);
