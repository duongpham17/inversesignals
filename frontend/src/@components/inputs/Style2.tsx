import styles from './Style2.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string, 
  error?: boolean,
  light?: boolean
};

const Style2 = ({label, error, light=true, ...props}:Props) => {
    
  return (
    <div className={styles.container}>

      <span className={light ? styles.light : ""}>{label} </span>

      <input {...props} className={error ? styles.error : ""} />

    </div>
  )
}

export default Style2