import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/transactions", icon: Wallet, label: "Transactions" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/profile", icon: Settings, label: "Profile" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-900 min-h-screen shadow-lg border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out flex flex-col
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <div
        className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700
        ${isCollapsed ? "justify-center" : "justify-between"}`}
      >
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Menu
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md shadow-md opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-10">
                    {item.label}
                  </div>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-md"></div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Expense Tracker
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">
            Made with ❤️ by Chakit Sharma
          </p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
