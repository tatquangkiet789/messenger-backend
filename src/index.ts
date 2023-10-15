import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import appRoutes from './routes/routes';
import { infoLogger } from './utils/logger.util';
import createSocketServer from './features/socket/socket';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();
const origin = process.env.ALLOWED_ORIGIN;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: origin,
		methods: ['GET', 'POST'],
	}),
);

// ROUTES
appRoutes(app);

const { socketServer } = createSocketServer(app, origin);

socketServer.listen(port, () => {
	infoLogger(`Server is running at localhost:${port}`);
});
