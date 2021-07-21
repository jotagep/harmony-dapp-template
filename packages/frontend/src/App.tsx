import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Unit } from '@harmony-js/utils'
import { useWeb3React } from "@web3-react/core";
import Account from './components/Account';
import Balance from './components/Balance';

import Logo from './img/harmony_logo.svg'
import { useHarmony } from './context/harmonyContext';

import Contracts from './contracts/contracts.json';

const App = () => {
  const { account } = useWeb3React();
  const hmy = useHarmony();
  const contractInstance = hmy.contracts.createContract(
    Contracts.contracts.Greeter.abi,
    Contracts.contracts.Greeter.address
  );

  useEffect(() => {
    if (account) {  
      setTimeout(() => {
        (async () => {
          const prueba = await contractInstance.methods.setGreeting('').send({
            from: account,
            gasLimit: '1000001',
            gasPrice: new Unit('10').asGwei().toWei(),
            value: new Unit('1').asOne().toWei()
          });
          console.log(prueba);
        })()
      }, 2000);    
    }
  }, [account])


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
