import styles from './Flex.module.scss';
import React from 'react';

interface Props {
  children: React.ReactNode
}

const Flex = ({children}:Props) => {
  return (
    <div className={styles.container}>
        {children}
    </div>
  )
}

export default Flex