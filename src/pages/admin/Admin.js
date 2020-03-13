import React, { useContext } from 'react';
import { AccountContext } from '../../context/AccountContext';

export default function Admin() {
  const { onLogout } = useContext(AccountContext);
  return (
    <div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}
