import { useTransactions } from '../context/TransactionContext';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportButtons = () => {
  const { transactions } = useTransactions();

  const handleExcelExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "Transactions.xlsx");
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 20, 10);
    autoTable(doc, {
      head: [['Date', 'Type', 'Category', 'Amount']],
      body: transactions.map(t => [
        t.date, 
        t.type, 
        t.category, 
        `₹${t.amount.toLocaleString('en-IN')}`
      ]),
    });
    doc.save("Transactions.pdf");
  };

  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
      <button
        onClick={handleExcelExport}
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        <Download className="w-5 h-5 mr-2" />
        Download as Excel (.xlsx)
      </button>
      <button
        onClick={handlePdfExport}
        className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
      >
        <Download className="w-5 h-5 mr-2" />
        Download as PDF (.pdf)
      </button>
    </div>
  );
};

export default ExportButtons;