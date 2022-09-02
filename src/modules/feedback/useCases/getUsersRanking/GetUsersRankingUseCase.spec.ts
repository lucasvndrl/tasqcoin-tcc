import { FeedbacksRepositoryInMemory } from '@modules/feedback/repositories/in-memory/FeedbacksRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';

import { GetUsersRankingUseCase } from './GetUsersRankingUseCase';

let feedbacksRepositoryInMemory: FeedbacksRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let getUsersRankingUseCase: GetUsersRankingUseCase;

describe('GetUsersRankingUseCase', () => {
  beforeAll(async () => {
    feedbacksRepositoryInMemory = new FeedbacksRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    getUsersRankingUseCase = new GetUsersRankingUseCase(
      feedbacksRepositoryInMemory,
      dateProvider
    );

    await Promise.all(
      Array.from(Array(12).keys()).map(async () => {
        await feedbacksRepositoryInMemory.create({
          amount: 100,
          description: 'send',
          user_from_id: '1',
          user_to_id: '2',
        });
      })
    );
    await Promise.all(
      Array.from(Array(10).keys()).map(async () => {
        await feedbacksRepositoryInMemory.create({
          amount: 100,
          description: 'send',
          user_from_id: '2',
          user_to_id: '3',
        });
      })
    );
    await Promise.all(
      Array.from(Array(8).keys()).map(async () => {
        await feedbacksRepositoryInMemory.create({
          amount: 100,
          description: 'send',
          user_from_id: '3',
          user_to_id: '1',
        });
      })
    );
  });

  it('Should be able to get users ranking correctly', async () => {
    const ranking = await getUsersRankingUseCase.execute();

    expect(ranking).toEqual([
      { user_id: '2', balance: 1200 },
      { user_id: '3', balance: 1000 },
      { user_id: '1', balance: 800 },
    ]);
  });
});
