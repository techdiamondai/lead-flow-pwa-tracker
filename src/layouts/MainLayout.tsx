
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
