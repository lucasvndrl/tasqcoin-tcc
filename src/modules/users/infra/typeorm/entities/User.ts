import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  balance: number;

  @Column()
  dark_balance: number;

  @Column()
  is_admin: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @Expose({ name: 'avatar_url' })
  avatar_url(): string {
    switch (process.env.disk) {
      case 'local':
        return `${process.env.SERVER_URL}/public/avatar/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar.replace(
          /\s/g,
          '+'
        )}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) this.id = uuidV4();
    if (!this.balance) this.balance = 1000;
    if (!this.dark_balance) this.dark_balance = 50;
  }
}

export { User };
