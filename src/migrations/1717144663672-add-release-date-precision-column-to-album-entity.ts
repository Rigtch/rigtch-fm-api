import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddReleaseDatePrecisionColumnToAlbumEntity1717144663672
  implements MigrationInterface
{
  name = 'AddReleaseDatePrecisionColumnToAlbumEntity1717144663672'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."album_releasedateprecision_enum" AS ENUM('year', 'month', 'day')`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD "releaseDatePrecision" "public"."album_releasedateprecision_enum" DEFAULT 'day'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP COLUMN "releaseDatePrecision"`
    )
    await queryRunner.query(
      `DROP TYPE "public"."album_releasedateprecision_enum"`
    )
  }
}
