import React, { useState } from 'react';
import { List, Card, Tabs, Avatar, Tooltip, Tag, Rate, Modal, Descriptions } from 'antd';
import { VideoCameraFilled, AudioFilled, RiseOutlined, LikeOutlined, TeamOutlined, UserOutlined, CheckCircleFilled, MinusCircleFilled, FileDoneOutlined } from '@ant-design/icons';
import styles from './TutorList.module.css';
import { serverUrl, STATUS } from '../../lib/constants';
import VideoPlayer from '../admin/VideoPlayer';
const { TabPane } = Tabs;

export default function TutorList({ startCall, onlineTutors }) {

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const callWithVideo = (video, username) => {
    const config = { audio: true, video };
    return () => startCall(true, username, config);
  };

  const openModal = (tutor) => {
    setSelected(tutor);
    console.log(tutor)
    setShowDetailModal(true);
  }

  const tutorProfile = (
    <div>
      <div>
        {selected ? (
          <div>
            <div className={styles.detailWrapper}>
              {selected.profile.video ? <div className={styles.videoWrapper}><VideoPlayer username={selected.username} /></div> : null}
              {selected.profile.introduction}
            </div>
            <div className={styles.detailWrapper}>
              <Descriptions bordered size="small" column={1} title="Teaching preferences">
                <Descriptions.Item label="Student level">{selected.profile.student_lvl}</Descriptions.Item>
                <Descriptions.Item label="Student type">{selected.profile.student_type}</Descriptions.Item>
                <Descriptions.Item label="Accent">{selected.profile.accent}</Descriptions.Item>
                <Descriptions.Item label="Fluency">{selected.profile.fluency}</Descriptions.Item>
                <Descriptions.Item label="Tutor styles"> {selected.profile.teaching_styles ? JSON.parse(selected.profile.teaching_styles).map(style => { return <Tag key={style}>{style}</Tag> }) : null}</Descriptions.Item>
                <Descriptions.Item label="Specialities">{selected.profile.specialities ? JSON.parse(selected.profile.specialities).map(speciality => { return <Tag key={speciality}>{speciality}</Tag> }) : null}</Descriptions.Item>
              </Descriptions>
            </div>
            <div className={styles.detailWrapper}>
              <Descriptions bordered size="small" column={1} title="CV">
                <Descriptions.Item label="Interests">{selected.profile.interests}</Descriptions.Item>
                <Descriptions.Item label="Education">{selected.profile.education}</Descriptions.Item>
                <Descriptions.Item label="Experience">{selected.profile.experience}</Descriptions.Item>
                <Descriptions.Item label="Profession">{selected.profile.profession}</Descriptions.Item>
                <Descriptions.Item label="Reason">{selected.profile.reason}</Descriptions.Item>
              </Descriptions>
            </div>
            <div className={styles.detailWrapper}>
              <p className={styles.detailTitle}>Certificates</p>
              <div className={styles.uploadedCert}>
                {selected.profile.certificates ? (
                  JSON.parse(selected.profile.certificates).map((cert, index) => {
                    return (<a key={index} href={serverUrl + cert.path}><FileDoneOutlined />{cert.originalname}</a>);
                  })
                ) : null}
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  )


  return (
    <div className={styles.tutorList}>
      <Modal
        title={selected ? selected.profile.name : null}
        visible={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width="600px"
        destroyOnClose
        bodyStyle={{ height: "600px", overflow: "auto" }}
      >
        {tutorProfile}
      </Modal>
      <Tabs
        defaultActiveKey="online"
        type="card"
      >
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Online
            </span>
          }
          key="online"
          className={styles.tabPane}
        >
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={onlineTutors}
            renderItem={item => (
              <List.Item>
                <Card
                  actions={[
                    <Tooltip title="Video call"><VideoCameraFilled onClick={callWithVideo(true, item.username)} /></Tooltip>,
                    <Tooltip title="Audio call"><AudioFilled onClick={callWithVideo(false, item.username)} /></Tooltip>,
                    <Tooltip title="Profile"><UserOutlined onClick={() => openModal(item)} /></Tooltip>
                  ]}
                >
                  <div className={styles.tutorCard}>
                    <div className={styles.tutorInfo}>
                      <div>
                        {item.profile.avatar ?
                          <Avatar src={serverUrl + item.profile.avatar} size={80} />
                          : <Avatar icon={<UserOutlined />} size={80} />
                        }
                      </div>

                      <div className={styles.tutorInfoDetail}>
                        <div className={styles.tutorName}>
                          {item.profile.name}
                          {item.status === STATUS.AVAILABLE ?
                            <CheckCircleFilled style={{ color: "#52c41a", fontSize: "12px", marginLeft: "3px" }} /> :
                            <Tooltip title="User is busy"><MinusCircleFilled style={{ color: "red", fontSize: "12px", marginLeft: "3px" }} /></Tooltip>
                          }
                        </div>

                        <div>
                          {(item.profile.certificates && JSON.parse(item.profile.certificates.length) > 0) ?
                            <Tag>Teaching certificates</Tag> :
                            null}
                        </div>
                        <div>
                          <Rate disabled defaultValue={5} />
                        </div>
                      </div>
                    </div>
                    <p>
                      {item.profile.introduction}
                    </p>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <LikeOutlined />
              Favorite
            </span>
          }
          key="favorite"
        >
          Favorite
      </TabPane>
        <TabPane
          tab={
            <span>
              <RiseOutlined />
              Recommend
            </span>
          }
          key="recommend"
        >
          Recommend
      </TabPane>
      </Tabs>
    </div>
  )
}
