import { container } from 'tsyringe';

import '@shared/container/providers';

import { FeedbacksRepository } from '@modules/feedback/infra/typeorm/repositories/FeedbacksRepository';
import { IFeedbacksRepository } from '@modules/feedback/repositories/IFeedbacksRepository';
import { UsersRefreshTokensRepository } from '@modules/users/infra/typeorm/repositories/UsersRefreshTokensRepository';
import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { IUsersRefreshTokensRepository } from '@modules/users/repositories/IUsersRefreshTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

container.registerSingleton<IFeedbacksRepository>(
  'FeedbacksRepository',
  FeedbacksRepository
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IUsersRefreshTokensRepository>(
  'UsersRefreshTokensRepository',
  UsersRefreshTokensRepository
);
