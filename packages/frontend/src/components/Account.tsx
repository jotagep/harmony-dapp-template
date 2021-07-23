import React, { useState } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

import { useWeb3React } from "@web3-react/core";
import { toBech32 } from '@harmony-js/crypto';
import { isHmyLibrary } from '../helpers/harmonyHelpers';

import SignOut from './SignOut';
import Wallets from './Wallets';
import { useHarmony } from '../context/harmonyContext';

Modal.setAppElement('#root');

const Account = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { account, library, active } = useWeb3React();
  const { fetchBalance } = useHarmony();

  const isHmy = isHmyLibrary(library);
  const parsedAccount = (isHmy && account) ? toBech32(account) : account;

  const openModal = async () => {
    if (account) {
      await fetchBalance(account)
    }
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  return (
    <>
      <AccountComponent onClick={openModal}>
        {parsedAccount ? 
          (
            <span>
              {parsedAccount.substring(0, 6)}...{parsedAccount.substring(parsedAccount.length - 4)}
            </span>
          )
        : 
          (
            <span>
              Connect your wallet
            </span>
          )
        }
      </AccountComponent>
      <Modal
        isOpen={modalIsOpen}
        className="Modal"
        overlayClassName="Overlay"
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick
      >
        {active ? 
          <SignOut 
            account={parsedAccount}
            closeModal={closeModal}
          />
          : 
          <Wallets closeModal={closeModal} />
        }
      </Modal>
    </>
  )
}

const AccountComponent = styled.div`
	padding: 10px 20px;
	border-radius: 25px;
	background-color: white;
  opacity: 0.7;
  box-shadow: 1px 2px 4px 4px rgba(0,0,0, 0.25);
	color: black;
  margin-left: 10px;
  transition: opacity .3s ease, box-shadow .25s ease-in-out;

	&:hover {
    opacity: 1;
    box-shadow: 1px 2px 2px 2px rgba(0,0,0, 0.2);
    cursor: pointer;
	}
`;

export default Account;