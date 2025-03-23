import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '../components/Navbar';

// Mock ProfileDropdown to avoid testing its implementation
jest.mock('./ProfileDropDown', () => () => <div data-testid="profile-dropdown">Mock ProfileDropdown</div>);

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
});
