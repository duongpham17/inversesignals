import {Express} from 'express';
import {errorMessage} from '../@utils/helper';
import PrivateRoutes from '../routes/private';
import PublicRoutes from '../routes/public';
import AdminRoutes from '../routes/admin';

const routes = (app: Express) => {

    PublicRoutes(app);

    PrivateRoutes(app);

    AdminRoutes(app);

    app.use(errorMessage);
};

export default routes;