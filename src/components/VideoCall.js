import React, { useState, useEffect, useRef } from 'react';
import socket from '../lib/socket';
import { SOCKET_EVENTS, ROLES } from '../lib/constants';
import PeerConnection from '../lib/PeerConnection';
import _ from 'lodash';
import CallWindow from './CallWindow';
import CallModal from './CallModal';
import TutorList from '../pages/student/TutorList';
import styles from './VideoCall.module.css';
import { getTimeFromMs } from '../lib/utils/formatTime';
import endCallImg from '../assets/endcall.png'
import { Modal, Button } from 'antd';
import { FlagOutlined, StarOutlined, LikeOutlined } from '@ant-design/icons';


export default function VideoCall({ account }) {
  // video call
  const [callWindow, setCallWindow] = useState(false);
  const [callModal, setCallModal] = useState(false);
  const [callFrom, setCallFrom] = useState({});
  const [localSrc, setLocalSrc] = useState(null);
  const [peerSrc, setPeerSrc] = useState(null);
  const pcRef = useRef({});
  const configRef = useRef(null);
  // record videos when calling
  const peerRecorder = useRef(null);
  const localRecorder = useRef(null);
  // call timer
  const start = useRef(0);
  const end = useRef(0);
  // others
  const [onlineTutors, setOnlineTutors] = useState([]);
  const tutor = useRef(null);
  const [afterCallModal, setAfterCallModal] = useState(false);

  useEffect(() => {
    //TODO check time with student, refresh after each call to get new time
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
        start.current = Date.now();
        // auto end call if student runs out of time
        // TODO set duration = remaining time
        if (account.role === ROLES.STUDENT) {
          // setTimeout(() => endCall(true), 3000);
        }
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
          socket.emit(SOCKET_EVENTS.RECORD_TUTOR, e.data);
        }
      }
      peerRecorder.current.start(1000);
    }
  }, [peerSrc, account.role]);

  useEffect(() => {
    if (peerSrc && localSrc && account.role === ROLES.STUDENT) {
      localRecorder.current = new MediaRecorder(localSrc, { mimeType: "video/webm; codecs=vp9" });
      localRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          socket.emit(SOCKET_EVENTS.RECORD_STUDENT, e.data);
        }
      }
      localRecorder.current.start(1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSrc, account.role]);

  const setTutor = tutorProfile => {
    tutor.current = tutorProfile;
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
    if (account.role === ROLES.STUDENT) {
      socket.emit(SOCKET_EVENTS.SAVE_VIDEOS, tutor.current);
    }
    end.current = Date.now();
    if (start.current > 0) {
      setAfterCallModal(true);
    }
    if (_.isFunction(pcRef.current.stop)) {
      pcRef.current.stop(isStarter);
    }
    await stopRecording();
    pcRef.current = {};
    configRef.current = null;
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
    }
  }

  const closeAfterCall = () => {
    setAfterCallModal(false);
    start.current = 0;
    end.current = 0;
  }

  let renderCallFrom = null;
  let btnHolder = null;
  if (callFrom.student) {
    renderCallFrom = callFrom.student.name;
    btnHolder = (
      <div>
        <Button
          shape="round"
          type="danger"
          icon={<FlagOutlined />}
          size="small"
        >
          Report
        </Button>
      </div>
    )
  } else if (tutor.current) {
    renderCallFrom = tutor.current.name;
    btnHolder = (
      <div>
        <Button
          shape="round"
          type="primary"
          icon={<LikeOutlined />}
          size="small"
        >
          Favorite
        </Button>
        <Button
          shape="round"
          icon={<StarOutlined />}
          size="small"
        >
          Feedback
        </Button>
        <Button
          shape="round"
          type="danger"
          icon={<FlagOutlined />}
          size="small"
        >
          Report
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.videoCall}>
      {(account.role === ROLES.STUDENT && !callWindow) && (
        <TutorList
          onlineTutors={onlineTutors}
          startCall={startCall}
          setTutor={setTutor}
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
      <Modal
        visible={afterCallModal}
        title="Call ended"
        onCancel={closeAfterCall}
        destroyOnClose
        footer={false}
        width="600px"
      >
        <div className={styles.afterCall}>
          <img className={styles.endCallImg} src={endCallImg} draggable={false} alt="" />
          <div>
            <div className={styles.endUser}>
              Call with {renderCallFrom}
            </div>
            <div className={styles.endDuration}>
              Duration: {getTimeFromMs(end.current - start.current)}
            </div>
            <div className={styles.btnHolder}>
              {btnHolder}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
