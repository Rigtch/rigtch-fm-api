import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFollowersAndFollowingCountToUser1727277320574
  implements MigrationInterface
{
  name = 'AddFollowersAndFollowingCountToUser1727277320574'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "followersCount" integer NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD "followingCount" integer NOT NULL DEFAULT '0'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "followingCount"`)
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "followersCount"`)
  }
}
