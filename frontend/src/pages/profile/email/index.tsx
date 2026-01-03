import { Fragment } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import useOpen from '@hooks/useOpen';
import Text from '@components/texts/Style1';
import Cover from '@components/covers/Style2';

import Token from './Token';
import Finalise from './Finalise';
import Verified from './Verified';

const Email = () => {

  const { user } = useAppSelector(state => state.authentications);
  const { status } = useAppSelector(state => state.users);
  const {open, onOpen} = useOpen({});

  return (
    <Fragment>

      {user?.email 
        ? user.email.includes("@") ? <Text>{user.email} </Text> : <button onClick={onOpen}>{user.email}</button>
        : <button onClick={onOpen}><Text color="light">Verify an email address</Text></button>
      }

      {open && 
        <Cover open={open} onClose={onOpen}>
          { (!status.verify_email_token && !status.verify_email) && <Token />}
          { status.verify_email_token === "success" && <Finalise /> }
          { status.verify_email === "success" && <Verified /> }
        </Cover>
      }

    </Fragment>
  )
}

export default Email