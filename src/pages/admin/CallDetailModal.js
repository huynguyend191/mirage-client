import React from 'react';
import { Modal } from 'antd';
import 'video.js/dist/video-js.css';
import { serverUrl } from '../../lib/constants';
import CallRecordPlayer from './CallRecordPlayer';
import styles from './CallDetailModal.module.css';
import moment from 'moment';

export default function CallDetailModal({ showCallDetail, selected, setShowCallDetail }) {
  return selected ? (
    <Modal
      title={"Call - " + moment(selected.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
      visible={showCallDetail}
      onCancel={() => setShowCallDetail(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: "600px", overflow: "auto" }}
    >
      <div>
        <div className={styles.recordTitle}>Student record:</div>
        <CallRecordPlayer
          url={`${serverUrl}api/call-histories/${selected.id}/studentVideo`}
        />
        <div className={styles.recordTitle}>Tutor record:</div>
        <CallRecordPlayer
          url={`${serverUrl}api/call-histories/${selected.id}/tutorVideo`}
        />
      </div>
    </Modal>
  ) : null
}
