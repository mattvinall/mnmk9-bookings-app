/*
  Warnings:

  - You are about to drop the column `userId` on the `Customer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Customer_email_idx` ON `Customer`;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `userId`,
    ADD COLUMN `user_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Customer_email_user_id_idx` ON `Customer`(`email`, `user_id`);
