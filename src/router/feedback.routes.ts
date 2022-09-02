import { Router } from 'express';

import { ensureAdmin } from '@middlewares/ensureAdmin';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { CreateFeedbackController } from '@modules/feedback/useCases/createFeedback/CreateFeedbackController';
import { DeleteFeedbackController } from '@modules/feedback/useCases/deleteFeedback/DeleteFeedbackController';
import { GetUserBalanceController } from '@modules/feedback/useCases/getUserBalance/GetUserBalanceController';
import { GetUsersRankingController } from '@modules/feedback/useCases/getUsersRanking/GetUsersRankingController';
import { ListUserFeedbackController } from '@modules/feedback/useCases/listUserFeedback/ListUserFeedbackController';

const feedbackRoutes = Router();

const createFeedbackController = new CreateFeedbackController();
const deleteFeedbackController = new DeleteFeedbackController();
const listUserFeedbackController = new ListUserFeedbackController();
const getUserBalanceController = new GetUserBalanceController();
const getUsersRankingController = new GetUsersRankingController();

feedbackRoutes.get('/', ensureAuthenticated, listUserFeedbackController.handle);
feedbackRoutes.post('/', ensureAuthenticated, createFeedbackController.handle);
feedbackRoutes.delete(
  '/:id',
  ensureAuthenticated,
  ensureAdmin,
  deleteFeedbackController.handle
);

feedbackRoutes.get(
  '/balance',
  ensureAuthenticated,
  getUserBalanceController.handle
);

feedbackRoutes.get(
  '/ranking',
  ensureAuthenticated,
  getUsersRankingController.handle
);

export { feedbackRoutes };
