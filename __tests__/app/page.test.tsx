import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home page', () => {
  it('renders the app title', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /home goods manager/i })
    ).toBeInTheDocument();
  });

  it('renders sign in and sign up links', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/auth/login'
    );
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/auth/signup'
    );
  });
});
