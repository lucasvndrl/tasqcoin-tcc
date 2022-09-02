import fs from 'fs';
import request from 'supertest';
import { Connection } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import createConnection from '@shared/infra/typeorm';
import { authUser } from '@utils/test/authUser';
import { createUser } from '@utils/test/createUser';

import { app } from '../../../../app';

let connection: Connection;
const user: ICreateUserDTO = {
  name: 'auth user',
  email: 'user@auth.com',
  password: 'password',
};
let token: string;

const tmpPath = `${__dirname}/../../../../../tmpTest/`;
const testImgPath = `${__dirname}/../../../../utils/test/assets/testImage.jpg`;

describe('Update User Avatar Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await createUser(user, connection);

    token = await authUser({
      email: user.email,
      password: user.password,
    }).then(({ token }) => token);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    if (fs.existsSync(tmpPath))
      fs.rmSync(tmpPath, { recursive: true, force: true });
  });

  it('Should be able to update user avatar', async () => {
    const response = await request(app)
      .patch('/users/avatar')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .attach('avatar', testImgPath);

    expect(response.status).toBe(204);
    expect(fs.readdirSync(`${tmpPath}/avatar`).length).toEqual(1);
  });
});
