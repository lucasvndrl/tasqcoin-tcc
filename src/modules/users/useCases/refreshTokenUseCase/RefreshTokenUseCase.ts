import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRefreshTokensRepository } from '@modules/users/repositories/IUsersRefreshTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {
  constructor(
    @inject('UsersRefreshTokensRepository')
    private usersRefreshTokensRepository: IUsersRefreshTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(token: string): Promise<string> {
    const { secret_token, secret_refresh_token, expires_in_token } = auth;
    let user_id;

    try {
      const { sub } = verify(token, secret_refresh_token) as IPayload;
      user_id = sub;
    } catch (e) {
      throw new AppError('Invalid Token!', 401);
    }

    const userToken = await this.usersRefreshTokensRepository.matchRefreshToken(
      user_id,
      token
    );

    if (!userToken) throw new AppError('Refresh Token not found!', 401);

    const isTokenExpired =
      this.dateProvider.secondDiff(
        userToken.expire_date,
        this.dateProvider.dateNow()
      ) > 0;

    if (isTokenExpired) {
      await this.usersRefreshTokensRepository.deleteById(userToken.id);
      throw new AppError('Refresh Token is expired!', 401);
    }

    const new_token = sign({}, secret_token, {
      subject: user_id,
      expiresIn: expires_in_token,
    });

    return new_token;
  }
}

export { RefreshTokenUseCase };
