import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { UserOutlined, UploadOutlined, FileTextOutlined, FileImageOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Form, Input, DatePicker, Button, Select, Upload, Alert, Tag, Spin } from 'antd';
import preferences from '../../lib/preferences';
import moment from 'moment';
import { serverUrl } from '../../lib/constants';
import VideoRecorder from './VideoRecorder';
import VideoPlayer from './VideoPlayer';
import { PROFILE_STATUS } from '../../lib/constants';
const { Panel } = Collapse;
const { Option } = Select;

export default function Profile() {
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ account: { email: null } });
  const { account } = useContext(AccountContext);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loadingAva, setLoadingAva] = useState(false);
  const [avatar, setAvatar] = useState([]);
  const [isRecord, setIsRecord] = useState(true);

  const getTutorProfile = async () => {
    try {
      setLoadingProfile(true);
      const result = await axios.get('/tutors/' + account.tutor.id);
      setProfile(result.data.tutor);
      if (result.data.tutor.video) {
        setIsRecord(false);
      }
      setLoadingProfile(false);
    } catch (error) {
      setLoadingProfile(true);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    getTutorProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatarProfile =
    profile && profile.avatar ? (
      <Avatar src={serverUrl + profile.avatar} size={100} />
    ) : (
      <Avatar icon={<UserOutlined />} size={100} />
    );

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };
  const uploadBtnLayout = {
    wrapperCol: { offset: 5, span: 16 }
  };
  const onSubmit = async values => {
    try {
      setLoading(true);
      await axios.put('/tutors/' + profile.id, values);
      getTutorProfile();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response.data.message);
    }
  };
  const uploadProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      const isPdfOrWord =
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (isPdfOrWord) {
        setFileList([...fileList, file]);
      }
      return false;
    },
    fileList: fileList
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
    fileList: avatar
  };
  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('certificates', file);
      });
      await axios('/tutors/certificates/' + profile.account.username, {
        method: 'POST',
        data: formData
      });
      await getTutorProfile();
      setUploading(false);
    } catch (error) {
      alert(error.response.data.message);
      setUploading(false);
    }
  };

  const uploadAvatar = async () => {
    try {
      setLoadingAva(true);
      const formData = new FormData();
      formData.append('avatar', avatar[0]);
      await axios('/tutors/avatar/' + profile.account.username, {
        method: 'POST',
        data: formData
      });
      await getTutorProfile();
      window.location.reload(false);
      setLoadingAva(false);
    } catch (error) {
      setLoadingAva(false);
      alert(error.response.data.message);
    }
  };

  const resendConfirmation = async () => {
    try {
      await axios.post('/accounts/resend-verify', { email: profile.account.email });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  let profileStatus;
  if (profile.profileStatus === PROFILE_STATUS.ACCEPTED) {
    profileStatus = <Alert message="Your tutor profile is ready" type="success" showIcon />;
  } else if (profile.profileStatus === PROFILE_STATUS.PENDING) {
    profileStatus = <Alert message="Your tutor profile is being reviewed by Admin" type="info" showIcon />;
  } else if (profile.profileStatus === PROFILE_STATUS.REJECTED) {
    profileStatus = <Alert message="Your tutor profile is rejected, edit now" type="error" showIcon />;
  }
  return (
    <Spin spinning={loadingProfile}>
      <div className={styles.profile}>
        <div className={styles.accountInfoContainer}>
          {avatarProfile}
          <div className={styles.accountInfo}>
            <p className={styles.name}>{profile.name}</p>
            <p>Email: {profile.account.email}</p>
            {account.verification ? (
              <Tag color="success">Verified</Tag>
            ) : (
              <span>
                <Tag color="default">Unverified</Tag>
                <Button type="link" onClick={resendConfirmation}>
                  Resend confirmation email
                </Button>
              </span>
            )}
            <div className={styles.profileStatus}>{profileStatus}</div>
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
                student_type: profile.student_type ? profile.student_type : undefined,
                student_lvl: profile.student_lvl ? profile.student_lvl : undefined,
                accent: profile.accent ? profile.accent : undefined,
                fluency: profile.fluency ? profile.fluency : undefined,
                reason: profile.reason,
                specialities: profile.specialities ? JSON.parse(profile.specialities) : undefined,
                introduction: profile.introduction,
                teaching_styles: profile.teaching_styles ? JSON.parse(profile.teaching_styles) : undefined
              }}
            >
              <Collapse defaultActiveKey={['1']}>
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
                  <Form.Item name="address" label="Address">
                    <Input placeholder="Where do you from? E.g Hanoi, Vietnam" />
                  </Form.Item>
                  <Form.Item name="avatar" label="Upload avatar">
                    <Upload {...uploadAvaProps} listType="picture-card">
                      <Button icon={<FileImageOutlined />}>Change avatar</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item {...uploadBtnLayout}>
                    <Button
                      disabled={avatar.length <= 0}
                      onClick={uploadAvatar}
                      loading={loadingAva}
                      style={{ width: '159px' }}
                      icon={<UploadOutlined />}
                    >
                      Upload avatar
                    </Button>
                  </Form.Item>
                </Panel>
                <Panel header="CV" key="2">
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
                <Panel header="Teaching preferences" key="3">
                  <Form.Item name="student_type" label="Target">
                    <Select placeholder="Who do you want to teach?">
                      {preferences.STUDENT_TYPE.map(type => {
                        return (
                          <Option value={type} key={type}>
                            {type}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="student_lvl" label="Student level">
                    <Select placeholder="You are good at teaching students who are">
                      {preferences.STUDENT_LVL.map(lvl => {
                        return (
                          <Option value={lvl} key={lvl}>
                            {lvl}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="accent" label="Accent">
                    <Select placeholder="Your English accent">
                      {preferences.ENG_ACCENT.map(accent => {
                        return (
                          <Option value={accent} key={accent}>
                            {accent}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="fluency" label="Fluency">
                    <Select placeholder="Your fluency">
                      {preferences.ENG_FLUENCY.map(fluency => {
                        return (
                          <Option value={fluency} key={fluency}>
                            {fluency}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="specialities" label="Specialities">
                    <Select mode="multiple" placeholder="Select your specialities">
                      {preferences.SPECIALITIES.map(spec => {
                        return (
                          <Option value={spec} key={spec}>
                            {spec}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="teaching_styles" label="Teaching styles">
                    <Select mode="multiple" placeholder="Your styles">
                      {preferences.TEACHING_STYLE.map(style => {
                        return (
                          <Option value={style} key={style}>
                            {style}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Panel>
                <Panel header="Teaching certificates (optional)" key="4">
                  {/* render uploaded files */}
                  {profile.certificates && JSON.parse(profile.certificates).length > 0 ? (
                    <Form.Item {...formItemLayout} label="Uploaded file(s)">
                      <div className={styles.uploadedCert}>
                        {profile.certificates
                          ? JSON.parse(profile.certificates).map((cert, index) => {
                              return (
                                <a key={index} href={serverUrl + cert.path}>
                                  <FileDoneOutlined />
                                  {cert.originalname}
                                </a>
                              );
                            })
                          : null}
                      </div>
                    </Form.Item>
                  ) : null}
                  <Form.Item name="files" label="Upload certificate">
                    <Upload {...uploadProps} listType="picture-card">
                      <Button icon={<FileTextOutlined />}>Select File</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item {...uploadBtnLayout}>
                    <Button
                      onClick={handleUpload}
                      loading={uploading}
                      style={{ width: '132px' }}
                      icon={<UploadOutlined />}
                    >
                      Upload
                    </Button>
                  </Form.Item>
                  <Alert
                    message="Warning: All your previous upload will be removed when uploading new certificates"
                    type="warning"
                    showIcon
                  />
                </Panel>
                <Panel header="Introduce yourself" key="5">
                  <Form.Item name="introduction" label="Introduction">
                    <Input.TextArea placeholder="Introduce yourself" />
                  </Form.Item>
                  <div>
                    <p className={styles.introInstruct}>
                      Record a video to emphasize your teaching style, expertise and personality to help students
                      overcome their nerve when speaking with foreigners. A friendly video will encourage the stundents
                      to call you. A few helpful tips:
                    </p>
                    <div className={styles.introTips}>
                      <p>1. Make sure your camera/webcam is working properly</p>
                      <p>2. Find a clean and quiet room</p>
                      <p>3. Look at the camera and smile</p>
                      <p>4. Dress smart</p>
                      <p>5. Speak for 1-2 minutes</p>
                    </div>
                  </div>
                  <Form.Item label="Intro video">
                    {isRecord ? (
                      <VideoRecorder
                        cancelRecord={() => setIsRecord(false)}
                        existedVideo={profile.video}
                        refreshProfile={getTutorProfile}
                      />
                    ) : (
                      <VideoPlayer recordNew={() => setIsRecord(true)} />
                    )}
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
    </Spin>
  );
}
