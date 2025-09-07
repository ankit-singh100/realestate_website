CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "public"."PropertyStatus" AS ENUM ('Available', 'Sold', 'Pending');

-- CreateEnum
CREATE TYPE "public"."PropertyType" AS ENUM ('House', 'Apartment', 'Land');

-- CreateTable
CREATE TABLE "public"."properties" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "coordinates" geometry(point, 4326),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "public"."PropertyStatus" NOT NULL,
    "type" "public"."PropertyType" NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_ownerId_key" ON "public"."properties"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "public"."properties"
    ADD COLUMN IF NOT EXISTS "coordinates" geometry(point, 4326);

CREATE INDEX IF NOT EXISTS "properties_coordinates_idx" ON "properties" USING GIST ("coordinates");
