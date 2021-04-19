import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTimeSpentTimeToString1618841288197
  implements MigrationInterface {
  name = 'ChangeTimeSpentTimeToString1618841288197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record_entity" DROP COLUMN "time_spent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record_entity" ADD "time_spent" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "record_entity" DROP COLUMN "time_spent"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record_entity" ADD "time_spent" integer NOT NULL`,
    );
  }
}
