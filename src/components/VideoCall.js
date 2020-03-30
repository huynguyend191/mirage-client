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
  const pcRef = useRef({});
  const configRef = useRef(null);

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
          pcRef.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') pcRef.current.createAnswer();
        } else pcRef.current.addIceCandidate(data.candidate);
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
    configRef.current = config;
    pcRef.current = new PeerConnection(friendID)
      .on('localStream', (src) => {
        setCallWindow(true);
        setLocalSrc(src)
        if (!isCaller) setCallModal(false)
      })
      .on('peerStream', src => setPeerSrc(src))
      .start(isCaller, config);
    console.log(!_.isEmpty(configRef.current))
  }

  const rejectCall = () => {
    socket.emit(SOCKET_EVENTS.END, { to: callFrom });
    setCallModal(false);
  }

  const endCall = (isStarter) => {
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    pcRef.current = {};
    configRef.current = null;
    setCallModal(false);
    setCallWindow(false);
    setLocalSrc(null);
    setPeerSrc(null);
  }

  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => startCall(true, 'huynd', config);
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
      {!_.isEmpty(configRef.current) && (
        <CallWindow
          callWindow={callWindow}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={configRef.current}
          mediaDevice={pcRef.current.mediaDevice}
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
