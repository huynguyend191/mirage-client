import React, { useEffect, useState } from 'react';
import styles from './MoneyStats.module.css';
import { Bar } from 'react-chartjs-2';
import axios from '../../lib/utils/axiosConfig';

export default function MoneyStats() {
  const [stats, setStats] = useState({ earn: 0, pay: 0 });

  useEffect(() => {
    const getMoneyStats = async () => {
      try {
        const result = await axios.get('/stats/money');
        setStats(result.data.stats);
      } catch (error) {
        alert(error.response.data.message);
      }
    };
    getMoneyStats();
  }, []);

  const data = {
    datasets: [
      {
        data: [stats.earn, stats.pay],
        backgroundColor: ['#FF6384', '#36A2EB'],
        label: `Profit: ${(stats.earn - stats.pay).toFixed(2)}$`
      }
    ],
    labels: ['Earn', 'Pay']
  };

  return (
    <div className={styles.moneyStats}>
      <p>Money</p>
      <Bar data={data} />
    </div>
  );
}
