import React, { useState, useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { Button } from 'antd';
import { VideoCameraFilled, AudioFilled, PhoneFilled } from '@ant-design/icons';
export default function CallWindow({ peerSrc, localSrc, config, mediaDevice, status, endCall }) {
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
  });

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
    <div>
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <Button
          shape="circle"
          type="primary"
          icon={<VideoCameraFilled />}
          onClick={() => toggleMediaDevice('video')}
          size="large"
        />
        <Button
          shape="circle"
          type="primary"
          icon={<AudioFilled />}
          onClick={() => toggleMediaDevice('audio')}
          size="large"
        />
        <Button
          shape="circle"
          type="danger"
          onClick={() => endCall(true)}
          icon={<PhoneFilled />}
          size="large"
        />
      </div>
    </div>
  )
}
