import React, { useState, useEffect, useContext, useRef } from 'react';
import { AccountContext } from '../context/AccountContext';
import socket from '../lib/socket';
import { SOCKET_EVENTS } from '../lib/constants';
import PeerConnection from '../lib/PeerConnection';
import _ from 'lodash';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import { Button } from 'antd';
import { VideoCameraFilled, AudioFilled } from '@ant-design/icons';

export default function VideoCall() {
  const { account } = useContext(AccountContext);
  const [clientId, setClientId] = useState('');
  const [callWindow, setCallWindow] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [callFrom, setCallFrom] = useState('');
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const pc = useRef({});
  const config = useRef(null);

  useEffect(() => {
    socket
      .on(SOCKET_EVENTS.INIT, (data) => {
        setClientId(data.id);
      })
      .on(SOCKET_EVENTS.REQUEST, ({ from }) => {
        setCallModal(true);
        setCallFrom(from)
      })
      .on(SOCKET_EVENTS.CALL, (data) => {
        if (data.sdp) {
          pc.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') pc.current.createAnswer();
        } else pc.current.addIceCandidate(data.candidate);
      })
      .on(SOCKET_EVENTS.END, () => endCall(false))
      .emit(SOCKET_EVENTS.INIT, { account });
      return () => {
        socket
          .off(SOCKET_EVENTS.INIT)
          .off(SOCKET_EVENTS.REQUEST)
          .off(SOCKET_EVENTS.CALL)
          .off(SOCKET_EVENTS.END)
        rejectCall();
      }
  }, []);

  const startCall = (isCaller, friendID, config) => {
    config.current = config;
    pc.current = new PeerConnection(friendID)
      .on('localStream', (src) => {
        setCallWindow(true);
        setLocalSrc(src)
        if (!isCaller) setCallModal(false)
      })
      .on('peerStream', src => setPeerSrc(src))
      .start(isCaller, config);
    console.log(config.current)
  }

  const rejectCall = () => {
    socket.emit(SOCKET_EVENTS.END, { to: callFrom });
    setCallModal(false);
  }

  const endCall = (isStarter) => {
    if (_.isFunction(pc.current.stop)) {
      pc.current.stop(isStarter);
    }
    pc.current = {};
    config.current = null;
    setCallModal(false);
    setCallWindow(false);
    setLocalSrc(null);
    setPeerSrc(null);
  }

  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(true, 'huynd191', config);
  };

  return (
    <div>
        <div>
        <Button
          shape="circle"
          type="primary"
          icon={<VideoCameraFilled />}
          onClick={callWithVideo(true)}
          size="large"
        />
        <Button
          shape="circle"
          type="primary"
          icon={<AudioFilled />}
          onClick={callWithVideo(false)}
          size="large"
        />
        </div>
      {!_.isEmpty(config.current) && (
        <CallWindow
          callWindow={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={config.current}
          mediaDevice={pc.current.mediaDevice}
          endCall={endCall}
        />
      )}
      <CallModal
        callModal={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />

    </div>
  )
}
