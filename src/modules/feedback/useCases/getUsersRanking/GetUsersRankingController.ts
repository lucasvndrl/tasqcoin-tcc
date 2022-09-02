import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetUsersRankingUseCase } from './GetUsersRankingUseCase';

class GetUsersRankingController {
  async handle(_: Request, response: Response): Promise<Response> {
    const getUsersRankingUseCase = container.resolve(GetUsersRankingUseCase);

    const ranking = await getUsersRankingUseCase.execute();

    return response.json(ranking);
  }
}

export { GetUsersRankingController };
