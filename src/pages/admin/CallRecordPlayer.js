import React, { useEffect, useRef } from 'react';
import 'video.js/dist/video-js.css';
import videojs from 'video.js';

export default function CallRecordPlayer({ url }) {
  console.log(url)
  const player = useRef(null);
  const videoNode = useRef(null);
  const videoJsOptions = {
    controls: true,
    width: 513,
    height: 360,
    fluid: false,
    sources: [{
      src: url,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return (
    <div data-vjs-player>
      <video id="myVideo" ref={node => videoNode.current = node} className="video-js vjs-default-skin vjs-big-play-centered" playsInline></video>
    </div>
  );
}
