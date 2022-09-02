import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  avatar_file: string;
}

@injectable()
class UpdateUserAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ user_id, avatar_file }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found!');

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, 'avatar');
    }

    await this.storageProvider.save(avatar_file, 'avatar');

    user.avatar = avatar_file;

    await this.usersRepository.update(user);
  }
}

export { UpdateUserAvatarUseCase };
