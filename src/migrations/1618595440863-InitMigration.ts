import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1618595440863 implements MigrationInterface {
  name = 'InitMigration1618595440863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "record_entity" ("id" SERIAL NOT NULL, "user_id" integer, CONSTRAINT "PK_aef4feaa1f3fcb191cdf27963fa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "namespace_entity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8d584e41fac1e57f1c49426eb33" UNIQUE ("name"), CONSTRAINT "PK_ebe7c78821aeff334df7fdfaa71" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity_namespaces_namespace_entity" ("user_entity_id" integer NOT NULL, "namespace_entity_id" integer NOT NULL, CONSTRAINT "PK_6e9bd11081f7c25839da6f63947" PRIMARY KEY ("user_entity_id", "namespace_entity_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1c81d90868815d3b07de3784ca" ON "user_entity_namespaces_namespace_entity" ("user_entity_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adfe2964821da81ba1e7c44382" ON "user_entity_namespaces_namespace_entity" ("namespace_entity_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "record_entity" ADD CONSTRAINT "FK_9eeb15fd9a9994d3e1326b2439f" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity_namespaces_namespace_entity" ADD CONSTRAINT "FK_1c81d90868815d3b07de3784caa" FOREIGN KEY ("user_entity_id") REFERENCES "user_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity_namespaces_namespace_entity" ADD CONSTRAINT "FK_adfe2964821da81ba1e7c443824" FOREIGN KEY ("namespace_entity_id") REFERENCES "namespace_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity_namespaces_namespace_entity" DROP CONSTRAINT "FK_adfe2964821da81ba1e7c443824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity_namespaces_namespace_entity" DROP CONSTRAINT "FK_1c81d90868815d3b07de3784caa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "record_entity" DROP CONSTRAINT "FK_9eeb15fd9a9994d3e1326b2439f"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_adfe2964821da81ba1e7c44382"`);
    await queryRunner.query(`DROP INDEX "IDX_1c81d90868815d3b07de3784ca"`);
    await queryRunner.query(
      `DROP TABLE "user_entity_namespaces_namespace_entity"`,
    );
    await queryRunner.query(`DROP TABLE "namespace_entity"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "record_entity"`);
  }
}
