import { User } from '@prisma/client';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            currentUser: any;
        }
    }
}
