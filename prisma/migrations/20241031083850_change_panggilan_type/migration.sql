/*
  Warnings:

  - Made the column `assigned` on table `Panggilan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Panggilan" ALTER COLUMN "assigned" SET NOT NULL,
ALTER COLUMN "assigned" SET DATA TYPE TEXT;
