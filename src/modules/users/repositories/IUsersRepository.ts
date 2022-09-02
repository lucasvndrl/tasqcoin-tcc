import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/typeorm/entities/User';

interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findById(id: string): Promise<User>;
  searchUsers(name: string, omitId?: string): Promise<User[]>;
  update(user: User): Promise<User>;
}

export { IUsersRepository };
