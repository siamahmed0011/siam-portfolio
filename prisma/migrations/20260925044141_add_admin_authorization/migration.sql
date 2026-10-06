-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "impersonated_by" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ban_expires" TIMESTAMP(3),
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "role" TEXT DEFAULT 'user';

-- CreateTable
CREATE TABLE "rate_limits" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "last_request" BIGINT NOT NULL,

    CONSTRAINT "rate_limits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rate_limits_key_key" ON "rate_limits"("key");
