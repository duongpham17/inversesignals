import styles from './Style2.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>{
  children: React.ReactNode,
  color?: "red" | "green" | "primary" | "dark"
}

const Style2 = ({children, color="primary", ...props}: Props) => {
  return (
    <div className={`${styles.container} ${styles[color]}`} {...props}>
      {children}
    </div>
  )
}

export default Style2