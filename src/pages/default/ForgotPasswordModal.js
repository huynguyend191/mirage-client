import React, { useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './ForgotPasswordModal.module.css';
import axios from '../../lib/utils/axiosConfig';

export default function ForgotPasswordModal({isVisible, onClose}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const result = await axios.post('/accounts/reset-password', { user: values.user});
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response);
    }
  };
  const onCancel = () => {
    form.resetFields()
    onClose();
  }

  return (
    <Modal
      visible={isVisible}
      footer={null}
      title="Reset your password"
      width="350px"
      onCancel={onCancel}
    >
      <Form
        name="forgot_password"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="user"
          rules={[{ required: true, message: 'Please input your username or email!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter your username or email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" shape="round" loading={loading} className={styles.submitBtn}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
