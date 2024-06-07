import { MigrationInterface, QueryRunner } from 'typeorm'

export class EnableCache1717744803994 implements MigrationInterface {
  name = 'EnableCache1717744803994'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "type" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ALTER COLUMN "type" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "type" SET NOT NULL`
    )
    await queryRunner.query(
      `CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "query-result-cache"`)
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "type" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ALTER COLUMN "type" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "type" DROP NOT NULL`
    )
  }
}
