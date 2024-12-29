"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { equipmentSchema } from "../utils/validationSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type FormData = {
    name: string;
    location: string;
    department: "Machining" | "Assembly" | "Packaging" | "Machining";
    model: string;
    serialNumber: string;
    installDate: string;
    status: "Operational" | "Down" | "Maintenance" | "Retired";
};

const EquipmentForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            //setting default values
            name: "",
            location: "",
            department: "Machining",
            model: "",
            serialNumber: "",
            installDate: "",
            status: "Operational",
        },
    });
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value);
            }
            const response = await axios.post("/api/equipment", formData);
            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/dashboard/equipment");
            }
            
            reset();
        } catch (error) {
            console.log(error)
            alert("Error submitting form");
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <form
            className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg"
            onSubmit={handleSubmit(onSubmit)}
        >
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
                                <option value="Maintenance">Maintenance </option>
                                <option value="Retired">Retired </option>
                            </select>
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <button
                        type="submit"
                        className={`w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EquipmentForm;
