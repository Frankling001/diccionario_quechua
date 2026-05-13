/*
  Warnings:

  - The `quechua` column on the `Suggestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `quechua` column on the `Word` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Word_category_idx";

-- DropIndex
DROP INDEX "Word_quechua_key";

-- AlterTable
ALTER TABLE "Suggestion" DROP COLUMN "quechua",
ADD COLUMN     "quechua" TEXT[];

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "quechua",
ADD COLUMN     "quechua" TEXT[];

-- CreateIndex
CREATE INDEX "Word_quechua_idx" ON "Word"("quechua");

-- CreateIndex
CREATE INDEX "Word_spanish_idx" ON "Word"("spanish");
