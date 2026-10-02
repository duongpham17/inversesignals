import styles from './Center.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  children: React.ReactNode
}

const Center = ({children, ...props}:Props) => {
  return (
    <div className={styles.container} {...props}>
        {children}
    </div>
  )
}

export default Center