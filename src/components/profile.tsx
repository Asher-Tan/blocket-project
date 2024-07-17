import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';

import api from '../libs/api';

import './profile.css';

type ProfileObj = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type Props = {
  id: string | null;
  onChange: (id: string) => void;
};

const Profile: React.FC<Props> = function Profile(props) {
  const { id, onChange } = props;

  const [isEdit, setEdit] = useState(false);
  const [profile, setProfile] = useState<ProfileObj | undefined>();
  const [form] = Form.useForm();

  const fetchProfile = (profileId?: string | null) => {
    if (!profileId) return;
    api.get(`/api/profile/${profileId}`).then((res) => {
      setProfile(res.data.profile);
    });
  };

  useEffect(() => {
    fetchProfile(id);
  }, [id, isEdit]);

  const onEdit = () => {
    if (isEdit) {
      form.resetFields();
    } else {
      form.setFieldsValue(profile);
    }
    setEdit(!isEdit);
  };
  const onFinish = (values: ProfileObj) => {
    const method = id ? 'put' : 'post';
    const url = id ? `/api/profile/${id}` : '/api/profile';
    api({
      method,
      url,
      data: values,
    }).then((res) => {
      onChange(res.data.profile.id);
      setEdit(false);
    });
  };

  return (
    <div className="profile">
      {isEdit ? (
        <Form
          form={form}
          key="editForm"
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off">
          <Form.Item label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' },
            ]}>
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} style={{ maxWidth: 600 }}>
          <Form.Item label="用户名" name="name">
            <div className="text">{profile?.name}</div>
          </Form.Item>
          <Form.Item label="邮箱" name="email">
            <div className="text">{profile?.email}</div>
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <div className="text">{profile?.phone}</div>
          </Form.Item>
        </Form>
      )}
      <div className="actions">
        <Button onClick={onEdit}>{isEdit ? '取消' : '编辑'}</Button>
        {isEdit && (
          <Button type="primary" onClick={() => form.submit()}>
            保存
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
