-- AlterTable
ALTER TABLE "Tag"
ADD COLUMN "backgroundColor" TEXT,
ADD COLUMN "color" TEXT;

UPDATE "Tag"
SET
  "color" = '#C01300',
  "backgroundColor" = '#C0130020';

ALTER TABLE "Tag"
ALTER COLUMN "backgroundColor" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;
