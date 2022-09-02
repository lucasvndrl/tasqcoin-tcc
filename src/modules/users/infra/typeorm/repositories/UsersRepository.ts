import { getRepository, ILike, Not, Repository } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { User } from '../entities/User';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const user = this.repository.create(data);

    await this.repository.save(user);

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findOne(id);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email });
    return user;
  }

  async searchUsers(name: string, omitId: string): Promise<User[]> {
    const users = await this.repository.find({
      where: { id: Not(omitId), name: ILike(`%${name}%`) },
      take: 5,
    });
    return users;
  }

  async update(user: User) {
    await this.repository.save(user);
    return user;
  }
}

export { UsersRepository };
