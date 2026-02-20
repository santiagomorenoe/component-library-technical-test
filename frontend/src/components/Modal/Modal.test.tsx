import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  children: <p>Modal content</p>,
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Modal', () => {
  it('is not rendered when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={jest.fn()}>Content</Modal>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when X button is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} header="Title" />);
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.click(screen.getByTestId('modal-container'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not close on overlay click when closeOnOverlay is false', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} closeOnOverlay={false} />);
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    const handleClose = jest.fn();
    render(<Modal {...defaultProps} onClose={handleClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders header content when provided', () => {
    render(<Modal {...defaultProps} header="My Modal Title" />);
    expect(screen.getByText('My Modal Title')).toBeInTheDocument();
  });

  it('renders footer content when provided', () => {
    render(
      <Modal {...defaultProps} footer={<button>Confirm</button>}>
        Content
      </Modal>
    );
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('does not render footer when not provided', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.queryByText('Confirm')).not.toBeInTheDocument();
  });

  it('applies small size class', () => {
    render(<Modal {...defaultProps} size="small" />);
    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-sm');
  });

  it('applies medium size class by default', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-lg');
  });

  it('applies large size class', () => {
    render(<Modal {...defaultProps} size="large" />);
    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-2xl');
  });

  it('has aria-modal attribute', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });
});
