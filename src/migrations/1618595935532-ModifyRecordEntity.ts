import {MigrationInterface, QueryRunner} from "typeorm";

export class ModifyRecordEntity1618595935532 implements MigrationInterface {
    name = 'ModifyRecordEntity1618595935532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "project" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "sprint" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "task" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "summary" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "time_spent" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "record_entity" ADD "date_logged" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "date_logged"`);
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "time_spent"`);
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "summary"`);
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "task"`);
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "sprint"`);
        await queryRunner.query(`ALTER TABLE "record_entity" DROP COLUMN "project"`);
    }

}
