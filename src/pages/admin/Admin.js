import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import FooterContent from '../../components/FooterContent';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { BarChartOutlined, IdcardOutlined, TeamOutlined, DownOutlined, ExceptionOutlined, MenuUnfoldOutlined, MenuFoldOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, Route, Switch } from 'react-router-dom';
import styles from './Admin.module.css';
import Dashboard from './Dashboard';
import Students from './Students';
import Tutors from './Tutors';
import AvatarPic from '../../assets/admin-avatar.png';
import Reports from './Reports';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';
import SideBarLogo from '../../components/SideBarLogo';

const { Header, Content, Sider } = Layout;

export default function Admin(props) {
  const [collapsed, setCollapsed] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  const [isForgotPass, setIsForgotPass] = useState(false);
  const { onSignOut, account } = useContext(AccountContext);
  const { location } = props;

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }

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
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <SideBarLogo collapsed={collapsed} />
        <Menu theme="dark" defaultSelectedKeys={["/admin"]} mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/admin">
            <BarChartOutlined /><Link to="/admin"><span>Dashboard</span></Link>
          </Menu.Item>
          <Menu.Item key="/admin/students">
            <TeamOutlined /><Link to="/admin/students"><span>Students</span></Link>
          </Menu.Item>
          <Menu.Item key="/admin/tutors">
            <IdcardOutlined /><Link to="/admin/tutors"><span>Tutors</span></Link>
          </Menu.Item>
          <Menu.Item key="/admin/reports">
            <ExceptionOutlined /><Link to="/admin/reports"><span>Reports</span></Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "white" }}>
          {
            collapsed ? <MenuUnfoldOutlined style={{ fontSize: "20px" }} onClick={() => setCollapsed(false)} /> : <MenuFoldOutlined style={{ fontSize: "20px" }} onClick={() => setCollapsed(true)} />
          }
          <div className={styles.userControl}>
            Hello, {account.username}
            <Dropdown overlay={userMenu} placement="bottomLeft">
              <div><Avatar src={AvatarPic} size="large" draggable={false} /><DownOutlined className={styles.dropDownIcon} /></div>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Switch>
            <Route path="/admin/students" component={Students} />
            <Route path="/admin/tutors" component={Tutors} />
            <Route path="/admin/reports" component={Reports} />
            <Route path="/admin" component={Dashboard} exact />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Layout>

  );
}
