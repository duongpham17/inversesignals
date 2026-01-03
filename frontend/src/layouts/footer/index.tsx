import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import Hacked from '@components/animations/texts/Hacked';

const Footer = () => {
  return (
    <footer className={styles.container}>

      <section>
        <Link to="/policy"><Hacked text="Policy" /></Link>
        <Link to="/privacy"><Hacked text="Privacy" /></Link>
        <Link to="/cookies"><Hacked text="Cookies" /></Link>
      </section>

      <section>
        <small>
          <Hacked text="@futures, 2025"/>
        </small>
      </section>

    </footer>
  )
}

export default Footer