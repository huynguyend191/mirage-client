import React from 'react';
import { List, Card, Tabs } from 'antd';
import { VideoCameraFilled, AudioFilled, StarOutlined, LikeOutlined, TeamOutlined } from '@ant-design/icons';
import styles from './TutorList.module.css';
const { TabPane } = Tabs;

export default function TutorList({ startCall, onlineTutors }) {

  const callWithVideo = (video, username) => {
    const config = { audio: true, video };
    return () => startCall(true, username, config);
  };

  return (
    <div className={styles.tutorList}>
      <Tabs
        defaultActiveKey="online"
        size="large"
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
        >
          <List
            dataSource={onlineTutors}
            renderItem={item => (
              <List.Item>
                <Card
                  title={item.profile.name}
                  actions={[
                    <VideoCameraFilled onClick={callWithVideo(true, item.username)} />,
                    <AudioFilled onClick={callWithVideo(false, item.username)} />
                  ]}
                >
                </Card>
              </List.Item>
            )}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <StarOutlined /> 
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
              <LikeOutlined />
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
