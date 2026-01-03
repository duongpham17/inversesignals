import { Express } from 'express';
import { corsPublic } from '../../@utils/cors';
import authentications from './authentications';
import assets from './assets';

const endpoints = (app: Express) => {
    app.use('/api/authentications', corsPublic, authentications);
    app.use('/api/assets', corsPublic, assets);
};

export default endpoints;