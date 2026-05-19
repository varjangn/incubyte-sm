import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import axios from 'axios';
import EmployeeManagement from './EmployeeManagement';

vi.mock('axios');

const mockEmployees = [
  {
    id: 1,
    employee_id: 'EMP0001',
    first_name: 'John',
    last_name: 'Doe',
    salary: '50000.00',
    country: 'USA',
    date_of_birth: '1990-01-01',
    gender: 'Male',
    phone_number: '1234567890',
    joining_date: '2020-01-01',
    status: 'Active'
  }
];

describe('EmployeeManagement Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders a list of employees fetched from the API', async () => {
    axios.get.mockResolvedValueOnce({ data: mockEmployees });
    
    render(
      <BrowserRouter>
        <EmployeeManagement />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('EMP0001')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
    
    expect(axios.get).toHaveBeenCalledWith('/api/employees/');
  });

  it('renders Add Employee button', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    
    render(
      <BrowserRouter>
        <EmployeeManagement />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Add Employee/i)).toBeInTheDocument();
    });
  });
});
