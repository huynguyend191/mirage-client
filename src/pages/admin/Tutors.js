import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table, Tag, Pagination, Input, Spin } from 'antd';
import styles from './Tutors.module.css';
import { PROFILE_STATUS, STATES, VERIFICATION } from '../../lib/constants';
import TutorProfile from './TutorProfile';
const { Search } = Input;

export default function Tutors() {
  const [pageSize, setPageSize] = useState(10);
  const [tutors, setTutors] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const getTutorsData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/tutors?page=${page}&size=${pageSize}&search=` + searchKey);
      const tableData = [];
      result.data.tutors.forEach(tutor => {
        tableData.push({
          key: tutor.id,
          id: tutor.id,
          name: tutor.name,
          username: tutor.account.username,
          email: tutor.account.email,
          state: tutor.account.state,
          verification: tutor.account.verification,
          accountId: tutor.account.id,
          profileStatus: tutor.profileStatus
        });
      });
      setTotal(result.data.totalResults);
      setTutors(tableData);
      setLoading(false);
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getTutorsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchKey]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Username',
      dataIndex: 'username'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => (state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>),
      filters: [
        {
          text: 'Active',
          value: STATES.ACTIVE
        },
        {
          text: 'Inactive',
          value: STATES.INACTIVE
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.state.toString().indexOf(Boolean(value)) === 0
    },
    {
      title: 'Verification',
      dataIndex: 'verification',
      render: verification =>
        verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>,
      filters: [
        {
          text: 'Verified',
          value: VERIFICATION.VERIFIED
        },
        {
          text: 'Unverified',
          value: VERIFICATION.UNVERIFIED
        }
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.verification.toString().indexOf(Boolean(value)) === 0
    },
    {
      title: 'Profile status',
      dataIndex: 'profileStatus',
      render: profileStatus => {
        if (profileStatus === PROFILE_STATUS.ACCEPTED) {
          return <Tag color="success">Accepted</Tag>;
        } else if (profileStatus === PROFILE_STATUS.PENDING) {
          return <Tag color="blue">Pending</Tag>;
        } else {
          return <Tag color="error">Rejected</Tag>;
        }
      },
      filters: [
        {
          text: 'Accepted',
          value: PROFILE_STATUS.ACCEPTED
        },
        {
          text: 'Pending',
          value: PROFILE_STATUS.PENDING
        },
        {
          text: 'Rejected',
          value: PROFILE_STATUS.REJECTED
        }
      ],
      onFilter: (value, record) => record.profileStatus.toString().indexOf(value) === 0
    }
  ];

  const showTotal = () => {
    return `Total ${total} results`;
  };

  const changePageSize = (current, size) => {
    setPageSize(size);
    setPage(Math.ceil(total / size));
  };

  const changePage = (page, pageSize) => {
    setPage(page);
  };

  const onSelectRow = (record, index) => {
    return {
      onClick: event => {
        setSelected(record);
        setShowDetailModal(true);
      }
    };
  };

  const searchUser = value => {
    setSearchKey(value);
  };

  return (
    <div className={styles.tutorsLayout}>
      <TutorProfile
        selected={selected}
        setShowDetailModal={setShowDetailModal}
        showDetailModal={showDetailModal}
        getTutorsData={getTutorsData}
      />
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name or email" onSearch={searchUser} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={tutors} pagination={false} onRow={onSelectRow} />
      </Spin>
      <div className={styles.paginationWrapper}>
        <Pagination
          current={page}
          defaultCurrent={page}
          total={total}
          pageSize={pageSize}
          showSizeChanger
          showTotal={showTotal}
          onShowSizeChange={changePageSize}
          onChange={changePage}
        />
      </div>
    </div>
  );
}
