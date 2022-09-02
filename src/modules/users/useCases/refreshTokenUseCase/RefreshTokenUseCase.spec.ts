import { sign, verify } from 'jsonwebtoken';

import auth from '@config/auth';
import { UsersRefreshTokensRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '@shared/errors/AppError';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

let refreshTokenUseCase: RefreshTokenUseCase;
let usersRefreshTokensRepositoryInMemory: UsersRefreshTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

function createToken(user_id: string, expiresIn = '5s') {
  return sign({}, auth.secret_refresh_token, {
    subject: user_id,
    expiresIn,
  });
}

describe('RefreshTokenUseCase', () => {
  beforeEach(() => {
    usersRefreshTokensRepositoryInMemory =
      new UsersRefreshTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    refreshTokenUseCase = new RefreshTokenUseCase(
      usersRefreshTokensRepositoryInMemory,
      dateProvider
    );

    jest.useFakeTimers();
  });

  it('Should refresh a token after a valid token is provided', async () => {
    const { refresh_token, user_id } =
      await usersRefreshTokensRepositoryInMemory.create({
        user_id: 'id',
        expire_date: dateProvider.addSeconds(5),
        refresh_token: createToken('id'),
      });

    const newToken = await refreshTokenUseCase.execute(refresh_token);

    const { sub } = verify(newToken, auth.secret_token);
    expect(newToken).toBeTruthy();
    expect(sub).toEqual(user_id);
  });

  it('Should not refresh a token after an invalid token is provided', async () => {
    await expect(refreshTokenUseCase.execute('invalid')).rejects.toEqual(
      new AppError('Invalid Token!', 401)
    );
    await expect(
      refreshTokenUseCase.execute(createToken('invalid'))
    ).rejects.toEqual(new AppError('Refresh Token not found!', 401));
  });

  it('Should not refresh a token after an expired token is provided', async () => {
    const { refresh_token } = await usersRefreshTokensRepositoryInMemory.create(
      {
        user_id: 'id',
        expire_date: dateProvider.addSeconds(5),
        refresh_token: createToken('id'),
      }
    );

    jest.useFakeTimers().setSystemTime(dateProvider.addSeconds(10));

    await expect(refreshTokenUseCase.execute(refresh_token)).rejects.toEqual(
      new AppError('Invalid Token!', 401)
    );

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
