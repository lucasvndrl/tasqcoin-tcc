import { inject, injectable } from 'tsyringe';

import { IFeedbacksRepository } from '@modules/feedback/repositories/IFeedbacksRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class GetUserBalanceUseCase {
  constructor(
    @inject('FeedbacksRepository')
    private feedbackRepository: IFeedbacksRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(user_id: string): Promise<{
    balance: number;
    dark_balance: number;
  }> {
    const user = await this.usersRepository.findById(user_id).catch(() => {
      throw new AppError('User not found!');
    });

    if (!user) throw new AppError('User not found!');

    const balance = await this.feedbackRepository.getUserBalance(
      user_id,
      this.dateProvider.startOfMonth(),
      this.dateProvider.endOfMonth()
    );

    const dark_balance = await this.feedbackRepository.getUserBalance(
      user_id,
      this.dateProvider.startOfMonth(),
      this.dateProvider.endOfMonth(),
      true
    );

    return { balance, dark_balance };
  }
}

export { GetUserBalanceUseCase };
