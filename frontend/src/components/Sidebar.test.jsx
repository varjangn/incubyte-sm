import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders the sidebar with correct links', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    const employeeLink = screen.getByText(/Employees/i);
    expect(employeeLink).toBeInTheDocument();
    
    const insightsLink = screen.getByText(/Insights/i);
    expect(insightsLink).toBeInTheDocument();
  });

  it('toggles the sidebar when the toggle button is clicked', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );

    const toggleButton = screen.getByRole('button', { name: /toggle sidebar/i });
    expect(toggleButton).toBeInTheDocument();
    
    // Initial state: not collapsed
    const sidebar = screen.getByRole('complementary'); // aside element
    expect(sidebar).not.toHaveClass('collapsed');

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(sidebar).toHaveClass('collapsed');

    // Click to expand
    fireEvent.click(toggleButton);
    expect(sidebar).not.toHaveClass('collapsed');
  });
});
