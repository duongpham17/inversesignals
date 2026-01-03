import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Text from '@components/texts/Style1';
import Container from '@components/containers/Style1';
import Authentication from '@redux/actions/authentications';
import Form from '@components/forms/Style1';

const Verified = () => {

  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.users)

  useEffect(() => {
    if(!user) return;
    dispatch(Authentication.update({...user, email: user.email}))
  }, [dispatch, user]);

  return (
    <Form>
      <Container color="green">
        <br/>
          <Text color="green">Email has been verified</Text>
        <br/>
      </Container>
    </Form>
  )
};

export default Verified