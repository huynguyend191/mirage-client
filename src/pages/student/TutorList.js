import React, { useState, useEffect, useContext } from 'react';
import { List, Tabs, Input } from 'antd';
import { RiseOutlined, LikeOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './TutorList.module.css';
import TutorCard from './TutorCard';
import TutorDetailModal from './TutorDetailModal';
import TutorReviewModal from './TutorReviewModal';
import { getTimeFromMs } from '../../lib/utils/formatTime';
import { STATUS, PREFERENCE_TYPES } from '../../lib/constants';
import { AccountContext } from '../../context/AccountContext';
import axios from '../../lib/utils/axiosConfig';
const { TabPane } = Tabs;
const { Search } = Input;

export default function TutorList({ startCall, onlineTutors, setTutor, remainingTime }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [preferences, setPreferences] = useState([]);
  const { account } = useContext(AccountContext);
  const [favorites, setFavorites] = useState([]);
  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    let valid = false;
    const filterTutorsByKeyword = tutors => {
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
    };
    setTutors(filterTutorsByKeyword(onlineTutors));
  }, [onlineTutors, keyword]);

  useEffect(() => {
    getPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const favoriteTutors = [];
    preferences.forEach(pre => {
      if (pre.type === PREFERENCE_TYPES.FAVORITE) {
        const favTutor = {
          preId: pre.id,
          profile: pre.tutor,
          status: STATUS.OFFLINE,
          username: pre.tutor.account.username,
          isFav: true
        };
        onlineTutors.forEach(tutor => {
          if (tutor.profile.id === pre.tutorId) {
            favTutor.status = tutor.status;
          }
        });
        favoriteTutors.push(favTutor);
      }
    });
    setFavorites(favoriteTutors);
  }, [onlineTutors, preferences]);

  useEffect(() => {
    const recommendTutors = [];
    preferences.forEach(pre => {
      if (pre.type === PREFERENCE_TYPES.RECOMMEND) {
        const recTutor = {
          profile: pre.tutor,
          status: STATUS.OFFLINE,
          username: pre.tutor.account.username
        };
        onlineTutors.forEach(tutor => {
          if (tutor.profile.id === pre.tutorId) {
            recTutor.status = tutor.status;
          }
        });
        recommendTutors.push(recTutor);
      }
    });
    setRecommend(recommendTutors);
  }, [onlineTutors, preferences]);

  const getPreferences = async () => {
    try {
      const result = await axios.get('/preferences?studentId=' + account.student.id);
      setPreferences(result.data.preferences);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const callWithVideo = (video, user) => {
    if (user.status === STATUS.AVAILABLE) {
      setTutor(user.profile);
      const config = { audio: true, video };
      startCall(true, user.username, config);
    } else {
      alert('This tutor is not available at the moment!');
    }
  };

  const openDetailModal = tutor => {
    setSelected(tutor);
    setShowDetailModal(true);
  };

  const openReviewlModal = tutor => {
    setSelected(tutor);
    setShowReviewModal(true);
  };

  const searchTutors = value => {
    setKeyword(value.toLowerCase());
  };

  return (
    <div className={styles.tutorList}>
      <TutorDetailModal selected={selected} showDetailModal={showDetailModal} setShowDetailModal={setShowDetailModal} />
      <TutorReviewModal selected={selected} showReviewModal={showReviewModal} setShowReviewModal={setShowReviewModal} />
      <div className={styles.searchTool}>
        <div>
          <span className={styles.remainingTimeTitle}>Remaining time: </span>
          {getTimeFromMs(remainingTime)}
        </div>
        <div className={styles.searchBar}>
          <Search placeholder="Search name, interests, subjects, ... " enterButton onSearch={searchTutors} />
        </div>
      </div>
      <Tabs defaultActiveKey="online" type="card">
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
          className={styles.tabPane}
        >
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={favorites}
            renderItem={item => (
              <List.Item>
                <TutorCard
                  item={item}
                  callWithVideo={callWithVideo}
                  openDetailModal={openDetailModal}
                  openReviewlModal={openReviewlModal}
                  getPreferences={getPreferences}
                />
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RiseOutlined />
              Recommend
            </span>
          }
          key="recommend"
          className={styles.tabPane}
        >
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={recommend}
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
      </Tabs>
    </div>
  );
}
