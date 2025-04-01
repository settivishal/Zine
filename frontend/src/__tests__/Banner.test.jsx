import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Banner from '../components/Banner';

// Mock the Section component
jest.mock('../components/Section', () => {
  return function MockSection({ children }) {
    return <div data-testid="mock-section">{children}</div>;
  };
});

describe('Banner Component', () => {
  test('renders the component with correct title and subtitle', () => {
    render(<Banner />);
    
    // Check if the title is rendered
    const title = screen.getByText('Lorem ipsum dolor sit amet consectetur adipisicing elit.');
    expect(title).toBeInTheDocument();
    
    // Check if the subtitle is rendered
    const subtitle = screen.getByText('Start your Free Trial.');
    expect(subtitle).toBeInTheDocument();
  });

  test('renders within a Section component', () => {
    render(<Banner />);
    
    // Check if the Section component is used
    const sectionComponent = screen.getByTestId('mock-section');
    expect(sectionComponent).toBeInTheDocument();
  });

});
