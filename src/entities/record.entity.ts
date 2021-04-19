import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class RecordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  project: string;

  @Column({ type: 'varchar' })
  sprint: string;

  @Column({ type: 'varchar' })
  task: string;

  @Column({ type: 'varchar' })
  summary: string;

  @Column({ type: 'varchar' })
  timeSpent: string;

  @Column({ type: 'timestamp' })
  dateLogged: Date;

  @ManyToOne(() => UserEntity, (user) => user.records)
  @JoinColumn()
  user: UserEntity;
}
