import React, { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';
import VerifyAccount from '../../components/VerifyAccount';

export default function Tutor() {
  const { account, onSignOut } = useContext(AccountContext);
  if (account.verification) {
    return (
      <div>
        <button onClick={onSignOut}>Sign out</button>
      </div>
    );
  }
  return (
    <div>
      <VerifyAccount />
      <button onClick={onSignOut}>Sign out</button>
    </div>
  );
}
