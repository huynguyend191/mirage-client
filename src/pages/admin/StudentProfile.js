import React, { useState, useEffect } from 'react';
import styles from './StudentProfile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { Tag, Spin, Modal, Avatar, Tabs, Button, Descriptions } from 'antd';
import { serverUrl } from '../../lib/constants';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { STATES } from '../../lib/constants';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import StudentSub from './StudentSub';
import CallHistories from './CallHistories';
const { TabPane } = Tabs;

export default function StudentProfile({ selected, getStudentsData, setShowDetailModal, showDetailModal }) {
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detail, setDetail] = useState(null);
  const [stateLoading, setStateLoading] = useState(false);

  const updateStateUser = async (state) => {
    try {
      setStateLoading(true);
      await axios.put('/accounts/' + selected.accountId, { state: state });
      await getStudentsData();
      setStateLoading(false);
      setShowDetailModal(false);
    } catch (error) {
      setStateLoading(false);
      console.log(error.response);
    }
  };

  useEffect(() => {
    const getStudentDetail = async () => {
      try {
        setLoadingDetail(true);
        const result = await axios.get('/students/' + selected.id);
        setDetail(result.data.student);
        setLoadingDetail(false);
      } catch (error) {
        setLoadingDetail(false);
      }
    };
    if (selected) {
      getStudentDetail();
    }
  }, [selected]);

  

  const renderDetail = detail ?
    (<Tabs defaultActiveKey="profile" type="card">
      <TabPane tab="Profile" key="profile">
        <div className={styles.detail}>
          <div className={styles.detailBasic}>
            {detail.avatar ? <Avatar src={serverUrl + detail.avatar} size={100} />
              : <Avatar icon={<UserOutlined />} size={100} />}
            <div className={styles.detailBasicInfo}>
              <Descriptions size="small" column={1} title={detail.name} bordered>
                <Descriptions.Item label="Username">{selected.username}</Descriptions.Item>
                <Descriptions.Item label="Email">{selected.email}</Descriptions.Item>
                <Descriptions.Item label="Birthdate">{detail.birthdate ? moment(detail.birthdate).format('YYYY-MM-DD') : null}</Descriptions.Item>
                <Descriptions.Item label="Remaining time">{getTimeFromMs(detail.remaining_time)}</Descriptions.Item>
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
          <div className={styles.detailAdditional}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="Phone">{detail.phone}</Descriptions.Item>
              <Descriptions.Item label="Birthdate">{detail.birthdate ? moment(detail.birthdate).format('YYYY-MM-DD') : null}</Descriptions.Item>
              <Descriptions.Item label="Student level">{detail.student_lvl}</Descriptions.Item>
              <Descriptions.Item label="Student type">{detail.student_type}</Descriptions.Item>
              <Descriptions.Item label="Favorite accent">{detail.accent}</Descriptions.Item>
              <Descriptions.Item label="Favorite tutor styles"> {detail.teaching_styles ? JSON.parse(detail.teaching_styles).map(style => { return <Tag key={style}>{style}</Tag> }) : null}</Descriptions.Item>
              <Descriptions.Item label="Interests">{detail.specialities ? JSON.parse(detail.specialities).map(speciality => { return <Tag key={speciality}>{speciality}</Tag> }) : null}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </TabPane>
      <TabPane tab="History" key="history">
        <CallHistories callHistories={detail.call_histories} />
      </TabPane>
      <TabPane tab="Report" key="report">
        Report
      </TabPane>
      <TabPane tab="Subscription" key="subscription">
       <StudentSub subscriptions={detail.subscriptions} />
      </TabPane>
    </Tabs>

    )
    : null

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
