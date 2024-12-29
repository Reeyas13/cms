"use client"
import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { BiPrinter } from 'react-icons/bi';


// Type for equipment data
type Equipment = {
  id: string;
  name: string;
  location: string;
  department: string;
  model: string;
  serialNumber: string;
  installDate: string;
  status: string;
  createdAt: string;
};

// Fetch function
const fetchEquipment = async (id: string) => {
  const { data } = await axios.get(`/api/equipment/${id}`);
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch equipment details');
  }
  return data.data;
};

const PrintButton = ({ equipment }: { equipment: Equipment }) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Equipment Details - ${equipment.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #eee;
            }
            .label {
              font-weight: bold;
            }
            .status {
              padding: 4px 12px;
              border-radius: 15px;
              font-weight: 500;
            }
            .status-Operational {
              background-color: #dcfce7;
              color: #166534;
            }
            .status-Down {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .status-Maintenance {
              background-color: #fef9c3;
              color: #854d0e;
            }
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Equipment Details Report</h1>
            <p>Generated on ${format(new Date(), 'PPP p')}</p>
          </div>
          <div class="detail-row">
            <span class="label">ID:</span>
            <span>${equipment.id}</span>
          </div>
          <div class="detail-row">
            <span class="label">Name:</span>
            <span>${equipment.name}</span>
          </div>
          <div class="detail-row">
            <span class="label">Location:</span>
            <span>${equipment.location}</span>
          </div>
          <div class="detail-row">
            <span class="label">Department:</span>
            <span>${equipment.department}</span>
          </div>
          <div class="detail-row">
            <span class="label">Model:</span>
            <span>${equipment.model}</span>
          </div>
          <div class="detail-row">
            <span class="label">Serial Number:</span>
            <span>${equipment.serialNumber}</span>
          </div>
          <div class="detail-row">
            <span class="label">Install Date:</span>
            <span>${format(new Date(equipment.installDate), 'PPP')}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="status status-${equipment.status}">${equipment.status}</span>
          </div>
          <div class="detail-row">
            <span class="label">Created At:</span>
            <span>${format(new Date(equipment.createdAt), 'PPP p')}</span>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <BiPrinter size={20} />
      <span>Print Details</span>
    </button>
  );
};

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const { data: equipment, isLoading, error } = useQuery<Equipment, Error>({
    queryKey: ['equipment', id],
    queryFn: () => fetchEquipment(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error.message || 'Error loading equipment details'}
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="text-gray-500 text-center p-4">
        No equipment data found
      </div>
    );
  }

  const details = [
    { label: 'ID', value: equipment.id },
    { label: 'Name', value: equipment.name },
    { label: 'Location', value: equipment.location },
    { label: 'Department', value: equipment.department },
    { label: 'Model', value: equipment.model },
    { label: 'Serial Number', value: equipment.serialNumber },
    {
      label: 'Install Date',
      value: format(new Date(equipment.installDate), 'PPP')
    },
    {
      label: 'Status',
      value: (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          equipment.status === "Operational"
            ? "bg-green-100 text-green-800"
            : equipment.status === "Down"
            ? "bg-red-100 text-red-800"
            : equipment.status === "Maintenance"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {equipment.status}
        </span>
      )
    },
    {
      label: 'Created At',
      value: format(new Date(equipment.createdAt), 'PPP p')
    },
  ];

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Equipment Details</h1>
        <PrintButton equipment={equipment} />
      </div>
      <div className="space-y-4">
        {details.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100">
            <strong className="text-lg text-gray-700">{label}:</strong>
            <span className="text-lg text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;