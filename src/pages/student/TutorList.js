import React, { useState } from 'react';
import { List, Tabs } from 'antd';
import { RiseOutlined, LikeOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './TutorList.module.css';
import TutorCard from './TutorCard';
import TutorDetailModal from './TutorDetailModal';
import TutorReviewModal from './TutorReviewModal';
const { TabPane } = Tabs;

export default function TutorList({ startCall, onlineTutors, setTutor }) {

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const callWithVideo = (video, user) => {
    setTutor(user.profile);
    const config = { audio: true, video };
    startCall(true, user.username, config);
  };

  const openDetailModal = (tutor) => {
    setSelected(tutor);
    setShowDetailModal(true);
  }

  const openReviewlModal = (tutor) => {
    setSelected(tutor);
    setShowReviewModal(true);
  }

  return (
    <div className={styles.tutorList}>
      <TutorDetailModal
        selected={selected}
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
      />
      <TutorReviewModal
        selected={selected}
        showReviewModal={showReviewModal}
        setShowReviewModal={setShowReviewModal}
      />
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
                <TutorCard
                  item={item}
                  callWithVideo={callWithVideo}
                  openDetailModal={openDetailModal}
                  openReviewlModal={openReviewlModal}
                />
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
