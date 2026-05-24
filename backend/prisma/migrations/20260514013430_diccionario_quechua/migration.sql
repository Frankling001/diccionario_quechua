-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SUSTANTIVO', 'VERBO', 'VERBO_REFLEXIVO', 'VERBO_TRANSITIVO', 'VERBO_INTRANSITIVO', 'VERBO_RECIPROCO', 'ADJETIVO', 'ADVERBIO', 'PRONOMBRE', 'PREPOSICION', 'CONJUNCION', 'INTERJECCION', 'ONOMATOPEYA', 'EXPRESION', 'PARTICULA');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "quechua" TEXT[],
    "spanish" TEXT[],
    "description" TEXT,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Example" (
    "id" SERIAL NOT NULL,
    "quechua" TEXT NOT NULL,
    "spanish" TEXT NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "Example_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" SERIAL NOT NULL,
    "quechua" TEXT[],
    "spanish" TEXT[],
    "description" TEXT,
    "category" "Category",
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Word_quechua_idx" ON "Word"("quechua");

-- CreateIndex
CREATE INDEX "Word_spanish_idx" ON "Word"("spanish");

-- AddForeignKey
ALTER TABLE "Example" ADD CONSTRAINT "Example_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
