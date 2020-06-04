import React, { useEffect, useState } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table } from 'antd';
import styles from './TopPaid.module.css';

export default function TopPaid() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getTopPaid = async () => {
      try {
        const result = await axios.get('/stats/top-paid');
        setUsers(result.data.topPaid);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getTopPaid();
  }, []);
  const columns = [
    {
      title: 'Rank',
      key: 'index',
      render: (text, record, index) => {
        return index + 1;
      }
    },
    {
      title: 'Name',
      dataIndex: 'student',
      render: student => {
        return <div>{student.name}</div>;
      }
    },
    {
      title: 'Amount',
      dataIndex: 'total',
      render: total => {
        return <div>{total.toFixed(2)}$</div>;
      }
    }
  ];
  return (
    <div className={styles.topPaid}>
      <p className={styles.topPaidTitle}>Top paid student</p>
      <Table columns={columns} dataSource={users} pagination={false} rowKey="studentId" />
    </div>
  );
}
