import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
    children: React.ReactNode,
    width?: number
};

const Style1 = ({children, width=600, ...props}: Props) => {
  return (
    <form className={styles.container} style={{maxWidth: `${width}px`}} {...props}>
      {children}
    </form>
  )
}

export default Style1