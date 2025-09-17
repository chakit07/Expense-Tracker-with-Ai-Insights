import { LogOut, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Profile
      </h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-lg transition-all">
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
          {/* User Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md"
            />
            <div>
              <h2 className="text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                {user.displayName}
              </h2>
              <p className="text-gray-700 dark:text-gray-400 text-base sm:text-lg mt-1">
                {user.email}
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <button
              onClick={toggleTheme}
              className="flex items-center w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm"
            >
              {theme === "dark" ? (
                <Sun className="mr-4" size={22} />
              ) : (
                <Moon className="mr-4" size={22} />
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-5 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-sm"
            >
              <LogOut className="mr-4" size={22} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
