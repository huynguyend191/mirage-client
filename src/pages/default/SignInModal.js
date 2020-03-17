import React, { useContext, useState } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './SignInModal.module.css';
import { AccountContext } from '../../context/AccountContext';
import axios from '../../lib/utils/axiosConfig';

export default function SignInModal({ isVisible, onClose, onSwitchRegister, onSwitchForgotPass }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { onSignIn } = useContext(AccountContext);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const account = {
        user: values.user,
        password: values.password
      };
      localStorage.setItem('remember', values.remember);
      const result = await axios.post('/accounts/sign-in', account);
      setLoading(false);
      onSignIn(result.data.account);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };

  const onChangeMode = () => {
    onClose();
    onSwitchRegister(true);
  };

  const onCancel = () => {
    form.resetFields()
    onClose();
  };

  const onForgotPass = () => {
    onClose();
    onSwitchForgotPass();
  };

  return (
    <Modal
      visible={isVisible}
      footer={null}
      onCancel={onCancel}
      title="Sign in"
      width="400px"
    >
      <Form
        name="normal_sign_in"
        className={styles.signInForm}
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

          <p onClick={onForgotPass} className={styles.signInForgot}>
            Forgot password?
          </p>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles.signInButton} shape="round" loading={loading}>
            Sign in
        </Button>
        Don't have an account? <span className={styles.registerNow} onClick={onChangeMode}>Register now!</span>
        </Form.Item>
      </Form>
    </Modal>
  )
}
