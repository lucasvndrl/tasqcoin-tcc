// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { app } from '../../app';

export async function authUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  refresh_token: string;
}> {
  const authResponse = await request(app).post('/signin').send({
    email,
    password,
  });

  return {
    token: authResponse.body.token,
    refresh_token: authResponse.body.refresh_token,
  };
}
