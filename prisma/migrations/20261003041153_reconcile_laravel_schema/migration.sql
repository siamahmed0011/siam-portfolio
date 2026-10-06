/*
  Warnings:

  - You are about to drop the column `live_url` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "certificate_url" TEXT,
ADD COLUMN     "issuer" TEXT;

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "live_url",
ADD COLUMN     "demo_url" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "skills" ALTER COLUMN "category" DROP NOT NULL;
