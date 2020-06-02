import React, { useState, useEffect } from 'react';
import { Table, Spin, Tag } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { REPORT_STATE, ROLES } from '../../lib/constants';
import moment from 'moment';
import styles from './Reports.module.css';
import ReportDetailModal from './ReportDetailModal';

export default function Report() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showReportDetail, setShowReportDetail] = useState(false);

  const getReports = async () => {
    setLoading(true);
    try {
      const result = await axios.get('/reports');
      setReports(result.data.reports);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };
  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title: 'Username',
      render: (text, record) => {
        return <div>{record.account.username}</div>;
      }
    },
    {
      title: 'Role',
      render: (text, record) => {
        if (record.account.role === ROLES.STUDENT) {
          return <div>Student</div>;
        } else {
          return <div>Tutor</div>;
        }
      }
    },
    {
      title: 'Reason',
      dataIndex: 'reason'
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => {
        if (state === REPORT_STATE.RESOLVED) {
          return <Tag color="success">Resolved</Tag>;
        } else if (state === REPORT_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="error">Cancelled</Tag>;
        }
      }
    }
  ];

  const onSelectRow = (record, index) => {
    return {
      onClick: event => {
        setSelected(record);
        setShowReportDetail(true);
      }
    };
  };

  return (
    <div className={styles.reports}>
      <ReportDetailModal
        setShowReportDetail={setShowReportDetail}
        showReportDetail={showReportDetail}
        selected={selected}
        getReports={getReports}
      />
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={reports} pagination={false} rowKey="id" onRow={onSelectRow} />
      </Spin>
    </div>
  );
}
