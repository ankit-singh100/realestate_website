/*
  Warnings:

  - You are about to drop the column `coordinates` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `properties` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."properties" DROP COLUMN "coordinates",
DROP COLUMN "latitude",
DROP COLUMN "longitude";
