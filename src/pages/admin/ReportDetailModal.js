import React from 'react';
import { Modal, Button } from 'antd';
import 'video.js/dist/video-js.css';
import { serverUrl } from '../../lib/constants';
import CallRecordPlayer from '../../components/CallRecordPlayer';
import styles from './ReportDetailModal.module.css';
import moment from 'moment';
import { REPORT_STATE, ROLES } from '../../lib/constants';
import axios from '../../lib/utils/axiosConfig';

export default function ReportDetailModal({ showReportDetail, selected, setShowReportDetail, getReports }) {
  const updateReport = async state => {
    try {
      await axios.put('/reports/' + selected.id, {
        state
      });
      getReports();
      setShowReportDetail(false);
    } catch (error) {
      setShowReportDetail(false);
    }
  };
  return selected ? (
    <Modal
      title={'Report - ' + moment(selected.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
      visible={showReportDetail}
      onCancel={() => setShowReportDetail(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: '600px', overflow: 'auto' }}
    >
      <div className={styles.reportDetail}>
        <div className={styles.reportDetailContent}>
          <div className={styles.reportLabel}>
            Call at:{' '}
            <span className={styles.reportContent}>
              {moment(selected.call_history.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
          </div>
          <div className={styles.reportLabel}>
            Reason: <span className={styles.reportContent}>{selected.reason}</span>
          </div>
          <div className={styles.reportLabel}>
            Description: <span className={styles.reportContent}>{selected.description}</span>
          </div>
          {selected.account.role === ROLES.STUDENT ? (
            <div>
              <div className={styles.reportLabel}>
                Name: <span className={styles.reportContent}>{selected.call_history.student.name}</span>
              </div>
              <CallRecordPlayer url={`${serverUrl}api/call-histories/${selected.call_history.id}/studentVideo`} />
            </div>
          ) : (
            <div>
              <div className={styles.reportLabel}>
                Name: <span className={styles.reportContent}>{selected.call_history.tutor.name}</span>
              </div>
              <CallRecordPlayer url={`${serverUrl}api/call-histories/${selected.call_history.id}/tutorVideo`} />
            </div>
          )}
        </div>
        {selected.state === REPORT_STATE.PENDING ? (
          <div className={styles.statusControlBtnWrapper}>
            <Button
              className={styles.statusControlBtn}
              style={{ backgroundColor: '#52c41a', color: 'white', borderColor: '#52c41a' }}
              onClick={() => updateReport(REPORT_STATE.RESOLVED)}
            >
              Resolve
            </Button>
            <Button
              type="primary"
              danger
              className={styles.statusControlBtn}
              onClick={() => updateReport(REPORT_STATE.CANCELLED)}
            >
              Cancel
            </Button>
          </div>
        ) : null}
        {selected.state === REPORT_STATE.RESOLVED ? (
          <div className={styles.statusControlBtnWrapper}>
            <Button className={styles.statusControlBtn} onClick={() => updateReport(REPORT_STATE.PENDING)}>
              Pending
            </Button>
            <Button
              type="primary"
              danger
              className={styles.statusControlBtn}
              onClick={() => updateReport(REPORT_STATE.CANCELLED)}
            >
              Cancel
            </Button>
          </div>
        ) : null}
        {selected.state === REPORT_STATE.CANCELLED ? (
          <div className={styles.statusControlBtnWrapper}>
            <Button
              className={styles.statusControlBtn}
              style={{ backgroundColor: '#52c41a', color: 'white', borderColor: '#52c41a' }}
              onClick={() => updateReport(REPORT_STATE.RESOLVED)}
            >
              Resolve
            </Button>
            <Button className={styles.statusControlBtn} onClick={() => updateReport(REPORT_STATE.PENDING)}>
              Pending
            </Button>
          </div>
        ) : null}
      </div>
    </Modal>
  ) : null;
}
