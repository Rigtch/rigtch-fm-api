import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserRelationToHistoryTrack1710778342115
  implements MigrationInterface
{
  name = 'AddUserRelationToHistoryTrack1710778342115'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "history_track" ADD "userId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_e8acc7b8c52fbd7859826a22b01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_e8acc7b8c52fbd7859826a22b01"`
    )
    await queryRunner.query(`ALTER TABLE "history_track" DROP COLUMN "userId"`)
  }
}
