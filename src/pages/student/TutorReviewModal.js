import React, { useEffect, useState } from 'react';
import styles from './TutorReviewModal.module.css';
import { Modal, List } from 'antd';
import axios from '../../lib/utils/axiosConfig';
import { getReviewCount } from '../../lib/utils/getReviewCount';
import ReviewSummary from '../../components/ReviewSummary';
import Review from '../../components/Review';


export default function TutorReviewModal({ selected, showReviewModal, setShowReviewModal }) {
  const [reviews, setReviews] = useState(null);

  const getTutorReview = async () => {
    try {
      const result = await axios.get('/reviews/' + selected.profile.id);
      const ratingCount = getReviewCount(result.data.reviews);
      setReviews({ ...result.data, ratingCount });
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    if (selected) {
      getTutorReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);


  return (
    <Modal
      title={selected ? selected.profile.name : null}
      visible={showReviewModal}
      onCancel={() => setShowReviewModal(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ maxHeight: "600px", overflow: "auto" }}
    >
      {reviews ?
        (<div>
          <ReviewSummary
            reviews={reviews}
          />
          <List
            itemLayout="horizontal"
            dataSource={reviews.reviews}
            renderItem={item => (
              <List.Item>
                <Review review={item} getTutorReview={getTutorReview} />
              </List.Item>
            )}
          />,
        </div>)
        : null

      }
    </Modal>
  )
}
