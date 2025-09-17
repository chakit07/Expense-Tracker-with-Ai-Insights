const Excel = require("exceljs");
const PDFDocument = require("pdfkit");
const PDFDocumentTable = require("pdfkit-table"); // Import pdfkit-table
const path = require("path");
const Transaction = require("../models/Transaction");

const exportToExcel = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.uid }).sort({ date: -1 });

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Transactions");

        worksheet.columns = [
            { header: "Date", key: "date", width: 12 },
            { header: "Title", key: "title", width: 20 },
            { header: "Category", key: "category", width: 20 },
            { header: "Type", key: "type", width: 12 },
            { header: "Amount (Rs)", key: "amount", width: 15 }
        ];

        transactions.forEach(transaction => {
            worksheet.addRow({
                date: new Date(transaction.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                title: transaction.title,
                category: transaction.category,
                type: transaction.type,
                amount: `Rs ${Number(transaction.amount).toLocaleString("en-IN")}`,
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="transactions.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const exportToPDF = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.uid }).sort({ date: -1 });

        const doc = new PDFDocumentTable({ margin: 50 });

        // Fonts
        doc.registerFont("NotoSans", path.join(__dirname, "../fonts/NotoSans-Regular.ttf"));
        doc.registerFont("NotoSans-Bold", path.join(__dirname, "../fonts/NotoSans-Bold.ttf"));

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="transactions.pdf"');

        doc.pipe(res);

        // Page event for footer with page numbers
        doc.on('pageAdded', () => {
            const pageNumber = doc.pageNumber;
            doc.font("NotoSans").fontSize(10).fillColor("gray");
            doc.text(`Page ${pageNumber}`, 50, doc.page.height - 50, { align: 'center' });
        });

        // Title
        doc.font("NotoSans-Bold").fontSize(24).fillColor("#333").text("Transaction Report", { align: "center" });
        doc.moveDown(0.5);
        doc.font("NotoSans").fontSize(12).fillColor("#666").text(`Generated on: ${new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, { align: "center" });
        doc.moveDown(2);

        // Calculate totals
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach(t => {
            const amount = Number(t.amount);
            if (t.type === 'income') totalIncome += amount;
            else totalExpense += amount;
        });
        const netBalance = totalIncome - totalExpense;

        // Build table data
        const table = {
            headers: ["Date", "Title", "Category", "Type", "Amount (Rs)"],
            rows: transactions.map(t => [
                new Date(t.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }),
                t.title,
                t.category,
                t.type.charAt(0).toUpperCase() + t.type.slice(1),
                `Rs ${Number(t.amount).toLocaleString("en-IN")}`
            ])
        };

        // Draw table with improved styling
        await doc.table(table, {
            prepareHeader: () => doc.font("NotoSans-Bold").fontSize(12).fillColor("white"),
            prepareRow: (row, i) => doc.font("NotoSans").fontSize(11).fillColor("black"),
            padding: 8,
            columnSpacing: 10,
            width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
            columnWidths: [80, 150, 100, 70, 100],
            borders: true,
            borderColor: '#cccccc',
            headerBackgroundColor: '#007bff',
            alternateRowBackgrounds: true,
            alternateRowBackgroundColor: '#f8f9fa'
        });

        // Summary section
        doc.moveDown(2);
        doc.font("NotoSans-Bold").fontSize(16).fillColor("#333").text("Summary", { align: "left" });
        doc.moveDown(0.5);
        doc.font("NotoSans").fontSize(12).fillColor("#000");
        doc.text(`Total Income: Rs ${totalIncome.toLocaleString("en-IN")}`, { continued: false });
        doc.text(`Total Expense: Rs ${totalExpense.toLocaleString("en-IN")}`, { continued: false });
        doc.font("NotoSans-Bold").text(`Net Balance: Rs ${netBalance.toLocaleString("en-IN")}`, { continued: false });

        doc.end();

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { exportToExcel, exportToPDF };
