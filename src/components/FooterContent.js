import React from 'react';
import styles from './FooterContent.module.css';
import { GithubOutlined, FacebookFilled, InstagramOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
const { Footer } = Layout;
export default function FooterContent() {
  return (
    <Footer className={styles.footer}>
      <div className={styles.contactIconContainer}>
        <GithubOutlined className={styles.contactIcon} style={{ fontSize: 35 }} onClick={() => window.open('https://github.com/huynguyend191')} />
        <FacebookFilled className={styles.contactIcon} style={{ fontSize: 35 }} onClick={() => window.open('https://www.facebook.com/sneezingcat191')} />
        <InstagramOutlined className={styles.contactIcon} style={{ fontSize: 35 }} onClick={() => window.open('https://www.instagram.com/sneezingcat191/')} />
      </div>
      <div className={styles.contactInfoContainer}>
        Mirage 2020 - English Video Call Platform <br /> 
        Contact: huynguyend191@gmail.com
      </div>
    </Footer>
  );
}
