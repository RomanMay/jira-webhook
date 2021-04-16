import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NamespaceEntity } from './namespace.entity';
import { RecordEntity } from './record.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => RecordEntity, (record) => record.user)
  records: RecordEntity[];

  @ManyToMany(() => NamespaceEntity, (namespace) => namespace.users)
  @JoinTable()
  namespaces: NamespaceEntity[];
}
