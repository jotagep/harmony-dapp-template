import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';

import { useHarmony } from '../context/harmonyContext';

const Balance = () => {
	const { account, chainId } = useWeb3React();
	const { balance, fetchBalance, resetBalance } = useHarmony();

	useEffect(() => {
		if (account) {
			fetchBalance(account);
		} else {
			resetBalance();
		}
	}, [account, chainId, fetchBalance]);

	if (!balance) return null;

	return (
		<BalanceComponent>
			<b>{balance}</b> <span>ONE</span>
		</BalanceComponent>
	);
};

const BalanceComponent = styled.div`
	padding: 10px 20px;
	border-radius: 25px;
	background-color: white;
	color: black;

	& > span {
		margin-left: 4px;
	}
`;

export default Balance;
