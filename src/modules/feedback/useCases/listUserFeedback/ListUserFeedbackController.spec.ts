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
let userToToken: string;

describe('List User Feedback Controller', () => {
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
    const tokenResTo = await authUser({
      email: userTo.email,
      password: userTo.password,
    });

    userToToken = tokenResTo.token;

    await Promise.all(
      Array.from(Array(12).keys()).map(async () => {
        await createFeedback({ userFromToken, userToId: userTo.id });
      })
    );

    await createFeedback({
      userFromToken: userToToken,
      userToId: userFrom.id,
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to list all feedbacks(first page)', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.feedbacks.length).toBe(8);
  });

  it('Should be able to list all feedbacks (id provided via params)', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ id: userFrom.id })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.feedbacks.length).toBe(8);
  });

  it('Should be able to list all sent feedbacks', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ feedbackType: 'sent' })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.feedbacks.length).toBe(8);
  });

  it('Should be able to list all recieved feedbacks', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ feedbackType: 'recieved', pageSize: 200 })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.feedbacks.length).toBe(1);
    expect(response.body.totalPages).toBe(1);
  });

  it('Should be able to paginate all users feedbacks', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ page: 2 })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.totalPages).toBe(2);
    expect(response.body.feedbacks.length).toBe(5);
  });

  it('Should be able to change users feedbacks page size', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ pageSize: 1 })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.totalPages).toBe(13);
    expect(response.body.feedbacks.length).toBe(1);
  });

  it('Should not be able to list all feedbacks from a inexistent user', async () => {
    const response = await request(app)
      .get('/feedbacks')
      .query({ id: 'fake_id' })
      .set({
        Authorization: `Bearer ${userFromToken}`,
      });

    expect(response.status).toBe(400);
  });
});
