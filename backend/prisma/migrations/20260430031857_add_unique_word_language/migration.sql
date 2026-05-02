/*
  Warnings:

  - A unique constraint covering the columns `[term,language]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Word_term_language_key" ON "Word"("term", "language");
