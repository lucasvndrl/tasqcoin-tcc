import request from 'supertest';
import { Connection } from 'typeorm';

import createConnection from '@shared/infra/typeorm';

import { app } from '../../../../app';

let connection: Connection;

describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test',
      password: 'test',
      confirmPassword: 'test',
      email: 'test@email.com',
    });

    expect(response.status).toBe(201);
  });

  it('Should not be able to create a new user with an existing email', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test',
      password: 'test',
      confirmPassword: 'test',
      email: 'test@email.com',
    });

    expect(response.status).toBe(400);
  });
});
