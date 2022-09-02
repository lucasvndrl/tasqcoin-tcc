import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ChangeUserPasswordUseCase } from './ChangeUserPasswordUseCase';

class ChangeUserPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { password, newPassword, confirmNewPassword } = request.body;

    const changeUserPasswordUseCase = container.resolve(
      ChangeUserPasswordUseCase
    );

    await changeUserPasswordUseCase.execute({
      id,
      password,
      newPassword,
      confirmNewPassword,
    });

    return response.send();
  }
}

export { ChangeUserPasswordController };
