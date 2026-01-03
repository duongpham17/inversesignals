import styles from './Style2.module.scss';

interface Props {
  size?: number,
  color?: string,
  center?: boolean,
}

const Style1 = ({color="default", center=false, size=20}:Props) => {

  const style = {        
    width: `${size}px`, 
    height: `${size}px`, 
  };

  return (
    <span 
      style={style}      
      className={`${styles.loading} ${center?styles.center:""} ${styles[color]}`}  
    />  
  )
}

export default Style1