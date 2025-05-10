import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { DashboardData } from "../Utils/DashboardData";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import {
  CiShoppingBasket,
  CiShoppingCart,
  CiUser,
  CiSettings,
} from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { BsFileEarmarkCheck } from "react-icons/bs";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(true); // Sidebar open by default
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();

  const icons = {
    CgProfile: CgProfile,
    CiShoppingBasket: CiShoppingBasket,
    CiShoppingCart: CiShoppingCart,
    CiUser: CiUser,
    CiSettings: CiSettings,
    IoNotificationsCircleOutline: IoNotificationsCircleOutline,
    AiOutlineProduct: AiOutlineProduct,
    BsFileEarmarkCheck: BsFileEarmarkCheck,
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`w-64 bg-gray-100 text-gray-700 transition-all duration-300 ease-in-out ${
          isOpen ? "block" : "hidden"
        } md:w-64 md:shadow-lg`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <button
            className="text-gray-600 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} className="cursor-pointer" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {DashboardData.map((item) => {
            const IconComponent = icons[item.icon];
            const isActive = pathname === item.path;
            return (
              (item.role === user?.role || item.role === "all") && (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors duration-300 ${
                    isActive
                      ? "bg-green-100 text-green-600 font-semibold"
                      : "text-gray-600 hover:bg-green-100 hover:text-green-600"
                  }`}
                >
                  <IconComponent size={24} className="mr-2" />
                  {item.name}
                </Link>
              )
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
        <div className="bg-gray-100 shadow-md p-4 flex items-center justify-between">
          <button
            className={`text-gray-600 hover:text-green-600 ${
              isOpen ? "hidden" : "block"
            }`}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={24} className="cursor-pointer" />
          </button>
          <div className={isOpen ? "block" : "hidden"}></div>{" "}
          {/* Spacer for alignment */}
        </div>

        <div className="p-6 bg-gray-50 min-h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
