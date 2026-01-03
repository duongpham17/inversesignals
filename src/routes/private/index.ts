import { Express } from 'express';
import { corsPrivate } from '../../@utils/cors';
import users from './users';
import indices from './indices';
import trades from './trades';

const endpoints = (app: Express) => {
    app.use('/api/users', corsPrivate, users);
    app.use('/api/indices', corsPrivate, indices);
    app.use('/api/trades', corsPrivate, trades);
};

export default endpoints;