import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
    axios.get.mockResolvedValueOnce({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: mockEmployees
      }
    });

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

    expect(axios.get).toHaveBeenCalledWith('/api/employees/?page=1');
  });

  it('renders pagination controls correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        count: 50,
        next: 'http://localhost/api/employees/?page=2',
        previous: null,
        results: mockEmployees
      }
    });

    render(
      <BrowserRouter>
        <EmployeeManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    });
  });

  it('fetches new data when pagination control is clicked', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        count: 50,
        next: 'http://localhost/api/employees/?page=2',
        previous: null,
        results: mockEmployees
      }
    });

    render(
      <BrowserRouter>
        <EmployeeManagement />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    });

    // Mock response for page 2
    axios.get.mockResolvedValueOnce({
      data: {
        count: 50,
        next: 'http://localhost/api/employees/?page=3',
        previous: 'http://localhost/api/employees/?page=1',
        results: []
      }
    });

    fireEvent.click(screen.getByRole('button', { name: '2' }));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/employees/?page=2');
    });
  });

  it('renders Add Employee button', async () => {
    axios.get.mockResolvedValueOnce({ data: { count: 0, next: null, previous: null, results: [] } });

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
