import React from 'react';
import OnlineUsers from './OnlineUsers';
import styles from './Dashboard.module.css';
import RecentCalls from './RecentCalls';
import MoneyStats from './MoneyStats';
import TopPaid from './TopPaid';

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardRow}>
        <OnlineUsers />
        <RecentCalls />
      </div>
      <div className={styles.dashboardRow}>
        <MoneyStats />

        <TopPaid />
      </div>
    </div>
  );
}
