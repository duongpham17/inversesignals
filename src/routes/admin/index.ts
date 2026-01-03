import { Express } from 'express';
import { corsPrivate } from '../../@utils/cors';
import assets from './assets';

const endpoints = (app: Express) => {
    app.use('/api/admin/assets', corsPrivate, assets);
};

export default endpoints;