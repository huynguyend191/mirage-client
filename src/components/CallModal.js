import React from 'react'
import { useBeforeunload } from 'react-beforeunload';
import { Button } from 'antd';
import { VideoCameraFilled, AudioFilled, PhoneFilled } from '@ant-design/icons';
import styles from './CallModal.module.css';

export default function CallModal({callModal, callFrom, startCall, rejectCall }) {
  useBeforeunload((e) => {
    // e.preventDefault();
    rejectCall();
  });
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };
  return (
    callModal ? 
   ( <div>
      <p>
        <span>{`${callFrom} is calling`}</span>
      </p>
      <Button
        shape="circle"
        type="primary"
        icon={<VideoCameraFilled />}
        onClick={acceptWithVideo(true)}
        size="large"
      />
      <Button
        shape="circle"
        type="primary"
        icon={<AudioFilled />}
        onClick={acceptWithVideo(false)}
        size="large"
      />
      <Button
        shape="circle"
        type="danger"
        onClick={rejectCall}
        icon={<PhoneFilled />}
        size="large"
      />
    </div>) : null
  )
}
