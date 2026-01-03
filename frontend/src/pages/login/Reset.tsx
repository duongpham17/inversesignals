import { Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Authentication from '@redux/actions/authentications';
import useForm from '@hooks/useForm';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Form from '@components/forms/Style1';
import Text from '@components/texts/Style1';
import Container from '@components/containers/Style1';

interface Validation {
  password?: string,
  check_password?: string,
  token?: string
}

const validation = (values: Validation) => {
    let errors: Validation = {};

    const check = (key: any) => key in values;

    if(check("password")){
      if(!values.password) {
        errors.password = "required";
      }
      else if(values.password.length < 8){
        errors.password = "Min 8 characters"
      }
    };
    if(check("check_password")){
      if(!values.check_password) {
        errors.check_password = "required";
      }
      else if(values.check_password.length < 8){
        errors.check_password = "Min 8 characters"
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

const Reset = () => {
    
  const dispatch = useAppDispatch();

  const {errors} = useAppSelector(state => state.authentications);

  const initalState = { password: "", check_password: "", token: ""};

  const {values, onChange, onSubmit, loading, validationErrors} = useForm(initalState, callback, validation);

  async function callback(){
    const isPasswordCorrect = values.password === values.check_password;
    if(!isPasswordCorrect) return dispatch(Authentication.stateErrors("reset", "Password does not match"));
    await dispatch(Authentication.reset(values));
  };

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>

        <Container>
          <Input 
            label1="Token" 
            label2={validationErrors.token}
            error={validationErrors.token} 
            placeholder="Long token sent to email"
            name="token" 
            value={values.token} 
            onChange={onChange} 
          />

          <Input 
            label1="Password" 
            label2={validationErrors.password}
            error={validationErrors.password} 
            placeholder="Change Password"
            name="password" 
            value={values.password} 
            onChange={onChange} 
          />

          <Input 
            label1="Check Password" 
            label2={validationErrors.check_password}
            error={validationErrors.check_password} 
            placeholder="Check Password"
            name="check_password" 
            value={values.check_password} 
            onChange={onChange} 
          />
        </Container>

        {errors.reset && <Container color="red"><Text color='red'>{errors.reset}</Text></Container>}

        <Button type="submit" loading={loading} color="primary">Reset Password</Button>

      </Form>
    </Fragment>
  )
}

export default Reset