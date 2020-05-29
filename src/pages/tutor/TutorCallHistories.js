import React, { useEffect, useState, useContext } from 'react';
import styles from './TutorCallHistories.module.css';
import { Table, Spin, Button, Input } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import ReportModal from '../../components/ReportModal';

const { Search } = Input;

export default function TutorCallHistories() {
  const { account } = useContext(AccountContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchKey, setSearchKey] = useState('');

  const getHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/call-histories?tutorId=' + account.tutor.id + '&search=' + searchKey);
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
  }, [searchKey]);
  const onReport = record => {
    setSelected(record);
    setShowReport(true);
  };

  const searchCall = value => {
    setSearchKey(value);
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
      title: 'Student',
      dataIndex: 'student',
      render: student => {
        return <div>{student.name}</div>;
      }
    },
    {
      title: 'Username',
      dataIndex: 'student',
      render: student => {
        return <div>{student.account.username}</div>;
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{getTimeFromMs(duration)}</div>;
      }
    },
    {
      title: 'Action',
      render: (text, record) => {
        return (
          <div>
            <Button danger onClick={() => onReport(record)}>
              Report
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className={styles.TutorCallHistories}>
      <ReportModal setShowReport={setShowReport} showReport={showReport} selected={selected} />
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name" onSearch={searchCall} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={history} pagination={false} rowKey="id" />
      </Spin>
    </div>
  );
}
