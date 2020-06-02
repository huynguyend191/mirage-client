import React, { useState, useEffect, useContext } from 'react';
import styles from './Payments.module.css';
import { Table, Spin, Tag } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { PAYMENT_STATE } from '../../lib/constants';
import moment from 'moment';
import { AccountContext } from '../../context/AccountContext';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { account } = useContext(AccountContext);
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>;
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
    }
  ];

  const getPayments = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/payments/' + account.tutor.id);
      setPayments(result.data.payments);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.payments}>
      <Spin spinning={loading}>
        <Table rowKey="id" columns={columns} dataSource={payments} pagination={false} />
      </Spin>
    </div>
  );
}
