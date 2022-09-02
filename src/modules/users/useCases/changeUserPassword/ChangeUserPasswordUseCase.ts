import { compare, hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  id: string;
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

@injectable()
class ChangeUserPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    id,
    password,
    newPassword,
    confirmNewPassword,
  }: IRequest): Promise<void> {
    if (newPassword !== confirmNewPassword)
      throw new AppError('Passwords do not match!');

    const user = await this.usersRepository.findById(id);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) throw new AppError('Incorrect password!', 401);

    user.password = await hash(newPassword, 8);

    await this.usersRepository.update(user);
  }
}

export { ChangeUserPasswordUseCase };
