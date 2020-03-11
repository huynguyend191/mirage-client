import React, { useState } from 'react'
import styles from './Default.module.css';
import { Button, Layout, Divider } from 'antd';
import FooterContent from './FooterContent';
import introImg from '../assets/flame-welcome.png';
import headerIcon from '../assets/app-logo.png';
import RegisterModal from './RegisterModal';
const { Header, Content, Footer } = Layout;

export default function Default() {
  const [isRegister, setRegister] = useState(false);
  const [role, setRole] = useState("Student");
  const showRegister = (role) => {
    setRole(role);
    setRegister(true);
  }
  const hideRegister = () => {
    setRegister(false);
  }
  return (
    <Layout>
      <RegisterModal isVisible={isRegister} onClose={hideRegister} userRole={role} />
      <Header>
        <div className={styles.headerContent}>
          <div className={styles.headerWrapper}>
            <img className={styles.headerIcon} src={headerIcon} alt="" />
            <h1 className={styles.headerTitle}>MIRAGE</h1>
          </div>
          <div className={styles.userButtonContainer}>
            <Button className={styles.userButton} type="secondary" shape="round">Login</Button>
            <Button className={styles.userButton} type="primary" shape="round" onClick={() => showRegister(role)}>Register</Button>
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
              <Button className={styles.registerButton} type="primary" shape="round" onClick={() => showRegister("Student")}>STUDY NOW</Button>
              <Divider style={{ width: "300px" }}>OR</Divider>
              <Button className={styles.registerButton} type="secondary" shape="round" onClick={() => showRegister("Tutor")}>BECOME TUTOR</Button>
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
