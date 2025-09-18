# Expense Tracker Application

## Overview

This project is an Expense Tracker application with a frontend built using React and Tailwind CSS, and a backend built with Node.js, Express, and MongoDB. It includes features like user authentication, transaction management, reports, and AI insights.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- **Node.js** (version 16 or higher): Download from [nodejs.org](https://nodejs.org/).
- **npm** (comes with Node.js): Package manager for JavaScript.
- **MongoDB**: Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community). Ensure MongoDB is running on your system (default port 27017).
- **Git**: For cloning the repository.

## Installation and Setup

### 1. Clone the Repository

Clone the project from the repository:

```bash
git clone <repository-url>
cd project-expense-tracker
```

Replace `<repository-url>` with the actual repository URL.

### 2. Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy the `.env.example` file to `.env` (if available):
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` to add necessary variables (e.g., MongoDB URI, Firebase config, JWT secrets). Example:
     ```
     MONGO_URI=mongodb://localhost:27017/expense-tracker
     FIREBASE_PROJECT_ID=your-project-id
     JWT_SECRET=your-secret-key
     ```

4. Ensure MongoDB is running:
   - Start MongoDB service if not already running (e.g., on Windows: `net start MongoDB`).

### 3. Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (if needed):
   - Check for `.env` or config files in the frontend directory and configure Firebase or other services.

## Running the Application

### Start Backend

From the `backend` directory:

```bash
npm run dev
```

The backend server will start on `http://localhost:5000` by default.

### Start Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default) or `http://localhost:3000` if configured.

### Access the Application

- Open your browser and go to the frontend URL (e.g., `http://localhost:5173`).
- The backend API will be accessible at `http://localhost:5000`.

## Environment Variables

- **Backend**: Ensure `.env` includes MongoDB URI, Firebase credentials, and other secrets.
- **Frontend**: Configure Firebase config in `src/firebase.js` or environment files.

## Testing

- **Frontend**: Test UI components, authentication, and navigation.
- **Backend**: Test API endpoints using tools like Postman or curl (e.g., GET `/api/transactions`).
- Run both servers and verify data flow between frontend and backend.

## Features Implemented

- User authentication with Google login via Firebase.
- Expense tracking with add, edit, delete transactions.
- Dashboard with summary and charts.
- Reports generation (Excel, PDF).
- AI insights integration.
- Responsive UI with light/dark mode.
- Drag and drop for transactions.

## Next Steps

- Implement comprehensive unit and integration tests.
- Add API documentation (e.g., using Swagger).
- Enhance accessibility and add more UI features.
- Deploy to production (e.g., using Vercel for frontend, Heroku for backend).

## Contact

For any questions or issues, please contact the project maintainer: ChakitSharma7@gmail.com

# Expense-Tracker-with-Ai-Insights
