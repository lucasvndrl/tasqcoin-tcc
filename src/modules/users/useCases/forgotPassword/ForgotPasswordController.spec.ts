import request from 'supertest';
import { Connection } from 'typeorm';

import { User } from '@modules/users/infra/typeorm/entities/User';
import createConnection from '@shared/infra/typeorm';
import { createUser } from '@utils/test';

import { app } from '../../../../app';

let connection: Connection;

let user: User;

describe('Forgot Password Controller', () => {
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
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to send a forgot mail', async () => {
    const response = await request(app).post('/forgot-password').send({
      email: 'test@email.com',
    });

    expect(response.status).toBe(200);
  });
});
