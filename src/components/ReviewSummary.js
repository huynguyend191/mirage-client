import React from 'react';
import styles from './ReviewSummary.module.css';
import { UserOutlined } from '@ant-design/icons';
import { Progress, Rate } from 'antd';

export default function ReviewSummary({ reviews }) {
  return (
    <div className={styles.reviewSummary}>
      <div className={styles.reviewOverall}>
        <div className={styles.reviewAvg}>{Number(reviews.avg).toFixed(1)}</div>
        <Rate disabled defaultValue={Number((Math.round(reviews.avg * 2) / 2).toFixed(1))} allowHalf style={{ fontSize: '15px' }} />
        <div className={styles.reviewNumber}><UserOutlined style={{ marginRight: '3px' }} />{reviews.count}</div>
      </div>
      <div className={styles.ratingCountList}>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>5</span><Progress showInfo={false} percent={reviews.ratingCount.rating5} />
        </div>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>4</span><Progress showInfo={false} percent={reviews.ratingCount.rating4} />
        </div>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>3</span><Progress showInfo={false} percent={reviews.ratingCount.rating3} />
        </div>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>2</span><Progress showInfo={false} percent={reviews.ratingCount.rating2} />
        </div>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>1</span><Progress showInfo={false} percent={reviews.ratingCount.rating1} />
        </div>
        <div className={styles.ratingCount}>
          <span className={styles.rating}>0</span><Progress showInfo={false} percent={reviews.ratingCount.rating0} />
        </div>
      </div>
    </div>
  )
}
