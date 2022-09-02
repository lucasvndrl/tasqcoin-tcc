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

let feedback_id: string;

describe('Delete Feedback Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    userFrom = await createUser(
      {
        name: 'userFrom',
        email: 'userFrom@feedback.com',
        password: 'password',
      },
      connection,
      true
    );
    userTo = await createUser(
      { name: 'userTo', email: 'userTo@feedback.com', password: 'password' },
      connection
    );

    userFromToken = await authUser({
      email: userFrom.email,
      password: userFrom.password,
    }).then(({ token }) => token);

    feedback_id = await createFeedback({
      userFromToken,
      userToId: userTo.id,
    }).then(({ id }) => id);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to delete a feedback', async () => {
    const response = await request(app)
      .delete(`/feedbacks/${feedback_id}`)
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
  });

  it('Should not be able to delete a inexistent feedback', async () => {
    const response = await request(app)
      .delete('/feedbacks/fakeid')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(400);
  });
});
