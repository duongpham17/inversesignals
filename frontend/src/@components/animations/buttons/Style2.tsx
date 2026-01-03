import styles from './Style2.module.scss';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

interface Props extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
  children: React.ReactNode,
  open: boolean,
}

const Style2 = ({open, children, ...props}: Props) => {
  return (
    <button className={styles.container} {...props}>
      <AiOutlinePlus className={open?styles.open:""}/>
      <div>{children}</div>
    </button>
  )
}

export default Style2