import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTracksRelationColumnToAlbum1708434028149
  implements MigrationInterface
{
  name = 'AddTracksRelationColumnToAlbum1708434028149'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" ADD "albumType" character varying NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "album" ADD "tracksId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_2b7f396d61ec8fa47f2f481c48d" FOREIGN KEY ("tracksId") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_2b7f396d61ec8fa47f2f481c48d"`
    )
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "tracksId"`)
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "albumType"`)
  }
}
