import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Users from '@redux/actions/users';
import useForm from '@hooks/useForm';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Form from '@components/forms/Style1';
import Text from '@components/texts/Style1';
import Between from '@components/flex/Between';
import Container from '@components/containers/Style1';

interface Validation {
  email?: string,
  token?: string,
};
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
    if(check("token")){
      if(!values.token) {
        errors.token = "required";
      }
      else if(values.token.length < 8){
        errors.token = "Min 8 characters"
      }
    };
    return errors
};

const Finalise = () => {

  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.authentications);
  const { errors, status } = useAppSelector(state => state.users);

  const initalState = { email: status.email, token: "" };

  const {values, onChange, onSubmit, loading, validationErrors, edited} = useForm(initalState, callback, validation);

  async function callback(){
    if(!user) return;
    await dispatch(Users.verifyEmail(values));
  };

  const onChangeEmail = () => {
    dispatch(Users.stateClear());
  };

  return (
    <Form onSubmit={onSubmit}>

      {status.verify_email && <Container color="green"><br/><Text color="green">{status.verify_email}</Text><br/></Container>}

      <Container>
        <Between>
          <Text>values.email</Text>
          <Button type="button" onClick={onChangeEmail}>Change</Button>
        </Between>
        <Input 
          label1="Verify Token" 
          label2={validationErrors.token}
          error={validationErrors.token} 
          placeholder="Token sent to email address"
          name="token" 
          value={values.token} 
          onChange={onChange} 
        />
      </Container>

      {errors.verify_email && <Container color="red"><br/><Text color='red'>{errors.verify_email}</Text><br/></Container>}

      {edited &&
        <Container>
          <Button type="submit" loading={loading} color="primary">Confirm Email</Button>
        </Container>
      }

    </Form>
  )
};

export default Finalise