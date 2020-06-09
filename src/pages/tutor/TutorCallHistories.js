import React, { useEffect, useState, useContext } from 'react';
import styles from './TutorCallHistories.module.css';
import { Table, Spin, Button, Input, Tag } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import ReportModal from '../../components/ReportModal';
import { TUTOR_PRICE } from '../../lib/constants';

const { Search } = Input;

export default function TutorCallHistories() {
  const { account } = useContext(AccountContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [selected, setSelected] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [price, setPrice] = useState(0);

  const getHistory = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/call-histories?tutorId=' + account.tutor.id + '&search=' + searchKey);
      setHistory(result.data.callHistories);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  const createPayment = async () => {
    setPaymentLoading(true);
    try {
      await axios.post('/payments', {
        tutorId: account.tutor.id
      });
      setPaymentLoading(false);
      getHistory();
    } catch (error) {
      alert(error.response.data.message);
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const getPrice = async () => {
      try {
        const result = await axios.get('/settings');
        result.data.settings.forEach(setting => {
          if (setting.type === TUTOR_PRICE) {
            setPrice(Number(setting.content));
          }
        });
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getHistory();
    getPrice();
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
      title: 'Payment state',
      dataIndex: 'counted',
      render: counted => {
        if (counted) {
          return <Tag color="success">Counted</Tag>;
        } else {
          return <Tag>Uncounted</Tag>;
        }
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
      <Button type="primary" onClick={createPayment} loading={paymentLoading}>
        Create payment request
      </Button>
      <span className={styles.payRate}>*Payment rate: {price}$/min</span>
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name" onSearch={searchCall} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={history} pagination={true} rowKey="id" />
      </Spin>
    </div>
  );
}
