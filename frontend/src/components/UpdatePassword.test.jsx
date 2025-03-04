import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UpdatePassword from './UpdatePassword';
import '@testing-library/jest-dom';

// Mock the fetch function
global.fetch = jest.fn();

describe('UpdatePassword Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('shows error message if current password is not provided', () => {
    render(<UpdatePassword />);
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    expect(screen.getByText(/current password is required/i)).toBeInTheDocument();
  });

  test('shows error message if new password is not provided', () => {
    render(<UpdatePassword />);
    fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'currentPass123!' } });
    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
  });

  


});
