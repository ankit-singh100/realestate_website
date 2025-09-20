-- CreateEnum
CREATE TYPE "public"."paymentStatus" AS ENUM ('Pending', 'Completed', 'Failed', 'Refunded');

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "khaltiToken" TEXT NOT NULL,
    "status" "public"."paymentStatus" NOT NULL DEFAULT 'Pending',
    "method" "public"."paymentMethod" NOT NULL DEFAULT 'KHALTI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
