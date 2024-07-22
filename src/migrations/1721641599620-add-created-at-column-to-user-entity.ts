import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCreatedAtColumnToUserEntity1721641599620
  implements MigrationInterface
{
  name = 'AddCreatedAtColumnToUserEntity1721641599620'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`)
  }
}
