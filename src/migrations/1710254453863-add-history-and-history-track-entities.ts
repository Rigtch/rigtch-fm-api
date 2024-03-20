import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddHistoryAndHistoryTrackEntities1710254453863
  implements MigrationInterface
{
  name = 'AddHistoryAndHistoryTrackEntities1710254453863'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "REL_7d339708f0fa8446e3c4128dea" UNIQUE ("userId"), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "history_track" ADD "trackId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_2f815192765bba2c408846f0f1f" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_2f815192765bba2c408846f0f1f"`
    )
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9"`
    )
    await queryRunner.query(`ALTER TABLE "history_track" DROP COLUMN "trackId"`)
    await queryRunner.query(`DROP TABLE "history"`)
  }
}
