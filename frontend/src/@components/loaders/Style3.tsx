import styles from './Style3.module.scss';

interface Props {
  s?: number;
  color: "green" | "red" | "default",
}

const Loader = ({s = 1, color="default"}:Props) => {

  return (
    <div 
      className={`${styles.loader} ${styles.border} ${styles[color]}`}
      style={{animationDuration: `${s}s`}}
    />
  )

}

export default Loader;