import { useAppSelector } from '@redux/hooks/useRedux';
import Home from 'pages/home';

interface Props {
  roles?: string[],
  component: React.FunctionComponent
}

const Private = ({component: Component, roles=["user", "admin"]}: Props) => {

  const {user} = useAppSelector(state => state.authentications);

  const isAuthorized = user && roles.includes(user.role);

  if (isAuthorized) return <Component />;

  return <Home />;
}

export default Private