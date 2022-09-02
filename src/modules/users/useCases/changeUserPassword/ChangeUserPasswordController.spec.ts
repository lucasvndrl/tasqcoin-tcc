import request from 'supertest';
import { Connection } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import createConnection from '@shared/infra/typeorm';
import { authUser, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;
const user: ICreateUserDTO = {
  name: 'auth user',
  email: 'user@auth.com',
  password: 'password',
};
let token: string;

describe('Change User Password Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await createUser(user, connection);

    token = await authUser({
      email: user.email,
      password: user.password,
    }).then(({ token }) => token);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to change user password', async () => {
    const response = await request(app)
      .patch('/users/password')
      .send({
        password: user.password,
        newPassword: 'test',
        confirmNewPassword: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
  });

  it('Should not be able to change user password with not matching new passwords', async () => {
    const response = await request(app)
      .patch('/users/password')
      .send({
        password: user.password,
        newPassword: 'test',
        confirmNewPassword: 'test1',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });

  it('Should not be able to change user password with not matching new passwords', async () => {
    const response = await request(app)
      .patch('/users/password')
      .send({
        password: 'invalid',
        newPassword: 'test',
        confirmNewPassword: 'test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
  });
});
