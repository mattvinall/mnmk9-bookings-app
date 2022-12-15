/*
  Warnings:

  - You are about to drop the column `user_id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `service_name` on the `Services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serviceName]` on the table `Services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Customer_email_user_id_idx` ON `Customer`;

-- DropIndex
DROP INDEX `Services_service_name_idx` ON `Services`;

-- DropIndex
DROP INDEX `Services_service_name_key` ON `Services`;

-- AlterTable
ALTER TABLE `Bookings` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `user_id`,
    ADD COLUMN `customerId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Pet` MODIFY `breed` VARCHAR(191) NULL,
    MODIFY `vaccinated` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Services` DROP COLUMN `service_name`,
    ADD COLUMN `serviceName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Bookings_customerId_serviceId_petId_idx` ON `Bookings`(`customerId`, `serviceId`, `petId`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_customerId_key` ON `Customer`(`customerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_email_key` ON `Customer`(`email`);

-- CreateIndex
CREATE INDEX `Customer_email_customerId_idx` ON `Customer`(`email`, `customerId`);

-- CreateIndex
CREATE UNIQUE INDEX `Services_serviceName_key` ON `Services`(`serviceName`);

-- CreateIndex
CREATE INDEX `Services_serviceName_idx` ON `Services`(`serviceName`);
