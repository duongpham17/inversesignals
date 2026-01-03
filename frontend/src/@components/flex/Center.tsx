import styles from './Center.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode
}

const Center = ({children}:Props) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}

export default Center