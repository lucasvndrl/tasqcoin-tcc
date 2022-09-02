import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { authUser, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;

let user1: User;
let userToken: string;

let user2: User;

describe('Search Users Controller', () => {
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

    delete user1.balance;
    delete user1.password;

    user2 = await createUser(
      {
        name: 'Test Name 2',
        email: 'test2@email.com',
        password: 'pass2',
      },
      connection
    );

    delete user2.balance;
    delete user2.password;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to search users info by name', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ name: 'Test' })
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(user2)])
    );
  });

  it('Should not be able to search himself', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ name: 'Test Name 1' })
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    expect(response.status).toBe(200);

    expect(response.body.length).toEqual(0);
  });

  it('Should not be able to find any users given the wrong name', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ name: 'fake_name' })
      .set({
        Authorization: `Bearer ${userToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
