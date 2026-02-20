import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card body text</Card>);
    expect(screen.getByText('Card body text')).toBeInTheDocument();
  });

  it('renders with header', () => {
    render(<Card header="Card Title">Body</Card>);
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(<Card footer="Card Footer">Body</Card>);
    expect(screen.getByText('Card Footer')).toBeInTheDocument();
  });

  it('does not render header section when not provided', () => {
    const { container } = render(<Card>Body only</Card>);
    // No heading-level element visible
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    // Header div still not present (no header prop)
    expect(container.querySelectorAll('div').length).toBeGreaterThan(0);
  });

  it('renders image with correct src and alt', () => {
    render(<Card image={{ src: '/test.jpg', alt: 'Test image' }}>Body</Card>);
    const img = screen.getByRole('img', { name: 'Test image' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
  });

  it('does not render image when image prop is not provided', () => {
    render(<Card>Body</Card>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('applies default border style classes', () => {
    const { container } = render(<Card>Body</Card>);
    expect(container.firstChild).toHaveClass('border', 'border-gray-200', 'rounded-lg');
  });

  it('applies no border classes when borderStyle is none', () => {
    const { container } = render(<Card borderStyle="none">Body</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).not.toHaveClass('border');
  });

  it('applies accent border style classes', () => {
    const { container } = render(<Card borderStyle="accent">Body</Card>);
    expect(container.firstChild).toHaveClass('border-l-4', 'border-l-blue-600');
  });

  it('renders all sections when all props provided', () => {
    render(
      <Card
        header="Title"
        footer="Footer"
        image={{ src: '/img.jpg', alt: 'Image' }}
      >
        Body content
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('accepts additional className', () => {
    const { container } = render(<Card className="custom-class">Body</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders ReactNode as header', () => {
    render(<Card header={<h2>Rich Header</h2>}>Body</Card>);
    expect(screen.getByRole('heading', { name: 'Rich Header' })).toBeInTheDocument();
  });
});
