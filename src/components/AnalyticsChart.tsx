"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

// Define interfaces for the data structure
interface MaintenanceData {
  month: string;
  total: number;
  totalHours: number;
  emergencyCount: number;
  byType: Record<string, number>;
  byDepartment: Record<string, number>;
}

interface ChartData {
  name: string;
  value: number;
}

interface ApiResponse {
  data: MaintenanceData[];
}

const AnalyticsChart: React.FC = () => {
  const [data, setData] = useState<MaintenanceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>('/api/analytics');
        setData(response.data.data[0]); // Getting the first month's data
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!data) return <div className="p-4">No data available</div>;

  // Prepare data for different charts
  const typeData: ChartData[] = Object.entries(data.byType).map(([name, value]) => ({
    name,
    value
  }));

  const departmentData: ChartData[] = Object.entries(data.byDepartment).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Summary Card */}
      <div className="col-span-2 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Maintenance Summary</h2>
          <p className="text-gray-600 mt-1">{data.month}</p>
        </div>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600">Total Maintenance</div>
              <div className="text-2xl font-bold">{data.total}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600">Total Hours</div>
              <div className="text-2xl font-bold">{data.totalHours}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-yellow-600">Emergency Count</div>
              <div className="text-2xl font-bold">{data.emergencyCount}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600">Avg Hours/Task</div>
              <div className="text-2xl font-bold">
                {(data.totalHours / data.total).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance by Type */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Maintenance by Type</h2>
        </div>
        <div className="p-6 pt-0">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {typeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Maintenance by Department */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Maintenance by Department</h2>
        </div>
        <div className="p-6 pt-0">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <Bar dataKey="value" fill="#8884d8">
                  {departmentData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Bar>
                <Tooltip />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;