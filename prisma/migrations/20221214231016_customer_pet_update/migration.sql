/*
  Warnings:

  - You are about to drop the column `vaccineated` on the `Pet` table. All the data in the column will be lost.
  - Added the required column `email` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `breed` to the `Pet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Customer` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    MODIFY `phoneNumber` INTEGER NULL;

-- AlterTable
ALTER TABLE `Pet` DROP COLUMN `vaccineated`,
    ADD COLUMN `breed` VARCHAR(191) NOT NULL,
    ADD COLUMN `vaccinated` BOOLEAN NOT NULL DEFAULT false;
