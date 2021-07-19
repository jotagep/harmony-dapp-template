import React from 'react'
import styled from 'styled-components';
import { useWeb3React } from "@web3-react/core";
import { toBech32 } from '@harmony-js/crypto';
import { isHmyLibrary } from '../helpers/provider';

const Account = () => {
  const { account, library } = useWeb3React()
  const isHmy = isHmyLibrary(library);
  const parsedAccount = (isHmy && account) ? toBech32(account) : account

  return (
    <AccountComponent>
      <span>
        {parsedAccount === null
          ? '-'
          : parsedAccount
          ? `${parsedAccount.substring(0, 6)}...${parsedAccount.substring(parsedAccount.length - 4)}`
          : ''}
      </span>
    </AccountComponent>
  )
}

const AccountComponent = styled.div`
	padding: 10px 20px;
	border-radius: 25px;
	background-color: white;
  opacity: 0.8;
	color: black;
  margin-left: 10px;
  transition: opacity .3s ease;

	&:hover {
    opacity: 1;
    cursor: pointer;
	}
`;

export default Account;