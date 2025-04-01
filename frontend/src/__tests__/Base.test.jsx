import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Base from '../components/Base';

// Mock the imported components
jest.mock('../components/Hero', () => () => <div data-testid="mock-hero">Hero Component</div>);
jest.mock('../components/VerticalFeatures', () => () => <div data-testid="mock-vertical-features">Vertical Features Component</div>);
jest.mock('../components/Footer', () => () => <div data-testid="mock-footer">Footer Component</div>);

describe('Base Component', () => {
  test('renders without crashing', () => {
    render(<Base />);
    // Basic smoke test to ensure the component renders without throwing
    expect(document.querySelector('.text-gray-600')).toBeInTheDocument();
  });

  test('renders Hero component', () => {
    render(<Base />);
    const heroComponent = screen.getByTestId('mock-hero');
    expect(heroComponent).toBeInTheDocument();
  });

  test('renders VerticalFeatures component', () => {
    render(<Base />);
    const verticalFeaturesComponent = screen.getByTestId('mock-vertical-features');
    expect(verticalFeaturesComponent).toBeInTheDocument();
  });

  test('renders Footer component', () => {
    render(<Base />);
    const footerComponent = screen.getByTestId('mock-footer');
    expect(footerComponent).toBeInTheDocument();
  });

  test('does not render Banner component (commented out)', () => {
    render(<Base />);
    // Since Banner is commented out in the code, we should verify it's not rendered
    expect(screen.queryByText('Banner Component')).not.toBeInTheDocument();
  });
});
