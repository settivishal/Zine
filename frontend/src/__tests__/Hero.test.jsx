import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../components/Hero';
import { useAuth } from '../hooks/authcontext';

// Mock the imported components and hooks
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>
}));

jest.mock('../hooks/authcontext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../components/Button', () => {
  return function MockButton({ children, onClick }) {
    return <button onClick={onClick}>{children}</button>;
  };
});

jest.mock('../components/Section', () => {
  return function MockSection({ children }) {
    return <div data-testid="mock-section">{children}</div>;
  };
});

describe('Hero Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: null });
  });

  test('renders without crashing', () => {
    render(<Hero />);
    expect(screen.getByText('ZINE')).toBeInTheDocument();
  });

  test('renders logo image', () => {
    render(<Hero />);
    const logoImage = screen.getByAltText('Zine');
    expect(logoImage).toBeInTheDocument();
  });

  test('renders Home button', () => {
    render(<Hero />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('renders Sign in button when not authenticated', () => {
    render(<Hero />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  test('renders Profile button when authenticated', () => {
    useAuth.mockReturnValue({ accessToken: 'mock-token' });
    render(<Hero />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  test('renders correct title and description', () => {
    render(<Hero />);
    expect(screen.getByText('Per diem')).toBeInTheDocument();
    expect(screen.getByText('ZINE')).toBeInTheDocument();
    expect(screen.getByText('Write and publish your day-to-day experiences')).toBeInTheDocument();
  });

  test('applies correct styling to title', () => {
    render(<Hero />);
    const zineText = screen.getByText('ZINE');
    expect(zineText).toHaveClass('text-primary-500');
    expect(zineText).toHaveClass('font-bold');
    expect(zineText).toHaveClass('text-7xl');
  });
});
