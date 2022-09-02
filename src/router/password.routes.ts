import { Router } from 'express';

import { ForgotPasswordController } from '@modules/users/useCases/forgotPassword/ForgotPasswordController';
import { ResetUserPasswordController } from '@modules/users/useCases/resetUserPassword/ResetUserPasswordController';

const passwordRoutes = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetUserPasswordController = new ResetUserPasswordController();

passwordRoutes.post('/forgot-password', forgotPasswordController.handle);
passwordRoutes.post('/reset-password', resetUserPasswordController.handle);

export { passwordRoutes };
