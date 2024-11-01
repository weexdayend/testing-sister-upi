/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Panggilan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nomorAntrian" TEXT NOT NULL,
    "assigned" UUID,
    "statusPanggilan" BOOLEAN NOT NULL,

    CONSTRAINT "Panggilan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
