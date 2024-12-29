"use client";
import React, { use, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaintenanceRecordSchema } from "@/utils/validationSchema";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
  completionStatus: "Pending" | "Completed" | "In Progress" | "PendingParts";
  partsReplaced: { name: string }[];
};
const fetchEquipment = async (): Promise<Equipment[]> => {
    const response = await axios.get("/api/dropdown/equipmentId");
    return response.data.data;
};

const fetchMaintenanceRecord = async (id: string): Promise<MaintenanceRecordFormData> => {
    const response = await axios.get(`/api/maintenancerecord/${id}`);
    return response.data.data;
};

const updateMaintenanceRecord = async (
    id: string,
    data: MaintenanceRecordFormData
): Promise<any> => {
    const formData = new FormData();
    formData.append("equipmentId", data.equipmentId);
    formData.append("date", new Date(data.date).toISOString());
    formData.append("type", data.type);
    formData.append("technician", data.technician);
    formData.append("hoursSpent", data.hoursSpent.toString());
    formData.append("description", data.description);
    formData.append("priority", data.priority);
    formData.append("completionStatus", data.completionStatus);
    formData.append("partsReplaced", JSON.stringify(data.partsReplaced));

    const response = await axios.put(`/api/maintenancerecord/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

const MaintenanceEditForm = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    const { data: equipment, isLoading: isLoadingEquipment } = useQuery({
        queryKey: ["equipment"],
        queryFn: fetchEquipment,
    });

    const { data: maintenanceRecord, isLoading: isLoadingRecord } = useQuery({
        queryKey: ["maintenanceRecord", id],
        queryFn: () => fetchMaintenanceRecord(id),
        enabled: !!id,
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm<MaintenanceRecordFormData>({
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

    useEffect(() => {
      if (maintenanceRecord) {
          // Transform the data to match form structure
          const formData = {
              ...maintenanceRecord,
              // Convert PartsReplaced to partsReplaced format
              partsReplaced: maintenanceRecord.partsReplaced.map(part => ({
                  name: part.name
              }))
          };
          reset(formData);
      }
  }, [maintenanceRecord, reset]);
  const onSubmit = async (data: MaintenanceRecordFormData) => {
    try {
        // Transform back to API expected format if needed
        const submissionData = {
            ...data,
            PartsReplaced: data.partsReplaced
        };
        const response = await updateMaintenanceRecord(id, submissionData);
        if (response.success) {
            alert("Maintenance Record updated successfully!");
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        alert(error instanceof Error ? error.message : "Error updating form");
    }
};

    if (isLoadingRecord || isLoadingEquipment) {
        return <p>Loading...</p>;
    }

    return (
        <form
            className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
            onSubmit={handleSubmit(onSubmit)}
        >
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
                <label className="block text-sm font-medium text-gray-700">Date</label>
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
                            <option value="Routine">Routine</option>
                            <option value="Emergency">Emergency</option>
                            <option value="Repair">Repair</option>
                        </select>
                    )}
                />
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700">Hours Spent</label>
                <Controller
                    name="hoursSpent"
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="number"
                            min="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter hours spent"
                        />
                    )}
                />
                {errors.hoursSpent && <p className="text-red-500 text-sm">{errors.hoursSpent.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            rows={4}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Enter description"
                        />
                    )}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700">Parts Replaced</label>
                {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-3 mb-2">
                        <Controller
                            name={`partsReplaced.${index}.name`}
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Part name"
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500"
                        >
                            <MdDelete />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => append({ name: "" })}
                    className="text-blue-500 flex items-center space-x-1"
                >
                    <FaPlus />
                    <span>Add Part</span>
                </button>
            </div>

            <div className="flex justify-center">
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Update Record
                </button>
            </div>
        </form>
    );
};

export default MaintenanceEditForm;