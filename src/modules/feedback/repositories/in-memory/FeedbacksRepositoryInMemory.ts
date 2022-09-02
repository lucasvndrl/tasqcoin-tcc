import { ICreateFeedbackDTO } from '@modules/feedback/dto/ICreateFeedback';
import { IRankingEntrieDTO } from '@modules/feedback/dto/IRankingEntrie';
import { Feedback } from '@modules/feedback/infra/typeorm/entities/Feedback';

import { IFeedbacksRepository } from '../IFeedbacksRepository';

class FeedbacksRepositoryInMemory implements IFeedbacksRepository {
  feedbacks: Feedback[] = [];

  async create(data: ICreateFeedbackDTO): Promise<Feedback> {
    const feedback = new Feedback();

    Object.assign(feedback, data);

    this.feedbacks.push(feedback);

    return feedback;
  }

  async listByUserId(
    user_id: string,
    feedbackType: FeedbackTypes,
    paginationOptions: PaginationOptions
  ): Promise<{ feedbacks: Feedback[]; totalPages: number }> {
    const { pageSize } = paginationOptions;
    const user_feedbacks = [...this.feedbacks]
      .filter(({ user_to_id, user_from_id }) => {
        let ids = [];
        if (feedbackType === 'both') {
          ids = [user_from_id, user_to_id];
        } else if (feedbackType === 'sent') {
          ids = [user_from_id];
        } else {
          ids = [user_to_id];
        }

        return ids.includes(user_id);
      })
      .sort(
        ({ created_at: aCreatedAt }, { created_at: bCreatedAt }) =>
          aCreatedAt.getTime() - bCreatedAt.getTime()
      );

    const start = ((paginationOptions?.page || 1) - 1) * pageSize;
    const end = Math.min(
      this.feedbacks.length,
      (paginationOptions?.page || 1) * pageSize
    );

    const feedbacks = user_feedbacks.slice(start, end);

    return {
      feedbacks,
      totalPages: Math.ceil(user_feedbacks.length / pageSize),
    };
  }

  async getUserBalance(
    user_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<number> {
    return this.feedbacks
      .filter(
        (feedback) =>
          feedback.user_to_id === user_id &&
          feedback.created_at.getTime() > start_date.getTime() &&
          feedback.created_at.getTime() < end_date.getTime()
      )
      .reduce((total, currentFeedback) => total + currentFeedback.amount, 0);
  }

  async getUsersRanking(
    start_date: Date,
    end_date: Date
  ): Promise<IRankingEntrieDTO[]> {
    return Object.values(
      this.feedbacks
        .filter(
          (feedback) =>
            feedback.created_at.getTime() > start_date.getTime() &&
            feedback.created_at.getTime() < end_date.getTime()
        )
        .reduce<Record<string, IRankingEntrieDTO>>((rankingEntries, fb) => {
          const user_id = fb.user_to_id;
          if (rankingEntries[user_id]) {
            const newRanking = { ...rankingEntries };
            newRanking[user_id].balance += fb.amount;
            return newRanking;
          }
          return {
            ...rankingEntries,
            [user_id]: {
              user_id,
              balance: fb.amount,
            },
          };
        }, {})
    ).sort((fbA, fbB) => fbB.balance - fbA.balance);
  }

  async findById(id: string): Promise<Feedback> {
    return this.feedbacks.find((fb) => id === fb.id);
  }

  async deleteById(id: string): Promise<void> {
    const a = this.feedbacks.findIndex((fb) => id === fb.id);
    this.feedbacks.splice(a, 1);
  }
}

export { FeedbacksRepositoryInMemory };
