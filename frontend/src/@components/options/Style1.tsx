import styles from './Style1.module.scss';
import React from 'react';

interface Props {
  color?: "dark",
  label1?: string | number, 
  label2?: React.ReactNode, 
  value?: string | undefined, 
  options: string[],
  onClick: ((name: string) => void);
};

const Style1 = ({label1, label2, options, value, onClick}:Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onClick(e.target.value);
    };
    
    return (
      <div className={styles.container}>

          <div className={styles.labels}>
            <p>{label1}</p>
            {label2}
          </div>

          <select key={label1} onChange={handleChange} value={value}>
            {options.map((el, index) => <option key={el+index} value={el}>{el}</option>)}
          </select>

      </div>
  )
}

export default Style1