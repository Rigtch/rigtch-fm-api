import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddArtistAlbumAndTrackEntities1708427625390
  implements MigrationInterface
{
  name = 'AddArtistAlbumAndTrackEntities1708427625390'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "height" integer NOT NULL, "width" integer NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_602959dc3010ff4b4805ee7f104" UNIQUE ("url"), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "href" character varying NOT NULL, "genres" text NOT NULL, "popularity" integer NOT NULL, "followers" integer NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "releaseDate" TIMESTAMP WITH TIME ZONE NOT NULL, "totalTracks" integer NOT NULL, "href" character varying NOT NULL, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "listening_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "REL_457cb9f7a9aa5b0f99547da7d3" UNIQUE ("userId"), CONSTRAINT "PK_a6c26e9fbd171c57d0f320300b8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" character varying NOT NULL, "displayName" character varying NOT NULL, "followers" integer NOT NULL, "country" character varying, "email" character varying, "href" character varying NOT NULL, "product" character varying, "type" character varying NOT NULL, "uri" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "href" character varying NOT NULL, "duration" integer NOT NULL, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, "profileId" character varying, CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "artist_images_image" ("artistId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_4c6d1d1c42a5666eead29ff0cfb" PRIMARY KEY ("artistId", "imageId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7ab74f206e4da65404577799c5" ON "artist_images_image" ("artistId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ca39d0d868db51343cb2a17574" ON "artist_images_image" ("imageId") `
    )
    await queryRunner.query(
      `CREATE TABLE "album_images_image" ("albumId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_89b8572915f4a621fea78e98755" PRIMARY KEY ("albumId", "imageId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ccd870a6c09fce33a957ff19f0" ON "album_images_image" ("albumId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e00e473fc47de99ee15e333c79" ON "album_images_image" ("imageId") `
    )
    await queryRunner.query(
      `CREATE TABLE "album_artists_artist" ("albumId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_7ab1f3cfd211e572b529d324662" PRIMARY KEY ("albumId", "artistId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_042267cf16006041192432f831" ON "album_artists_artist" ("albumId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_bce2fa2c71f571a2443d218d1f" ON "album_artists_artist" ("artistId") `
    )
    await queryRunner.query(
      `CREATE TABLE "profile_images_image" ("profileId" character varying NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_b41ff6ac84d6b21bbb4164b913a" PRIMARY KEY ("profileId", "imageId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8520f204d1054799bbcb21023d" ON "profile_images_image" ("profileId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_baf570df58dbd868515e33fc25" ON "profile_images_image" ("imageId") `
    )
    await queryRunner.query(
      `CREATE TABLE "track_artists_artist" ("trackId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_8de812c0fd3bd11d1970847dc7d" PRIMARY KEY ("trackId", "artistId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_75fa7b073fb2f85c6b5680cbe7" ON "track_artists_artist" ("trackId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_39c8f9e25b42e14b3195140722" ON "track_artists_artist" ("artistId") `
    )
    await queryRunner.query(
      `ALTER TABLE "listening_history" ADD CONSTRAINT "FK_457cb9f7a9aa5b0f99547da7d31" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" ADD CONSTRAINT "FK_7ab74f206e4da65404577799c53" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" ADD CONSTRAINT "FK_ca39d0d868db51343cb2a175745" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "album_images_image" ADD CONSTRAINT "FK_ccd870a6c09fce33a957ff19f0d" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "album_images_image" ADD CONSTRAINT "FK_e00e473fc47de99ee15e333c795" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "album_artists_artist" ADD CONSTRAINT "FK_042267cf16006041192432f8316" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "album_artists_artist" ADD CONSTRAINT "FK_bce2fa2c71f571a2443d218d1f3" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" ADD CONSTRAINT "FK_8520f204d1054799bbcb21023dd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" ADD CONSTRAINT "FK_baf570df58dbd868515e33fc252" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" ADD CONSTRAINT "FK_75fa7b073fb2f85c6b5680cbe7c" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" ADD CONSTRAINT "FK_39c8f9e25b42e14b3195140722a" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" DROP CONSTRAINT "FK_39c8f9e25b42e14b3195140722a"`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" DROP CONSTRAINT "FK_75fa7b073fb2f85c6b5680cbe7c"`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" DROP CONSTRAINT "FK_baf570df58dbd868515e33fc252"`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" DROP CONSTRAINT "FK_8520f204d1054799bbcb21023dd"`
    )
    await queryRunner.query(
      `ALTER TABLE "album_artists_artist" DROP CONSTRAINT "FK_bce2fa2c71f571a2443d218d1f3"`
    )
    await queryRunner.query(
      `ALTER TABLE "album_artists_artist" DROP CONSTRAINT "FK_042267cf16006041192432f8316"`
    )
    await queryRunner.query(
      `ALTER TABLE "album_images_image" DROP CONSTRAINT "FK_e00e473fc47de99ee15e333c795"`
    )
    await queryRunner.query(
      `ALTER TABLE "album_images_image" DROP CONSTRAINT "FK_ccd870a6c09fce33a957ff19f0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" DROP CONSTRAINT "FK_ca39d0d868db51343cb2a175745"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" DROP CONSTRAINT "FK_7ab74f206e4da65404577799c53"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`
    )
    await queryRunner.query(
      `ALTER TABLE "listening_history" DROP CONSTRAINT "FK_457cb9f7a9aa5b0f99547da7d31"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_39c8f9e25b42e14b3195140722"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_75fa7b073fb2f85c6b5680cbe7"`
    )
    await queryRunner.query(`DROP TABLE "track_artists_artist"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_baf570df58dbd868515e33fc25"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8520f204d1054799bbcb21023d"`
    )
    await queryRunner.query(`DROP TABLE "profile_images_image"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bce2fa2c71f571a2443d218d1f"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_042267cf16006041192432f831"`
    )
    await queryRunner.query(`DROP TABLE "album_artists_artist"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e00e473fc47de99ee15e333c79"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ccd870a6c09fce33a957ff19f0"`
    )
    await queryRunner.query(`DROP TABLE "album_images_image"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca39d0d868db51343cb2a17574"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ab74f206e4da65404577799c5"`
    )
    await queryRunner.query(`DROP TABLE "artist_images_image"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "track"`)
    await queryRunner.query(`DROP TABLE "profile"`)
    await queryRunner.query(`DROP TABLE "listening_history"`)
    await queryRunner.query(`DROP TABLE "album"`)
    await queryRunner.query(`DROP TABLE "artist"`)
    await queryRunner.query(`DROP TABLE "image"`)
  }
}
