import { getRepository, Repository } from 'typeorm';

import { ICreateFeedbackDTO } from '@modules/feedback/dto/ICreateFeedback';
import { IRankingEntrieDTO } from '@modules/feedback/dto/IRankingEntrie';
import { IFeedbacksRepository } from '@modules/feedback/repositories/IFeedbacksRepository';
import { paginationOptionsToQueryOptions } from '@utils/pagination';

import { Feedback } from '../entities/Feedback';

class FeedbacksRepository implements IFeedbacksRepository {
  private repository: Repository<Feedback>;

  constructor() {
    this.repository = getRepository(Feedback);
  }

  async create(data: ICreateFeedbackDTO): Promise<Feedback> {
    const feedback = this.repository.create(data);

    await this.repository.save(feedback);

    return feedback;
  }

  async listByUserId(
    user_id: string,
    feedbackType: FeedbackTypes,
    paginationOptions: PaginationOptions
  ): Promise<{ feedbacks: Feedback[]; totalPages: number }> {
    const options = paginationOptionsToQueryOptions(paginationOptions);

    let where = [];
    if (feedbackType === 'both') {
      where = [{ user_from_id: user_id }, { user_to_id: user_id }];
    } else if (feedbackType === 'sent') {
      where.push({ user_from_id: user_id });
    } else {
      where.push({ user_to_id: user_id });
    }

    const [feedbacks, totalEntries] = await this.repository.findAndCount({
      where,
      order: {
        created_at: 'DESC',
      },
      relations: ['user_to', 'user_from'],
      ...options,
    });

    return { feedbacks, totalPages: Math.ceil(totalEntries / options.take) };
  }

  async getUserBalance(
    user_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<number> {
    const [{ sum }] = await this.repository
      .createQueryBuilder('f')
      .select('SUM(f.amount)', 'sum')
      .andWhere('f.user_to_id = :id', { id: user_id })
      .andWhere('f.created_at BETWEEN :start AND :end', {
        start: start_date,
        end: end_date,
      })
      .execute();

    return Number(sum);
  }

  async getUsersRanking(
    start_date: Date,
    end_date: Date
  ): Promise<IRankingEntrieDTO[]> {
    const rank = await this.repository.query(
      `select f.user_to_id as user_id, u.name as user_name, sum(f.amount) as balance from feedbacks as f join users as u on u.id = f.user_to_id where f.created_at BETWEEN '${start_date.toISOString()}' AND '${end_date.toISOString()}' group by 1, 2 order by balance DESC`
    );

    return rank;
  }

  async findById(id: string): Promise<Feedback> {
    const feedback = await this.repository.findOne(id);
    return feedback;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export { FeedbacksRepository };
