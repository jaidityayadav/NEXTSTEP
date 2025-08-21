-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_internshipId_fkey";

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_internshipId_fkey" FOREIGN KEY ("internshipId") REFERENCES "Internships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
