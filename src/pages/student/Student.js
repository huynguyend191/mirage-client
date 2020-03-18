import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import VerifyAccount from '../../components/VerifyAccount';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import FooterContent from '../../components/FooterContent';
import styles from './Student.module.css';
import { UserOutlined, DownOutlined, KeyOutlined, LogoutOutlined, BarChartOutlined, ContactsOutlined, VideoCameraOutlined } from '@ant-design/icons';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { Switch, Route, Link } from 'react-router-dom';
import SideBarLogo from '../../components/SideBarLogo';
const { Header, Content, Sider } = Layout;

export default function Student(props) {
  const { account, onSignOut } = useContext(AccountContext);
  const [isChangePass, setIsChangePass] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const { location } = props;
  const userAvatar = account.student.avatar ?
    <Avatar style={{ margin: "10px" }} icon={<UserOutlined />} size="large" /> :
    <Avatar style={{ margin: "10px" }} icon={<UserOutlined />} size="large" />
  useEffect(() => {
    
  }, []);
  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => setIsChangePass(true)}>
        <KeyOutlined /><span>Change password</span>
      </Menu.Item>
      <Menu.Item onClick={onSignOut}>
        <LogoutOutlined /><span>Sign out</span>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <ForgotPasswordModal isVisible={isForgotPass} onClose={() => setIsForgotPass(false)} />
      <ChangePasswordModal
        isVisible={isChangePass}
        onClose={() => setIsChangePass(false)}
        onForgot={() => setIsForgotPass(true)}
      />
      <Sider>
        <SideBarLogo collapsed={false} />
        <Menu theme="dark" defaultSelectedKeys={["/student"]} mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/student">
            <ContactsOutlined /><Link to="/student"><span>Profile</span></Link>
          </Menu.Item>
          <Menu.Item key="/student/video-call">
            <VideoCameraOutlined /><Link to="/student/video-call"><span>Video call</span></Link>
          </Menu.Item>
          <Menu.Item key="/student/stats">
            <BarChartOutlined /><Link to="/student/stats"><span>Stats</span></Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <div className={styles.userControl}>  
            Hello, {account.username}
            <Dropdown overlay={userMenu} placement="bottomLeft">
              <div>
                {userAvatar}<DownOutlined className={styles.dropDownIcon} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Switch>
            {/* <Route path="/student/stats" component={Stats} />
            <Route path="/student/video-call" component={VideoCall} />
            <Route path="/student" component={Profile} exact /> */}
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Layout>
  )
}
