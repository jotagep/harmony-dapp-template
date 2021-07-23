import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import styled from 'styled-components';
import { Unit } from '@harmony-js/utils'
import { useWeb3React } from "@web3-react/core";
import Account from './components/Account';
import Balance from './components/Balance';

import { HarmonyAbstractConnector } from '@harmony-react/abstract-connector';

import Logo from './img/harmony_logo.svg'
import { useHarmony } from './context/harmonyContext';

import Contracts from './contracts/contracts.json';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { account, connector } = useWeb3React();
  const { hmy, fetchBalance } = useHarmony();
  const contractInstance = hmy.contracts.createContract(
    Contracts.contracts.Money.abi,
    Contracts.contracts.Money.address
  );

  useEffect(() => {
    if (account && connector) {  
      setTimeout(() => {
        (async () => {
          const contrato = await (connector as HarmonyAbstractConnector).attachToContract(contractInstance);
          try {            
            const prueba = await contrato.methods.addMoney().send({
              from: account,
              gasPrice: 1000000000,
              gasLimit: 210000,
              value: new Unit('10').asOne().toWei()
            });
            toast.success('Transaction done', {
              onClose: async () => {
                await fetchBalance(account)
                const dato = await contrato.methods.getMoneyStored().call();
                console.log(new Unit(dato).toOne());
              }
            })
          } catch (error) {
            toast.error(error);
          }
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
      <ToastContainer 
        position="bottom-right"
        newestOnTop={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        rtl={false}
      />
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
