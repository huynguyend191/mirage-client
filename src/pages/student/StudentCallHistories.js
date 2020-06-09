import React, { useEffect, useState, useContext } from 'react';
import styles from './StudentCallHistories.module.css';
import { Table, Spin, Button, Input } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import StudentCallDetailModal from './StudentCallDetailModal';
import ReportModal from '../../components/ReportModal';
const { Search } = Input;

export default function StudentCallHistories() {
  const { account } = useContext(AccountContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCallDetail, setShowCallDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [showReport, setShowReport] = useState(false);

  const getHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/call-histories?studentId=' + account.student.id + '&search=' + searchKey);
      setHistory(result.data.callHistories);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };
  useEffect(() => {
    getHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey]);
  const onViewRecord = record => {
    setSelected(record);
    setShowCallDetail(true);
  };

  const onReportRecord = record => {
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
      title: 'Tutor',
      dataIndex: 'tutor',
      render: tutor => {
        return <div>{tutor.name}</div>;
      }
    },
    {
      title: 'Username',
      dataIndex: 'tutor',
      render: tutor => {
        return <div>{tutor.account.username}</div>;
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
            <Button className={styles.viewRecordBtn} onClick={() => onViewRecord(record)}>
              View record
            </Button>
            <Button danger onClick={() => onReportRecord(record)}>
              Report
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className={styles.StudentCallHistories}>
      <StudentCallDetailModal
        setShowCallDetail={setShowCallDetail}
        showCallDetail={showCallDetail}
        selected={selected}
      />
      <ReportModal setShowReport={setShowReport} showReport={showReport} selected={selected} />
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name" onSearch={searchCall} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={history} pagination={true} rowKey="id" />
      </Spin>
    </div>
  );
}
