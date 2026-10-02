import styles from './Wrap.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  children: React.ReactNode
}

const Wrap = ({children, ...props}:Props) => {
  return (
    <div className={styles.container} {...props}>
        {children}
    </div>
  )
}

export default Wrap