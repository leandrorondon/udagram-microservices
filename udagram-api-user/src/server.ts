require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_USER_MODELS} from './controllers/v0/model.index';


(async () => {
  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8081;

  app.use(bodyParser.json());
  
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: config.url,
  }));

  let logger = (req: express.Request, resp: express.Response, next: any) => {
    let pid = uuidv4();
    let start = new Date()
    let path = req.path
    console.log(start.toISOString() + `: ${pid} - ${req.method} ${path} - start`);
    next();
    let end = new Date()
    let total = end.valueOf() - start.valueOf()
    console.log(end.toISOString() + `: ${pid} - ${req.method} ${path} - end: ${resp.statusCode} [${total} ms]`);
  };

  app.use(logger);

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/users' );
  } );


  // Start the Server
  app.listen( port, () => {
    console.log( `server running http://localhost:${port}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
