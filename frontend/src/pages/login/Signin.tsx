import { Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Authentication from '@redux/actions/authentications';
import useForm from '@hooks/useForm';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style1';
import Form from '@components/forms/Style1';
import Container from '@components/containers/Style1';

interface Validation {
  username?: string,
  password?: string,
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
    }

    return errors
};

const Signin = () => {
    
    const dispatch = useAppDispatch();

    const {errors} = useAppSelector(state => state.authentications);

    const initalState = { username: "", password: ""};

    const {values, onChange, onSubmit, loading, validationErrors, edited} = useForm(initalState, callback, validation);

    async function callback(){
      await dispatch(Authentication.signin(values));
    };

    return (
    <Fragment>

      <Form onSubmit={onSubmit}>
      
        <Container>
          <Input 
            label1="Username or Email" 
            error={validationErrors.username} 
            placeholder="..." 
            name="username" 
            value={values.username} 
            onChange={onChange} 
          />

          <Input 
            label1="Password" 
            type="password"
            error={validationErrors.password} 
            placeholder="..." 
            name="password" 
            value={values.password} 
            onChange={onChange} 
          />
        </Container>
        
        {errors.login && <Container color="red"><Text color='red'>{errors.login}</Text></Container>}
                  
        {edited && <Button type="submit" loading={loading} color="primary">Confirm</Button>}

      </Form>
  
    </Fragment>
  )
}

export default Signin