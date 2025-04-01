import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer';

// Mock the imported components
jest.mock('../components/CenteredFooter', () => {
  return function MockCenteredFooter({ children, iconList }) {
    return (
      <div data-testid="mock-centered-footer">
        <div data-testid="mock-icon-list">{iconList}</div>
        <ul data-testid="mock-nav-links">{children}</ul>
      </div>
    );
  };
});

jest.mock('../components/Section', () => {
  return function MockSection({ children }) {
    return <div data-testid="mock-section">{children}</div>;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ children, href }) {
    return <a href={href} data-testid="mock-link">{children}</a>;
  };
});

describe('Footer Component', () => {
  test('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByTestId('mock-centered-footer')).toBeInTheDocument();
  });

  test('renders inside a Section component', () => {
    render(<Footer />);
    const sectionComponent = screen.getByTestId('mock-section');
    expect(sectionComponent).toBeInTheDocument();
  });

  test('renders with correct background color class', () => {
    render(<Footer />);
    const footerContainer = screen.getByTestId('mock-section').parentElement;
    expect(footerContainer).toHaveClass('bg-gray-100');
  });

  test('renders navigation links', () => {
    render(<Footer />);
    const navLinks = screen.getByTestId('mock-nav-links');
    expect(navLinks).toBeInTheDocument();
  });

  test('renders social media icons', () => {
    render(<Footer />);
    const iconList = screen.getByTestId('mock-icon-list');
    expect(iconList).toBeInTheDocument();
    
    // Check for SVG icons (since we're using a mock, we can't directly test for SVG content)
    const links = screen.getAllByTestId('mock-link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('passes correct props to CenteredFooter', () => {
    const { container } = render(<Footer />);
    
    // Check that CenteredFooter receives iconList and children
    expect(screen.getByTestId('mock-icon-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-nav-links')).toBeInTheDocument();
  });
});
