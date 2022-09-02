import fs from 'fs';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { UsersRepositoryInMemory } from '@modules/users/repositories/in-memory/UsersRepositoryInMemory';
import { LocalStorageProvider } from '@shared/container/providers/StorageProvider/implementations/LocalStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

let usersRepositoryInMemory: UsersRepositoryInMemory;
let localStorageProvider: LocalStorageProvider;
let updateUserAvatarUseCase: UpdateUserAvatarUseCase;
let user: User;

const imgName1 = 'img1.jpg';
const imgName2 = 'img2.jpg';

const testImgPath = `${__dirname}/../../../../utils/test/assets/testImage.jpg`;
const tmpPath = `${__dirname}/../../../../../tmpTest/`;

describe('Update user avatar', () => {
  beforeAll(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    localStorageProvider = new LocalStorageProvider();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      usersRepositoryInMemory,
      localStorageProvider
    );
    user = await usersRepositoryInMemory.create({
      name: 'user',
      password: 'pass',
      email: 'user@example.com',
    });

    fs.copyFile(testImgPath, `${tmpPath}/${imgName1}`, (err) => {
      if (err) console.log(err);
    });
    fs.copyFile(testImgPath, `${tmpPath}/${imgName2}`, (err) => {
      if (err) console.log(err);
    });
  });

  afterAll(() => {
    if (fs.existsSync(tmpPath))
      fs.rmSync(tmpPath, { recursive: true, force: true });
  });

  it('Should be able to create user avatar', async () => {
    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatar_file: imgName1,
    });

    expect(fs.existsSync(`${tmpPath}/avatar/${imgName1}`)).toBe(true);
    expect(user.avatar).toEqual(imgName1);
  });

  it('Should be able to update user avatar replacing the old image', async () => {
    await updateUserAvatarUseCase.execute({
      user_id: user.id,
      avatar_file: imgName2,
    });

    expect(fs.existsSync(`${tmpPath}/avatar/${imgName1}`)).toBe(false);
    expect(fs.existsSync(`${tmpPath}/avatar/${imgName2}`)).toBe(true);
    expect(user.avatar).toEqual(imgName2);
  });

  it('Should not be able to create or delete avatar from a inexistent user', async () => {
    await expect(
      updateUserAvatarUseCase.execute({
        user_id: 'fakeId',
        avatar_file: imgName2,
      })
    ).rejects.toEqual(new AppError('User not found!'));
  });
});
