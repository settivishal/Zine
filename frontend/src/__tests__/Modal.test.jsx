import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthModal from '../components/Modal';
import { useAuth } from '../hooks/authcontext';

// Mock the hooks and child components
jest.mock('../hooks/authcontext');
jest.mock('../components/Signin', () => () => <div data-testid="signin-component">Sign In Component</div>);
jest.mock('../components/Signup', () => ({ onTabChange }) => {
    // Mock implementation that allows testing the onTabChange callback
    return (
        <div data-testid="signup-component">
            Sign Up Component
            <button data-testid="simulate-registration" onClick={() => onTabChange('signin')}>
                Complete Registration
            </button>
        </div>
    );
});

describe('AuthModal Component', () => {
    beforeEach(() => {
        useAuth.mockReturnValue({ accessToken: null });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders nothing when isOpen is false', () => {
        const { container } = render(<AuthModal isOpen={false} onClose={() => { }} />);
        expect(container.firstChild).toBeNull();
    });

    test('renders modal when isOpen is true', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    test('shows sign in tab by default', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);
        expect(screen.getByTestId('signin-component')).toBeInTheDocument();
        expect(screen.queryByTestId('signup-component')).not.toBeInTheDocument();
    });

    test('switches to sign up tab when clicked', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);

        // Click the Sign Up tab
        fireEvent.click(screen.getByText('Sign Up'));

        // Now the signup component should be visible
        expect(screen.getByTestId('signup-component')).toBeInTheDocument();
        expect(screen.queryByTestId('signin-component')).not.toBeInTheDocument();
    });

    test('switches back to sign in tab when clicked', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);

        // First go to signup tab
        fireEvent.click(screen.getByText('Sign Up'));

        // Then go back to signin tab
        fireEvent.click(screen.getByText('Sign In'));

        // Signin component should be visible again
        expect(screen.getByTestId('signin-component')).toBeInTheDocument();
        expect(screen.queryByTestId('signup-component')).not.toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', () => {
        const mockOnClose = jest.fn();
        render(<AuthModal isOpen={true} onClose={mockOnClose} />);

        // Click the close button
        fireEvent.click(screen.getByText('❎'));

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('shows success message after registration', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);

        // Go to signup tab
        fireEvent.click(screen.getByText('Sign Up'));

        // Simulate successful registration by clicking the button in our mock
        fireEvent.click(screen.getByTestId('simulate-registration'));

        // Should show success message and be on signin tab
        expect(screen.getByText('Registration successful! Please sign in with your credentials.')).toBeInTheDocument();
        expect(screen.getByTestId('signin-component')).toBeInTheDocument();
    });

    test('success message is not shown by default', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);

        expect(screen.queryByText('Registration successful! Please sign in with your credentials.')).not.toBeInTheDocument();
    });

    test('success message is not shown when switching tabs manually', () => {
        render(<AuthModal isOpen={true} onClose={() => { }} />);

        // Go to signup tab
        fireEvent.click(screen.getByText('Sign Up'));

        // Go back to signin tab manually
        fireEvent.click(screen.getByText('Sign In'));

        // Success message should not be shown
        expect(screen.queryByText('Registration successful! Please sign in with your credentials.')).not.toBeInTheDocument();
    });
});
