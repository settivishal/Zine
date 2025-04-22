// UpdatePassword.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdatePassword from '../components/UpdateUserCreds';
import { useAuth } from '../hooks/authcontext';
import { API_BASE_URL } from '../hooks/authcontext';

jest.mock('../hooks/authcontext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../components/Button', () => {
  return function MockButton({ children, onClick, disabled, type }) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} data-testid="button">
        {children}
      </button>
    );
  };
});

global.fetch = jest.fn();

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: 'mock-token' });
    fetch.mockReset();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Password updated successfully' }),
    });
  });

  test('renders the form correctly', () => {
    render(<UpdatePassword />);
    
    expect(screen.getByRole('textbox', { name: /User Email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Password/i })).toBeInTheDocument();
    expect(screen.getByText(/Password requirements:/i)).toBeInTheDocument();
  });

  test('updates input values when user types', () => {
    render(<UpdatePassword />);
    
    const emailInput = screen.getByRole('textbox', { name: /User Email/i });
    const currentPasswordInput = screen.getByLabelText(/Current Password/i);
    const newPasswordInput = screen.getByLabelText(/^New Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(currentPasswordInput, { target: { value: 'currentPass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPass123!' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(currentPasswordInput).toHaveValue('currentPass123');
    expect(newPasswordInput).toHaveValue('newPass123!');
    expect(confirmPasswordInput).toHaveValue('newPass123!');
  });

  test('shows error when current password is missing', async () => {
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(await screen.findByText(/Current password is required/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('shows error when new password is missing', async () => {
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPass123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(await screen.findByText(/New password is required/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('shows error when passwords do not match', async () => {
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'differentPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  test('submits form successfully with valid inputs', async () => {
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/change_password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify({
            Email: 'test@example.com',
            Password: 'currentPass123',
            New_Password: 'newPass123!'
          }),
        }
      );
    });
    
    expect(await screen.findByText(/Password updated successfully/i)).toBeInTheDocument();
    
    expect(screen.getByLabelText(/Current Password/i)).toHaveValue('');
    expect(screen.getByLabelText(/^New Password/i)).toHaveValue('');
    expect(screen.getByLabelText(/Confirm New Password/i)).toHaveValue('');
  });

  test('shows error message when API request fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid current password' }),
    });
    
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'wrongPass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(await screen.findByText(/Invalid current password/i)).toBeInTheDocument();
  });

  test('handles network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(await screen.findByText(/Failed to update password. Please try again./i)).toBeInTheDocument();
  });

  test('disables form during submission', async () => {
    fetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ({ message: 'Password updated successfully' }),
        });
      }, 100);
    }));
    
    render(<UpdatePassword />);
    
    fireEvent.change(screen.getByRole('textbox', { name: /User Email/i }), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Current Password/i), { target: { value: 'currentPass123' } });
    fireEvent.change(screen.getByLabelText(/^New Password/i), { target: { value: 'newPass123!' } });
    fireEvent.change(screen.getByLabelText(/Confirm New Password/i), { target: { value: 'newPass123!' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));
    
    expect(screen.getByText(/Updating.../i)).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /User Email/i })).toBeDisabled();
    expect(screen.getByLabelText(/Current Password/i)).toBeDisabled();
    expect(screen.getByLabelText(/^New Password/i)).toBeDisabled();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Update Password/i })).toBeInTheDocument();
    });
  });
});
