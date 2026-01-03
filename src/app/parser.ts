import express, { Express } from 'express'; // import express itself and the type
import cookieParser from 'cookie-parser';

const parser = (app: Express): void => {
    // Parse JSON bodies up to 100kb
    app.use(express.json({ limit: '100kb' }));

    // Parse URL-encoded bodies (form submissions)
    app.use(express.urlencoded({ extended: true }));

    // Parse cookies from incoming requests
    app.use(cookieParser());
};

export default parser;