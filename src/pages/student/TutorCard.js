import React from 'react';
import styles from './TutorCard.module.css';
import { Card, Avatar, Tooltip, Tag, Rate } from 'antd';
import { VideoCameraFilled, AudioFilled, UserOutlined, CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { serverUrl, STATUS } from '../../lib/constants';

export default function TutorCard({ callWithVideo, openDetailModal, item, openReviewlModal }) {
  return (
    <Card
      actions={[
        <Tooltip title="Video call"><VideoCameraFilled onClick={() => callWithVideo(true, item)} /></Tooltip>,
        <Tooltip title="Audio call"><AudioFilled onClick={() => callWithVideo(false, item)} /></Tooltip>,
        <Tooltip title="Profile"><UserOutlined onClick={() => openDetailModal(item)} /></Tooltip>
      ]}
    >
      <div className={styles.tutorCard}>
        <div className={styles.tutorInfo}>
          <div>
            {item.profile.avatar ?
              <Avatar src={serverUrl + item.profile.avatar} size={80} />
              : <Avatar icon={<UserOutlined />} size={80} />
            }
          </div>

          <div className={styles.tutorInfoDetail}>
            <div className={styles.tutorName}>
              {item.profile.name}
              {item.status === STATUS.AVAILABLE ?
                <CheckCircleFilled style={{ color: "#52c41a", fontSize: "12px", marginLeft: "3px" }} /> :
                <Tooltip title="Busy"><MinusCircleFilled style={{ color: "red", fontSize: "12px", marginLeft: "3px" }} /></Tooltip>
              }
            </div>
            <div>
              {(item.profile.certificates && JSON.parse(item.profile.certificates.length) > 0) ?
                <Tag>Teaching certificates</Tag> :
                null
              }
            </div>
            {item.profile.review ?
              <Tooltip placement="bottomRight" title="Click to show reviews">
                <div onClick={() => openReviewlModal(item)} className={styles.reviewWrapper}>
                  <Rate disabled defaultValue={Number((Math.round(item.profile.review.avg * 2) / 2).toFixed(1))} allowHalf />
                  <span className={styles.reviewCount}>/ {item.profile.review.count} review(s)</span>
                </div>
              </Tooltip>
              : null
            }

          </div>
        </div>
        <p>
          {item.profile.introduction}
        </p>
      </div>
    </Card>
  )
}
