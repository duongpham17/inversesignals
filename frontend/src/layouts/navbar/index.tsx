
import styles from './Navbar.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@redux/hooks/useRedux';
import { MdOutlinePerson } from "react-icons/md";
import { RiAdminLine, RiFileHistoryLine } from "react-icons/ri";
import { BiSolidAnalyse } from "react-icons/bi";
import Flex from '@components/flex/Flex';
import Hover from '@components/hover/Style1';
import Options from '@components/options/Style1';
import Theme from './theme';

const NavbarLayout = () => {
    const [navigate, location] = [useNavigate(), useLocation()];

    const { user } = useAppSelector(state => state.authentications);

    const optionsList = ["Features", "momentum", "indicators", "arrows", "streaks", "candles", "indicies"];

    const setPage = (page: string) => navigate(`/?page=${page}`);

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
                        {location.search.includes("page") ? "" : <Options label1="" value="items" options={optionsList} onClick={setPage} />}
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