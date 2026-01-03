import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.DetailedHTMLProps<React.ProgressHTMLAttributes<HTMLProgressElement>, HTMLProgressElement> {

};

const Style1 = ({...props}: Props) => {
  return (
    <div className={styles.container}>
        <progress {...props} />
    </div>
  )
}

export default Style1