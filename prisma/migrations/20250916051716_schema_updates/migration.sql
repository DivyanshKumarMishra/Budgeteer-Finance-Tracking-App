-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_accountId_fkey";

-- DropForeignKey
ALTER TABLE "public"."transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- AlterTable
ALTER TABLE "public"."transactions" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "isRecurring" SET DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 'COMPLETED';

-- CreateIndex
CREATE INDEX "budgets_userId_idx" ON "public"."budgets"("userId");

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
