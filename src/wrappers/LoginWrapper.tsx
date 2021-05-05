import { Redirect } from 'umi';
import type { FC } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { getStorage, Types } from '@/helpers/storage';

const LoginWrapper: FC = ({ children }) => {
  const isLogin = getStorage(Types.IsLogin, 'local');

  if (isLogin) {
    return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
  }
  return <Redirect to="/login" />;
};

export default LoginWrapper;
