import React from 'react';
import { render, screen } from '@testing-library/react';
import ActivityGrid from './ActivityGrid';

describe('ActivityGrid Component', () => {
  const mockActivityData = [
    { date: '2024-03-01', count: 1 },
    { date: '2024-03-02', count: 2 },
    { date: '2024-02-15', count: 0 },
    { date: '2024-01-05', count: 4 },
    // Add more mock data as needed
  ];

  test('processes activity data and creates month grids', () => {
    render(<ActivityGrid activityData={mockActivityData} />);
    
    // Check if month grids are rendered
    const monthGrids = screen.getAllByText(/submissions in the past one year/i);
    expect(monthGrids.length).toBeGreaterThan(0); // Ensure at least one grid is rendered
  });

});
