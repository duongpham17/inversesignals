import express from 'express';
import security from './security';
import parser from './parser';
import port from './port';
import frontend from './frontend';
import routes from './routes';
import database from './database';
import bot from '../bot';

const app = express();

export default (): void => {
    
    security(app);

    parser(app);

    bot();

    routes(app);

    database();

    frontend(app, express);

    port(app);

};