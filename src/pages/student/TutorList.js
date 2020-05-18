import React, { useState, useEffect } from 'react';
import { List, Tabs, Input } from 'antd';
import { RiseOutlined, LikeOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './TutorList.module.css';
import TutorCard from './TutorCard';
import TutorDetailModal from './TutorDetailModal';
import TutorReviewModal from './TutorReviewModal';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import { STATUS } from '../../lib/constants';
const { TabPane } = Tabs;
const { Search } = Input;

export default function TutorList({ startCall, onlineTutors, setTutor, remainingTime }) {

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    let valid = false;
    const filterTutorsByKeyword = (tutors) => {
      if (keyword !== '') {
        const filteredTutors = [];
        tutors.forEach(tutor => {
          valid = false;
          if (tutor.profile.name.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.specialities.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.teaching_styles.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.accent.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.student_lvl.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.student_type.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.interests.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (tutor.profile.fluency.toLowerCase().includes(keyword)) {
            valid = true;
          }
          if (valid) {
            filteredTutors.push(tutor);
          }
        });
        return filteredTutors;
      } else {
        return tutors;
      }
    }
    setTutors(filterTutorsByKeyword(onlineTutors));
  }, [onlineTutors, keyword]);

  const callWithVideo = (video, user) => {
    if (user.status !== STATUS.BUSY) {
      setTutor(user.profile);
      const config = { audio: true, video };
      startCall(true, user.username, config);
    } else {
      alert('This tutor is not available at the moment!')
    }
   
  };

  const openDetailModal = (tutor) => {
    setSelected(tutor);
    setShowDetailModal(true);
  }

  const openReviewlModal = (tutor) => {
    setSelected(tutor);
    setShowReviewModal(true);
  }

  const searchTutors = (value) => {
    setKeyword(value.toLowerCase());
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
      <div className={styles.searchTool}>
        <div><span className={styles.remainingTimeTitle}>Remaining time: </span>{getTimeFromMs(remainingTime)}</div>
        <div className={styles.searchBar}>
          <Search placeholder="Search name, interests, subjects, ... " enterButton onSearch={searchTutors} />
        </div>
      </div>
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
            dataSource={tutors}
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
