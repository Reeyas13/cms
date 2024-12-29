-- CreateTable
CREATE TABLE `Equipment` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `department` ENUM('Machining', 'Assembly', 'Packaging', 'Shipping') NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `serialNumber` VARCHAR(191) NOT NULL,
    `installDate` DATETIME(3) NOT NULL,
    `status` ENUM('Operational', 'Down', 'Maintenance', 'Retired') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintenanceRecord` (
    `id` VARCHAR(191) NOT NULL,
    `equipmentId` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `type` ENUM('Preventive', 'Repair', 'Emergency') NOT NULL,
    `technician` VARCHAR(191) NOT NULL,
    `hoursSpent` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High') NOT NULL,
    `completionStatus` ENUM('Complete', 'Incomplete', 'PendingParts') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PartsReplaced` (
    `id` VARCHAR(191) NOT NULL,
    `maintenanceId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaintenanceRecord` ADD CONSTRAINT `MaintenanceRecord_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `Equipment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PartsReplaced` ADD CONSTRAINT `PartsReplaced_maintenanceId_fkey` FOREIGN KEY (`maintenanceId`) REFERENCES `MaintenanceRecord`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
