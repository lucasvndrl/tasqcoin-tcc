import { inject, injectable } from 'tsyringe';

import { IRankingEntrieDTO } from '@modules/feedback/dto/IRankingEntrie';
import { IFeedbacksRepository } from '@modules/feedback/repositories/IFeedbacksRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';

@injectable()
class GetUsersRankingUseCase {
  constructor(
    @inject('FeedbacksRepository')
    private feedbackRepository: IFeedbacksRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(): Promise<IRankingEntrieDTO[]> {
    const ranking = await this.feedbackRepository.getUsersRanking(
      this.dateProvider.startOfMonth(),
      this.dateProvider.endOfMonth()
    );

    return ranking;
  }
}

export { GetUsersRankingUseCase };
