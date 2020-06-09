import React from 'react';
import { Tag, Table } from 'antd';
import { REPORT_STATE } from '../../lib/constants';
import moment from 'moment';

export default function AccountReport({ reports }) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>;
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

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={reports} pagination={true} />
    </div>
  );
}
