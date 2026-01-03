import { useAppSelector } from '@redux/hooks/useRedux';
import Text from '@components/texts/Style1';

const Username = () => {

    const {user} = useAppSelector(state => state.authentications);

    return (
        <Text>{user?.username}</Text>
    )
}

export default Username