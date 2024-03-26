import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeUniqueConstraintsForEntities1711444943012
  implements MigrationInterface
{
  name = 'ChangeUniqueConstraintsForEntities1711444943012'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "UQ_2315a3e4d182a2a460f2e773693"`
    )
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "UQ_10a3b0c40212c31ba55419523a4"`
    )
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "UQ_d9c245cc24c616be9b5d72900f5"`
    )
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "UQ_195b9a4b8052042a431847461ab"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "UQ_941b1071e844e94caec980a929c"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "UQ_3df7b480e9f4bc6eecca12a31a0"`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "TRACK_UNIQUE" UNIQUE ("externalId", "href")`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "ALBUM_UNIQUE" UNIQUE ("externalId", "href")`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "ARTIST_UNIQUE" UNIQUE ("externalId", "href")`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "artist" DROP CONSTRAINT "ARTIST_UNIQUE"`
    )
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "ALBUM_UNIQUE"`
    )
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "TRACK_UNIQUE"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "UQ_3df7b480e9f4bc6eecca12a31a0" UNIQUE ("href")`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD CONSTRAINT "UQ_941b1071e844e94caec980a929c" UNIQUE ("externalId")`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "UQ_195b9a4b8052042a431847461ab" UNIQUE ("href")`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "UQ_d9c245cc24c616be9b5d72900f5" UNIQUE ("externalId")`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "UQ_10a3b0c40212c31ba55419523a4" UNIQUE ("href")`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "UQ_2315a3e4d182a2a460f2e773693" UNIQUE ("externalId")`
    )
  }
}
