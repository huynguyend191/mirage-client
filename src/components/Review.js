import React, { useContext } from 'react';
import moment from 'moment';
import { Comment, Avatar, Rate, Button } from 'antd';
import { serverUrl } from '../lib/constants';
import { UserOutlined } from '@ant-design/icons';
import { AccountContext } from '../context/AccountContext';
import { ROLES } from '../lib/constants';
import axios from '../lib/utils/axiosConfig';

export default function Review({ review, getTutorReview }) {
  const { account } = useContext(AccountContext);

  const deleteReview = async id => {
    try {
      await axios.delete('/reviews/' + id);
      getTutorReview();
    } catch (error) {
      alert(error.response);
    }
  };

  let deleteBtn = null;
  if (account.role === ROLES.ADMIN || (account.role === ROLES.STUDENT && account.student.id === review.studentId)) {
    deleteBtn = (
      <Button type="link" danger onClick={() => deleteReview(review.id)}>
        Delete
      </Button>
    );
  }

  return (
    <Comment
      author={review.student.name}
      avatar={
        review.student.avatar ? <Avatar src={serverUrl + review.student.avatar} /> : <Avatar icon={<UserOutlined />} />
      }
      content={<p>{review.comment}</p>}
      datetime={moment(review.createdAt).fromNow()}
      actions={[<Rate disabled defaultValue={review.rating} style={{ fontSize: '12px' }} />, deleteBtn]}
    />
  );
}
