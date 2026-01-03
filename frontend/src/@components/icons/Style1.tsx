import styles from './Style1.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean;
    color?: "primary" | "white" | "black" | "dark" | "light" | "red" | "green" | "default",
    children: React.ReactNode
};

const Style1 = ({color="default", selected, children, ...props}: Props) => {

    return (
        <button {...props} className={`${styles.container} ${styles[color]} ${selected?styles.selected:""}`}>
            {children}
        </button>
    )
}

export default Style1