import React, { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

const videoJsOptions = {
  controls: true,
  width: 480,
  height: 360 ,
  fluid: false,
  sources: [{
    src: 'https://www.youtube.com/watch?v=xg5LP7kSNOs',
    type: 'video/mp4'
  }],
  autoplay: false
};

export default function VideoPlayer() {
  const player = useRef(null);
  const videoNode = useRef(null);
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
    <div data-vjs-player>
      <video id="myVideo" ref={node => videoNode.current = node} className="video-js vjs-default-skin" playsInline></video>
    </div>
  )
}
