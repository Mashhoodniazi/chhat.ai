-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BUSINESS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';
