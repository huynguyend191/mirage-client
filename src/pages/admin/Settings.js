import React, { useState, useEffect } from 'react';
import { TUTOR_PRICE, STUDENT_PRICE, DISCOUNT_RATE } from '../../lib/constants';
import axios from '../../lib/utils/axiosConfig';
import { Spin } from 'antd';
import styles from './Settings.module.css';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [studentPrice, setStudentPrice] = useState(null);
  const [tutorPrice, setTutorPrice] = useState(null);

  const getSettings = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/settings');
      result.data.settings.forEach(setting => {
        if (setting.type === DISCOUNT_RATE) {
          setDiscount(JSON.parse(setting.content));
        }
        if (setting.type === STUDENT_PRICE) {
          setStudentPrice(Number(setting.content));
        }
        if (setting.type === TUTOR_PRICE) {
          setTutorPrice(Number(setting.content));
        }
      });
    } catch (error) {
      alert(error.response.data.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getSettings();
  }, []);
  return (
    <Spin spinning={loading}>
      <div className={styles.settings}>
        <div className={styles.settingsContent}>Set price</div>
        <div className={styles.settingsContent}>Set discount</div>
      </div>
    </Spin>
  );
}
