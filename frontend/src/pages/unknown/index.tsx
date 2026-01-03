import styles from './Unknown.module.scss';
import {Link} from 'react-router-dom';

const Unknown = () => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <p>404</p>
        <p>Page not found</p>
      </Link>
    </div>
  )
}

export default Unknown