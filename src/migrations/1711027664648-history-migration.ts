import { MigrationInterface, QueryRunner } from 'typeorm'

export class HistoryMigration1711027664648 implements MigrationInterface {
  name = 'HistoryMigration1711027664648'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "history_track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "trackId" uuid, "userId" uuid, "historyId" uuid, CONSTRAINT "PK_a1f5d0df224a9449c488f25ba58" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "href" character varying NOT NULL, "duration" integer NOT NULL, "albumId" uuid, CONSTRAINT "UQ_2315a3e4d182a2a460f2e773693" UNIQUE ("externalId"), CONSTRAINT "UQ_10a3b0c40212c31ba55419523a4" UNIQUE ("href"), CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "releaseDate" TIMESTAMP WITH TIME ZONE NOT NULL, "albumType" character varying NOT NULL, "totalTracks" integer NOT NULL, "href" character varying NOT NULL, CONSTRAINT "UQ_d9c245cc24c616be9b5d72900f5" UNIQUE ("externalId"), CONSTRAINT "UQ_195b9a4b8052042a431847461ab" UNIQUE ("href"), CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "externalId" character varying NOT NULL, "name" character varying NOT NULL, "href" character varying NOT NULL, "genres" text NOT NULL, "popularity" integer NOT NULL, "followers" integer NOT NULL, CONSTRAINT "UQ_941b1071e844e94caec980a929c" UNIQUE ("externalId"), CONSTRAINT "UQ_3df7b480e9f4bc6eecca12a31a0" UNIQUE ("href"), CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, CONSTRAINT "REL_7d339708f0fa8446e3c4128dea" UNIQUE ("userId"), CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`
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
      `CREATE TABLE "artist_images_image" ("artistId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_4c6d1d1c42a5666eead29ff0cfb" PRIMARY KEY ("artistId", "imageId"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7ab74f206e4da65404577799c5" ON "artist_images_image" ("artistId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ca39d0d868db51343cb2a17574" ON "artist_images_image" ("imageId") `
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "UQ_602959dc3010ff4b4805ee7f104" UNIQUE ("url")`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_2f815192765bba2c408846f0f1f" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_e8acc7b8c52fbd7859826a22b01" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" ADD CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac" FOREIGN KEY ("historyId") REFERENCES "history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" ADD CONSTRAINT "FK_75fa7b073fb2f85c6b5680cbe7c" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" ADD CONSTRAINT "FK_39c8f9e25b42e14b3195140722a" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
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
      `ALTER TABLE "artist_images_image" ADD CONSTRAINT "FK_7ab74f206e4da65404577799c53" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" ADD CONSTRAINT "FK_ca39d0d868db51343cb2a175745" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" DROP CONSTRAINT "FK_ca39d0d868db51343cb2a175745"`
    )
    await queryRunner.query(
      `ALTER TABLE "artist_images_image" DROP CONSTRAINT "FK_7ab74f206e4da65404577799c53"`
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
      `ALTER TABLE "track_artists_artist" DROP CONSTRAINT "FK_39c8f9e25b42e14b3195140722a"`
    )
    await queryRunner.query(
      `ALTER TABLE "track_artists_artist" DROP CONSTRAINT "FK_75fa7b073fb2f85c6b5680cbe7c"`
    )
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_7d339708f0fa8446e3c4128dea9"`
    )
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_ce6dacde6c6f16eeb50189611ac"`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_e8acc7b8c52fbd7859826a22b01"`
    )
    await queryRunner.query(
      `ALTER TABLE "history_track" DROP CONSTRAINT "FK_2f815192765bba2c408846f0f1f"`
    )
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "UQ_602959dc3010ff4b4805ee7f104"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca39d0d868db51343cb2a17574"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ab74f206e4da65404577799c5"`
    )
    await queryRunner.query(`DROP TABLE "artist_images_image"`)
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
      `DROP INDEX "public"."IDX_39c8f9e25b42e14b3195140722"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_75fa7b073fb2f85c6b5680cbe7"`
    )
    await queryRunner.query(`DROP TABLE "track_artists_artist"`)
    await queryRunner.query(`DROP TABLE "history"`)
    await queryRunner.query(`DROP TABLE "artist"`)
    await queryRunner.query(`DROP TABLE "album"`)
    await queryRunner.query(`DROP TABLE "track"`)
    await queryRunner.query(`DROP TABLE "history_track"`)
  }
}
