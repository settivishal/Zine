import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUp from '../components/Signup';

// Mock the next/image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} />
}));

// Mock the GoogleLoginButton component
jest.mock('../components/GoogleLoginButton', () => ({
    __esModule: true,
    default: ({ setErrorMessage }) => (
        <button data-testid="google-login-button">Sign in with Google</button>
    )
}));

// Mock the API endpoint
global.fetch = jest.fn();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('SignUp Component', () => {
    const mockOnTabChange = jest.fn();

    beforeEach(() => {
        fetch.mockClear();
        mockOnTabChange.mockClear();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('renders signup form', () => {
        render(<SignUp onTabChange={mockOnTabChange} />);

        // Check form elements are rendered
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByText('Sign up')).toBeInTheDocument();
        expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
    });

    test('shows error when form is submitted with empty fields', () => {
        render(<SignUp onTabChange={mockOnTabChange} />);

        // Click signup button without filling in any fields
        fireEvent.click(screen.getByText('Sign up'));

        // Check error message
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter both email/username and password.');
    });

    test('shows error for invalid email format', () => {
        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill in form with invalid email
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Sign up'));

        // Check error message
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter a valid email address.');
    });

    test('shows error when passwords do not match', () => {
        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill in form with mismatched passwords
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'differentpassword' } });

        // Submit form
        fireEvent.click(screen.getByText('Sign up'));

        // Check error message
        expect(screen.getByTestId('error-message')).toHaveTextContent('Password does not match!');
    });

    test('submits the form successfully with valid data', async () => {
        // Mock successful API response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ message: 'Registration successful' })
        });

        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill in form with valid data
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Sign up'));

        // Check if API was called with correct data
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/consumer/register`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'testuser',
                        email: 'test@example.com',
                        password: 'password123'
                    })
                })
            );
        });

        // Check success message
        await waitFor(() => {
            expect(screen.getByTestId('success-message')).toHaveTextContent('Registration successful!');
        });

        // Check that tab change is triggered after delay
        jest.advanceTimersByTime(2000);
        expect(mockOnTabChange).toHaveBeenCalledWith('signin');
    });

    test('handles API error response', async () => {
        // Mock failed API response
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Email already exists' })
        });

        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill in form with valid data
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Sign up'));

        // Check error message from API
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Email already exists');
        });

        // Tab change should not be triggered
        jest.advanceTimersByTime(2000);
        expect(mockOnTabChange).not.toHaveBeenCalled();
    });

    test('handles network error during API call', async () => {
        // Mock network error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill in form with valid data
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Sign up'));

        // Check generic error message
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('An error occurred. Please try again.');
        });
    });

    test('closes error message when X button is clicked', () => {
        render(<SignUp onTabChange={mockOnTabChange} />);

        // Trigger an error
        fireEvent.click(screen.getByText('Sign up'));

        // Error message should be visible
        expect(screen.getByTestId('error-message')).toBeInTheDocument();

        // Click the X button
        fireEvent.click(screen.getByText('X'));

        // Error message should be gone
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    test('closes success message when X button is clicked', async () => {
        // Mock successful API response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ message: 'Registration successful' })
        });

        render(<SignUp onTabChange={mockOnTabChange} />);

        // Fill form and submit
        fireEvent.change(screen.getByPlaceholderText('Enter Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });

        fireEvent.click(screen.getByText('Sign up'));

        // Success message should appear
        await waitFor(() => {
            expect(screen.getByTestId('success-message')).toBeInTheDocument();
        });

        // Find the X button within success message and click it
        const closeButton = screen.getAllByText('X')[0]; // There might be multiple X buttons (error and success)
        fireEvent.click(closeButton);

        // Success message should be gone
        expect(screen.queryByTestId('success-message')).not.toBeInTheDocument();
    });
});
