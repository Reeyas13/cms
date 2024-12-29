import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import { Department, Status } from "@prisma/client";

interface Params {
  id: string;
}
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const equipment = await prisma.equipment.findUnique({ where: { id: id } });
    if (!equipment) {
      return NextResponse.json({
        message: "Equipment not found",
        success: false,
        data: null,
      });
    }
    return NextResponse.json({ message: null, success: true, data: equipment });
  } catch (error) {
    return NextResponse.json({ message: error, success: false, data: null });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const equipment = await prisma.equipment.delete({ where: { id: id } });
    return NextResponse.json({
      message: "Equipment deleted successfully",
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: error, success: false, data: null });
  }
}


interface Params {
  id: string;
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  try {

    const { id } = await params;
    const data = await req.formData();
    const name = data.get("name")?.toString();
    const location = data.get("location")?.toString();
    const department = data.get("department")?.toString(); 
    const model = data.get("model")?.toString();
    const serialNumber = data.get("serialNumber")?.toString();
    const installDateStr = data.get("installDate")?.toString(); 
    const installDate = installDateStr ? new Date(installDateStr) : null;
    const status = data.get("status")?.toString(); 

    if (
      !name ||
      !location ||
      !department ||
      !model ||
      !serialNumber ||
      !installDate ||
      !status
    ) {
      return NextResponse.json(
        { message: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    const updatedEquipment = await prisma.equipment.update({
      where: { id: id },
      data: {
        name,
        location,
        department: department as Department, 
        model,
        serialNumber,
        installDate,
        status: status as Status, 
      },
    });

    return NextResponse.json({
      message: "Equipment updated successfully",
      success: true,
      data: updatedEquipment,
    });
  } catch (error) {
    return NextResponse.json({ message: error, success: false, data: null });
  }
}
