"use client";
import React, { useState, useEffect, use } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema } from "@/utils/validationSchema"; 
import { Equipment } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios from "axios";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { useRouter } from "next/navigation";

type FormData = {
    name: string;
    location: string;
    department: "Machining" | "Assembly" | "Packaging" | "Shipping";
    model: string;
    serialNumber: string;
    installDate: string;
    status: "Operational" | "Down" | "Maintenance" | "Retired";
};

const fetchEquipment = async (id: string) => {
    const { data } = await axios.get(`/api/equipment/${id}`);
    if (!data.success) {
        throw new Error(data.message || 'Failed to fetch equipment details');
    }
    return data.data;
};

const EquipmentEditForm = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: equipment, isLoading, error } = useQuery<Equipment, Error>({
        queryKey: ['equipment', id],
        queryFn: () => fetchEquipment(id),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            name: "",
            location: "",
            department: "Machining",
            model: "",
            serialNumber: "",
            installDate: "",
            status: "Operational",
        },
    });

    // Update form when equipment data is loaded
    useEffect(() => {
        if (equipment) {
            reset({
                name: equipment.name,
                location: equipment.location,
                department: equipment.department as FormData['department'],
                model: equipment.model,
                serialNumber: equipment.serialNumber,
                installDate: format(new Date(equipment.installDate), 'yyyy-MM-dd'),
                status: equipment.status as FormData['status'],
            });
        }
    }, [equipment, reset]);
const router = useRouter();
    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await axios.put(`/api/equipment/${id}`, data);
            if (response.data.success) {
                toast.success("Equipment updated successfully!");
                router.push("/dashboard/equipment");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating equipment");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    return (
        <form
            className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
            onSubmit={handleSubmit(onSubmit)}
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Equipment</h2>
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter name"
                            />
                        )}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter location"
                            />
                        )}
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
                </div>

                {/* Department */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="Shipping">Shipping</option>
                                <option value="Packaging">Packaging</option>
                                <option value="Assembly">Assembly</option>
                                <option value="Machining">Machining</option>
                            </select>
                        )}
                    />
                    {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
                </div>

                {/* Model */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <Controller
                        name="model"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter model"
                            />
                        )}
                    />
                    {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
                </div>

                {/* Serial Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                    <Controller
                        name="serialNumber"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Enter serial number"
                            />
                        )}
                    />
                    {errors.serialNumber && (
                        <p className="text-red-500 text-sm">{errors.serialNumber.message}</p>
                    )}
                </div>

                {/* Install Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Install Date</label>
                    <Controller
                        name="installDate"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        )}
                    />
                    {errors.installDate && <p className="text-red-500 text-sm">{errors.installDate.message}</p>}
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="Operational">Operational</option>
                                <option value="Down">Down</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Retired">Retired</option>
                            </select>
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        type="submit"
                        className={`w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Equipment"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EquipmentEditForm;