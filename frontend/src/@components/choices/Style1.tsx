import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string, 
  value: string
};

const Style1 = ({label, value, ...props}:Props) => {
    
  return (
    <div className={styles.container}>
      <p>{label}</p>
      <button type="button" {...props}>{value}</button>
    </div>
  )
}

export default Style1