import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import { Layout, Avatar, Dropdown, Menu } from 'antd';
import FooterContent from '../../components/FooterContent';
import styles from './Tutor.module.css';
import {
  UserOutlined,
  DownOutlined,
  KeyOutlined,
  LogoutOutlined,
  ContactsOutlined,
  VideoCameraOutlined,
  HistoryOutlined,
  DollarCircleOutlined
} from '@ant-design/icons';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import Profile from './Profile';
import Payments from './Payments';
import Teaching from './Teaching';
import TutorCallHistories from './TutorCallHistories';
import { Switch, Route, Link } from 'react-router-dom';
import SideBarLogo from '../../components/SideBarLogo';
import { serverUrl } from '../../lib/constants';

const { Header, Content, Sider } = Layout;

export default function Tutor(props) {
  const { account, onSignOut } = useContext(AccountContext);
  const [isChangePass, setIsChangePass] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const { location } = props;
  const userAvatar =
    account.tutor && account.tutor.avatar ? (
      <Avatar style={{ margin: '10px' }} src={serverUrl + account.tutor.avatar} />
    ) : (
      <Avatar style={{ margin: '10px' }} icon={<UserOutlined />} />
    );
  const userMenu = (
    <Menu>
      <Menu.Item onClick={() => setIsChangePass(true)}>
        <KeyOutlined />
        <span>Change password</span>
      </Menu.Item>
      <Menu.Item onClick={onSignOut}>
        <LogoutOutlined />
        <span>Sign out</span>
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
        <Menu theme="dark" defaultSelectedKeys={['/tutor']} mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/tutor">
            <ContactsOutlined />
            <Link to="/tutor">
              <span>Profile</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/tutor/teaching">
            <VideoCameraOutlined />
            <Link to="/tutor/teaching">
              <span>Teaching</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/tutor/call-histories">
            <HistoryOutlined />
            <Link to="/tutor/call-histories">
              <span>Call histories</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/tutor/payments">
            <DollarCircleOutlined />
            <Link to="/tutor/payments">
              <span>Payments</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header>
          <div className={styles.userControl}>
            Hello, {account.username}
            <Dropdown overlay={userMenu} placement="bottomLeft">
              <div>
                {userAvatar}
                <DownOutlined className={styles.dropDownIcon} />
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Switch>
            <Route path="/tutor/payments" component={Payments} />
            <Route path="/tutor/teaching" component={Teaching} />
            <Route path="/tutor/call-histories" component={TutorCallHistories} />
            <Route path="/tutor" component={Profile} exact />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Layout>
  );
}
