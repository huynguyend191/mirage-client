import React, { useContext } from 'react';
import VideoCall from '../../components/VideoCall';
import { AccountContext } from '../../context/AccountContext';

export default function Study() {
  const { account } = useContext(AccountContext);
  return (
    <div>
      <VideoCall account={account} />
    </div>
  )
}
