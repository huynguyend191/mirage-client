import React, { useState, useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Button } from 'antd';
import { VideoCameraFilled, AudioFilled, StopOutlined, AudioMutedOutlined, VideoCameraAddOutlined } from '@ant-design/icons';
import styles from './CallWindow.module.css';
import Timer from 'react-compound-timer';

export default function CallWindow({ peerSrc, localSrc, config, mediaDevice, endCall }) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  useBeforeunload((e) => {
    e.preventDefault();
    endCall(true)
  });


  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  }, [localSrc, peerSrc]);

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle('Video', video);
      mediaDevice.toggle('Audio', audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === 'video') {
      setVideo(!video);
      mediaDevice.toggle('Video');
    }
    if (deviceType === 'audio') {
      setAudio(!audio);
      mediaDevice.toggle('Audio');
    }
  };
  return (
    <div className={styles.callWindowWrapper}>
      <div className={styles.callWindow}>
        <div className={styles.videoScreenContainer}>
          <video className={styles.videoScreen} ref={localVideo} autoPlay muted />
          {peerSrc && <video className={styles.videoScreen} ref={peerVideo} autoPlay />}
        </div>
        {peerSrc && (
          <Timer 
            formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`}
            lastUnit="h"
          >
            <Timer.Hours />:
            <Timer.Minutes />:
            <Timer.Seconds />
          </Timer>
        )}
        <div className={styles.videoControl}>
          <Button
            shape="circle"
            type={video ? "primary" : "danger"}
            icon={video ? <VideoCameraFilled /> : <VideoCameraAddOutlined />}
            onClick={() => toggleMediaDevice('video')}
            size="large"
          />
          <Button
            shape="circle"
            type={audio ? "primary" : "danger"}
            icon={audio ? <AudioFilled /> : <AudioMutedOutlined />}
            onClick={() => toggleMediaDevice('audio')}
            size="large"
          />
          <Button
            shape="circle"
            type="danger"
            onClick={() => endCall(true)}
            icon={<StopOutlined />}
            size="large"
          />
        </div>
      </div>
    </div>
  )
}
