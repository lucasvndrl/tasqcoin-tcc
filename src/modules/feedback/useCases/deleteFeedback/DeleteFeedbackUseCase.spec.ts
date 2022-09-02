import { FeedbacksRepositoryInMemory } from '@modules/feedback/repositories/in-memory/FeedbacksRepositoryInMemory';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { DeleteFeedbackUseCase } from './DeleteFeedbackUseCase';

let feedbacksRepositoryInMemory: FeedbacksRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let deleteFeedbackUseCase: DeleteFeedbackUseCase;

let userFrom: User;

let feedbackId: string;

describe('GetUsersRankingUseCase', () => {
  beforeAll(async () => {
    feedbacksRepositoryInMemory = new FeedbacksRepositoryInMemory();
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    deleteFeedbackUseCase = new DeleteFeedbackUseCase(
      feedbacksRepositoryInMemory,
      usersRepositoryInMemory
    );

    userFrom = await usersRepositoryInMemory.create({
      email: 'email',
      name: 'name',
      password: 'pass',
    });

    feedbackId = await feedbacksRepositoryInMemory
      .create({
        amount: 200,
        description: '',
        user_from_id: userFrom.id,
        user_to_id: 'id',
      })
      .then(({ id }) => id);
  });

  it('Should be able to delete feedback', async () => {
    expect(userFrom.balance).toBe(1000);

    await deleteFeedbackUseCase.execute(feedbackId);
    userFrom = await usersRepositoryInMemory.findById(userFrom.id);
    const userFromFeedbacks = await feedbacksRepositoryInMemory.listByUserId(
      userFrom.id,
      'both',
      { pageSize: 8 }
    );

    expect(userFromFeedbacks.feedbacks.length).toBe(0);
    expect(userFrom.balance).toBe(1200);
  });

  it('Should not be able to delete a feedback that does not exist', async () => {
    await expect(deleteFeedbackUseCase.execute('fake_id')).rejects.toEqual(
      new AppError('Feedback not found!')
    );
  });
});
