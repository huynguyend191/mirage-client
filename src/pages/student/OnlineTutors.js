import React from 'react';
import { Button, List, Card } from 'antd';
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
            <Button
            shape="circle"
            type="primary"
            icon={<VideoCameraFilled />}
            onClick={callWithVideo(true, item.username)}
            size="large"
            />,
            <Button
            shape="circle"
            type="primary"
            icon={<AudioFilled />}
            onClick={callWithVideo(false, item.username)}
            size="large"
          />
          ]}
        >

        </Card>
        </List.Item>
      )}
    />
    
  )
}
