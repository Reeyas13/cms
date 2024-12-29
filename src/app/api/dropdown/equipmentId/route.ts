import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: equipments, // Changed to 'data' for consistency with POST response
        message: "Equipment fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Equipment fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching equipment",
      },
      { status: 500 }
    );
  }
}
