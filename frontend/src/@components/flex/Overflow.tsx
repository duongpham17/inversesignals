import styles from './Overflow.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  children: React.ReactNode,
  sticky?: React.ReactElement | React.ReactNode,
}

const Overflow = ({sticky, children, ...props}:Props) => {
  return (
  <div className={styles.container} {...props}>
    <div className={styles.sticky}>{sticky}</div>
    {children}
  </div>
  )
}

export default Overflow