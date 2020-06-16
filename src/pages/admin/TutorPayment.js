import React from 'react';
import { Tag, Table } from 'antd';
import { PAYMENT_STATE } from '../../lib/constants';
import moment from 'moment';

export default function TutorPayment({ payments }) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>;
      }
    },
    {
      title: 'Price',
      dataIndex: 'price'
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => {
        if (state === PAYMENT_STATE.COMPLETED) {
          return <Tag color="success">Completed</Tag>;
        } else if (state === PAYMENT_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="error">Cancelled</Tag>;
        }
      }
    }
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={payments} pagination={true} size="small" />
    </div>
  );
}
