import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';

import { SearchUsersUseCase } from './SearchUsersUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let searchUsersUseCase: SearchUsersUseCase;

let user1: User;
let user2: User;

describe('SearchUsersUseCase', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    searchUsersUseCase = new SearchUsersUseCase(usersRepositoryInMemory);

    user1 = await usersRepositoryInMemory.create({
      email: 'test@email.com',
      name: 'Test Name 1',
      password: 'pass',
    });

    user2 = await usersRepositoryInMemory.create({
      email: 'test@email.com',
      name: 'Test Name 2',
      password: 'pass',
    });
  });

  it('Should be able to search users info by name', async () => {
    let resultUsers = await searchUsersUseCase.execute('Test');

    expect(resultUsers).toContain(user1);
    expect(resultUsers).toContain(user2);

    resultUsers = await searchUsersUseCase.execute('Test Name 1');

    expect(resultUsers).toContain(user1);
    expect(resultUsers).not.toContain(user2);
  });

  it('Should not be able to search user1 given its id', async () => {
    const resultUsers = await searchUsersUseCase.execute(
      'Test Name 1',
      user1.id
    );

    expect(resultUsers).not.toContain(user1);
    expect(resultUsers).not.toContain(user2);
  });

  it('Should not be able to find any users given the wrong name', async () => {
    const resultUsers = await searchUsersUseCase.execute('fake_name');

    expect(resultUsers).toEqual([]);
  });
});
