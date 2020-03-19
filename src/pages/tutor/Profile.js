import React, { useEffect, useState, useContext } from 'react';
import styles from './Profile.module.css';
import axios from '../../lib/utils/axiosConfig';
import { AccountContext } from '../../context/AccountContext';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Collapse, Form, Input, DatePicker, Button, Select } from 'antd';
import preferences from '../../lib/preferences';
import moment from 'moment';
const { Panel } = Collapse;
const { Option } = Select;

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ account: { email: null } });
  const { account } = useContext(AccountContext);

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

  const avatar = (profile && profile.avatar) ?
    <img src={profile.avatar} alt="" />
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
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.put('/tutors/' + profile.id, values);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.response)
    }
  }

  return (
    <div className={styles.profile}>
      <div className={styles.accountInfoContainer}>
        {avatar}
        <div className={styles.accountInfo}>
          <p className={styles.name}>{profile.name}</p>
          <p>Email: {profile.account.email}</p>
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
              birthdate: moment(profile.birthdate),
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
              introduction: profile.introduction
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
                  <Input.TextArea placeholder="Why do you want to teach English?" />
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
              </Panel>
              <Panel header="Teaching certificates (optional)">
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
