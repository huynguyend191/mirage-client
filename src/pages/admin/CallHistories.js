import React, { useState } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import CallDetailModal from './CallDetailModal';

export default function CallHistories({ callHistories }) {
  const [showCallDetail, setShowCallDetail] = useState(false);
  const [selected, setSelected] = useState(null);
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
  const onSelectRow = (record, index) => {
    return {
      onClick: event => {
        setSelected(record);
        setShowCallDetail(true);
      }
    };
  };
  return (
    <div>
      <CallDetailModal setShowCallDetail={setShowCallDetail} showCallDetail={showCallDetail} selected={selected} />
      <Table columns={columns} dataSource={callHistories} pagination={true} onRow={onSelectRow} rowKey="id" />
    </div>
  );
}
