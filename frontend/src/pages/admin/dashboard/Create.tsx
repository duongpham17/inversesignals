import { Fragment } from 'react';
import { useAppDispatch } from '@redux/hooks/useRedux';
import Assets from '@redux/actions/admin_assets';
import useForm from '@hooks/useForm';
import useOpen from '@hooks/useOpen';
import Container from '@components/containers/Style1';
import Form from '@components/forms/Style1';
import Input from '@components/inputs/Style1';
import Button from '@components/buttons/Style1';
import Cover from '@components/covers/Style2';

const AdminDashboardCreate = () => {    
    const dispatch = useAppDispatch();

    const {open, onOpen} = useOpen({})

    const initialState = { name: "" };

    const {values, loading, edited, onClear, onChange, onSubmit} = useForm(initialState, callback, "");

    async function callback() {
        await dispatch(Assets.create(values));
        onClear()
    };

    return (
        <Fragment>
            <Button onClick={onOpen} color="primary" loading={loading}>Create</Button>

            <Cover open={open} onClose={onOpen}>
                <Form onSubmit={onSubmit}>
                    <Container>
                        <Input 
                            label1="Name of asset"
                            name="name"
                            value={values.name}
                            onChange={onChange}
                        />
                        {edited && <Button type="submit" color="primary" loading={loading}>Create</Button>}
                    </Container>
                </Form>
            </Cover>
            
        </Fragment>
    )
}

export default AdminDashboardCreate