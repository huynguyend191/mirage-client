import React, { useContext, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import FooterContent from '../../components/FooterContent';
import { Layout, Menu, Dropdown } from 'antd';
import { BarChartOutlined, ContactsOutlined, TeamOutlined } from '@ant-design/icons';
import { Link, Route, Switch } from 'react-router-dom';
import styles from './Admin.module.css';
import Dashboard from './Dashboard';
import Students from './Students';
import Tutors from './Tutors';
import Logo from '../../assets/app-logo.png';
import Avatar from '../../assets/admin-avatar.png';
import { DownOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

export default function Admin(props) {
  const [collapsed, setCollapsed] = useState(false);
  const { location } = props;
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }
  const { onSignOut, account } = useContext(AccountContext);
  const userMenu = (
    <Menu>
      <Menu.Item>
        Change password
      </Menu.Item>
      <Menu.Item onClick={onSignOut}>
        Sign out
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className={styles.logoContainer}>
          <img src={Logo} alt="" className={styles.logo} draggable={false} />
          {collapsed ? null : <p className={styles.logoText}>MIRAGE</p>}
        </div>
        <Menu theme="dark" defaultSelectedKeys={["/admin"]} mode="inline" selectedKeys={[location.pathname]}>
          <Menu.Item key="/admin">
            <BarChartOutlined /><Link to="/admin"><span>Dashboard</span></Link>
          </Menu.Item>
          <Menu.Item key="/admin/students">
            <TeamOutlined /><Link to="/admin/students"><span>Students</span></Link>
          </Menu.Item>
          <Menu.Item key="/admin/tutors">
            <ContactsOutlined /><Link to="/admin/tutors"><span>Tutors</span></Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{background: "white"}}>
          <div className={styles.userControl}>
            <img src={Avatar} alt="" className={styles.avatar} draggable={false} />
            <Dropdown overlay={userMenu}>
              <div>Hello, {account.username}<DownOutlined className={styles.dropDownIcon} /></div>
            </Dropdown>
          </div>
        </Header>
        <Content>
          <Switch>
            <Route path="/admin/students" component={Students} />
            <Route path="/admin/tutors" component={Tutors} />
            <Route path="/admin" component={Dashboard} exact />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Layout>

  );
}
