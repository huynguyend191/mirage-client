import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './LoginModal.module.css';
import { AccountContext } from '../../context/AccountContext';
import axios from '../../lib/utils/axiosConfig';

export default function LoginModal({ isVisible, onClose, onSwitchRegister }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { onLogin } = useContext(AccountContext);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const account = {
        user: values.user,
        password: values.password
      };
      localStorage.setItem('remember', values.remember);
      const result = await axios.post('/accounts/login', account);
      setLoading(false);
      onLogin(result.data.account);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

  const onChangeMode = () => {
    onClose();
    onSwitchRegister(true);
  }

  const onCancle = () => {
    form.resetFields()
    onClose();
  }

  return (
    <Modal
      visible={isVisible}
      footer={null}
      onCancel={onCancle}
      title="Login"
      width="400px"
    >
      <Form
        name="normal_login"
        className={styles.loginForm}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          name="user"
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
          <Button type="primary" htmlType="submit" className={styles.loginButton} shape="round" disabled={loading}>
            Log in
        </Button>
        Or <span className={styles.registerNow} onClick={onChangeMode}>register now!</span>
        </Form.Item>
      </Form>
    </Modal>
  )
}
