import createSocketServer from '~/features/socket/socket';
import app from '~/server';
import { infoLogger } from '~/utils/logger.util';

const port = process.env.PORT;

const { socketServer } = createSocketServer(app);

socketServer.listen(port, () => {
	infoLogger(`Server is running at localhost:${port}`);
});
