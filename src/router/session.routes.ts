import { Router } from 'express';

import { AuthenticateUserController } from '@modules/users/useCases/authenticateUserUseCase/AuthenticateUserController';
import { RefreshTokenController } from '@modules/users/useCases/refreshTokenUseCase/RefreshTokenController';

const sessionRoutes = Router();

const authenticateUserController = new AuthenticateUserController();
const refreshTokenController = new RefreshTokenController();

sessionRoutes.post('/signin', authenticateUserController.handle);
sessionRoutes.post('/refresh-token', refreshTokenController.handle);

export { sessionRoutes };
