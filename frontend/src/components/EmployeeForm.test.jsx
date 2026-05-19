import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EmployeeForm from './EmployeeForm';

describe('EmployeeForm Component', () => {
  it('renders all required form fields', () => {
    render(<EmployeeForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Joining Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submitted', async () => {
    const handleSubmit = vi.fn();
    render(<EmployeeForm onSubmit={handleSubmit} onCancel={vi.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/Salary/i), { target: { value: '60000' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'Canada' } });
    fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '1995-05-05' } });
    fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'Female' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByLabelText(/Joining Date/i), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'Active' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
        first_name: 'Jane',
        last_name: 'Smith',
        salary: '60000',
        country: 'Canada',
        date_of_birth: '1995-05-05',
        gender: 'Female',
        phone_number: '9876543210',
        joining_date: '2023-01-01',
        status: 'Active'
      }));
    });
  });
});
