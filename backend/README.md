# Expense Tracker Application

## Overview

This project is an Expense Tracker application with a frontend built using React and Tailwind CSS, and a backend built with Node.js, Express, and MongoDB.

---

## Frontend

- **Framework:** React 18
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Context API
- **Key Dependencies:**
  - @mui/material, @mui/icons-material for UI components
  - react-hot-toast for notifications
  - recharts and react-chartjs-2 for charts
  - firebase for authentication
  - lucide-react for icons

### Running Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. The app will be available at `http://localhost:3000` (default Vite port).

---

## Backend

- **Framework:** Node.js with Express
- **Database:** MongoDB (via Mongoose)
- **Key Dependencies:**
  - express for server
  - mongoose for MongoDB ODM
  - cors for Cross-Origin Resource Sharing
  - dotenv for environment variables
  - multer for file uploads
  - firebase-admin for Firebase integration
  - exceljs and pdfkit for report generation

### Running Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```
4. The backend server runs on port 5000 by default.

---

## Features Implemented

- User authentication with Google login.
- Expense tracking with transaction management.
- Reports generation and AI insights integration.
- Responsive UI with light/dark mode.
- Background image added to login page for enhanced UI.

---

## Testing

- Frontend and backend should be tested separately.
- Frontend: Test login page UI, background image rendering, and navigation.
- Backend: Test API endpoints for authentication, transactions, reports, and AI routes.

---

## Next Steps

- Implement thorough testing for all frontend components and backend endpoints.
- Add more detailed documentation for API endpoints.
- Enhance UI with additional features and accessibility improvements.

---

## Contact

For any questions or issues, please contact the project maintainer:: ChakitSharma7@gmail.com
"# Expense-Tracker-with-Ai-Insights" 
