import React, { useContext, useEffect, useState } from 'react';
import { AccountContext } from '../../context/AccountContext';
import ReviewSummary from '../../components/ReviewSummary';
import Review from '../../components/Review';
import { List } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { getReviewCount } from '../../lib/utils/getReviewCount';
import styles from './Reviews.module.css';

export default function Reviews() {
  const { account } = useContext(AccountContext);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const getTutorReview = async () => {
      try {
        const result = await axios.get('/reviews/' + account.tutor.id);
        const ratingCount = getReviewCount(result.data.reviews);
        setReviews({ ...result.data, ratingCount });
      } catch (error) {
        alert(error.response);
      }
    };
    getTutorReview();
  }, [account.tutor.id]);
  let reviewsRender = null;
  if (reviews) {
    reviewsRender = (
      <div className={styles.reviews}>
        <ReviewSummary reviews={reviews} />
        <List
          itemLayout="horizontal"
          dataSource={reviews.reviews}
          renderItem={item => (
            <List.Item>
              <Review review={item} />
            </List.Item>
          )}
        />
      </div>
    );
  }
  return reviewsRender;
}
