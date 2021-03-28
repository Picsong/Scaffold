import type { FC } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

const Wrap: FC = ({ children }) => {
  return <ConfigProvider locale={zhCN}>{children}</ConfigProvider>;
};

export default Wrap;
