import styles from './Pages.module.scss'
import {Routes, Route} from 'react-router-dom';

import Private from './Private';
import Home from './home';
import Policy from './policy';
import Cookies from './cookies';
import Privacy from './privacy';
import Login from './login';
import Profile from './profile';
import Asset from './asset';
import Trades from './trades';
import AdminDashboard from './admin/dashboard';

const Pages = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/policy" element={<Policy/>} />
        <Route path="/cookies" element={<Cookies/>} />
        <Route path="/privacy" element={<Privacy/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/asset" element={<Asset/>} />
        {/* PROTECTED */}
        <Route path="/profile" element={<Private component={Profile} roles={["admin","user"]}/> } />
        <Route path="/trades" element={<Private component={Trades} roles={["admin","user"]}/> } />
        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<Private component={AdminDashboard} roles={["admin"]}/> } />
      </Routes>
    </div>
  )
};

export default Pages;