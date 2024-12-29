import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';

// Define the structure of monthly statistics
interface MonthlyStats {
  total: number;
  byType: { Preventive: number; Repair: number; Emergency: number };
  byDepartment: Record<string, number>;
  totalHours: number;
  emergencyCount: number;
}

export async function GET() {
  try {
    const currentDate = new Date();
    const lastYear = new Date(currentDate);
    lastYear.setFullYear(lastYear.getFullYear() - 1); // Calculate one year back

    // Fetch all maintenance records within the past year
    const maintenanceRecords = await prisma.maintenanceRecord.findMany({
      where: {
        date: {
          gte: lastYear,
        },
      },
      include: {
        Equipment: true, // Include related equipment data
      },
      orderBy: {
        date: 'asc', // Sort by ascending date
      },
    });

    // Process data into monthly statistics
    const monthlyStats = maintenanceRecords.reduce<Record<string, MonthlyStats>>(
      (acc, record) => {
        const monthYear = record.date.toISOString().slice(0, 7); // Extract YYYY-MM format

        // Initialize data structure for a new month
        if (!acc[monthYear]) {
          acc[monthYear] = {
            total: 0,
            byType: { Preventive: 0, Repair: 0, Emergency: 0 },
            byDepartment: {},
            totalHours: 0,
            emergencyCount: 0,
          };
        }

        // Increment totals and categorize by type
        acc[monthYear].total += 1;
        acc[monthYear].byType[record.type] += 1;
        acc[monthYear].totalHours += record.hoursSpent;

        // Count emergencies separately
        if (record.type === 'Emergency') {
          acc[monthYear].emergencyCount += 1;
        }

        // Track maintenance by department
        const department = record.Equipment.department;
        acc[monthYear].byDepartment[department] = 
          (acc[monthYear].byDepartment[department] || 0) + 1;

        return acc;
      },
      {} // Initialize with an empty object
    );

    // Transform and sort results
    const monthlyData = Object.entries(monthlyStats)
      .map(([month, stats]) => ({
        month,
        ...stats,
      }))
      .sort((a, b) => a.month.localeCompare(b.month)); // Sort by month

    // Return processed data
    return NextResponse.json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching maintenance analytics:', error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching maintenance analytics data',
      },
      { status: 500 }
    );
  }
}
