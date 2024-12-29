"use client";
import { useQuery } from "@tanstack/react-query";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Link from "next/link";

// Types based on your schema
type Equipment = {
    id: string;
    name: string;
    location: string;
    department: "Machining" | "Assembly" | "Packaging" | "Shipping";
    model: string;
    serialNumber: string;
    installDate: string;
    status: "Operational" | "Down" | "Maintenance" | "Retired";
};

const fetchEquipment = async () => {
    const { data } = await axios.get("/api/equipment");
    console.log(data);
    return data.data;
};

const EquipmentTable = () => {
    // const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    // Destructure the refetch function from useQuery
    const { data: equipment = [], isLoading, error, refetch } = useQuery({
        queryKey: ["equipment"],
        queryFn: fetchEquipment,
    });

    const columnHelper = createColumnHelper<Equipment>();

    const columns = [
        columnHelper.accessor("name", {
            header: "Name",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("location", {
            header: "Location",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("department", {
            header: "Department",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("model", {
            header: "Model",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("serialNumber", {
            header: "Serial Number",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("installDate", {
            header: "Install Date",
            cell: (info) => format(new Date(info.getValue()), "PP"),
        }),
        columnHelper.accessor("status", {
            header: "Status",
            cell: (info) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${info.getValue() === "Operational"
                        ? "bg-green-100 text-green-800"
                        : info.getValue() === "Down"
                            ? "bg-red-100 text-red-800"
                            : info.getValue() === "Maintenance"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor("id", {
            header: "Actions",
            cell: (info) => (
                <div className="flex space-x-2">
                    <Link href={`/dashboard/equipment/${info.getValue()}`} className="text-green-500 hover:underline">Edit</Link>
                    <Link href={`/dashboard/equipment/view/${info.getValue()}`} className="text-blue-500 hover:underline">View</Link>
                    <button className="text-red-500 hover:underline" onClick={() => handleDelete(info.getValue())} >Delete</button>
                </div>
            ),
        })
    ];

    const handleDelete = async (id: string) => {
        try {
            const res = await axios.delete(`/api/equipment/${id}`);
            if (res.data.success) {
                toast.success("Equipment deleted successfully");
                refetch(); // Refetch data after deletion
            }
        } catch (error) {
            toast.error("Error deleting equipment, delete related items first");
        }
    };
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "name",
            desc: false,
        },
    ])
    const table = useReactTable({
        data: equipment,
        columns,
        state: {
            sorting,
            globalFilter: filtering,
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
            
        },
        onGlobalFilterChange: setFiltering,
        onSortingChange: setSorting, // Update sorting state
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
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
            <div className="flex justify-center items-center min-h-[400px] text-red-500">
                Error loading equipment data
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            {/* Search Filter */}
            <div className="flex justify-between items-center">
                <input
                    type="text"
                    value={filtering}
                    onChange={(e) => setFiltering(e.target.value)}
                    placeholder="Search equipment..."
                    className="p-2 border rounded-md w-64"
                />
                <div className="text-sm text-gray-500">
                    Total items: {table.getFilteredRowModel().rows.length}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()} // Add sorting functionality
                                    >
                                        <div className="flex items-center space-x-1">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() === "asc" ? " ↑" : ""}
                                            {header.column.getIsSorted() === "desc" ? " ↓" : ""}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className={`hover:bg-gray-50 transition-colors ${row.original.status === "Operational"
                                    ? "bg-green-50 hover:bg-green-100"
                                    : row.original.status === "Down"
                                        ? "bg-red-50 hover:bg-red-100"
                                        : row.original.status === "Maintenance"
                                            ? "bg-yellow-50 hover:bg-yellow-100"
                                            : row.original.status === "Retired"
                                                ? "bg-gray-50 hover:bg-gray-100"
                                                : ""
                                    }`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {"<<"}
                    </button>
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {"<"}
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {">"}
                    </button>
                    <button
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        {">>"}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Page</span>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default EquipmentTable;
