import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateBio from './UpdateBio';

// Mock the fetch function
global.fetch = jest.fn();

describe('UpdateBio Component', () => {
  const mockCurrentBio = "This is my current bio.";

  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders current bio when not editing', () => {
    render(<UpdateBio currentBio={mockCurrentBio} />);
    expect(screen.getByText(mockCurrentBio)).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(<UpdateBio currentBio={mockCurrentBio} />);
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Tell us about yourself...')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('cancels editing and reverts to original bio', () => {
    render(<UpdateBio currentBio={mockCurrentBio} />);
    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByPlaceholderText('Tell us about yourself...');
    fireEvent.change(textarea, { target: { value: 'New bio text' } });
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByText(mockCurrentBio)).toBeInTheDocument();
  });

  test('submits new bio when Save is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Bio updated successfully' }),
    });

    render(<UpdateBio currentBio={mockCurrentBio} />);
    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByPlaceholderText('Tell us about yourself...');
    fireEvent.change(textarea, { target: { value: 'New bio text' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/bio', expect.any(Object));
    });
  });

  test('does not submit if bio is unchanged', async () => {
    render(<UpdateBio currentBio={mockCurrentBio} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save'));

    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText(mockCurrentBio)).toBeInTheDocument();
  });
});
