-- CreateEnum
CREATE TYPE "Department" AS ENUM ('Machining', 'Assembly', 'Packaging', 'Shipping');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Operational', 'Down', 'Maintenance', 'Retired');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('Preventive', 'Repair', 'Emergency');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "CompletionStatus" AS ENUM ('Complete', 'Incomplete', 'PendingParts');

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "department" "Department" NOT NULL,
    "model" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "installDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "MaintenanceType" NOT NULL,
    "technician" TEXT NOT NULL,
    "hoursSpent" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "completionStatus" "CompletionStatus" NOT NULL,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartsReplaced" (
    "id" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PartsReplaced_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartsReplaced" ADD CONSTRAINT "PartsReplaced_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "MaintenanceRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
