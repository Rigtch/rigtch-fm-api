import { MigrationInterface, QueryRunner } from 'typeorm'

export class MakeDiscNumberAndTrackNumberPropertiesRequiredInUserEntity1716814787203
  implements MigrationInterface
{
  name =
    'MakeDiscNumberAndTrackNumberPropertiesRequiredInUserEntity1716814787203'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "trackNumber" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "discNumber" SET NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "discNumber" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ALTER COLUMN "trackNumber" DROP NOT NULL`
    )
  }
}
