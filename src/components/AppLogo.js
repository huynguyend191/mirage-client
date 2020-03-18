import React from 'react';
import styles from'./AppLogo.module.css';
import headerIcon from '../assets/app-logo.png';

export default function AppLogo() {
  return (
    <div className={styles.headerWrapper}>
      <img className={styles.headerIcon} src={headerIcon} draggable={false} alt="" />
      <h1 className={styles.headerTitle}>MIRAGE</h1>
    </div>
  )
}
