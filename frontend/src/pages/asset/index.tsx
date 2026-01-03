import Page from '@components/pages/Style1';

import UseContext from './UseContext';
import Header from './Header';
import Pages from './Pages';

const AdminDashboardPage = () => {
  return (
    <UseContext>
      <Page>

        <Header />

        <Pages />

      </Page>
    </UseContext>
  );
};

export default AdminDashboardPage;
