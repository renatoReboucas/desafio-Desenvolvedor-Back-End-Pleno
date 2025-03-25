/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ra]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Student` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "ra" DROP DEFAULT,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Student_ra_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Student_ra_key" ON "Student"("ra");
