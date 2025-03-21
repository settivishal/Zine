import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileDropdown from './ProfileDropDown';
import '@testing-library/jest-dom';

// Mock the Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

describe('ProfileDropdown Component', () => {
  test('renders the profile image', () => {
    render(<ProfileDropdown />);
    const profileImage = screen.getByAltText('Profile');
    expect(profileImage).toBeInTheDocument();
  });

  test('toggles dropdown menu on click', () => {
    render(<ProfileDropDown />);
    const profileButton = screen.getByAltText('Profile');

    // Initially, dropdown should not be visible
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();

    // Click to open dropdown
    fireEvent.click(profileButton);
    expect(screen.getByText('Profile')).toBeInTheDocument();

    // Click again to close dropdown
    fireEvent.click(profileButton);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('renders all dropdown options', () => {
    render(<ProfileDropDown />);
    fireEvent.click(screen.getByAltText('Profile'));

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('closes dropdown after clicking an option', () => {
    render(<ProfileDropDown />);
    fireEvent.click(screen.getByAltText('Profile'));

    fireEvent.click(screen.getByText('Settings'));
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  test('navigates to profile page when Profile option is clicked', () => {
    delete window.location;
    window.location = { href: '' };

    render(<ProfileDropDown />);
    fireEvent.click(screen.getByAltText('Profile'));
    fireEvent.click(screen.getByText('Profile'));

    expect(window.location.href).toBe('/profile');
  });
});
