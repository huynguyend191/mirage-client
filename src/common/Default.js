import React, { useState } from 'react'
import styles from './Default.module.css';
import { Button, Layout, Divider } from 'antd';
import FooterContent from './FooterContent';
import introImg from '../assets/flame-welcome.png';
import headerIcon from '../assets/app-logo.png';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

const { Header, Content, Footer } = Layout;

export default function Default() {
  const [isRegister, setRegister] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const showRegister = (isStudent) => {
    setIsStudent(isStudent);
    setRegister(true);
  }
  const hideRegister = () => {
    setRegister(false);
  }
  const showLogin = () => {
    setLogin(true);
  }
  const hideLogin = () => {
    setLogin(false);
  }
  return (
    <Layout>
      <LoginModal isVisible={isLogin} onClose={hideLogin} onSwitchRegister={showRegister} />
      <RegisterModal isVisible={isRegister} onClose={hideRegister} isStudent={isStudent} onSwitchLogin={showLogin} />
      <Header>
        <div className={styles.headerContent}>
          <div className={styles.headerWrapper}>
            <img className={styles.headerIcon} src={headerIcon} draggable={false} alt="" />
            <h1 className={styles.headerTitle}>MIRAGE</h1>
          </div>
          <div className={styles.userButtonContainer}>
            <Button className={styles.userButton} type="secondary" shape="round" onClick={() => showLogin()}>Login</Button>
            <Button className={styles.userButton} type="primary" shape="round" onClick={() => showRegister(true)}>Register</Button>
          </div>
        </div>
      </Header>
      <Content>
        <div className={styles.defaultBody}>
          <div className={styles.introContainer}> 
            <img className={styles.introImg} draggable={false} src={introImg} alt="" />
            <div className={styles.introContent}>
              <p className={styles.welcomeText}>Welcome to Mirage!</p>
              <p className={styles.welcomeDescription}>“Go on, say something in English!”</p>
              <Button className={styles.registerButton} type="primary" shape="round" onClick={() => showRegister(true)}>STUDY NOW</Button>
              <Divider style={{ width: "300px" }}>OR</Divider>
              <Button className={styles.registerButton} type="secondary" shape="round" onClick={() => showRegister(false)}>BECOME TUTOR</Button>
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
