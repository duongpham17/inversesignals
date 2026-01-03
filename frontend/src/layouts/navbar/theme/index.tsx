import styles from './Theme.module.scss';
import { useContext } from 'react';
import { Context } from 'themes'; 
import { ThemeCycle } from 'themes/Data';
import Hover from '@components/hover/Style1';

const Theme = () => {

    const { onSetTheme, theme } = useContext(Context);

    return (
        <div className={styles.container}>
            {ThemeCycle.map(el => el.name === theme.name && 
                <Hover key={el.name} message={"Theme"}>
                    <button onClick={onSetTheme} className={styles.button}>
                        <div className={styles.loader} />
                    </button>
                </Hover>
            )}
        </div>
    );
};

export default Theme;
