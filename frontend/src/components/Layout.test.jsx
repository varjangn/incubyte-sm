import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

describe('Layout Component', () => {
  it('renders the sidebar and a main content area', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="main-content">Test Content</div>
        </Layout>
      </BrowserRouter>
    );
    
    // Should contain the Sidebar (checked by looking for its link)
    expect(screen.getByText(/Employees/i)).toBeInTheDocument();
    
    // Should contain the children
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });
});
