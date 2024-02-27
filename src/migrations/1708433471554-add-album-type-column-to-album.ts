import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAlbumTypeColumnToAlbum1708433471554
  implements MigrationInterface
{
  name = 'AddAlbumTypeColumnToAlbum1708433471554'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" ADD "albumType" character varying NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "albumType"`)
  }
}
