import React from 'react';
import styles from './TutorReviewModal.module.css';
import { Modal } from 'antd';

export default function TutorReviewModal({ selected, showReviewModal, setShowReviewModal }) {
  return (
    <Modal
      title={selected ? selected.profile.name : null}
      visible={showReviewModal}
      onCancel={() => setShowReviewModal(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: "600px", overflow: "auto" }}
    >
      Review
    </Modal>
  )
}
