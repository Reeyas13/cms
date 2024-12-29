"use client";
import React, { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import Link from 'next/link';
import { BiPrinter } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';

// Types
type PartsReplaced = {
    id: string;
    maintenanceId: string;
    name: string;
};

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
    updatedAt: string;
};

type MaintenanceRecord = {
    id: string;
    equipmentId: string;
    date: string;
    type: string;
    technician: string;
    hoursSpent: number;
    description: string;
    priority: string;
    completionStatus: string;
    Equipment: Equipment;
    partsReplaced: PartsReplaced[];
};

const MaintenanceViewForm = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const { data, isLoading } = useQuery({
        queryKey: ['maintenance', id],
        queryFn: async () => {
            const { data } = await axios.get(`/api/maintenancerecord/${id}`);
            return data.data as MaintenanceRecord;
        },
    });

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!data) {
        return <div>No record found</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header - Hidden when printing */}
            <div className="flex justify-between items-center mb-6 print:hidden">
                <Link 
                    href="/dashboard/maintenance" 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <BsArrowLeft className="w-4 h-4 mr-2" />
                    Back to Records
                </Link>
                <button
                    onClick={handlePrint}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <BiPrinter className="w-4 h-4 mr-2" />
                    Print Record
                </button>
            </div>

            {/* Main Content */}
            <div className="space-y-6 print:space-y-4">
                {/* Title */}
                <h1 className="text-2xl font-bold text-center mb-8 print:text-xl">
                    Maintenance Record Details
                </h1>

                {/* Equipment Information */}
                <div className="bg-gray-50 p-6 rounded-lg print:border print:border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Equipment Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-medium">{data.Equipment.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Model</p>
                            <p className="font-medium">{data.Equipment.model}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Serial Number</p>
                            <p className="font-medium">{data.Equipment.serialNumber}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Department</p>
                            <p className="font-medium">{data.Equipment.department}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-medium">{data.Equipment.location}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-medium">{data.Equipment.status}</p>
                        </div>
                    </div>
                </div>

                {/* Maintenance Details */}
                <div className="bg-white p-6 rounded-lg print:border print:border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Maintenance Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">{format(new Date(data.date), 'PPP')}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Type</p>
                            <p className="font-medium">{data.type}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Technician</p>
                            <p className="font-medium">{data.technician}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Hours Spent</p>
                            <p className="font-medium">{data.hoursSpent} hours</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Priority</p>
                            <p className="font-medium">{data.priority}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-medium">{data.completionStatus}</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-gray-600">Description</p>
                        <p className="font-medium mt-1">{data.description}</p>
                    </div>
                </div>

                {/* Parts Replaced */}
                <div className="bg-gray-50 p-6 rounded-lg print:border print:border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Parts Replaced</h2>
                    {data.partsReplaced.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {data.partsReplaced.map((part) => (
                                <li key={part.id} className="font-medium">
                                    {part.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No parts were replaced</p>
                    )}
                </div>
            </div>

            {/* Print Footer - Only visible when printing */}
            <div className="hidden print:block mt-8 pt-4 border-t text-sm text-gray-500">
                <p>Generated on {format(new Date(), 'PPP')}</p>
                <p>Maintenance Record ID: {data.id}</p>
            </div>
        </div>
    );
};

export default MaintenanceViewForm;