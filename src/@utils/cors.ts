// cors.ts (backend CORS middleware setup)
import cors from 'cors';
import { whitelist } from '../@environment';

export const corsPrivate = cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','DELETE','PUT','PATCH'],
  allowedHeaders: [  
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'device-remember-token',
    'Origin',
    'Accept'
  ],
});

// simple public CORS for GET requests and POST for authentications
export const corsPublic = cors({
  origin: '*',
  methods: ['GET', 'POST'],
});
