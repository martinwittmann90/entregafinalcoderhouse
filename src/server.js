/* -------------IMPORTS-------------*/
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import exphbs from 'express-handlebars';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { sessionConfig } from './config/configmongodb.js';
import config from './config/envconfig.js';
import './config/passport.config.js';
import initPassport from './config/passport.config.js';
import { __dirname } from './configPath.js';
import indexRoutes from './routes/index.routes.js';
import specs from './config/swaggerConfig.js';
import { setupServer } from '../src/config/serverConfig.js';
import serveFavicon from 'serve-favicon';

/*-------------CONFIG BASICAS Y CONEXION A BD-------------*/
const app = express();
const port = config.port;
/*-------------CONFIG SWAGGER-------------*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
/*-------------CONFIG CORS-------------*/
/* const corsOptions = {
  origin: 'http://localhost:8080',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions)); */
/*-------------SETTING MIDDLEWARES-------------*/
app.use(serveFavicon('favicon.ico'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*-------------SETTING HANDLEBARS-------------*/
const hbs = exphbs.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
/*-------------SERVIDORES-------------*/
setupServer(app, port);
/*-------------SESSION-------------*/
app.use(cookieParser('mySecret'));
app.use(sessionConfig);
/*-------------PASSPORT-------------*/
initPassport();
app.use(passport.initialize());
app.use(passport.session());
/*-------------ROUTES-------------*/
app.use('/', indexRoutes);
export default app;
