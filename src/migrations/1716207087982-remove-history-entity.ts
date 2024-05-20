import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveHistoryEntity1716207087982 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9"`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac"`
    )
    await queryRunner.query(`DROP TABLE "history"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "REL_7d339708f0fa8446e3c4128dea" UNIQUE ("userId"), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
