import React, { useState, useContext } from 'react';
import styles from './ChangePasswordModal.module.css';
import { Modal, Form, Input, Button } from 'antd';
import { AccountContext } from '../context/AccountContext';
import axios from '../lib/utils/axiosConfig';
import { ROLES } from '../lib/constants';

export default function ChangePasswordModal({ isVisible, onForgot, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { account } = useContext(AccountContext);

  const onFinish = async values => {
    try {
      setLoading(true);
      const password = {
        oldPassword: values.oldpassword,
        newPassword: values.password
      };
      await axios.post('/accounts/' + account.id + '/change-password', password);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };
  const onCancel = () => {
    form.resetFields();
    onClose();
  };
  const forgotPassword = () => {
    onCancel();
    onForgot();
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  return (
    <Modal visible={isVisible} footer={null} title="Change your password" onCancel={onCancel} width="500px">
      <Form {...layout} name="change-password" onFinish={onFinish} form={form}>
        <Form.Item
          name="oldpassword"
          label="Current password"
          rules={[
            {
              required: true,
              message: 'Please input your current password!'
            }
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="password"
          label="New password"
          rules={[
            {
              required: true,
              message: 'Please input your new password!'
            }
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="Retype password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" className={styles.registerButton} loading={loading}>
            Update password
          </Button>
          {account.role === ROLES.ADMIN ? null : (
            <span className={styles.forgotPass} onClick={forgotPassword}>
              Forgot password?
            </span>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}
