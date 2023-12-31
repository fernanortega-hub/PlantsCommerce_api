import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import l from './logger';
import { dbConnection } from "../api/config/db"
import bodyParser from 'body-parser';
import errorHandler from '../api/middlewares/error.handler';
import morgan from 'morgan';
const app = express();

export default class ExpressServer {
    private routes: (app: Application) => void;

    constructor() {
        const root = path.normalize(__dirname + '/../..');

        this.connectToDB()

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express.static(`${root}/public`));
        app.use(morgan('dev'))
    }

    async connectToDB() {
        await dbConnection()
    }

    router(routes: (app: Application) => void): ExpressServer {
        routes(app)
        app.use(errorHandler);
        return this;
    }

    listen(port: number): Application {
        const welcome = (p: number) => (): void =>
            l.info(
                `up and running in ${process.env.NODE_ENV || 'development'
                } @: ${os.hostname()} on port: ${p}}`
            );

        http.createServer(app).listen(port, welcome(port));

        return app;
    }
}
