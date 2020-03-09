import React from 'react'
import styles from './Default.module.css';
import { Button } from 'antd';
import Footer from './Footer';
import introImg from '../resources/assets/video-intro.jpg';

export default function Default() {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>MIRAGE</h1>
        <div className={styles.userButtonContainer}>
          <Button className={styles.userButton} type="secondary" shape="round">Login</Button>
          <Button className={styles.userButton} type="primary" shape="round">Register</Button>
        </div>
      </div>
      <div className={styles.defaultBody}>
        <div className={styles.introContainer}>
          <img className={styles.introImg} src={introImg} alt="" />
          <div className={styles.introContent}>
            <p className={styles.welcomeText}>Welcome to Mirage!</p>
            <p className={styles.welcomeDescription}>Learn English at the touch of a button</p>
            <Button className={styles.registerButton} type="primary" shape="round">START NOW</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
