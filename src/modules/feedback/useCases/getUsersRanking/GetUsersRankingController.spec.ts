import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { authUser, createFeedback, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;
let user1: User;
let user2: User;
let user3: User;

let token1: string;
let token2: string;
let token3: string;

describe('Get Users Ranking Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    user1 = await createUser(
      {
        name: 'user1',
        email: 'user1@test.com',
        password: 'pass',
      },
      connection
    );
    user2 = await createUser(
      {
        name: 'user2',
        email: 'user1@test.com',
        password: 'pass',
      },
      connection
    );
    user3 = await createUser(
      {
        name: 'user3',
        email: 'user1@test.com',
        password: 'pass',
      },
      connection
    );

    token1 = await authUser({
      email: user1.email,
      password: user1.password,
    }).then(({ token }) => token);
    token2 = await authUser({
      email: user2.email,
      password: user2.password,
    }).then(({ token }) => token);
    token3 = await authUser({
      email: user3.email,
      password: user3.password,
    }).then(({ token }) => token);

    await Promise.all(
      Array.from(Array(10).keys()).map(async () => {
        await createFeedback({
          userFromToken: token1,
          userToId: user2.id,
        });
      })
    );
    await Promise.all(
      Array.from(Array(8).keys()).map(async () => {
        await createFeedback({
          userFromToken: token2,
          userToId: user3.id,
        });
      })
    );
    await Promise.all(
      Array.from(Array(12).keys()).map(async () => {
        await createFeedback({
          userFromToken: token3,
          userToId: user1.id,
        });
      })
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get users ranking correctly', async () => {
    const response = await request(app)
      .get('/feedbacks/ranking')
      .set({
        Authorization: `Bearer ${token1}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        user_id: user1.id,
        user_name: user1.name,
        balance: '1200',
      },
      {
        user_id: user2.id,
        user_name: user2.name,
        balance: '1000',
      },
      {
        user_id: user3.id,
        user_name: user3.name,
        balance: '800',
      },
    ]);
  });
});
