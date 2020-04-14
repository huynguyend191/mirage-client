import React, { useContext } from 'react';
import VideoCall from '../../components/VideoCall';
import { AccountContext } from '../../context/AccountContext';
import styles from './Study.module.css'

export default function Study() {
  const { account } = useContext(AccountContext);
  return (
    <div className={styles.study}>
      {(account && account.verification) ?  <VideoCall account={account} /> : 
        <div className={styles.unverified}>
          Please verify your account
        </div>
      }
    </div>
  )
}
