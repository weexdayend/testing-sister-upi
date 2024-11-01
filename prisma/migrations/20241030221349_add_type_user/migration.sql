-- CreateEnum
CREATE TYPE "StatusLayanan" AS ENUM ('Open', 'Progress', 'Closed');

-- CreateEnum
CREATE TYPE "TypeUser" AS ENUM ('Umum', 'Verifikasi');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "statusUser" BOOLEAN NOT NULL,
    "type" "TypeUser" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Antrian" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nomorAntrian" TEXT NOT NULL,
    "layanan" TEXT NOT NULL,
    "kategoriLayanan" TEXT NOT NULL,
    "assigned" UUID,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT,
    "statusAntrian" "StatusLayanan" NOT NULL,

    CONSTRAINT "Antrian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "linkVideo" TEXT NOT NULL,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);
