import request from 'supertest';
import { Connection } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import createConnection from '@shared/infra/typeorm';
import { createUser } from '@utils/test/createUser';

import { app } from '../../../../app';

let connection: Connection;
const user: ICreateUserDTO = {
  name: 'auth user',
  email: 'user@auth.com',
  password: 'password',
};

describe('Authenticate User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await createUser(user, connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to authenticate an user', async () => {
    const response = await request(app).post('/signin').send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
  });

  it('Should not be able to authenticate an non-existing user', async () => {
    const response = await request(app).post('/signin').send({
      email: 'wrong email',
      password: user.password,
    });

    expect(response.status).toBe(401);
  });

  it('Should not be able to authenticate an user with incorrect password', async () => {
    const response = await request(app).post('/signin').send({
      email: user.email,
      password: 'wrong pass',
    });

    expect(response.status).toBe(401);
  });
});
