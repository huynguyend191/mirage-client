import React, { useState, useContext } from 'react';
import { Modal, Form, Button, Input, Select } from 'antd';
import { REPORT_REASONS, ROLES } from '../lib/constants';
import { AccountContext } from '../context/AccountContext';
import axios from '../lib/utils/axiosConfig';

const { Option } = Select;

export default function Report({ showReport, selected, setShowReport }) {
  const [loading, setLoading] = useState(false);
  const { account } = useContext(AccountContext);
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 16 }
  };

  const onSubmit = async values => {
    let accountId = null;
    if (account.role === ROLES.STUDENT) {
      accountId = selected.tutor.account.id;
    } else {
      accountId = selected.student.account.id;
    }
    setLoading(true);
    try {
      await axios.post('/reports', {
        accountId,
        callId: selected.id,
        description: values.description,
        reason: values.reason
      });
      setLoading(false);
      alert('Report submitted');
      setShowReport(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return selected ? (
    <Modal
      title="Report to Admin"
      visible={showReport}
      onCancel={() => setShowReport(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: '300px', overflow: 'auto' }}
    >
      <Form {...layout} onFinish={onSubmit}>
        <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please select a reason' }]}>
          <Select placeholder="Select a reason">
            {REPORT_REASONS.map(reason => {
              return (
                <Option value={reason} key={reason}>
                  {reason}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea
            autoSize={{ minRows: 4 }}
            placeholder="Please specify your reasons or provide extra information (E.g timestamp)"
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" danger htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  ) : null;
}
