/*
  Warnings:

  - You are about to drop the `_interestedUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_interestedUsers" DROP CONSTRAINT "_interestedUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_interestedUsers" DROP CONSTRAINT "_interestedUsers_B_fkey";

-- DropTable
DROP TABLE "public"."_interestedUsers";

-- CreateTable
CREATE TABLE "public"."Interest" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_userId_propertyId_key" ON "public"."Interest"("userId", "propertyId");

-- AddForeignKey
ALTER TABLE "public"."Interest" ADD CONSTRAINT "Interest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interest" ADD CONSTRAINT "Interest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
