import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { UserMap } from '@modules/users/mapper/UserMap';
import createConnection from '@shared/infra/typeorm';
import { authUser, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;

let user1: User;
let userToken: string;

let user2: User;

describe('Get User Info Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user1 = await createUser(
      {
        name: 'Test Name 1',
        email: 'test1@email.com',
        password: 'pass1',
      },
      connection
    );

    userToken = await authUser({
      email: user1.email,
      password: user1.password,
    }).then(({ token }) => token);

    user2 = await createUser(
      {
        name: 'Test Name 2',
        email: 'test2@email.com',
        password: 'pass2',
      },
      connection
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get user info', async () => {
    const response = await request(app)
      .get('/users')
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    const user1Map = UserMap.toDTO(user1);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(user1Map);
  });

  it('Should be able to get user info by query params', async () => {
    const response = await request(app)
      .get('/users')
      .query({ id: user2.id })
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    const user2Map = UserMap.toDTO(user2);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(user2Map);
  });

  it('Should not be able to get user info', async () => {
    const response = await request(app)
      .get('/users')
      .query({ id: 'fake id' })
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).not.toMatchObject(user2);
  });
});
