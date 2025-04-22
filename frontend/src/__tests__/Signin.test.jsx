import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignIn from '../components/Signin';

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

// Mock window.location
const originalLocation = window.location;
delete window.location;
window.location = { href: '' };

// Mock the API endpoint
global.fetch = jest.fn();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
});

describe('SignIn Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        document.cookie = '';
        window.location.href = '';
        jest.clearAllMocks();
    });

    afterAll(() => {
        window.location = originalLocation;
    });

    test('renders signin form', () => {
        render(<SignIn />);

        // Check form elements are rendered
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Log in')).toBeInTheDocument();
        expect(screen.getByTestId('google-login-button')).toBeInTheDocument();
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    });

    test('shows error when form is submitted with empty fields', () => {
        render(<SignIn />);

        // Click login button without filling in any fields
        fireEvent.click(screen.getByText('Log in'));

        // Check error message
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter both email/username and password.');
    });

    test('shows error for invalid email format', () => {
        render(<SignIn />);

        // Fill in form with invalid email
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Log in'));

        // Check error message
        expect(screen.getByTestId('error-message')).toHaveTextContent('Please enter a valid email address.');
    });

    test('submits the form successfully with valid credentials', async () => {
        // Mock successful API response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                expires_at: '2023-12-31T23:59:59Z'
            })
        });

        render(<SignIn />);

        // Fill in form with valid data
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Log in'));

        // Check if API was called with correct data
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `${API_BASE_URL}/consumer/login`,
                expect.objectContaining({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'test@example.com',
                        password: 'password123'
                    })
                })
            );
        });

        // Check if cookies were set
        await waitFor(() => {
            expect(document.cookie).toContain('expires_at=2023-12-31T23:59:59Z');
        });

        // Check if redirect happened
        expect(window.location.href).toBe('/home');
    });

    test('handles API error response', async () => {
        // Mock failed API response
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Invalid credentials' })
        });

        render(<SignIn />);

        // Fill in form with valid data format
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });

        // Submit form
        fireEvent.click(screen.getByText('Log in'));

        // Check error message from API
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
        });

        // Check no redirect happened
        expect(window.location.href).not.toBe('/home');
    });

    test('handles network error during API call', async () => {
        // Mock network error
        fetch.mockRejectedValueOnce(new Error('Network error'));

        render(<SignIn />);

        // Fill in form with valid data
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Log in'));

        // Check generic error message
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('An error occurred. Please try again.');
        });
    });

    test('closes error message when X button is clicked', () => {
        render(<SignIn />);

        // Trigger an error
        fireEvent.click(screen.getByText('Log in'));

        // Error message should be visible
        expect(screen.getByTestId('error-message')).toBeInTheDocument();

        // Click the X button
        fireEvent.click(screen.getByText('X'));

        // Error message should be gone
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });

    test('updates email input when typed', () => {
        render(<SignIn />);

        // Type in email field
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });

        // Check if input value was updated
        expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com');
    });

    test('updates password input when typed', () => {
        render(<SignIn />);

        // Type in password field
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Check if input value was updated
        expect(screen.getByPlaceholderText('Password')).toHaveValue('password123');
    });

    test('navigates to forgot password page when link is clicked', () => {
        render(<SignIn />);

        // Get the forgot password link
        const forgotPasswordLink = screen.getByText('Forgot password?');

        // Check if the link points to the right URL
        expect(forgotPasswordLink).toHaveAttribute('href', '/forgot');
    });
});
