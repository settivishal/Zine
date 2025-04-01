import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VerticalFeatures, VerticalFeatureRow } from '../components/VerticalFeatures';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({   
    basePath: '/test-base-path'
  })
}));

// Mock the Section component
jest.mock('../components/Section', () => {
  return function MockSection({ children, title, description }) {
    return (
      <div data-testid="mock-section">
        <h2 data-testid="section-title">{title}</h2>
        <p data-testid="section-description">{description}</p>
        {children}
      </div>
    );
  };
});

describe('VerticalFeatureRow Component', () => {
  test('renders with correct title and description', () => {
    render(
      <VerticalFeatureRow
        title="Test Title"
        description="Test Description"
        image="/test-image.svg"
        imageAlt="Test Alt Text"
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders image with correct src and alt', () => {
    render(
      <VerticalFeatureRow
        title="Test Title"
        description="Test Description"
        image="/test-image.svg"
        imageAlt="Test Alt Text"
      />
    );
    
    const image = screen.getByAltText('Test Alt Text');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-base-path/test-image.svg');
  });

  test('applies reverse class when reverse prop is true', () => {
    const { container } = render(
      <VerticalFeatureRow
        title="Test Title"
        description="Test Description"
        image="/test-image.svg"
        imageAlt="Test Alt Text"
        reverse={true}
      />
    );
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex-row-reverse');
  });

  test('does not apply reverse class when reverse prop is false', () => {
    const { container } = render(
      <VerticalFeatureRow
        title="Test Title"
        description="Test Description"
        image="/test-image.svg"
        imageAlt="Test Alt Text"
        reverse={false}
      />
    );
    
    const mainDiv = container.firstChild;
    expect(mainDiv).not.toHaveClass('flex-row-reverse');
  });
});

describe('VerticalFeatures Component', () => {
  test('renders with correct background class', () => {
    const { container } = render(<VerticalFeatures />);
    expect(container.firstChild).toHaveClass('bg-gray-100');
  });

  test('renders Section with correct title and description', () => {
    render(<VerticalFeatures />);
    
    expect(screen.getByTestId('section-title')).toHaveTextContent('Our Features');
    expect(screen.getByTestId('section-description')).toHaveTextContent(
      'The Landing page will be improvised with more featured content on our website in the upcoming sprints.'
    );
  });

  test('renders three VerticalFeatureRow components', () => {
    render(<VerticalFeatures />);
    
    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.getByText('Profile Page')).toBeInTheDocument();
    expect(screen.getByText('Blog structure and features')).toBeInTheDocument();
  });

  test('passes correct props to each VerticalFeatureRow', () => {
    render(<VerticalFeatures />);
    
    // First feature row
    expect(screen.getByText('Demo of the Home page will be displayed here in the image on the left.')).toBeInTheDocument();
    expect(screen.getByAltText('First feature alt text')).toBeInTheDocument();
    
    // Second feature row
    expect(screen.getByText('Demo of the Profile page of the users will be displayed here in the image on the left.')).toBeInTheDocument();
    expect(screen.getByAltText('Second feature alt text')).toBeInTheDocument();
    
    // Third feature row
    expect(screen.getByText('Demo of the blog that opens from the home page calendar will be displayed here in the video on the left.')).toBeInTheDocument();
    expect(screen.getByAltText('Third feature alt text')).toBeInTheDocument();
  });
});
