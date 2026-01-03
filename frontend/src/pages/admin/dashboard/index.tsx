import { useLocation } from 'react-router-dom';
import UseContext from './UseContext';
import Create from './Create';
import Assets from './Assets';
import Datamain from './Datamain';
import Dataset from './Dataset';
import Search from './Search';
import Page from '@components/pages/Style1';

const AdminDashboardPage = () => {

  const location = useLocation();

  const isEditing = new URLSearchParams(location.search).get("id");

  return (
    <Page>
      <UseContext>
        {!isEditing ? 
          <> 
            <Create />
            <Search />
            <Assets />
          </>
        :
          <>
            <Datamain />
            <Dataset />
          </>
        }
      </UseContext>
    </Page>
  )

}

export default AdminDashboardPage