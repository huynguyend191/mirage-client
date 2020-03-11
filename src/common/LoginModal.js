import React from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './LoginModal.module.css';

export default function LoginModal({ isVisible, onClose, onSwitchRegister }) {
  const onFinish = values => {
    console.log('Received values of form: ', values);
  };
  
  const onChangeMode = () => {
    onClose();
    onSwitchRegister(true);
  }

  return (
    <Modal
      visible={isVisible}
      footer={null}
      onCancel={onClose}
      title="Login"
      width="400px"
    >
      <Form
        name="normal_login"
        className={styles.loginForm}
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username or email!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username or email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className={styles.loginForgot} href="/">
            Forgot password
        </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.loginButton} shape="round">
            Log in
        </Button>
        Or <span className={styles.registerNow} onClick={onChangeMode}>register now!</span>
        </Form.Item>
      </Form>
    </Modal>
  )
}
