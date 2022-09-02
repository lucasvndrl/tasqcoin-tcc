import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

describe('Create User', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Test',
      password: 'test',
      confirmPassword: 'test',
      email: 'test@email.com',
    });

    expect(user).toHaveProperty('id');

    const user_created = await usersRepositoryInMemory.findByEmail(user.email);

    expect(user_created).toMatchObject(user);
  });

  it('Should not be able to create a new user with an email already in use', async () => {
    await expect(
      createUserUseCase.execute({
        name: 'Test',
        password: 'test',
        confirmPassword: 'test',
        email: 'test@email.com',
      })
    ).rejects.toEqual(new AppError('Users email already in use!'));
  });

  it('Should not be able to create a new user with unequal password and confirmPasswordFields', async () => {
    await expect(
      createUserUseCase.execute({
        name: 'Test',
        password: 'test',
        confirmPassword: 'wrong',
        email: 'test@email.com',
      })
    ).rejects.toEqual(
      new AppError('Password and Confirm Password fields must be equal!')
    );
  });
});
