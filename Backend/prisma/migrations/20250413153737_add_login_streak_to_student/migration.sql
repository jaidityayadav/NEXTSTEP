-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "lastLoginDate" TIMESTAMP(3),
ADD COLUMN     "streakCount" INTEGER NOT NULL DEFAULT 0;
