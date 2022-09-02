import { FeedbacksRepositoryInMemory } from '@modules/feedback/repositories/in-memory/FeedbacksRepositoryInMemory';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateFeedbackUseCase } from './CreateFeedbackUseCase';

let createFeedbackUseCase: CreateFeedbackUseCase;
let feedbacksRepositoryInMemory: FeedbacksRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;

let userFrom: User;
let userTo: User;

describe('CreateFeedbackUseCase', () => {
  beforeAll(async () => {
    feedbacksRepositoryInMemory = new FeedbacksRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createFeedbackUseCase = new CreateFeedbackUseCase(
      feedbacksRepositoryInMemory,
      usersRepositoryInMemory
    );

    userFrom = await usersRepositoryInMemory.create({
      name: 'userFrom',
      password: 'pass',
      email: 'email1@test.com',
    });
    userTo = await usersRepositoryInMemory.create({
      name: 'userTo',
      password: 'pass',
      email: 'email2@test.com',
    });
  });

  it('Should be able to create a new feedback', async () => {
    const feedback = await createFeedbackUseCase.execute({
      amount: 500,
      description: 'description',
      user_from_id: userFrom.id,
      user_to_id: userTo.id,
    });

    expect(feedback).toHaveProperty('id');
    expect(feedback.user_from_id).toEqual(userFrom.id);
    expect(feedback.user_to_id).toEqual(userTo.id);
  });

  it('Should not be able to create a new feedback with unexistent user', async () => {
    await expect(
      createFeedbackUseCase.execute({
        amount: 500,
        description: 'description',
        user_from_id: 'fakeid',
        user_to_id: userTo.id,
      })
    ).rejects.toEqual(new AppError('User not found!'));

    await expect(
      createFeedbackUseCase.execute({
        amount: 500,
        description: 'description',
        user_from_id: userFrom.id,
        user_to_id: 'fakeid',
      })
    ).rejects.toEqual(new AppError('User not found!'));
  });

  it('Should not be able to create a new feedback with not enough balance', async () => {
    await expect(
      createFeedbackUseCase.execute({
        amount: 600,
        description: 'description',
        user_from_id: userFrom.id,
        user_to_id: userTo.id,
      })
    ).rejects.toEqual(new AppError('User balance is too low!'));
  });
});
