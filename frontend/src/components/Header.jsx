import React from "react";
import { useAuth } from "../context/AuthContext";
const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
            <div className="relative">
              <button className="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none bg-blue-500 text-white flex items-center justify-center">
                {user?.name?.charAt(0).toUpperCase()}
              </button>
            </div>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
