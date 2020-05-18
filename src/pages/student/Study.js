import React, { useContext, useState, useEffect } from 'react';
import VideoCall from '../../components/VideoCall';
import { AccountContext } from '../../context/AccountContext';
import styles from './Study.module.css';
import Unverify from '../../assets/unverify.png';
import Timeout from '../../assets/timeout.png';
import axios from '../../lib/utils/axiosConfig';

export default function Study() {
  const { account } = useContext(AccountContext);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const getStudent = async () => {
      try {
        const result = await axios.get('/students/' + account.student.id);
        setStudent(result.data.student);
      } catch (error) {
        console.log(error)
      }
    }
    getStudent();
  }, [account]);

  let renderStudy = null;
  if ((account && account.verification)) {
    if (student && student.remaining_time > 0) {
      renderStudy = (
        <VideoCall account={account} remainingTime={student.remaining_time} />
      )
    } else {
      renderStudy = (
        <div className={styles.unverify}>
          <img className={styles.timeoutImg} src={Timeout} alt="" draggable="false" />
          <div className={styles.unverifyTxt}>
            <p>Sorry, you have run out of study time!</p>
            <p>Please subscribe to continue.</p>
          </div>
        </div>
      )
    }
  } else {
    renderStudy = (
      <div className={styles.unverify}>
        <img className={styles.unverifyImg} src={Unverify} alt="" draggable="false" />
        <div className={styles.unverifyTxt}>
          <p>You are almost ready!</p>
          <p>Verify your account to start now!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.study}>
      {renderStudy}
    </div>
  )
}
