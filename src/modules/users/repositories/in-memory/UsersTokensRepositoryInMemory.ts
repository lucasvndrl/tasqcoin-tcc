import { ICreateUserRefreshTokenDTO } from '@modules/users/dtos/ICreateUserRefreshTokenDTO';
import { UserRefreshToken } from '@modules/users/infra/typeorm/entities/UserRefreshToken';

import { IUsersRefreshTokensRepository } from '../IUsersRefreshTokensRepository';

class UsersRefreshTokensRepositoryInMemory
  implements IUsersRefreshTokensRepository
{
  usersTokens: UserRefreshToken[] = [];

  async create(data: ICreateUserRefreshTokenDTO): Promise<UserRefreshToken> {
    const userToken = new UserRefreshToken();
    Object.assign(userToken, { ...data });
    this.usersTokens.push(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex((ut) => ut.id === id);
    this.usersTokens.splice(userTokenIndex);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserRefreshToken> {
    return this.usersTokens.find(
      (userToken) => userToken.refresh_token === refresh_token
    );
  }

  async matchRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserRefreshToken> {
    return this.usersTokens.find(
      (userToken) =>
        userToken.refresh_token === refresh_token &&
        userToken.user_id === user_id
    );
  }
}

export { UsersRefreshTokensRepositoryInMemory };
