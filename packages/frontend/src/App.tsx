import React, { useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';

import Account from './components/Account';
import Balance from './components/Balance';
import { connectorsByName } from './utils/connectors';

const App = () => {
	const [activatingConnector, setActivatingConnector] = useState<AbstractConnector>();
	const context = useWeb3React();
	const { connector, library, chainId, account, activate, deactivate, active, error } = context;

	return (
		<Wrapper>
			<Account />
      <Balance />
			<hr style={{ margin: '2rem' }} />
			<div
				style={{
					display: 'grid',
					gridGap: '1rem',
					gridTemplateColumns: '1fr 1fr',
					maxWidth: '20rem',
					margin: 'auto',
				}}
			>
				{Object.keys(connectorsByName).map(name => {
					const currentConnector = connectorsByName[name];
					const activating = currentConnector === activatingConnector;
					const connected = currentConnector === connector;

					return (
						<button
							style={{
								height: '3rem',
								borderRadius: '1rem',
								borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
								cursor: 'pointer',
								position: 'relative',
							}}
							key={name}
							onClick={() => {
								setActivatingConnector(currentConnector);
								activate(connectorsByName[name]);
							}}
						>
							<div
								style={{
									position: 'absolute',
									top: '0',
									left: '0',
									height: '100%',
									display: 'flex',
									alignItems: 'center',
									color: 'black',
									margin: '0 0 0 1rem',
								}}
							>
								{connected && (
									<span role="img" aria-label="check">
										✅
									</span>
								)}
							</div>
							{name}
						</button>
					);
				})}
			</div>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background-color: #282c34;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	color: white;
`;

export default App;
