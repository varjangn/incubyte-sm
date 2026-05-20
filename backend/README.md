# Incubyte Assignment - Django Backend API

This is the backend API for the Incubyte Assignment application, built with Django and Django REST Framework.

## Setup Instructions

The project uses `uv` for dependency management, which is a fast Python package installer and resolver.

### Prerequisites
- Install `uv` (e.g., using `curl -LsSf https://astral.sh/uv/install.sh | sh` or via `pip install uv`)
- Python >= 3.14 (as specified in `pyproject.toml`)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone git@github.com:varjangn/incubyte-sm.git
   cd incubyte-sm/backend
   ```

2. **Install dependencies and create a virtual environment:**
   Use `uv sync` to create a virtual environment (`.venv`) and install all dependencies defined in `pyproject.toml` and `uv.lock`.
   ```bash
   uv sync
   ```

3. **Activate the virtual environment:**
   - On Linux/macOS:
     ```bash
     source .venv/bin/activate
     ```
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```

4. **Run Database Migrations:**
   ```bash
   python manage.py migrate
   ```
   *(Alternatively, you can run it via uv without activating the environment: `uv run python manage.py migrate`)*

5. **Run the test cases**
   ```bash
   uv run manage.py test
   ```

6. **Create a superuser and user for linking employees with user:**
   ```bash
   uv run manage.py create_test_users
   ```

7. **Generate Dummy Data (Optional):**
   If you need to populate your local database with mock data for testing, you can use the custom management command or python script:
   ```bash
   python generate_dummy_data.py
   # Or a management command if available
   ```

   Next seed dummy data which is generated in csv file dummy_employees.csv
   ```python
   $ uv run manage.py seed_employees dummy_employees.csv
   ```


   

8. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```
   The backend will be running at `http://127.0.0.1:8000/`.

## API Endpoints

The API is structured around the `api/` prefix.

### Employee Management

Handles complete CRUD operations for `EmployeeProfile` records.

- **`GET /api/employees/`**: List all employee profiles (supports pagination).
- **`POST /api/employees/`**: Create a new employee profile.
- **`GET /api/employees/{id}/`**: Retrieve details of a specific employee profile.
- **`PUT /api/employees/{id}/`**: Fully update a specific employee profile.
- **`PATCH /api/employees/{id}/`**: Partially update a specific employee profile.
- **`DELETE /api/employees/{id}/`**: Delete a specific employee profile.

### Employee Insights

Provides data analytics endpoints for the frontend dashboard.

- **`GET /api/employees/insights/salary/`**: Retrieve salary analytics (min, max, average salary). Can be filtered by `?country=...`.
- **`GET /api/employees/insights/countries/`**: Retrieve a distinct list of all countries where employees are currently located.