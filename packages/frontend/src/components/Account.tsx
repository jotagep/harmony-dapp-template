import React from 'react'
import { useWeb3React } from "@web3-react/core";
import { toBech32 } from '@harmony-js/crypto';
import { isHmyLibrary } from '../helpers/provider';

const Account = () => {
    const { account, library } = useWeb3React()
    const isHmy = isHmyLibrary(library);
    const parsedAccount = (isHmy && account) ? toBech32(account) : account
  
    return (
      <>
        <span>Account</span>
        <span role="img" aria-label="robot">
          🤖
        </span>
        <span>
          {parsedAccount === null
            ? '-'
            : parsedAccount
            ? `${parsedAccount.substring(0, 6)}...${parsedAccount.substring(parsedAccount.length - 4)}`
            : ''}
        </span>
      </>
    )
  }

export default Account;