import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders the sidebar with correct links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    const employeeLink = screen.getByText(/Managing Employees/i);
    expect(employeeLink).toBeInTheDocument();
    
    // Check if there's a second tab (placeholder, extensible)
    const secondTabLink = screen.getByText(/Second Tab/i);
    expect(secondTabLink).toBeInTheDocument();
  });
});
