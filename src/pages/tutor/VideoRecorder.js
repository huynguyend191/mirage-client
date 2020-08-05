import React, { useEffect, useRef, useState, useContext } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import 'videojs-record/dist/videojs.record.js';
import { Button } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import styles from './VideoRecorder.module.css';

const videoJsOptions = {
  controls: true,
  width: 480,
  height: 360,
  fluid: false,
  plugins: {
    record: {
      audio: true,
      video: true,
      maxLength: 120,
      debug: true
    }
  }
};

export default function VideoRecorder({ cancelRecord, existedVideo, refreshProfile }) {
  const player = useRef(null);
  const videoNode = useRef(null);
  const [recorded, setRecorded] = useState(null);
  const [loading, setLoading] = useState(false);
  const { account } = useContext(AccountContext);
  const uploadVideo = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('video', recorded, 'introVideo.webm');
      await axios('/tutors/video/' + account.username, {
        data: formData,
        method: 'POST'
      });
      cancelRecord();
      refreshProfile();
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    player.current = videojs(videoNode.current, videoJsOptions, () => {
      const version_info =
        'Using video.js ' +
        videojs.VERSION +
        ' with videojs-record ' +
        videojs.getPluginVersion('record') +
        ' and recordrtc ' +
        RecordRTC.version;
      videojs.log(version_info);
    });
    player.current.on('deviceReady', () => {
      console.log('device is ready!');
    });
    player.current.on('startRecord', () => {
      console.log('started recording!');
    });

    // user completed recording and stream is available
    player.current.on('finishRecord', () => {
      // recordedData is a blob object containing the recorded data that
      // can be downloaded by the user, stored on server etc.
      setRecorded(player.current.recordedData);
    });

    // error handling
    player.current.on('error', (element, error) => {
      console.warn(error);
    });

    player.current.on('deviceError', () => {
      console.error('device error:', player.current.deviceErrorCode);
    });
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, []);
  return (
    <div>
      <div data-vjs-player>
        <video
          id="myVideoRecord"
          ref={node => (videoNode.current = node)}
          className="video-js vjs-default-skin"
          playsInline
        ></video>
      </div>
      {existedVideo ? (
        <div className={styles.btnWrapper}>
          <Button className={styles.videoBtn} onClick={uploadVideo} loading={loading} disabled={recorded === null}>
            Upload
          </Button>
          <Button className={styles.videoBtn} type="danger" onClick={cancelRecord}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className={styles.btnWrapperNoCancel}>
          <Button className={styles.videoBtn} onClick={uploadVideo} loading={loading} disabled={recorded === null}>
            Upload
          </Button>
        </div>
      )}
    </div>
  );
}
