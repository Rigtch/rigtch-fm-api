import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddManyToOneRelationToHistoryTrackEntity1710256799002
  implements MigrationInterface
{
  name = 'AddManyToOneRelationToHistoryTrackEntity1710256799002'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "history_track" ADD "historyId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac"`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP COLUMN "historyId"`
    )
  }
}
