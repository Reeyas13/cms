import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";
import { Department, Status } from "@prisma/client";

export async function POST(req: Request) {
  const data = await req.formData();
  
  try {
    // Get and validate all required fields
    const name = data.get("name");
    const location = data.get("location");
    const department = data.get("department");
    const model = data.get("model");
    const serialNumber = data.get("serialNumber");
    const installDate = data.get("installDate");
    const status = data.get("status");

    // Validate required fields
    if (!name || !location || !department || !model || !serialNumber || !installDate || !status) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      }, { status: 400 });
    }

    // Validate department enum
    if (!Object.values(Department).includes(department as Department)) {
      console.log("error department");
      return NextResponse.json({
        success: false,
        message: "Invalid department value",
      }, { status: 400 });
    }

    // Validate status enum
    if (!Object.values(Status).includes(status as Status)) {
      console.log("error status");

      return NextResponse.json({
        success: false,
        message: "Invalid status value",
      }, { status: 400 });
    }

    const newEquipment = await prisma.equipment.create({
      data: {
        name: name.toString(),
        location: location.toString(),
        department: department as Department,
        model: model.toString(),
        serialNumber: serialNumber.toString(),
        installDate: new Date(installDate.toString()), 
        status: status as Status,
      },
    });

    return NextResponse.json({
      success: true,
      data: newEquipment,
      message: "Equipment added successfully!",
    }, { status: 201 });

  } catch (error) {
    console.error("Equipment creation error:", error);
    return NextResponse.json({
      success: false,
      message: "Error submitting form",
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({});

    return NextResponse.json({
      success: true,
      data: equipments, // Changed to 'data' for consistency with POST response
      message: "Equipment fetched successfully!",
    }, { status: 200 });

  } catch (error) {
    console.error("Equipment fetch error:", error);
    return NextResponse.json({
      success: false,
      message: "Error fetching equipment",
    }, { status: 500 });
  }
}