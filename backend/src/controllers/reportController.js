const Excel = require('exceljs');
const PDFDocument = require('pdfkit');
const Transaction = require('../models/Transaction');

const exportToExcel = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.uid })
            .sort({ date: -1 });

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Transactions');

        worksheet.columns = [
            { header: 'Date', key: 'date', width: 12 },
            { header: 'Title', key: 'title', width: 20 },
            { header: 'Category', key: 'category', width: 15 },
            { header: 'Type', key: 'type', width: 10 },
            { header: 'Amount', key: 'amount', width: 12 },
            { header: 'Description', key: 'description', width: 30 }
        ];

        transactions.forEach(transaction => {
            worksheet.addRow({
                date: transaction.date.toDateString(),
                title: transaction.title,
                category: transaction.category,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description || ''
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.xlsx"');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const exportToPDF = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.uid })
            .sort({ date: -1 });

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="transactions.pdf"');

        doc.pipe(res);

        doc.fontSize(20).text('Transaction Report', 50, 50);
        doc.moveDown();

        let y = 120;
        transactions.forEach(transaction => {
            if (y > 700) {
                doc.addPage();
                y = 50;
            }
            
            doc.fontSize(12)
               .text(`${transaction.date.toDateString()} - ${transaction.title}`, 50, y)
               .text(`${transaction.type.toUpperCase()}: $${transaction.amount}`, 300, y)
               .text(`Category: ${transaction.category}`, 450, y);
            
            y += 20;
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { exportToExcel, exportToPDF };
