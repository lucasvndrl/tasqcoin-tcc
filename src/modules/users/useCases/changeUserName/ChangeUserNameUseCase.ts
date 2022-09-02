import { inject, injectable } from 'tsyringe';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ChangeUserNameUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string, name: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new AppError('User not found!');

    user.name = name;

    await this.usersRepository.update(user);

    delete user.password;

    return user;
  }
}

export { ChangeUserNameUseCase };
