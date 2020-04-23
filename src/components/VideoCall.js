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
  const [tutorId, setTutorId] = useState(null);

  const pcRef = useRef({});
  // record videos when calling
  const configRef = useRef(null);
  const peerRecorder = useRef(null);
  const peerChunks = useRef([]);
  const localRecorder = useRef(null);
  const localChunks = useRef([]);
  // call timer
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
      peerRecorder.current = new MediaRecorder(peerSrc, { mimeType: "video/webm; codecs=vp9" });
      peerRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          peerChunks.current.push(e.data);
        }
      }
      peerRecorder.current.start(1000);
    }
  }, [peerSrc, account.role]);

  useEffect(() => {
    if (localSrc && account.role === ROLES.STUDENT) {
      localRecorder.current = new MediaRecorder(localSrc, { mimeType: "video/webm; codecs=vp9" });
      localRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          localChunks.current.push(e.data);
        }
      }
      localRecorder.current.start(1000);
    }
  }, [localSrc, account.role]);

  const setTutor = id => {
    setTutorId(id);
  }

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

  const endCall = async (isStarter) => {
    end.current = Date.now();
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    await stopRecording();
    pcRef.current = {};
    configRef.current = null;
    localChunks.current = [];
    peerChunks.current = [];
    setCallModal(false);
    setCallWindow(false);
    setLocalSrc(null);
    setPeerSrc(null);
  }

  const stopRecording = async (e) => {
    if (account.role === ROLES.STUDENT) {
      if (peerRecorder.current && peerSrc) {
        peerRecorder.current.stop();
      }
      if (localRecorder.current && localSrc) {
        localRecorder.current.stop();
      }
      if (peerChunks.current.length > 0 && localChunks.current.length > 0) {
        const peerBlob = new Blob(peerChunks.current, { type: "video/webm" });
        const localBlob = new Blob(localChunks.current, { type: "video/webm" });
        const formData = new FormData();
        formData.append('videos', peerBlob, 'tutor.webm');
        formData.append('videos', localBlob, 'student.webm');
        formData.append('tutorId', tutorId);
        formData.append('studentId', account.student.id);
        formData.append('duration', end.current - start.current);
        try {
          await axios('/call-histories', {
            data: formData,
            method: 'POST'
          });
        } catch (error) {
          console.log(error)
        }
      }
    }
  }


  return (
    <div className={styles.videoCall}>
      {(account.role === ROLES.STUDENT && !callWindow) && (
        <TutorList
          onlineTutors={onlineTutors}
          startCall={startCall}
          setTutorId={setTutor}
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
