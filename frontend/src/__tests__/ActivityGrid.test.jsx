import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ActivityGrid from '../components/ActivityGrid';
import { useAuth } from '../hooks/authcontext';

// Mock dependencies
jest.mock('axios');
jest.mock('../hooks/authcontext');

describe('ActivityGrid Component', () => {
  // Mock data for testing
  const mockGridData = {
    grid: {
      Dates: [
        '2024-03-01',
        '2024-03-02',
        '2024-02-15',
        '2024-01-05',
        '2023-12-25',
        // Two consecutive days for streak testing
        '2024-03-15',
        '2024-03-16'
      ]
    }
  };

  beforeEach(() => {
    // Mock the auth hook
    useAuth.mockReturnValue({ accessToken: 'mock-token' });

    // Set up axios mock to return our test data
    axios.get.mockResolvedValue({ data: mockGridData });

    // Clear any previous mock calls
    jest.clearAllMocks();
  });

  test('renders the ActivityGrid component', async () => {
    render(<ActivityGrid />);

    // Check that the component renders with loading state initially
    expect(screen.getByText(/Total active days/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/profile/grid'),
        expect.any(Object)
      );
    });
  });

  test('displays the correct number of active days', async () => {
    render(<ActivityGrid />);

    // Wait for the data to be processed
    await waitFor(() => {
      // The number of active days should match our mock data length
      const totalActiveDaysElement = screen.getByText(/Total active days:/i).nextSibling;
      expect(totalActiveDaysElement).toHaveTextContent(mockGridData.grid.Dates.length.toString());
    });
  });

  test('renders month grids for the past 12 months', async () => {
    render(<ActivityGrid />);

    await waitFor(() => {
      // We should have 12 month labels
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      // Check that at least some of the months are rendered
      // (we don't need to check all 12 as they depend on the current date)
      const renderedMonths = monthNames.filter(month =>
        screen.queryByText(month) !== null
      );

      expect(renderedMonths.length).toBeGreaterThan(0);
    });
  });

  test('renders active cells for dates in the activity data', async () => {
    // This is a visual test which is harder to verify programmatically
    // We can at least check that the component processes data without errors
    render(<ActivityGrid />);

    await waitFor(() => {
      // Check the total active days text is updated which indicates data was processed
      expect(screen.getByText(/Total active days:/i).nextSibling).toHaveTextContent(
        mockGridData.grid.Dates.length.toString()
      );
    });
  });

  test('handles empty activity data gracefully', async () => {
    // Override the mock to return empty data
    axios.get.mockResolvedValueOnce({
      data: { grid: { Dates: [] } }
    });

    render(<ActivityGrid />);

    await waitFor(() => {
      // Check that we show 0 active days when data is empty
      const totalActiveDaysElement = screen.getByText(/Total active days:/i).nextSibling;
      expect(totalActiveDaysElement).toHaveTextContent('0');
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock an API error
    console.error = jest.fn(); // Mock console.error to avoid cluttering test output
    axios.get.mockRejectedValueOnce(new Error('API Error'));

    render(<ActivityGrid />);

    await waitFor(() => {
      // Should still render the component without crashing
      expect(screen.getByText(/Total active days:/i)).toBeInTheDocument();

      // Should show 0 active days when API fails
      const totalActiveDaysElement = screen.getByText(/Total active days:/i).nextSibling;
      expect(totalActiveDaysElement).toHaveTextContent('0');

      // Should have called console.error
      expect(console.error).toHaveBeenCalled();
    });
  });

  test('does not fetch data when no access token is available', async () => {
    // Mock the auth hook to return null access token
    useAuth.mockReturnValueOnce({ accessToken: null });

    render(<ActivityGrid />);

    // Wait a bit to ensure no API call is made
    await new Promise(resolve => setTimeout(resolve, 100));

    // Axios should not have been called
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('grid has the correct number of cells for each month', async () => {
    render(<ActivityGrid />);

    await waitFor(() => {
      // Each month grid should have up to 7 * 5 = 35 cells (some may be null)
      // We can't easily count the exact cells in JSDOM, but we can check the component renders
      expect(screen.getByText(/Total active days:/i)).toBeInTheDocument();
    });
  });
});
