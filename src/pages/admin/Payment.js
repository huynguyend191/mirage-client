import React, { useState, useEffect } from 'react';
import styles from './Payment.module.css';
import { Table, Spin, Tag, Popconfirm, Button } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { PAYMENT_STATE } from '../../lib/constants';
import moment from 'moment';
import { ReloadOutlined } from '@ant-design/icons';

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPayments = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/payments/');
      setPayments(result.data.payments);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  const updatePayment = async (id, state) => {
    setLoading(true);
    try {
      await axios.put('/payments/' + id, {
        state: state
      });
      getPayments();
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      }
    },
    {
      title: 'Name',
      render: (text, record) => {
        return record.tutor.name;
      }
    },
    {
      title: 'Username',
      render: (text, record) => {
        return record.tutor.account.username;
      }
    },
    {
      title: 'Email',
      dataIndex: 'state',
      render: (text, record) => {
        return record.tutor.account.email;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => {
        return <div>{price}$</div>;
      }
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => {
        if (state === PAYMENT_STATE.COMPLETED) {
          return <Tag color="success">Completed</Tag>;
        } else if (state === PAYMENT_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="error">Cancelled</Tag>;
        }
      }
    },
    {
      title: 'Action',
      render: (text, record) => {
        if (record.state === PAYMENT_STATE.PENDING) {
          return (
            <div>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.acceptBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.COMPLETED)}
              >
                Complete
              </Popconfirm>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.cancelBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.CANCELED)}
              >
                Cancel
              </Popconfirm>
            </div>
          );
        } else if (record.state === PAYMENT_STATE.COMPLETED) {
          return (
            <div>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.pendingBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.PENDING)}
              >
                Pending
              </Popconfirm>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.cancelBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.CANCELED)}
              >
                Cancel
              </Popconfirm>
            </div>
          );
        } else {
          return (
            <div>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.acceptBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.COMPLETED)}
              >
                Complete
              </Popconfirm>
              <Popconfirm
                title="Do you want to perform this action?"
                okText="Yes"
                cancelText="No"
                className={styles.pendingBtn}
                onConfirm={() => updatePayment(record.id, PAYMENT_STATE.PENDING)}
              >
                Pending
              </Popconfirm>
            </div>
          );
        }
      }
    }
  ];

  useEffect(() => {
    getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.payments}>
      <Spin spinning={loading}>
        <Button className={styles.reload} onClick={getPayments} icon={<ReloadOutlined />}>
          Reload
        </Button>
        <Table rowKey="id" columns={columns} dataSource={payments} pagination={false} />
      </Spin>
    </div>
  );
}
