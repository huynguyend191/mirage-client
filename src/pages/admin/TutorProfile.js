import React, { useEffect, useState } from 'react';
import styles from './TutorProfile.module.css';
import { Tag, Spin, Modal, Avatar, Tabs, Button, Alert, Descriptions } from 'antd';
import { serverUrl } from '../../lib/constants';
import { UserOutlined, FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';
import { STATES, PROFILE_STATUS } from '../../lib/constants';
import VideoPlayer from './VideoPlayer';
import axios from '../../lib/utils/axiosConfig';
import CallHistories from './CallHistories';

const { TabPane } = Tabs;

export default function TutorProfile({ selected, setShowDetailModal, getTutorsData, showDetailModal  }) {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);


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

  useEffect(() => {
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
    if (selected) {
      getTutorDetail();
    }
  }, [selected]);

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
        <Alert showIcon message="Accepted" type="success" />
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
                {detail.video ? <div className={styles.videoWrapper}><VideoPlayer username={selected.username} /></div> : null}
              </div>
            </div>
          ) : null}
        </div>

      </Spin>
    </div>
  )

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
        <CallHistories callHistories={detail.call_histories} />
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
    <Modal
      title={selected ? selected.name : null}
      visible={showDetailModal}
      onCancel={() => setShowDetailModal(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: "400px", overflow: "auto" }}
    >
      <Spin spinning={loadingDetail}>
        {renderDetail}
      </Spin>
    </Modal>
  )
}
