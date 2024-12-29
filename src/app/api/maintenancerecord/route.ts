import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { CompletionStatus, MaintenanceType, Priority } from "@prisma/client";


export async function GET() {
    try {
        const maintenanceRecords = await prisma.maintenanceRecord.findMany({
            include: {
                Equipment:{
                    select:{
                        name: true,
                        model: true,
                        serialNumber: true,
                        status: true,
                    }
                },
            },
        });
        return NextResponse.json({ data: maintenanceRecords });
    } catch (error) {
        console.error("Error fetching maintenance records:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching maintenance records",
            },
            { status: 500 }
        );
    }
 
}
export async function POST(req: Request) {
  const data = await req.formData();
  try {
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

    console.log({
      equipmentId,
      date,
      type,
      technician,
      hoursSpent,
      description,
      priority,
      completionStatus,
      partsReplaced,
    });
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
    if (!partsReplaced) {
    await prisma.maintenanceRecord.create({
        data: {
          equipmentId: equipmentId.toString(),
          date: new Date(date.toString()),
          type: type.toString() as MaintenanceType,
          technician: technician.toString(),
          hoursSpent: parseInt(hoursSpent.toString()),
          description: description.toString(),
          priority: priority.toString() as Priority,
          completionStatus: completionStatus.toString() as CompletionStatus,
        },
      });
    }else {
         await prisma.maintenanceRecord.create({
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
              create: partsReplaced.map((part: any) => ({
                name: part.name,
              })),
            },
          },
        });
    }

    return NextResponse.json({
      success: true,
      data:null,
      message: "Maintenance record added successfully",
    });
  } catch (_e) {
    console.log({ _e });
    return NextResponse.json({
      success: false,
      message: "Error adding maintenance record",
    });
  }
}
