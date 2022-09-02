import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    email,
    name,
    password,
    confirmPassword,
  }: ICreateUserDTO & {
    confirmPassword: string;
  }): Promise<User> {
    if (password !== confirmPassword)
      throw new AppError('Password and Confirm Password fields must be equal!');

    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) throw new AppError('Users email already in use!');

    const passwordHash = await hash(password, 8);

    const user = {
      ...(await this.usersRepository.create({
        email,
        name,
        password: passwordHash,
      })),
    };

    delete user.password;

    return plainToInstance(User, user);
  }
}

export { CreateUserUseCase };
