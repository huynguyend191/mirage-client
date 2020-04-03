import React from 'react'
import { useBeforeunload } from 'react-beforeunload';
import { Button, Avatar } from 'antd';
import { VideoCameraFilled, AudioFilled, StopOutlined, UserOutlined } from '@ant-design/icons';
import styles from './CallModal.module.css';
import { serverUrl } from '../lib/constants';

export default function CallModal({ callModal, callFrom, startCall, rejectCall }) {
  useBeforeunload((e) => {
    // e.preventDefault();
    rejectCall();
  });
  const acceptWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom.username, config);
  };
  return (
    callModal ?
      (
        <div className={styles.callModalWrapper}>
        <div className={styles.callModal}>
          <div className={styles.caller}>
            {(callFrom.student && callFrom.student.avatar) ?
              <Avatar src={serverUrl + callFrom.student.avatar} size={50} />
              : <Avatar icon={<UserOutlined />} size={50} />}
            {(callFrom.student) && (
              <span className={styles.callerTxt}>{`${callFrom.student.name} is calling...`}</span>
            )}
          </div>

          <div className={styles.controlBtns}>
            <Button
              shape="round"
              type="primary"
              icon={<VideoCameraFilled />}
              onClick={acceptWithVideo(true)}
              size="large"
            >
              Video call
        </Button>
            <Button
              shape="round"
              type="primary"
              icon={<AudioFilled />}
              onClick={acceptWithVideo(false)}
              size="large"
            >
              Audio call
        </Button>
            <Button
              shape="round"
              type="danger"
              onClick={rejectCall}
              icon={<StopOutlined />}
              size="large"
            >
              Reject call
        </Button>
          </div>
        </div>
        </div>
      ) : null
  )
}
