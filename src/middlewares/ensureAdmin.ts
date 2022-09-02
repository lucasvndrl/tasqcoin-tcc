import { NextFunction, Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { is_admin } = request.user;

  if (!is_admin) throw new AppError('User isnt admin', 403);

  return next();
}
