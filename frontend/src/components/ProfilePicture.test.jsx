import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfilePicture from './ProfilePicture';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));

describe('ProfilePicture Component', () => {
  test('renders the profile picture if currentPicture is provided', () => {
    const mockPicture = '/path/to/mock-picture.jpg';
    render(<ProfilePicture currentPicture={mockPicture} />);

    const image = screen.getByAltText('Profile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPicture);
  });

});
