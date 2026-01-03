import styles from './Style2.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string, 
  value: string[],
  callback: (value: string) => void
};

const Style1 = ({label, value, callback, ...props}:Props) => {
    
  return (
    <div className={styles.container}>
      <p>{label}</p>
      <div className={styles.choice}>
        {value.map(el => 
            <button key={el} type="button" onClick={() => callback(el)} {...props}>{el}</button>
        )}
      </div>
    </div>
  )
}

export default Style1