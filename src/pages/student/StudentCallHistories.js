import React, { useEffect, useState, useContext } from 'react';
import styles from './StudentCallHistories.module.css';
import { Table, Spin, Popconfirm, Button } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';

export default function StudentCallHistories() {
  const { account } = useContext(AccountContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/call-histories');
      setHistory(result.data.callHistories);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };
  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
      }
    },
    {
      title: 'Student',
      dataIndex: 'student',
      render: student => {
        return <div>{student.name}</div>
      }
    },
    {
      title: 'Tutor',
      dataIndex: 'tutor',
      render: tutor => {
        return <div>{tutor.name}</div>
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{getTimeFromMs(duration)}</div>
      }
    }
  ];
  // const onSelectRow = (record, index) => {
  //   return {
  //     onClick: event => {
  //       setSelected(record);
  //       setShowCallDetail(true);
  //     }
  //   }
  // };  
  return (
    <div className={styles.StudentCallHistories}>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={history}
          pagination={false}
          rowKey='id'
        />
      </Spin>
    </div>
  )
}
