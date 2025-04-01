import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Section from '../components/Section';

describe('Section Component', () => {
  test('renders without crashing', () => {
    render(<Section>Test content</Section>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders children correctly', () => {
    render(
      <Section>
        <div data-testid="test-child">Child element</div>
      </Section>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });


  test('renders title when provided', () => {
    render(<Section title="Test Title">Test content</Section>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<Section description="Test Description">Test content</Section>);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders both title and description when provided', () => {
    render(
      <Section title="Test Title" description="Test Description">
        Test content
      </Section>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('applies correct styling to title', () => {
    render(<Section title="Test Title">Test content</Section>);
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toHaveClass('text-4xl');
    expect(titleElement).toHaveClass('font-bold');
    expect(titleElement).toHaveClass('text-gray-900');
  });


  test('does not render title/description container when neither is provided', () => {
    const { container } = render(<Section>Test content</Section>);
    expect(container.querySelector('.mb-12.text-center')).not.toBeInTheDocument();
  });

});
