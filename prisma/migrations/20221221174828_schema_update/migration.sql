/*
  Warnings:

  - Added the required column `notes` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduledDate` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `endDate` DATETIME(3) NULL,
    ADD COLUMN `notes` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `scheduledDate` DATETIME(3) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NULL;
