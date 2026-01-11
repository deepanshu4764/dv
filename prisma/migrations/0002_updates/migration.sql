-- AlterEnum
ALTER TYPE "SubscriptionStatus" ADD VALUE IF NOT EXISTS 'PAUSED';

-- AlterTable: User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "dailyEmailOptIn" BOOLEAN NOT NULL DEFAULT TRUE;

-- AlterTable: Insight
ALTER TABLE "Insight" ADD COLUMN IF NOT EXISTS "dayNumber" INTEGER;
ALTER TABLE "Insight" ADD COLUMN IF NOT EXISTS "audioUrl" TEXT;

-- AlterTable: LiveClass
ALTER TABLE "LiveClass" ADD COLUMN IF NOT EXISTS "meetingLink" TEXT;
