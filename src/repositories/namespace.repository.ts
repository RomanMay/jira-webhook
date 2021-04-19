import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from 'typeorm-transactional-cls-hooked';

import { NamespaceEntity } from '../entities/namespace.entity';

@EntityRepository(NamespaceEntity)
export class NamespaceRepository extends BaseRepository<NamespaceEntity> {
  private get namespaceQueryBuilder(): SelectQueryBuilder<NamespaceEntity> {
    return this.createQueryBuilder('namespace').leftJoinAndSelect(
      'namespace.users',
      'users',
    );
  }

  public async getNamespaceByName(namespace: string): Promise<NamespaceEntity> {
    return this.namespaceQueryBuilder
      .where('namespace.name = :namespace', {
        namespace,
      })
      .getOne();
  }

  public async createAndSaveNamespace(
    namespace: string,
  ): Promise<NamespaceEntity> {
    const newNamespace = new NamespaceEntity();

    newNamespace.name = namespace;

    return this.save(newNamespace);
  }
}
