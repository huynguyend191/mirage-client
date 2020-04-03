import React, { useState, useEffect, useContext } from 'react';
import VideoCall from '../../components/VideoCall';
import { Spin, Steps } from 'antd';
import { AccountContext } from '../../context/AccountContext';
import { SolutionOutlined, ProfileOutlined, SmileOutlined  } from '@ant-design/icons';
import axios from '../../lib/utils/axiosConfig';
import styles from './Teaching.module.css';
import { PROFILE_STATUS } from '../../lib/constants';

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
      <Steps style={{width: "1600px"}}>
        <Step status={(profile.account && profile.account.verification)? "finish" : "wait"} title="Verification" icon={<SolutionOutlined />} />
        {profileStatus}
        <Step status={(profile.account && profile.account.verification && profile.profileStatus === PROFILE_STATUS.ACCEPTED)? "finish" : "wait"} title="Ready" icon={<SmileOutlined />} />
      </Steps>
        <VideoCall account={account} />
      </Spin>
    </div>
  );
}
