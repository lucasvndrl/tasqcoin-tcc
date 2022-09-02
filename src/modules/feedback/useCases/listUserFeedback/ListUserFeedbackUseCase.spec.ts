/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFeedbackResponseDTO } from '@modules/feedback/dto/IFeedbackResponseDTO';
import { FeedbacksRepositoryInMemory } from '@modules/feedback/repositories/in-memory/FeedbacksRepositoryInMemory';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { ListUserFeedbackUseCase } from './ListUserFeedbackUseCase';

let feedbacksRepositoryInMemory: FeedbacksRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let listUserFeedbackUseCase: ListUserFeedbackUseCase;

let userFrom: User;
const feedbacksTest: IFeedbackResponseDTO[] = [];

describe('ListUserFeedbackUseCase', () => {
  beforeAll(async () => {
    feedbacksRepositoryInMemory = new FeedbacksRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    listUserFeedbackUseCase = new ListUserFeedbackUseCase(
      feedbacksRepositoryInMemory,
      usersRepositoryInMemory
    );

    userFrom = await usersRepositoryInMemory.create({
      name: 'User',
      email: 'email',
      password: 'pass',
    });

    await Promise.all(
      Array.from(Array(8).keys()).map(async () => {
        await feedbacksRepositoryInMemory
          .create({
            amount: 100,
            description: 'send',
            user_from_id: userFrom.id,
            user_to_id: 'to_id',
          })
          .then((fb) => feedbacksTest.push(fb));
      })
    );

    await feedbacksRepositoryInMemory
      .create({
        amount: 100,
        description: 'recieved',
        user_from_id: 'to_id',
        user_to_id: userFrom.id,
      })
      .then((fb) => feedbacksTest.push(fb));
  });

  it('Should be able to list all users sent feedbacks', async () => {
    const { feedbacks, totalPages } = await listUserFeedbackUseCase.execute({
      user_id: userFrom.id,
      feedbackType: 'sent',
    });

    expect(totalPages).toBe(1);
    expect(feedbacks).toEqual(feedbacksTest.slice(0, 8));
  });

  it('Should be able to list all users recieved feedbacks', async () => {
    const { feedbacks, totalPages } = await listUserFeedbackUseCase.execute({
      user_id: userFrom.id,
      feedbackType: 'recieved',
    });

    expect(totalPages).toBe(1);
    expect(feedbacks).toEqual(feedbacksTest.slice(8));
  });

  it('Should be able to list all users feedbacks', async () => {
    const { feedbacks, totalPages } = await listUserFeedbackUseCase.execute({
      user_id: userFrom.id,
    });

    expect(totalPages).toBe(2);
    expect(feedbacks).toEqual(feedbacksTest.slice(0, 8));
  });

  it('Should be able to paginate all users feedbacks', async () => {
    const { feedbacks, totalPages } = await listUserFeedbackUseCase.execute({
      user_id: userFrom.id,
      page: 2,
    });

    expect(totalPages).toBe(2);
    expect(feedbacks).toEqual(feedbacksTest.slice(8));
  });

  it('Should be able to change users feedbacks page size', async () => {
    const { feedbacks, totalPages } = await listUserFeedbackUseCase.execute({
      user_id: userFrom.id,
      pageSize: 1,
    });

    expect(totalPages).toBe(9);
    expect(feedbacks).toEqual(feedbacksTest.slice(0, 1));
  });

  it('Should not be able to list feedbacks from a inexistent user', async () => {
    await expect(
      listUserFeedbackUseCase.execute({
        user_id: 'fake_id',
      })
    ).rejects.toEqual(new AppError('User not found!'));
  });
});
