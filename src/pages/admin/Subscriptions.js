import React, { useState, useEffect } from 'react';
import { Table, Spin, Tag, Popconfirm, Button } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { SUB_STATE, SUB_TIER } from '../../lib/constants';
import moment from 'moment';
import styles from './Subscriptions.module.css';
import { ReloadOutlined } from '@ant-design/icons';

export default function Subscriptions() {
  const [studentSub, setStudentSub] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStudentSub = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/subscriptions/');
      const subs = [];
      result.data.subscriptions.forEach(sub => {
        sub.key = sub.id;
        sub.username = sub.student.account.username;
        sub.name = sub.student.name;
        subs.push(sub);
      });
      setStudentSub(subs);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const cancelSubscription = async id => {
    setLoading(true);
    try {
      await axios.put('/subscriptions/' + id, {
        state: SUB_STATE.CANCELED
      });
      getStudentSub();
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const completeSubscription = async id => {
    setLoading(true);
    try {
      await axios.put('/subscriptions/' + id, {
        state: SUB_STATE.COMPLETED
      });
      getStudentSub();
    } catch (error) {
      alert(error.response.data.message);
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
      dataIndex: 'name'
    },
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      render: tier => {
        if (tier === SUB_TIER.SILVER) {
          return <Tag color="#C0C0C0">Silver</Tag>;
        } else if (tier === SUB_TIER.GOLD) {
          return <Tag color="#DAA520">Gold</Tag>;
        } else if (tier === SUB_TIER.PLATIUM) {
          return <Tag color="processing">Platium</Tag>;
        } else {
          return <Tag>Normal</Tag>;
        }
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{duration / 60000} mins</div>;
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
        if (state === SUB_STATE.COMPLETED) {
          return <Tag color="success">Completed</Tag>;
        } else if (state === SUB_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="error">Cancelled</Tag>;
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'state',
      render: (text, record) => {
        if (record.state === SUB_STATE.PENDING) {
          return (
            <div>
              <Popconfirm
                title="Do you want to accept this request?"
                okText="Yes"
                cancelText="No"
                className={styles.acceptBtn}
                onConfirm={() => completeSubscription(record.id)}
              >
                Complete
              </Popconfirm>
              <Popconfirm
                title="Do you want to cancel this request?"
                okText="Yes"
                cancelText="No"
                className={styles.cancelBtn}
                onConfirm={() => cancelSubscription(record.id)}
              >
                Cancel
              </Popconfirm>
            </div>
          );
        } else {
          return <div>N/A</div>;
        }
      }
    }
  ];

  useEffect(() => {
    getStudentSub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.subscriptions}>
      <Spin spinning={loading}>
        <Button className={styles.reload} onClick={getStudentSub} icon={<ReloadOutlined />}>
          Reload
        </Button>
        <Table columns={columns} dataSource={studentSub} pagination={false} />
      </Spin>
    </div>
  );
}
