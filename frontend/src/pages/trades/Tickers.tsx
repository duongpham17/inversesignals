import { useMemo } from 'react'
import { useAppSelector } from '@redux/hooks/useRedux';
import { Link } from 'react-router-dom';
import Wrap from '@components/flex/Wrap';
import Button from '@components/buttons/Style1';

const Symbols = () => {

  const {trades} = useAppSelector(state => state.trades);

  const data = useMemo(() => {
    if(!trades) return null;
    const tickers = trades.map(el => el.ticker);
    return [...new Set(tickers)].sort();
  }, [trades]);

  return (
    <Wrap>
      {data?.map(el => 
        <Button key={el} color="dark">
          <Link to={`/assets?symbol={el}`}>{el}</Link>
        </Button>
      )}
    </Wrap>
  )
}

export default Symbols