import { instanceToInstance } from 'class-transformer';

import { IUserResponseDTO } from '../dtos/IUserResponseDTO';
import { User } from '../infra/typeorm/entities/User';

class UserMap {
  static toDTO({
    avatar,
    avatar_url,
    id,
    name,
    balance,
    dark_balance,
  }: User): IUserResponseDTO {
    const user = instanceToInstance({
      avatar,
      avatar_url,
      id,
      name,
      balance,
      dark_balance,
    });
    return user;
  }
}

export { UserMap };
