import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddTypeToItemsEntities1717683299641 implements MigrationInterface {
  name = 'AddTypeToItemsEntities1717683299641'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."track_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD "type" "public"."track_type_enum" NOT NULL DEFAULT 'track'`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."artist_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD "type" "public"."artist_type_enum" NOT NULL DEFAULT 'artist'`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."album_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD "type" "public"."album_type_enum" NOT NULL DEFAULT 'album'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."album_type_enum"`)
    await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."artist_type_enum"`)
    await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "type"`)
    await queryRunner.query(`DROP TYPE "public"."track_type_enum"`)
  }
}
