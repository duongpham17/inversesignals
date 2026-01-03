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
        errors.email = "Invalid email address"
      }
    };

    return errors
};

const Forgot = () => {
    
  const dispatch = useAppDispatch();

  const {errors} = useAppSelector(state => state.authentications);

  const initalState = { email: ""};

  const {values, onChange, onSubmit, loading, validationErrors, edited} = useForm(initalState, callback, validation);

  async function callback(){
    await dispatch(Authentication.forgot(values));
  };

  return (
    <Fragment>
      <Form onSubmit={onSubmit}>

        <Container>
          <Input 
            label1="Email address" 
            label2={validationErrors.email}
            error={validationErrors.email} 
            placeholder="Email to reset password"
            name="email" 
            value={values.email} 
            onChange={onChange} 
          />
        </Container>

        {errors.forgot && <Container color="red"><Text color='red'>{errors.forgot}</Text></Container>}

        {edited && <Button type="submit" loading={loading} color="primary">Forgot Password</Button>}

      </Form>
    </Fragment>
  )
}

export default Forgot