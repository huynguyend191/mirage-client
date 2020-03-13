import React, { createContext, useState, useEffect } from 'react';
import { getAccountInfo, removeAccountInfo } from '../lib/utils/getAccountInfo';
export const AccountContext = createContext(null);

const initialAccount = null;

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('remember'))) {
      const existAccount = getAccountInfo();
      if (existAccount) {
        console.log(existAccount);
        setAccount(existAccount);
      }
    }
  }, []);

  const onLogin = (accountData) => {
    setAccount(accountData);
  };

  const onLogout = () => {
    removeAccountInfo();
    localStorage.clear();
    setAccount(null);
  };

  return (
    <AccountContext.Provider value={{account, onLogin, onLogout}} {...props} />
  )
}

export default AccountContextProvider;