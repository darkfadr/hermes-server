import path from 'path';
import http from 'http';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import endpoints from 'express-list-endpoints';
import correlator from 'express-correlation-id';
import routes from './routes';
import log from '../logger';

const app = express();

app.use(cors());
app.use(helmet());
app.use(correlator());
app.use(morgan('dev', {stream: log.stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => res.json(endpoints(app)))
app.use('/api', routes);


export default http.createServer(app);
