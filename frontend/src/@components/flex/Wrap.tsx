import styles from './Wrap.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode
}

const Wrap = ({children}:Props) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}

export default Wrap