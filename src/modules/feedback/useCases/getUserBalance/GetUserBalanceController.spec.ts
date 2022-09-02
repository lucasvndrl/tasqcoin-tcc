import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { authUser, createFeedback, createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;
let userFrom: User;
let userFromToken: string;
let userTo: User;

describe('Get User Balance Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    userFrom = await createUser(
      {
        name: 'userFrom',
        email: 'userFrom@feedback.com',
        password: 'password',
      },
      connection
    );
    userTo = await createUser(
      { name: 'userTo', email: 'userTo@feedback.com', password: 'password' },
      connection
    );

    const tokenResFrom = await authUser({
      email: userFrom.email,
      password: userFrom.password,
    });

    userFromToken = tokenResFrom.token;

    await Promise.all(
      Array.from(Array(12).keys()).map(async () => {
        await createFeedback({ userFromToken, userToId: userTo.id });
      })
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to get user balance', async () => {
    const response = await request(app)
      .get(`/feedbacks/balance`)
      .query({
        id: userTo.id,
      })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toBe(1200);
  });

  it('Should not be able to get balance from a inexistent user', async () => {
    const response = await request(app)
      .get(`/feedbacks/balance`)
      .query({
        id: 'fakeid',
      })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(400);
  });
});
