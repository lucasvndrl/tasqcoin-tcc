import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateFeedbackUseCase } from './CreateFeedbackUseCase';

class CreateFeedbackController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { amount, description, user_to_id, is_dark } = request.body;

    const createFeedbackUseCase = container.resolve(CreateFeedbackUseCase);

    const feedback = await createFeedbackUseCase.execute({
      amount,
      description,
      user_from_id: id,
      user_to_id,
      is_dark,
    });

    return response.status(201).json(feedback);
  }
}

export { CreateFeedbackController };
