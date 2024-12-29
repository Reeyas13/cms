import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';

export async function GET() {
  try {
    const currentDate = new Date();
    const lastYear = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));

    // Get monthly maintenance records
    const monthlyRecords = await prisma.maintenanceRecord.findMany({
      where: {
        date: {
          gte: lastYear,
        },
      },
      include: {
        Equipment: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Process records by month
    const monthlyStats = monthlyRecords.reduce((acc, record) => {
      const monthYear = record.date.toISOString().slice(0, 7); // Format: YYYY-MM
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          byType: { Preventive: 0, Repair: 0, Emergency: 0 },
          byDepartment: {},
          totalHours: 0,
          emergencyCount: 0,
        };
      }
      
      acc[monthYear].total += 1;
      acc[monthYear].byType[record.type] += 1;
      acc[monthYear].totalHours += record.hoursSpent;
      
      if (record.type === 'Emergency') {
        acc[monthYear].emergencyCount += 1;
      }
      
      const dept = record.Equipment.department;
      acc[monthYear].byDepartment[dept] = (acc[monthYear].byDepartment[dept] || 0) + 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and sort by date
    const monthlyData = Object.entries(monthlyStats).map(([month, stats]) => ({
      month,
      ...stats,
    })).sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    console.error('Monthly analytics error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching monthly analytics data',
      },
      { status: 500 }
    );
  }
}