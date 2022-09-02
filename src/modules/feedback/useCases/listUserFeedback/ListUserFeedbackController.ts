import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListUserFeedbackUseCase } from './ListUserFeedbackUseCase';

class ListUserFeedbackController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.query.id || request.user.id;
    const { page, pageSize, feedbackType } = request.query;

    const listUserFeedbackUseCase = container.resolve(ListUserFeedbackUseCase);

    const res = await listUserFeedbackUseCase.execute({
      user_id: String(id),
      ...(page && { page: Number(page) }),
      ...(pageSize && { pageSize: Number(pageSize) }),
      ...(feedbackType && {
        feedbackType: String(feedbackType) as FeedbackTypes,
      }),
    });

    return response.status(200).json(res);
  }
}

export { ListUserFeedbackController };
