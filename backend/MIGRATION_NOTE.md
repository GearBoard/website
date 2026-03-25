# Migration Note: User Key Type Change

**Date**: March 2026
**Impact**: Breaking data migration

## Background

The `User` model primary key (and related foreign keys) have been changed from:

```prisma
id BigInt @id @default(autoincrement())
```

to:

```prisma
id String @id @default(cuid())
```

## Production Risk Warning

This is a **breaking migration step** for existing databases. A schema-only PR applying this change will break the application and fail to migrate seamlessly if the database is already populated.

This change is currently **only safe for fresh or development databases** that can be dropped/reset.

If this code needs to be deployed to a production or staging environment with real data, a staged migration and backfill strategy MUST be executed first.

### Required Rollout Plan for Populated DBs:

1. Add the new `cuid` column alongside the old `BigInt` column without making it the primary key.
2. Backfill existing records with generated `cuid`s and configure the application to dual-write.
3. Update all foreign key relations to reference the new column and backfill.
4. Promote the new `cuid` column to be the primary key and delete the old `BigInt` column.

**DO NOT** attempt to automatically apply this schema change to a production database.
