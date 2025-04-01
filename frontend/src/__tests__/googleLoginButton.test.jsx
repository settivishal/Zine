import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleLoginButton from '../components/googleLoginButton';
import { handleGoogleLogin } from '../../helpers/handleGoogleLogin';

// Mock the handleGoogleLogin function
jest.mock('../../helpers/handleGoogleLogin');

describe('GoogleLoginButton', () => {
  beforeEach(() => {
    handleGoogleLogin.mockClear();
  });

  
  test('calls handleGoogleLogin when clicked', () => {
    render(<GoogleLoginButton />);
    
    const button = screen.getByRole('button', { name: /login with google/i });
    fireEvent.click(button);
    
    expect(handleGoogleLogin).toHaveBeenCalledTimes(1);
  });

  test('button is not disabled', () => {
    render(<GoogleLoginButton />);
    
    const button = screen.getByRole('button', { name: /login with google/i });
    expect(button).not.toBeDisabled();
  });
});
