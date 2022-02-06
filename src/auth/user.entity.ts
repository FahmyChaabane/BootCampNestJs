import { Task } from './../tasks/task.entity';
import * as bcrypt from 'bcryptjs';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  @OneToMany(() => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    /* Ariel did this, but i am not ok with it.
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
    */
    return await bcrypt.compare(password, this.password);
  }
}
