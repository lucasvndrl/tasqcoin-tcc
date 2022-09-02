import { plainToInstance } from 'class-transformer';

import { IUserResponseDTO } from '@modules/users/dtos/IUserResponseDTO';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { UserMap } from '@modules/users/mapper/UserMap';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { GetUserInfoUseCase } from './GetUserInfoUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let getUserInfoUseCase: GetUserInfoUseCase;

let targetUser: IUserResponseDTO;

describe('GetUserInfoUseCase', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    getUserInfoUseCase = new GetUserInfoUseCase(usersRepositoryInMemory);

    targetUser = UserMap.toDTO(
      await usersRepositoryInMemory.create({
        email: 'test@email.com',
        name: 'Test Name',
        password: 'pass',
      })
    );
  });

  it('Should be able to search user info by id', async () => {
    const resultUser = await getUserInfoUseCase.execute(targetUser.id);

    expect(resultUser).toMatchObject(targetUser);
  });

  it('Should not be able to get info from a noexistent user', async () => {
    await expect(getUserInfoUseCase.execute('fake_id')).rejects.toEqual(
      new AppError('User not found!')
    );
  });
});
