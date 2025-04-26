-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Email', 'Google');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'Google';
