import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { user, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden animate-color-fade">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 800 600"
        >
          <circle
            className="animate-float1 fill-indigo-700 opacity-30"
            cx="100"
            cy="100"
            r="80"
          />
          <circle
            className="animate-float2 fill-blue-700 opacity-20"
            cx="400"
            cy="300"
            r="120"
          />
          <circle
            className="animate-float3 fill-indigo-800 opacity-25"
            cx="700"
            cy="150"
            r="100"
          />
          <circle
            className="animate-float4 fill-blue-800 opacity-15"
            cx="600"
            cy="500"
            r="140"
          />
        </svg>
      </div>

      {/* Login Card with drop animation */}
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 drop-animation">
        <div className="text-center mb-6">
          {/* Logo or Text Content */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
            alt="App Logo"
            className="mx-auto mb-4 w-20 h-20"
          />
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Expense Tracker
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in to manage your finances securely
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-6 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          {loading ? (
            <div
              className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"
              aria-hidden="true"
            ></div>
          ) : (
            <>
              <svg
                className="w-6 h-6 mr-3"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
