import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { createUser } from '@utils/test/createUser';

import { app } from '../../../../app';

let connection: Connection;
let userFrom: User;
let userFromToken: string;
let userTo: User;

describe('Create Feedback Controller', () => {
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

    const userFromAuth = await request(app).post('/signin').send({
      email: userFrom.email,
      password: userFrom.password,
    });

    userFromToken = userFromAuth.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new feedback', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      })
      .send({
        amount: 9000,
        description: 'description',
        user_to_id: userTo.id,
      });
    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new feedback with insufficient balance', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      })
      .send({
        amount: 1100,
        description: 'description',
        user_to_id: userTo.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('User balance is too low!');
  });

  it('Should not be able to create a new feedback to a inexistent user', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      })
      .send({
        amount: 100,
        description: 'description',
        user_to_id: 'userTo.id',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('User not found!');
  });

  it('Should not be able to create a new feedback to an inexistent user', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      })
      .send({
        amount: 1100,
        description: 'description',
        user_to_id: userTo.id,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('User balance is too low!');
  });

  it('Should not be able to create a new feedback not been logged', async () => {
    const response = await request(app)
      .post('/feedbacks')
      .set({
        Authorization: `Bearer faketoken`,
      })
      .send({
        amount: 100,
        description: 'description',
        user_to_id: userTo.id,
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual('Invalid token!');
  });
});
