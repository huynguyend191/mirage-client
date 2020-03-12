import React, { createContext, useState, useEffect } from 'react';

export const AccountContext = createContext(null);

const initialAccount = null;

const AccountContextProvider = (props) => {
  const [account, setAccount] = useState(initialAccount);

  useEffect(() => {
    //TODO check if cookie exists
    const existAccout = { role: 3 };
    if (existAccout) {
      setAccount(null)
    }
  }, []);

  const onLogin = (accountData) => {
    setAccount(accountData)
  };

  const onLogout = () => {
    setAccount(null);
  };

  return (
    <AccountContext.Provider value={{account, onLogin, onLogout}} {...props} />
  )
}

export default AccountContextProvider;