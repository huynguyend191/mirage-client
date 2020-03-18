import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [accPreferences, setAccPreferences] = useState(null);
  const [profile, setProfile] = useState(null);
  const { account } = useContext(AccountContext);
  const getPreference = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/preferences');
      setPreferences(result.data.preferences);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };
  const getTutorProfile = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/tutors/' + account.tutor.id);
      setProfile(result.data.tutor);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  }
  const getAccountPreference = async () => {
    try {
      setLoading(true);
      const result = await axios.get('/accounts/' + account.id + '/preferences');
      setAccPreferences(result.data.account.preferences);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  }
  useEffect(() => {
    getPreference();
    getTutorProfile();
    getAccountPreference();
  }, []);
  const avatar = (profile && profile.avatar) ?
    <img src={profile.avatar} alt="" />
    : <Avatar icon={<UserOutlined />} size={100} />
  if (profile && preferences && accPreferences) {
    return (
      <div className={styles.profile}>
        <div className={styles.accountInfoContainer}>
          {avatar}
          <div className={styles.accountInfo}>
            <p className={styles.name}>{profile.name}</p>
            <p>Email: {profile.account.email}</p>
          </div>
        </div>
      </div>
    )
  } else {
    return null;
  }
}
