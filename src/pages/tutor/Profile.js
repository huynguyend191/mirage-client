import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { UserOutlined, UploadOutlined, FileTextOutlined, FileImageOutlined, CheckCircleTwoTone, CloseCircleOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Form, Input, DatePicker, Button, Select, Upload, Alert } from 'antd';
import preferences from '../../lib/preferences';
import moment from 'moment';
import { serverUrl } from '../../lib/constants';
const { Panel } = Collapse;
const { Option } = Select;

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ account: { email: null } });
  const { account, onSignIn } = useContext(AccountContext);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingAva, setLoadingAva] = useState(false);
  const [avatar, setAvatar] = useState([]);

  const getTutorProfile = async () => {
    try {
      const result = await axios.get('/tutors/' + account.tutor.id);
      setProfile(result.data.tutor);
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getTutorProfile();
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
      await axios.put('/tutors/' + profile.id, values);
      getTutorProfile();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response)
    }
  }
  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      const isPdfOrWord = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (isPdfOrWord) {
        setFileList([...fileList, file]);
      }
      return false;
    },
    fileList: fileList,
  };
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
  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('certificates', file);
      });
      await axios('/tutors/certificates/' + profile.account.username, {
        method: "POST",
        data: formData,
      });
      await getTutorProfile();
      setUploading(false);
    } catch (error) {
      console.log(error.response)
      setUploading(false);
    }
  }

  const uploadAvatar = async () => {
    try {
      setLoadingAva(true);
      const formData = new FormData();
      formData.append('avatar', avatar[0]);
      await axios('/tutors/avatar/' + profile.account.username, {
        method: "POST",
        data: formData,
      });
      await getTutorProfile();
      setLoadingAva(false);
    } catch (error) {
      setLoadingAva(false);
      console.log(error.response)
    }

  }

  const resendConfirmation = async() => {
    try {
      await axios.post('/accounts/resend-verify', {email: account.email});
    } catch (error) {
      console.log(error.response)
    }
  }
  let profileStatus;
  if (profile.profileStatus === 1) {
    profileStatus = <p className={styles.statusAccepted}>Your tutor profile is ready</p>
  } else if (profile.profileStatus === 2) {
    profileStatus = <p className={styles.statusPending}>Your tutor profile is being reviewed by Admin</p>
  } else if (profile.profileStatus === 3) {
    profileStatus = <p className={styles.statusRejected}>Your tutor profile is rejected, edit now</p>
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
          ): (
            <span>Your account is unverified <CloseCircleOutlined /><Button type="link" onClick={resendConfirmation}>Resend confirmation email</Button></span>
          )}
          <div className={styles.profileStatus}>
            {profileStatus}
          </div>
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
              interests: profile.interests,
              education: profile.education,
              experience: profile.experience,
              profession: profile.profession,
              student_type: profile.student_type,
              student_lvl: profile.student_lvl,
              accent: profile.accent,
              fluency: profile.fluency,
              reason: profile.reason,
              specialities: (profile.specialities) ? JSON.parse(profile.specialities) : undefined,
              introduction: profile.introduction,
              teaching_styles: (profile.teaching_styles) ? JSON.parse(profile.teaching_styles) : undefined,
            }}
          >
            <Collapse>
              <Panel header="Basic info">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                  <Input placeholder="Your fullname" value={profile.name} />
                </Form.Item>
                <Form.Item name="phone" label="Phone">
                  <Input placeholder="Your phone number (optional)" />
                </Form.Item>
                <Form.Item name="birthdate" label="Birthdate">
                  <DatePicker />
                </Form.Item>
                <Form.Item name="address" label="Address">
                  <Input placeholder="Where do you from? E.g Hanoi, Vietnam" />
                </Form.Item>
                <Form.Item name="avatar" label="Upload avatar">
                  <Upload {...uploadAvaProps} listType="picture-card">
                    <Button icon={<FileImageOutlined /> }>
                      Change avatar
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item {...uploadBtnLayout}>
                  <Button onClick={uploadAvatar} loading={loadingAva} style={{ width: "159px" }}><UploadOutlined /> Upload avatar</Button>
                </Form.Item>
              </Panel>
              <Panel header="CV">
                <Form.Item name="interests" label="Interests">
                  <Input.TextArea placeholder="Share with us everything you want such as interests, hobbies, life experiences" />
                </Form.Item>
                <Form.Item name="education" label="Education">
                  <Input.TextArea placeholder="E.g Bachelor of Information Technology" />
                </Form.Item>
                <Form.Item name="experience" label="Experience">
                  <Input.TextArea placeholder="Your working experience" />
                </Form.Item>
                <Form.Item name="profession" label="Profession">
                  <Input placeholder="Your current or previous jobs" />
                </Form.Item>
                <Form.Item name="reason" label="Reason">
                  <Input.TextArea placeholder="Why do you want to join Mirage?" />
                </Form.Item>
              </Panel>
              <Panel header="Teaching preferences">
                <Form.Item name="student_type" label="Target">
                  <Select placeholder="Who do you want to teach?" >
                    {preferences.STUDENT_TYPE.map(type => {
                      return <Option value={type} key={type}>{type}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="student_lvl" label="Student level">
                  <Select placeholder="You are good at teaching students who are">
                    {preferences.STUDENT_LVL.map(lvl => {
                      return <Option value={lvl} key={lvl}>{lvl}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="accent" label="Accent">
                  <Select placeholder="Your English accent">
                    {preferences.ENG_ACCENT.map(accent => {
                      return <Option value={accent} key={accent}>{accent}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="fluency" label="Fluency">
                  <Select placeholder="Your fluency">
                    {preferences.ENG_FLUENCY.map(fluency => {
                      return <Option value={fluency} key={fluency}>{fluency}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="specialities" label="Specialities">
                  <Select mode="multiple" placeholder="Select your specialities">
                    {preferences.SPECIALITIES.map(spec => {
                      return <Option value={spec} key={spec}>{spec}</Option>
                    })}
                  </Select>
                </Form.Item>
                <Form.Item name="teaching_styles" label="Teaching styles">
                  <Select mode="multiple" placeholder="Your styles">
                    {preferences.TEACHING_STYLE.map(style => {
                      return <Option value={style} key={style}>{style}</Option>
                    })}
                  </Select>
                </Form.Item>
              </Panel>
              <Panel header="Teaching certificates (optional)">
                {/* render uploaded files */}
                {(profile.certificates && JSON.parse(profile.certificates).length > 0) ?
                  (<Form.Item {...formItemLayout} label="Uploaded file(s)">
                    <div className={styles.uploadedCert}>
                      {profile.certificates ? (
                        JSON.parse(profile.certificates).map((cert, index) => {
                          return <a key={index} href={serverUrl + cert.path}>{cert.originalname}</a>
                        })
                      ) : null}
                    </div>
                  </Form.Item>) :null
                }
                <Form.Item name="files" label="Upload certificate">
                  <Upload {...uploadProps} listType="picture-card">
                    <Button icon={<FileTextOutlined />}>
                      Select File
                    </Button>
                  </Upload>
                </Form.Item>
                <Form.Item {...uploadBtnLayout}>
                  <Button onClick={handleUpload} loading={uploading} style={{ width: "132px" }}><UploadOutlined /> Upload</Button>
                </Form.Item>
                <Alert message="Warning: All your previous upload will be removed when uploading new certificates" type="warning" showIcon />
              </Panel>
              <Panel header="Introduce yourself">
                <Form.Item name="introduction" label="Introduction">
                  <Input.TextArea placeholder="Introduce yourself" />
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
  );
}
