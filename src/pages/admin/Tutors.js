import React, { useState, useEffect } from 'react';
import axios from '../../lib/utils/axiosConfig';
import { Table, Tag, Pagination, Input, Spin, Modal, Avatar, Tabs, Button, Alert, Descriptions } from 'antd';
import styles from './Tutors.module.css';
import { serverUrl } from '../../lib/constants';
import { UserOutlined, FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';
import { STATES, PROFILE_STATUS } from '../../lib/constants';
import VideoPlayer from './VideoPlayer';
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
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);

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
      console.log(result.data.tutor);

      setLoadingDetail(false);

    } catch (error) {
      setLoadingDetail(false);
    }
  };
  const updateProfileStatus = async (status) => {
    try {
      setUpdateStatusLoading(true);
      await axios.put('/tutors/' + selected.id, { profileStatus: status });
      await getTutorsData();
      setUpdateStatusLoading(false);
      setShowDetailModal(false);
    } catch (error) {
      setUpdateStatusLoading(false);
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
    },
    {
      title: 'State',
      dataIndex: 'state',
      render: state => (state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>)
    },
    {
      title: 'Verification',
      dataIndex: 'verification',
      render: verification => (verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>)
    },
    {
      title: 'Profile status',
      dataIndex: 'profileStatus',
      render: profileStatus => {
        if (profileStatus === PROFILE_STATUS.ACCEPTED) {
          return <Tag color="success">Accepted</Tag>
        }
        else if (profileStatus === PROFILE_STATUS.PENDING) {
          return <Tag color="blue">Pending</Tag>
        }
        else {
          return <Tag color="error">Rejected</Tag>
        }
      }
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

  const updateStateUser = async (state) => {
    try {
      setStateLoading(true);
      await axios.put('/accounts/' + selected.accountId, { state: state });
      await getTutorsData();
      setStateLoading(false);
      setShowDetailModal(false);
    } catch (error) {
      setStateLoading(false);
      console.log(error.response);
    }
  };

  let statusControl = (
    <div className={styles.statusControl}>
      <Alert showIcon message="Rejected" type="error" />
      <div className={styles.statusControlBtnWrapper}>
        <Button
          type="primary"
          style={{ backgroundColor: "#52c41a", color: "white", borderColor: "#52c41a" }}
          className={styles.statusControlBtn}
          onClick={() => updateProfileStatus(PROFILE_STATUS.ACCEPTED)}
        >Accept</Button>
        <Button className={styles.statusControlBtn} onClick={() => updateProfileStatus(PROFILE_STATUS.PENDING)}>Pending</Button>
      </div>
    </div>
  )
  if (selected && selected.profileStatus === PROFILE_STATUS.ACCEPTED) {
    statusControl = (
      <div className={styles.statusControl}>
        <Alert showIcon message="Accept" type="success" />
        <div className={styles.statusControlBtnWrapper}>
          <Button className={styles.statusControlBtn} onClick={() => updateProfileStatus(PROFILE_STATUS.PENDING)}>Pending</Button>
          <Button
            type="primary"
            danger
            className={styles.statusControlBtn}
            onClick={() => updateProfileStatus(PROFILE_STATUS.REJECTED)}
          >Reject</Button>
        </div>
      </div>
    )
  }
  if (selected && selected.profileStatus === PROFILE_STATUS.PENDING) {
    statusControl = (
      <div className={styles.statusControl}>
        <Alert showIcon message="Pending" type="info" />
        <div className={styles.statusControlBtnWrapper}>
          <Button
            className={styles.statusControlBtn}
            style={{ backgroundColor: "#52c41a", color: "white", borderColor: "#52c41a" }}
            onClick={() => updateProfileStatus(PROFILE_STATUS.ACCEPTED)}
          >Accept</Button>
          <Button
            type="primary"
            danger
            className={styles.statusControlBtn}
            onClick={() => updateProfileStatus(PROFILE_STATUS.REJECTED)}
          >Reject</Button>
        </div>
      </div>
    )
  }


  const tutorProfile = (
    <div>
      <Spin spinning={updateStatusLoading}>
        {statusControl}
        <div>
          {detail ? (
            <div>
              <div className={styles.detailWrapper}>
                <Descriptions bordered size="small" column={1} title="Teaching preferences">
                  <Descriptions.Item label="Student level">{detail.student_lvl}</Descriptions.Item>
                  <Descriptions.Item label="Student type">{detail.student_type}</Descriptions.Item>
                  <Descriptions.Item label="Accent">{detail.accent}</Descriptions.Item>
                  <Descriptions.Item label="Fluency">{detail.fluency}</Descriptions.Item>
                  <Descriptions.Item label="Tutor styles"> {detail.teaching_styles ? JSON.parse(detail.teaching_styles).map(style => { return <Tag key={style}>{style}</Tag> }) : null}</Descriptions.Item>
                  <Descriptions.Item label="Specialities">{detail.specialities ? JSON.parse(detail.specialities).map(speciality => { return <Tag key={speciality}>{speciality}</Tag> }) : null}</Descriptions.Item>
                </Descriptions>
              </div>
              <div className={styles.detailWrapper}>
                <Descriptions bordered size="small" column={1} title="CV">
                  <Descriptions.Item label="Interests">{detail.interests}</Descriptions.Item>
                  <Descriptions.Item label="Education">{detail.education}</Descriptions.Item>
                  <Descriptions.Item label="Experience">{detail.experience}</Descriptions.Item>
                  <Descriptions.Item label="Profession">{detail.profession}</Descriptions.Item>
                  <Descriptions.Item label="Reason">{detail.reason}</Descriptions.Item>
                </Descriptions>
              </div>
              <div className={styles.detailWrapper}>
                <p className={styles.detailTitle}>Certificates</p>
                <div className={styles.uploadedCert}>
                  {detail.certificates ? (
                    JSON.parse(detail.certificates).map((cert, index) => {
                      return (<a key={index} href={serverUrl + cert.path}><FileDoneOutlined />{cert.originalname}</a>);
                    })
                  ) : null}
                </div>
              </div>
              <div className={styles.detailWrapper}> 
                <Descriptions bordered size="small" column={1} title="Introduction">
                  <Descriptions.Item label="Introduction">{detail.introduction}</Descriptions.Item>
                </Descriptions>
                {detail.video ? <div className={styles.videoWrapper}><VideoPlayer username={selected.username}/></div> : null}
              </div>
            </div>
          ) : null}
        </div>

      </Spin>
    </div>
  )

  //detail modal
  const renderDetail = detail ?
    (<Tabs defaultActiveKey="info" type="card">
      <TabPane tab="Info" key="info">
        <div className={styles.detail}>
          <div className={styles.detailBasic}>
            {detail.avatar ? <Avatar src={serverUrl + detail.avatar} size={100} />
              : <Avatar icon={<UserOutlined />} size={100} />}
            <div className={styles.detailBasicInfo}>
              <Descriptions size="small" column={1} title={detail.name} bordered>
                <Descriptions.Item label="Username">{selected.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
                <Descriptions.Item label="Phone">{detail.phone}</Descriptions.Item>
                <Descriptions.Item label="Address">{detail.address}</Descriptions.Item>
                <Descriptions.Item label="Birthdate">{detail.birthdate ? moment(detail.birthdate).format('YYYY-MM-DD') : null}</Descriptions.Item>
                <Descriptions.Item label="Status"> 
                  {selected.verification ? <Tag color="success">Verified</Tag> : <Tag color="default">Unverified</Tag>}
                  {selected.state ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
          <div className={styles.banBtnHolder}>
            {selected.state ?
              <Button loading={stateLoading} className={styles.changeStateBtn} type="primary" danger onClick={() => updateStateUser(STATES.INACTIVE)}>Ban</Button> :
              <Button loading={stateLoading} className={styles.changeStateBtn} type="primary" onClick={() => updateStateUser(STATES.ACTIVE)}>Unban</Button>}
          </div>
        </div>
      </TabPane>
      <TabPane tab="Profile" key="profile">
        {tutorProfile}
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
        bodyStyle={{height: "400px", overflow: "auto"}}
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
