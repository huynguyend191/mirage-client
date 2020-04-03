import React, { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket';
import { SOCKET_EVENTS, ROLES } from '../lib/constants';
import PeerConnection from '../lib/PeerConnection';
import _ from 'lodash';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import OnlineTutors from '../pages/student/OnlineTutors';
import styles from './VideoCall.module.css';

export default function VideoCall({ account }) {
  const [callWindow, setCallWindow] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [callFrom, setCallFrom] = useState({});
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const [onlineTutors, setOnlineTutors] = useState([]);
  const pcRef = useRef({});
  const configRef = useRef(null);

  useEffect(() => {
    socket
      .on(SOCKET_EVENTS.INIT, (data) => {
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
      .on(SOCKET_EVENTS.GET_ONLINE_TUTORS, (data) => {
        setOnlineTutors(data.online);
      })
      .emit(SOCKET_EVENTS.INIT, { account });
    return () => {
      socket
        .off(SOCKET_EVENTS.INIT)
        .off(SOCKET_EVENTS.REQUEST)
        .off(SOCKET_EVENTS.CALL)
        .off(SOCKET_EVENTS.END)
        .off(SOCKET_EVENTS.GET_ONLINE_TUTORS)
      rejectCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }

  const rejectCall = () => {
    socket.emit(SOCKET_EVENTS.END, { to: callFrom.username });
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


  return (
    <div className={styles.videoCall}>
      {(account.role === ROLES.STUDENT && !callWindow) && (
        <OnlineTutors
          onlineTutors={onlineTutors}
          startCall={startCall}
        />
      )}
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
