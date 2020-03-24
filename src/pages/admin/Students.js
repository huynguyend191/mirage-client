import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table, Tag, Pagination } from 'antd';
import styles from './Students.module.css';

export default function Students() {
  const pageSize = 20;
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const getStudentsData = async () => {
    try {
      const result = await axios.get(`/students?page=${page}&pageSize=${pageSize}&search=` + searchKey);
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
        })
      });
      setTotal(result.data.totalResults);
      setTotalPage(result.data.totalPages);
      setStudents(tableData);
    } catch (error) {
      console.log(error.response);
    }
  }
  useEffect(() => {
    getStudentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    },{
      title: 'State',
      dataIndex: 'state',
      render: state => (state? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>)
    },{
      title: 'Verification',
      dataIndex: 'verification',
      render: verification => (verification? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>)
    }
  ];

  return (
    <div className={styles.studentsLayout}>
      <Table 
         columns={columns}
         dataSource={students}
         pagination={false}
      />
      <Pagination defaultCurrent={page} total={total} pageSize={pageSize} />
    </div>
  )
}
