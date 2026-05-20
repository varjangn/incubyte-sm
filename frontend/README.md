# Incubyte Staff Management - Frontend

This is the frontend application for the Incubyte Staff Management dashboard. It provides a user interface to manage employee records, including adding, viewing, updating, and deleting employees, alongside features like pagination and salary insights visualization.

## Technologies Used

- **React** (v19) - UI Library
- **Vite** - Build Tool and Dev Server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for backend API communication
- **Recharts** - Data visualization for the salary insights dashboard
- **Vitest & React Testing Library** - Testing framework and utilities

## Features

- **Employee Management:** View and manage the employee directory with server-side pagination support.
- **CRUD Operations:** Seamless Create, Read, Update, and Delete functionality for employee profiles.
- **Salary Insights:** A dedicated analytics dashboard visualizing salary metrics (min, max, average) by country and job title.
- **Modern UI:** Responsive interface featuring an orange-and-white theme with a collapsible sidebar navigation system.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- npm (comes with Node.js)

### Installation

1. Navigate to the `frontend` directory (if you aren't already there):
   ```bash
   cd frontend
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

3. Environment Variables (Optional):
   The application expects the backend server to be running. If your backend is hosted on a different URL than the default, you might need to specify a `.env` file at the root of the `frontend` folder (e.g., `VITE_API_URL=http://localhost:8000`).

## Running the Application

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will typically be accessible at `http://localhost:5173/`.

## Running Test Cases

This project follows a Test-Driven Development (TDD) methodology, utilizing Vitest and React Testing Library for robust unit and integration testing.

To execute the test suite:

```bash
npm run test
```

The `test` script runs Vitest in its default mode. If you are actively developing and want the tests to re-run automatically upon saving files, you can use:

```bash
npx vitest watch
```

## Production Build

To create an optimized production bundle:

```bash
npm run build
```

To preview the built production bundle locally:

```bash
npm run preview
```

## Linting

To ensure code quality and consistency across the project, you can run ESLint:

```bash
npm run lint
```
