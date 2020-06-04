import React, { useState, useContext, useEffect } from 'react';
import styles from './ExtendSubscription.module.css';
import { Card, Row, Col, Divider, Button, Popconfirm, Spin } from 'antd';
import { SUB_TIER, STUDENT_PRICE, DISCOUNT_RATE } from '../../lib/constants';
import Normal from '../../assets/normal.png';
import Silver from '../../assets/silver.png';
import Gold from '../../assets/gold.png';
import Platium from '../../assets/platium.png';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';

export default function ExtendSubscription() {
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [pricePerMin, setPricePerMin] = useState(null);
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

  useEffect(() => {
    const getSubPacks = async () => {
      setLoading(true);
      try {
        const result = await axios.get('/settings');
        result.data.settings.forEach(setting => {
          if (setting.type === DISCOUNT_RATE) {
            setDiscount(JSON.parse(setting.content));
          }
          if (setting.type === STUDENT_PRICE) {
            setPricePerMin(Number(setting.content));
          }
        });
      } catch (error) {
        alert(error.response.data.message);
      }
      setLoading(false);
    };
    getSubPacks();
  }, []);

  return (
    <div className={styles.extendSub}>
      <Spin spinning={loading}>
        {discount && pricePerMin ? (
          <Row gutter={24}>
            <Col span={6}>
              <Card>
                <div className={styles.extendSubContent}>
                  <div className={styles.subTier}>Normal</div>
                  <div className={styles.extendDuration}>60 minutes</div>
                  <Divider />
                  <img className={styles.tierImage} src={Normal} alt="" draggable="false" />
                  <div className={styles.extendPrice}>{Number(60 * pricePerMin * discount.NORMAL).toFixed(2)}$</div>
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
                    {Number(120 * pricePerMin * discount.SILVER).toFixed(2)}${' '}
                    <span className={styles.extendSave}>(Save {Math.floor((1 - discount.SILVER) * 100)}%)</span>
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
                    {Number(480 * pricePerMin * discount.GOLD).toFixed(2)}${' '}
                    <span className={styles.extendSave}>(Save {Math.floor((1 - discount.GOLD) * 100)}%)</span>
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
                    {Number(720 * pricePerMin * discount.PLATIUM).toFixed(2)}${' '}
                    <span className={styles.extendSave}>(Save {Math.floor((1 - discount.PLATIUM) * 100)}%)</span>
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
        ) : null}
      </Spin>
    </div>
  );
}
