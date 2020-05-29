import React from 'react';
import { Modal } from 'antd';
import styles from './ReportModal.module.css';

export default function Report({ showReport, selected, setShowReport }) {
  return selected ? (
    <Modal
      title="Report to Admin"
      visible={showReport}
      onCancel={() => setShowReport(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: '450px', overflow: 'auto' }}
    ></Modal>
  ) : null;
}
