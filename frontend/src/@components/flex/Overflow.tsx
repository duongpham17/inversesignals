import styles from './Overflow.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode,
  sticky?: React.ReactElement | React.ReactNode,
}

const Overflow = ({sticky, children}:Props) => {
  return (
  <div className={styles.container}>
    <div className={styles.sticky}>{sticky}</div>
    {children}
  </div>
  )
}

export default Overflow