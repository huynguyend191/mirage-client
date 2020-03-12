import React, { createContext, useState, useEffect } from 'react';
import { getAccountInfo, removeAccountInfo } from '../lib/utils/getAccountInfo';
export const AccountContext = createContext(null);

const initialAccount = null;

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    if (Boolean(localStorage.getItem('remember'))) {
      const existAccount = getAccountInfo();
      if (existAccount) {
        setAccount(existAccount);
      }
    } else {
      removeAccountInfo();
    }
  }, []);

  const onLogin = (accountData) => {
    setAccount(accountData);
  };

  const onLogout = () => {
    setAccount(null);
  };

  return (
    <AccountContext.Provider value={{account, onLogin, onLogout}} {...props} />
  )
}

export default AccountContextProvider;