// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import { Feedback } from '@modules/feedback/infra/typeorm/entities/Feedback';

import { app } from '../../app';

export async function createFeedback({
  userToId,
  userFromToken,
}: {
  userToId: string;
  userFromToken: string;
}): Promise<Feedback> {
  const response = await request(app)
    .post('/feedbacks')
    .set({
      Authorization: `Bearer ${userFromToken}`,
    })
    .send({
      amount: 100,
      description: 'description',
      user_to_id: userToId,
    });

  return response.body;
}
