import React from 'react';
import styles from './Footer.module.css';
import { GithubOutlined, FacebookFilled,  InstagramOutlined} from '@ant-design/icons';

export default function Footer() {
  return (
    <div className={styles.footer}>
    <div className={styles.contactIconContainer}>
      <GithubOutlined className={styles.contactIcon} style={{fontSize: 35}} onClick={ () =>  window.open('https://github.com/huynguyend191')} />
      <FacebookFilled className={styles.contactIcon} style={{fontSize: 35}} onClick={ () =>  window.open('https://www.facebook.com/sneezingcat191')} />
      <InstagramOutlined className={styles.contactIcon} style={{fontSize: 35}} onClick={() =>  window.open('https://www.instagram.com/sneezingcat191/')} />
    </div>
    <div className={styles.contactInfoContainer}>
      <p>Mirage 2020 - English Video Call Platform</p>
      <p>Contact: huynguyend191@gmail.com</p>
    </div>
  </div>
  )
}
