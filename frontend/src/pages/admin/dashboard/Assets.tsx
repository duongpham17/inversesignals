import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { useNavigate } from 'react-router-dom';
import AdminAssets from '@redux/actions/admin_assets';
import Wrap from '@components/flex/Wrap';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style1';

const AdminDashboardAssets = () => {

  const [dispatch, navigate] = [useAppDispatch(), useNavigate()];

  const { names } = useAppSelector(state => state.admin_assets);

  const onClick = (id: string) => {
    dispatch(AdminAssets.findid(id))
    navigate(`?id=${id}`)
  };

  const cryptos = names?.filter(el => el.class.includes("crypto")) || [];
  const stocks = names?.filter(el => el.class.includes("stock")) || []

  if(!names) return <div></div>;
  
  return (
    <>
      <Container>
        <Text size={20}>Crypto [ {cryptos.length} ]</Text>
        <Wrap>
          {cryptos.map(el => 
            <Button key={el._id} onClick={() => onClick(el._id)} color="light">{el.name.toUpperCase()}</Button>
          )}
        </Wrap>
      </Container>

      <Container>
        <Text size={20}>Stock [ {stocks.length} ] </Text>
        <Wrap>
          {stocks.filter(el => el.class.includes("stock")).map(el => 
            <Button key={el._id} onClick={() => onClick(el._id)} color="light">{el.name.toUpperCase()}</Button>
          )}
        </Wrap>
      </Container>
    </>
  )
}

export default AdminDashboardAssets