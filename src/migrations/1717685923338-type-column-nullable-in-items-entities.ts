import { MigrationInterface, QueryRunner } from 'typeorm'

export class TypeColumnNullableInItemsEntities1717685923338
  implements MigrationInterface
{
  name = 'TypeColumnNullableInItemsEntities1717685923338'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."track_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD "type" "public"."track_type_enum" DEFAULT 'track'`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."artist_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "artist" ADD "type" "public"."artist_type_enum" DEFAULT 'artist'`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."album_type_enum" AS ENUM('album', 'artist', 'track')`
    )
    await queryRunner.query(
      `ALTER TABLE "album" ADD "type" "public"."album_type_enum" DEFAULT 'album'`
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
