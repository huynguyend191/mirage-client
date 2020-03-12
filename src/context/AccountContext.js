import React, { createContext, useState, useEffect } from 'react';
import { getAccountInfo } from '../lib/utils/getAccountInfo';
export const AccountContext = createContext(null);

const initialAccount = null;

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('remember'))) {
      const existAccount = getAccountInfo();
      if (existAccount) {
        setAccount(existAccount);
      }
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