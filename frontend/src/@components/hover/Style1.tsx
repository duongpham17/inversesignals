import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    message: string,
    children: React.ReactNode
}

const Style1 = ({message, children, ...props}: Props) => {
  return (
    <div className={styles.container} {...props}>
        <div className={styles.item}>
            {children}
        </div>
        <div className={styles.message}>
            <p>{message}</p>
        </div>
    </div>
  )
}

export default Style1