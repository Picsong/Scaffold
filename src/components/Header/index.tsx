import styles from './index.less';

export default function Header() {
  return (
    <div className={styles.wrap}>
      <div
        className="inner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
          padding: '0 15px',
        }}
      >
        <div>header</div>
        <h1>logo</h1>
      </div>
    </div>
  );
}
