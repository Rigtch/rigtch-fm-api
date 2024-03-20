import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUniqueToExternalIdColumn1710779912388
  implements MigrationInterface
{
  name = 'AddUniqueToExternalIdColumn1710779912388'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "UQ_2315a3e4d182a2a460f2e773693" UNIQUE ("externalId")`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "UQ_941b1071e844e94caec980a929c" UNIQUE ("externalId")`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "UQ_d9c245cc24c616be9b5d72900f5" UNIQUE ("externalId")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "UQ_d9c245cc24c616be9b5d72900f5"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "UQ_941b1071e844e94caec980a929c"`
    )
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "UQ_2315a3e4d182a2a460f2e773693"`
    )
  }
}
