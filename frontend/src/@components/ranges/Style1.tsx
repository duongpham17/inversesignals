import styles from './Style1.module.scss';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

}

const Style1 = ({...props}: Props) => {
  return (
    <div className={styles.container}>
        <input type="range" {...props} />
    </div>
  )
}

export default Style1