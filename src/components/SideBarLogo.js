import React from 'react';
import Logo from '../assets/app-logo.png';
import styles from './SideBarLogo.module.css';

export default function SideBarLogo( {collapsed} ) {
  return (
    <div className={styles.logoContainer}>
      <img src={Logo} alt="" className={styles.logo} draggable={false} />
      {collapsed ? null : <p className={styles.logoText}>MIRAGE</p>}
    </div>
  )
}
