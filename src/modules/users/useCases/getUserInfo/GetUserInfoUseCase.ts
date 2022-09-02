import { inject, injectable } from 'tsyringe';

import { IUserResponseDTO } from '@modules/users/dtos/IUserResponseDTO';
import { UserMap } from '@modules/users/mapper/UserMap';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
class GetUserInfoUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id).catch(() => {
      throw new AppError('User not found!');
    });

    if (!user) throw new AppError('User not found!');

    return UserMap.toDTO(user);
  }
}

export { GetUserInfoUseCase };
