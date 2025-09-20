-- CreateTable
CREATE TABLE "public"."_interestedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_interestedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_interestedUsers_B_index" ON "public"."_interestedUsers"("B");

-- AddForeignKey
ALTER TABLE "public"."_interestedUsers" ADD CONSTRAINT "_interestedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_interestedUsers" ADD CONSTRAINT "_interestedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
