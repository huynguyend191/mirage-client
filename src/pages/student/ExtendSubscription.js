import React, { useState, useContext } from 'react';
import styles from './ExtendSubscription.module.css';
import { Card, Row, Col, Divider, Button, Popconfirm } from 'antd';
import { PRICE_PER_MIN, SUB_DISCOUNT_RATE, SUB_TIER } from '../../lib/constants';
import Normal from '../../assets/normal.png';
import Silver from '../../assets/silver.png';
import Gold from '../../assets/gold.png';
import Platium from '../../assets/platium.png';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';

export default function ExtendSubscription() {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { account } = useContext(AccountContext);
  const createPurchase = async (duration, tier) => {
    setPurchaseLoading(true);
    try {
      await axios.post('/subscriptions', {
        duration: duration * 60 * 1000,
        studentId: account.student.id,
        tier: tier
      });
      setPurchaseLoading(false);
    } catch (error) {
      setPurchaseLoading(false);
      alert(error.response.data.message);
    }
  };

  return (
    <div className={styles.extendSub}>
      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <div className={styles.extendSubContent}>
              <div className={styles.subTier}>Normal</div>
              <div className={styles.extendDuration}>60 minutes</div>
              <Divider />
              <img className={styles.tierImage} src={Normal} alt="" draggable="false" />
              <div className={styles.extendPrice}>
                {Number(60 * PRICE_PER_MIN * SUB_DISCOUNT_RATE.NORMAL).toFixed(2)}$
              </div>
              <Popconfirm
                placement="top"
                title="Do you want to create purchase request?"
                onConfirm={() => createPurchase(60, SUB_TIER.NORMAL)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" shape="round" loading={purchaseLoading}>
                  Purchase
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.extendSubContent}>
              <div className={styles.subTier}>Silver</div>
              <div className={styles.extendDuration}>120 minutes</div>
              <Divider />
              <img className={styles.tierImage} src={Silver} alt="" draggable="false" />
              <div className={styles.extendPrice}>
                {Number(120 * PRICE_PER_MIN * SUB_DISCOUNT_RATE.SILVER).toFixed(2)}${' '}
                <span className={styles.extendSave}>(Save 15%)</span>
              </div>
              <Popconfirm
                placement="top"
                title="Do you want to create purchase request?"
                onConfirm={() => createPurchase(120, SUB_TIER.SILVER)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" shape="round" loading={purchaseLoading}>
                  Purchase
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.extendSubContent}>
              <div className={styles.subTier}>Gold</div>
              <div className={styles.extendDuration}>480 minutes</div>
              <Divider />
              <img className={styles.tierImage} src={Gold} alt="" draggable="false" />
              <div className={styles.extendPrice}>
                {Number(480 * PRICE_PER_MIN * SUB_DISCOUNT_RATE.GOLD).toFixed(2)}${' '}
                <span className={styles.extendSave}>(Save 25%)</span>
              </div>
              <Popconfirm
                placement="top"
                title="Do you want to create purchase request?"
                onConfirm={() => createPurchase(480, SUB_TIER.GOLD)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" shape="round" loading={purchaseLoading}>
                  Purchase
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className={styles.extendSubContent}>
              <div className={styles.subTier}>Platium</div>
              <div className={styles.extendDuration}>720 minutes</div>
              <Divider />
              <img className={styles.tierImage} src={Platium} alt="" draggable="false" />
              <div className={styles.extendPrice}>
                {Number(720 * PRICE_PER_MIN * SUB_DISCOUNT_RATE.PLATIUM).toFixed(2)}${' '}
                <span className={styles.extendSave}>(Save 35%)</span>
              </div>
              <Popconfirm
                placement="top"
                title="Do you want to create purchase request?"
                onConfirm={() => createPurchase(720, SUB_TIER.PLATIUM)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" shape="round" loading={purchaseLoading}>
                  Purchase
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
