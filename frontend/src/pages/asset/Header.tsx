import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from './UseContext';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style2';
import Icon from '@components/icons/Style1';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const Header = () => {

  const { setPage, id, symbol, page } = useContext(Context);

  return (
    <Between>
      <Flex>
        <Link to="/"><Button color="primary"><MdOutlineKeyboardBackspace/></Button></Link>
        <Text size={20}>{id?.toUpperCase()} [ {symbol} ]</Text>
      </Flex>
      <Flex>
        {page === 1 && <Text size={20}>HYPERLIQUID</Text>}
        {page === 2 && <Text size={20}>BINANACE</Text>}
        <Icon onClick={() => setPage(-1)}><MdOutlineKeyboardArrowLeft/></Icon>
        <Icon onClick={() => setPage(1)}><MdOutlineKeyboardArrowRight/></Icon>
      </Flex>
    </Between>
  )

}

export default Header