import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import auth from '@config/auth';
import { IUsersRefreshTokensRepository } from '@modules/users/repositories/IUsersRefreshTokensRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class ForgotPasswordUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersRefreshTokensRepository')
    private usersTokensRepository: IUsersRefreshTokensRepository,

    @inject('DateProvider')
    private dateProvider: IDateProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email is not registered to any account');

    const token = uuidV4();

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expire_date: this.dateProvider.addMinutes(
        auth.forgot_pass_email_duration_minutes
      ),
    });

    await this.mailProvider.sendMail(
      email,
      'Recuperação de senha',
      {
        name: user.name,
        link: `${process.env.APP_SERVER_URL}/reset-password?token=${token}`,
        imgLink: `${process.env.LOGO_URL}`,
      },
      resolve(__dirname, '..', '..', 'views', 'emails', 'forgotPassword.hbs')
    );
  }
}

export { ForgotPasswordUseCase };
