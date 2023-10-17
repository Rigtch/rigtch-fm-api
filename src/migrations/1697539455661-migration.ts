import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1697539455661 implements MigrationInterface {
  name = 'Migration1697539455661'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "height" integer NOT NULL, "width" integer NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" character varying NOT NULL, "displayName" character varying NOT NULL, "followers" integer NOT NULL, "country" character varying, "email" character varying, "href" character varying NOT NULL, "product" character varying, "type" character varying NOT NULL, "uri" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
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
      `ALTER TABLE "profile_images_image" ADD CONSTRAINT "FK_8520f204d1054799bbcb21023dd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" ADD CONSTRAINT "FK_baf570df58dbd868515e33fc252" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" DROP CONSTRAINT "FK_baf570df58dbd868515e33fc252"`
    )
    await queryRunner.query(
      `ALTER TABLE "profile_images_image" DROP CONSTRAINT "FK_8520f204d1054799bbcb21023dd"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_baf570df58dbd868515e33fc25"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8520f204d1054799bbcb21023d"`
    )
    await queryRunner.query(`DROP TABLE "profile_images_image"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "profile"`)
    await queryRunner.query(`DROP TABLE "image"`)
  }
}
