import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  children: React.ReactNode,
  color?: "red" | "green" | "primary" | "dark"
}

const Style1 = ({children, color="primary", ...props}: Props) => {
  return (
    <div className={`${styles.container} ${styles[color]}`} {...props}>
      {children}
      <span className={styles.cornerbl}></span>
      <span className={styles.cornerbr}></span>
    </div>
  )
}

export default Style1