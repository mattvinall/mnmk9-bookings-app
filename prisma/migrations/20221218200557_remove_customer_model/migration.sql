/*
  Warnings:

  - You are about to drop the column `customerId` on the `Bookings` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Bookings_customerId_serviceId_petId_idx` ON `Bookings`;

-- DropIndex
DROP INDEX `User_email_idx` ON `User`;

-- AlterTable
ALTER TABLE `Bookings` DROP COLUMN `customerId`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `postalCode` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Customer`;

-- CreateIndex
CREATE INDEX `Bookings_userId_serviceId_petId_idx` ON `Bookings`(`userId`, `serviceId`, `petId`);

-- CreateIndex
CREATE INDEX `User_email_id_phoneNumber_idx` ON `User`(`email`, `id`, `phoneNumber`);
