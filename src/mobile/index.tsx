import type { FC } from 'react';
import { NavBar } from 'antd-mobile';
import 'lib-flexible';

import styles from './index.less';

const MIndexPage: FC = ({ children }) => {
  return (
    <div className={styles.wrap}>
      <NavBar>header</NavBar>
      <div style={{ flex: 1 }}>{children}</div>
      <div className={styles.footer}>footer</div>
    </div>
  );
};

export default MIndexPage;
