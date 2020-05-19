import React, { createContext, useState, useEffect } from 'react';
import { getAccountInfo, removeAccountInfo } from '../lib/utils/getAccountInfo';
export const AccountContext = createContext(null);

const initialAccount = null;

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    const existAccount = getAccountInfo();
    if (existAccount) {
      setAccount(existAccount);
    }
  }, []);

  const onSignIn = (accountData) => {
    setAccount(accountData);
  };

  const onSignOut = () => {
    removeAccountInfo();
    localStorage.clear();
    setAccount(null);
  };

  return (
    <AccountContext.Provider value={{ account, onSignIn, onSignOut }} {...props} />
  )
}

export default AccountContextProvider;