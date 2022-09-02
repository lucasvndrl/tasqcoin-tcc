import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ChangeUserNameUseCase } from './ChangeUserNameUseCase';

class ChangeUserNameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { name } = request.body;

    const changeUserNameUseCase = container.resolve(ChangeUserNameUseCase);

    const user = await changeUserNameUseCase.execute(id, name);

    return response.status(200).json(user);
  }
}

export { ChangeUserNameController };
