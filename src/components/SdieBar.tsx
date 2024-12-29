"use client"
import React, { useEffect, useRef } from "react";
import { FaHome, FaTools } from "react-icons/fa";

import CustomDropDown from "./CustomDropDown";
import { GrVmMaintenance } from "react-icons/gr";

interface SideBarProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean;
}
const SideBar = ({ open, setOpen }: SideBarProps) => {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const links = [
        {
            href: "/dashboard",
            icon: <FaHome />,
            name: "Dashboard",
            sub: [],
        },
        {
            href: "/dashboard/equipment",
            icon: <FaTools />,
            name: "Equipment",
            sub: [
                { name: "All Equipment", href: "/dashboard/equipment" },
                { name: "Create Equipment", href: "/dashboard/equipment/create" },
                
            ],
        },
        {
            href: "/dashboard/maintenance",
            icon: <GrVmMaintenance  />,
            name: "Banner",
            sub: [
                { name: "Add Maintenance", href: "/dashboard/maintenance" },
                { name: "Create Maintenance", href: "/dashboard/maintenance/create" },
                
            ],
        },
    ];

    return (
        <div
            ref={sidebarRef}
            className={`fixed z-10 inset-0  top-0 left-0 ${open && "overflow-x-auto"
                } min-h-screen bg-white shadow-md transition-all duration-300 ${open ? "w-64" : "w-0 lg:w-20"
                }`}
        >
            <div className="px-4 py-4">
                <h2
                    className={`text-center text-lg font-semibold transition-opacity duration-200 hidden lg:block`}
                >
             CMS
                </h2>
            </div>
            <div className="mt-4 space-y-2">
                {links.map((link, index) => (
                    <CustomDropDown
                        key={index}
                        href={link.href}
                        icon={link.icon}
                        name={link.name}
                        subLinks={link.sub}
                        open={open}
                    />
                ))}
            </div>
        </div>
    );
};

export default SideBar;
