import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { CompletionStatus, MaintenanceType, Priority } from "@prisma/client";
interface Params {
  id: string;
}
export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const maintenanceRecord = await prisma.maintenanceRecord.findUnique({
      where: { id: id },
      include: {
        PartsReplaced: true,
        Equipment: true,
      }
    });

    if (!maintenanceRecord) {
      return NextResponse.json({
        message: "Maintenance record not found",
        success: false,
        data: null,
      });
    }
    const { PartsReplaced, ...rest } = maintenanceRecord;
    const transformedData = {
      ...rest,
      partsReplaced: PartsReplaced
    };

    return NextResponse.json({
      message: null,
      success: true,
      data: transformedData,
    });
  } catch (error) {
    console.error("Error updating maintenance record:", error);

    return NextResponse.json({ message: "error", success: false, data: null });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const maintenanceRecord = await prisma.maintenanceRecord.delete({
      where: { id: id },
    });
    return NextResponse.json({
      message: "Maintenance record deleted successfully",
      success: true,
      data: maintenanceRecord,
    });
  } catch (error) {
    console.error("Error updating maintenance record:", error);

    return NextResponse.json({ message: "error", success: false, data: null });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const data = await req.formData();
    const equipmentId = data.get("equipmentId");
    const date = data.get("date");
    const type = data.get("type");
    const technician = data.get("technician");
    const hoursSpent = data.get("hoursSpent");
    const description = data.get("description");
    const priority = data.get("priority");
    const completionStatus = data.get("completionStatus");
    const raw = data.get("partsReplaced");
    const partsReplaced = raw ? JSON.parse(raw as string) : [];
    if (
      !equipmentId ||
      !date ||
      !type ||
      !technician ||
      !hoursSpent ||
      !description ||
      !priority ||
      !completionStatus
    ) {
      console.log("all fields are required");
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    if (!Object.values(MaintenanceType).includes(type as MaintenanceType)) {
      console.log("Maintenance type is invalid");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid type value",
        },
        { status: 400 }
      );
    }

    if (!Object.values(Priority).includes(priority as Priority)) {
      console.log("Priority type is invalid");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid priority value",
        },
        { status: 400 }
      );
    }

    if (
      !Object.values(CompletionStatus).includes(
        completionStatus as CompletionStatus
      )
    ) {
      console.log("completion type is invalid");
      return NextResponse.json(
        {
          success: false,
          message: "Invalid completion status value",
        },
        { status: 400 }
      );
    }
    await prisma.partsReplaced.deleteMany({
      where: {
        maintenanceId: id
      }
    });
    const maintenanceRecord = await prisma.maintenanceRecord.update({
      where: { id: id },
      data: {
        equipmentId: equipmentId.toString(),
        date: new Date(date.toString()),
        type: type.toString() as MaintenanceType,
        technician: technician.toString(),
        hoursSpent: parseInt(hoursSpent.toString()),
        description: description.toString(),
        priority: priority.toString() as Priority,
        completionStatus: completionStatus.toString() as CompletionStatus,
        PartsReplaced: {
          create: partsReplaced.map((part: { name: string }) => ({
            name: part.name,
          })),
        },
      },
      include: {
        PartsReplaced: true,
      },
    });

    return NextResponse.json({
      message: "Maintenance record updated successfully",
      success: true,
      data: maintenanceRecord,
    });
  } catch (error) {
    console.error("Error updating maintenance record:", error);
    return NextResponse.json({ 
      message: error instanceof Error ? error.message : "Error updating maintenance record", 
      success: false, 
      data: null 
    });
  }
}