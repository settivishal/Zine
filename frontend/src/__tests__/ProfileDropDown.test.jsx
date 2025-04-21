// ProfileDropDown.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileDropDown from '../components/ProfileDropDown';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../hooks/authcontext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Mock the hooks
jest.mock('../hooks/useProfile');
jest.mock('../hooks/authcontext');

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock fetch API
global.fetch = jest.fn();

describe('ProfileDropDown Component', () => {
  const mockProfileImage = 'https://example.com/profile.jpg';
  
  beforeEach(() => {
    // Reset mocks
    useProfile.mockReturnValue({
      profileImage: mockProfileImage,
      loading: false,
      error: null
    });
    
    useAuth.mockReturnValue({
      accessToken: 'mock-token'
    });
    
    fetch.mockReset();
    fetch.mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue('Logout successful')
    });
    
    // Mock window.location
    delete window.location;
    window.location = { href: '' };
    
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'accessToken=mock-token',
    });
  });

  test('renders profile icon correctly', () => {
    render(<ProfileDropDown Page="Profile" />);
    
    const profileIcon = screen.getByAltText('Profile');
    expect(profileIcon).toBeInTheDocument();
    expect(profileIcon).toHaveAttribute('src', mockProfileImage);
  });


  test('toggles dropdown menu when profile icon is clicked', () => {
    render(<ProfileDropDown Page="Profile" />);
    
    // Dropdown should be hidden initially
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click profile icon
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Dropdown should be visible
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Click profile icon again
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Dropdown should be hidden
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('navigates to profile page when Profile option is clicked', () => {
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Profile option
    fireEvent.click(screen.getByText('Profile'));
    
    // Check navigation
    expect(window.location.href).toBe('/profile');
  });

  test('navigates to settings page when Settings option is clicked', () => {
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Settings option
    fireEvent.click(screen.getByText('Settings'));
    
    // Check navigation
    expect(window.location.href).toBe('/settings');
  });

  test('calls logout API and redirects when Logout option is clicked', async () => {
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Logout option
    fireEvent.click(screen.getByText('Logout'));
    
    // Check API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${API_BASE_URL}/consumer/logout`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token'
        }
      });
    });
    
    // Check cookie deletion and redirection
    expect(document.cookie).not.toContain('accessToken=mock-token');
    expect(window.location.href).toBe('/');
  });

  test('handles logout API failure', async () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock failed response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue('Unauthorized')
    });
    
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Logout option
    fireEvent.click(screen.getByText('Logout'));
    
    // Check error handling
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Logout failed:',
        401,
        'Unauthorized'
      );
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('handles network error during logout', async () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock network error
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Logout option
    fireEvent.click(screen.getByText('Logout'));
    
    // Check error handling
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error during logout:',
        expect.any(Error)
      );
    });
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  test('passes custom Page prop to first option', () => {
    render(<ProfileDropDown Page="Dashboard" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Check first option label
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('closes dropdown after option selection', () => {
    render(<ProfileDropDown Page="Profile" />);
    
    // Open dropdown
    fireEvent.click(screen.getByAltText('Profile'));
    
    // Click Help option (which doesn't navigate)
    fireEvent.click(screen.getByText('Help'));
    
    // Dropdown should be closed
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });
});
