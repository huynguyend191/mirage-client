import React, { useEffect, useState } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table } from 'antd';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import styles from './RecentCalls.module.css';

export default function RecentCalls() {
  const [calls, setCalls] = useState([]);
  useEffect(() => {
    const getRecentCalls = async () => {
      try {
        const result = await axios.get('/call-histories');
        setCalls(result.data.callHistories.slice(0, 5));
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getRecentCalls();
  }, []);
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      }
    },
    {
      title: 'Student',
      dataIndex: 'student',
      render: student => {
        return <div>{student.name}</div>;
      }
    },
    {
      title: 'Tutor',
      dataIndex: 'tutor',
      render: tutor => {
        return <div>{tutor.name}</div>;
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{getTimeFromMs(duration)}</div>;
      }
    }
  ];
  return (
    <div className={styles.recentCalls}>
      <p className={styles.recentCallsTitle}>Recent calls</p>
      <Table columns={columns} dataSource={calls} pagination={false} rowKey="id" />
    </div>
  );
}
