import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BlogList from '../components/BlogList';
import { useAuth } from '../hooks/authcontext';
import { useTags } from '../hooks/tagsContext';
import { useRouter } from 'next/navigation';

// Mock the hooks and modules
jest.mock('../hooks/authcontext');
jest.mock('../hooks/tagsContext');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next/image', () => ({ src, alt }) => <img src={src} alt={alt} />);

describe('BlogList Component', () => {
  const mockAccessToken = 'mock-token';
  const mockFetchTags = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: mockAccessToken });
    useTags.mockReturnValue({ tags: [], fetchTags: mockFetchTags });
    useRouter.mockReturnValue({ push: mockPush });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders BlogList component', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ blogs: {} }),
    });

    render(<BlogList />);
    
    expect(screen.getByText('Create New Blog')).toBeInTheDocument();
  });

  test('fetches blogs on mount', async () => {
    const mockBlogs = {
      '2025-03-31': { id: '1', title: 'Test Blog' },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ blogs: mockBlogs }),
    });

    render(<BlogList />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/blogs?page=1&limit=7',
        expect.any(Object)
      );
    });
  });

  test('creates a new blog when "Create New Blog" is clicked', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ blogs: {} }),
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ blog_url: '/blogs/new-blog' }),
    });

    render(<BlogList />);

    fireEvent.click(screen.getByText('Create New Blog'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/blog/create',
        expect.any(Object)
      );
    });
  });

  

  test('navigates to blog page when blog is clicked', async () => {
    const mockBlogs = {
      '2025-03-31': { id: '1', title: 'Test Blog' },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ blogs: mockBlogs }),
    });

    render(<BlogList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Test Blog'));
    });

    expect(mockPush).toHaveBeenCalledWith('/blogs/1');
  });
});
