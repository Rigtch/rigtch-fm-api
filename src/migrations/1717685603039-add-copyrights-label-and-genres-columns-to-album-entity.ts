import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCopyrightsLabelAndGenresColumnsToAlbumEntity1717685603039
  implements MigrationInterface
{
  name = 'AddCopyrightsLabelAndGenresColumnsToAlbumEntity1717685603039'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album" ADD "copyrights" text`)
    await queryRunner.query(`ALTER TABLE "album" ADD "genres" text`)
    await queryRunner.query(`ALTER TABLE "album" ADD "label" character varying`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "label"`)
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "genres"`)
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "copyrights"`)
  }
}
