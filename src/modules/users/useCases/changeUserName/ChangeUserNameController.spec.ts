import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { authUser, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;

let user: User;
let userToken: string;

describe('Change User Name Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user = await createUser(
      {
        name: 'Test Name',
        email: 'test@email.com',
        password: 'pass',
      },
      connection
    );

    userToken = await authUser({
      email: user.email,
      password: user.password,
    }).then(({ token }) => token);

    delete user.balance;
    delete user.password;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to change user name', async () => {
    const response = await request(app)
      .patch('/users/change-name')
      .set({
        Authorization: `Bearer ${userToken}`,
      })
      .send({
        name: 'New Name',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ...user, name: 'New Name' });
  });
});
