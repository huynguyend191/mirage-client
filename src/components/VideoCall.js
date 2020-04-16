import React, { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket';
import { SOCKET_EVENTS, ROLES } from '../lib/constants';
import PeerConnection from '../lib/PeerConnection';
import _ from 'lodash';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import TutorList from '../pages/student/TutorList';
import styles from './VideoCall.module.css';
import axios from '../lib/utils/axiosConfig';

export default function VideoCall({ account }) {
  const [callWindow, setCallWindow] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [callFrom, setCallFrom] = useState({});
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const [onlineTutors, setOnlineTutors] = useState([]);
  const pcRef = useRef({});
  const configRef = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const start = useRef(0);
  const end = useRef(0);

  useEffect(() => {
    socket
      .on(SOCKET_EVENTS.INIT, (data) => {
      })
      .on(SOCKET_EVENTS.REQUEST, ({ from }) => {
        setCallModal(true);
        setCallFrom(from)
      })
      .on(SOCKET_EVENTS.CALL, (data) => {
        start.current = Date.now();
        console.log("Start", start.current);
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
      rejectCall();
      socket.emit(SOCKET_EVENTS.LEAVE);
      socket
        .off(SOCKET_EVENTS.INIT)
        .off(SOCKET_EVENTS.REQUEST)
        .off(SOCKET_EVENTS.CALL)
        .off(SOCKET_EVENTS.END)
        .off(SOCKET_EVENTS.GET_ONLINE_TUTORS)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (peerSrc && account.role === ROLES.STUDENT) {
      mediaRecorder.current = new MediaRecorder(peerSrc, { mimeType: "video/webm; codecs=vp9" });
      mediaRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          chunks.current.push(e.data);
        }
      }
      mediaRecorder.current.start(1000);
    }
  }, [peerSrc, account.role])


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
    end.current = Date.now();
    console.log("End", end.current);
    console.log("Duration", end.current - start.current);
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    pcRef.current = {};
    configRef.current = null;
    setCallModal(false);
    setCallWindow(false);
    setLocalSrc(null);
    setPeerSrc(null);
    stopRecording();
  }

  const stopRecording = (e) => {
    if (account.role === ROLES.STUDENT && mediaRecorder.current && peerSrc) {
      mediaRecorder.current.stop();
      console.log(chunks.current)
      const blob = new Blob(chunks.current, { type: "video/webm" });
      console.log(blob);
      const formData = new FormData();
      formData.append('video', blob, 'test.webm');
      axios('/tutors/video/' + account.username, {
        data: formData,
        method: 'POST'
      });
    }
  }


  return (
    <div className={styles.videoCall}>
      {(account.role === ROLES.STUDENT && !callWindow) && (
        <TutorList
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
