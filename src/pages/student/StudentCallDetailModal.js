import React from 'react';
import { Modal } from 'antd';
import 'video.js/dist/video-js.css';
import { serverUrl } from '../../lib/constants';
import styles from './StudentCallDetailModal.module.css';
import moment from 'moment';
import CallRecordPlayer from '../../components/CallRecordPlayer';

export default function StudentCallDetailModal({ showCallDetail, selected, setShowCallDetail }) {
  return selected ? (
    <Modal
      title={"Tutor recorded video - " + moment(selected.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
      visible={showCallDetail}
      onCancel={() => setShowCallDetail(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: "450px", overflow: "auto" }}
    >
      <div className={styles.recordHolder}>
        <CallRecordPlayer
          url={`${serverUrl}api/call-histories/${selected.id}/tutorVideo`}
        />
      </div>
    </Modal>
  ) : null
}