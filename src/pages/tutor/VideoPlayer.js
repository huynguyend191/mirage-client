import React, { useEffect, useRef, useContext } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import { Button } from 'antd';
import { serverUrl } from '../../lib/constants';
import { AccountContext } from '../../context/AccountContext';

export default function VideoPlayer({ recordNew }) {
  const player = useRef(null);
  const videoNode = useRef(null);
  const { account } = useContext(AccountContext);
  const videoJsOptions = {
    controls: true,
    width: 480,
    height: 360,
    fluid: false,
    sources: [{
      src: serverUrl + 'api/tutors/video/' + account.username,
      type: 'video/webm'
    }],
    autoplay: false
  };
  useEffect(() => {
    player.current = videojs(videoNode.current, videoJsOptions, () => {
      const version_info = 'Using video.js ' + videojs.VERSION
      videojs.log(version_info);
    });
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    }
  }, []);
  return (
    <div>
      <div data-vjs-player>
        <video id="myVideo" ref={node => videoNode.current = node} className="video-js vjs-default-skin vjs-big-play-centered" playsInline></video>
      </div>
      <Button onClick={recordNew}>Record new video</Button>
    </div >
  );
}
