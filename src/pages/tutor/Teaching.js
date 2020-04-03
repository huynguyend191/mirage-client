import React, { useState, useEffect, useContext } from 'react';
import VideoCall from '../../components/VideoCall';
import { Spin, Steps } from 'antd';
import { AccountContext } from '../../context/AccountContext';
import { SolutionOutlined, ProfileOutlined, SmileOutlined } from '@ant-design/icons';
import axios from '../../lib/utils/axiosConfig';
import styles from './Teaching.module.css';
import { PROFILE_STATUS } from '../../lib/constants';
import WaitImg from '../../assets/tutor-wait.png';
import CompleteProfileImg from '../../assets/complete-profile.png';

const { Step } = Steps;

export default function Teaching() {
  const { account } = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});

  const getProfile = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/tutors/' + account.tutor.id);
      account.tutor = result.data.tutor;
      setProfile(result.data.tutor);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  }

  useEffect(() => {
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  let profileStatus;
  if (profile.profileStatus === PROFILE_STATUS.ACCEPTED) {
    profileStatus = <Step status="finish" title="Profile approval" icon={<ProfileOutlined />} />
  } else if (profile.profileStatus === PROFILE_STATUS.PENDING) {
    profileStatus = <Step status="wait" title="Profile approval" icon={<ProfileOutlined />} />
  } else if (profile.profileStatus === PROFILE_STATUS.REJECTED) {
    profileStatus = <Step status="error" title="Profile approval" icon={<ProfileOutlined />} />
  }

  return (
    <div className={styles.teaching}>
      <Spin size="large" spinning={loading}>
        <Steps style={{ width: "1600px" }}>
          <Step status={(profile.account && profile.account.verification) ? "finish" : "wait"} title="Verification" icon={<SolutionOutlined />} />
          {profileStatus}
          <Step status={(profile.account && profile.account.verification && profile.profileStatus === PROFILE_STATUS.ACCEPTED) ? "finish" : "wait"} title="Ready" icon={<SmileOutlined />} />
        </Steps>
        {(profile.account && profile.account.verification && profile.profileStatus === PROFILE_STATUS.ACCEPTED) ?
          (<div className={styles.wait}>
            <img className={styles.waitImg} src={WaitImg} alt="" draggable="false" />
            <div className={styles.waitTxt}>
              <p>You are all set!</p>
              <p>Be patient and stay here.</p>
              <p>Students will start calling you soon.</p>
            </div>
          </div>)
          :
          (<div className={styles.wait}>
            <img className={styles.waitImg} src={CompleteProfileImg} alt="" draggable="false" />
            <div className={styles.waitTxt}>
              <p>You are almost ready!</p>
              <p>Complete your profile to start now!</p>
              <p>Students are waiting to see you.</p>
            </div>
          </div>)
        }
        <VideoCall account={account} />
      </Spin>
    </div>
  );
}
