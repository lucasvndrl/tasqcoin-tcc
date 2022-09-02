import { Router } from 'express';

import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { upload } from '@middlewares/upload';
import { ChangeUserNameController } from '@modules/users/useCases/changeUserName/ChangeUserNameController';
import { ChangeUserPasswordController } from '@modules/users/useCases/changeUserPassword/ChangeUserPasswordController';
import { CreateUserController } from '@modules/users/useCases/createUserUseCase/CreateUserController';
import { GetUserInfoController } from '@modules/users/useCases/getUserInfo/GetUserInfoController';
import { SearchUsersController } from '@modules/users/useCases/searchUsers/SearchUsersController';
import { UpdateUserAvatarController } from '@modules/users/useCases/updateUserAvatarUseCase/UpdateUserAvatarController';

const userRoutes = Router();

const changeUserPasswordController = new ChangeUserPasswordController();
const createUserController = new CreateUserController();
const changeUserNameController = new ChangeUserNameController();
const getUserInfoController = new GetUserInfoController();
const searchUsersController = new SearchUsersController();
const updateUserAvatarController = new UpdateUserAvatarController();

userRoutes.post('/', createUserController.handle);
userRoutes.get('/', ensureAuthenticated, getUserInfoController.handle);
userRoutes.get('/search', ensureAuthenticated, searchUsersController.handle);

userRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  updateUserAvatarController.handle
);
userRoutes.patch(
  '/change-name',
  ensureAuthenticated,
  changeUserNameController.handle
);
userRoutes.patch(
  '/password',
  ensureAuthenticated,
  changeUserPasswordController.handle
);

export { userRoutes };
