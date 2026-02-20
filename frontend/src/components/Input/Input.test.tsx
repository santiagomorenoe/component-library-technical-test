import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('renders without errors', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with a label and links it to the input', () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('applies default state border class', () => {
    render(<Input label="Name" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-300');
  });

  it('applies error state border class', () => {
    render(<Input label="Name" validationState="error" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('applies success state border class', () => {
    render(<Input label="Name" validationState="success" />);
    expect(screen.getByRole('textbox')).toHaveClass('border-green-500');
  });

  it('shows error message when validationState is error', () => {
    render(<Input validationState="error" errorMessage="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows success message when validationState is success', () => {
    render(<Input validationState="success" successMessage="Looks good!" />);
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });

  it('marks input as aria-invalid when error', () => {
    render(<Input validationState="error" label="Name" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled label="Name" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} label="Name" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders with type password', () => {
    render(<Input type="password" label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with type email', () => {
    render(<Input type="email" label="Email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('does not show helper text when validationState is default', () => {
    render(<Input validationState="default" errorMessage="Should not show" />);
    expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
  });

  it('uses provided id for label association', () => {
    render(<Input id="my-input" label="Custom ID" />);
    expect(screen.getByLabelText('Custom ID')).toHaveAttribute('id', 'my-input');
  });
});
