import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeItemsColumnsRequired1717699326064
  implements MigrationInterface
{
  name = 'MakeItemsColumnsRequired1717699326064'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "explicit" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "releaseDatePrecision" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "copyrights" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "genres" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "label" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "label" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "genres" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "copyrights" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ALTER COLUMN "releaseDatePrecision" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "explicit" DROP NOT NULL`
    )
  }
}
