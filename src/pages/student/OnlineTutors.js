import React from 'react';
import { List, Card } from 'antd';
import { VideoCameraFilled, AudioFilled } from '@ant-design/icons';

export default function OnlineTutors({ startCall, onlineTutors }) {

  const callWithVideo = (video, username) => {
    const config = { audio: true, video };
    return () => startCall(true, username, config);
  };

  return (
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

  )
}
