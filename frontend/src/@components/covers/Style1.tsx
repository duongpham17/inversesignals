import styles from './Style1.module.scss';
import React, {ReactNode, ReactElement} from 'react';

interface Types {
  children: ReactNode | ReactElement,
  onClose?: React.MouseEventHandler<HTMLDivElement>
};

export const Style1 = ({children, onClose}: Types) => {

  return (
    <div className={styles.container} onClick={onClose}>
      {children}
    </div>
  )
}

export default Style1