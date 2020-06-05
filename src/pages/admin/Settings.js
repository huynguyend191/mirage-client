import React, { useState, useEffect } from 'react';
import { TUTOR_PRICE, STUDENT_PRICE, DISCOUNT_RATE } from '../../lib/constants';
import axios from '../../lib/utils/axiosConfig';
import { Spin, Form, InputNumber, Button } from 'antd';
import SettingImg from '../../assets/settings.png';
import styles from './Settings.module.css';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [studentPrice, setStudentPrice] = useState(null);
  const [tutorPrice, setTutorPrice] = useState(null);

  const [updatingStudent, setUpdatingStudent] = useState(false);
  const [updatingTutor, setUpdatingTutor] = useState(false);
  const [updatingDiscount, setUpdatingDiscount] = useState(false);

  const getSettings = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/settings');
      result.data.settings.forEach(setting => {
        if (setting.type === DISCOUNT_RATE) {
          setDiscount(setting);
        }
        if (setting.type === STUDENT_PRICE) {
          setStudentPrice(setting);
        }
        if (setting.type === TUTOR_PRICE) {
          setTutorPrice(setting);
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

  const checkPrice = (rule, value) => {
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject('Invalid price!');
  };

  const checkRate = (rule, value) => {
    if (value > 0 && value <= 1) {
      return Promise.resolve();
    }
    return Promise.reject('Invalid rate!');
  };

  const updateTutorPrice = async value => {
    setUpdatingTutor(true);
    try {
      await axios.put('/settings/' + tutorPrice.id, {
        content: value.tutorPrice
      });
      getSettings();
    } catch (error) {
      alert(error.response.data.message);
    }
    setUpdatingTutor(false);
  };

  const updateStudentPrice = async value => {
    setUpdatingStudent(true);
    try {
      await axios.put('/settings/' + studentPrice.id, {
        content: value.studentPrice
      });
      getSettings();
    } catch (error) {
      alert(error.response.data.message);
    }
    setUpdatingStudent(false);
  };

  const updateDiscount = async value => {
    setUpdatingDiscount(true);
    try {
      await axios.put('/settings/' + discount.id, {
        content: JSON.stringify(value)
      });
      getSettings();
    } catch (error) {
      alert(error.response.data.message);
    }
    setUpdatingDiscount(false);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.settings}>
        <div className={styles.settingsContent}>
          <img className={styles.settingImg} src={SettingImg} alt="" draggable="false" />
        </div>
        <div>
          <div className={styles.settingsContent}>
            <p className={styles.settingTitle}>Set price per min</p>
            {studentPrice && tutorPrice ? (
              <div>
                <Form
                  name="tutor"
                  layout="inline"
                  style={{ marginBottom: '20px' }}
                  onFinish={updateTutorPrice}
                  initialValues={{ tutorPrice: Number(tutorPrice.content) }}
                >
                  <Form.Item
                    name="tutorPrice"
                    label="Tutor payment"
                    rules={[
                      {
                        validator: checkPrice,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updatingTutor}>
                      Update
                    </Button>
                  </Form.Item>
                </Form>
                <Form
                  name="student"
                  layout="inline"
                  style={{ marginLeft: '7px' }}
                  onFinish={updateStudentPrice}
                  initialValues={{ studentPrice: Number(studentPrice.content) }}
                >
                  <Form.Item
                    name="studentPrice"
                    label="Student price"
                    rules={[
                      {
                        validator: checkPrice,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updatingStudent}>
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : null}
          </div>
          <div className={styles.settingsContent}>
            <p className={styles.settingTitle}>Set discount rate</p>
            {discount ? (
              <div>
                <Form
                  name="discount"
                  onFinish={updateDiscount}
                  initialValues={JSON.parse(discount.content)}
                  labelCol={{ span: 14 }}
                  wrapperCol={{ span: 4 }}
                >
                  <Form.Item
                    name="NORMAL"
                    label="Normal tier"
                    rules={[
                      {
                        validator: checkRate,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="SILVER"
                    label="Silver tier"
                    rules={[
                      {
                        validator: checkRate,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="GOLD"
                    label="Gold tier"
                    rules={[
                      {
                        validator: checkRate,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item
                    name="PLATIUM"
                    label="Platium tier"
                    rules={[
                      {
                        validator: checkRate,
                        required: true
                      }
                    ]}
                  >
                    <InputNumber />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 7 }}>
                    <Button type="primary" htmlType="submit" loading={updatingDiscount}>
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Spin>
  );
}
