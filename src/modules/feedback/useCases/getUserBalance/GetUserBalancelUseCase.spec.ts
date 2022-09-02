import { FeedbacksRepositoryInMemory } from '@modules/feedback/repositories/in-memory/FeedbacksRepositoryInMemory';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { GetUserBalanceUseCase } from './GetUserBalanceUseCase';

let feedbacksRepositoryInMemory: FeedbacksRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let getUserBalanceUseCase: GetUserBalanceUseCase;

let userTo: User;

describe('GetUserBalanceUseCase', () => {
  beforeAll(async () => {
    feedbacksRepositoryInMemory = new FeedbacksRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    getUserBalanceUseCase = new GetUserBalanceUseCase(
      feedbacksRepositoryInMemory,
      usersRepositoryInMemory,
      dateProvider
    );

    userTo = await usersRepositoryInMemory.create({
      name: 'User',
      email: 'email',
      password: 'pass',
    });

    await Promise.all(
      Array.from(Array(12).keys()).map(async () => {
        await feedbacksRepositoryInMemory.create({
          amount: 100,
          description: 'send',
          user_from_id: 'to_id',
          user_to_id: userTo.id,
        });
      })
    );
  });

  it('Should be able to get user balance', async () => {
    const balance = await getUserBalanceUseCase.execute(userTo.id);

    expect(balance).toBe(1200);
  });

  it('Should not be able to get balance from a inexistent user', async () => {
    await expect(getUserBalanceUseCase.execute('fakeid')).rejects.toEqual(
      new AppError('User not found!')
    );
  });
});
