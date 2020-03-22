import React, { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const videoJsOptions = {
  controls: true,
  width: 480,
  height: 360 ,
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

export default function VideoRecorder() {
  const player = useRef(null);
  const videoNode = useRef(null);
  useEffect(() => {
    player.current = videojs(videoNode.current, videoJsOptions, () => {
      const version_info = 'Using video.js ' + videojs.VERSION +
        ' with videojs-record ' + videojs.getPluginVersion('record') +
        ' and recordrtc ' + RecordRTC.version;
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
      console.log('finished recording: ', player.current.recordedData);
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
    }
  }, []);
  return (
    <div data-vjs-player>
      <video id="myVideo" ref={node => videoNode.current = node} className="video-js vjs-default-skin" playsInline></video>
    </div>
  )
}
