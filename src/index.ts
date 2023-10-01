import dotenv from 'dotenv';
import express, { Express } from 'express';
import appRoutes from './routes/routes';
import { infoLogger } from './utils/logger.util';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
appRoutes(app);

app.listen(port, () => {
	infoLogger(`Server is running at localhost:${port}`);
});
