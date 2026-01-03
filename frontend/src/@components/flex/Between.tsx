import styles from './Between.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode
}

const Between = ({children}:Props) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}

export default Between