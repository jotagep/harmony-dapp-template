import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';

import { connectorsByName } from '../utils/connectors';
import { mapWallets } from '../helpers/walletHelpers';

export interface Props {
	closeModal: () => void;
}

const Wallets = ({ closeModal }: Props) => {
	const { activate } = useWeb3React();

	const handleClick = (connector: AbstractConnector) => () => {
		activate(connector);
		closeModal();
	};

	return (
		<WalletsComponent>
			{Object.keys(connectorsByName).map(name => (
				<WalletItem key={name} onClick={handleClick(connectorsByName[name])}>
					<WalletImg src={mapWallets[name].image} />
					{mapWallets[name].name}
				</WalletItem>
			))}
		</WalletsComponent>
	);
};

const WalletImg = styled.img`
	width: 42px;
	height: 42px;
	margin-bottom: 1rem;
`;

const WalletsComponent = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	overflow: hidden;
`;

const WalletItem = styled.div`
	width: 100%;
	min-height: 140px;
	padding: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	cursor: pointer;
	font-size: 1.55rem;
	border-radius: 0px;
	border: 1px solid rgba(195, 195, 195, 0.14);
`;

export default Wallets;
