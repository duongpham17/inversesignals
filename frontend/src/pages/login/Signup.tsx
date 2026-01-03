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
  username?: string,
  password?: string,
  check_password?: string,
};

const validation = (values: Validation) => {
    let errors: Validation = {};

    const check = (key: any) => key in values;

    if (check("username")) {
      if (!values.username) {
        errors.username = "required";
      } 
      else if (values.username.length < 3) {
        errors.username = "Must be at least 3 characters";
      } 
      else if (!/^[a-z0-9]+$/i.test(values.username)) {
        errors.username = "Only letters and numbers allowed";
      }
    }
    if(check("password")){
      if(!values.password) {
        errors.password = "required";
      }
      else if(values.password.length < 8){
        errors.password = "Min 8 characters"
      }
    };
    return errors
};

const Signup = () => {
    
    const dispatch = useAppDispatch();

    const {errors} = useAppSelector(state => state.authentications);

    const initalState = { username: "", password: "", check_password: ""};

    const {values, onChange, onSubmit, loading, validationErrors, edited} = useForm(initalState, callback, validation);

    async function callback(){
      const isPasswordCorrect = values.password === values.check_password;
      if(!isPasswordCorrect) return dispatch(Authentication.stateErrors("signup", "Password does not match"));
      await dispatch(Authentication.signup(values));
    };

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>

          <Container>
          <Input 
            label1="Username" 
            label2={validationErrors.username}
            error={validationErrors.username} 
            placeholder="Enter your username"
            name="username" 
            value={values.username} 
            onChange={onChange} 
          />

          <Input 
            label1="Password" 
            label2={validationErrors.password}
            error={validationErrors.password} 
            placeholder="Password" 
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

        {errors.signup && <Container color="red"><Text color='red'>{errors.signup}</Text></Container>}

        {edited && <Button type="submit" loading={loading} color="primary">Create account</Button>}

      </Form>
    </Fragment>
  )
}

export default Signup