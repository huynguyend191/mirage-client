import React, { useState } from 'react'
import styles from './Default.module.css';
import { Button, Layout, Divider } from 'antd';
import FooterContent from '../../components/FooterContent';
import introImg from '../../assets/flame-welcome.png';
import headerIcon from '../../assets/app-logo.png';
import RegisterModal from './RegisterModal';
import SignInModal from './SignInModal';

const { Header, Content } = Layout;

export default function Default() {
  const [isRegister, setRegister] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isStudent, setIsStudent] = useState(true);
  const showRegister = (isStudent) => {
    setIsStudent(isStudent);
    setRegister(true);
  };
  const hideRegister = () => {
    setRegister(false);
  };
  const showSignIn = () => {
    setIsSignIn(true);
  };
  const hideSignIn = () => {
    setIsSignIn(false);
  };
  return (
    <Layout>
      <SignInModal isVisible={isSignIn} onClose={hideSignIn} onSwitchRegister={showRegister} />
      <RegisterModal isVisible={isRegister} onClose={hideRegister} isStudent={isStudent} onSwitchSignIn={showSignIn} />
      <Header>
        <div className={styles.headerContent}>
          <div className={styles.headerWrapper}>
            <img className={styles.headerIcon} src={headerIcon} draggable={false} alt="" />
            <h1 className={styles.headerTitle}>MIRAGE</h1>
          </div>
          <div className={styles.userButtonContainer}>
            <Button className={styles.userButton} type="secondary" shape="round" onClick={() => showSignIn()}>Sign in</Button>
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
      <FooterContent />
    </Layout>
  )
}
