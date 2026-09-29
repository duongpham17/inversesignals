import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from './UseContext';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style2';
import Options from '@components/options/Style1';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const Header = () => {

  const { symbol, setExchange, market } = useContext(Context);

  const options = market==="stock" ? ["binance"] : ["binance", "hyperliquid"];

  return (
    <Between>
      <Flex>
        <Link to="/"><Button color="primary"><MdOutlineKeyboardBackspace/></Button></Link>
        <Text size={20}>{symbol}</Text>
      </Flex>
      <Flex>
          <Options color="dark" label1="" options={options} onClick={setExchange} />
      </Flex>
    </Between>
  )

}

export default Header