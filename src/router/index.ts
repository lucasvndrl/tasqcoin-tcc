import { Router } from 'express';

import { feedbackRoutes } from './feedback.routes';
import { passwordRoutes } from './password.routes';
import { sessionRoutes } from './session.routes';
import { userRoutes } from './users.routes';

const router = Router();

router.use('/feedbacks', feedbackRoutes);
router.use('/users', userRoutes);
router.use(sessionRoutes);
router.use(passwordRoutes);

export { router };
