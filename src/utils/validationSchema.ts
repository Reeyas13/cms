import { z } from "zod";

export const equipmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").nonempty("Name is required"),
  location: z.string().nonempty("Location is required"),
  department: z.enum(["Machining", "Assembly", "Packaging", "Shipping"], { description: "Department is required" }),
  model: z.string().nonempty("Model is required"),
  serialNumber: z.string().regex(/^[a-zA-Z0-9]+$/, "Serial number must be alphanumeric").nonempty("Serial Number is required"),
  installDate: z.string().refine(date => new Date(date) < new Date(), {
    message: "Install Date must be in the past",
  }),
  status: z.enum(["Operational", "Down", "Maintenance","Retired"], { description: "Status is required" }),
});

export const MaintenanceType = z.enum(["Preventive", "Repair", "Emergency"]);

export const Priority = z.enum(["Low", "Medium", "High"]);

export const CompletionStatus = z.enum(["PendingParts", "Complete", "Incomplete"]);

export const PartsReplacedSchema = z.object({
  name: z.string().min(1, "Part name is required"),
});

export const MaintenanceRecordSchema = z.object({
  equipmentId: z.string().min(1, "Equipment ID is required"),
  date: z
    .string()
    .transform((val) => new Date(val))
    .refine((val) => val < new Date(), {
      message: "Date must be in the past",
    }),
  type: MaintenanceType,
  technician: z.string().min(3, "Technician name must be at least 3 characters"),
  hoursSpent: z.number().int().positive("Hours spent must be a positive integer"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: Priority,
  completionStatus: CompletionStatus,
  partsReplaced: z.array(PartsReplacedSchema).optional(), 
});