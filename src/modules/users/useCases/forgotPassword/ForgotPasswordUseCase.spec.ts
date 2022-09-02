import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { UsersRefreshTokensRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { ForgotPasswordUseCase } from './ForgotPasswordUseCase';

let forgotPasswordUseCase: ForgotPasswordUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersRefreshTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe('Send forgot password mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersRefreshTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    forgotPasswordUseCase = new ForgotPasswordUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it('Should be able to send forgot password mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      name: 'name',
      email: 'email@example.com',
      password: '1234',
    });

    await forgotPasswordUseCase.execute('email@example.com');

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should be able to create a new after forgot password', async () => {
    const createToken = jest.spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      name: 'name',
      email: 'email@example.com',
      password: '1234',
    });

    await forgotPasswordUseCase.execute('email@example.com');

    expect(createToken).toHaveBeenCalled();
  });

  it('Should be able to send forgot password mail', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await expect(
      forgotPasswordUseCase.execute('email@example.com')
    ).rejects.toEqual(new AppError('Email is not registered to any account'));

    expect(sendMail).not.toHaveBeenCalled();
  });
});
