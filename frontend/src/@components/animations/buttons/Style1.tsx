import styles from './Style1.module.scss';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  children: React.ReactNode,
  open: boolean,
}

const Style1 = ({open, children, ...props}: Props) => {
  return (
    <button className={styles.container} {...props}>
      <div>{children}</div>
      <AiOutlinePlus className={open?styles.open:""}/>
    </button>
  )
}

export default Style1