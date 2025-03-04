import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import UpdateUsername from './UpdateUsername';
import '@testing-library/jest-dom';

describe('UpdateUsername Component', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    mockOnUpdate.mockClear();
  });

  test('renders the component with the current username', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  test('shows input fields when "Edit" button is clicked', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(screen.getByPlaceholderText(/enter new username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('hides input fields when "Cancel" button is clicked', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(screen.queryByPlaceholderText(/enter new username/i)).not.toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('shows error message if username is empty', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter new username/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/username cannot be empty/i)).toBeInTheDocument();
  });

  test('does not call onUpdate if username is unchanged', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter new username/i), { target: { value: 'testuser' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('calls onUpdate with the new username and hides input fields after saving', () => {
    render(<UpdateUsername currentUsername="testuser" onUpdate={mockOnUpdate} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter new username/i), { target: { value: 'newuser' } });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    // Simulate API call delay
    setTimeout(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('newuser');
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
      expect(screen.queryByPlaceholderText(/enter new username/i)).not.toBeInTheDocument();
      expect(screen.getByText('newuser')).toBeInTheDocument();
    }, 0);
  });

  test('displays error message when update fails', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<UpdateUsername currentUsername="testuser" onUpdate={() => { throw new Error("Failed to update"); }} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter new username/i), { target: { value: 'newuser' } });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });

    // Simulate API call failure
    setTimeout(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining("Error updating username"));
      expect(screen.getByText(/failed to update username. please try again./i)).toBeInTheDocument();
      consoleErrorSpy.mockRestore();
    }, 0);
  });
});
