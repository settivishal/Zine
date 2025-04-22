import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter from '../components/Filter_new';
import { useTags } from '../hooks/tagsContext';

// Mock the tagsContext hook
jest.mock('../hooks/tagsContext');

describe('Filter Component', () => {
    const mockTags = [
        { ID: '1', text: 'React', color: '#61dafb' },
        { ID: '2', text: 'JavaScript', color: '#f7df1e' },
        { ID: '3', text: 'CSS', color: '#264de4' }
    ];

    const mockOnFilter = jest.fn();
    const mockOnClearFilters = jest.fn();

    beforeEach(() => {
        // Setup mock for useTags hook
        useTags.mockReturnValue({ tags: mockTags });

        // Clear mocks before each test
        mockOnFilter.mockClear();
        mockOnClearFilters.mockClear();
    });

    test('renders Filter button', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    test('opens popover when Filter button is clicked', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Click the filter button
        fireEvent.click(screen.getByText('Filter'));

        // Check if popover content is visible
        expect(screen.getByText('Filter Blogs by Tags')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('CSS')).toBeInTheDocument();
    });

    test('selects tags when clicked in popover', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select a tag
        fireEvent.click(screen.getByText('React'));

        // Apply filter
        fireEvent.click(screen.getByText('Apply'));

        // Check if onFilter callback was called with correct tag IDs
        expect(mockOnFilter).toHaveBeenCalledWith(['1']);
    });

    test('selects multiple tags', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select multiple tags
        fireEvent.click(screen.getByText('React'));
        fireEvent.click(screen.getByText('JavaScript'));

        // Apply filter
        fireEvent.click(screen.getByText('Apply'));

        // Check if onFilter callback was called with correct tag IDs
        expect(mockOnFilter).toHaveBeenCalledWith(['1', '2']);
    });

    test('deselects tags when clicked again', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select and then deselect a tag
        fireEvent.click(screen.getByText('React'));
        fireEvent.click(screen.getByText('JavaScript'));
        fireEvent.click(screen.getByText('React')); // Deselect React

        // Apply filter
        fireEvent.click(screen.getByText('Apply'));

        // Check if onFilter callback was called with correct tag IDs
        expect(mockOnFilter).toHaveBeenCalledWith(['2']);
    });

    test('shows active filter count on button', async () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select tags
        fireEvent.click(screen.getByText('React'));
        fireEvent.click(screen.getByText('JavaScript'));

        // Apply filters
        fireEvent.click(screen.getByText('Apply'));

        // Check if filter count is shown
        await waitFor(() => {
            expect(screen.getByText('Filter (2)')).toBeInTheDocument();
        });
    });

    test('shows Clear button when filters are active', async () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select a tag and apply
        fireEvent.click(screen.getByText('React'));
        fireEvent.click(screen.getByText('Apply'));

        // Check if Clear button appears
        await waitFor(() => {
            expect(screen.getByText('Clear')).toBeInTheDocument();
        });
    });

    test('clears all filters when Clear button is clicked', async () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select tags
        fireEvent.click(screen.getByText('React'));

        // Apply filters
        fireEvent.click(screen.getByText('Apply'));

        // Wait for the Clear button to appear and click it
        await waitFor(() => {
            fireEvent.click(screen.getByText('Clear'));
        });

        // Check if onClearFilters callback was called
        expect(mockOnClearFilters).toHaveBeenCalled();

        // Check if filter count is removed
        await waitFor(() => {
            expect(screen.queryByText('Filter (1)')).not.toBeInTheDocument();
            expect(screen.getByText('Filter')).toBeInTheDocument();
        });
    });

    test('clears selected tags in popover when Clear button inside popover is clicked', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Select tags
        fireEvent.click(screen.getByText('React'));
        fireEvent.click(screen.getByText('JavaScript'));

        // Click Clear button inside popover
        fireEvent.click(screen.getByText('Clear'));

        // Verify selected tags are cleared (by checking if Apply is disabled)
        const applyButton = screen.getByText('Apply');
        expect(applyButton).toBeDisabled();

        // Apply shouldn't be called yet since there are no tags selected
        expect(mockOnFilter).not.toHaveBeenCalled();
    });

    test('closes popover when Cancel button is clicked', async () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Check popover is open
        expect(screen.getByText('Filter Blogs by Tags')).toBeInTheDocument();

        // Click Cancel
        fireEvent.click(screen.getByText('Cancel'));

        // Check popover is closed - using waitFor to handle async popover closing
        await waitFor(() => {
            expect(screen.queryByText('Filter Blogs by Tags')).not.toBeInTheDocument();
        });
    });

    test('Apply button is disabled when no tags are selected', () => {
        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Apply button should be disabled initially
        const applyButton = screen.getByText('Apply');
        expect(applyButton).toBeDisabled();

        // Select a tag
        fireEvent.click(screen.getByText('React'));

        // Apply button should be enabled
        expect(applyButton).not.toBeDisabled();
    });

    test('renders empty state when no tags are available', () => {
        // Mock empty tags array
        useTags.mockReturnValue({ tags: [] });

        render(<Filter onFilter={mockOnFilter} onClearFilters={mockOnClearFilters} />);

        // Open filter popover
        fireEvent.click(screen.getByText('Filter'));

        // Check empty state message
        expect(screen.getByText('No tags available')).toBeInTheDocument();
    });
});
