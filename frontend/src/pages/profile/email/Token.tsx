import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Users from '@redux/actions/users';
import useForm from '@hooks/useForm';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Form from '@components/forms/Style1';
import Text from '@components/texts/Style1';
import Container from '@components/containers/Style1';

interface Validation {
  email?: string,
}
const validation = (values: Validation) => {
  let errors: Validation = {};
  const check = (key: any) => key in values;
  if(check("email")){
  if(!values.email) {
    errors.email = "required";
  }
  else if(!/\S+@\S+\.\S+/.test(values.email)){
    errors.email = "Invalid"
  }
  };
  return errors
};

const VerifyToken = () => {

  const dispatch = useAppDispatch();

  const {errors} = useAppSelector(state => state.users);

  const initalState = { email: "" };

  const {values, onChange, onSubmit, loading, validationErrors, edited} = useForm(initalState, callback, validation);

  async function callback(){
    await dispatch(Users.verifyToken(values.email));
  };

  return (
    <Form onSubmit={onSubmit}>

        <Container>
          <br/><Text>Once your email is verified, it becomes locked in for your account.</Text><br/>
        </Container>

        <Container>
          <Input 
              label1="Email address" 
              label2={validationErrors.email}
              error={validationErrors.email} 
              placeholder="Enter email address"
              name="email" 
              value={values.email} 
              onChange={onChange} 
          />
        </Container>

        {errors.verify_email_token && <Container color="red"><br/><Text color='red'>{errors.verify_email_token} </Text><br/></Container>}

        {edited &&
          <Container>
            <Button type="submit" loading={loading} color="primary">Get Code</Button>
          </Container>
        }

    </Form>
  )
};

export default VerifyToken