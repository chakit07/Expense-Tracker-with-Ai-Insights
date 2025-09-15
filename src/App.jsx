import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TransactionProvider } from "./context/TransactionContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";

function App() {
  return (
    // 2. Wrap everything in ThemeProvider
    <ThemeProvider>
      <AuthProvider>
        <TransactionProvider>
          <Router>
            {/* 3. Remove dark classes here, they are now on the <html> tag */}
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <Navbar />
                          {/* Also remove dark class from here */}
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-6 py-8">
                              <Dashboard />
                            </div>
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <Navbar />
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-6 py-8">
                              <Transactions />
                            </div>
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <Navbar />
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-6 py-8">
                              <Reports />
                            </div>
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div className="flex h-screen">
                        <Sidebar />
                        <div className="flex-1 flex flex-col overflow-hidden">
                          <Navbar />
                          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
                            <div className="container mx-auto px-6 py-8">
                              <Profile />
                            </div>
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </Router>
        </TransactionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
