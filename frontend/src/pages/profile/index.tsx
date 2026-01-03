import styles from './Profile.module.scss';
import Container from '@components/containers/Style1';

import Logout from './logout';
import Email from './email';
import Password from './password';
import Username from './username';

const ProfilePage = () => {

    const style = { padding: "1rem" };

    const color = "primary";

    return (
        <div className={styles.container}>

            <Container style={style} color={color}>
                <Username />
            </Container>

            <Container style={style} color={color}>
                <Email />
            </Container>

            <Container style={style} color={color}>
                <Password />
            </Container>
            
            <Container style={style} color={color}>
                <Logout />
            </Container>

        </div>
    )
}

export default ProfilePage