import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Users from '@redux/actions/users';
import useOpen from '@hooks/useOpen';
import useForm from '@hooks/useForm';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Form from '@components/forms/Style1';
import Text from '@components/texts/Style1';
import Cover from '@components/covers/Style2';
import Container from '@components/containers/Style1';

interface Validation {
  password?: string,
  check_password?: string,
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

    return errors
};

const Password = () => {
    
  const dispatch = useAppDispatch();

  const {errors, status} = useAppSelector(state => state.users);

  const {open, onOpen} = useOpen({});

  const initalState = { password: "", check_password: ""};

  const {values, onChange, onSubmit, loading, validationErrors, onClear, edited} = useForm(initalState, callback, validation);

  async function callback(){
    const isPasswordCorrect = values.password === values.check_password;
    if(!isPasswordCorrect) return dispatch(Users.stateErrors("password", "Password does not match"));
    await dispatch(Users.password(values.password));
    onClear();
  };

  return (
    <>

        <button onClick={onOpen}>Change Password</button>

        {open && <Cover open={open} onClose={onOpen}>
            <Form onSubmit={onSubmit}>

                {status.password && <Container color="green"><br/><Text color="green">{status.password}</Text><br/></Container>}

                <Container>
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

                {errors.password && <Container color="red"><br/><Text color='red'>{errors.password}</Text><br/></Container>}

                {edited &&
                  <Container>
                    <Button type="submit" loading={loading} color="primary">Reset Password</Button>
                  </Container>
                }

            </Form>
        </Cover>}
    </>
  )
}

export default Password