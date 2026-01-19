import styles from './Style3.module.scss';
import React from 'react';

interface Props {
  color?: "default" | "dark",
  label?: string, 
  value?: string | undefined, 
  options: string[],
  onClick: ((name: string) => void);
  light?: boolean,
};

const Style1 = ({label, options, value, onClick, color="default", light=false}:Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onClick(e.target.value);
    };
    
    return (
      <div className={styles.container}>

        <span className={light ? styles.light : ""}>{label} </span>

        <select key={label} onChange={handleChange} value={value} className={styles[color]}>
        {options.map((el, index) => <option key={el+index} value={el}>{el}</option>)}
        </select>

      </div>
  )
}

export default Style1