import React from 'react';
import { Tag, Table } from 'antd';
import { SUB_STATE, SUB_TIER } from '../../lib/constants';
import moment from 'moment';

export default function CallHistory({ subscriptions }) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: createdAt => {
        return <div>{moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</div>
      }
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      render: tier => {
        if (tier === SUB_TIER.SILVER) {
          return <Tag color="#C0C0C0">Silver</Tag>
        }
        else if (tier === SUB_TIER.GOLD) {
          return <Tag color="#DAA520">Gold</Tag>
        }
        else if (tier === SUB_TIER.PLATIUM) {
          return <Tag color="processing">Platium</Tag>
        }
        else {
          return <Tag>Normal</Tag>
        }
      }
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: duration => {
        return <div>{duration / 60000} mins</div>
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: price => {
        return <div>{price}$</div>
      }
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => {
        if (state === SUB_STATE.COMPLETED) {
          return <Tag color="success">Completed</Tag>
        }
        else if (state === SUB_STATE.PENDING) {
          return <Tag color="blue">Pending</Tag>
        }
        else {
          return <Tag color="error">Cancelled</Tag>
        }
      }
    }
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={subscriptions}
        pagination={false}
      />
    </div>
  )
}
