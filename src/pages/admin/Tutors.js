import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table, Tag, Pagination, Input, Spin, Modal, Avatar, Tabs, Button } from 'antd';
import styles from './Tutors.module.css';
import { serverUrl } from '../../lib/constants';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { STATES } from '../../lib/constants';
const { Search } = Input;
const { TabPane } = Tabs;

export default function Tutors() {
  const [pageSize, setPageSize] = useState(10);
  const [tutors, setTutors] = useState([]);
  const [page, setPage] = useState(1);
  const [searchKey, setSearchKey] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);

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
          accountId: tutor.account.id
        })
      });
      setTotal(result.data.totalResults);
      setTutors(tableData);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  };
  const getTutorDetail = async () => {
    try {
      setLoadingDetail(true);
      const result = await axios.get('/tutors/' + selected.id);
      setDetail(result.data.tutor);
      setLoadingDetail(false);

    } catch (error) {
      setLoadingDetail(false);
    }
  };
  useEffect(() => {
    getTutorsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, searchKey]);

  useEffect(() => {
    if (selected) {
      getTutorDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

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
    }, {
      title: 'State',
      dataIndex: 'state',
      render: state => (state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>)
    }, {
      title: 'Verification',
      dataIndex: 'verification',
      render: verification => (verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>)
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
    }
  };

  const searchUser = (value) => {
    setSearchKey(value);
  };

  const banUser = async () => {
    try {
      setStateLoading(true);
      await axios.put('/accounts/' + selected.accountId, {state: STATES.INACTIVE});
      await getTutorsData();
      setStateLoading(false);
      setShowDetailModal(false);
    } catch (error) {
      setStateLoading(false);
      console.log(error.response);
    }
  };

  const unbanUser = async () => {
    try {
      setStateLoading(true);
      await axios.put('/accounts/' + selected.accountId, {state: STATES.ACTIVE});
      await getTutorsData();
      setStateLoading(false);
      setShowDetailModal(false);
    } catch (error) {
      setStateLoading(false);
      console.log(error.response);
    }
  };

  const renderDetail = detail ?
  ( <Tabs defaultActiveKey="profile" type="card">
      <TabPane tab="Profile" key="profile">
      <div className={styles.detail}>
        <div className={styles.detailBasic}>
          {detail.avatar ? <Avatar src={serverUrl + detail.avatar} size={100} />
            : <Avatar icon={<UserOutlined />} size={100} />}
          <div className={styles.detailBasicInfo}>
            <p className={styles.detailName}>{detail.name}</p>
            <p>Username: {selected.username}</p>
            <p>Email: {selected.email}</p>
            {selected.verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>}
            {selected.state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>}
          </div>
        </div>
        <div className={styles.banBtnHolder}>
          {selected.state ? 
            <Button loading={stateLoading} style={{width: '200px'}} block type="primary" danger onClick={banUser}>Ban</Button> : 
            <Button loading={stateLoading} style={{width: '200px'}} block type="primary" onClick={unbanUser}>Unban</Button>}
        </div>
        <div className={styles.detailAdditional}>
          <div className={styles.detailAdditionalRow}>Phone: {detail.phone}</div>
          <div className={styles.detailAdditionalRow}>Birthdate: {detail.birthdate? moment(detail.birthdate).format('YYYY-MM-DD') : null}</div>
          <div className={styles.detailAdditionalRow}>Student level: {detail.student_lvl}</div>
          <div className={styles.detailAdditionalRow}>Student type: {detail.student_type}</div>
          <div className={styles.detailAdditionalRow}>Favorite accent: {detail.accent}</div>
          <div className={styles.detailAdditionalRow}>Favorite tutor styles: {detail.teaching_styles ? JSON.parse(detail.teaching_styles).map(style => {return <Tag key={style}>{style}</Tag>}) : null}</div>
          <div className={styles.detailAdditionalRow}>Interests: {detail.specialities ? JSON.parse(detail.specialities).map(speciality => {return <Tag key={speciality}>{speciality}</Tag>}) : null}</div>
        </div>
      </div>
      </TabPane>
      <TabPane tab="History" key="history">
        Call history
      </TabPane>
      <TabPane tab="Report" key="report">
        Report
      </TabPane>
      <TabPane tab="Payment" key="payment">
        Payment
      </TabPane>
    </Tabs>
  
  )
  : null;

  return (
    <div className={styles.tutorsLayout}>
      <Modal
        title={selected ? selected.name : null}
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width="600px"
        destroyOnClose
      >
        <Spin spinning={loadingDetail}>
          {renderDetail}
        </Spin>
      </Modal>
      <div className={styles.searchBar}>
        <Search placeholder="Search for username, name or email" onSearch={searchUser} enterButton />
      </div>
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={tutors}
          pagination={false}
          onRow={onSelectRow}
        />
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
  )
}
