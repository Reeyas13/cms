"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";

interface customDropDownProps {
    name: string;
    subLinks: { name: string; href: string }[];
    icon: React.ReactNode;
    open: boolean;
    href: string;
}
const CustomDropDown = ({ name, subLinks, icon, open, href }: customDropDownProps) => {
    const router = useRouter()
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleNavigation = (link: string) => {
        router.push(link);
    };

    return (
        <div
            className={`relative group ${!open && "hidden lg:block"}  ${isHovered || "overflow-hidden"
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
                if (Array.isArray(subLinks) && subLinks.length > 0) {
                    toggleDropdown();
                } else {
                    handleNavigation(href);
                }
            }}
        >
            <div
                className={`px-4 py-2 flex items-center justify-between cursor-pointer rounded-md transition-colors duration-200 hover:bg-gray-200`}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={`text-xl p-2 rounded-md ${!open && pathname === href
                                ? "bg-[#60A5FA] text-white"
                                : "text-gray-500"
                            }`}
                    >
                        {icon}
                    </div>

                    <span
                        className={`font-medium text-gray-700 truncate transition-all duration-[330ms] ${!open && "opacity-0"
                            }`}
                    >
                        {name}
                    </span>
                </div>
                {Array.isArray(subLinks) && subLinks.length > 0 && open && (
                    <div
                        className={`text-sm text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-90" : ""
                            }`}
                    >
                        <FaChevronRight />
                    </div>
                )}
            </div>
            {open && isDropdownOpen && (
                <div className="pl-4">
                    {subLinks.map((subLink, index) => (
                        <div key={index} className="px-4 py-2 cursor-pointer hover:bg-gray-200">
                            <span
                                className={`block w-full ${pathname === subLink.href ? "text-purple-500 " : ""
                                    }`}
                                onClick={() => handleNavigation(subLink.href)}
                            >
                                {subLink.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {!open && isHovered && Array.isArray(subLinks) && subLinks.length > 0 && (
                <div
                    className="absolute top-0  left-[100%] bg-white shadow-md border rounded-md py-2 w-48 z-50"
                    style={{ marginLeft: "8px" }}
                >
                    {subLinks.map((subLink, index) => (
                        <span
                            key={index}
                            onClick={() => handleNavigation(subLink.href)}
                            className={`block px-4  cursor-pointer py-2 text-sm transition-colors duration-200 ${pathname === subLink.href
                                    ? "bg-indigo-500 text-white"
                                    : "hover:bg-gray-100 hover:text-gray-900"
                                }`}
                        >
                            {subLink.name}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropDown;
