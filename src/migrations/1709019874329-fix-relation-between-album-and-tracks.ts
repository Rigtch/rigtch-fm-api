import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixRelationBetweenAlbumAndTracks1709019874329
  implements MigrationInterface
{
  name = 'FixRelationBetweenAlbumAndTracks1709019874329'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_2b7f396d61ec8fa47f2f481c48d"`
    )
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "tracksId"`)
    await queryRunner.query(`ALTER TABLE "track" ADD "albumId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`
    )
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "albumId"`)
    await queryRunner.query(`ALTER TABLE "album" ADD "tracksId" uuid`)
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_2b7f396d61ec8fa47f2f481c48d" FOREIGN KEY ("tracksId") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
