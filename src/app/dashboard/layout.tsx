"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SdieBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

interface AdminLayoutProps {
  children: React.ReactNode;
}
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div>
          <NavBar setOpen={setOpen} isSidebarOpen={open} />
          <SideBar open={open} setOpen={setOpen} />
          <div
            className={`pt-16 transition-all duration-300 ${open ? "lg:pl-64" : "lg:pl-20"
              }`}
          >
            {children}
          </div>
          <ToastContainer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default AdminLayout;
