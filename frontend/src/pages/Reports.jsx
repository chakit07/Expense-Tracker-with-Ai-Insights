import ExportButtons from "../components/ExportButtons";
import { useAuth } from "../context/AuthContext";

const Reports = () => {
  const { token } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Financial Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Access your data exports in Excel or PDF format.
        </p>
      </div>

      {/* Export Section */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export Your Data
          </h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Download your complete transaction history in Excel or PDF format for
          offline analysis and record-keeping.
        </p>
        <ExportButtons />
      </div>
    </div>
  );
};

export default Reports;
