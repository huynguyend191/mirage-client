import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import FooterContent from '../../components/FooterContent';
import styles from './Student.module.css';
import { UserOutlined, DownOutlined, KeyOutlined, LogoutOutlined, DollarCircleOutlined, ContactsOutlined, VideoCameraOutlined, HistoryOutlined } from '@ant-design/icons';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { Switch, Route, Link } from 'react-router-dom';
import SideBarLogo from '../../components/SideBarLogo';
import Profile from './Profile';
import Subscriptions from './Subscriptions';
import Study from './Study';
import { serverUrl } from '../../lib/constants';
import StudentCallHistories from './StudentCallHistories';

const { Header, Content, Sider } = Layout;

export default function Student(props) {
  const { account, onSignOut } = useContext(AccountContext);
  const [isChangePass, setIsChangePass] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const { location } = props;
  const userAvatar = (account.student && account.student.avatar) ?
    <Avatar style={{ margin: "10px" }} src={serverUrl + account.student.avatar} /> :
    <Avatar style={{ margin: "10px" }} icon={<UserOutlined />} />
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
      <Sider collapsible>
        <SideBarLogo collapsed={false} />
        <Menu theme="dark" defaultSelectedKeys={["/student/video-call"]} mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/student/study">
            <VideoCameraOutlined /><Link to="/student/study"><span>Study</span></Link>
          </Menu.Item>
          <Menu.Item key="/student">
            <ContactsOutlined /><Link to="/student"><span>Profile</span></Link>
          </Menu.Item>
          <Menu.Item key="/student/subscriptions">
            <DollarCircleOutlined /><Link to="/student/subscriptions"><span>Subscriptions</span></Link>
          </Menu.Item>
          <Menu.Item key="/student/call-histories">
            <HistoryOutlined /><Link to="/student/call-histories"><span>Call histories</span></Link>
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
            <Route path="/student/subscriptions" component={Subscriptions} />
            <Route path="/student/study" component={Study} />
            <Route path="/student/call-histories" component={StudentCallHistories} />
            <Route path="/student" component={Profile} exact />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Layout>
  )
}
