import styles from './Login.module.scss';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Authentication from '@redux/actions/authentications';
import Signin from './Signin';
import Signup from './Signup';
import Forgot from './Forgot';
import Reset from './Reset'

const LoginPage = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [navbar, setNavbar] = useState("login");

  const {user, status} = useAppSelector(state => state.authentications);

  const onNavbar = (name: string ) => {
    dispatch(Authentication.stateClear());
    setNavbar(name);
  };

  useEffect(() => {
    if(user?._id) {
      navigate('/');
      window.location.reload();
      return;
    };
  }, [user, navigate]);

  return (
    <div className={styles.container}>

      <div className={styles.box}>

        <div className={styles.header}>
          {navbar==="login" && <h1>Login</h1>}
          {navbar==="signup" && <h1>Signup</h1>}
          {navbar === "forgot" ? status.forgot === "success" ? <h1>Reset Password</h1> : <h1>Forgot Password</h1> : ""}
        </div>

        <div className={styles.navbar}>
          {navbar==="signup" &&
            <div className={styles.links}> 
              <button onClick={() => onNavbar("login")}>Login</button>
              <p>or</p>
              <button onClick={() => onNavbar("forgot")}>Forgot password</button>
            </div>
          }
          {navbar==="login" &&
            <div className={styles.links}>
              <button onClick={() => onNavbar("signup")}>Create an account</button>
              <p>or</p>
              <button onClick={() => onNavbar("forgot")}>Forgot password</button>
            </div>
          }
          {navbar==="forgot" &&
            <div className={styles.links}>
              <button onClick={() => onNavbar("login")}>Login</button>
              <p>or</p>
              <button onClick={() => onNavbar("signup")}>Create an account</button>
            </div>
          }
        </div>

        {navbar === "login" && <Signin />}
        {navbar === "signup" && <Signup />}
        {navbar === "forgot" ? status.forgot === "success" ? <Reset /> : <Forgot /> : ""}
      </div>

    </div>
  )
}

export default LoginPage