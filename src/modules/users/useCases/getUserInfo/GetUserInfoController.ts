import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { GetUserInfoUseCase } from './GetUserInfoUseCase';

class GetUserInfoController {
  async handle(request: Request, response: Response): Promise<Response> {
    const id = request.query.id || request.user.id;

    const getUserInfoUseCase = container.resolve(GetUserInfoUseCase);

    const userInfo = await getUserInfoUseCase.execute(String(id));

    return response.json(userInfo);
  }
}

export { GetUserInfoController };
