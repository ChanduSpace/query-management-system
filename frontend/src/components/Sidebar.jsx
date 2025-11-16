import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Add this import

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user } = useAuth(); // Add this line to get user data

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "📊",
      roles: ["admin", "agent", "user"],
    },
    {
      name: "Query Inbox",
      href: "/inbox",
      icon: "📨",
      roles: ["admin", "agent"],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: "📈",
      roles: ["admin", "agent"],
    },
    {
      name: "Advanced Reports",
      href: "/advanced-reports",
      icon: "📋",
      roles: ["admin"],
    },
    { name: "Team Management", href: "/teams", icon: "👥", roles: ["admin"] },
    {
      name: "Profile",
      href: "/profile",
      icon: "👤",
      roles: ["admin", "agent", "user"],
    },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex z-40">
          <div className="fixed inset-0" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
          </div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-gray-800">
                  HelpDesk Pro
                </h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  if (!item.roles.includes(user?.role)) return null; // Add null check with ?.
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="mr-4 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold text-gray-800">HelpDesk Pro</h1>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <nav className="flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  if (!item.roles.includes(user?.role)) return null; // Add null check with ?.
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname === item.href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
