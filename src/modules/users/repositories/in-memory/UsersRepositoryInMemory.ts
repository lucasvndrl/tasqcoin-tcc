import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/entities/User';

import { IUsersRepository } from '../IUsersRepository';

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, data);

    this.users.push(user);

    return user;
  }

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async searchUsers(name: string, omitId?: string): Promise<User[]> {
    return this.users
      .filter((user) => user.name.includes(name) && user.id !== omitId)
      .slice(0, 5);
  }

  async update(user: User) {
    const oldDataIdx = this.users.findIndex((u) => u.id === user.id);

    if (oldDataIdx !== -1) this.users[oldDataIdx] = user;

    return user;
  }
}

export { UsersRepositoryInMemory };
