"use client";
import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaintenanceRecordSchema } from "../utils/validationSchema";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type Equipment = {
    id: string;
    name: string;
};

type MaintenanceRecordFormData = {
    equipmentId: string;
    date: string;
    type: "Routine" | "Emergency" | "Repair";
    technician: string;
    hoursSpent: number;
    description: string;
    priority: "Low" | "Medium" | "High";
    completionStatus: "Pending" | "Completed" | "In Progress";
    partsReplaced: { name: string }[];
};

const fetchEquipment = async (): Promise<Equipment[]> => {
    const response = await axios.get("/api/dropdown/equipmentId");
    return response.data.data;
};

const MaintenanceForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: equipment, isLoading: isLoadingEquipment } = useQuery({
        queryKey: ["equipment"],
        queryFn: fetchEquipment,
    });

    const { control, handleSubmit, formState: { errors } } = useForm<MaintenanceRecordFormData>({
        resolver: zodResolver(MaintenanceRecordSchema),
        defaultValues: {
            equipmentId: "",
            date: "",
            type: "Routine",
            technician: "",
            hoursSpent: 0,
            description: "",
            priority: "Low",
            completionStatus: "Pending",
            partsReplaced: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "partsReplaced",
    });

    const onSubmit = async (data: MaintenanceRecordFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            // Add all fields to FormData
            formData.append("equipmentId", data.equipmentId);
            formData.append("date", new Date(data.date).toISOString());
            formData.append("type", data.type);
            formData.append("technician", data.technician);
            formData.append("hoursSpent", data.hoursSpent.toString());
            formData.append("description", data.description);
            formData.append("priority", data.priority);
            formData.append("completionStatus", data.completionStatus);
            formData.append("partsReplaced", JSON.stringify(data.partsReplaced));
            const response = await axios.post("/api/maintenancerecord", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                toast.success("Maintenance Record added successfully!");
                    router.push("/dashboard/maintenance");
                // reset();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : "Error submitting form");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
            onSubmit={handleSubmit(onSubmit)}
        >
            {/* Equipment ID - Updated to use dropdown */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Equipment</label>
                <Controller
                    name="equipmentId"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            disabled={isLoadingEquipment}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select equipment</option>
                            {equipment?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {errors.equipmentId && <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Install Date</label>
                <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="date"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    )}
                />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>


            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Type</label>
                <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="Emergency">Emergency</option>
                            <option value="Preventive">Preventive</option>
                            <option value="Repair">Repair</option>
                        </select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            {/* Technician */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Technician</label>
                <Controller
                    name="technician"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter technician's name"
                        />
                    )}
                />
                {errors.technician && <p className="text-red-500 text-sm">{errors.technician.message}</p>}
            </div>

            {/* Hours Spent */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Hours Spent</label>
                <Controller
                    name="hoursSpent"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter hours spent"
                        />
                    )}
                />
                {errors.hoursSpent && <p className="text-red-500 text-sm">{errors.hoursSpent.message}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter description"
                            rows={3}
                        />
                    )}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Priority */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    )}
                />
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
            </div>

            {/* Completion Status */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Completion Status</label>
                <Controller
                    name="completionStatus"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="Complete">Complete</option>
                            <option value="Incomplete">Incomplete</option>
                            <option value="PendingParts">Pending Parts</option>
                        </select>
                    )}
                />
                {errors.completionStatus && (
                    <p className="text-red-500 text-sm">{errors.completionStatus.message}</p>
                )}
            </div>
            {/* Parts Replaced Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Parts Replaced</label>
                    <button
                        type="button"
                        onClick={() => append({ name: "" })}
                        className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        <FaPlus className="w-4 h-4 mr-1" />
                        Add Part
                    </button>
                </div>

                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-2">
                            <Controller
                                name={`partsReplaced.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Enter part name"
                                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                <MdDelete className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                {errors.partsReplaced && (
                    <p className="text-red-500 text-sm">{errors.partsReplaced.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                    {isSubmitting ? "Submitting..." : "Submit Maintenance Record"}
                </button>
            </div>
        </form>
    );
};

export default MaintenanceForm;