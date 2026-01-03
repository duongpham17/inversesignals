"use client"

import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    label1?: string | number, 
    label2?: string | number | React.ReactNode,
    error?: boolean,
    height?: number,
};

const Style1 = ({label1, label2, height=100, error, ...props}:Props) => {
    
  return (
    <div className={styles.container}>

        {label1 && !label2 && 
            <label className={styles.single}>
                <span>{label1}</span>
            </label>
        }

        {label1 && label2 && 
            <label className={styles.double}> 
                <span>{label1}</span>
                {error ? <small className={styles.error}>{label2}</small> : <small>{label2}</small>}
            </label>
        }

        <textarea {...props} style={{minHeight: `${height}px`}}/>

    </div>
  )
}

export default Style1