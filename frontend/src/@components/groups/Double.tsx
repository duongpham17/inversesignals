import styles from './Double.module.scss';

type Props = {
  children: React.ReactNode;
  columns?: number;
};

const Double = ({ children, columns = 2 }: Props) => {
  return (
    <div className={styles.container} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`}}>
      {children}
    </div>
  );
};

export default Double