import { getRepository, Repository } from 'typeorm';

import { ICreateUserRefreshTokenDTO } from '@modules/users/dtos/ICreateUserRefreshTokenDTO';
import { IUsersRefreshTokensRepository } from '@modules/users/repositories/IUsersRefreshTokensRepository';

import { UserRefreshToken } from '../entities/UserRefreshToken';

class UsersRefreshTokensRepository implements IUsersRefreshTokensRepository {
  private repository: Repository<UserRefreshToken>;

  constructor() {
    this.repository = getRepository(UserRefreshToken);
  }

  async create(data: ICreateUserRefreshTokenDTO): Promise<UserRefreshToken> {
    const userRefreshToken = this.repository.create(data);
    await this.repository.save(userRefreshToken);
    return userRefreshToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async matchRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserRefreshToken> {
    const userRefreshToken = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return userRefreshToken;
  }

  async findByRefreshToken(refresh_token: string): Promise<UserRefreshToken> {
    const userRefreshToken = await this.repository.findOne({
      refresh_token,
    });
    return userRefreshToken;
  }
}

export { UsersRefreshTokensRepository };
