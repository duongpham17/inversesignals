
import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';
import { MdOutlinePerson } from "react-icons/md";
import { RiAdminLine, RiFileHistoryLine } from "react-icons/ri";
import { IoIosArrowRoundDown } from "react-icons/io";
import { BiSolidAnalyse } from "react-icons/bi";
import Flex from '@components/flex/Flex';
import Hover from '@components/hover/Style1';
import Theme from './theme';

const NavbarLayout = () => {

    const { user } = useAppSelector(state => state.authentications);

    return (
        <nav className={styles.container}>
            <Flex>
                <Hover message="Home">
                    <Link to="/"><img src={process.env.PUBLIC_URL + '/logo64.png'} alt="Logo" /></Link>
                </Hover>
            </Flex>
            <Flex>
                { user?.role === "admin" &&
                    <Flex>
                        <Hover message="Admin Dashboard"><Link to="/admin/dashboard"><RiAdminLine/></Link></Hover>
                    </Flex>
                }
                { user 
                ?
                    <Flex>
                        <Hover message="Arrow Heatmap"><Link to="/?page=4"><IoIosArrowRoundDown/></Link></Hover>
                        <Hover message="Analysis"><Link to="/?page=2"><BiSolidAnalyse/></Link></Hover>
                        <Hover message="Trades"><Link to="/trades"><RiFileHistoryLine/></Link></Hover>
                        <Hover message="Profile"><Link to="/profile"><MdOutlinePerson/></Link></Hover>
                        <Theme />
                    </Flex>
                :
                    <Flex>
                        <Hover message="Login"><Link to="/login"><MdOutlinePerson/></Link></Hover>
                        <Theme />
                    </Flex>
                }
            </Flex>
        </nav>
    )
}

export default NavbarLayout