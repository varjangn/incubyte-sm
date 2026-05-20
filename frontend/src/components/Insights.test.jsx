import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import Insights from './Insights';

// Mock recharts' ResponsiveContainer since it relies on DOM measurement
vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: 300 }}>{children}</div>
    ),
  };
});

// Mock axios
vi.mock('axios');

describe('Insights Component', () => {
  const mockCountries = ['Canada', 'India', 'USA'];
  const mockInsightsData = {
    overall_stats: {
      employee_count: 5,
      min_salary: 40000,
      max_salary: 100000,
      avg_salary: 70000
    },
    by_job_title: [
      { job_title: 'Software Engineer', employee_count: 3, avg_salary: 80000 },
      { job_title: 'HR Manager', employee_count: 2, avg_salary: 55000 }
    ],
    by_department: [
      { department_name: 'Engineering', employee_count: 3, avg_salary: 80000 },
      { department_name: 'HR', employee_count: 2, avg_salary: 55000 }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Return promises that don't resolve immediately
    axios.get.mockImplementation(() => new Promise(() => {}));
    render(<Insights />);
    expect(screen.getByText('Loading insights...')).toBeInTheDocument();
  });

  it('fetches countries and displays insights data', async () => {
    axios.get.mockImplementation((url) => {
      if (url === '/api/employees/insights/countries/') {
        return Promise.resolve({ data: mockCountries });
      }
      if (url === '/api/employees/insights/salary/') {
        return Promise.resolve({ data: mockInsightsData });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<Insights />);

    // Wait for the countries to load in dropdown
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'India' })).toBeInTheDocument();
    });

    // Check stats cards are rendered
    await waitFor(() => {
      expect(screen.getByText('Total Employees')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // Count
      expect(screen.getByText('$70000.00')).toBeInTheDocument(); // Avg
      expect(screen.getByText('$100000.00')).toBeInTheDocument(); // Max
      expect(screen.getByText('$40000.00')).toBeInTheDocument(); // Min
    });

    // Check chart titles
    expect(screen.getByText('Average Salary by Job Title')).toBeInTheDocument();
    expect(screen.getByText('Average Salary by Department')).toBeInTheDocument();
  });

  it('fetches new insights when a country is selected', async () => {
    const mockIndiaInsightsData = {
      overall_stats: {
        employee_count: 2,
        min_salary: 50000,
        max_salary: 60000,
        avg_salary: 55000
      },
      by_job_title: [],
      by_department: []
    };

    axios.get.mockImplementation((url) => {
      if (url === '/api/employees/insights/countries/') {
        return Promise.resolve({ data: mockCountries });
      }
      if (url === '/api/employees/insights/salary/') {
        return Promise.resolve({ data: mockInsightsData });
      }
      if (url === '/api/employees/insights/salary/?country=India') {
        return Promise.resolve({ data: mockIndiaInsightsData });
      }
      return Promise.reject(new Error('not found'));
    });

    render(<Insights />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // Initial count
    });

    // Change select to India
    const select = screen.getByLabelText(/Filter by Country/i);
    fireEvent.change(select, { target: { value: 'India' } });

    // Expect axios to have been called with country=India
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/employees/insights/salary/?country=India');
    });

    // Expect UI to update to India stats
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // India count
      expect(screen.getByText('$55000.00')).toBeInTheDocument(); // India avg
    });
  });
});
