import { ICreateUserRefreshTokenDTO } from '../dtos/ICreateUserRefreshTokenDTO';
import { UserRefreshToken } from '../infra/typeorm/entities/UserRefreshToken';

interface IUsersRefreshTokensRepository {
  create(data: ICreateUserRefreshTokenDTO): Promise<UserRefreshToken>;
  deleteById(id: string): Promise<void>;
  matchRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserRefreshToken>;
  findByRefreshToken(refresh_token: string): Promise<UserRefreshToken>;
}

export { IUsersRefreshTokensRepository };
