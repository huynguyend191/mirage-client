import React, { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';
import VerifyAccount from '../../components/VerifyAccount';

export default function Tutor() {
  const { account, onLogout } = useContext(AccountContext);
  if (account.verification) {
    return (
      <div>
        <button onClick={onLogout}>Logout</button>
      </div>
    );
  }
  return (
    <div>
      <VerifyAccount />
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
