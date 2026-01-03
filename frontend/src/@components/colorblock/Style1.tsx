import styles from './Style1.module.scss';

interface Props {
    color?: string
};

const Style1 = ({color}:Props) => {
  return (
    <span className={`${styles.container}`} style={{backgroundColor: color}}></span>
  )
}

export default Style1