import { hash } from 'bcrypt';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { ChangeUserPasswordUseCase } from './ChangeUserPasswordUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let changeUserPasswordUseCase: ChangeUserPasswordUseCase;
let user: User;

describe('', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    changeUserPasswordUseCase = new ChangeUserPasswordUseCase(
      usersRepositoryInMemory
    );

    const passwordHash = await hash('pass', 8);

    user = await usersRepositoryInMemory.create({
      name: 'user',
      password: passwordHash,
      email: 'user@example.com',
    });
  });

  it('Should be able to change user password', async () => {
    await expect(
      changeUserPasswordUseCase.execute({
        id: user.id,
        password: 'pass',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      })
    ).resolves.not.toThrow();
  });

  it('Should not be able to change user password with not matching new passwords', async () => {
    await expect(
      changeUserPasswordUseCase.execute({
        id: user.id,
        password: user.password,
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword1',
      })
    ).rejects.toEqual(new AppError('Passwords do not match!'));
  });

  it('Should not be able to change user password with invalid current password', async () => {
    await expect(
      changeUserPasswordUseCase.execute({
        id: user.id,
        password: 'invalid pass',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      })
    ).rejects.toEqual(new AppError('Incorrect password!', 401));
  });
});
