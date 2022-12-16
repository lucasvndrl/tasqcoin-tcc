import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { User } from '@modules/users/infra/typeorm/entities/User';

@Entity('feedbacks')
class Feedback {
  @PrimaryColumn()
  id: string;

  @Column()
  description: string;

  @Column()
  amount: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_from_id' })
  user_from: User;

  @Column()
  user_from_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_to_id' })
  user_to: User;

  @Column()
  user_to_id: string;

  @Column()
  is_dark: boolean;

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) this.id = uuidV4();
    if (!this.created_at) this.created_at = new Date();
  }
}

export { Feedback };
