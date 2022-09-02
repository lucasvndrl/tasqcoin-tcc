import request from 'supertest';
import { Connection } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
// import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import createConnection from '@shared/infra/typeorm';
import { authUser } from '@utils/test/authUser';
import { createUser } from '@utils/test/createUser';

import { app } from '../../../../app';

let connection: Connection;
// const dateProvider = new DayjsDateProvider();
const user: ICreateUserDTO = {
  name: 'auth user',
  email: 'user@auth.com',
  password: 'password',
};

let refreshToken: string;

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await createUser(user, connection);

    const { refresh_token } = await authUser({
      email: user.email,
      password: user.password,
    });
    refreshToken = refresh_token;

    // jest.useFakeTimers().setSystemTime(new Date());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to refresh a token', async () => {
    const response = await request(app).post('/refresh-token').send({
      token: refreshToken,
    });

    expect(response.status).toBe(200);
  });

  it('Should not refresh a token after an invalid token is provided', async () => {
    const response = await request(app).post('/refresh-token').send({
      token: 'invalid',
    });

    expect(response.status).toBe(401);
  });

  it.skip('Should not refresh a token after an expired token is provided', async () => {
    // jest.useFakeTimers().setSystemTime(dateProvider.addMinutes(32));
    const response = await request(app).post('/refresh-token').send({
      token: refreshToken,
    });

    expect(response.status).toBe(401);
  });
});
