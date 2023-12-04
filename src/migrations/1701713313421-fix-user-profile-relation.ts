import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixUserProfileRelation1701713313421 implements MigrationInterface {
  name = 'FixUserProfileRelation1701713313421'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "profileId" character varying`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_9466682df91534dd95e4dbaa616" UNIQUE ("profileId")`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_9466682df91534dd95e4dbaa616"`
    )
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileId"`)
  }
}
