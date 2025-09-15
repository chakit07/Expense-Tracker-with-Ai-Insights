// src/components/Navbar.jsx

import { LogOut, Menu, Moon, Sun, User, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`
        bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg border-b dark:border-gray-700
        sticky top-0 z-50 w-full transition-all duration-500 ease-in-out
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left - Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            </div>
            <Link
              to="/"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
            >
              Expense Tracker
            </Link>
          </div>

          {/* Right - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200 hover:scale-110 hover:rotate-12"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 rounded-full px-3 py-1">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Hi, {user?.displayName || user?.email}
              </span>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full border-2 border-blue-500 hover:border-purple-500 transition-colors duration-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t dark:border-gray-700 animate-fade-in">
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-3">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {user?.displayName || user?.email}
                </span>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                <span>Toggle Theme</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
