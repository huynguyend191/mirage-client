import React, { useState, useContext, useEffect } from 'react';
import { Table, Spin, Tag, Popconfirm } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { SUB_STATE, SUB_TYPE } from '../../lib/constants';
import moment from 'moment';
import styles from './SubscriptionHistory.module.css';

export default function SubscriptionHistory() {
  const { account } = useContext(AccountContext);
  const [studentSub, setStudentSub] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStudentSub = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/subscriptions/' + account.student.id);
      const subs = [];
      result.data.subscriptions.forEach(sub => {
        sub.key = sub.id;
        subs.push(sub);
      });
      setStudentSub(subs);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };

  const cancelSubscription = async (id) => {
    setLoading(true);
    try {
      await axios.put('/subscriptions/' + id, {
        state: SUB_STATE.CANCELED
      })
      getStudentSub();
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
      }
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: type => {
        if (type === SUB_TYPE.SILVER) {
          return <Tag color="#C0C0C0">Silver</Tag>
        }
        else if (type === SUB_TYPE.GOLD) {
          return <Tag color="#DAA520">Gold</Tag>
        }
        else if (type === SUB_TYPE.PLATIUM) {
          return <Tag color="processing">Platium</Tag>
        }
        else {
          return <Tag>Normal</Tag>
        }
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{duration / 60000} mins</div>
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => {
        return <div>{price}$</div>
      }
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => {
        if (state === SUB_STATE.COMPLETED) {
          return <Tag color="success">Completed</Tag>
        }
        else if (state === SUB_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>
        }
        else {
          return <Tag color="error">Cancelled</Tag>
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'state',
      render: (text, record) => {
        if (record.state === SUB_STATE.PENDING) {
          return (
            <Popconfirm
              title="Do you want to cancel this request?" 
              okText="Yes" 
              cancelText="No" 
              className={styles.cancelBtn}
              onConfirm={() => cancelSubscription(record.id)}
            >
              Cancel
            </Popconfirm>)
        }
        else {
          return <div>N/A</div>
        }
      }
    },
  ];

  useEffect(() => {
    getStudentSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={studentSub}
        pagination={false}
      />
    </Spin>
  )
}
