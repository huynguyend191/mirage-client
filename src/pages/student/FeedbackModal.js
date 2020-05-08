import React, { useState, useContext } from 'react';
import { Modal, Form, Rate, Input, Button, Alert } from 'antd';
import { AccountContext } from '../../context/AccountContext';
import axios from '../../lib/utils/axiosConfig';

export default function FeedbackModal({ showFeedback, setShowFeedBack, tutor }) {
  const [loading, setLoading] = useState(false);
  const [sucessAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const { account } = useContext(AccountContext);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        studentId: account.student.id,
        tutorId: tutor.id
      }
      await axios.post('/reviews/', data);
      setLoading(false);
      setSuccessAlert(true);
    } catch (error) {
      setLoading(false);
      setErrorAlert(false);
      console.log(error.response);
    }
  };

  const closeFeedback = () => {
    setShowFeedBack(false);
    setSuccessAlert(false);
    setErrorAlert(false);
  }

  return (
    <Modal
      visible={showFeedback}
      destroyOnClose
      onCancel={closeFeedback}
      footer={false}
      title="Feedback about this tutor"
    >
      {sucessAlert ? <Alert message="Review submitted" type="success" showIcon /> : null}
      {errorAlert ? <Alert message="Fail to submit, please try again" type="error" showIcon /> : null}
      <Form
        {...layout}
        onFinish={onSubmit}
      >
        <Form.Item name="rating" label="Rating">
          <Rate allowClear={true} defaultValue={0} />
        </Form.Item>
        <Form.Item 
          name="comment" 
          label="Comment"
          rules={[
            {
              required: true,
              message: 'Please input your comment',
            },
          ]}
        >
          <Input.TextArea placeholder="Share your experience" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
