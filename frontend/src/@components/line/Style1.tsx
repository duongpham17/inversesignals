import styles from './Style1.module.scss';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    color?: "primary" | "light" | "dark" | "white" | "black" | "default"
}

const Line1 = ({color, ...props}: Props ) => (
    <div className={`${styles.container} ${styles[color || "default"]}`} {...props}/>
)

export default Line1