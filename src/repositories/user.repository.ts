import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { UserEntity } from '../entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  private get userQueryBuilder(): SelectQueryBuilder<UserEntity> {
    return this.createQueryBuilder('user').leftJoinAndSelect(
      'user.records',
      'records',
    );
  }

  public async getUserByName(name: string): Promise<UserEntity> {
    return this.userQueryBuilder
      .where('user.name = :name', {
        name,
      })
      .getOne();
  }

  public async createAndSaveUser(name: string): Promise<UserEntity> {
    const newUser = new UserEntity();
    newUser.name = name;

    return this.save(newUser);
  }
}
