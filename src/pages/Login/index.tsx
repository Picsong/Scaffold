import React, { useCallback } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { history } from 'umi';
import type { IUserLoginReq, IUserLoginRes } from '@/services/modules/user';
import { userLogin } from '@/services/modules/user';
import { setStorage, Types } from '@/helpers/storage';
import styles from './index.module.less';

export default function Login() {
  const onFinish = useCallback(async (data: IUserLoginReq) => {
    try {
      const result = await userLogin<IUserLoginRes>({ data });

      if (result.success) {
        message.success('登录成功');
        setStorage(Types.Token, result.data.token, 'local');
        setStorage(Types.UserName, result.data.name, 'local');
        setStorage(Types.Project, result.data.project, 'local');
        setStorage(Types.IsLogin, true, 'local');

        history.replace('/admin');
        return;
      }
      message.warning(result.errorMessage);
    } catch (error) {
      message.error('系统异常');
    }
  }, []);
  // 用户名校验规则
  const loginNameRule = [
    {
      required: true,
      message: '请输入用户名!',
    },
    {
      pattern: /^[a-zA-Z0-9_-]{5,20}$/,
      message: '请输入5-20位用户名（由字母、数字、下划线、减号组成）!',
    },
  ];
  // 密码校验规则
  const passwordRule = [
    {
      required: true,
      message: '请输入密码!',
    },
    {
      pattern: /^[a-zA-Z0-9_-]{5,20}$/,
      message: '请输入5-20位密码（由字母、数字、下划线、减号组成）!',
    },
  ];

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginContent}>
        <ProForm
          onFinish={onFinish}
          submitter={{
            searchConfig: {
              submitText: '登录',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
        >
          <h1 className={styles.loginTitle}>后台管理系统</h1>

          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            name="name"
            placeholder="请输入用户名"
            rules={loginNameRule}
          />
          <ProFormText.Password
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            name="password"
            placeholder="请输入密码"
            rules={passwordRule}
          />
        </ProForm>
      </div>
    </div>
  );
}
