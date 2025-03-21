import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagsComponent from './Tags';

global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('TagsComponent', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.getItem.mockClear();
  });

  test('renders the component with initial state', () => {
    render(<TagsComponent />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByText('Create New Tag')).toBeInTheDocument();
  });

  test('shows input fields when "Create New Tag" is clicked', () => {
    render(<TagsComponent />);
    fireEvent.click(screen.getByText('Create New Tag'));
    expect(screen.getByPlaceholderText('Enter tag name')).toBeInTheDocument();
    expect(screen.getByText('Save Tag')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('hides input fields when "Cancel" is clicked', () => {
    render(<TagsComponent />);
    fireEvent.click(screen.getByText('Create New Tag'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Enter tag name')).not.toBeInTheDocument();
  });

  test('fetches tags when JWT token is available', async () => {
    localStorage.getItem.mockReturnValue('mock-jwt-token');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ text: 'Test Tag', color: '#ff0000' }],
    });

    render(<TagsComponent />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/tags', expect.any(Object));
      expect(screen.getByText('Test Tag')).toBeInTheDocument();
    });
  });

});
