import React from 'react';
import styles from './Subscriptions.module.css';
import { HistoryOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import SubscriptionHistory from './SubscriptionHistory';
import ExtendSubscription from './ExtendSubscription';

const { TabPane } = Tabs;

export default function Subscriptions() {

  return (
    <div className={styles.subscriptions}>
      <Tabs
        defaultActiveKey="extend"
        type="card"
      >
        <TabPane
          tab={
            <span>
              <CreditCardOutlined />
              Extend subscriptions
            </span>
          }
          key="extend"
        >
          <ExtendSubscription />
        </TabPane>
        <TabPane
          tab={
            <span>
              <HistoryOutlined />
              Subscriptions history
            </span>
          }
          key="history"
          className={styles.tabPaneHistory}
        >
          <SubscriptionHistory />
        </TabPane>
      </Tabs>
    </div>
  )
}
