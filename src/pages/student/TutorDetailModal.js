import React from 'react';
import styles from './TutorDetailModal.module.css';
import { serverUrl } from '../../lib/constants';
import VideoPlayer from '../admin/VideoPlayer';
import { FileDoneOutlined } from '@ant-design/icons';
import { Tag, Modal, Descriptions } from 'antd';

export default function TutorDetailModal({ selected, showDetailModal, setShowDetailModal }) {
  return (
    <Modal
      title={selected ? selected.profile.name : null}
      visible={showDetailModal}
      onCancel={() => setShowDetailModal(false)}
      footer={null}
      width="600px"
      destroyOnClose
      bodyStyle={{ height: "600px", overflow: "auto" }}
    >
      <div>
        <div>
          {selected ? (
            <div>
              <div className={styles.detailWrapper}>
                {selected.profile.video ? <div className={styles.videoWrapper}><VideoPlayer username={selected.username} /></div> : null}
                {selected.profile.introduction}
              </div>
              <div className={styles.detailWrapper}>
                <Descriptions bordered size="small" column={1} title="Teaching preferences">
                  <Descriptions.Item label="Student level">{selected.profile.student_lvl}</Descriptions.Item>
                  <Descriptions.Item label="Student type">{selected.profile.student_type}</Descriptions.Item>
                  <Descriptions.Item label="Accent">{selected.profile.accent}</Descriptions.Item>
                  <Descriptions.Item label="Fluency">{selected.profile.fluency}</Descriptions.Item>
                  <Descriptions.Item label="Tutor styles"> {selected.profile.teaching_styles ? JSON.parse(selected.profile.teaching_styles).map(style => { return <Tag key={style}>{style}</Tag> }) : null}</Descriptions.Item>
                  <Descriptions.Item label="Specialities">{selected.profile.specialities ? JSON.parse(selected.profile.specialities).map(speciality => { return <Tag key={speciality}>{speciality}</Tag> }) : null}</Descriptions.Item>
                </Descriptions>
              </div>
              <div className={styles.detailWrapper}>
                <Descriptions bordered size="small" column={1} title="CV">
                  <Descriptions.Item label="Interests">{selected.profile.interests}</Descriptions.Item>
                  <Descriptions.Item label="Education">{selected.profile.education}</Descriptions.Item>
                  <Descriptions.Item label="Experience">{selected.profile.experience}</Descriptions.Item>
                  <Descriptions.Item label="Profession">{selected.profile.profession}</Descriptions.Item>
                  <Descriptions.Item label="Reason">{selected.profile.reason}</Descriptions.Item>
                </Descriptions>
              </div>
              <div className={styles.detailWrapper}>
                <p className={styles.detailTitle}>Certificates</p>
                <div className={styles.uploadedCert}>
                  {selected.profile.certificates ? (
                    JSON.parse(selected.profile.certificates).map((cert, index) => {
                      return (<a key={index} href={serverUrl + cert.path}><FileDoneOutlined />{cert.originalname}</a>);
                    })
                  ) : null}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
