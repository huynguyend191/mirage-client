import React, { useState, useEffect, useContext } from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import styles from './RegisterModal.module.css';
import welcomeStudentImg from '../../assets/welcome-student.png';
import welcomeTutorImg from '../../assets/welcome-tutor.png';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';

export default function RegisterModal(props) {
  const [isStudent, setIsStudent] = useState(props.isStudent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm();
  const { onSignIn } = useContext(AccountContext);

  useEffect(() => {
    setIsStudent(props.isStudent)
  }, [props.isStudent])

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const url = isStudent? '/students' : '/tutors';
      const accountInfo = {
        username: values.username,
        password: values.password,
        email: values.email,
        name: values.name
      };
      const result = await axios.post(url + '/register', accountInfo);
      setLoading(false);
      onSignIn(result.data.account);
      localStorage.setItem('remember', true);
      window.location.reload(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  const switchRole = () => {
    setIsStudent(!isStudent);
  };
  const switchMode = () => {
    props.onClose();
    props.onSwitchSignIn();
  };
  const onClose = () => {
    form.resetFields();
    props.onClose();
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  const studentWelcome = (
    <div className={styles.registerWelcomeContent}>
      <img className={styles.welcomeImg} draggable={false} src={welcomeStudentImg} alt="" />
      <h3>Experience new way of studying English</h3>
      <h4>Improve your English anywhere anytime</h4>
      <h4>Learn from interesting people around the world</h4>
    </div>
  )
  
  const tutorWelcome = (
    <div className={styles.registerWelcomeContent}>
      <img className={styles.welcomeImg} draggable={false} src={welcomeTutorImg} alt="" />
      <h3>Tutoring with Mirage is fun & rewarding</h3>
      <h4>No experience necessary</h4>
      <h4>Share your knowledge with people and get paid</h4>
    </div>
  )

  return (
    <Modal
      visible={props.isVisible}
      footer={null}
      title={isStudent? 'Register as student' : 'Register as tutor'}
      onCancel={onClose}
      width="800px"
    >
      <div className={styles.registerContent}>
        <div className={styles.registerWelcome}>
          {
            isStudent?
            <div>{studentWelcome}</div> :
            <div>{tutorWelcome}</div>
          }
        </div>
        <div className={styles.formWrapper}>
          {error ? <Alert style={{marginBottom: "15px"}} message={error} type="error" showIcon banner closable afterClose={() => setError(null)} /> : null}
          <Form
            name="register"
            onFinish={onFinish}
            scrollToFirstError
            className={styles.registerForm}
            form={form}
            {...formItemLayout}
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                {
                  required: true,
                  message: 'Please input your E-mail!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please input your username!', whitespace: false }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="name"
              label="Full name"
              rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" className={styles.registerButton} shape="round" loading={loading}>
                Register
              </Button>
              <p className={styles.switchModeWrapper}>Or<span onClick={switchRole} className={styles.switchMode}> become a {isStudent? "tutor" : "student"} instead</span></p>
              <p className={styles.switchModeWrapper}>Already have an account? <span onClick={switchMode} className={styles.switchMode}> Sign in</span></p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
