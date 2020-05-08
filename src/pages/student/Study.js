import React, { useContext } from 'react';
import VideoCall from '../../components/VideoCall';
import { AccountContext } from '../../context/AccountContext';
import styles from './Study.module.css';
import Unverify from '../../assets/unverify.png';

export default function Study() {
  const { account } = useContext(AccountContext);
  return (
    <div className={styles.study}>
      {(account && account.verification) ? <VideoCall account={account} /> :
        <div className={styles.unverify}>
          <img className={styles.unverifyImg} src={Unverify} alt="" draggable="false" />
          <div className={styles.unverifyTxt}>
            <p>You are almost ready!</p>
            <p>Verify your account to start now!</p>
          </div>
        </div>
      }
    </div>
  )
}
