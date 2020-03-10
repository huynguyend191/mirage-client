import React from 'react'
import styles from './Default.module.css';
import { Button, Layout, Divider } from 'antd';
import FooterContent from './FooterContent';
import introImg from '../resources/assets/video-intro.png';
const { Header, Content, Footer } = Layout;

export default function Default() {
  return (
    <Layout>
      <Header>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>MIRAGE</h1>
          <div className={styles.userButtonContainer}>
            <Button className={styles.userButton} type="secondary" shape="round">Login</Button>
            <Button className={styles.userButton} type="primary" shape="round">Register</Button>
          </div>
        </div>
      </Header>
      <Content>
      <div className={styles.defaultBody}>
        <div className={styles.introContainer}>
          <img className={styles.introImg} src={introImg} alt="" />
          <div className={styles.introContent}>
            <p className={styles.welcomeText}>Welcome to Mirage!</p>
            <p className={styles.welcomeDescription}>Learn English anywhere you want</p>
            <Button className={styles.registerButton} type="primary" shape="round">STUDY NOW</Button>
            <Divider>OR</Divider>
            <p className={styles.welcomeDescription}>Share your knowledge with others</p>
            <Button className={styles.registerButton} type="primary" shape="round">BECOME TUTOR</Button>
          </div>
        </div>
      </div>
      </Content>
      <Footer>
        <FooterContent />
      </Footer>
    </Layout>
  )
}
