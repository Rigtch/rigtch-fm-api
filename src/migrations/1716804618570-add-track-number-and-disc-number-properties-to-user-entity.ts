import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570
  implements MigrationInterface
{
  name = 'AddTrackNumberAndDiscNumberPropertiesToUserEntity1716804618570'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP COLUMN "historyId"`
    )
    await queryRunner.query(`ALTER TABLE "track" ADD "trackNumber" integer`)
    await queryRunner.query(`ALTER TABLE "track" ADD "discNumber" integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "discNumber"`)
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "trackNumber"`)
    await queryRunner.query(`ALTER TABLE "history_track" ADD "historyId" uuid`)
  }
}
