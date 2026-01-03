import UseContext from './UseContext';
import History from './History';
import Page from '@components/pages/Style1';

const Trades = () => {
  return (
    <UseContext>
        <Page>
            <History />
        </Page>
    </UseContext>
  )
}

export default Trades