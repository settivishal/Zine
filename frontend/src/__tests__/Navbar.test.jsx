import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar_new';

// Mock ProfileDropdown to avoid testing its implementation
jest.mock('../components/ProfileDropDown', () => ({ Page }) => (
  <div data-testid="profile-dropdown" data-page={Page}>Mock ProfileDropdown</div>
));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

// Mock window.location.href assignment
const mockLocationAssign = jest.fn();
Object.defineProperty(window, 'location', {
  value: { href: mockLocationAssign }
});

describe('Navbar Component', () => {
  test('renders the Navbar component', () => {
    render(<Navbar />);
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('renders the ProfileDropdown component', () => {
    render(<Navbar />);
    const profileDropdown = screen.getByTestId('profile-dropdown');
    expect(profileDropdown).toBeInTheDocument();
  });

  // New tests below
  test('renders the logo image', () => {
    render(<Navbar />);
    const logoImage = screen.getByAltText('Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', '/zine.png');
  });

  test('navigates to home page when logo is clicked', () => {
    render(<Navbar />);
    const logoContainer = screen.getByAltText('Logo').closest('div');
    fireEvent.click(logoContainer);
    expect(window.location.href).toBe('/');
  });

  test('passes Page prop to ProfileDropdown', () => {
    const testPage = 'TestPage';
    render(<Navbar Page={testPage} />);
    const profileDropdown = screen.getByTestId('profile-dropdown');
    expect(profileDropdown).toHaveAttribute('data-page', testPage);
  });
});
