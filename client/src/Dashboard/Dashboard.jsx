import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { DashboardData } from "../Utils/DashboardData";
import { Menu, X } from "lucide-react";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300 ease-in-out 
        md:relative md:translate-x-0 md:w-64 h-screen`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} className="text-red-700" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {DashboardData.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="block px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-800 overflow-auto">
        <div className="bg-white shadow-md p-4 flex items-center justify-between md:hidden">
          <button
            className="text-gray-700 hover:text-black"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        <div className="p-6 bg-gray-800 min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
