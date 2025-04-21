import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PublishBlog from '../components/PublishBlog';
import { useAuth } from '../hooks/authcontext';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../hooks/authcontext');

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

describe('PublishBlog Component', () => {
    const mockAccessToken = 'mock-access-token';
    const mockBlogData = {
        ID: '123',
        Users: ['existing@example.com', 'another@example.com']
    };

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Mock useAuth hook
        useAuth.mockReturnValue({ accessToken: mockAccessToken });

        // Default axios mock implementation
        axios.post.mockResolvedValue({ data: { success: true } });

        // Mock window.alert
        window.alert = jest.fn();
    });

    test('renders the Publish Blog button', () => {
        render(<PublishBlog blog_data={mockBlogData} />);
        expect(screen.getByText('Publish Blog')).toBeInTheDocument();
    });


    test('shows existing user emails when in private mode', () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Switch to Private tab
        fireEvent.click(screen.getByText('Private'));

        // Should display the existing emails as chips
        expect(screen.getByText('existing@example.com')).toBeInTheDocument();
        expect(screen.getByText('another@example.com')).toBeInTheDocument();
    });

    test('allows adding new email in private mode', () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Switch to Private tab
        fireEvent.click(screen.getByText('Private'));

        // Enter a new email and add it
        fireEvent.change(screen.getByLabelText('Add Email'), {
            target: { value: 'new@example.com' }
        });
        fireEvent.click(screen.getByText('Add'));

        // New email should appear as a chip
        expect(screen.getByText('new@example.com')).toBeInTheDocument();
    });

    test('prevents adding duplicate email', () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Switch to Private tab
        fireEvent.click(screen.getByText('Private'));

        // Try to add an existing email
        fireEvent.change(screen.getByLabelText('Add Email'), {
            target: { value: 'existing@example.com' }
        });
        fireEvent.click(screen.getByText('Add'));

        // Should show an alert
        expect(window.alert).toHaveBeenCalledWith('Email already exists or is empty!');
    });

    test('prevents adding empty email', () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Switch to Private tab
        fireEvent.click(screen.getByText('Private'));

        // Try to add an empty email
        fireEvent.change(screen.getByLabelText('Add Email'), {
            target: { value: '' }
        });

        // Add button should be disabled
        expect(screen.getByText('Add')).toBeDisabled();
    });


    test('submits with public visibility when in public mode', async () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Public tab should be selected by default

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

        // Check the API call
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${API_BASE_URL}/api/blog/change-visibility`,
                {
                    blog_id: '123',
                    is_public: true,
                    users: []
                },
                {
                    headers: {
                        'Authorization': `Bearer ${mockAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });

        // Should show success message
        expect(window.alert).toHaveBeenCalledWith('Blog visibility updated successfully!');
    });

    test('submits with private visibility and new emails', async () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Switch to Private tab
        fireEvent.click(screen.getByText('Private'));

        // Add a new email
        fireEvent.change(screen.getByLabelText('Add Email'), {
            target: { value: 'new@example.com' }
        });
        fireEvent.click(screen.getByText('Add'));

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

        // Check the API call
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                `${API_BASE_URL}/api/blog/change-visibility`,
                {
                    blog_id: '123',
                    is_public: false,
                    users: ['new@example.com']
                },
                {
                    headers: {
                        'Authorization': `Bearer ${mockAccessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        });

        // Should show success message
        expect(window.alert).toHaveBeenCalledWith('Blog visibility updated successfully!');
    });

    test('handles API error on submission', async () => {
        // Mock API error
        axios.post.mockRejectedValueOnce(new Error('API error'));

        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

        // Check error handling
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Failed to update blog visibility. Please try again.');
        });
    });

    test('closes dialog when cancel button is clicked', () => {
        render(<PublishBlog blog_data={mockBlogData} />);

        // Open the dialog
        fireEvent.click(screen.getByText('Publish Blog'));

        // Click cancel
        fireEvent.click(screen.getByText('Cancel'));

        // Dialog should close (components should not be visible)
        expect(screen.queryByText('Private')).not.toBeInTheDocument();
    });

});
