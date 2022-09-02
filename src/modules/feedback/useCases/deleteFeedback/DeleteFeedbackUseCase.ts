import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

import { IFeedbacksRepository } from '@modules/feedback/repositories/IFeedbacksRepository';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class DeleteFeedbackUseCase {
  constructor(
    @inject('FeedbacksRepository')
    private feedbackRepository: IFeedbacksRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(feedback_id: string): Promise<void> {
    const feedback = await this.feedbackRepository
      .findById(feedback_id)
      .catch(() => {
        throw new AppError('Feedback not found!');
      });

    if (!feedback) throw new AppError('Feedback not found!');

    const userFrom = await this.usersRepository.findById(feedback.user_from_id);

    await this.usersRepository.update(
      plainToInstance(User, {
        ...userFrom,
        balance: userFrom.balance + feedback.amount,
      })
    );

    await this.feedbackRepository.deleteById(feedback.id);
  }
}

export { DeleteFeedbackUseCase };
