import UseContext from './UseContext';
import Page from '@components/pages/Style1';
import Header from './Header';
import Pages from './Pages';

const Trades = () => {
  return (
    <UseContext>
      <Page>
        <Header/>
        <Pages />
      </Page>
    </UseContext>
  )
}

export default Trades