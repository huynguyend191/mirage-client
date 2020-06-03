import React from 'react';
import styles from './Stats.module.css';
import Payments from './Payments';
import Reviews from './Reviews';

export default function Stats() {
  return (
    <div className={styles.stats}>
      <Payments />
      <Reviews />
    </div>
  );
}
