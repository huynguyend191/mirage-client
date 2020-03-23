import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { Avatar, Collapse, Form, Input, DatePicker, Button, Select, Upload, Alert } from 'antd';
import { UserOutlined, UploadOutlined, FileImageOutlined, CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import preferences from '../../lib/preferences';
import moment from 'moment';
import { serverUrl } from '../../lib/constants';
const { Option } = Select;
const { Panel } = Collapse;

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ account: { email: null } });
  const { account } = useContext(AccountContext);
  const [loadingAva, setLoadingAva] = useState(false);
  const [avatar, setAvatar] = useState([]);

  const getStudentProfile = async () => {
    try {
      const result = await axios.get('/students/' + account.student.id);
      setProfile(result.data.student);
      console.log(result.data)
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getStudentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatarProfile = (profile && profile.avatar) ?
    <Avatar src={serverUrl + profile.avatar} size={100} />
    : <Avatar icon={<UserOutlined />} size={100} />

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const uploadBtnLayout = {
    wrapperCol: { offset: 5, span: 16 }
  }
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/students/' + profile.id, values);
      getStudentProfile();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response)
    }
  }

  const uploadAvaProps = {
    onRemove: file => {
      setAvatar([]);
    },
    beforeUpload: file => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (isJpgOrPng) {
        setAvatar([file]);
      }
      return false;
    },
    fileList: avatar,
  }


  const uploadAvatar = async () => {
    try {
      setLoadingAva(true);
      const formData = new FormData();
      formData.append('avatar', avatar[0]);
      await axios('/students/avatar/' + profile.account.username, {
        method: "POST",
        data: formData,
      });
      await getStudentProfile();
      setLoadingAva(false);
    } catch (error) {
      setLoadingAva(false);
      console.log(error.response)
    }
  }

  const resendConfirmation = async () => {
    try {
      await axios.post('/accounts/resend-verify', { email: account.email });
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
    <div className={styles.profile}>
      <div className={styles.accountInfoContainer}>
        {avatarProfile}
        <div className={styles.accountInfo}>
          <p className={styles.name}>{profile.name}</p>
          <p>Email: {profile.account.email}</p>
          {account.verification ? (
            <span>Your account is verified <CheckCircleTwoTone twoToneColor="#26d701" /></span>
          ) : (
              <span>Your account is unverified <CloseCircleOutlined /><Button type="link" onClick={resendConfirmation}>Resend confirmation email</Button></span>
            )}
        </div>
      </div>
      <div className={styles.collapse}>
        {profile.name ? (
          <Form
            {...formItemLayout}
            onFinish={onSubmit}
            initialValues={{
              name: profile.name,
              phone: profile.phone,
              birthdate: profile.birthdate ? moment(profile.birthdate) : undefined,
              address: profile.address,
              student_type: profile.student_type? profile.student_type: undefined,
              student_lvl: profile.student_lvl? profile.student_lvl : undefined,
              accent: profile.accent? profile.accent: undefined,
              specialities: (profile.specialities) ? JSON.parse(profile.specialities) : undefined,
              teaching_styles: (profile.teaching_styles) ? JSON.parse(profile.teaching_styles) : undefined,
            }}
          >
            <Collapse defaultActiveKey={["1", "2"]}>
              <Panel header="Basic info" key="1">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                  <Input placeholder="Your fullname" value={profile.name} />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input placeholder="Your phone number (optional)" />
                </Form.Item>
                <Form.Item name="birthdate" label="Birthdate">
                  <DatePicker />
                </Form.Item>
                <Form.Item name="avatar" label="Upload avatar">
                  <Upload {...uploadAvaProps} listType="picture-card">
                    <Button icon={<FileImageOutlined />}>
                      Change avatar
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item {...uploadBtnLayout}>
                  <Button onClick={uploadAvatar} loading={loadingAva} style={{ width: "159px" }}><UploadOutlined /> Upload avatar</Button>
                </Form.Item>
              </Panel>
              <Panel header="Study preferences" key="2">
              <Alert style={{marginBottom: "15px"}} message="Complete your profile to help finding appropriate tutors easier" type="info" showIcon />
                <Form.Item name="student_type" label="Type">
                  <Select placeholder="What type of student are you?" >
                    {preferences.STUDENT_TYPE.map(type => {
                      return <Option value={type} key={type}>{type}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="student_lvl" label="Your level">
                  <Select placeholder="Your English level">
                    {preferences.STUDENT_LVL.map(lvl => {
                      return <Option value={lvl} key={lvl}>{lvl}</Option>
                    })}
                  </Select> 
                </Form.Item>
                <Form.Item name="accent" label="Favorite accent">
                  <Select placeholder="What is your favorite English accent?">
                    {preferences.ENG_ACCENT.map(accent => {
                      return <Option value={accent} key={accent}>{accent}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="specialities" label="Specialities">
                  <Select mode="multiple" placeholder="What do you want to study?">
                    {preferences.SPECIALITIES.map(spec => {
                      return <Option value={spec} key={spec}>{spec}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="teaching_styles" label="Teaching styles">
                  <Select mode="multiple" placeholder="Which styles of teaching do you prefer?">
                    {preferences.TEACHING_STYLE.map(style => {
                      return <Option value={style} key={style}>{style}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Panel>
            </Collapse>
            <div className={styles.submitWrapper}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update profile
              </Button>
            </div>
          </Form>
        ) : null}
      </div>
    </div>
  )
}
