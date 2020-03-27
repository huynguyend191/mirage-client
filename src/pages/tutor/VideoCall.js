import React, { useEffect, useContext } from 'react';
import socket from '../../lib/utils/socket';
import { AccountContext } from '../../context/AccountContext';

export default function VideoCall() {
  const { account } = useContext(AccountContext);

  useEffect(() => {
    console.log("Call")
    const tutor = account.username;
    socket
    .on('init', (data) => {
      console.log(data.onlineUsersList)
    })
    // .on('request', ({ from }) => {
    //   setCallModal('active');
    //   setCallFrom(from)
    // })
    // .on('call', (data) => {
    //   if (data.sdp) {
    //     pcRef.current.setRemoteDescription(data.sdp);
    //     if (data.sdp.type === 'offer') pcRef.current.createAnswer();
    //   } else pcRef.current.addIceCandidate(data.candidate);
    // })
    // .on('end', () => endCall(false))
    .emit('init', {tutor});
  }, [account.username]);

  return (
    <div>
      Start Teaching
    </div>
  )
}
