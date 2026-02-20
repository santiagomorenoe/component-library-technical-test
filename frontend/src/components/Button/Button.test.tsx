import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import * as tracker from '@/lib/tracker';

jest.mock('@/lib/tracker');

const mockTrack = jest.mocked(tracker.track);

beforeEach(() => {
  mockTrack.mockResolvedValue(undefined);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });

  it('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'border-black');
  });

  it('applies danger variant classes', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is disabled and aria-busy when loading', () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders icon on the left by default', () => {
    const icon = <span data-testid="test-icon">★</span>;
    render(<Button icon={icon}>With Icon</Button>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders icon on the right when iconPosition is right', () => {
    const icon = <span data-testid="right-icon">→</span>;
    render(<Button icon={icon} iconPosition="right">With Icon</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies sm size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('applies lg size classes', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('fires mount tracking event on render', () => {
    render(<Button trackingName="TestButton">Click</Button>);
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({ componentName: 'TestButton', action: 'mount' })
    );
  });

  it('fires click tracking event on click', () => {
    render(<Button trackingName="TestButton">Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({ componentName: 'TestButton', action: 'click' })
    );
  });

  it('passes projectId to tracking events', () => {
    render(<Button trackingName="Btn" projectId="proj-1">Click</Button>);
    expect(mockTrack).toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'proj-1' })
    );
  });
});
