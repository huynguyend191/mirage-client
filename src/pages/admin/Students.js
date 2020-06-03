import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table, Tag, Pagination, Spin, Input } from 'antd';
import styles from './Students.module.css';
import StudentProfile from './StudentProfile';
const { Search } = Input;

export default function Students() {
  const [pageSize, setPageSize] = useState(10);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const getStudentsData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`/students?page=${page}&size=${pageSize}&search=` + searchKey);
      const tableData = [];
      result.data.students.forEach(student => {
        tableData.push({
          key: student.id,
          id: student.id,
          name: student.name,
          username: student.account.username,
          email: student.account.email,
          state: student.account.state,
          verification: student.account.verification,
          accountId: student.account.id
        });
      });
      setTotal(result.data.totalResults);
      setStudents(tableData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response);
    }
  };

  useEffect(() => {
    getStudentsData();
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
      render: state => (state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>)
    },
    {
      title: 'Verification',
      dataIndex: 'verification',
      render: verification =>
        verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>
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
    <div className={styles.studentsLayout}>
      <StudentProfile
        setShowDetailModal={setShowDetailModal}
        showDetailModal={showDetailModal}
        getStudentsData={getStudentsData}
        selected={selected}
      />
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name or email" onSearch={searchUser} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table columns={columns} dataSource={students} pagination={false} onRow={onSelectRow} />
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
