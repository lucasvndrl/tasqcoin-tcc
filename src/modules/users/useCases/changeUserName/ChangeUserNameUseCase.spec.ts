import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { ChangeUserNameUseCase } from './ChangeUserNameUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let changeUserNameUseCase: ChangeUserNameUseCase;

let targetUser: User;

describe('ChangeUserNameUseCase', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    changeUserNameUseCase = new ChangeUserNameUseCase(usersRepositoryInMemory);

    targetUser = await usersRepositoryInMemory.create({
      email: 'test@email.com',
      name: 'Test Name',
      password: 'pass',
    });
  });

  it('Should be able to change user name', async () => {
    const resultUser = await changeUserNameUseCase.execute(
      targetUser.id,
      'New Name'
    );

    expect(resultUser.name).toBe('New Name');

    await expect(
      usersRepositoryInMemory.findById(targetUser.id)
    ).resolves.toEqual(resultUser);
  });

  it('Should not be able to change name from a non-existet user', async () => {
    await expect(
      changeUserNameUseCase.execute('fake_id', 'New Name')
    ).rejects.toEqual(new AppError('User not found!'));
  });
});
