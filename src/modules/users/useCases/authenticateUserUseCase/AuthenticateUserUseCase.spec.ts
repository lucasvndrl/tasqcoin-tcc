import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { UsersRefreshTokensRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from '../createUserUseCase/CreateUserUseCase';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersRefreshTokensRepositoryInMemory: UsersRefreshTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let user: ICreateUserDTO;

describe('Authenticate user use case', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersRefreshTokensRepositoryInMemory =
      new UsersRefreshTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersRefreshTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    user = {
      email: 'user@example.com',
      password: 'password',
      name: 'test name',
    };

    await createUserUseCase.execute({ ...user, confirmPassword: 'password' });
  });

  it('Should be able to authenticate an user', async () => {
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refresh_token');
  });

  it('Should not be able to authenticate an non-existing user', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong email',
        password: user.password,
      })
    ).rejects.toEqual(new AppError('Incorrect email or password!', 401));
  });

  it('Should not be able to authenticate an user with incorrect password', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong pass',
      })
    ).rejects.toEqual(new AppError('Incorrect email or password!', 401));
  });
});
