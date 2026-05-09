/*
  Warnings:

  - The values [NUMERAL,INTERROGACION] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Category_new" AS ENUM ('SUSTANTIVO', 'VERBO', 'VERBO_REFLEXIVO', 'VERBO_TRANSITIVO', 'VERBO_INTRANSITIVO', 'VERBO_RECIPROCO', 'ADJETIVO', 'ADVERBIO', 'PRONOMBRE', 'PREPOSICION', 'CONJUNCION', 'INTERJECCION', 'ONOMATOPEYA', 'EXPRESION', 'PARTICULA');
ALTER TABLE "Word" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TABLE "Suggestion" ALTER COLUMN "category" TYPE "Category_new" USING ("category"::text::"Category_new");
ALTER TYPE "Category" RENAME TO "Category_old";
ALTER TYPE "Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;
