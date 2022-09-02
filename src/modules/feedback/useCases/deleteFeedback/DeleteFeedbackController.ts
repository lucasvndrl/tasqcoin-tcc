import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DeleteFeedbackUseCase } from './DeleteFeedbackUseCase';

class DeleteFeedbackController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteFeedbackUseCase = container.resolve(DeleteFeedbackUseCase);

    await deleteFeedbackUseCase.execute(id);

    return response.status(200).send();
  }
}

export { DeleteFeedbackController };
