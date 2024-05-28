# Migrations Guideline

## Introduction

Each change in entities should be accompanied by a new migration.
**DO NOT REMOVE PREVIOUS MIGRATIONS**

Each migration should have a name that describes the changes in the migration.
For example, if you are adding a new column like `roles` to the `User` entity,
the migration name should be `add-roles-column-to-user-entity`.

Before merging new changes to `main` branch you should ensure that your migration
works properly with development database! You can do it by running migration on
development database.
**Do not run new migrations on production database.**

## Generating a new migration

Ensure that you have built your application before generating a new migration.

```bash
NAME=<migration-name> nr migration:generate
```

## Creating a new migration manually

Just paste raw SQL queries in the `queryRunner.query` method.

```bash
NAME=<migration-name> nr migration:create
```

## Reverting migration

For reverting an existing migration you can just create new migration,
copy migration file that you want to revert and replace `up` with `down` methods.

Reverting a migration runs the `down` method in the migration file.
This is useful in case we made a schema change we no longer want.

### Source

- [typeorm-migrations-explained](https://betterprogramming.pub/typeorm-migrations-explained-fdb4f27cb1b3)
- [github/typeorm/docs/migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md)
