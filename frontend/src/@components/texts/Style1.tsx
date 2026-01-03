import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {
  color?: "default" | "light" | "dark" | "red" | "green" | "primary",
  children: React.ReactNode, 
  size?: any,
};

const Style1 = ({children, color="default", size, ...props}: Props) => {
  return (
    <p className={styles[color]} style={{fontSize: size}} {...props}>{children}</p>
  )
}

export default Style1