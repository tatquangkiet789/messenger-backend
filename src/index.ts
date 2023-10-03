import dotenv from 'dotenv';
import express, { Express } from 'express';
import appRoutes from './routes/routes';
import { infoLogger } from './utils/logger.util';
import cors from 'cors';
import createSocketServer from './features/socket/socket';
import cookieParser from 'cookie-parser';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
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

// SOCKET SERVER
const { socketServer } = createSocketServer(app);

socketServer.listen(port, () => {
	infoLogger(`Server is running at localhost:${port}`);
});
