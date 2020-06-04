import React, { useEffect, useState } from 'react';
import socket from '../../lib/socket';
import { SOCKET_EVENTS } from '../../lib/constants';
import styles from './OnlineUsers.module.css';
import { Doughnut } from 'react-chartjs-2';

export default function OnlineUsers() {
  const [onlineTutors, setOnlineTutors] = useState([]);
  const [onlineStudents, setOnlineStudents] = useState([]);

  useEffect(() => {
    socket
      .on(SOCKET_EVENTS.GET_ONLINE_TUTORS, data => {
        setOnlineTutors(data.online);
      })
      .on(SOCKET_EVENTS.GET_ONLINE_STUDENTS, data => {
        setOnlineStudents(data.online);
      });
    return () => {
      socket.off(SOCKET_EVENTS.GET_ONLINE_STUDENTS).off(SOCKET_EVENTS.GET_ONLINE_TUTORS);
    };
  }, []);

  const data = {
    datasets: [
      {
        data: [onlineStudents.length, onlineTutors.length],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB']
      }
    ],
    labels: ['Students', 'Tutors']
  };

  return (
    <div className={styles.onlineUsers}>
      <p>Online users</p>
      <Doughnut data={data} />
    </div>
  );
}
