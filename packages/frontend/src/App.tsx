import React, { useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';

import Account from './components/Account';
import Balance from './components/Balance';
import { connectorsByName } from './utils/connectors';

import Logo from './img/harmony_logo.svg'

const App = () => {
	const [activatingConnector, setActivatingConnector] = useState<AbstractConnector>();
	const context = useWeb3React();
	const { connector, activate } = context;

	return (
		<Wrapper>
      <Container>
        <Topbar>
          <img src={Logo} alt="Harmony logo" />
          <Flex>
            <Balance />
            <Account />
          </Flex>
        </Topbar>
        <Content>
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
        </Content>
      </Container>
		</Wrapper>
	);
};

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 74px;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
  padding: 0px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Wrapper = styled.div`
	background-color: #0093E9;
  background-image: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
	font-size: 1rem;
	color: white;
`;

export default App;
