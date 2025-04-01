// UpdateProfile.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateBio, UpdateAge, UpdateGender } from '../components/UpdateBio';
import { useAuth } from '../hooks/authcontext';
import axios from 'axios';

// Mock dependencies
jest.mock('axios');
jest.mock('../hooks/authcontext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../components/Button', () => {
  return function MockButton({ children, onClick, disabled }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid="button">
        {children}
      </button>
    );
  };
});

describe('UpdateBio Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: 'mock-token' });
    axios.post.mockReset();
    axios.post.mockResolvedValue({ status: 200, data: { message: 'Bio updated successfully' } });
  });

  test('renders with current bio', () => {
    render(<UpdateBio currentBio="This is my current bio" />);
    expect(screen.getByText('This is my current bio')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(<UpdateBio currentBio="This is my current bio" />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  

  test('returns to view mode without changes when Cancel is clicked', () => {
    render(<UpdateBio currentBio="This is my current bio" />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New updated bio' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    expect(screen.getByText('This is my current bio')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

});

describe('UpdateAge Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: 'mock-token' });
    axios.post.mockReset();
    axios.post.mockResolvedValue({ status: 200, data: { message: 'Age updated successfully' } });
  });

  test('renders with current age', () => {
    render(<UpdateAge currentAge={25} />);
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /✏️/i })).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(<UpdateAge currentAge={25} />);
    fireEvent.click(screen.getByRole('button', { name: /✏️/i }));
    
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });


  test('returns to view mode without changes when Cancel is clicked', () => {
    render(<UpdateAge currentAge={25} />);
    fireEvent.click(screen.getByRole('button', { name: /✏️/i }));
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '30' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });

});

describe('UpdateGender Component', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ accessToken: 'mock-token' });
    axios.post.mockReset();
    axios.post.mockResolvedValue({ status: 200, data: { message: 'Gender updated successfully' } });
  });

  test('renders with current gender', () => {
    render(<UpdateGender currentGender="Male" />);
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /✏️/i })).toBeInTheDocument();
  });

  test('switches to edit mode when Edit button is clicked', () => {
    render(<UpdateGender currentGender="Male" />);
    fireEvent.click(screen.getByRole('button', { name: /✏️/i }));
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });


  test('returns to view mode without changes when Cancel is clicked', () => {
    render(<UpdateGender currentGender="Male" />);
    fireEvent.click(screen.getByRole('button', { name: /✏️/i }));
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Female' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

});
