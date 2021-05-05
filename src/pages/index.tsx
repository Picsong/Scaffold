import type { FC } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import styles from './index.less';

const IndexPage: FC = ({ children }) => {
  return (
    <div className={styles.layoutWrap}>
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  );
};

export default IndexPage;
