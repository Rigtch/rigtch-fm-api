import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddExplicitColumnToTrackEntity1717684160130
  implements MigrationInterface
{
  name = 'AddExplicitColumnToTrackEntity1717684160130'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track" ADD "explicit" boolean`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "explicit"`)
  }
}
