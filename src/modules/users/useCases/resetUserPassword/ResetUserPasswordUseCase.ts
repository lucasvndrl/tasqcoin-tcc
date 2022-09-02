import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { IUsersRefreshTokensRepository } from '@modules/users/repositories/IUsersRefreshTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetUserPasswordUseCase {
  constructor(
    @inject('UsersRefreshTokensRepository')
    private usersTokenRepository: IUsersRefreshTokensRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ token, password }: IRequest) {
    const userToken = await this.usersTokenRepository.findByRefreshToken(token);

    if (!userToken) throw new AppError('Invalid Token');
    if (
      this.dateProvider.secondDiff(
        userToken.expire_date,
        this.dateProvider.dateNow()
      ) > 0
    )
      throw new AppError('Token expired!');

    const user = await this.usersRepository.findById(userToken.user_id);

    user.password = await hash(password, 8);

    await this.usersRepository.create(user);
    await this.usersTokenRepository.deleteById(userToken.id);
  }
}

export { ResetUserPasswordUseCase };
