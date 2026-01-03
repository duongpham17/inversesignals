import UseContext from './UseContext';
import Pages from './Pages';

const HomePage = () => {
  return (
    <UseContext>
      <Pages />
    </UseContext>
  )
};

export default HomePage