import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CenteredFooter from '../components/CenteredFooter';

describe('CenteredFooter Component', () => {
  const mockLogo = <div data-testid="mock-logo">Logo</div>;
  const mockIconList = <div data-testid="mock-icons">Icons</div>;
  const mockChildren = <li>Test Link</li>;

  test('renders without crashing', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  test('renders the logo correctly', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
  });

  test('renders the navigation links', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        <li>Link 1</li>
        <li>Link 2</li>
      </CenteredFooter>
    );
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  test('renders the icon list', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    expect(screen.getByTestId('mock-icons')).toBeInTheDocument();
  });

  test('renders the copyright with current year', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    const currentYear = new Date().getFullYear();
    expect(screen.getByText((content) => content.includes(`© Copyright ${currentYear} Zine`))).toBeInTheDocument();
  });

  test('applies correct styling classes to the container', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    const container = screen.getByText('Test Link').closest('div');
    expect(container).toHaveClass('text-center');
  });

  test('applies correct styling classes to the navbar', () => {
    render(
      <CenteredFooter logo={mockLogo} iconList={mockIconList}>
        {mockChildren}
      </CenteredFooter>
    );
    const navbar = screen.getByRole('list');
    expect(navbar).toHaveClass('navbar');
    expect(navbar).toHaveClass('mt-5');
    expect(navbar).toHaveClass('flex');
    expect(navbar).toHaveClass('flex-row');
    expect(navbar).toHaveClass('justify-center');
  });
});
