import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { toBech32 } from '@harmony-js/crypto';
import { formatEther } from '@ethersproject/units'

import { isHmyLibrary } from '../helpers/provider';

const Balance = () => {
	const { account, library, chainId } = useWeb3React();
	const isHmy = isHmyLibrary(library);

	const [balance, setBalance] = useState<string | null>(null);
	useEffect(() => {
		if (!!account && !!library) {
			let stale = false;
			const accountArgs = isHmy ? { address: toBech32(account) } : account;

			library
				.getBalance(accountArgs)
				.then((balance: any) => {
					if (isHmy) {
						balance = balance.result;
					}
					if (!stale) {
						setBalance(balance);
					}
				})
				.catch(() => {
					if (!stale) {
						setBalance(null);
					}
				});

			return () => {
				stale = true;
				setBalance(null);
			};
		}
	}, [account, library, chainId]);

    console.log(balance)

	return (
		<>
			<span>Balance</span>
			<span role="img" aria-label="gold">
				💰
			</span>
			<span>
				{balance === null ? 'Error' : balance ? (isHmy ? formatEther(balance) : `Ξ${formatEther(balance)}`) : ''}
			</span>
            <span>
                ONE
            </span>
		</>
	);
};

export default Balance;
