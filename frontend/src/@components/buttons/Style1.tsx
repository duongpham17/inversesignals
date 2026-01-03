import styles from './Style1.module.scss';
import React, {useState} from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode,
    loading?: boolean,
    color?: "primary"| "selected" | "white" | "black" | "dark" | "light" | "red" | "green",
    margin?: boolean,
    warning?: boolean,
};

const Style1 = ({children, loading, color, margin, warning, ...props}: Props) => {

    const [sure, setSure] = useState(false);

    const hasMultipleChildren = React.Children.count(children) > 1;

    const STYLES = `${styles.button} ${hasMultipleChildren?styles.between:styles.center} ${styles[color ? color : "default"]} ${margin && styles.margin}`;

    return (
        <div className={styles.container}>
            {warning 
            ?   
                !sure ? 
                    <button className={STYLES} onClick={() => setSure(true)}>
                        {loading ? <div className={styles.loading} /> : children}
                    </button>   
                :
                    <div className={styles.warning}>
                        <button type="button" className={styles.exit} onClick={() => setSure(false)}> Back </button>
                        <button type="button" className={styles.sure} disabled={loading} {...props}> Sure </button>
                    </div>
            :
                <button type="button" disabled={loading} className={STYLES} {...props}>
                    {loading ? <div className={styles.loading} /> : children}
                </button>   
            }
        </div>
    )
}

export default Style1;