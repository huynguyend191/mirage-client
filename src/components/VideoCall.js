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
import endCallImg from '../assets/endcall.png';
import { Modal, Button, Popconfirm } from 'antd';
import { StarOutlined, LikeOutlined } from '@ant-design/icons';
import FeedbackModal from '../pages/student/FeedbackModal';
import axios from '../lib/utils/axiosConfig';
import { PREFERENCE_TYPES } from '../lib/constants';
import addNotification from 'react-push-notification';

export default function VideoCall({ account, remainingTime, getStudent }) {
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
  // tutor called with student
  const [onlineTutors, setOnlineTutors] = useState([]);
  const tutor = useRef(null);
  const student = useRef(null);

  // control after call modal like report, review, ...
  const [afterCallModal, setAfterCallModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    //TODO check time with student, refresh after each call to get new time
    socket
      .on(SOCKET_EVENTS.INIT, () => {})
      .on(SOCKET_EVENTS.REQUEST, ({ from }) => {
        addNotification({
          title: 'Someone is calling...',
          message: 'Return to Mirage to receive phone call',
          duration: 10000,
          theme: 'darkblue',
          native: true // when using native, your OS will handle theming.
        });
        setCallModal(true);
        setCallFrom(from);
        student.current = from;
      })
      .on(SOCKET_EVENTS.CALL, data => {
        if (data.sdp) {
          pcRef.current.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') pcRef.current.createAnswer();
        } else pcRef.current.addIceCandidate(data.candidate);
        start.current = Date.now();
        if (account.role === ROLES.TUTOR) {
          // record stream from tutor side
          socket.emit(SOCKET_EVENTS.SAVE_VIDEOS);
        }
        // auto end call if student runs out of time
        if (account.role === ROLES.STUDENT) {
          setTimeout(() => endCall(true), remainingTime);
        }
      })
      .on(SOCKET_EVENTS.END, () => endCall(false))
      .on(SOCKET_EVENTS.GET_ONLINE_TUTORS, data => {
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
        .off(SOCKET_EVENTS.GET_ONLINE_TUTORS);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    if (peerSrc && account.role === ROLES.TUTOR) {
      peerRecorder.current = new MediaRecorder(peerSrc, { mimeType: 'video/webm; codecs=vp9' });
      peerRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          socket.emit(SOCKET_EVENTS.RECORD_STUDENT, e.data);
        }
      };
      peerRecorder.current.start(1000);
    }
  }, [peerSrc, account.role]);

  useEffect(() => {
    if (localSrc && account.role === ROLES.TUTOR) {
      localRecorder.current = new MediaRecorder(localSrc, { mimeType: 'video/webm; codecs=vp9' });
      localRecorder.current.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          socket.emit(SOCKET_EVENTS.RECORD_TUTOR, e.data);
        }
      };
      localRecorder.current.start(1000);
    }
  }, [localSrc, account.role]);

  const setTutor = tutorProfile => {
    tutor.current = tutorProfile;
  };

  const startCall = (isCaller, friendID, config) => {
    configRef.current = config;
    pcRef.current = new PeerConnection(friendID)
      .on('localStream', src => {
        if (!isCaller) {
          setCallModal(false);
        }
        setCallWindow(true);
        setLocalSrc(src);
      })
      .on('peerStream', src => setPeerSrc(src))
      .start(isCaller, config);
  };

  const rejectCall = () => {
    socket.emit(SOCKET_EVENTS.END, { to: callFrom.username });
    setCallModal(false);
  };

  const endCall = async isStarter => {
    if (account.role === ROLES.TUTOR) {
      socket.emit(SOCKET_EVENTS.CREATE_CALL_HISTORY, student.current.student);
    }
    if (account.role === ROLES.STUDENT) {
      // refresh remaining time
      getStudent();
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
  };

  const stopRecording = async e => {
    if (account.role === ROLES.STUDENT) {
      if (peerRecorder.current && peerSrc) {
        peerRecorder.current.stop();
      }
      if (localRecorder.current && localSrc) {
        localRecorder.current.stop();
      }
    }
  };

  const closeAfterCall = () => {
    setAfterCallModal(false);
    start.current = 0;
    end.current = 0;
  };

  let renderCallFrom = null;
  let btnHolder = null;
  if (callFrom.student) {
    renderCallFrom = callFrom.student.name;
  } else if (tutor.current) {
    renderCallFrom = tutor.current.name;
    btnHolder = (
      <div>
        <Popconfirm title="Add this tutor to your favorites?" okText="Yes" cancelText="No" onConfirm={() => addToFav()}>
          <Button shape="round" type="primary" icon={<LikeOutlined />} size="small">
            Favorite
          </Button>
        </Popconfirm>

        <Button shape="round" icon={<StarOutlined />} size="small" onClick={() => setShowFeedback(true)}>
          Feedback
        </Button>
      </div>
    );
  }

  const addToFav = async () => {
    try {
      await axios.post('/preferences', {
        studentId: account.student.id,
        tutorId: tutor.current.id,
        type: PREFERENCE_TYPES.FAVORITE
      });
      alert('Tutor is added to your favorites');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className={styles.videoCall}>
      <FeedbackModal tutor={tutor.current} showFeedback={showFeedback} setShowFeedBack={setShowFeedback} />
      {account.role === ROLES.STUDENT && !callWindow && (
        <TutorList
          onlineTutors={onlineTutors}
          startCall={startCall}
          setTutor={setTutor}
          remainingTime={remainingTime}
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
      <CallModal callModal={callModal} startCall={startCall} rejectCall={rejectCall} callFrom={callFrom} />
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
            <div className={styles.endUser}>Call with {renderCallFrom}</div>
            <div className={styles.endDuration}>Duration: {getTimeFromMs(end.current - start.current)}</div>
            <div className={styles.btnHolder}>{btnHolder}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
