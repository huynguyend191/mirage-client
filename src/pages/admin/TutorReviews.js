import React, { useEffect, useState } from 'react';
import ReviewSummary from '../../components/ReviewSummary';
import Review from '../../components/Review';
import { List } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { getReviewCount } from '../../lib/utils/getReviewCount';

export default function TutorReviews({ selected }) {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    if (selected) {
      const getTutorReview = async () => {
        try {
          const result = await axios.get('/reviews/' + selected.id);
          const ratingCount = getReviewCount(result.data.reviews);
          setReviews({ ...result.data, ratingCount });
        } catch (error) {
          alert(error.response.data.message);
        }
      };
      getTutorReview();
    }
  }, [selected]);
  const reload = async () => {
    try {
      const result = await axios.get('/reviews/' + selected.id);
      const ratingCount = getReviewCount(result.data.reviews);
      setReviews({ ...result.data, ratingCount });
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  let reviewsRender = null;
  if (reviews) {
    reviewsRender = (
      <div>
        <ReviewSummary reviews={reviews} />
        <List
          itemLayout="horizontal"
          dataSource={reviews.reviews}
          renderItem={item => (
            <List.Item>
              <Review review={item} getTutorReview={reload} />
            </List.Item>
          )}
        />
      </div>
    );
  }
  return reviewsRender;
}
