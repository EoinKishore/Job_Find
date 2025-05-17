import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialTable1744289138628 implements MigrationInterface {
    name = 'InitialTable1744289138628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobapplied" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "jobpost_id" uuid, "user_id" uuid, "organization_id" uuid, CONSTRAINT "PK_860673fe3da7155d31562b2aec8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "jobposts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "job_title" character varying NOT NULL, "category" character varying NOT NULL, "openings" character varying(10) NOT NULL, "experience" character varying(100) NOT NULL, "description" text NOT NULL, "package" character varying(100) NOT NULL, "language" character varying NOT NULL, "skills" text NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "organization_id" uuid, CONSTRAINT "PK_52ee57a40ad564dc72607fb2d64" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "website" character varying NOT NULL, "description" text, "status" text, "location" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "update_password_state" boolean NOT NULL DEFAULT false, "organization_id" uuid, CONSTRAINT "REL_256856c7ab20081dd27937d43e" UNIQUE ("organization_id"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user', 'organization')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying(10) NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "userdetails" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "age" integer, "experience" text, "skills" text, "resume" text, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "REL_ac732df71a5d3724c9453f21d1" UNIQUE ("user_id"), CONSTRAINT "PK_59e700dc675d54b411943929322" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "jobapplied" ADD CONSTRAINT "FK_e96d5054f052a7cd3e82825cc3f" FOREIGN KEY ("jobpost_id") REFERENCES "jobposts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobapplied" ADD CONSTRAINT "FK_f576e282dc477892db4925bc1d4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobapplied" ADD CONSTRAINT "FK_abdd158928e6b60123d3174ebb1" FOREIGN KEY ("organization_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "jobposts" ADD CONSTRAINT "FK_fd1e558cb77eeec487a7f25eb6e" FOREIGN KEY ("organization_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "FK_256856c7ab20081dd27937d43ed" FOREIGN KEY ("organization_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userdetails" ADD CONSTRAINT "FK_ac732df71a5d3724c9453f21d14" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userdetails" DROP CONSTRAINT "FK_ac732df71a5d3724c9453f21d14"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "FK_256856c7ab20081dd27937d43ed"`);
        await queryRunner.query(`ALTER TABLE "jobposts" DROP CONSTRAINT "FK_fd1e558cb77eeec487a7f25eb6e"`);
        await queryRunner.query(`ALTER TABLE "jobapplied" DROP CONSTRAINT "FK_abdd158928e6b60123d3174ebb1"`);
        await queryRunner.query(`ALTER TABLE "jobapplied" DROP CONSTRAINT "FK_f576e282dc477892db4925bc1d4"`);
        await queryRunner.query(`ALTER TABLE "jobapplied" DROP CONSTRAINT "FK_e96d5054f052a7cd3e82825cc3f"`);
        await queryRunner.query(`DROP TABLE "userdetails"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "organizations"`);
        await queryRunner.query(`DROP TABLE "jobposts"`);
        await queryRunner.query(`DROP TABLE "jobapplied"`);
    }

}
