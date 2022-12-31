/*
  Warnings:

  - You are about to drop the column `address` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Bookings` table. All the data in the column will be lost.
  - Added the required column `checkInDate` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petName` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bookings` DROP COLUMN `address`,
    DROP COLUMN `endDate`,
    DROP COLUMN `scheduledDate`,
    ADD COLUMN `checkInDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `checkOutDate` VARCHAR(191) NULL,
    ADD COLUMN `endTime` VARCHAR(191) NULL,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    ADD COLUMN `petName` VARCHAR(191) NOT NULL,
    ADD COLUMN `serviceName` VARCHAR(191) NOT NULL,
    ADD COLUMN `startTime` VARCHAR(191) NULL,
    MODIFY `notes` VARCHAR(191) NULL;
